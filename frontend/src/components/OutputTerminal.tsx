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
  Zap,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { ExecuteResult } from '../services/api';
import { executeUniversal, getCommandDisplay, stopExecution } from '../services/compilerEngine';

export interface OutputTerminalHandle {
  startInteractive: (codeOverride?: string, langOverride?: string, stdinOverride?: string) => void;
  stop: () => void;
  clear: () => void;
  setStdin: (stdin: string) => void;
}

interface OutputTerminalProps {
  result?: ExecuteResult | null;
  isRunning?: boolean;
  language: string;
  sourceCode?: string;
  stdin?: string;
  onClear?: () => void;
  onStop?: () => void;
  onStdinChange?: (stdin: string) => void;
}

export const OutputTerminal = forwardRef<OutputTerminalHandle, OutputTerminalProps>(({
  result,
  isRunning = false,
  language,
  sourceCode = '',
  stdin: initialStdin = '',
  onClear,
  onStop,
  onStdinChange,
}, ref) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'stdin' | 'preview'>(
    language.toLowerCase() === 'html' ? 'preview' : 'terminal'
  );

  // Terminal history & STDIN input state
  const [terminalHistory, setTerminalHistory] = useState<string>('');
  const [stdinValue, setStdinValue] = useState<string>(initialStdin);
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

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const sourceCodeRef = useRef(sourceCode);
  const languageRef = useRef(language);
  const stdinValueRef = useRef(stdinValue);
  const isExecutingRef = useRef(false);

  useEffect(() => { sourceCodeRef.current = sourceCode; }, [sourceCode]);
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { stdinValueRef.current = stdinValue; }, [stdinValue]);

  useEffect(() => {
    if (initialStdin !== undefined && initialStdin !== stdinValue) {
      setStdinValue(initialStdin);
    }
  }, [initialStdin]);

  const isHtml = language.toLowerCase() === 'html';

  useEffect(() => {
    if (language.toLowerCase() === 'html') {
      setActiveTab('preview');
    }
  }, [language]);

  // Auto-scroll terminal to bottom whenever output updates
  useEffect(() => {
    if (terminalBodyRef.current && activeTab === 'terminal') {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory, activeTab]);

  // Sync external result from props if provided (and not during internal execution)
  useEffect(() => {
    if (result && !isExecutingRef.current) {
      const outputText = result.output || result.stdout || '';
      const errorText = result.error || result.stderr || '';
      const combined = (outputText ? outputText + '\n' : '') + (errorText ? errorText + '\n' : '');

      setTerminalHistory(combined);
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

  const handleStdinTextChange = (val: string) => {
    setStdinValue(val);
    if (onStdinChange) onStdinChange(val);
  };

  /**
   * Execute code cleanly with buffered STDIN
   */
  const executeWithStdin = async (codeToSend?: string, langToSend?: string, stdinToSend?: string) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;

    const effectiveCode = codeToSend !== undefined ? codeToSend : sourceCodeRef.current;
    const effectiveLang = langToSend !== undefined ? langToSend : languageRef.current;
    const effectiveStdin = stdinToSend !== undefined ? stdinToSend : stdinValueRef.current;

    const execId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setActiveExecutionId(execId);
    setIsProcessActive(true);
    setActiveTab('terminal'); // Switch to terminal view

    const prefix = `PS CodeVault> ${getCommandDisplay(effectiveLang)}\n`;
    setTerminalHistory(prefix + `[Compiling & running in cloud sandbox...]\n`);
    setExitInfo(null);

    try {
      const resp = await executeUniversal({
        language: effectiveLang,
        sourceCode: effectiveCode,
        customInput: effectiveStdin,
        stdin: effectiveStdin,
        executionId: execId,
      });

      const timeMs = resp.execution_time_ms;
      const timeSec = resp.executionTime !== undefined ? resp.executionTime : Math.round(timeMs) / 1000.0;
      const memKb = resp.memory || 8192;
      const memMb = (memKb / 1024).toFixed(1);
      const exitCode = resp.exitCode ?? (resp.status === 'success' ? 0 : 1);

      const rawStdout = (resp.stdout || resp.output || '').trimEnd();
      const rawStderr = (resp.stderr || resp.error || '').trimEnd();

      // Format clean output transcript (NO DUPLICATION)
      let formattedOutput = prefix;
      if (rawStdout) {
        formattedOutput += rawStdout + '\n';
      }
      if (rawStderr) {
        formattedOutput += (rawStdout ? '\n' : '') + rawStderr + '\n';
      }
      if (!rawStdout && !rawStderr) {
        formattedOutput += '[Process executed with no console output]\n';
      }

      const statusTag = exitCode === 0 ? '✓ Process finished — Exit 0' : `✕ Process completed with exit code ${exitCode}`;
      formattedOutput += `\n[${statusTag} | Time: ${timeSec}s (${timeMs}ms) | Memory: ${memMb} MB]\nPS CodeVault> `;

      setTerminalHistory(formattedOutput);
      setExitInfo({
        status: resp.status,
        code: exitCode,
        timeMs,
        timeSec,
        memoryKb: memKb,
        errorType: resp.error_type,
      });
    } catch (err: any) {
      setTerminalHistory((prev) => prev + `\n[Execution Error: ${err.message || 'Unknown error'}]\nPS CodeVault> `);
      setExitInfo({ status: 'error', code: 1, timeMs: 0, timeSec: 0, memoryKb: 0 });
    } finally {
      isExecutingRef.current = false;
      setIsProcessActive(false);
      if (onStop) onStop();
    }
  };

  const handleStartInteractive = (codeOverride?: string, langOverride?: string, stdinOverride?: string) => {
    const activeCode = codeOverride !== undefined ? codeOverride : sourceCodeRef.current;
    const activeLang = langOverride !== undefined ? langOverride : languageRef.current;
    const activeStdin = stdinOverride !== undefined ? stdinOverride : stdinValueRef.current;

    if (!activeCode.trim()) return;

    if (activeLang.toLowerCase() === 'html') {
      setActiveTab('preview');
      setTerminalHistory(`PS CodeVault> ${getCommandDisplay(activeLang)}\n[HTML Live Preview Rendered Successfully]\nPS CodeVault> `);
      setExitInfo({ status: 'success', code: 0, timeMs: 5, timeSec: 0.005, memoryKb: 4096 });
      setIsProcessActive(false);
      if (onStop) onStop();
      return;
    }

    executeWithStdin(activeCode, activeLang, activeStdin);
  };

  const handleStopProcess = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeExecutionId) {
      stopExecution(activeExecutionId);
    }
    isExecutingRef.current = false;
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
    setExitInfo(null);
    if (onClear) onClear();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalHistory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useImperativeHandle(ref, () => ({
    startInteractive: (codeOverride?: string, langOverride?: string, stdinOverride?: string) => {
      handleStartInteractive(codeOverride, langOverride, stdinOverride);
    },
    stop: handleStopProcess,
    clear: handleClearTerminal,
    setStdin: (val: string) => handleStdinTextChange(val),
  }));

  const memMb = exitInfo?.memoryKb ? (exitInfo.memoryKb / 1024).toFixed(1) : null;
  const stdinLineCount = stdinValue.trim() ? stdinValue.trim().split('\n').length : 0;

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
            {/* TERMINAL TAB */}
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

            {/* STDIN INPUT TAB */}
            <button
              onClick={() => setActiveTab('stdin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'stdin'
                  ? 'bg-brand-600/80 text-white shadow-sm'
                  : 'text-slate-400 dark:text-dark-400 hover:text-white'
              }`}
              title="Configure Standard Input (STDIN) before running"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>INPUT (STDIN)</span>
              {stdinLineCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {stdinLineCount}
                </span>
              )}
            </button>

            {/* PREVIEW TAB FOR HTML */}
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
                  <span>Exit {exitInfo.code ?? 1}</span>
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

      {/* STDIN INPUT TAB CONTENT */}
      {activeTab === 'stdin' && (
        <div className="flex-1 flex flex-col p-4 bg-slate-950 text-slate-200 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Standard Input (STDIN)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Passed to <code className="text-brand-300">scanf</code>, <code className="text-brand-300">cin</code>, <code className="text-brand-300">input()</code>, <code className="text-brand-300">Scanner</code>
            </span>
          </div>

          <textarea
            value={stdinValue}
            onChange={(e) => handleStdinTextChange(e.target.value)}
            placeholder={`Enter input values here before clicking Run...\nExample:\n5\n10\n25\n7\n99\n42`}
            className="flex-1 w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono outline-none focus:border-brand-500 transition-colors resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{stdinLineCount} line(s) configured</span>
            <button
              onClick={() => setActiveTab('terminal')}
              className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
            >
              Switch to Terminal ➔
            </button>
          </div>
        </div>
      )}

      {/* HTML PREVIEW CONTENT */}
      {activeTab === 'preview' && isHtml && (
        <div className="flex-1 bg-white p-2">
          <iframe
            srcDoc={sourceCode}
            title="HTML Live Preview"
            className="w-full h-full border-0 rounded-lg"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      )}

      {/* TERMINAL CONTENT */}
      {activeTab === 'terminal' && (
        <div
          ref={terminalBodyRef}
          className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-y-auto bg-slate-950 select-text"
        >
          {terminalHistory ? (
            <div className="whitespace-pre-wrap font-mono leading-relaxed text-slate-200">
              {terminalHistory}
            </div>
          ) : (
            <div className="text-slate-500 select-none flex flex-col items-center justify-center h-full gap-2">
              <TerminalIcon className="w-8 h-8 opacity-40" />
              <p>Ready to run code. Click "Run Code" or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[10px]">Ctrl+Enter</kbd></p>
              {stdinLineCount > 0 && (
                <span className="text-[11px] text-brand-400">
                  ✓ {stdinLineCount} line(s) of STDIN ready in Input tab
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
