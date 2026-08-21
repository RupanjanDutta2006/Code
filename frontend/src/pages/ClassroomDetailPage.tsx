import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  PlusCircle, 
  Users, 
  Copy, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  X, 
  Loader2,
  Calendar
} from 'lucide-react';
import { 
  api, 
  Classroom, 
  ClassroomAssignment, 
  LeaderboardEntry, 
  Program 
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ClassroomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<ClassroomAssignment[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Assign problem modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchClassroomData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [classRes, assignRes] = await Promise.all([
        api.get<Classroom>(`/api/classrooms/${id}`),
        api.get<ClassroomAssignment[]>(`/api/classrooms/${id}/assignments`),
      ]);
      setClassroom(classRes.data);
      setAssignments(assignRes.data);

      if (classRes.data.teacher_id === user?.id) {
        const lbRes = await api.get<LeaderboardEntry[]>(`/api/classrooms/${id}/leaderboard`);
        setLeaderboard(lbRes.data);
      }
    } catch (err) {
      console.error('Failed to load classroom details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomData();
  }, [id, user]);

  const handleOpenAssignModal = async () => {
    setShowAssignModal(true);
    try {
      const res = await api.get<Program[]>('/api/programs');
      setAvailablePrograms(res.data);
      if (res.data.length > 0) {
        setSelectedProgramId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load programs for assignment:', err);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId || !id) return;

    setAssignLoading(true);
    try {
      await api.post(`/api/classrooms/${id}/assign`, {
        program_id: Number(selectedProgramId),
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setShowAssignModal(false);
      fetchClassroomData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to assign problem.');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!classroom) return;
    navigator.clipboard.writeText(classroom.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return <div className="py-24 text-center text-dark-400">Loading classroom...</div>;
  }

  if (!classroom) {
    return <div className="py-24 text-center text-dark-300">Classroom not found or unauthorized.</div>;
  }

  const isClassTeacher = classroom.teacher_id === user?.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-dark-700 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Link
                to="/classrooms"
                className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {classroom.name}
              </h1>
            </div>
            <p className="text-xs text-dark-300">
              Instructor: <span className="text-white font-medium">{classroom.teacher_name}</span> • {classroom.member_count} Enrolled Students
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-950 border border-amber-500/30">
              <span className="text-xs text-dark-400">Invite Code:</span>
              <span className="font-mono font-bold text-sm text-amber-300">
                {classroom.invite_code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 text-dark-400 hover:text-white transition-colors"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isClassTeacher && (
              <button
                onClick={handleOpenAssignModal}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assign Problem</span>
              </button>
            )}
          </div>
        </div>

        {classroom.description && (
          <p className="text-xs text-dark-300 border-t border-dark-750 pt-3">
            {classroom.description}
          </p>
        )}
      </div>

      {/* Grid: Assigned Problems & Teacher Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Assigned Problems */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              Assigned Problems ({assignments.length})
            </h2>
          </div>

          {assignments.length === 0 ? (
            <div className="p-8 text-center text-dark-400 bg-dark-900 rounded-xl border border-dark-700">
              No problems assigned to this classroom yet.
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-dark-900 border border-dark-700/80 hover:border-brand-500/40 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">{a.program_title}</h3>
                      <span className="px-2 py-0.5 rounded bg-dark-800 text-dark-300 font-mono text-[10px] uppercase">
                        {a.program_language}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-dark-400 font-mono">
                      {a.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-dark-500" />
                          Due: {new Date(a.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Completion status */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono ${
                      a.my_submission_status.includes('✓')
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : a.my_submission_status === 'Not started'
                        ? 'bg-dark-800 text-dark-400'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {a.my_submission_status}
                    </span>

                    <Link
                      to={`/programs/${a.program_id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-sm transition-all flex items-center gap-1"
                    >
                      <span>Open & Solve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Leaderboard or Class Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-amber" />
              {isClassTeacher ? 'Student Leaderboard' : 'Class Progress'}
            </h2>
          </div>

          {isClassTeacher ? (
            <div className="rounded-xl border border-dark-700 bg-dark-900 overflow-hidden divide-y divide-dark-750 text-xs">
              <div className="p-3 bg-dark-850 font-semibold text-dark-300 flex items-center justify-between">
                <span>Student</span>
                <div className="flex gap-4">
                  <span>Score</span>
                  <span>Attempts</span>
                </div>
              </div>

              {leaderboard.length === 0 ? (
                <div className="p-6 text-center text-dark-400">No student submissions yet.</div>
              ) : (
                leaderboard.map((entry, idx) => (
                  <div key={entry.student_id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 font-bold font-mono text-dark-400">{idx + 1}.</span>
                      <div>
                        <div className="font-semibold text-white">{entry.student_name}</div>
                        <div className="text-[10px] text-dark-400">@{entry.student_username}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 font-mono">
                      <span className={entry.passed_count === entry.total_count && entry.total_count > 0 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {entry.passed_count}/{entry.total_count}
                      </span>
                      <span className="text-dark-400 w-8 text-right">
                        {entry.attempts}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="p-5 rounded-xl border border-dark-700 bg-dark-900 text-xs text-dark-300 space-y-3">
              <h3 className="font-semibold text-white text-sm">How Class Problems Work</h3>
              <p>
                1. Open any assigned problem above.<br />
                2. Write and test your solution with the built-in compiler.<br />
                3. Click &quot;Run My Solution Against Checks&quot; in Practice & Check mode to record your submission.
              </p>
              <div className="p-3 bg-dark-950 rounded-lg border border-dark-750 font-mono text-[11px] text-emerald-400">
                Passing all test checks automatically marks your assignment complete.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Problem Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-up space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-400" />
                Assign Problem to Class
              </h2>
              <button onClick={() => setShowAssignModal(false)} className="text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                  Select Program / Problem *
                </label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white outline-none focus:border-brand-500"
                >
                  {availablePrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-dark-300 text-xs font-medium hover:bg-dark-750 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {assignLoading ? 'Assigning...' : 'Assign to Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
