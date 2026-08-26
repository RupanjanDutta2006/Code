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
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Preparing Offline AI ({offlineState.progress}%)</span>
        </div>
      );
    }

    if (healthStatus === 'ONLINE_HEALTHY' && providerMode !== 'offline') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>Online (NVIDIA Nemotron)</span>
        </div>
      );
    }

    if (offlineState.status === 'ready') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
          <span>Offline Mode (CodeVault AI)</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold">
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
              <div key={index} className="rounded-2xl overflow-hidden border border-light-border dark:border-[#232b4b] bg-light-secondary dark:bg-dark-950/90 my-2.5 shadow-sm dark:shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-dark-900/90 border-b border-light-border dark:border-[#1b223c] text-xs font-mono text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-blue dark:text-indigo-400 font-semibold">{lang || 'code'}</span>
                  <button
                    onClick={() => handleCopy(code, blockId)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-light-secondary dark:bg-dark-800 hover:bg-white dark:hover:bg-dark-750 text-light-textNormal dark:text-dark-200 hover:text-light-textStrong dark:hover:text-white transition-colors border border-light-border dark:border-[#1b223c]"
                  >
                    {copiedId === blockId ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === blockId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto font-mono text-xs text-light-textStrong dark:text-indigo-100/90 leading-relaxed">
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
      {/* Floating Toggle Button (Positioned above bottom nav on mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-crimson-600 hover:bg-crimson-700 dark:bg-gradient-to-r dark:from-crimson-600 dark:via-red-600 dark:to-rose-700 text-white shadow-glow-red-sm hover:shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 sm:gap-3 group border border-white/20 backdrop-blur-xl touch-target"
        title="Open CodeVault AI"
        aria-label="Open CodeVault AI Assistant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0c0c10] shadow-sm" />
        </div>
        <span className="font-bold text-xs sm:text-sm tracking-wide font-sans">CodeVault AI</span>
      </button>

      {/* Main AI Chat Modal / Drawer (Full viewport on phone, drawer on desktop) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto z-50 w-full sm:w-[500px] lg:w-[540px] h-full h-screen-dvh bg-light-bg dark:bg-[#0c0c10]/95 backdrop-blur-2xl sm:border-l border-light-border dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col animate-slide-left transition-colors duration-200 safe-top">
          
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-light-border dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#08080c]/90 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-crimson-600 via-red-600 to-rose-600 text-white flex items-center justify-center shadow-glow-red-sm shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-crimson-500 to-rose-700 rounded-2xl blur-sm opacity-30 dark:opacity-50 -z-10" />
              </div>
              <div>
                <h3 className="font-extrabold text-light-textStrong dark:text-white text-sm sm:text-base flex items-center gap-1.5 font-sans tracking-tight">
                  CodeVault AI <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-crimson-500/15 text-crimson-500 dark:text-crimson-400 border border-crimson-500/30 font-bold">PRO</span>
                </h3>
                <div className="mt-0.5">{renderStatusBadge()}</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-10 h-10 rounded-xl text-light-textSecondary dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-light-secondary dark:hover:bg-dark-850 transition-colors flex items-center justify-center border border-transparent ${
                  showSettings ? 'bg-light-secondary dark:bg-dark-850 text-light-blue dark:text-white border-light-border dark:border-[#1b223c]' : ''
                }`}
                title="AI Settings & Offline Package"
                aria-label="AI Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={clearHistory}
                disabled={messages.length === 0 || isGenerating}
                className="w-10 h-10 rounded-xl text-light-textMuted dark:text-dark-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-light-secondary dark:hover:bg-dark-850 transition-colors disabled:opacity-40 flex items-center justify-center"
                title="Clear Chat History"
                aria-label="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl text-light-textMuted dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white hover:bg-light-secondary dark:hover:bg-dark-850 transition-colors flex items-center justify-center"
                title="Close Drawer"
                aria-label="Close CodeVault AI Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Sub-Panel */}
          {showSettings && (
            <div className="p-5 bg-white dark:bg-dark-950/95 border-b border-light-border dark:border-[#1b223c] space-y-4 animate-slide-down">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-light-textStrong dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-light-blue dark:text-neon-purple" />
                  CodeVault Hybrid AI Settings
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-xs text-light-blue dark:text-dark-400 hover:underline font-semibold"
                >
                  Done
                </button>
              </div>

              {/* Mode Selector */}
              <div>
                <label className="text-xs text-light-textSecondary dark:text-dark-300 font-semibold block mb-2">Routing Mode:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['auto', 'online', 'offline'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setProviderMode(mode)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                        providerMode === mode
                          ? 'bg-light-blue text-white border-light-blue shadow-sm dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple dark:border-purple-400 dark:shadow-md dark:shadow-brand-500/30'
                          : 'bg-light-secondary text-light-textNormal border-light-border hover:bg-white hover:text-light-textStrong dark:bg-dark-900 dark:text-dark-300 dark:border-[#1b223c] dark:hover:bg-dark-850 dark:hover:text-white'
                      }`}
                    >
                      {mode === 'auto' ? 'Auto (Smart)' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offline AI Package Card */}
              <div className="p-4 rounded-2xl bg-light-secondary dark:bg-dark-900 border border-light-border dark:border-[#232b4b] space-y-3.5 shadow-sm dark:shadow-inner">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-light-textStrong dark:text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-light-blue dark:text-cyan-400" />
                      CodeVault Offline AI Model
                    </h4>
                    <p className="text-[11px] text-light-textSecondary dark:text-dark-400 mt-1 leading-relaxed">
                      Runs 100% on-device inside a Web Worker. Zero data leaves your laptop.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-light-blueSoft text-light-blue border border-light-blueBorder/40 dark:bg-dark-800 dark:text-cyan-300 dark:border-cyan-500/30">
                    Qwen2.5-Coder 0.5B
                  </span>
                </div>

                {/* Capability Detector */}
                {capabilities && (
                  <div className="p-3 rounded-xl bg-white dark:bg-dark-950 border border-light-border dark:border-dark-800 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-light-textSecondary dark:text-dark-400">WebGPU Acceleration:</span>
                      <span className={capabilities.webGPU ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                        {capabilities.webGPU ? 'Supported ✓' : 'WASM CPU Fallback'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-light-textSecondary dark:text-dark-400">Storage Available:</span>
                      <span className="text-light-textNormal dark:text-dark-200">
                        {capabilities.availableStorageMB > 0 ? `${capabilities.availableStorageMB} MB quota` : 'Unlimited OPFS'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Offline Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {offlineState.status === 'not_downloaded' || offlineState.status === 'error' ? (
                    <button
                      onClick={downloadOfflineAI}
                      className="flex-1 py-2 px-3 rounded-xl bg-light-blue hover:bg-light-blueHover dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <DownloadCloud className="w-4 h-4" />
                      <span>Download Offline AI (~380 MB)</span>
                    </button>
                  ) : offlineState.status === 'downloading' ? (
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-300 font-medium">
                        <span>Downloading Model Weights...</span>
                        <span className="font-mono font-bold">{offlineState.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-light-border dark:bg-dark-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-light-blue to-purple-600 dark:from-cyan-500 dark:to-neon-purple transition-all duration-300"
                          style={{ width: `${offlineState.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleRunOfflineTest}
                        disabled={testing}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 dark:text-emerald-300 dark:border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-cyan-400" />
                        {testing ? 'Testing...' : 'Test Offline AI'}
                      </button>
                      <button
                        onClick={removeOfflineAI}
                        className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 text-xs font-semibold transition-all"
                      >
                        Remove Package
                      </button>
                    </>
                  )}
                </div>

                {testStatus && (
                  <div className="text-[11px] font-mono p-2.5 rounded-xl bg-white dark:bg-dark-950 text-light-textStrong dark:text-cyan-300 border border-light-border dark:border-[#1b223c]">
                    {testStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Context Attachment Pill */}
          {activeAttachment && (
            <div className="px-5 py-2.5 bg-light-blueSoft dark:bg-gradient-to-r dark:from-purple-950/40 dark:to-dark-900 border-b border-light-blueBorder/30 dark:border-purple-500/20 flex items-center justify-between text-xs text-light-blue dark:text-purple-300">
              <div className="flex items-center gap-2 truncate">
                <Code2 className="w-4 h-4 shrink-0 text-light-blue dark:text-neon-purple" />
                <span className="font-bold">{activeAttachment.title}:</span>
                <span className="truncate text-light-textNormal dark:text-dark-300">{activeAttachment.content.substring(0, 50)}...</span>
              </div>
              <button
                onClick={() => setActiveAttachment(null)}
                className="text-light-textMuted dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white p-1"
                title="Remove attached context"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 bg-light-bg dark:bg-transparent">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-light-textMuted dark:text-dark-400 space-y-4">
                <div className="relative w-14 h-14 rounded-3xl bg-gradient-to-tr from-crimson-600 via-red-600 to-rose-600 text-white flex items-center justify-center shadow-glow-red-sm">
                  <Sparkles className="w-7 h-7" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-crimson-500 to-rose-700 rounded-3xl blur-md opacity-30 dark:opacity-40 -z-10" />
                </div>
                <h4 className="font-extrabold text-light-textStrong dark:text-white text-base tracking-tight font-sans">Welcome to CodeVault AI</h4>
                <p className="text-xs text-light-textSecondary dark:text-dark-300 max-w-xs leading-relaxed">
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
                      className="w-full text-left p-3 rounded-2xl bg-white hover:bg-light-secondary border border-light-border text-xs text-light-textNormal hover:text-light-textStrong dark:bg-[#121217]/80 dark:hover:bg-[#1c1c24] dark:border-white/10 dark:text-dark-200 dark:hover:text-white transition-all duration-200 shadow-sm hover:border-crimson-500/40 dark:hover:border-crimson-500/40"
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
                  <div className="text-[10px] text-light-textMuted dark:text-dark-400 px-1 font-semibold flex items-center gap-2">
                    <span>{msg.role === 'user' ? 'You' : 'CodeVault AI'}</span>
                    {msg.provider && (
                      <span className="px-2 py-0.5 rounded-full bg-light-secondary text-crimson-600 dark:bg-[#18181f] dark:text-crimson-300 font-mono text-[9px] border border-light-border dark:border-white/10">
                        {msg.provider === 'nemotron' ? 'NVIDIA Nemotron' : 'Offline AI'}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-crimson-600 text-white rounded-br-none dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-700 dark:shadow-glow-red-sm'
                        : msg.isError
                        ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-bl-none dark:bg-rose-950/50 dark:border-rose-500/40 dark:text-rose-200'
                        : 'bg-white border border-light-border text-light-textStrong rounded-bl-none shadow-xs dark:bg-[#131318]/90 dark:border-white/10 dark:text-dark-100 dark:shadow-md'
                    }`}
                  >
                    {renderMessageContent(msg.content, msg.id)}
                  </div>
                </div>
              ))
            )}

            {/* Generating typing indicator */}
            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-crimson-600 dark:text-crimson-400 animate-pulse pl-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-crimson-500 animate-ping" />
                <span>CodeVault AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer Bottom Input Area (Safe-area compliant) */}
          <div 
            className="p-3 sm:p-4 bg-white dark:bg-[#08080c]/95 border-t border-light-border dark:border-white/10 shrink-0"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
          >
            <form onSubmit={handleSend} className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about DSA, code syntax, or bug fixes..."
                rows={2}
                disabled={isGenerating}
                className="w-full p-3 pr-20 rounded-xl sm:rounded-2xl bg-light-secondary dark:bg-[#121217] border border-light-borderStrong dark:border-white/10 text-light-textStrong dark:text-white placeholder-light-textMuted dark:placeholder-dark-500 text-sm sm:text-xs font-mono outline-none focus:border-crimson-500 focus:bg-white dark:focus:bg-[#16161d] transition-all resize-none shadow-inner"
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all flex items-center justify-center"
                    title="Stop AI Generation"
                    aria-label="Stop AI Generation"
                  >
                    <Square className="w-4 h-4 fill-white" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-xl bg-crimson-600 hover:bg-crimson-700 dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 text-white shadow-glow-red-sm transition-all disabled:opacity-40 flex items-center justify-center active:scale-95 touch-target hover:scale-105"
                    title="Send Message"
                    aria-label="Send message to AI"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-light-textMuted dark:text-dark-400 mt-1.5 px-1">
              <span className="flex items-center gap-1 font-mono">
                ⚡ Mode: <strong className="text-light-textNormal dark:text-dark-200 capitalize">{providerMode}</strong>
              </span>
              <span className="hidden sm:inline font-mono">Press <kbd className="px-1 py-0.5 bg-light-secondary dark:bg-[#18181f] border border-light-border dark:border-white/10 rounded text-light-textNormal dark:text-dark-300">Enter</kbd> to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
