import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Unlink, 
  RefreshCw, 
  GitPullRequest,
  AlertTriangle,
  Server,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

// Custom inline SVG for GitHub icon (replaces missing Lucide export)
const GitHubIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface RepoConnectionState {
  connected: boolean;
  username?: string;
  avatar_url?: string;
  full_name?: string;
  default_branch?: string;
  permissions?: {
    admin?: boolean;
    push?: boolean;
    pull?: boolean;
  };
  connected_at?: string;
  available_repos?: Array<{
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    default_branch: string;
  }>;
}

interface GitHubSystemStatus {
  configured: boolean;
  client_id_configured: boolean;
  callback_url: string;
  main: RepoConnectionState;
  contributor: RepoConnectionState;
}

export const DeveloperGitHubConnectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<GitHubSystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ role: string; valid: boolean; message: string } | null>(null);
  const [testingRole, setTestingRole] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get<GitHubSystemStatus>('/api/github/status');
      setStatus(res.data);
    } catch (err: any) {
      console.error('Failed to fetch GitHub status:', err);
      setNotice({
        type: 'error',
        text: 'Failed to connect to backend GitHub API service. Ensure backend is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Check URL parameters after OAuth callback
    const statusParam = searchParams.get('status');
    const roleParam = searchParams.get('role');
    const repoParam = searchParams.get('repo');
    const messageParam = searchParams.get('message');

    if (statusParam === 'connected') {
      setNotice({
        type: 'success',
        text: `Successfully authorized GitHub for ${roleParam === 'main' ? 'Main Repository' : 'Contributor Repository'} (${repoParam || 'Repository linked'})!`,
      });
    } else if (statusParam === 'error') {
      setNotice({
        type: 'error',
        text: `GitHub authorization error: ${messageParam || 'Unknown error occurred'}`,
      });
    }
  }, [searchParams]);

  // Initiate OAuth flow
  const handleConnect = async (role: 'main' | 'contributor') => {
    setActionLoading(role);
    setNotice(null);
    try {
      const res = await api.get<{ auth_url: string; state: string }>(`/api/github/auth-url?role=${role}`);
      if (res.data?.auth_url) {
        // Redirect browser to official GitHub authorization page
        window.location.href = res.data.auth_url;
      } else {
        throw new Error('No authorization URL returned from backend');
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to initiate GitHub connection';
      setNotice({ type: 'error', text: msg });
      setActionLoading(null);
    }
  };

  // Disconnect repository
  const handleDisconnect = async (role: 'main' | 'contributor') => {
    if (!window.confirm(`Are you sure you want to disconnect the ${role.toUpperCase()} repository?`)) {
      return;
    }

    setActionLoading(role);
    try {
      await api.post('/api/github/disconnect', { role });
      setNotice({
        type: 'success',
        text: `Disconnected ${role === 'main' ? 'Main' : 'Contributor'} repository session.`,
      });
      await fetchStatus();
    } catch (err: any) {
      setNotice({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to disconnect repository',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Select alternative repository
  const handleSelectRepo = async (role: 'main' | 'contributor', repoFullName: string) => {
    try {
      await api.post('/api/github/select-repo', {
        role,
        repo_full_name: repoFullName,
      });
      setNotice({
        type: 'success',
        text: `Target repository for ${role.toUpperCase()} set to ${repoFullName}`,
      });
      await fetchStatus();
    } catch (err: any) {
      setNotice({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to select repository',
      });
    }
  };

  // Test live GitHub API communication
  const handleTestConnection = async (role: 'main' | 'contributor') => {
    setTestingRole(role);
    setTestResult(null);
    try {
      const res = await api.get<{ valid: boolean; message: string }>(`/api/github/test-connection?role=${role}`);
      setTestResult({
        role,
        valid: res.data.valid,
        message: res.data.message,
      });
    } catch (err: any) {
      setTestResult({
        role,
        valid: false,
        message: err.response?.data?.detail || err.message || 'Test failed',
      });
    } finally {
      setTestingRole(null);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient-bg py-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 font-sans transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-light-border dark:border-[#1b223c] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-dark-900 border border-light-border dark:border-purple-500/30 text-light-blue dark:text-purple-400 shadow-card-light dark:shadow-neon-purple">
              <GitHubIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-light-blueSoft dark:bg-purple-500/20 text-light-blue dark:text-purple-300 border border-light-blueBorder/40 dark:border-purple-500/30">
                  Developer & Maintenance Portal
                </span>
                <span className="text-xs text-light-textMuted dark:text-dark-400 font-mono">v2.1.0</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-light-textStrong dark:text-white tracking-tight mt-0.5">
                GitHub Two-Repository Authorization
              </h1>
            </div>
          </div>
          <p className="text-sm text-light-textSecondary dark:text-dark-300 mt-2 max-w-2xl">
            Securely link both the <strong className="text-light-textStrong dark:text-white">Main (First Person / Vercel)</strong> and <strong className="text-light-textStrong dark:text-white">Contributor (Second Person / Fork)</strong> repositories via official GitHub OAuth / App authorization. Passwords are never collected.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-white hover:bg-light-secondary dark:bg-dark-900 dark:hover:bg-dark-850 text-light-textNormal hover:text-light-textStrong dark:text-dark-200 dark:hover:text-white border border-light-border dark:border-[#1b223c] text-xs font-semibold flex items-center gap-2 self-start transition-colors shadow-card-light"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Zero-Password Security Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-gradient-to-r dark:from-dark-900 dark:to-[#101528] border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3.5 shadow-card-light">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-emerald-800 dark:text-emerald-300">
            Official GitHub Direct Authorization Guarantee
          </p>
          <p className="text-emerald-900/80 dark:text-dark-300 leading-relaxed">
            Antigravity and CodeVault Pro <strong className="text-emerald-950 dark:text-white">NEVER collect, receive, or store your GitHub password</strong>. When you click Connect, your browser navigates directly to <code className="text-emerald-700 dark:text-emerald-300 bg-white dark:bg-dark-950 px-1 py-0.5 rounded border border-emerald-200 dark:border-dark-800">github.com</code> where you authorize the official application. All access tokens stay strictly server-side.
          </p>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notice && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-medium animate-slide-left shadow-card-light ${
          notice.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200' 
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
            <span>{notice.text}</span>
          </div>
          <button 
            onClick={() => setNotice(null)}
            className="text-light-textMuted dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white text-xs px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main & Contributor Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: First Person / Main Repository */}
        <div className="rounded-3xl bg-white dark:bg-dark-900/80 backdrop-blur-xl border border-light-border dark:border-[#232b4b] p-6 space-y-5 shadow-card-light dark:shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <h2 className="text-lg font-bold text-light-textStrong dark:text-white tracking-tight font-sans">
                1. Main Repository
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-bold">
              Production / Vercel Source
            </span>
          </div>

          <p className="text-xs text-light-textSecondary dark:text-dark-300">
            Owned by the <strong className="text-light-textStrong dark:text-white">First Person</strong>. Connected to Vercel production hosting. Only reviewed and approved pull requests should be merged here.
          </p>

          {status?.main?.connected ? (
            <div className="p-4 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-emerald-300 dark:border-emerald-500/30 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Connected to GitHub</span>
                </div>
                <span className="text-[10px] font-mono text-light-textMuted dark:text-dark-400">
                  {status.main.connected_at ? new Date(status.main.connected_at).toLocaleDateString() : ''}
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Account:</span>
                  <span className="text-light-textStrong dark:text-white font-semibold flex items-center gap-1">
                    {status.main.username}
                  </span>
                </div>
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Repository:</span>
                  <span className="text-light-blue dark:text-purple-300 font-bold">{status.main.full_name}</span>
                </div>
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Branch:</span>
                  <span className="text-light-textNormal dark:text-dark-200">{status.main.default_branch || 'main'}</span>
                </div>
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Permissions:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {status.main.permissions?.push ? 'Read / Write' : 'Read Only'}
                  </span>
                </div>
              </div>

              {/* Repo Selector if available */}
              {status.main.available_repos && status.main.available_repos.length > 1 && (
                <div className="pt-2 border-t border-light-border dark:border-dark-800">
                  <label className="text-[11px] text-light-textMuted dark:text-dark-400 block mb-1 font-mono">Change Target Repository:</label>
                  <select
                    value={status.main.full_name}
                    onChange={(e) => handleSelectRepo('main', e.target.value)}
                    className="w-full text-xs bg-white dark:bg-dark-900 border border-light-borderStrong dark:border-dark-700 rounded-xl px-2.5 py-1.5 text-light-textStrong dark:text-white focus:outline-none focus:border-light-blue"
                  >
                    {status.main.available_repos.map((r) => (
                      <option key={r.id || r.full_name} value={r.full_name}>
                        {r.full_name} {r.private ? '(Private)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleTestConnection('main')}
                  disabled={testingRole === 'main'}
                  className="flex-1 py-1.5 rounded-xl bg-white hover:bg-light-secondary dark:bg-dark-850 dark:hover:bg-dark-800 text-light-textNormal dark:text-dark-200 text-xs font-semibold border border-light-border dark:border-dark-700 transition-colors shadow-card-light"
                >
                  {testingRole === 'main' ? 'Checking...' : 'Test API Access'}
                </button>
                <button
                  onClick={() => handleDisconnect('main')}
                  disabled={actionLoading === 'main'}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800/40 transition-colors flex items-center gap-1"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-dashed border-light-borderStrong dark:border-[#232b4b] text-center space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-light-textSecondary dark:text-dark-300">Status: Not Connected</p>
                <p className="text-[11px] text-light-textMuted dark:text-dark-400">
                  Click below to open official github.com and authorize First Person repository access.
                </p>
              </div>

              <button
                onClick={() => handleConnect('main')}
                disabled={actionLoading === 'main'}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>{actionLoading === 'main' ? 'Connecting...' : 'Connect Main Repository'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          )}
        </div>

        {/* CARD 2: Second Person / Contributor Repository */}
        <div className="rounded-3xl bg-white dark:bg-dark-900/80 backdrop-blur-xl border border-light-border dark:border-[#232b4b] p-6 space-y-5 shadow-card-light dark:shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-light-blue dark:bg-purple-500 shadow-[0_0_10px_#2D6ED1]" />
              <h2 className="text-lg font-bold text-light-textStrong dark:text-white tracking-tight font-sans">
                2. Contributor Repository
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-light-blueSoft dark:bg-purple-500/15 text-light-blue dark:text-purple-300 border border-light-blueBorder/40 dark:border-purple-500/30 font-bold">
              Development / Contributor Fork
            </span>
          </div>

          <p className="text-xs text-light-textSecondary dark:text-dark-300">
            Owned by the <strong className="text-light-textStrong dark:text-white">Second Person</strong>. Used to develop new features and prepare security patches before creating Pull Requests.
          </p>

          {status?.contributor?.connected ? (
            <div className="p-4 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-light-blueBorder/50 dark:border-purple-500/30 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-light-blue dark:text-purple-400" />
                  <span className="text-xs font-bold text-light-blue dark:text-purple-300">Connected to GitHub</span>
                </div>
                <span className="text-[10px] font-mono text-light-textMuted dark:text-dark-400">
                  {status.contributor.connected_at ? new Date(status.contributor.connected_at).toLocaleDateString() : ''}
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Account:</span>
                  <span className="text-light-textStrong dark:text-white font-semibold flex items-center gap-1">
                    {status.contributor.username}
                  </span>
                </div>
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Repository:</span>
                  <span className="text-light-blue dark:text-purple-300 font-bold">{status.contributor.full_name}</span>
                </div>
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Branch:</span>
                  <span className="text-light-textNormal dark:text-dark-200">{status.contributor.default_branch || 'main'}</span>
                </div>
                <div className="flex items-center justify-between text-light-textSecondary dark:text-dark-300">
                  <span className="text-light-textMuted dark:text-dark-500">Permissions:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {status.contributor.permissions?.push ? 'Read / Write' : 'Read Only'}
                  </span>
                </div>
              </div>

              {/* Repo Selector if available */}
              {status.contributor.available_repos && status.contributor.available_repos.length > 1 && (
                <div className="pt-2 border-t border-light-border dark:border-dark-800">
                  <label className="text-[11px] text-light-textMuted dark:text-dark-400 block mb-1 font-mono">Change Target Repository:</label>
                  <select
                    value={status.contributor.full_name}
                    onChange={(e) => handleSelectRepo('contributor', e.target.value)}
                    className="w-full text-xs bg-white dark:bg-dark-900 border border-light-borderStrong dark:border-dark-700 rounded-xl px-2.5 py-1.5 text-light-textStrong dark:text-white focus:outline-none focus:border-light-blue"
                  >
                    {status.contributor.available_repos.map((r) => (
                      <option key={r.id || r.full_name} value={r.full_name}>
                        {r.full_name} {r.private ? '(Private)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleTestConnection('contributor')}
                  disabled={testingRole === 'contributor'}
                  className="flex-1 py-1.5 rounded-xl bg-white hover:bg-light-secondary dark:bg-dark-850 dark:hover:bg-dark-800 text-light-textNormal dark:text-dark-200 text-xs font-semibold border border-light-border dark:border-dark-700 transition-colors shadow-card-light"
                >
                  {testingRole === 'contributor' ? 'Checking...' : 'Test API Access'}
                </button>
                <button
                  onClick={() => handleDisconnect('contributor')}
                  disabled={actionLoading === 'contributor'}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800/40 transition-colors flex items-center gap-1"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-dashed border-light-borderStrong dark:border-[#232b4b] text-center space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-light-textSecondary dark:text-dark-300">Status: Not Connected</p>
                <p className="text-[11px] text-light-textMuted dark:text-dark-400">
                  Click below to open official github.com and authorize Second Person repository access.
                </p>
              </div>

              <button
                onClick={() => handleConnect('contributor')}
                disabled={actionLoading === 'contributor'}
                className="w-full py-2.5 rounded-2xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>{actionLoading === 'contributor' ? 'Connecting...' : 'Connect Contributor Repository'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live API Test Diagnostic Card (if tested) */}
      {testResult && (
        <div className={`p-4 rounded-2xl border ${
          testResult.valid ? 'bg-emerald-50 dark:bg-dark-900/90 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-dark-900/90 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
        } text-xs font-mono space-y-1 shadow-card-light`}>
          <div className="flex items-center justify-between font-bold">
            <span>API Communication Test ({testResult.role.toUpperCase()}): {testResult.valid ? 'PASS ✓' : 'FAILED ✕'}</span>
            <button onClick={() => setTestResult(null)} className="text-light-textMuted dark:text-dark-400 hover:text-light-textStrong">✕</button>
          </div>
          <p className="text-light-textSecondary dark:text-dark-300">{testResult.message}</p>
        </div>
      )}

      {/* Architecture & Workflow Diagram */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-900/70 border border-light-border dark:border-[#1b223c] space-y-4 shadow-card-light">
        <h3 className="text-sm font-bold text-light-textStrong dark:text-white flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-light-blue dark:text-purple-400" />
          <span>Production Safety Workflow</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-light-border dark:border-purple-500/30 space-y-1">
            <span className="text-[10px] font-mono text-light-blue dark:text-purple-400 font-bold">STEP 1</span>
            <p className="font-bold text-light-textStrong dark:text-white">Contributor Fork</p>
            <p className="text-light-textSecondary dark:text-dark-400 text-[11px]">Second person prepares security patches & feature updates.</p>
          </div>

          <div className="p-3 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-light-border dark:border-blue-500/30 space-y-1">
            <span className="text-[10px] font-mono text-light-blue dark:text-blue-400 font-bold">STEP 2</span>
            <p className="font-bold text-light-textStrong dark:text-white">Pull Request</p>
            <p className="text-light-textSecondary dark:text-dark-400 text-[11px]">Changes submitted as a verified GitHub Pull Request.</p>
          </div>

          <div className="p-3 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-light-border dark:border-emerald-500/30 space-y-1">
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">STEP 3</span>
            <p className="font-bold text-light-textStrong dark:text-white">First Person Review</p>
            <p className="text-light-textSecondary dark:text-dark-400 text-[11px]">Owner inspects and merges PR on GitHub.</p>
          </div>

          <div className="p-3 rounded-2xl bg-light-secondary dark:bg-dark-950 border border-light-border dark:border-cyan-500/30 space-y-1">
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">STEP 4</span>
            <p className="font-bold text-light-textStrong dark:text-white">Vercel Auto-Deploy</p>
            <p className="text-light-textSecondary dark:text-dark-400 text-[11px]">Production site deploys automatically from main branch.</p>
          </div>
        </div>
      </div>

      {/* GitHub App / OAuth Configuration Guide */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-900/50 border border-light-border dark:border-dark-800 space-y-4 shadow-card-light">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-light-textStrong dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-light-blue dark:text-indigo-400" />
            <span>GitHub App / OAuth App Server Environment Setup</span>
          </h3>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
            status?.configured ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40' : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
          }`}>
            {status?.configured ? 'Server Ready ✓' : 'Configuration Required'}
          </span>
        </div>

        <div className="text-xs text-light-textSecondary dark:text-dark-300 space-y-2 leading-relaxed">
          <p>
            To enable the browser-based authorization buttons above, create an official GitHub OAuth App or GitHub App in your GitHub settings:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-light-textNormal dark:text-dark-300 font-mono text-[11px]">
            <li>Open <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="text-light-blue dark:text-purple-400 hover:underline">GitHub Developer Settings → OAuth Apps → New OAuth App</a></li>
            <li>Set <strong>Application name</strong>: <code className="text-light-textStrong dark:text-white bg-light-secondary dark:bg-dark-950 px-1 py-0.5 rounded border border-light-border dark:border-transparent">CodeVault Pro Dev Connector</code></li>
            <li>Set <strong>Homepage URL</strong>: <code className="text-light-textStrong dark:text-white bg-light-secondary dark:bg-dark-950 px-1 py-0.5 rounded border border-light-border dark:border-transparent">http://localhost:5173</code></li>
            <li>Set <strong>Authorization callback URL</strong>: <code className="text-emerald-700 dark:text-emerald-300 bg-light-secondary dark:bg-dark-950 px-1 py-0.5 rounded border border-light-border dark:border-transparent">{status?.callback_url || 'http://localhost:8000/api/github/callback'}</code></li>
            <li>Add the generated <strong>Client ID</strong> and <strong>Client Secret</strong> to your backend <code className="text-light-textStrong dark:text-white bg-light-secondary dark:bg-dark-950 px-1 py-0.5 rounded border border-light-border dark:border-transparent">.env</code> file:
              <pre className="mt-1 p-2 bg-light-secondary dark:bg-dark-950 border border-light-border dark:border-dark-800 rounded-xl text-light-textStrong dark:text-dark-200">
                GITHUB_CLIENT_ID=your_github_client_id_here{'\n'}
                GITHUB_CLIENT_SECRET=your_github_client_secret_here{'\n'}
                GITHUB_CALLBACK_URL=http://localhost:8000/api/github/callback
              </pre>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
