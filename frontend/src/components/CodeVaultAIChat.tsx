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
  AlertTriangle,
  Copy,
  Check,
  Code2,
  HelpCircle,
  Wrench,
  WifiOff,
  Cpu,
  Layers,
  ChevronDown,
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
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Preparing Offline AI ({offlineState.progress}%)</span>
        </div>
      );
    }

    if (healthStatus === 'ONLINE_HEALTHY' && providerMode !== 'offline') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span>Online (NVIDIA Nemotron)</span>
        </div>
      );
    }

    if (offlineState.status === 'ready') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
          <span>Offline Mode (CodeVault AI)</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium">
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
              <div key={index} className="rounded-xl overflow-hidden border border-dark-700 bg-dark-950 my-2 shadow-md">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-dark-850 border-b border-dark-700/80 text-xs font-mono text-dark-300">
                  <span>{lang || 'code'}</span>
                  <button
                    onClick={() => handleCopy(code, blockId)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-dark-750 text-dark-300 hover:text-white transition-colors"
                  >
                    {copiedId === blockId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === blockId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 overflow-x-auto font-mono text-xs text-indigo-100/90 leading-normal">
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
      {/* Floating Toggle Button (Always visible on bottom right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group border border-white/10"
        title="Open CodeVault AI"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold text-sm hidden sm:inline">CodeVault AI</span>
        {offlineState.status === 'downloading' && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        )}
      </button>

      {/* Main AI Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[520px] bg-dark-900/95 backdrop-blur-xl border-l border-dark-700 shadow-2xl flex flex-col animate-slide-left">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-dark-800 flex items-center justify-between bg-dark-950/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  CodeVault AI
                </h3>
                <div className="mt-0.5">{renderStatusBadge()}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800 transition-colors ${
                  showSettings ? 'bg-dark-800 text-white' : ''
                }`}
                title="AI Settings & Offline Package"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={clearHistory}
                disabled={messages.length === 0 || isGenerating}
                className="p-2 rounded-xl text-dark-400 hover:text-rose-400 hover:bg-dark-800 transition-colors disabled:opacity-40"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Sub-Panel */}
          {showSettings && (
            <div className="p-4 bg-dark-950/90 border-b border-dark-800 space-y-4 animate-slide-down">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  CodeVault Hybrid AI Settings
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-xs text-dark-400 hover:text-white"
                >
                  Done
                </button>
              </div>

              {/* Mode Selector */}
              <div>
                <label className="text-xs text-dark-300 font-medium block mb-1.5">Provider Mode:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['auto', 'online', 'offline'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setProviderMode(mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                        providerMode === mode
                          ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                          : 'bg-dark-850 text-dark-300 border-dark-700 hover:bg-dark-800'
                      }`}
                    >
                      {mode === 'auto' ? 'Auto (Recommended)' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offline AI Package Card */}
              <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-700/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      CodeVault Offline AI Model
                    </h4>
                    <p className="text-[11px] text-dark-400 mt-0.5">
                      On-device Qwen Coder 0.5B (4-bit quantized • ~{offlineState.sizeMB} MB). Runs 100% locally.
                    </p>
                  </div>
                  {offlineState.status === 'ready' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      Ready
                    </span>
                  )}
                </div>

                {/* Device Capability Overview */}
                {capabilities && (
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-dark-300 bg-dark-950 p-2.5 rounded-lg border border-dark-800">
                    <div>
                      WebGPU: <strong className={capabilities.webGPU ? 'text-emerald-400' : 'text-amber-400'}>
                        {capabilities.webGPU ? 'Hardware Accelerated' : 'CPU WASM Fallback'}
                      </strong>
                    </div>
                    <div>
                      Available Storage: <strong className="text-white">{capabilities.availableStorageMB || 2048} MB</strong>
                    </div>
                  </div>
                )}

                {/* Download Progress Bar */}
                {offlineState.status === 'downloading' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-dark-300">
                      <span>{offlineState.progressText || 'Downloading...'}</span>
                      <span className="font-mono text-cyan-400 font-semibold">{offlineState.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-brand-500 transition-all duration-300 rounded-full"
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
                      className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      Download Offline AI (~{offlineState.sizeMB} MB)
                    </button>
                  )}

                  {offlineState.status === 'ready' && (
                    <>
                      <button
                        onClick={handleRunOfflineTest}
                        disabled={testing}
                        className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-cyan-300 border border-dark-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        {testing ? 'Testing...' : 'Test Offline AI'}
                      </button>
                      <button
                        onClick={removeOfflineAI}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-colors"
                      >
                        Remove Package
                      </button>
                    </>
                  )}
                </div>

                {testStatus && (
                  <div className="text-[11px] font-mono p-2 rounded bg-dark-950 text-cyan-300 border border-dark-800">
                    {testStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Context Attachment Pill */}
          {activeAttachment && (
            <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
              <div className="flex items-center gap-1.5 truncate">
                <Code2 className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold">{activeAttachment.title}:</span>
                <span className="truncate text-dark-300">{activeAttachment.content.substring(0, 50)}...</span>
              </div>
              <button
                onClick={() => setActiveAttachment(null)}
                className="text-dark-400 hover:text-white p-0.5"
                title="Remove attached context"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-dark-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-white text-sm">Welcome to CodeVault AI</h4>
                <p className="text-xs text-dark-400 max-w-xs leading-relaxed">
                  Your all-in-one programming tutor. Ask coding questions, debug errors, analyze algorithms, or request code explanations.
                </p>

                {/* Quick suggestions */}
                <div className="w-full space-y-1.5 pt-4">
                  {[
                    'Explain binary search time & space complexity',
                    'How does bubble sort swap elements?',
                    'Explain recursion base condition with an example',
                    'What is the difference between array and linked list?',
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-xs text-dark-200 hover:text-white transition-colors"
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
                  } space-y-1`}
                >
                  {/* Sender / Provider Label */}
                  <div className="text-[10px] text-dark-400 px-1 font-medium flex items-center gap-1.5">
                    <span>{msg.role === 'user' ? 'You' : 'CodeVault AI'}</span>
                    {msg.provider && (
                      <span className="px-1.5 py-0.2 rounded bg-dark-800 text-indigo-300 font-mono text-[9px] border border-dark-700">
                        {msg.provider === 'nemotron' ? 'NVIDIA Nemotron' : 'Offline AI'}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] rounded-2xl p-4 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-br-none'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-bl-none'
                        : 'bg-dark-850 border border-dark-750 text-dark-100 rounded-bl-none'
                    }`}
                  >
                    {renderMessageContent(msg.content, msg.id)}
                  </div>
                </div>
              ))
            )}

            {/* Generating typing indicator */}
            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse pl-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>CodeVault AI is reasoning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Action Bar */}
          <div className="p-3.5 border-t border-dark-800 bg-dark-950/90 space-y-2">
            
            {/* Quick Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => sendMessage('Explain the time and space complexity of this logic.')}
                disabled={isGenerating}
                className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 text-dark-300 hover:text-white text-[11px] whitespace-nowrap transition-colors"
              >
                ⏱ Complexity
              </button>
              <button
                onClick={() => sendMessage('Find potential edge cases or bugs in this implementation.')}
                disabled={isGenerating}
                className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 text-dark-300 hover:text-white text-[11px] whitespace-nowrap transition-colors"
              >
                🔍 Edge Cases
              </button>
              <button
                onClick={() => sendMessage('Break down this algorithm step by step.')}
                disabled={isGenerating}
                className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 text-dark-300 hover:text-white text-[11px] whitespace-nowrap transition-colors"
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
                className="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none max-h-32 disabled:opacity-50"
              />

              {isGenerating ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors flex items-center justify-center shrink-0"
                  title="Stop Generation"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 disabled:opacity-40 disabled:hover:bg-brand-600 transition-colors flex items-center justify-center shrink-0"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between text-[10px] text-dark-500 px-1">
              <span>CodeVault Pro Hybrid AI Engine</span>
              <span>Online: Nemotron • Offline: Local Qwen</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
