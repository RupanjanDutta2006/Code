import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Sparkles, 
  Globe,
  Radio,
  Clock
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { OutputTerminal } from '../components/OutputTerminal';
import { api, ExecuteResult } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { executeUniversal } from '../services/compilerEngine';

interface Peer {
  id: string;
  name: string;
  color: string;
}

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'html', name: 'HTML/CSS' },
  { id: 'sql', name: 'SQL' },
];

const PEER_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

export const PlaygroundPage: React.FC = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentRoomId, setCurrentRoomId] = useState<string>(roomId || '');
  const [code, setCode] = useState('# Collaborative Playground\nprint("Collaborating in real-time!")');
  const [language, setLanguage] = useState('python');
  const [customInput, setCustomInput] = useState('');
  const [peers, setPeers] = useState<Peer[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecuteResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const myClientId = useRef<string>(Math.random().toString(36).substring(2, 9));
  const myColor = useRef<string>(PEER_COLORS[Math.floor(Math.random() * PEER_COLORS.length)]);

  // If no room ID provided, create or generate a new one
  useEffect(() => {
    if (!roomId) {
      const initRoom = async () => {
        try {
          const res = await api.post<{ id: string }>('/api/playground', {
            title: 'Collaborative Session',
            language: 'python',
            source_code: '# Collaborative Playground\nprint("Collaborating in real-time!")',
          });
          if (res?.data?.id) {
            navigate(`/playground/${res.data.id}`, { replace: true });
            return;
          }
        } catch (err) {
          console.warn('Backend playground creation unavailable, generating client session:', err);
        }
        const fallbackId = `room-${Math.random().toString(36).substring(2, 9)}`;
        setCurrentRoomId(fallbackId);
        navigate(`/playground/${fallbackId}`, { replace: true });
      };
      initRoom();
    } else {
      setCurrentRoomId(roomId);
    }
  }, [roomId, navigate]);

  // Connect to WebSocket room
  useEffect(() => {
    if (!currentRoomId) return;

    const customWsUrl = import.meta.env.VITE_WS_URL;
    const customApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    let wsUrl = '';

    if (customWsUrl) {
      const baseWs = customWsUrl.replace(/\/+$/, '');
      wsUrl = `${baseWs}/ws/playground/${currentRoomId}`;
    } else if (customApiUrl) {
      const baseWs = customApiUrl.replace(/^http/, 'ws').replace(/\/+$/, '');
      wsUrl = `${baseWs}/ws/playground/${currentRoomId}`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsUrl = `${protocol}//${host}/ws/playground/${currentRoomId}`;
    }

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;
    setConnecting(true);

    ws.onopen = () => {
      setConnecting(false);
      // Handshake with client info
      ws.send(JSON.stringify({
        clientId: myClientId.current,
        name: user?.full_name || user?.username || `Guest_${myClientId.current.substring(0, 4)}`,
        color: myColor.current,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'init') {
          if (msg.code) setCode(msg.code);
          if (msg.language) setLanguage(msg.language);
          if (msg.peers) setPeers(msg.peers);
        } else if (msg.type === 'code_change') {
          setCode(msg.code);
        } else if (msg.type === 'language_change') {
          setLanguage(msg.language);
        } else if (msg.type === 'user_joined') {
          setPeers((prev) => [...prev.filter((p) => p.id !== msg.user.id), msg.user]);
        } else if (msg.type === 'user_left') {
          setPeers((prev) => prev.filter((p) => p.id !== msg.clientId));
        } else if (msg.type === 'run_started') {
          setRunning(true);
        } else if (msg.type === 'run_finished') {
          setRunning(false);
          setResult({
            status: msg.status,
            output: msg.output,
            error: msg.error,
            execution_time_ms: msg.execution_time_ms,
          });
        }
      } catch (err) {
        console.error('WS message error:', err);
      }
    };

    ws.onclose = () => {
      setConnecting(false);
    };

    return () => {
      ws.close();
    };
  }, [currentRoomId, user]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'code_change',
        code: newCode,
      }));
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'language_change',
        language: newLang,
      }));
    }
  };

  const handleSharedRun = async () => {
    setRunning(true);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'run_code',
        custom_input: customInput,
      }));
    } else {
      try {
        const resp = await executeUniversal({
          language,
          sourceCode: code,
          customInput,
        });
        setResult(resp);
      } catch (err: any) {
        setResult({
          status: 'error',
          output: '',
          error: err.message || 'Execution failed',
          execution_time_ms: 0,
        });
      } finally {
        setRunning(false);
      }
    }
  };

  const [activeTab, setActiveTab] = useState<'code' | 'stdin' | 'terminal'>('code');

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRunAndSwitch = async () => {
    if (window.innerWidth < 1024) {
      setActiveTab('terminal');
    }
    await handleSharedRun();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Playground Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-light-border dark:border-white/10">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-crimson-500/15 text-crimson-500 dark:text-crimson-400 flex items-center justify-center shrink-0 border border-crimson-500/30">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-light-textStrong dark:text-white tracking-tight">
              Real-time Playground
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-mono font-medium">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Live Room
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-light-textSecondary dark:text-dark-300">
            Collaborative multi-language sandbox. Edits sync instantly in real-time.
          </p>
        </div>

        {/* Toolbar & Active Peers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Peers List */}
          {peers.length > 0 && (
            <div className="flex items-center gap-1.5 bg-light-secondary dark:bg-[#121217] border border-light-border dark:border-white/10 px-2.5 py-1 rounded-xl text-xs">
              <span className="text-light-textMuted dark:text-dark-400 font-medium text-[11px]">Peers:</span>
              <div className="flex items-center -space-x-1 overflow-hidden">
                {peers.map((peer, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: peer.color }}
                    className="w-5 h-5 rounded-full text-dark-950 font-bold text-[9px] flex items-center justify-center border border-white dark:border-[#121217]"
                    title={peer.name}
                  >
                    {peer.name.substring(0, 1).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-light-secondary dark:bg-[#121217] border border-light-borderStrong dark:border-white/10 text-light-textStrong dark:text-dark-200 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-crimson-500 font-mono touch-target"
            aria-label="Programming language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Share Button */}
          <button
            onClick={handleShareLink}
            className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold shadow-glow-red-sm transition-all flex items-center gap-1.5 touch-target hover:scale-105"
            title="Copy room link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Control Bar (Only visible on small/medium screens) */}
      <div className="lg:hidden flex items-center justify-between p-1 bg-light-secondary dark:bg-[#0e0e13] rounded-2xl border border-light-border dark:border-white/10">
        <div className="grid grid-cols-3 gap-1 flex-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
            }`}
          >
            1. Code
          </button>
          <button
            onClick={() => setActiveTab('stdin')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'stdin'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
            }`}
          >
            2. Stdin
            {customInput.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-2 right-2" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'terminal'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
            }`}
          >
            3. Output
            {result && (
              <span className={`w-1.5 h-1.5 rounded-full absolute top-2 right-2 ${result.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            )}
          </button>
        </div>

        <button
          onClick={handleRunAndSwitch}
          disabled={running}
          className="ml-2 px-3.5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5 disabled:opacity-50 touch-target hover:scale-105"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{running ? '...' : 'Run'}</span>
        </button>
      </div>

      {/* Editor & Output Workspaces (Desktop Side-by-Side | Mobile Single Tab Active) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Code Editor Panel */}
        <div className={`space-y-2.5 ${activeTab !== 'code' ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-light-textSecondary dark:text-dark-300 uppercase tracking-wider font-mono">
              Code Editor
            </span>
            <span className="hidden sm:inline text-[11px] text-light-textMuted dark:text-dark-400 font-mono">
              Synchronized Live
            </span>
          </div>

          <div className="h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border border-light-border dark:border-white/10 shadow-xs">
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
              height="100%"
              onRun={handleRunAndSwitch}
            />
          </div>
        </div>

        {/* Mobile Custom Stdin Tab */}
        <div className={`space-y-2.5 ${activeTab !== 'stdin' ? 'hidden' : 'block lg:hidden'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-light-textSecondary dark:text-dark-300 uppercase tracking-wider font-mono">
              Custom Program Stdin
            </span>
            <span className="text-[11px] text-light-textMuted dark:text-dark-400 font-mono">
              Passed to program execution
            </span>
          </div>

          <div className="h-[420px] rounded-2xl p-4 bg-white dark:bg-[#0f0f13]/90 border border-light-border dark:border-white/10 flex flex-col space-y-3">
            <label className="text-xs text-light-textSecondary dark:text-dark-300 font-medium">
              Enter input lines below (e.g. test cases, numbers, strings):
            </label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter stdin input for your program here..."
              className="flex-1 w-full p-3 rounded-xl bg-light-secondary dark:bg-[#141419] border border-light-borderStrong dark:border-white/10 text-xs font-mono outline-none focus:border-crimson-500 resize-none text-light-textStrong dark:text-white"
            />
            <button
              onClick={handleRunAndSwitch}
              disabled={running}
              className="w-full py-3 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-red-sm touch-target"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run Code with This Stdin</span>
            </button>
          </div>
        </div>

        {/* Output Terminal Panel */}
        <div className={`space-y-2.5 ${activeTab !== 'terminal' ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-light-textSecondary dark:text-dark-300 uppercase tracking-wider font-mono">
              Execution Terminal
            </span>

            <button
              onClick={handleRunAndSwitch}
              disabled={running}
              className="hidden lg:flex px-4 py-1.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white text-xs font-bold shadow-glow-red-sm transition-all items-center gap-2 disabled:opacity-50 hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{running ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>

          <div className="h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border border-light-border dark:border-white/10 shadow-xs">
            <OutputTerminal
              result={result}
              isRunning={running}
              language={language}
              sourceCode={code}
              onClear={() => setResult(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
