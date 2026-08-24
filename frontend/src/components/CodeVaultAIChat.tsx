import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Square,
  Trash2,
  Settings,
  HardDrive,
  DownloadCloud,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  WifiOff,
  Cpu,
  Zap,
  Terminal
} from 'lucide-react';
import { useAIChat } from '../context/AIChatContext';
import { CapabilityDetector } from '../ai/offline/CapabilityDetector';
import { OfflineAICapabilities } from '../ai/types';

export const CodeVaultAIChat: React.FC = () => {
  const {
    messages,
    isOpen,
    setIsOpen,
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
  } = useAIChat();

  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [capabilities, setCapabilities] = useState<OfflineAICapabilities | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Load device capabilities when opening settings
  useEffect(() => {
    if (showSettings) {
      CapabilityDetector.detect().then(setCapabilities);
    }
  }, [showSettings]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunOfflineTest = async () => {
    setTesting(true);
    setTestStatus('Executing local offline test inference...');
    try {
      const res = await testOfflineAI();
      setTestStatus(`[Success] ${res}`);
    } catch (err: any) {
      setTestStatus(`[Test Failed] ${err?.message || 'Error executing test'}`);
    } finally {
      setTesting(false);
    }
  };

  // Status Badge Rendering
  const renderStatusBadge = () => {
    if (offlineState.status === 'downloading') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Preparing Offline AI ({offlineState.progress}%)</span>
        </div>
      );
    }

    if (healthStatus === 'ONLINE_HEALTHY' && providerMode !== 'offline') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
          <span>Online (NVIDIA Nemotron)</span>
        </div>
      );
    }

    if (offlineState.status === 'ready') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80" />
          <span>Offline Mode (CodeVault AI)</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Offline AI Unavailable</span>
      </div>
    );
  };

  // Render markdown code blocks
  const renderMessageContent = (content: string, id: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const lang = lines[0].trim();
            const code = (lines.length > 1 ? lines.slice(1).join('\n') : lines[0]).trim();
            const blockId = `${id}_code_${index}`;

            return (
              <div key={index} className="rounded-2xl overflow-hidden border border-[#232b4b] bg-dark-950/90 my-2.5 shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-dark-900/90 border-b border-[#1b223c] text-xs font-mono text-dark-300">
                  <span className="text-indigo-400 font-semibold">{lang || 'code'}</span>
                  <button
                    onClick={() => handleCopy(code, blockId)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-dark-200 hover:text-white transition-colors border border-[#1b223c]"
                  >
                    {copiedId === blockId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === blockId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto font-mono text-xs text-indigo-100/90 leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Toggle Button (Always visible on bottom right with futuristic glow) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-3xl bg-gradient-to-r from-neon-blue via-brand-600 to-neon-purple text-white shadow-2xl shadow-brand-500/40 hover:shadow-neon-purple hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-3 group border border-white/20 backdrop-blur-xl"
        title="Open CodeVault AI"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-dark-950 shadow-sm" />
        </div>
        <span className="font-bold text-sm hidden sm:inline tracking-wide font-sans">CodeVault AI</span>
      </button>

      {/* Main AI Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[540px] bg-[#080a14]/95 backdrop-blur-2xl border-l border-purple-500/20 shadow-2xl flex flex-col animate-slide-left">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#1b223c] flex items-center justify-between bg-dark-950/90">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-blue via-brand-600 to-neon-purple text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Sparkles className="w-5 h-5" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur-sm opacity-50 -z-10" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2 font-sans tracking-tight">
                  CodeVault AI <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">PRO</span>
                </h3>
                <div className="mt-1">{renderStatusBadge()}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2.5 rounded-2xl text-dark-300 hover:text-white hover:bg-dark-850 transition-colors border border-transparent hover:border-[#1b223c] ${
                  showSettings ? 'bg-dark-850 text-white border-[#1b223c]' : ''
                }`}
                title="AI Settings & Offline Package"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={clearHistory}
                disabled={messages.length === 0 || isGenerating}
                className="p-2.5 rounded-2xl text-dark-400 hover:text-rose-400 hover:bg-dark-850 transition-colors disabled:opacity-40"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-2xl text-dark-400 hover:text-white hover:bg-dark-850 transition-colors"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Sub-Panel */}
          {showSettings && (
            <div className="p-5 bg-dark-950/95 border-b border-[#1b223c] space-y-4 animate-slide-down">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-neon-purple" />
                  CodeVault Hybrid AI Settings
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-xs text-dark-400 hover:text-white font-medium"
                >
                  Done
                </button>
              </div>

              {/* Mode Selector */}
              <div>
                <label className="text-xs text-dark-300 font-semibold block mb-2">Routing Mode:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['auto', 'online', 'offline'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setProviderMode(mode)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                        providerMode === mode
                          ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white border-purple-400 shadow-md shadow-brand-500/30'
                          : 'bg-dark-900 text-dark-300 border-[#1b223c] hover:bg-dark-850 hover:text-white'
                      }`}
                    >
                      {mode === 'auto' ? 'Auto (Smart)' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offline AI Package Card */}
              <div className="p-4 rounded-2xl bg-dark-900 border border-[#232b4b] space-y-3.5 shadow-inner">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      CodeVault Offline AI Model
                    </h4>
                    <p className="text-[11px] text-dark-400 mt-1 leading-relaxed">
                      On-device Qwen Coder 0.5B (4-bit quantized • ~{offlineState.sizeMB} MB). Runs 100% locally.
                    </p>
                  </div>
                  {offlineState.status === 'ready' && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Ready
                    </span>
                  )}
                </div>

                {/* Device Capability Overview */}
                {capabilities && (
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-dark-300 bg-dark-950/80 p-3 rounded-xl border border-[#1b223c]">
                    <div>
                      WebGPU: <strong className={capabilities.webGPU ? 'text-emerald-400' : 'text-amber-400'}>
                        {capabilities.webGPU ? 'Hardware Accelerated' : 'CPU WASM Fallback'}
                      </strong>
                    </div>
                    <div>
                      Storage Quota: <strong className="text-white">{capabilities.availableStorageMB || 2048} MB</strong>
                    </div>
                  </div>
                )}

                {/* Download Progress Bar */}
                {offlineState.status === 'downloading' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-dark-300">
                      <span>{offlineState.progressText || 'Downloading model weights...'}</span>
                      <span className="font-mono text-cyan-400 font-bold">{offlineState.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-neon-blue to-neon-purple transition-all duration-300 rounded-full shadow-sm"
                        style={{ width: `${offlineState.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {offlineState.status !== 'ready' && offlineState.status !== 'downloading' && (
                    <button
                      onClick={downloadOfflineAI}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple hover:from-brand-600 hover:to-purple-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-500/25"
                    >
                      <DownloadCloud className="w-4 h-4" />
                      Download Offline AI (~{offlineState.sizeMB} MB)
                    </button>
                  )}

                  {offlineState.status === 'ready' && (
                    <>
                      <button
                        onClick={handleRunOfflineTest}
                        disabled={testing}
                        className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        {testing ? 'Testing...' : 'Test Offline AI'}
                      </button>
                      <button
                        onClick={removeOfflineAI}
                        className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
                      >
                        Remove Package
                      </button>
                    </>
                  )}
                </div>

                {testStatus && (
                  <div className="text-[11px] font-mono p-2.5 rounded-xl bg-dark-950 text-cyan-300 border border-[#1b223c]">
                    {testStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Context Attachment Pill */}
          {activeAttachment && (
            <div className="px-5 py-2.5 bg-gradient-to-r from-purple-950/40 to-dark-900 border-b border-purple-500/20 flex items-center justify-between text-xs text-purple-300">
              <div className="flex items-center gap-2 truncate">
                <Code2 className="w-4 h-4 shrink-0 text-neon-purple" />
                <span className="font-bold">{activeAttachment.title}:</span>
                <span className="truncate text-dark-300">{activeAttachment.content.substring(0, 50)}...</span>
              </div>
              <button
                onClick={() => setActiveAttachment(null)}
                className="text-dark-400 hover:text-white p-1"
                title="Remove attached context"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-dark-400 space-y-4">
                <div className="relative w-14 h-14 rounded-3xl bg-gradient-to-tr from-neon-blue via-brand-600 to-neon-purple text-white flex items-center justify-center shadow-xl shadow-brand-500/30">
                  <Sparkles className="w-7 h-7" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-3xl blur-md opacity-40 -z-10" />
                </div>
                <h4 className="font-extrabold text-white text-base tracking-tight font-sans">Welcome to CodeVault AI</h4>
                <p className="text-xs text-dark-300 max-w-xs leading-relaxed">
                  Your high-performance programming assistant. Powered by online NVIDIA Nemotron with browser-side offline fallback.
                </p>

                {/* Quick suggestions */}
                <div className="w-full space-y-2 pt-3">
                  {[
                    'Explain binary search time & space complexity',
                    'How does bubble sort swap adjacent elements?',
                    'Explain recursion base condition with an example',
                    'What is the difference between array and linked list?',
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left p-3 rounded-2xl bg-[#0e1222]/80 hover:bg-[#141a2e] border border-[#1b223c] text-xs text-dark-200 hover:text-white transition-all duration-200 shadow-sm hover:border-purple-500/30"
                    >
                      💡 {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } space-y-1.5`}
                >
                  {/* Sender / Provider Label */}
                  <div className="text-[10px] text-dark-400 px-1 font-semibold flex items-center gap-2">
                    <span>{msg.role === 'user' ? 'You' : 'CodeVault AI'}</span>
                    {msg.provider && (
                      <span className="px-2 py-0.5 rounded-full bg-dark-850 text-indigo-300 font-mono text-[9px] border border-[#1b223c]">
                        {msg.provider === 'nemotron' ? 'NVIDIA Nemotron' : 'Offline AI'}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] rounded-3xl p-4 shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-tr from-neon-blue to-neon-purple text-white rounded-br-none shadow-brand-500/20'
                        : msg.isError
                        ? 'bg-rose-950/50 border border-rose-500/40 text-rose-200 rounded-bl-none'
                        : 'bg-[#0e1222]/90 border border-[#232b4b] text-dark-100 rounded-bl-none shadow-lg'
                    }`}
                  >
                    {renderMessageContent(msg.content, msg.id)}
                  </div>
                </div>
              ))
            )}

            {/* Generating typing indicator */}
            {isGenerating && (
              <div className="flex items-center gap-2.5 text-xs text-indigo-400 animate-pulse pl-2 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-purple animate-ping" />
                <span>CodeVault AI is reasoning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Action Bar */}
          <div className="p-4 border-t border-[#1b223c] bg-dark-950/95 space-y-2.5">
            
            {/* Quick Action Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => sendMessage('Explain the time and space complexity of this logic.')}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-[#1b223c] text-dark-300 hover:text-white text-[11px] font-semibold whitespace-nowrap transition-colors"
              >
                ⏱ Complexity
              </button>
              <button
                onClick={() => sendMessage('Find potential edge cases or bugs in this implementation.')}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-[#1b223c] text-dark-300 hover:text-white text-[11px] font-semibold whitespace-nowrap transition-colors"
              >
                🔍 Edge Cases
              </button>
              <button
                onClick={() => sendMessage('Break down this algorithm step by step.')}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-[#1b223c] text-dark-300 hover:text-white text-[11px] font-semibold whitespace-nowrap transition-colors"
              >
                🧩 Step by Step
              </button>
            </div>

            {/* Textarea Form */}
            <form onSubmit={handleSend} className="relative flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask CodeVault AI (Shift+Enter for newline)..."
                rows={1}
                disabled={isGenerating}
                className="flex-1 bg-[#0e1222] border border-[#232b4b] rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-dark-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none max-h-32 disabled:opacity-50 transition-colors"
              />

              {isGenerating ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-colors flex items-center justify-center shrink-0"
                  title="Stop Generation"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple hover:from-brand-600 hover:to-purple-600 text-white shadow-lg shadow-brand-500/25 disabled:opacity-40 disabled:hover:bg-brand-600 transition-all flex items-center justify-center shrink-0 hover:scale-105"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between text-[10px] text-dark-500 px-1 font-mono">
              <span>CodeVault Pro Hybrid AI Engine</span>
              <span>Online: Nemotron • Offline: Local Qwen</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
