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
  Clock,
  Zap
} from 'lucide-react';
import { ExecuteResult } from '../services/api';
import { executeUniversal, getCommandDisplay, stopExecution } from '../services/compilerEngine';

export interface OutputTerminalHandle {
  startInteractive: (codeOverride?: string, langOverride?: string) => void;
  stop: () => void;
  clear: () => void;
}

interface OutputTerminalProps {
  result?: ExecuteResult | null;
  isRunning?: boolean;
  language: string;
  sourceCode?: string;
  onClear?: () => void;
  onStop?: () => void;
}

/**
 * Detects if a cloud/batch execution paused because it reached an input() statement
 */
function isWaitingForInput(stderr?: string, output?: string): boolean {
  if (!stderr && !output) return false;
  const combined = (stderr || '') + ' ' + (output || '');
  return (
    combined.includes('EOFError: EOF when reading a line') ||
    combined.includes('EOFError') ||
    combined.includes('NoSuchElementException') ||
    combined.includes('java.util.NoSuchElementException') ||
    combined.includes('unexpected end of file')
  );
}

/**
 * Formats multi-step interactive prompts and user inputs into a continuous terminal transcript
 */
function buildInteractiveTranscript(prefix: string, rawStdout: string, inputs: string[]): string {
  if (!rawStdout && inputs.length === 0) return prefix;

  let result = prefix;
  let remaining = rawStdout || '';

  for (let i = 0; i < inputs.length; i++) {
    const inp = inputs[i];
    const match = remaining.match(/^(.*?(?::|\?|>|\$|\n))/s);
    if (match && match[1]) {
      result += match[1].trimEnd() + ' ' + inp + '\n';
      remaining = remaining.slice(match[1].length).replace(/^\s+/, '');
    } else {
      result += inp + '\n';
    }
  }

  if (remaining) {
    result += remaining;
  }

  return result;
}

export const OutputTerminal = forwardRef<OutputTerminalHandle, OutputTerminalProps>(({
  result,
  isRunning = false,
  language,
  sourceCode = '',
  onClear,
  onStop,
}, ref) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'preview'>(
    language.toLowerCase() === 'html' ? 'preview' : 'terminal'
  );

  // Interactive terminal states
  const [terminalHistory, setTerminalHistory] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isProcessActive, setIsProcessActive] = useState<boolean>(false);
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);
  const [exitInfo, setExitInfo] = useState<{
    status: string;
    code?: number;
    timeMs?: number;
    timeSec?: number;
    memoryKb?: number;
    errorType?: string;
  } | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputInputRef = useRef<HTMLInputElement>(null);

  const sessionInputsRef = useRef<string[]>([]);
  const sourceCodeRef = useRef(sourceCode);
  const languageRef = useRef(language);

  useEffect(() => { sourceCodeRef.current = sourceCode; }, [sourceCode]);
  useEffect(() => { languageRef.current = language; }, [language]);

  const isHtml = language.toLowerCase() === 'html';

  useEffect(() => {
    if (language.toLowerCase() === 'html') {
      setActiveTab('preview');
    }
  }, [language]);

  // Auto-scroll terminal to bottom whenever output or input updates
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory, currentInput, isProcessActive]);

  // Focus input whenever process is active and on any output update
  useEffect(() => {
    if (isProcessActive) {
      setTimeout(() => {
        inputInputRef.current?.focus({ preventScroll: true });
      }, 30);
    }
  }, [isProcessActive, terminalHistory]);

  // Sync external result from props if provided
  useEffect(() => {
    if (result) {
      if (result.output) {
        setTerminalHistory((prev) => prev + result.output + '\n');
      }
      if (result.error) {
        setTerminalHistory((prev) => prev + result.error + '\n');
      }
      const timeMs = result.execution_time_ms;
      const timeSec = result.executionTime !== undefined ? result.executionTime : Math.round(timeMs) / 1000.0;
      setExitInfo({
        status: result.status,
        code: result.exitCode ?? (result.status === 'success' ? 0 : 1),
        timeMs,
        timeSec,
        memoryKb: result.memory || 8192,
        errorType: result.error_type,
      });
      setIsProcessActive(false);
      if (onStop) onStop();
    }
  }, [result]);

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        try { socketRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  const executeFallback = async (inputs: string[], codeToSend?: string, langToSend?: string) => {
    const effectiveCode = codeToSend !== undefined ? codeToSend : sourceCodeRef.current;
    const effectiveLang = langToSend !== undefined ? langToSend : languageRef.current;
    const inputPayload = inputs.join('\n') + (inputs.length > 0 ? '\n' : '');
    const execId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setActiveExecutionId(execId);

    const prefix = `PS CodeVault> ${getCommandDisplay(effectiveLang)}\n`;

    try {
      const resp = await executeUniversal({
        language: effectiveLang,
        sourceCode: effectiveCode,
        customInput: inputPayload,
        stdin: inputPayload,
        executionId: execId,
      });

      const timeMs = resp.execution_time_ms;
      const timeSec = resp.executionTime !== undefined ? resp.executionTime : Math.round(timeMs) / 1000.0;
      const memKb = resp.memory || 8192;
      const memMb = (memKb / 1024).toFixed(1);

      // 1. Check if the program is waiting for more interactive user input (e.g. Python input(), C scanf)
      if (isWaitingForInput(resp.stderr || resp.error, resp.stdout || resp.output)) {
        const rawStdout = resp.stdout || resp.output || '';
        const transcript = buildInteractiveTranscript(prefix, rawStdout, inputs);
        setTerminalHistory(transcript);
        setIsProcessActive(true);
        setTimeout(() => {
          inputInputRef.current?.focus({ preventScroll: true });
        }, 50);
        return;
      }

      // 2. Program finished successfully
      if (resp.status === 'success') {
        const rawStdout = resp.output || resp.stdout || '';
        const transcript = buildInteractiveTranscript(prefix, rawStdout, inputs);
        const separator = transcript.endsWith('\n') ? '' : '\n';
        setTerminalHistory(
          transcript +
          separator +
          `\n[✓ Process finished — Exit 0 | Time: ${timeSec}s (${timeMs}ms) | Memory: ${memMb} MB]\nPS CodeVault> `
        );
        setExitInfo({
          status: 'success',
          code: 0,
          timeMs,
          timeSec,
          memoryKb: memKb,
        });
        setIsProcessActive(false);
        if (onStop) onStop();
        return;
      }

      // 3. Timeout
      if (resp.status === 'timeout' || resp.status === 'tle') {
        const transcript = buildInteractiveTranscript(prefix, resp.output || '', inputs);
        setTerminalHistory(
          transcript +
          `\n⏱ Time Limit Exceeded\nYour program exceeded the 5 second time limit.\n\n[Process terminated with exit code 124 in ${timeSec}s]\nPS CodeVault> `
        );
        setExitInfo({
          status: 'timeout',
          code: 124,
          timeMs,
          timeSec,
          memoryKb: memKb,
          errorType: 'TimeLimitExceeded',
        });
        setIsProcessActive(false);
        if (onStop) onStop();
        return;
      }

      // 4. Real Runtime / Compilation Error
      const errorText = resp.error || resp.stderr || resp.output || 'Unknown Error';
      const transcript = buildInteractiveTranscript(prefix, resp.stdout || '', inputs);
      setTerminalHistory(
        transcript +
        (transcript.endsWith('\n') ? '' : '\n') +
        errorText +
        (errorText.endsWith('\n') ? '' : '\n') +
        `\n[✕ Process completed with exit code ${resp.exitCode ?? 1} in ${timeSec}s | Memory: ${memMb} MB]\nPS CodeVault> `
      );
      setExitInfo({
        status: 'error',
        code: resp.exitCode ?? 1,
        timeMs,
        timeSec,
        memoryKb: memKb,
        errorType: resp.error_type,
      });
      setIsProcessActive(false);
      if (onStop) onStop();
    } catch (err: any) {
      setTerminalHistory((prev) => prev + `\n[Execution Error: ${err.message || 'Unknown error'}]\nPS CodeVault> `);
      setExitInfo({ status: 'error', code: 1, timeMs: 0, timeSec: 0, memoryKb: 0 });
      setIsProcessActive(false);
      if (onStop) onStop();
    }
  };

  const handleStartInteractive = (codeOverride?: string, langOverride?: string) => {
    const activeCode = codeOverride !== undefined ? codeOverride : sourceCodeRef.current;
    const activeLang = langOverride !== undefined ? langOverride : languageRef.current;

    if (!activeCode.trim()) return;

    if (activeLang.toLowerCase() === 'html') {
      setActiveTab('preview');
      setTerminalHistory(`PS CodeVault> ${getCommandDisplay(activeLang)}\n[HTML Live Preview Rendered Successfully]\nPS CodeVault> `);
      setExitInfo({ status: 'success', code: 0, timeMs: 5, timeSec: 0.005, memoryKb: 4096 });
      setIsProcessActive(false);
      if (onStop) onStop();
      return;
    }

    // Safely tear down previous WebSocket connection and listeners
    if (socketRef.current) {
      const oldWs = socketRef.current;
      oldWs.onopen = null;
      oldWs.onmessage = null;
      oldWs.onerror = null;
      oldWs.onclose = null;
      try {
        if (oldWs.readyState === WebSocket.OPEN) {
          oldWs.send(JSON.stringify({ action: 'kill' }));
        }
        oldWs.close();
      } catch (e) {}
      socketRef.current = null;
    }

    sessionInputsRef.current = [];
    setCurrentInput('');
    setExitInfo(null);
    setIsProcessActive(true);
    setActiveTab('terminal');

    const customWsUrl = import.meta.env.VITE_WS_URL;
    const customApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    let wsUrl = '';

    if (customWsUrl) {
      const baseWs = customWsUrl.replace(/\/+$/, '');
      wsUrl = baseWs.endsWith('/ws/execute') ? baseWs : `${baseWs}/ws/execute`;
    } else if (customApiUrl) {
      const baseWs = customApiUrl.replace(/^http/, 'ws').replace(/\/+$/, '');
      wsUrl = `${baseWs}/ws/execute`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsUrl = `${protocol}//${host}/ws/execute`;
    }

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (socketRef.current !== ws) return;

        const prefix = getCommandDisplay(activeLang);
        setTerminalHistory(`PS CodeVault> ${prefix}\n`);
        setIsProcessActive(true);

        ws.send(JSON.stringify({
          action: 'run',
          language: activeLang,
          source_code: activeCode,
        }));

        setTimeout(() => {
          inputInputRef.current?.focus({ preventScroll: true });
        }, 50);
      };

      ws.onmessage = (event) => {
        if (socketRef.current !== ws) return;

        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'stdout' || msg.type === 'stderr') {
            setTerminalHistory((prev) => prev + msg.data);
            setIsProcessActive(true);
          } else if (msg.type === 'finished') {
            setIsProcessActive(false);
            if (onStop) onStop();

            const timeMs = msg.execution_time_ms || 0;
            const timeSec = msg.executionTime !== undefined ? msg.executionTime : Math.round(timeMs) / 1000.0;
            const memKb = msg.memory || 8192;
            const memMb = (memKb / 1024).toFixed(1);
            const exitCode = msg.exitCode !== undefined ? msg.exitCode : (msg.exit_code ?? 0);

            setExitInfo({
              status: msg.status,
              code: exitCode,
              timeMs,
              timeSec,
              memoryKb: memKb,
              errorType: msg.error_type,
            });

            setTerminalHistory((prev) => {
              const separator = prev.endsWith('\n') ? '' : '\n';
              const statusTag = exitCode === 0 ? '✓ Process finished' : '✕ Process completed';
              return (
                prev +
                separator +
                `\n[${statusTag} with exit code ${exitCode} in ${timeSec}s (${timeMs}ms) | Memory: ${memMb} MB]\nPS CodeVault> `
              );
            });
          }
        } catch (err) {
          console.error('Terminal WS parse error:', err);
        }
      };

      ws.onclose = () => {
        if (socketRef.current === ws) {
          setIsProcessActive(false);
          if (onStop) onStop();
        }
      };

      ws.onerror = (err) => {
        console.warn('WebSocket connection unavailable, using interactive cloud runner...', err);
        if (socketRef.current === ws) {
          executeFallback([], activeCode, activeLang);
        }
      };
    } catch (err) {
      executeFallback([], activeCode, activeLang);
    }
  };

  const handleSendInput = (e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = currentInput;
    setCurrentInput('');

    // Append typed input directly to terminal text history
    setTerminalHistory((prev) => prev + inputVal + '\n');

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'stdin',
        data: inputVal + '\n',
      }));
    } else {
      sessionInputsRef.current.push(inputVal);
      executeFallback(sessionInputsRef.current);
    }

    // Keep focus in input
    setTimeout(() => {
      inputInputRef.current?.focus({ preventScroll: true });
    }, 30);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendInput(e);
    } else if (e.key === 'c' && e.ctrlKey) {
      handleStopProcess();
    }
  };

  const handleStopProcess = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'kill' }));
    }
    if (activeExecutionId) {
      stopExecution(activeExecutionId);
    }
    setIsProcessActive(false);
    setTerminalHistory((prev) => prev + '\n^C\n[Process terminated by user]\nPS CodeVault> ');
    setExitInfo({
      status: 'error',
      code: 130,
      timeMs: 0,
      timeSec: 0,
      memoryKb: 0,
      errorType: 'UserCancelled',
    });
    if (onStop) onStop();
  };

  const handleClearTerminal = () => {
    setTerminalHistory('');
    setCurrentInput('');
    sessionInputsRef.current = [];
    setExitInfo(null);
    if (onClear) onClear();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalHistory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useImperativeHandle(ref, () => ({
    startInteractive: (codeOverride?: string, langOverride?: string) => {
      handleStartInteractive(codeOverride, langOverride);
    },
    stop: handleStopProcess,
    clear: handleClearTerminal,
  }));

  const memMb = exitInfo?.memoryKb ? (exitInfo.memoryKb / 1024).toFixed(1) : null;

  return (
    <div className="flex flex-col h-full liquid-glass rounded-2xl overflow-hidden shadow-2xl transition-colors">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 dark:bg-dark-950/80 border-b border-slate-700/80 dark:border-dark-800/80 select-none backdrop-blur-sm">
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
                  ? 'bg-slate-700 dark:bg-dark-800 text-white shadow-sm'
                  : 'text-slate-400 dark:text-dark-400 hover:text-white'
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
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 dark:text-dark-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>LIVE PREVIEW</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-2">
          {/* Running State */}
          {(isProcessActive || isRunning) && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[11px] font-mono text-blue-400 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Running {language}...</span>
              </span>
              <button
                onClick={() => handleStopProcess()}
                className="px-2 py-0.5 rounded-md bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
                title="Stop process (Ctrl+Shift+K)"
              >
                <Square className="w-2.5 h-2.5 fill-red-400" />
                <span>Stop</span>
              </button>
            </div>
          )}

          {/* Success / Error Badges */}
          {!isProcessActive && !isRunning && exitInfo && (
            <div className="flex items-center gap-1.5">
              {exitInfo.status === 'timeout' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Time Limit Exceeded</span>
                </span>
              ) : exitInfo.status === 'mle' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span>Memory Limit Exceeded</span>
                </span>
              ) : exitInfo.code === 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Exit 0</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span>Exit {exitInfo.code ?? 1} {exitInfo.errorType ? `(${exitInfo.errorType})` : ''}</span>
                </span>
              )}

              {exitInfo.timeSec !== undefined && (
                <span className="text-[11px] font-mono text-slate-400">
                  {exitInfo.timeSec}s
                </span>
              )}

              {memMb && (
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  • {memMb}MB
                </span>
              )}
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-dark-800 transition-colors"
            title="Copy output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClearTerminal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 dark:hover:bg-dark-800 transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Area */}
      {activeTab === 'preview' && isHtml ? (
        <div className="flex-1 bg-white p-2">
          <iframe
            srcDoc={sourceCode}
            title="HTML Live Preview"
            className="w-full h-full border-0 rounded-lg"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      ) : (
        <div
          ref={terminalBodyRef}
          onClick={() => {
            if (isProcessActive) {
              inputInputRef.current?.focus({ preventScroll: true });
            }
          }}
          className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-y-auto bg-slate-950 select-text cursor-text"
        >
          {terminalHistory ? (
            <div className="whitespace-pre-wrap font-mono leading-relaxed text-slate-200 inline">
              {terminalHistory}
            </div>
          ) : (
            <div className="text-slate-500 select-none flex flex-col items-center justify-center h-full gap-2">
              <TerminalIcon className="w-8 h-8 opacity-40" />
              <p>Ready to run code. Click "Run Code" or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[10px]">Ctrl+Enter</kbd></p>
            </div>
          )}

          {/* Inline Interactive STDIN input styled as in-place shell typing */}
          {isProcessActive && (
            <form onSubmit={handleSendInput} className="inline-flex items-center align-baseline">
              <input
                ref={inputInputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-transparent border-none outline-none text-emerald-400 font-mono text-xs focus:ring-0 p-0 m-0 inline-block"
                style={{ width: `${Math.max(1, currentInput.length + 1)}ch` }}
              />
              <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
            </form>
          )}
        </div>
      )}
    </div>
  );
});
