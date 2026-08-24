import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
<<<<<<< HEAD
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
=======
import { API_BASE_URL } from '../services/api';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface WorkspaceContext {
  fileName?: string;
  code?: string;
  language?: string;
  selectedCode?: string;
  compilerError?: string;
  compilerOutput?: string;
}

interface AIChatContextType {
  isOpen: boolean;
  messages: AIChatMessage[];
  isStreaming: boolean;
  workspaceContext: WorkspaceContext;
  openChat: (initialPrompt?: string, customContext?: Partial<WorkspaceContext>) => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (prompt: string, customContext?: Partial<WorkspaceContext>) => Promise<void>;
  abortGeneration: () => void;
  newChat: () => void;
  clearChat: () => void;
  setWorkspaceContext: (ctx: Partial<WorkspaceContext>) => void;
  askAboutSelection: (
    selectedText: string,
    action: 'explain' | 'fix' | 'optimize' | 'comments' | 'tests'
  ) => void;
}

const STORAGE_KEY = 'codevault_ai_chat_history_v2';

const INITIAL_GREETING: AIChatMessage = {
  id: 'greeting-1',
  role: 'assistant',
  content: `Hello! I'm **CodeVault AI**, your AI Computer Science tutor and coding assistant.

I can help you:
- 🔍 **Explain code** and break down algorithms step-by-step
- 🐛 **Debug errors** and fix compilation / runtime issues
- ⚡ **Analyze Big-O complexity** and optimize data structures
- 🧪 **Generate edge-case test cases**

How can I help you with your code today?`,
  timestamp: Date.now(),
};

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [INITIAL_GREETING];
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const [workspaceContext, setWorkspaceContextState] = useState<WorkspaceContext>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSendTimeRef = useRef<number>(0);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  const setWorkspaceContext = useCallback((ctx: Partial<WorkspaceContext>) => {
    setWorkspaceContextState((prev) => ({ ...prev, ...ctx }));
  }, []);

  const openChat = useCallback((initialPrompt?: string, customContext?: Partial<WorkspaceContext>) => {
    setIsOpen(true);
    if (customContext) {
      setWorkspaceContextState((prev) => ({ ...prev, ...customContext }));
    }
    if (initialPrompt) {
      setTimeout(() => {
        sendMessage(initialPrompt, customContext);
      }, 50);
    }
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const abortGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
    );
  }, []);

  const newChat = useCallback(() => {
    abortGeneration();
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        role: 'assistant',
        content: `Started a new session with **CodeVault AI**! What coding challenge or algorithm would you like to work on?`,
        timestamp: Date.now(),
      },
    ]);
  }, [abortGeneration]);

  const clearChat = useCallback(() => {
    abortGeneration();
    setMessages([INITIAL_GREETING]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }, [abortGeneration]);

  const sendMessage = useCallback(
    async (promptText: string, customContext?: Partial<WorkspaceContext>) => {
      const now = Date.now();
      // Debounce protection against rapid double-clicks (<400ms)
      if (now - lastSendTimeRef.current < 400 || isStreaming) return;
      if (!promptText.trim()) return;

      lastSendTimeRef.current = now;

      const activeCtx = { ...workspaceContext, ...customContext };
      const userMessage: AIChatMessage = {
        id: `user-${now}`,
        role: 'user',
        content: promptText,
        timestamp: now,
      };

      const assistantMessageId = `assistant-${now + 1}`;
      const assistantPlaceholder: AIChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: now + 1,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const historyPayload = messages
        .filter((m) => !m.isError && (m.role === 'user' || m.role === 'assistant'))
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      historyPayload.push({ role: 'user', content: promptText });

      let codeContext = activeCtx.selectedCode || activeCtx.code;
      let fullPromptContext = '';
      if (activeCtx.compilerError) {
        fullPromptContext += `\n[Compiler Error / Output]:\n${activeCtx.compilerError}\n`;
      }

      const streamEndpoint = `${API_BASE_URL}/api/ai/chat/stream`;

      try {
        const response = await fetch(streamEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: historyPayload,
            source_code: codeContext,
            language: activeCtx.language || 'c',
            context: fullPromptContext,
          }),
          signal: controller.signal,
        });

        // 1. Rate Limit Error Handling
        if (response.status === 429) {
          const errData = await response.json().catch(() => ({}));
          const rateMsg = errData.message || "You're sending messages too quickly. Please wait a moment and try again.";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: `⏳ **Rate Limit**: ${rateMsg}`, isStreaming: false, isError: true }
                : msg
            )
          );
          return;
        }

        // 2. Client Bad Request (e.g. message too large)
        if (response.status === 400) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.message || 'Your message or code is too large. Please shorten it.';
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: `⚠️ ${errMsg}`, isStreaming: false, isError: true }
                : msg
            )
          );
          return;
        }

        // 3. Fallback to standard endpoint if streaming response stream is missing
        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulated = '';
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.token) {
                    accumulated += data.token;
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: accumulated, isStreaming: true }
                          : msg
                      )
                    );
                  }
                } catch (e) {}
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulated || 'No response generated.', isStreaming: false }
              : msg
          )
        );
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('[CodeVault AI] Chat generation stopped by user.');
        } else {
          console.error('[CodeVault AI] Stream failed, attempting standard API fallback:', err);
          try {
            const fallbackRes = await fetch(`${API_BASE_URL}/api/ai/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: historyPayload,
                source_code: codeContext,
                language: activeCtx.language || 'c',
              }),
            });

            if (fallbackRes.status === 429) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        content: "⏳ **Rate Limit**: You're sending messages too quickly. Please wait a moment and try again.",
                        isStreaming: false,
                        isError: true,
                      }
                    : msg
                )
              );
              return;
            }

            const data = await fallbackRes.json();
            const reply = data.response || data.explanation || 'CodeVault AI analyzed your request.';
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: reply, isStreaming: false }
                  : msg
              )
            );
          } catch (fallbackErr) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content:
                        '⚠️ **CodeVault AI is temporarily unavailable.** Please try again in a moment.',
                      isStreaming: false,
                      isError: true,
                    }
                  : msg
              )
            );
          }
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, workspaceContext]
  );

  const askAboutSelection = useCallback(
    (
      selectedText: string,
      action: 'explain' | 'fix' | 'optimize' | 'comments' | 'tests'
    ) => {
      let prompt = '';
      switch (action) {
        case 'explain':
          prompt = `Explain what this specific block of code does:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'fix':
          prompt = `Find any bugs or potential issues in this code snippet and provide the corrected version:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'optimize':
          prompt = `How can I optimize the time and space complexity of this code?\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'comments':
          prompt = `Add clean, educational comments explaining every key line of this code:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'tests':
          prompt = `Generate comprehensive edge-case test cases (inputs and expected outputs) for this code:\n\`\`\`\n${selectedText}\n\`\`\``;
          break;
      }

      openChat(prompt, { selectedCode: selectedText });
    },
    [openChat]
  );
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f

  return (
    <AIChatContext.Provider
      value={{
<<<<<<< HEAD
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
=======
        isOpen,
        messages,
        isStreaming,
        workspaceContext,
        openChat,
        closeChat,
        toggleChat,
        sendMessage,
        abortGeneration,
        newChat,
        clearChat,
        setWorkspaceContext,
        askAboutSelection,
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

<<<<<<< HEAD
export const useAIChat = () => {
=======
export const useAIChat = (): AIChatContextType => {
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
