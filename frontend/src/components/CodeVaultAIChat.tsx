import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  Square,
  Trash2,
  Copy,
  Check,
  Code2,
  WifiOff,
  Wifi,
  ChevronDown,
  Bot,
  User,
  AlertCircle,
} from 'lucide-react';
import { useAIChat } from '../context/AIChatContext';
import { ChatMessage } from '../ai/types';

/* ─────────────────────────────────────────────
   Syntax-highlighted code block with copy button
───────────────────────────────────────────── */
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] my-2 group">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/60 text-xs text-slate-400 font-mono">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors px-1.5 py-0.5 rounded hover:bg-slate-700/60"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-slate-200 font-mono whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Parses markdown into rendered segments
───────────────────────────────────────────── */
const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  // Split on fenced code blocks
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return (
    <div className="text-sm leading-relaxed break-words">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.slice(3).split('\n');
          const lang = lines[0].trim();
          const code = lines.slice(1).join('\n').replace(/```$/, '').trim();
          return <CodeBlock key={i} code={code} language={lang || undefined} />;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="px-1.5 py-0.5 rounded bg-slate-700/50 text-emerald-300 font-mono text-xs">
              {part.slice(1, -1)}
            </code>
          );
        }
        // Render bold, newlines
        return (
          <span key={i}>
            {part.split('\n').map((line, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {line.split(/(\*\*[^*]+\*\*)/g).map((seg, si) =>
                  seg.startsWith('**') && seg.endsWith('**') ? (
                    <strong key={si} className="font-semibold text-white">{seg.slice(2, -2)}</strong>
                  ) : (
                    <span key={si}>{seg}</span>
                  )
                )}
              </React.Fragment>
            ))}
          </span>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Individual chat message bubble
───────────────────────────────────────────── */
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-3`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
            : 'bg-gradient-to-br from-blue-600 to-cyan-500'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
          isUser
            ? 'bg-indigo-600/80 text-white rounded-tr-sm'
            : message.isError
            ? 'bg-red-900/40 border border-red-500/30 text-red-200 rounded-tl-sm'
            : 'bg-slate-800/70 text-slate-100 border border-slate-700/40 rounded-tl-sm'
        }`}
      >
        {/* Attachment badge */}
        {message.attachment && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-400">
            <Code2 className="w-3 h-3" />
            <span className="font-mono truncate max-w-[180px]">{message.attachment.title}</span>
          </div>
        )}

        {message.isStreaming && !message.content ? (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-1 text-blue-300 text-xs">CodeVault AI is thinking...</span>
          </div>
        ) : (
          <>
            {message.isError && (
              <div className="flex items-center gap-1.5 mb-1.5 text-red-400 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>AI temporarily unavailable</span>
              </div>
            )}
            <MessageContent content={message.content} />
          </>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main CodeVaultAIChat Component
───────────────────────────────────────────── */
export const CodeVaultAIChat: React.FC = () => {
  const {
    messages,
    isOpen,
    setIsOpen,
    isGenerating,
    healthStatus,
    activeAttachment,
    setActiveAttachment,
    sendMessage,
    stopGeneration,
    clearHistory,
  } = useAIChat();

  const [input, setInput] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isNearBottom = useRef(true);

  /* Smart auto-scroll */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const threshold = 120;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    isNearBottom.current = near;
    setShowScrollBtn(!near);
  }, []);

  useEffect(() => {
    if (isNearBottom.current) {
      scrollToBottom('smooth');
    }
  }, [messages, isGenerating, scrollToBottom]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [input]);

  /* Focus textarea when chat opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isGenerating) return;
    setInput('');
    scrollToBottom('smooth');
    await sendMessage(text);
  }, [input, isGenerating, sendMessage, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOnline = healthStatus === 'ONLINE_HEALTHY' || healthStatus === 'ONLINE_CHECKING';
  const statusDot = healthStatus === 'ONLINE_HEALTHY'
    ? 'bg-emerald-400'
    : healthStatus === 'ONLINE_CHECKING'
    ? 'bg-yellow-400 animate-pulse'
    : 'bg-red-400';
  const statusLabel = healthStatus === 'ONLINE_HEALTHY'
    ? 'AI Online'
    : healthStatus === 'ONLINE_CHECKING'
    ? 'AI Connecting...'
    : 'AI Offline';

  if (!isOpen) return null;

  return (
    /* Outer shell — relative + overflow:hidden so glass backdrop stays fixed */
    <div
      className="fixed bottom-4 right-4 z-[900] flex flex-col"
      style={{
        width: 'min(420px, calc(100vw - 32px))',
        height: 'min(620px, calc(100dvh - 80px))',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Decorative glass backdrop (FIXED within shell, never scrolls) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(99,102,241,0.18) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(34,211,238,0.12) 0%, transparent 60%),' +
            'rgba(13,17,30,0.96)',
          backdropFilter: 'blur(20px)',
        }}
      />
      {/* Subtle animated orbs — absolutely positioned within the shell */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.10)',
          filter: 'blur(50px)',
          top: -60,
          left: -40,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'float-slow 8s ease-in-out infinite',
        }}
      />

      {/* ── Header ── */}
      <div
        style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}
        className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm leading-tight">CodeVault AI</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              <span className="text-xs text-slate-400">{statusLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              title="Clear chat"
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Messages area (THIS is what scrolls, not the glass backdrop) ── */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
        className="px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center pt-8 pb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/[0.08] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-indigo-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">CodeVault AI</p>
              <p className="text-slate-400 text-xs mt-1 max-w-[240px]">
                Ask about algorithms, debug code, explain concepts, or optimize your solution.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-[280px]">
              {['Explain this code', 'Fix my bug', 'Optimize algorithm', 'Time complexity'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-2.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.07] text-slate-300 hover:text-white transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Active attachment */}
        {activeAttachment && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/25 text-xs text-indigo-300 mt-1">
            <Code2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate flex-1 font-mono">{activeAttachment.title}</span>
            <button
              onClick={() => setActiveAttachment(null)}
              className="hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── "↓ Latest" scroll button ── */}
      {showScrollBtn && (
        <div style={{ position: 'relative', zIndex: 2 }} className="absolute bottom-[76px] left-1/2 -translate-x-1/2">
          <button
            onClick={() => { scrollToBottom('smooth'); setShowScrollBtn(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-900/40 transition-all border border-indigo-400/30"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Latest
          </button>
        </div>
      )}

      {/* ── Composer ── */}
      <div
        style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}
        className="px-3 pb-3 pt-2 border-t border-white/[0.06]"
      >
        {!isOnline && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span>AI temporarily unavailable — check your connection</span>
          </div>
        )}
        <div className="flex items-end gap-2 rounded-2xl bg-white/[0.06] border border-white/[0.08] px-3 py-2 focus-within:border-indigo-500/50 focus-within:bg-white/[0.08] transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? 'CodeVault AI is thinking...' : 'Ask CodeVault AI anything...'}
            disabled={isGenerating}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 resize-none outline-none min-h-[20px] max-h-[140px] overflow-y-auto leading-5 disabled:opacity-50"
            style={{ scrollbarWidth: 'none' }}
          />
          {isGenerating ? (
            <button
              onClick={stopGeneration}
              className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              title="Stop generation"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors flex-shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-1.5">
          CodeVault AI · Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default CodeVaultAIChat;