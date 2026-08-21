import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  PlusCircle, 
  Users, 
  BookOpen, 
  Copy, 
  Check, 
  ArrowRight, 
  Key, 
  X, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { api, Classroom } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ClassroomListPage: React.FC = () => {
  const { user, isTeacher } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [className, setClassName] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const res = await api.get<Classroom[]>('/api/classrooms');
      setClassrooms(res.data);
    } catch (err) {
      console.error('Failed to load classrooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    setActionLoading(true);
    try {
      const res = await api.post<Classroom>('/api/classrooms', {
        name: className,
        description: classDesc,
      });
      setClassrooms((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
      setClassName('');
      setClassDesc('');
    } catch (err) {
      console.error('Failed to create classroom:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    setActionLoading(true);
    try {
      const res = await api.post<Classroom>('/api/classrooms/join', {
        invite_code: inviteCodeInput,
      });
      setClassrooms((prev) => [res.data, ...prev]);
      setShowJoinModal(false);
      setInviteCodeInput('');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to join classroom.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCode = (id: number, code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-accent-amber" />
            {isTeacher ? 'My Classes (Teacher Portal)' : 'My Class'}
          </h1>
          <p className="text-sm text-dark-300 mt-1">
            {isTeacher
              ? 'Manage your classrooms, invite students, assign programming problems, and track submission leaderboards.'
              : 'Join classrooms, solve assigned coding problems, and see your progress.'}
          </p>
        </div>

        <div>
          {isTeacher ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Classroom</span>
            </button>
          ) : (
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Join Class via Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Classroom Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-dark-400 font-medium">
          Loading your classrooms...
        </div>
      ) : classrooms.length === 0 ? (
        <div className="py-20 text-center text-dark-400 bg-dark-900 rounded-2xl border border-dark-700 p-8 space-y-4">
          <GraduationCap className="w-12 h-12 text-dark-500 mx-auto" />
          <p className="text-base font-semibold text-dark-200">
            {isTeacher ? 'No classrooms created yet.' : 'You have not joined any classroom yet.'}
          </p>
          <p className="text-xs max-w-md mx-auto">
            {isTeacher
              ? 'Click "Create Classroom" to start a new class and generate student invite codes.'
              : 'Ask your teacher for a classroom invite code (e.g. DSA-7F2K) and click "Join Class via Code".'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classrooms.map((c) => (
            <Link
              key={c.id}
              to={`/classrooms/${c.id}`}
              className="group p-5 rounded-2xl bg-dark-900/90 border border-dark-700/80 hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                    Code: {c.invite_code}
                  </span>

                  <button
                    onClick={(e) => handleCopyCode(c.id, c.invite_code, e)}
                    className="p-1 text-dark-400 hover:text-white hover:bg-dark-800 rounded transition-colors"
                    title="Copy invite code"
                  >
                    {copiedCodeId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {c.name}
                </h3>

                <p className="text-xs text-dark-300 line-clamp-2 leading-relaxed">
                  {c.description || 'Classroom for assignments and programming checks.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-dark-400" />
                    {c.member_count} Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-dark-400" />
                    {c.assignment_count} Problems
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Classroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-up space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent-amber" />
                Create New Classroom
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms - Sec A"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Weekly problem sets, recursion and dynamic programming practice."
                  value={classDesc}
                  onChange={(e) => setClassDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-dark-300 text-xs font-medium hover:bg-dark-750 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Classroom Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-up space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-brand-400" />
                Join Classroom via Invite Code
              </h2>
              <button onClick={() => setShowJoinModal(false)} className="text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                  Classroom Invite Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DSA-7F2K"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-sm font-mono font-bold uppercase text-brand-400 placeholder-dark-500 outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-dark-300 text-xs font-medium hover:bg-dark-750 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Joining...' : 'Join Classroom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
