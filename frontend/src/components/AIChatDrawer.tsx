import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Send,
  Square,
  Trash2,
  PlusCircle,
  X,
  Bot,
  User,
  Copy,
  Check,
  Code2,
  AlertCircle,
  HelpCircle,
  Wrench,
  Gauge,
  FileCode,
  Paperclip,
} from 'lucide-react';
import { useAIChat } from '../context/AIChatContext';

export const AIChatDrawer: React.FC = () => {
  const {
    isOpen,
    messages,
    isStreaming,
    workspaceContext,
    closeChat,
    sendMessage,
    abortGeneration,
    newChat,
    clearChat,
    setWorkspaceContext,
  } = useAIChat();

  const [inputQuery, setInputQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [includeWorkspaceCode, setIncludeWorkspaceCode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isStreaming]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputQuery.trim() || isStreaming) return;
    const ctx = includeWorkspaceCode ? workspaceContext : {};
    sendMessage(inputQuery, ctx);
    setInputQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const quickActionPrompts = [
    { label: 'Explain my code', icon: HelpCircle, prompt: 'Explain how my current code works step by step with Time & Space complexity analysis.' },
    { label: 'Find & fix bugs', icon: Wrench, prompt: 'Inspect my code for any logic errors, edge-case bugs, or compilation issues and provide the fixed code.' },
    { label: 'Optimize code', icon: Gauge, prompt: 'How can I optimize this code to run faster with lower memory usage?' },
    { label: 'Generate test cases', icon: FileCode, prompt: 'Generate 5 comprehensive test cases (with inputs, expected outputs, and edge cases) for this program.' },
  ];

  // Helper to render formatted markdown with code fences
  const renderMessageContent = (content: string, msgId: string) => {
    // Split by code blocks ```lang ... ```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
      <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed">
        {parts.map((part, index) => {
          if (part.startsWith('```')) {
            const match = part.match(/```([a-zA-Z+]*)\n([\s\S]*?)```/);
            const lang = match ? match[1] || 'code' : 'code';
            const codeBody = match ? match[2].trim() : part.slice(3, -3).trim();
            const codeBlockId = `${msgId}-${index}`;

            return (
              <div
                key={index}
                className="my-2 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 dark:bg-black/90 shadow-md"
              >
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/90 dark:bg-dark-800 border-b border-slate-700 text-[11px] text-slate-300 font-mono">
                  <span className="font-semibold text-emerald-400 uppercase">{lang}</span>
                  <button
                    onClick={() => handleCopyCode(codeBody, codeBlockId)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedCodeId === codeBlockId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 overflow-x-auto text-[11.5px] font-mono text-slate-200 leading-normal">
                  <code>{codeBody}</code>
                </pre>
              </div>
            );
          }

          // Format basic inline markdown (**bold**, `code`, bullet points)
          const lines = part.split('\n');
          return (
            <div key={index} className="space-y-1">
              {lines.map((line, lIdx) => {
                if (line.startsWith('### ')) {
                  return <h4 key={lIdx} className="font-bold text-emerald-400 text-sm mt-2">{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('## ')) {
                  return <h3 key={lIdx} className="font-bold text-white text-sm mt-2">{line.replace('## ', '')}</h3>;
                }
                if (line.startsWith('# ')) {
                  return <h2 key={lIdx} className="font-bold text-white text-base mt-2">{line.replace('# ', '')}</h2>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return (
                    <div key={lIdx} className="flex items-start gap-1.5 pl-1.5">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{renderInlineMarkdown(line.slice(2))}</span>
                    </div>
                  );
                }
                if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                return <p key={lIdx}>{renderInlineMarkdown(line)}</p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderInlineMarkdown = (text: string) => {
    // Process **bold** and `code`
    const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return tokens.map((token, idx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={idx} className="font-bold text-white">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 dark:bg-dark-800 text-emerald-300 font-mono text-[11px]">
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] md:w-[500px] flex flex-col bg-slate-900/95 dark:bg-dark-900/95 text-slate-100 shadow-2xl border-l border-slate-700/80 backdrop-blur-2xl animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/70 via-slate-900 to-dark-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Zap className="w-4 h-4 fill-emerald-400/30" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-sm">NVIDIA Nemotron AI</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                Nemotron 3.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Deep Reasoning & Coding Assistant</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={newChat}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="New Chat Session"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={closeChat}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
            title="Close Assistant (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Attached Context Pill (if workspace code exists) */}
      {workspaceContext?.code && (
        <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <Paperclip className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              Attached: <b className="text-white">{workspaceContext.fileName || `${workspaceContext.language || 'code'} file`}</b> ({workspaceContext.code.split('\n').length} lines)
            </span>
          </div>
          <button
            onClick={() => setIncludeWorkspaceCode(!includeWorkspaceCode)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              includeWorkspaceCode
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {includeWorkspaceCode ? 'Active' : 'Muted'}
          </button>
        </div>
      )}

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl max-w-[88%] shadow-md ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-500/20'
                  : 'bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.content ? (
                renderMessageContent(msg.content, msg.id)
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-xs py-1">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Nemotron is reasoning...</span>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Streaming Thinking Indicator */}
        {isStreaming && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 fill-emerald-400/50 text-emerald-400" />
              <span>Generating response via NVIDIA NIM...</span>
            </div>
            <button
              onClick={abortGeneration}
              className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[10px] flex items-center gap-1 transition-colors"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips (shown if conversation is short) */}
      {messages.length <= 3 && !isStreaming && (
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50">
          <p className="text-[10px] text-slate-400 mb-1.5 font-medium">Quick Prompts:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickActionPrompts.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => sendMessage(action.prompt, includeWorkspaceCode ? workspaceContext : {})}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <Icon className="w-3 h-3 text-emerald-400" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950">
        <div className="relative flex items-end gap-2 rounded-2xl bg-slate-900 border border-slate-700/80 p-2 focus-within:border-emerald-500/80 transition-colors shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputQuery}
            onChange={(e) => {
              setInputQuery(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nemotron anything... (Shift+Enter for newline)"
            className="flex-1 bg-transparent text-white text-xs sm:text-[13px] placeholder-slate-500 outline-none resize-none max-h-28 px-1 py-0.5 leading-relaxed"
          />

          <div className="flex items-center gap-1 shrink-0">
            {isStreaming ? (
              <button
                type="button"
                onClick={abortGeneration}
                className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputQuery.trim()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
          <span>Powered by NVIDIA NIM (Nemotron 3.5 Lightning 30B)</span>
          <span>Press Enter ↵ to send</span>
        </div>
      </div>
    </div>
  );
};
