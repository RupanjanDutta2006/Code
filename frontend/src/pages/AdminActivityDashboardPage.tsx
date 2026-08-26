import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Activity, 
  Layers, 
  Code2, 
  Sparkles, 
  FileText, 
  GraduationCap, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminActivity, getAdminActivityStats, ActivityEvent, AdminActivityStats } from '../services/activity';

export const AdminActivityDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [stats, setStats] = useState<AdminActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Metadata Modal
  const [inspectedEvent, setInspectedEvent] = useState<ActivityEvent | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [activityData, statsData] = await Promise.all([
        getAdminActivity({
          search: searchQuery.trim() || undefined,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          outcome: selectedOutcome === 'all' ? undefined : selectedOutcome,
          sort_order: sortOrder,
          page,
          page_size: pageSize
        }),
        getAdminActivityStats().catch(() => null)
      ]);

      setEvents(activityData.events);
      setTotalPages(activityData.total_pages);
      setTotalCount(activityData.total_count);
      if (statsData) setStats(statsData);
    } catch (err: any) {
      console.error('Admin activity fetch error:', err);
      setError(err.response?.data?.detail || 'Failed to retrieve administrative audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, selectedCategory, selectedOutcome, sortOrder, page, pageSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDashboardData();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatIST = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // If user is not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-crimson-500/10 border border-crimson-500/20 text-crimson-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Authentication Required</h2>
        <p className="text-xs text-slate-500 dark:text-dark-400">Please sign in with an Administrator account.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Access Denied banner if error is 403 Forbidden
  if (error && error.includes('Access Denied')) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
        <p className="text-xs text-slate-500 dark:text-dark-400">
          Your account ({user.email}) does not have administrative privileges to access the global audit log system.
        </p>
        <Link
          to="/my-activity"
          className="inline-block px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
        >
          View Your Own Activity History →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-600 dark:text-crimson-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Audit System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Security & Activity Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-dark-400">
            Immutable, privacy-compliant event trail across CodeVault Pro operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/my-activity"
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-dark-900 hover:bg-slate-200 dark:hover:bg-dark-800 text-slate-700 dark:text-dark-200 text-xs font-bold border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>My Activity</span>
          </Link>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Stats Banner */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-dark-400 font-medium">Total Audit Events</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.total_events}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-dark-400 font-medium">Events Today</span>
            <div className="text-2xl font-extrabold text-crimson-600 dark:text-crimson-400 font-mono">{stats.events_today}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-dark-400 font-medium">Active Unique Users</span>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">{stats.total_users_active}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-dark-400 font-medium">Success Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{stats.success_rate_percent}%</div>
          </div>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-dark-500" />
            <input
              type="text"
              placeholder="Search by username, email, UID, action, resource ID, or request ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-crimson-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 outline-none focus:border-crimson-500"
            >
              <option value="all">All Categories</option>
              <option value="auth">Auth</option>
              <option value="classroom">Classroom</option>
              <option value="resource">Resource</option>
              <option value="assignment">Assignment</option>
              <option value="compiler">Compiler</option>
              <option value="program">Program</option>
              <option value="ai">AI</option>
              <option value="profile">Profile</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={selectedOutcome}
              onChange={(e) => {
                setSelectedOutcome(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 outline-none focus:border-crimson-500"
            >
              <option value="all">All Outcomes</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="denied">Denied</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 outline-none focus:border-crimson-500"
            >
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-dark-950 border-b border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-dark-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Timestamp (IST)</th>
                <th className="px-4 py-3.5">Actor / User</th>
                <th className="px-4 py-3.5">Action & Category</th>
                <th className="px-4 py-3.5">Outcome</th>
                <th className="px-4 py-3.5">Resource ID</th>
                <th className="px-4 py-3.5">Trust / Source</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-crimson-500" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              )}

              {!loading && events.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <span>No audit records matching your criteria.</span>
                  </td>
                </tr>
              )}

              {!loading && events.map((evt) => (
                <tr key={evt.event_id || evt.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  
                  {/* Timestamp */}
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 dark:text-dark-300 whitespace-nowrap">
                    {formatIST(evt.created_at)}
                  </td>

                  {/* Actor */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {evt.actor_name || evt.actor_email || 'User'}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-dark-500 font-mono truncate max-w-[180px]">
                      {evt.actor_uid}
                    </div>
                  </td>

                  {/* Action & Category */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
                      {evt.action}
                    </div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-900 text-[10px] font-medium text-slate-600 dark:text-dark-400 capitalize">
                      {evt.category}
                    </span>
                  </td>

                  {/* Outcome */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {evt.outcome === 'success' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Success
                      </span>
                    ) : evt.outcome === 'denied' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                        <AlertTriangle className="w-3 h-3" />
                        Denied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                        <XCircle className="w-3 h-3" />
                        Failure
                      </span>
                    )}
                  </td>

                  {/* Resource */}
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 dark:text-dark-400 whitespace-nowrap">
                    {evt.resource_type ? (
                      <div>
                        <span className="uppercase text-[10px] text-slate-400 block">{evt.resource_type}</span>
                        <span>{evt.resource_id || '—'}</span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Trust / Source */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-900 text-slate-600 dark:text-dark-400 block w-fit">
                      {evt.trust_level}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {evt.source}
                    </span>
                  </td>

                  {/* Details Button */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setInspectedEvent(evt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-dark-900 hover:bg-crimson-600 hover:text-white text-slate-700 dark:text-dark-300 text-[11px] font-bold transition-colors"
                    >
                      Inspect
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50/50 dark:bg-dark-950/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-dark-400">
            Page {page} of {totalPages} ({totalCount} total audit records)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-white disabled:opacity-40 hover:border-crimson-500/40 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-white disabled:opacity-40 hover:border-crimson-500/40 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-crimson-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Event Details</h3>
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Event ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">{inspectedEvent.event_id}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Request ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">{inspectedEvent.request_id || '—'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Actor UID</span>
                <span className="font-mono text-slate-800 dark:text-white break-all">{inspectedEvent.actor_uid}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Timestamp (UTC)</span>
                <span className="font-mono text-slate-800 dark:text-white">{inspectedEvent.created_at}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-dark-300 block">Sanitized Event Metadata:</span>
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                {JSON.stringify(inspectedEvent.metadata || {}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setInspectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
