import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../services/api';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
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

const STORAGE_KEY = 'codevault_nemotron_chat_history_v1';

const INITIAL_GREETING: AIChatMessage = {
  id: 'greeting-1',
  role: 'assistant',
  content: `Hello! I'm **NVIDIA Nemotron 3.5**, your AI Computer Science tutor and coding assistant.

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
        content: `Started a new chat session with **NVIDIA Nemotron 3.5**! What would you like to build or debug?`,
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
      if (!promptText.trim() || isStreaming) return;

      const activeCtx = { ...workspaceContext, ...customContext };
      const userMessage: AIChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: promptText,
        timestamp: Date.now(),
      };

      const assistantMessageId = `assistant-${Date.now() + 1}`;
      const assistantPlaceholder: AIChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now() + 1,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const historyPayload = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      historyPayload.push({ role: 'user', content: promptText });

      let codeContext = activeCtx.selectedCode || activeCtx.code;
      let fullPromptContext = '';
      if (activeCtx.compilerError) {
        fullPromptContext += `\n[Compiler Error / Output]:\n${activeCtx.compilerError}\n`;
      }

      try {
        const streamEndpoint = `${API_BASE_URL}/api/ai/chat/stream`;
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

        if (!response.ok || !response.body) {
          // Fallback to standard endpoint
          throw new Error('Streaming failed, falling back to standard endpoint');
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
          console.log('[Nemotron] Chat generation aborted by user.');
        } else {
          console.error('[Nemotron] Streaming error, attempting standard API:', err);
          // Standard API fallback
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
            const data = await fallbackRes.json();
            const reply = data.response || data.explanation || 'Analyzed request successfully.';
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
                        '⚠️ **Unable to contact NVIDIA Nemotron.** Please verify your network connection and try again.',
                      isStreaming: false,
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

  return (
    <AIChatContext.Provider
      value={{
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
