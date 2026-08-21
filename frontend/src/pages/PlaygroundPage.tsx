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

  // If no room ID provided, create a new one
  useEffect(() => {
    if (!roomId) {
      const initRoom = async () => {
        try {
          const res = await api.post<{ id: string }>('/api/playground', {
            title: 'Collaborative Session',
            language: 'python',
            source_code: '# Collaborative Playground\nprint("Collaborating in real-time!")',
          });
          navigate(`/playground/${res.data.id}`, { replace: true });
        } catch (err) {
          console.error('Failed to create playground:', err);
        }
      };
      initRoom();
    } else {
      setCurrentRoomId(roomId);
    }
  }, [roomId, navigate]);

  // Connect to WebSocket room
  useEffect(() => {
    if (!currentRoomId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/playground/${currentRoomId}`;

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

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Playground Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dark-700/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-accent-violet flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Real-time Collaborative Playground
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
              <Radio className="w-3 h-3 animate-pulse" />
              Live Room
            </span>
          </div>
          <p className="text-xs text-dark-300">
            Anyone with the link can edit and run together in real-time. Sessions automatically expire after 2 hours.
          </p>
        </div>

        {/* Toolbar & Active Peers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Peers List */}
          <div className="flex items-center gap-1.5 bg-dark-900 border border-dark-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-dark-400 font-medium">Active Peers:</span>
            <div className="flex items-center -space-x-1.5 overflow-hidden">
              {peers.map((peer, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: peer.color }}
                  className="w-6 h-6 rounded-full text-dark-950 font-bold text-[10px] flex items-center justify-center border-2 border-dark-900"
                  title={peer.name}
                >
                  {peer.name.substring(0, 1).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-dark-850 border border-dark-700 text-dark-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-500 font-mono"
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
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Room'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider font-mono">
              Shared Code Editor
            </span>
            <span className="text-[11px] text-dark-400 font-mono">
              Edits synchronize instantly across all participants
            </span>
          </div>

          <div className="h-[460px]">
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
              height="460px"
              onRun={handleSharedRun}
            />
          </div>

          {/* Custom Input */}
          <div className="rounded-xl border border-dark-700 bg-dark-900 p-3.5 space-y-2">
            <label className="text-xs font-medium text-dark-300 flex items-center justify-between font-mono">
              <span>Input (STDIN)</span>
              <span className="text-[11px] text-dark-500 font-normal">Passed to shared execution</span>
            </label>
            <textarea
              rows={2}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Shared input data for running program..."
              className="w-full bg-dark-950 border border-dark-700 rounded-lg p-2 text-xs font-mono text-white placeholder-dark-500 outline-none focus:border-brand-500 resize-y"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider font-mono">
              Shared Execution Terminal
            </span>

            <button
              onClick={handleSharedRun}
              disabled={running}
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{running ? 'Running for all...' : 'Run Shared Code'}</span>
            </button>
          </div>

          <div className="h-[530px]">
            <OutputTerminal
              result={result}
              isRunning={running}
              language={language}
              sourceCode={code}
              customInput={customInput}
              onClear={() => setResult(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
