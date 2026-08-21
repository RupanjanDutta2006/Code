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
  Loader2,
} from 'lucide-react';
import { ExecuteResult } from '../services/api';
import { executeUniversal, getCommandDisplay } from '../services/compilerEngine';

export interface OutputTerminalHandle {
  startInteractive: () => void;
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

  const isHtml = language.toLowerCase() === 'html';

  useEffect(() => {
    if (language.toLowerCase() === 'html') {
      setActiveTab('preview');
    }
  }, [language]);

  // Internal auto-scroll ONLY within the terminal body (never scrolls outer page)
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
        time: result.execution_time_ms,
      });
      setIsProcessActive(false);
    }
  }, [result]);

  const runCloudEngineFallback = async (inputToSend?: string) => {
    try {
      const resp = await executeUniversal({
        language,
        sourceCode,
        customInput: inputToSend !== undefined ? inputToSend : (customInput || currentInput),
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

  const handleStartInteractive = () => {
    if (!sourceCode.trim()) return;

    if (isHtml) {
      setActiveTab('preview');
      setTerminalHistory(`PS CodeVault> ${getCommandDisplay(language)}\n[HTML Live Preview Rendered Successfully]\nPS CodeVault> `);
      setExitInfo({ status: 'success', code: 0, time: 10 });
      return;
    }

    const prefix = getCommandDisplay(language);
    setTerminalHistory(`PS CodeVault> ${prefix}\n`);
    setCurrentInput('');
    setExitInfo(null);
    setIsProcessActive(true);

    const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
    // Check if we are running in local backend mode or on cloud (Vercel/Static)
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isLocalDev && !customBaseUrl) {
      // Directly use Universal Engine on Vercel / Remote
      runCloudEngineFallback();
      return;
    }

    // Try WebSocket for interactive I/O with quick fallback
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
          runCloudEngineFallback();
        }
      }, 600);

      ws.onopen = () => {
        wsConnected = true;
        clearTimeout(wsTimer);
        ws.send(JSON.stringify({
          action: 'run',
          language,
          source_code: sourceCode,
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
          runCloudEngineFallback();
        } else {
          setIsProcessActive(false);
        }
      };

      ws.onerror = () => {
        if (!wsConnected) {
          clearTimeout(wsTimer);
          runCloudEngineFallback();
        }
      };
    } catch (err) {
      runCloudEngineFallback();
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
      runCloudEngineFallback(inputVal);
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
    startInteractive: handleStartInteractive,
    clear: handleClearTerminal,
  }));

  return (
    <div className="flex flex-col h-full bg-dark-900 border border-dark-700/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-950/80 border-b border-dark-800 select-none">
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
                  ? 'bg-dark-800 text-brand-400 border border-brand-500/20 shadow-sm'
                  : 'text-dark-400 hover:text-dark-200'
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
                    ? 'bg-dark-800 text-brand-400 border border-brand-500/20 shadow-sm'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>LIVE PREVIEW</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Status Badges & Controls */}
        <div className="flex items-center gap-2">
          {isProcessActive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Running...</span>
              <button
                onClick={handleStopProcess}
                className="ml-1 p-0.5 rounded hover:bg-emerald-500/20 text-emerald-300"
                title="Stop process (^C)"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
              </button>
            </div>
          ) : exitInfo ? (
            <div className="flex items-center gap-2">
              {exitInfo.status === 'success' || exitInfo.code === 0 ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                  <CheckCircle className="w-3 h-3" />
                  <span>Success</span>
                  {exitInfo.time !== undefined && (
                    <span className="text-dark-400 text-[10px]">({exitInfo.time}ms)</span>
                  )}
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-mono">
                  <AlertCircle className="w-3 h-3" />
                  <span>Exit {exitInfo.code ?? 1}</span>
                  {exitInfo.time !== undefined && (
                    <span className="text-dark-400 text-[10px]">({exitInfo.time}ms)</span>
                  )}
                </span>
              )}
            </div>
          ) : null}

          {/* Action Buttons */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            title="Copy Terminal Output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClearTerminal}
            className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal View Body */}
      <div 
        ref={terminalBodyRef}
        className="flex-1 p-4 overflow-auto font-mono text-[13px] leading-relaxed bg-[#0d1117] text-dark-100 flex flex-col justify-between min-h-[220px]"
      >
        {isHtml && activeTab === 'preview' ? (
          <iframe
            srcDoc={sourceCode}
            title="HTML Preview Sandbox"
            sandbox="allow-scripts"
            className="w-full h-full min-h-[300px] bg-white rounded-lg border border-dark-700"
          />
        ) : (
          <div className="space-y-1">
            {/* Welcoming prompt when terminal is empty */}
            {!terminalHistory && !isProcessActive && (
              <div className="text-dark-400 space-y-1.5">
                <div>
                  <span className="text-brand-400">PS CodeVault&gt;</span> Click <span className="text-white font-semibold">&quot;Run Code&quot;</span> to execute.
                </div>
                <div className="text-xs text-dark-500">
                  ⚡ 11 Languages Supported (Python, C, C++, Java, JS, TS, Go, Rust, Kotlin, SQL, HTML).
                </div>
              </div>
            )}

            {/* Printed Output History */}
            {terminalHistory && (
              <pre className="whitespace-pre-wrap font-mono text-dark-100 selection:bg-brand-500/30">
                {terminalHistory}
              </pre>
            )}

            {/* Live Interactive Input Line */}
            {isProcessActive && (
              <form onSubmit={handleSendInput} className="flex items-center gap-1 font-mono text-sm pt-0.5">
                <span className="text-emerald-400 font-bold shrink-0">&gt;</span>
                <input
                  ref={inputInputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type input here and press Enter..."
                  className="w-full bg-transparent border-none outline-none text-white font-mono placeholder-dark-600 selection:bg-brand-500"
                />
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

OutputTerminal.displayName = 'OutputTerminal';
