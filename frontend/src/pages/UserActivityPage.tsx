import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldCheck, 
  GraduationCap, 
  FileText, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User as UserIcon,
  BookOpen,
  Folder,
  Layers,
  ArrowRight,
  AlertCircle,
  Edit3,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserActivity, ActivityEvent } from '../services/activity';
import { ProfileEditModal } from '../components/ProfileEditModal';

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'auth', label: 'Auth', icon: ShieldCheck },
  { id: 'classroom', label: 'Classrooms', icon: GraduationCap },
  { id: 'resource', label: 'Resources', icon: FileText },
  { id: 'assignment', label: 'Assignments', icon: CheckCircle2 },
  { id: 'compiler', label: 'Compiler', icon: Code2 },
  { id: 'program', label: 'Programs', icon: Folder },
  { id: 'ai', label: 'AI', icon: Sparkles },
];

export const UserActivityPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '7d' | '30d'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const fetchActivity = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserActivity({
        category: activeCategory === 'all' ? undefined : activeCategory,
        time_range: timeRange,
        page,
        page_size: 20
      });
      setEvents(data.events);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
    } catch (err: any) {
      console.error('Error loading activity history:', err);
      setError(err.response?.data?.detail || 'Could not load your activity history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [user, activeCategory, timeRange, page]);

  // Format date to Asia/Kolkata (IST)
  const formatTimeIST = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch {
      return '';
    }
  };

  const formatDateHeaderIST = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const isToday = date.toDateString() === today.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();

      if (isToday) return 'Today';
      if (isYesterday) return 'Yesterday';

      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'Recent';
    }
  };

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { [dateKey: string]: ActivityEvent[] } = {};
    events.forEach(evt => {
      const header = formatDateHeaderIST(evt.created_at);
      if (!groups[header]) groups[header] = [];
      groups[header].push(evt);
    });
    return groups;
  }, [events]);

  // Human-friendly title mapper
  const formatActionTitle = (evt: ActivityEvent): string => {
    const act = evt.action;
    const meta = evt.metadata || {};

    switch (act) {
      case 'auth.login_succeeded':
        return 'Signed In to CodeVault';
      case 'auth.signup_succeeded':
        return 'Created CodeVault Account';
      case 'auth.logout_requested':
        return 'Signed Out of Session';
      case 'auth.password_reset_requested':
        return 'Password Reset Requested';
      case 'classroom.created':
        return `Created Classroom ${meta.name ? `"${meta.name}"` : ''}`;
      case 'classroom.joined':
        return `Joined Classroom ${meta.classroom_name ? `"${meta.classroom_name}"` : ''}`;
      case 'classroom.left':
        return `Left Classroom ${meta.classroom_name ? `"${meta.classroom_name}"` : ''}`;
      case 'classroom.key_regenerated':
        return 'Rotated Classroom Access Key';
      case 'classroom.member_removed':
        return 'Removed Classroom Member';
      case 'resource.upload_completed':
        return `Uploaded ${meta.resource_type ? meta.resource_type.toUpperCase() : 'Resource'} ${meta.title ? `"${meta.title}"` : ''}`;
      case 'resource.deleted':
        return 'Deleted Classroom Resource';
      case 'assignment.created':
        return `Created Assignment ${meta.title ? `"${meta.title}"` : ''}`;
      case 'assignment.submission_created':
        return `Submitted Assignment Solution (${meta.language || 'Code'})`;
      case 'compiler.run_requested':
      case 'compiler.run_completed':
        return `Executed ${meta.language || 'Program'} Code`;
      case 'compiler.run_failed':
        return `Execution Failed (${meta.language || 'Code'})`;
      case 'program.saved':
        return 'Saved Code Program';
      case 'program.deleted':
        return 'Deleted Code Program';
      case 'ai.request_completed':
        return `CodeVault AI Assistant (${meta.mode || 'Coding Help'})`;
      case 'learning.lesson_started':
        return 'Started Interactive Lesson';
      case 'learning.practice_opened':
        return 'Opened Practice in Compiler';
      case 'profile.updated':
        return 'Updated Profile Details';
      default:
        return act.replace(/_/g, ' ').replace(/\./g, ' › ');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case 'classroom':
        return <GraduationCap className="w-4 h-4 text-crimson-500" />;
      case 'resource':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'assignment':
        return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      case 'compiler':
        return <Code2 className="w-4 h-4 text-rose-500" />;
      case 'program':
        return <Folder className="w-4 h-4 text-cyan-500" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-violet-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-crimson-500/10 border border-crimson-500/20 text-crimson-500 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-sm text-slate-500 dark:text-dark-400">Please sign in to view your activity history.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm transition-all"
        >
          Sign In Now →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e0e13] to-slate-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/15 border border-crimson-500/30 text-crimson-400 text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Activity History & Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Activity Timeline</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Chronological, privacy-safe record of your logins, classroom interactions, code executions, and assignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfileEdit(true)}
              className="px-3.5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-red-sm hover:scale-105 active:scale-95"
              title="Edit Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={fetchActivity}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              title="Refresh Activity"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* User Stats Quick Pills */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Display Name</span>
            <span className="text-xs font-bold text-white truncate block mt-0.5">{user.full_name || user.displayName || user.username}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Email Account</span>
            <span className="text-xs font-bold text-white truncate block mt-0.5">{user.email}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Phone Number</span>
            <span className="text-xs font-bold text-emerald-400 truncate block mt-0.5">{user.phoneNumber || user.phone_number || 'Not provided'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Profile Role</span>
            <span className="text-xs font-bold text-crimson-400 block mt-0.5">
              {user.profileRole === 'professor' || user.profile_role === 'professor' ? 'Professor / Teacher' : user.profileRole === 'student' || user.profile_role === 'student' ? 'Student' : 'Not specified'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            {CATEGORY_TABS.map(tab => {
              const Icon = tab.icon;
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                      : 'bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value as any);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-dark-200 outline-none focus:border-crimson-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchActivity} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="p-4 rounded-2xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-dark-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-dark-800 rounded" />
                <div className="h-2.5 w-1/4 bg-slate-100 dark:bg-dark-900 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#0e0e13]/60 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-dark-900 flex items-center justify-center mx-auto text-slate-400 dark:text-dark-500">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No activity records found</h3>
          <p className="text-xs text-slate-500 dark:text-dark-400 max-w-sm mx-auto">
            {activeCategory !== 'all' || timeRange !== 'all'
              ? 'No events match the selected category or time filter.'
              : 'As you navigate CodeVault, create classrooms, and run programs, your verified activity timeline will appear here.'}
          </p>
          {(activeCategory !== 'all' || timeRange !== 'all') && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setTimeRange('all');
                setPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Timeline View */}
      {!loading && events.length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([dateKey, items]) => (
            <div key={dateKey} className="space-y-3">
              
              {/* Date Header Pill */}
              <div className="sticky top-16 z-20 flex items-center gap-2 py-1">
                <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-dark-900/90 backdrop-blur-md border border-slate-300 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-dark-300 flex items-center gap-1.5 shadow-xs">
                  <Calendar className="w-3 h-3 text-crimson-500" />
                  {dateKey}
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-white/5" />
              </div>

              {/* Event Cards */}
              <div className="space-y-2.5">
                {items.map(evt => (
                  <div
                    key={evt.event_id || evt.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#101015]/90 border border-slate-200 dark:border-white/10 hover:border-crimson-500/40 transition-all shadow-xs flex items-start gap-3 sm:gap-4 group"
                  >
                    {/* Icon Bubble */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      {getCategoryIcon(evt.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {formatActionTitle(evt)}
                        </h4>
                        <span className="text-[11px] text-slate-400 dark:text-dark-400 font-mono shrink-0">
                          {formatTimeIST(evt.created_at)}
                        </span>
                      </div>

                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-900 text-slate-600 dark:text-dark-300 font-medium capitalize">
                          {evt.category}
                        </span>

                        {evt.outcome === 'success' ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Success
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            {evt.outcome}
                          </span>
                        )}

                        {evt.metadata?.language && (
                          <span className="px-2 py-0.5 rounded-md bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 font-semibold">
                            {evt.metadata.language}
                          </span>
                        )}

                        {evt.metadata?.resource_type && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold uppercase text-[10px]">
                            {evt.metadata.resource_type}
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 dark:text-dark-500 font-mono ml-auto">
                          {evt.trust_level}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-dark-400">
                Page {page} of {totalPages} ({totalCount} total actions)
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
          )}
        </div>
      )}

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
      />
    </div>
  );
};
