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

export interface WorkspaceContext {
  fileName?: string;
  code?: string;
  language?: string;
  selectedCode?: string;
  compilerError?: string;
  compilerOutput?: string;
}

interface AIChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleChat: () => void;
  openChat: (initialPrompt?: string, customContext?: Partial<WorkspaceContext>) => void;
  closeChat: () => void;
  isGenerating: boolean;
  isStreaming: boolean;
  providerMode: AIProviderMode;
  setProviderMode: (mode: AIProviderMode) => void;
  healthStatus: AIHealthStatus;
  offlineState: OfflineModelState;
  activeAttachment: CodeAttachment | null;
  setActiveAttachment: (attachment: CodeAttachment | null) => void;
  workspaceContext: WorkspaceContext;
  setWorkspaceContext: (ctx: Partial<WorkspaceContext>) => void;
  askAboutSelection: (selectedCodeOrAction: string, action?: string) => void;
  sendMessage: (content: string, customAttachment?: CodeAttachment) => Promise<void>;
  stopGeneration: () => void;
  abortGeneration: () => void;
  clearHistory: () => void;
  clearChat: () => void;
  newChat: () => void;
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
  const [workspaceContext, setWorkspaceContextState] = useState<WorkspaceContext>({});

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

  const setProviderMode = useCallback((mode: AIProviderMode) => {
    setProviderModeState(mode);
    controller.setMode(mode);
  }, [controller]);

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const setWorkspaceContext = useCallback((ctx: Partial<WorkspaceContext>) => {
    setWorkspaceContextState((prev) => ({ ...prev, ...ctx }));
  }, []);

  const openChat = useCallback((initialPrompt?: string, customContext?: Partial<WorkspaceContext>) => {
    if (customContext?.code) {
      setActiveAttachment({
        type: 'code',
        title: `${customContext.language?.toUpperCase() || 'CODE'} Snippet`,
        content: customContext.code,
        language: customContext.language,
      });
    }
    setIsOpen(true);
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  const sendMessage = useCallback(
    async (content: string, customAttachment?: CodeAttachment) => {
      if (!content.trim() || isGenerating) return;

      const attachment = customAttachment || activeAttachment || undefined;
      const userMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        role: 'user',
        content,
        timestamp: Date.now(),
        attachment,
      };

      const assistantMsgId = 'msg_' + (Date.now() + 1) + '_' + Math.random().toString(36).substring(2, 6);
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsGenerating(true);

      const historyToSend = messages.slice(-10);

      try {
        const stream = controller.sendMessage({
          messages: [...historyToSend, userMsg],
          activeCode: attachment?.content || workspaceContext.code,
          language: attachment?.language || workspaceContext.language,
          lastError: workspaceContext.compilerError,
        });

        for await (const chunk of stream) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: m.content + chunk.token,
                    provider: chunk.provider,
                    isStreaming: true,
                  }
                : m
            )
          );
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, isStreaming: false } : m))
        );
      } catch (err: any) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content:
                    m.content.trim().length > 0
                      ? m.content + `\n\n*(Error: ${err.message})*`
                      : `Sorry, I encountered an error: ${err.message}. Please check your connection or switch AI provider modes in settings.`,
                  isStreaming: false,
                  isError: true,
                }
              : m
          )
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [messages, isGenerating, activeAttachment, workspaceContext, controller]
  );

  const askAboutSelection = useCallback(
    (selectedCodeOrAction: string, action?: string) => {
      let selectedText = '';
      let targetAction = '';

      if (action) {
        selectedText = selectedCodeOrAction;
        targetAction = action;
      } else {
        selectedText = workspaceContext.selectedCode || workspaceContext.code || '';
        targetAction = selectedCodeOrAction;
      }

      if (!selectedText) {
        openChat('How can I help you with your code?');
        return;
      }

      let prompt = '';
      switch (targetAction) {
        case 'explain':
          prompt = `Explain this ${workspaceContext.language || 'code'} snippet line by line:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'fix':
          prompt = `Find any bugs, syntax errors, or logical flaws in this code and suggest a fix:\n\`\`\`\n${selectedText}\n\`\`\`\n${
            workspaceContext.compilerError ? `Compiler Error: ${workspaceContext.compilerError}` : ''
          }`;
          break;
        case 'optimize':
          prompt = `How can I optimize the performance and readability of this code?\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'comments':
          prompt = `Add clean explanatory comments to this code:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'complexity':
          prompt = `Analyze the Time Complexity and Space Complexity (Big-O) of this algorithm with detailed justification:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'tests':
          prompt = `Generate comprehensive edge-case test cases (inputs and expected outputs) for this code:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        default:
          prompt = `Analyze this code snippet:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
      }

      openChat(prompt, { code: selectedText, language: workspaceContext.language });
    },
    [workspaceContext]
  );

  const stopGeneration = useCallback(() => {
    controller.stopGeneration();
    setIsGenerating(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
  }, [controller]);

  const downloadOfflineAI = useCallback(async () => {
    await offlineManager.downloadModel();
  }, [offlineManager]);

  const removeOfflineAI = useCallback(async () => {
    await offlineManager.removeModel();
  }, [offlineManager]);

  const testOfflineAI = useCallback(async () => {
    return await offlineManager.testOfflineAI();
  }, [offlineManager]);

  return (
    <AIChatContext.Provider
      value={{
        messages,
        isOpen,
        setIsOpen,
        toggleChat,
        openChat,
        closeChat,
        isGenerating,
        isStreaming: isGenerating,
        providerMode,
        setProviderMode,
        healthStatus,
        offlineState,
        activeAttachment,
        setActiveAttachment,
        workspaceContext,
        setWorkspaceContext,
        askAboutSelection,
        sendMessage,
        stopGeneration,
        abortGeneration: stopGeneration,
        clearHistory,
        clearChat: clearHistory,
        newChat: clearHistory,
        downloadOfflineAI,
        removeOfflineAI,
        testOfflineAI,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = (): AIChatContextType => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
