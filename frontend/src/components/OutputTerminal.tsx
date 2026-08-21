import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { 
  Terminal as TerminalIcon, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  Square, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { ExecuteResult } from '../services/api';
import { executeUniversal, getCommandDisplay } from '../services/compilerEngine';

export interface OutputTerminalHandle {
  startInteractive: (inputOverride?: string, codeOverride?: string, langOverride?: string) => void;
  clear: () => void;
}

interface OutputTerminalProps {
  result?: ExecuteResult | null;
  isRunning?: boolean;
  language: string;
  sourceCode?: string;
  customInput?: string;
  onClear?: () => void;
}

export const OutputTerminal = forwardRef<OutputTerminalHandle, OutputTerminalProps>(({
  result,
  isRunning = false,
  language,
  sourceCode = '',
  customInput = '',
  onClear,
}, ref) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'preview'>(
    language.toLowerCase() === 'html' ? 'preview' : 'terminal'
  );

  // Interactive terminal states
  const [terminalHistory, setTerminalHistory] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isProcessActive, setIsProcessActive] = useState<boolean>(false);
  const [exitInfo, setExitInfo] = useState<{ status: string; code?: number; time?: number } | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputInputRef = useRef<HTMLInputElement>(null);

  // Synchronization refs to prevent any stale closures
  const sourceCodeRef = useRef(sourceCode);
  const languageRef = useRef(language);
  const customInputRef = useRef(customInput);

  useEffect(() => {
    sourceCodeRef.current = sourceCode;
  }, [sourceCode]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    customInputRef.current = customInput;
  }, [customInput]);

  const isHtml = language.toLowerCase() === 'html';

  useEffect(() => {
    if (language.toLowerCase() === 'html') {
      setActiveTab('preview');
    }
  }, [language]);

  // Auto-scroll inside terminal body
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory, isProcessActive]);

  // Sync external result from batch runner if provided
  useEffect(() => {
    if (result) {
      if (result.output) {
        setTerminalHistory((prev) => prev + result.output + '\n');
      }
      if (result.error) {
        setTerminalHistory((prev) => prev + result.error + '\n');
      }
      setExitInfo({
        status: result.status,
        code: result.status === 'success' ? 0 : 1,
        time: result.execution_time_ms,
      });
      setIsProcessActive(false);
    }
  }, [result]);

  const runCloudEngineFallback = async (inputToSend?: string, codeToSend?: string, langToSend?: string) => {
    const effectiveCode = codeToSend !== undefined ? codeToSend : sourceCodeRef.current;
    const effectiveLang = langToSend !== undefined ? langToSend : languageRef.current;
    const effectiveInput = inputToSend !== undefined ? inputToSend : customInputRef.current;

    try {
      const resp = await executeUniversal({
        language: effectiveLang,
        sourceCode: effectiveCode,
        customInput: effectiveInput,
      });

      let outputText = '';
      if (resp.output) {
        outputText += resp.output;
      }
      if (resp.error) {
        outputText += (outputText ? '\n' : '') + resp.error;
      }

      setTerminalHistory((prev) => {
        const separator = prev.endsWith('\n') ? '' : '\n';
        return (
          prev +
          separator +
          outputText +
          `\n\n[Process completed with exit code ${resp.exit_code ?? 0} in ${resp.execution_time_ms}ms]\nPS CodeVault> `
        );
      });

      setExitInfo({
        status: resp.status,
        code: resp.exit_code,
        time: resp.execution_time_ms,
      });
    } catch (err: any) {
      setTerminalHistory((prev) => {
        const separator = prev.endsWith('\n') ? '' : '\n';
        return prev + separator + `[Execution Error: ${err.message || 'Server error'}]\nPS CodeVault> `;
      });
      setExitInfo({ status: 'error', code: 1, time: 0 });
    } finally {
      setIsProcessActive(false);
    }
  };

  const handleStartInteractive = (inputOverride?: string, codeOverride?: string, langOverride?: string) => {
    const activeCode = codeOverride !== undefined ? codeOverride : sourceCodeRef.current;
    const activeLang = langOverride !== undefined ? langOverride : languageRef.current;
    const activeInput = inputOverride !== undefined ? inputOverride : customInputRef.current;

    if (!activeCode.trim()) return;

    if (activeLang.toLowerCase() === 'html') {
      setActiveTab('preview');
      setTerminalHistory(`PS CodeVault> ${getCommandDisplay(activeLang)}\n[HTML Live Preview Rendered Successfully]\nPS CodeVault> `);
      setExitInfo({ status: 'success', code: 0, time: 10 });
      return;
    }

    const prefix = getCommandDisplay(activeLang);
    setTerminalHistory(`PS CodeVault> ${prefix}\n`);
    setCurrentInput('');
    setExitInfo(null);
    setIsProcessActive(true);

    const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isLocalDev && !customBaseUrl) {
      runCloudEngineFallback(activeInput, activeCode, activeLang);
      return;
    }

    // Try WebSocket for local interactive I/O with fallback
    let wsConnected = false;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = customBaseUrl ? customBaseUrl.replace(/^https?:\/\//, '') : window.location.host;
    const wsUrl = `${protocol}//${host}/ws/execute`;

    if (socketRef.current) {
      try { socketRef.current.close(); } catch (e) {}
    }

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      const wsTimer = setTimeout(() => {
        if (!wsConnected) {
          try { ws.close(); } catch (e) {}
          runCloudEngineFallback(activeInput, activeCode, activeLang);
        }
      }, 600);

      ws.onopen = () => {
        wsConnected = true;
        clearTimeout(wsTimer);
        ws.send(JSON.stringify({
          action: 'run',
          language: activeLang,
          source_code: activeCode,
          custom_input: activeInput,
          stdin: activeInput,
        }));
        setTimeout(() => {
          inputInputRef.current?.focus({ preventScroll: true });
        }, 50);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'stdout' || msg.type === 'stderr') {
            setTerminalHistory((prev) => prev + msg.data);
          } else if (msg.type === 'finished') {
            setIsProcessActive(false);
            setExitInfo({
              status: msg.status,
              code: msg.exit_code,
              time: msg.execution_time_ms,
            });
            setTerminalHistory((prev) => {
              const separator = prev.endsWith('\n') ? '' : '\n';
              return (
                prev +
                separator +
                `\n[Process completed with exit code ${msg.exit_code ?? 0} in ${msg.execution_time_ms ?? 0}ms]\nPS CodeVault> `
              );
            });
          }
        } catch (err) {
          console.error('Terminal WS parse error:', err);
        }
      };

      ws.onclose = () => {
        if (!wsConnected) {
          runCloudEngineFallback(activeInput, activeCode, activeLang);
        } else {
          setIsProcessActive(false);
        }
      };

      ws.onerror = () => {
        if (!wsConnected) {
          clearTimeout(wsTimer);
          runCloudEngineFallback(activeInput, activeCode, activeLang);
        }
      };
    } catch (err) {
      runCloudEngineFallback(activeInput, activeCode, activeLang);
    }
  };

  const handleSendInput = (e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = currentInput;
    setCurrentInput('');

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'stdin',
        data: inputVal + '\n',
      }));
      setTerminalHistory((prev) => prev + inputVal + '\n');
    } else {
      // Re-run with custom stdin input
      setTerminalHistory((prev) => prev + inputVal + '\n[Processing input...]\n');
      setIsProcessActive(true);
      runCloudEngineFallback((customInputRef.current ? customInputRef.current + '\n' : '') + inputVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendInput(e);
    }
  };

  const handleStopProcess = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'kill' }));
    }
    setIsProcessActive(false);
    setTerminalHistory((prev) => prev + '\n^C\n[Process terminated]\nPS CodeVault> ');
  };

  const handleClearTerminal = () => {
    setTerminalHistory('');
    setCurrentInput('');
    setExitInfo(null);
    if (onClear) onClear();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalHistory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useImperativeHandle(ref, () => ({
    startInteractive: (inputOverride?: string, codeOverride?: string, langOverride?: string) => {
      handleStartInteractive(inputOverride, codeOverride, langOverride);
    },
    clear: handleClearTerminal,
  }));

  return (
    <div className="flex flex-col h-full bg-dark-900 border border-slate-300 dark:border-dark-700/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition-colors">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-dark-950/80 border-b border-slate-200 dark:border-dark-800 select-none">
        {/* Left: Window Dots & Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50 block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 block" />
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'terminal'
                  ? 'bg-slate-200 dark:bg-dark-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-200'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>TERMINAL</span>
            </button>

            {isHtml && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                    : 'text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>LIVE PREVIEW</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {isProcessActive && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-[11px] font-mono text-brand-500 dark:text-brand-400 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Running</span>
            </span>
          )}

          {exitInfo && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium ${
                exitInfo.code === 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-accent-emerald border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-accent-rose border border-rose-500/20'
              }`}
            >
              {exitInfo.code === 0 ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              <span>
                Exit {exitInfo.code ?? (exitInfo.status === 'success' ? 0 : 1)}
                {exitInfo.time !== undefined && ` (${exitInfo.time}ms)`}
              </span>
            </span>
          )}

          {/* Copy Output Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
            title="Copy output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Terminal Button */}
          <button
            onClick={handleClearTerminal}
            className="p-1.5 rounded-lg text-slate-500 dark:text-dark-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Terminate Process Button */}
          {isProcessActive && (
            <button
              onClick={handleStopProcess}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/20 transition-colors"
              title="Terminate Process (Ctrl+C)"
            >
              <Square className="w-3.5 h-3.5 fill-rose-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Terminal or HTML Live Preview */}
      {activeTab === 'preview' ? (
        <div className="flex-1 w-full bg-white relative">
          <iframe
            srcDoc={sourceCode}
            title="HTML Live Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        <div
          ref={terminalBodyRef}
          className="flex-1 p-4 bg-[#0d1117] text-[#e6edf3] font-mono text-xs overflow-y-auto space-y-1.5 leading-relaxed selection:bg-brand-500 selection:text-white"
          style={{ fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace" }}
        >
          {/* Default Welcome Prompt */}
          {!terminalHistory && !isProcessActive && (
            <div className="text-[#8b949e] space-y-1 select-none">
              <p>PS CodeVault Pro Terminal [Version 2.0.0]</p>
              <p>Ready. Click <span className="text-brand-400 font-semibold">"Run Code"</span> to compile & execute.</p>
              <p className="text-[11px] text-[#484f58]">Output and interactive execution will stream here.</p>
            </div>
          )}

          {/* Render Full Terminal Text */}
          {terminalHistory && (
            <pre className="whitespace-pre-wrap break-all font-mono leading-relaxed">
              {terminalHistory}
            </pre>
          )}

          {/* Interactive Stdin Input Field */}
          {isProcessActive && (
            <form onSubmit={handleSendInput} className="flex items-center gap-2 pt-1">
              <span className="text-emerald-400 font-bold">&gt;</span>
              <input
                ref={inputInputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter input here and press Enter..."
                className="flex-1 bg-transparent border-none outline-none text-[#e6edf3] font-mono text-xs placeholder-[#484f58] p-0"
                autoFocus
              />
            </form>
          )}
        </div>
      )}
    </div>
  );
});

OutputTerminal.displayName = 'OutputTerminal';
