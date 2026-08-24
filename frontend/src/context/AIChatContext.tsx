import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  ChatMessage,
  AIProviderMode,
  AIHealthStatus,
  OfflineModelState,
  CodeAttachment,
} from '../ai/types';
import { AIController } from '../ai/AIController';
import { AIAvailabilityManager } from '../ai/network/AIAvailabilityManager';
import { OfflineModelManager } from '../ai/offline/OfflineModelManager';

const CHAT_STORAGE_KEY = 'codevault_ai_chat_history_v2';

interface AIChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleChat: () => void;
  isGenerating: boolean;
  providerMode: AIProviderMode;
  setProviderMode: (mode: AIProviderMode) => void;
  healthStatus: AIHealthStatus;
  offlineState: OfflineModelState;
  activeAttachment: CodeAttachment | null;
  setActiveAttachment: (attachment: CodeAttachment | null) => void;
  sendMessage: (content: string, customAttachment?: CodeAttachment) => Promise<void>;
  stopGeneration: () => void;
  clearHistory: () => void;
  downloadOfflineAI: () => Promise<void>;
  removeOfflineAI: () => Promise<void>;
  testOfflineAI: () => Promise<string>;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [providerMode, setProviderModeState] = useState<AIProviderMode>('auto');
  const [healthStatus, setHealthStatus] = useState<AIHealthStatus>('ONLINE_CHECKING');
  const [offlineState, setOfflineState] = useState<OfflineModelState>(
    OfflineModelManager.getInstance().getState()
  );
  const [activeAttachment, setActiveAttachment] = useState<CodeAttachment | null>(null);

  const controller = useRef(AIController.getInstance()).current;
  const availabilityManager = useRef(AIAvailabilityManager.getInstance()).current;
  const offlineManager = useRef(OfflineModelManager.getInstance()).current;

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore quota errors
    }
  }, [messages]);

  // Subscribe to health and offline state updates
  useEffect(() => {
    const unsubHealth = availabilityManager.subscribe((st) => setHealthStatus(st));
    const unsubOffline = offlineManager.subscribe((st) => setOfflineState(st));
    return () => {
      unsubHealth();
      unsubOffline();
    };
  }, [availabilityManager, offlineManager]);

  const setProviderMode = (mode: AIProviderMode) => {
    setProviderModeState(mode);
    controller.setMode(mode);
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  const sendMessage = useCallback(
    async (content: string, customAttachment?: CodeAttachment) => {
      if (!content.trim() || isGenerating) return;

      const attachment = customAttachment || activeAttachment;
      const userMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        role: 'user',
        content,
        attachments: attachment ? [attachment] : undefined,
        createdAt: Date.now(),
      };

      const assistantMsgId = 'msg_' + (Date.now() + 1) + '_' + Math.random().toString(36).substring(2, 6);
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsGenerating(true);

      // Extract code context from attachment if present
      let activeCode: string | undefined = undefined;
      let language: string | undefined = undefined;
      let lastError: string | undefined = undefined;

      if (attachment) {
        if (attachment.type === 'code') {
          activeCode = attachment.content;
          language = attachment.language;
        } else if (attachment.type === 'error') {
          lastError = attachment.content;
        }
      }

      try {
        let fullReply = '';
        let resolvedProvider: 'nemotron' | 'offline' = 'nemotron';

        for await (const chunk of controller.sendMessage({
          messages: [...messages, userMsg],
          activeCode,
          language,
          lastError,
        })) {
          fullReply += chunk.token;
          resolvedProvider = chunk.provider;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: fullReply,
                    provider: resolvedProvider,
                  }
                : msg
            )
          );
        }
      } catch (err: any) {
        console.error('[CodeVault AI Error]', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    `⚠️ **CodeVault AI Notice**: ${err?.message || 'Unable to complete request. Please verify connection or offline AI status.'}`,
                  isError: true,
                }
              : msg
          )
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [messages, isGenerating, activeAttachment, controller]
  );

  const stopGeneration = () => {
    controller.stopGeneration();
    setIsGenerating(false);
  };

  const downloadOfflineAI = async () => {
    await offlineManager.downloadModel();
  };

  const removeOfflineAI = async () => {
    await offlineManager.removeModel();
  };

  const testOfflineAI = async () => {
    return await offlineManager.testOfflineAI();
  };

  return (
    <AIChatContext.Provider
      value={{
        messages,
        isOpen,
        setIsOpen,
        toggleChat,
        isGenerating,
        providerMode,
        setProviderMode,
        healthStatus,
        offlineState,
        activeAttachment,
        setActiveAttachment,
        sendMessage,
        stopGeneration,
        clearHistory,
        downloadOfflineAI,
        removeOfflineAI,
        testOfflineAI,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
