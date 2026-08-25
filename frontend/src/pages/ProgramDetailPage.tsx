import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Copy, 
  Check, 
  History, 
  BarChart3, 
  Users, 
  Save, 
  ArrowLeft, 
  Folder, 
  User, 
  Clock, 
  Lock, 
  Globe, 
  Share2 
} from 'lucide-react';
import { api, Program, ExecuteResult } from '../services/api';
import { CodeEditor } from '../components/CodeEditor';
import { OutputTerminal, OutputTerminalHandle } from '../components/OutputTerminal';
import { PracticeJudge } from '../components/PracticeJudge';
import { AIAssistPanel } from '../components/AIAssistPanel';
import { VersionHistory } from '../components/VersionHistory';
import { AnalyticsModal } from '../components/AnalyticsModal';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';

export const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline, queueRun } = useOffline();

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [sourceCode, setSourceCode] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecuteResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [saving, setSaving] = useState(false);
  const terminalRef = useRef<OutputTerminalHandle>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;
      try {
        const res = await api.get<Program>(`/api/programs/${id}`);
        if (res.data && res.data.source_code) {
          setProgram(res.data);
          setSourceCode(res.data.source_code);
        } else {
          const { getLocalProgramById } = await import('../services/defaultPrograms');
          const local = getLocalProgramById(Number(id));
          if (local) {
            setProgram(local);
            setSourceCode(local.source_code);
          }
        }
      } catch (err) {
        const { getLocalProgramById } = await import('../services/defaultPrograms');
        const local = getLocalProgramById(Number(id));
        if (local) {
          setProgram(local);
          setSourceCode(local.source_code);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  const handleRunCode = async () => {
    if (!program) return;

    if (!isOnline) {
      queueRun({
        language: program.language,
        sourceCode,
        programId: program.id,
      });
      setResult({
        status: 'success',
        output: "You are currently offline.\nYour run has been queued and will execute automatically when you're back online.",
        execution_time_ms: 0,
      });
      return;
    }

    if (terminalRef.current) {
      setRunning(true);
      terminalRef.current.startInteractive(sourceCode, program.language);
      api.post('/api/analytics/events', {
        event_type: 'run',
        program_id: program.id,
      }).catch(() => {});
    }
  };

  const handleStopCode = () => {
    if (terminalRef.current) {
      terminalRef.current.stop();
      setRunning(false);
    }
  };

  const handleResetCode = () => {
    if (program) {
      setSourceCode(program.source_code);
      if (terminalRef.current) {
        terminalRef.current.clear();
      }
      setResult(null);
      setRunning(false);
    }
  };

  // Keyboard shortcuts: Ctrl+Enter to Run, Ctrl+Shift+K to Stop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        handleStopCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [program, sourceCode, isOnline]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyToPlayground = async () => {
    if (!program) return;
    try {
      const res = await api.post<{ id: string }>('/api/playground', {
        source_program_id: program.id,
        source_code: sourceCode,
        language: program.language,
        title: `Playground: ${program.title}`,
      });
      navigate(`/playground/${res.data.id}`);
    } catch (err) {
      console.error('Failed to open playground:', err);
    }
  };

  const handleSaveProgram = async () => {
    if (!program || !user || program.user_id !== user.id) return;
    setSaving(true);
    try {
      const res = await api.put<Program>(`/api/programs/${program.id}`, {
        source_code: sourceCode,
        commit_message: 'Updated program source code',
      });
      setProgram(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save program:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-light-textMuted dark:text-dark-400 font-semibold animate-pulse">
        Loading program workspace...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-24 text-center text-light-textSecondary dark:text-dark-300">
        Program not found or private.
      </div>
    );
  }

  const isAuthor = user?.id === program.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 mesh-gradient-bg min-h-screen transition-colors duration-200">
      {/* Top Breadcrumb & Metadata Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-light-border dark:border-[#1b223c]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link
              to="/programs"
              className="p-2 rounded-xl text-light-textMuted hover:text-light-textStrong hover:bg-light-secondary dark:text-dark-400 dark:hover:text-white dark:hover:bg-dark-850 border border-light-border dark:border-transparent dark:hover:border-[#1b223c] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-3xl font-extrabold text-light-textStrong dark:text-white tracking-tight font-sans">
              {program.title}
            </h1>
            <span className="px-3 py-1 rounded-xl bg-light-blueSoft text-light-blue border border-light-blueBorder/40 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30 text-xs font-mono font-bold uppercase">
              {program.language}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-light-textSecondary dark:text-dark-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Folder className="w-3.5 h-3.5 text-light-blue dark:text-indigo-400" />
              {program.category}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-light-blue dark:text-indigo-400" />
              By {program.author_username || 'Anonymous'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-light-blue dark:text-indigo-400" />
              Updated {new Date(program.updated_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              {program.is_public ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Public
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Private
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isAuthor && (
            <button
              onClick={handleSaveProgram}
              disabled={saving}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Version'}</span>
            </button>
          )}

          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-light-secondary text-light-textNormal hover:text-light-textStrong dark:bg-dark-900 dark:hover:bg-dark-850 dark:text-dark-200 dark:hover:text-white text-xs font-bold border border-light-border dark:border-[#1b223c] transition-colors flex items-center gap-1.5 shadow-card-light"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={() => setShowVersions(true)}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-light-secondary text-light-textNormal hover:text-light-textStrong dark:bg-dark-900 dark:hover:bg-dark-850 dark:text-dark-200 dark:hover:text-white text-xs font-bold border border-light-border dark:border-[#1b223c] transition-colors flex items-center gap-1.5 shadow-card-light"
          >
            <History className="w-4 h-4 text-light-blue dark:text-purple-400" />
            <span>Past Versions ({program.versions?.length || 1})</span>
          </button>

          {isAuthor && (
            <button
              onClick={() => setShowStats(true)}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-light-secondary text-light-textNormal hover:text-light-textStrong dark:bg-dark-900 dark:hover:bg-dark-850 dark:text-dark-200 dark:hover:text-white text-xs font-bold border border-light-border dark:border-[#1b223c] transition-colors flex items-center gap-1.5 shadow-card-light"
            >
              <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Stats</span>
            </button>
          )}

          <button
            onClick={handleCopyToPlayground}
            className="px-4 py-2 rounded-2xl bg-light-blueSoft hover:bg-light-blue/15 text-light-blue dark:bg-purple-600/20 dark:hover:bg-purple-600/30 dark:text-purple-300 text-xs font-bold border border-light-blueBorder/40 dark:border-purple-500/40 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-light-blue dark:text-purple-400" />
            <span>Playground</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Editor + Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Code Editor */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-light-textSecondary dark:text-dark-300 uppercase tracking-wider font-mono">
              Source Code
            </span>
            <span className="text-[11px] text-light-textMuted dark:text-dark-400 font-mono">
              Press <kbd className="px-1.5 py-0.5 bg-light-secondary dark:bg-dark-900 border border-light-border dark:border-[#1b223c] rounded text-light-blue dark:text-purple-300">Ctrl+Enter</kbd> to run
            </span>
          </div>

          <div className="h-[540px] rounded-3xl overflow-hidden border border-light-border dark:border-[#232b4b] shadow-card-light dark:shadow-2xl">
            <CodeEditor
              code={sourceCode}
              language={program.language}
              onChange={setSourceCode}
              height="540px"
              onRun={handleRunCode}
            />
          </div>
        </div>

        {/* Right Column: Output Terminal & Actions */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-light-textSecondary dark:text-dark-300 uppercase tracking-wider font-mono">
              Execution Output
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                className="px-3.5 py-1.5 rounded-xl bg-light-secondary dark:bg-dark-900 hover:bg-white dark:hover:bg-dark-850 text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white text-xs font-bold border border-light-border dark:border-[#1b223c] transition-all flex items-center gap-1.5 shadow-card-light"
                title="Reset code to original version"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {running ? (
                <button
                  onClick={handleStopCode}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5"
                  title="Stop execution (Ctrl+Shift+K)"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={handleRunCode}
                  className="px-5 py-1.5 rounded-xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple dark:hover:from-brand-600 dark:hover:to-purple-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
                  title="Run code (Ctrl+Enter)"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Program</span>
                </button>
              )}
            </div>
          </div>

          <div className="h-[540px] rounded-3xl overflow-hidden border border-light-border dark:border-[#232b4b] shadow-card-light dark:shadow-2xl">
            <OutputTerminal
              ref={terminalRef}
              result={result}
              isRunning={running}
              language={program.language}
              sourceCode={sourceCode}
              onClear={() => setResult(null)}
              onStop={() => setRunning(false)}
            />
          </div>
        </div>
      </div>

      {/* Practice & Contest Judge Panel */}
      <PracticeJudge
        programId={program.id}
        sourceCode={sourceCode}
        language={program.language}
        testCases={program.test_cases || []}
      />

      {/* CodeVault AI Assist Panel */}
      <AIAssistPanel
        sourceCode={sourceCode}
        language={program.language}
        lastError={result?.error}
        onCopyToPlayground={(code) => setSourceCode(code)}
      />

      {/* Version History Modal */}
      {showVersions && (
        <VersionHistory
          programId={program.id}
          language={program.language}
          onClose={() => setShowVersions(false)}
          onRestoreVersion={(code: string) => setSourceCode(code)}
        />
      )}

      {/* Analytics Modal */}
      {showStats && (
        <AnalyticsModal
          programId={program.id}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
};
