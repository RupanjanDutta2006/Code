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
} from 'lucide-react';
import { ExecuteResult } from '../services/api';

export interface OutputTerminalHandle {
  startInteractive: () => void;
  clear: () => void;
}

interface OutputTerminalProps {
  result?: ExecuteResult | null;
  isRunning?: boolean;
  language: string;
  sourceCode?: string;
  onClear?: () => void;
}

export const OutputTerminal = forwardRef<OutputTerminalHandle, OutputTerminalProps>(({
  result,
  isRunning = false,
  language,
  sourceCode = '',
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

  // Internal auto-scroll ONLY within the terminal body (never scrolls the outer window/page)
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Sync result from batch runner if provided
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

  const handleStartInteractive = () => {
    if (!sourceCode.trim()) return;

    // Reset terminal & print launch command
    const prefix = getCommandPrefix(language);
    setTerminalHistory(`PS CodeVault> ${prefix}\n`);
    setCurrentInput('');
    setExitInfo(null);
    setIsProcessActive(true);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/execute`;

    if (socketRef.current) {
      try { socketRef.current.close(); } catch (e) {}
    }

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'run',
        language,
        source_code: sourceCode,
      }));
      // Focus input without triggering window scroll
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
      setIsProcessActive(false);
    };

    ws.onerror = (err) => {
      console.error('WebSocket connection error:', err);
      setIsProcessActive(false);
    };
  };

  const handleSendInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    // Send input line to process
    socketRef.current.send(JSON.stringify({
      action: 'stdin',
      data: currentInput + '\n',
    }));
    // Echo entered input line to terminal history
    setTerminalHistory((prev) => prev + currentInput + '\n');
    setCurrentInput('');
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

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    startInteractive: handleStartInteractive,
    clear: handleClearTerminal,
  }));

  const getCommandPrefix = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python': return 'python -u solution.py';
      case 'c': return 'gcc main.c -o main && ./main';
      case 'cpp': return 'g++ main.cpp -o main && ./main';
      case 'java': return 'javac Main.java && java Main';
      case 'javascript': return 'node index.js';
      case 'typescript': return 'node --strip-types index.ts';
      case 'sql': return 'sqlite3 :memory:';
      default: return `./runner`;
    }
  };

  return (
    <div 
      className="w-full rounded-xl overflow-hidden border border-dark-700 bg-[#0d1117] shadow-2xl flex flex-col h-full min-h-[340px] cursor-text"
      onClick={() => inputInputRef.current?.focus({ preventScroll: true })}
    >
      {/* VS Code Style Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-dark-750 select-none cursor-default">
        <div className="flex items-center gap-3">
          {isHtml ? (
            <div className="flex items-center gap-1 bg-dark-900 p-0.5 rounded-lg border border-dark-700 text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                  activeTab === 'preview' ? 'bg-brand-600 text-white font-medium' : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                  activeTab === 'terminal' ? 'bg-brand-600 text-white font-medium' : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                Terminal
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-dark-200 ml-2 font-medium">
                <TerminalIcon className="w-3.5 h-3.5 text-brand-400" />
                <span>TERMINAL</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons & Status */}
        <div className="flex items-center gap-2">
          {isProcessActive && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Running</span>
              <button
                onClick={handleStopProcess}
                className="ml-2 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] flex items-center gap-1 hover:bg-rose-500/30 transition-colors"
                title="Stop execution (Ctrl+C)"
              >
                <Square className="w-3 h-3 fill-rose-400" />
                <span>Stop</span>
              </button>
            </div>
          )}

          {exitInfo && !isProcessActive && (
            <span className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${
              exitInfo.status === 'success' || exitInfo.code === 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {exitInfo.status === 'success' || exitInfo.code === 0 ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              {exitInfo.status === 'success' || exitInfo.code === 0 ? 'Finished' : 'Exited'}{' '}
              {exitInfo.time ? `(${exitInfo.time} ms)` : ''}
            </span>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            title="Copy terminal output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleClearTerminal}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal View Body */}
      <div 
        ref={terminalBodyRef}
        className="flex-1 p-4 overflow-auto font-mono text-[13px] leading-relaxed bg-[#0d1117] text-dark-100 flex flex-col justify-between"
      >
        {isHtml && activeTab === 'preview' ? (
          <iframe
            srcDoc={sourceCode}
            title="HTML Preview Sandbox"
            sandbox="allow-scripts"
            className="w-full h-full min-h-[280px] bg-white rounded-lg border border-dark-700"
          />
        ) : (
          <div className="space-y-1">
            {/* If terminal history is empty, show welcoming prompt */}
            {!terminalHistory && !isProcessActive && (
              <div className="text-dark-400 space-y-1.5">
                <div>
                  <span className="text-brand-400">PS CodeVault&gt;</span> Click <span className="text-white font-semibold">&quot;Run Code&quot;</span> to start interactive execution.
                </div>
                <div className="text-xs text-dark-500">
                  ⚡ Interactive input works like VS Code: when your code asks for <code className="text-dark-300">input()</code>, type directly in the terminal and press Enter.
                </div>
              </div>
            )}

            {/* Printed Output History */}
            {terminalHistory && (
              <pre className="whitespace-pre-wrap font-mono text-dark-100 selection:bg-brand-500/30">
                {terminalHistory}
              </pre>
            )}

            {/* Live Interactive Input Line when process is active */}
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
