import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  Copy, 
  Check, 
  History, 
  BarChart3, 
  Users, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  Folder, 
  User, 
  Clock, 
  Layers, 
  Sparkles,
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
  const [customInput, setCustomInput] = useState('');
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
        customInput,
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
      terminalRef.current.startInteractive(sourceCode, program.language);
      // Record analytics run event asynchronously
      api.post('/api/analytics/events', {
        event_type: 'run',
        program_id: program.id,
      }).catch(() => {});
    }
  };

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
      <div className="py-24 text-center text-dark-400 font-medium">
        Loading program workspace...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-24 text-center text-dark-300">
        Program not found or private.
      </div>
    );
  }

  const isAuthor = user?.id === program.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Metadata Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dark-700/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Link
              to="/programs"
              className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {program.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/15 text-brand-300 border border-brand-500/30 text-xs font-mono font-bold uppercase">
              {program.language}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-dark-400">
            <span className="flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-dark-500" />
              {program.category}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-dark-500" />
              By {program.author_username || 'Anonymous'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-dark-500" />
              Updated {new Date(program.updated_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              {program.is_public ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Public
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Private
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {isAuthor && (
            <button
              onClick={handleSaveProgram}
              disabled={saving}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Version'}</span>
            </button>
          )}

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-dark-200 text-xs font-medium border border-dark-700 transition-colors flex items-center gap-1.5"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={() => setShowVersions(true)}
            className="px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-dark-200 text-xs font-medium border border-dark-700 transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-brand-400" />
            <span>Past Versions ({program.versions?.length || 1})</span>
          </button>

          {isAuthor && (
            <button
              onClick={() => setShowStats(true)}
              className="px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-dark-200 text-xs font-medium border border-dark-700 transition-colors flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Stats</span>
            </button>
          )}

          <button
            onClick={handleCopyToPlayground}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/40 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Copy to Playground</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Editor + Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Code Editor & Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider font-mono">
              Source Code
            </span>
            <span className="text-[11px] text-dark-400 font-mono">
              Press <kbd className="px-1 py-0.5 bg-dark-800 border border-dark-700 rounded text-dark-300">Ctrl+Enter</kbd> to run
            </span>
          </div>

          <div className="h-[530px]">
            <CodeEditor
              code={sourceCode}
              language={program.language}
              onChange={setSourceCode}
              height="530px"
              onRun={handleRunCode}
            />
          </div>
        </div>

        {/* Right Column: Output Terminal & Run Action */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider font-mono">
              Execution Output
            </span>

            <button
              onClick={handleRunCode}
              disabled={running}
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{running ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>

          <div className="h-[530px]">
            <OutputTerminal
              ref={terminalRef}
              result={result}
              isRunning={running}
              language={program.language}
              sourceCode={sourceCode}
              onClear={() => setResult(null)}
            />
          </div>
        </div>
      </div>

      {/* Practice & Check Judge Mode Section */}
      <section className="pt-2">
        <PracticeJudge
          programId={program.id}
          testCases={program.test_cases || []}
          sourceCode={sourceCode}
          language={program.language}
        />
      </section>

      {/* AI Assist Panel */}
      <section className="pt-2">
        <AIAssistPanel
          sourceCode={sourceCode}
          language={program.language}
          lastError={result?.error}
          onCopyToPlayground={(suggested) => {
            setSourceCode(suggested);
          }}
        />
      </section>

      {/* Past Versions Modal */}
      {showVersions && (
        <VersionHistory
          programId={program.id}
          language={program.language}
          onClose={() => setShowVersions(false)}
          onRestoreVersion={(restoredCode) => setSourceCode(restoredCode)}
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
