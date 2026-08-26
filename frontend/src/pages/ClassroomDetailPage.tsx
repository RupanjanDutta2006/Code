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
  Calendar,
  Share2,
  RefreshCw,
  Trash2,
  LogOut,
  ExternalLink,
  Code2,
  FileText,
  Pin,
  Send,
  AlertCircle,
  Play,
  Download,
  Lock,
  Unlock,
  School,
  Key,
  Upload
} from 'lucide-react';
import { 
  api, 
  Classroom, 
  ClassResource, 
  ClassAnnouncement, 
  ClassroomMember, 
  ClassroomAssignment, 
  LeaderboardEntry, 
  Program 
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const ClassroomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [activeTab, setActiveTab] = useState<'announcements' | 'notes' | 'code' | 'assignments' | 'members' | 'leaderboard'>('announcements');
  
  // Data states
  const [announcements, setAnnouncements] = useState<ClassAnnouncement[]>([]);
  const [resources, setResources] = useState<ClassResource[]>([]);
  const [assignments, setAssignments] = useState<ClassroomAssignment[]>([]);
  const [members, setMembers] = useState<ClassroomMember[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState<ClassroomAssignment | null>(null);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Form states
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPinned, setAnnPinned] = useState(false);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteCategory, setNoteCategory] = useState('Lecture Notes');
  const [noteUrl, setNoteUrl] = useState('');
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [codeTitle, setCodeTitle] = useState('');
  const [codeDesc, setCodeDesc] = useState('');
  const [codeLang, setCodeLang] = useState('cpp');
  const [codeCategory, setCodeCategory] = useState('Sample Code');
  const [codeSource, setCodeSource] = useState('');

  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignStarterCode, setAssignStarterCode] = useState('');
  const [assignStarterLang, setAssignStarterLang] = useState('cpp');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignProgramId, setAssignProgramId] = useState<number | ''>('');

  const [submitCode, setSubmitCode] = useState('');
  const [submitLang, setSubmitLang] = useState('cpp');
  const [submitNotes, setSubmitNotes] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchClassroomData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [classRes, annRes, resRes, assignRes, memRes] = await Promise.all([
        api.get<Classroom>(`/api/classrooms/${id}`),
        api.get<ClassAnnouncement[]>(`/api/classrooms/${id}/announcements`),
        api.get<ClassResource[]>(`/api/classrooms/${id}/resources`),
        api.get<ClassroomAssignment[]>(`/api/classrooms/${id}/assignments`),
        api.get<ClassroomMember[]>(`/api/classrooms/${id}/members`),
      ]);
      setClassroom(classRes.data);
      setAnnouncements(annRes.data);
      setResources(resRes.data);
      setAssignments(assignRes.data);
      setMembers(memRes.data);

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

  const isClassTeacher = classroom?.teacher_id === user?.id;

  // -------------------------------------------------------------
  // KEY MANAGEMENT & CONTROLS
  // -------------------------------------------------------------
  const handleCopyCode = () => {
    if (!classroom) return;
    navigator.clipboard.writeText(classroom.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareKey = () => {
    if (!classroom) return;
    const shareText = `Join my CodeVault classroom "${classroom.name}" with Access Key: ${classroom.invite_code}`;
    if (navigator.share) {
      navigator.share({
        title: classroom.name,
        text: shareText,
        url: window.location.origin + `/my-class?tab=classrooms`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRegenerateKey = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await api.post<{ invite_code: string }>(`/api/classrooms/${id}/key/regenerate`);
      if (classroom) {
        setClassroom({ ...classroom, invite_code: res.data.invite_code });
      }
      setShowRegenerateConfirm(false);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to regenerate key.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleJoining = async () => {
    if (!id || !classroom) return;
    try {
      const res = await api.patch<Classroom>(`/api/classrooms/${id}`, {
        joining_enabled: !classroom.joining_enabled,
      });
      setClassroom(res.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update joining status.');
    }
  };

  const handleDeleteClassroom = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/classrooms/${id}`);
      navigate('/my-class?tab=classrooms');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete classroom.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClassroom = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await api.post(`/api/classrooms/${id}/leave`);
      navigate('/my-class?tab=classrooms');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to leave classroom.');
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------------------------------------------
  // RESOURCE & ANNOUNCEMENT ACTIONS
  // -------------------------------------------------------------
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !annTitle.trim() || !annContent.trim()) return;

    setActionLoading(true);
    try {
      const res = await api.post<ClassAnnouncement>(`/api/classrooms/${id}/announcements`, {
        title: annTitle.trim(),
        content: annContent.trim(),
        is_pinned: annPinned,
      });
      setAnnouncements((prev) => [res.data, ...prev]);
      setShowAnnouncementModal(false);
      setAnnTitle('');
      setAnnContent('');
      setAnnPinned(false);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to post announcement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (annId: number) => {
    if (!id || !window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/api/classrooms/${id}/announcements/${annId}`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== annId));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete announcement.');
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !noteTitle.trim()) return;

    setActionLoading(true);
    setUploadProgress(null);
    let finalFileUrl = noteUrl.trim();

    try {
      if (noteFile) {
        setUploadProgress(10);
        const resourceId = `${Date.now()}_${noteFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storagePath = `classrooms/${id}/notes/${resourceId}`;
        const fileRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(fileRef, noteFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(progress);
            },
            (error) => {
              console.error('Storage upload failed:', error);
              reject(error);
            },
            async () => {
              finalFileUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const res = await api.post<ClassResource>(`/api/classrooms/${id}/resources`, {
        resource_type: 'note',
        title: noteTitle.trim(),
        description: noteDesc.trim() || undefined,
        category: noteCategory,
        file_url: finalFileUrl || undefined,
      });
      setResources((prev) => [res.data, ...prev]);
      setShowNoteModal(false);
      setNoteTitle('');
      setNoteDesc('');
      setNoteUrl('');
      setNoteFile(null);
      setUploadProgress(null);
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message || 'Failed to create note.');
    } finally {
      setActionLoading(false);
      setUploadProgress(null);
    }
  };

  const handleCreateCodeResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !codeTitle.trim() || !codeSource.trim()) return;

    setActionLoading(true);
    try {
      const res = await api.post<ClassResource>(`/api/classrooms/${id}/resources`, {
        resource_type: 'code',
        title: codeTitle.trim(),
        description: codeDesc.trim() || undefined,
        category: codeCategory,
        language: codeLang,
        source_code: codeSource,
      });
      setResources((prev) => [res.data, ...prev]);
      setShowCodeModal(false);
      setCodeTitle('');
      setCodeDesc('');
      setCodeSource('');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create code resource.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteResource = async (resId: number) => {
    if (!id || !window.confirm('Delete this resource?')) return;
    try {
      await api.delete(`/api/classrooms/${id}/resources/${resId}`);
      setResources((prev) => prev.filter((r) => r.id !== resId));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete resource.');
    }
  };

  const handlePracticeInCompiler = (code: string, language: string) => {
    navigate('/playground', {
      state: {
        code,
        language: language || 'cpp',
      },
    });
  };

  // -------------------------------------------------------------
  // ASSIGNMENT ACTIONS
  // -------------------------------------------------------------
  const handleOpenAssignModal = async () => {
    setShowAssignModal(true);
    try {
      const res = await api.get<Program[]>('/api/programs');
      setAvailablePrograms(res.data);
    } catch (err) {
      console.error('Failed to load programs for assignment:', err);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !assignTitle.trim()) return;

    setActionLoading(true);
    try {
      const res = await api.post<ClassroomAssignment>(`/api/classrooms/${id}/assign`, {
        title: assignTitle.trim(),
        description: assignDesc.trim() || undefined,
        instructions: assignInstructions.trim() || undefined,
        starter_code: assignStarterCode || undefined,
        starter_language: assignStarterLang,
        program_id: assignProgramId ? Number(assignProgramId) : undefined,
        due_date: assignDueDate ? new Date(assignDueDate).toISOString() : undefined,
      });
      setAssignments((prev) => [res.data, ...prev]);
      setShowAssignModal(false);
      setAssignTitle('');
      setAssignDesc('');
      setAssignInstructions('');
      setAssignStarterCode('');
      setAssignDueDate('');
      setAssignProgramId('');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to assign problem.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !showSubmitModal || !submitCode.trim()) return;

    setActionLoading(true);
    try {
      await api.post(`/api/classrooms/${id}/assignments/${showSubmitModal.id}/submit`, {
        source_code: submitCode,
        language: submitLang,
        notes: submitNotes.trim() || undefined,
      });
      setShowSubmitModal(null);
      setSubmitCode('');
      setSubmitNotes('');
      fetchClassroomData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to submit solution.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (studentId: number) => {
    if (!id || !window.confirm('Remove this student from the classroom?')) return;
    try {
      await api.delete(`/api/classrooms/${id}/members/${studentId}`);
      setMembers((prev) => prev.filter((m) => m.student_id !== studentId));
      if (classroom) {
        setClassroom({ ...classroom, member_count: Math.max(0, classroom.member_count - 1) });
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to remove member.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-dark-400 space-y-3">
        <div className="w-8 h-8 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading classroom workspace...</p>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="py-24 text-center text-dark-300 max-w-md mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-crimson-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Classroom not found or access denied.</h2>
        <p className="text-xs text-dark-400">
          You might not have access to this classroom or the class was deleted.
        </p>
        <Link
          to="/my-class?tab=classrooms"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Classrooms</span>
        </Link>
      </div>
    );
  }

  const noteResources = resources.filter((r) => r.resource_type === 'note' || r.resource_type === 'document');
  const codeResources = resources.filter((r) => r.resource_type === 'code');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
      
      {/* CLASSROOM HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0e0e13]/90 p-5 sm:p-7 shadow-xl backdrop-blur-xl space-y-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link
                to="/my-class?tab=classrooms"
                className="p-1.5 rounded-xl text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                title="Back to Classrooms"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 border border-crimson-500/20 text-xs font-mono font-bold">
                  {classroom.subject || 'Computer Science'}
                </span>
                {classroom.section && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-mono">
                    {classroom.section}
                  </span>
                )}
                {classroom.academic_level && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-mono">
                    {classroom.academic_level}
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {classroom.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300">
              Instructor: <span className="font-bold text-slate-900 dark:text-white">{classroom.teacher_name}</span> • {classroom.member_count} Enrolled Student{classroom.member_count !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Access Key Display Box & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-crimson-500/30 shadow-inner">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-crimson-500" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 dark:text-dark-400 uppercase tracking-wider block font-bold">
                    Access Key
                  </span>
                  <span className="font-mono font-extrabold text-sm sm:text-base text-crimson-600 dark:text-crimson-400">
                    {classroom.invite_code}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-xl text-slate-500 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
                  title="Copy Access Key"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleShareKey}
                  className="p-1.5 rounded-xl text-slate-500 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
                  title="Share Key"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {isClassTeacher && (
                  <button
                    onClick={() => setShowRegenerateConfirm(true)}
                    className="p-1.5 rounded-xl text-slate-500 dark:text-dark-300 hover:text-crimson-500 hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
                    title="Rotate / Regenerate Key"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {isClassTeacher ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleJoining}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    classroom.joining_enabled
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  }`}
                  title={classroom.joining_enabled ? 'Joining is Enabled' : 'Joining is Disabled'}
                >
                  {classroom.joining_enabled ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{classroom.joining_enabled ? 'Open' : 'Locked'}</span>
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 transition-colors"
                  title="Delete Classroom"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave Class</span>
              </button>
            )}
          </div>
        </div>

        {classroom.description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 border-t border-slate-200 dark:border-white/10 pt-3 leading-relaxed">
            {classroom.description}
          </p>
        )}
      </div>

      {/* WORKSPACE NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-crimson-600 text-white shadow-glow-red-sm'
              : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-white'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-crimson-600 text-white shadow-glow-red-sm'
              : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes & Docs ({noteResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'code'
              ? 'bg-crimson-600 text-white shadow-glow-red-sm'
              : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code Resources ({codeResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'assignments'
              ? 'bg-crimson-600 text-white shadow-glow-red-sm'
              : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Assignments ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'members'
              ? 'bg-crimson-600 text-white shadow-glow-red-sm'
              : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members ({members.length})</span>
        </button>

        {isClassTeacher && (
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>
        )}
      </div>

      {/* TAB: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pin className="w-4 h-4 text-crimson-500" />
              <span>Classroom Announcements</span>
            </h2>

            {isClassTeacher && (
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shadow-glow-red-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Notice</span>
              </button>
            )}
          </div>

          {announcements.length === 0 ? (
            <div className="p-8 text-center text-dark-400 bg-white/80 dark:bg-[#0e0e13]/80 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <Pin className="w-8 h-8 text-dark-500 mx-auto opacity-50" />
              <p className="text-xs font-medium">No announcements posted yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    ann.is_pinned
                      ? 'bg-crimson-950/20 border-crimson-500/40 shadow-glow-red-sm'
                      : 'bg-white/90 dark:bg-[#0e0e13]/90 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ann.is_pinned && (
                          <span className="px-2 py-0.5 rounded-md bg-crimson-600 text-white text-[10px] font-bold flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5" />
                            Pinned
                          </span>
                        )}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {ann.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-dark-400 font-mono">
                        Posted by {ann.author_name} • {new Date(ann.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {isClassTeacher && (
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-dark-200 mt-3 whitespace-pre-line leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: NOTES & DOCS */}
      {activeTab === 'notes' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-crimson-500" />
              <span>Study Notes & Handouts</span>
            </h2>

            {isClassTeacher && (
              <button
                onClick={() => setShowNoteModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shadow-glow-red-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            )}
          </div>

          {noteResources.length === 0 ? (
            <div className="p-8 text-center text-dark-400 bg-white/80 dark:bg-[#0e0e13]/80 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <FileText className="w-8 h-8 text-dark-500 mx-auto opacity-50" />
              <p className="text-xs font-medium">No study notes uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {noteResources.map((nr) => (
                <div
                  key={nr.id}
                  className="p-4 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 hover:border-crimson-500/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 text-[10px] font-bold">
                        {nr.category}
                      </span>
                      {isClassTeacher && (
                        <button
                          onClick={() => handleDeleteResource(nr.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {nr.title}
                    </h3>

                    {nr.description && (
                      <p className="text-xs text-slate-600 dark:text-dark-300 leading-relaxed line-clamp-2">
                        {nr.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-dark-400 text-[11px]">
                      By {nr.author_name}
                    </span>

                    {nr.file_url ? (
                      <a
                        href={nr.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-crimson-600 dark:text-crimson-400 font-bold hover:underline"
                      >
                        <span>Open Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-dark-500 text-[11px]">Text Note</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: CODE RESOURCES */}
      {activeTab === 'code' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-crimson-500" />
              <span>Verified Code Resources & Templates</span>
            </h2>

            {isClassTeacher && (
              <button
                onClick={() => setShowCodeModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shadow-glow-red-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Code Snippet</span>
              </button>
            )}
          </div>

          {codeResources.length === 0 ? (
            <div className="p-8 text-center text-dark-400 bg-white/80 dark:bg-[#0e0e13]/80 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <Code2 className="w-8 h-8 text-dark-500 mx-auto opacity-50" />
              <p className="text-xs font-medium">No code resources added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {codeResources.map((cr) => (
                <div
                  key={cr.id}
                  className="p-5 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 text-[10px] font-mono font-bold uppercase">
                          {cr.language || 'Code'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-[10px]">
                          {cr.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {cr.title}
                      </h3>
                      {cr.description && (
                        <p className="text-xs text-slate-600 dark:text-dark-300">
                          {cr.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePracticeInCompiler(cr.source_code || '', cr.language || 'cpp')}
                        className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shadow-glow-red-sm transition-all flex items-center gap-1.5 touch-target"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Practice in Compiler</span>
                      </button>

                      {isClassTeacher && (
                        <button
                          onClick={() => handleDeleteResource(cr.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {cr.source_code && (
                    <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-48 border border-white/5">
                      <code>{cr.source_code}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-crimson-500" />
              <span>Class Assignments ({assignments.length})</span>
            </h2>

            {isClassTeacher && (
              <button
                onClick={handleOpenAssignModal}
                className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shadow-glow-red-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Assign Problem</span>
              </button>
            )}
          </div>

          {assignments.length === 0 ? (
            <div className="p-8 text-center text-dark-400 bg-white/80 dark:bg-[#0e0e13]/80 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <BookOpen className="w-8 h-8 text-dark-500 mx-auto opacity-50" />
              <p className="text-xs font-medium">No problems assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 hover:border-crimson-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {a.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 font-mono text-[10px] uppercase">
                        {a.starter_language || a.program_language || 'python'}
                      </span>
                    </div>

                    {a.description && (
                      <p className="text-xs text-slate-600 dark:text-dark-300">
                        {a.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-dark-400 font-mono">
                      {a.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-crimson-500" />
                          Due: {new Date(a.due_date).toLocaleDateString()}
                        </span>
                      )}
                      <span>Max Score: {a.max_score || 100}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      a.my_submission_status.includes('✓')
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        : a.my_submission_status === 'Not started'
                        ? 'bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-dark-400'
                        : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    }`}>
                      {a.my_submission_status}
                    </span>

                    <button
                      onClick={() => handlePracticeInCompiler(a.starter_code || '', a.starter_language || 'cpp')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/10 hover:border-crimson-500/40 flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 text-crimson-500" />
                      <span>Solve in Compiler</span>
                    </button>

                    {!isClassTeacher && (
                      <button
                        onClick={() => {
                          setShowSubmitModal(a);
                          setSubmitCode(a.starter_code || '');
                          setSubmitLang(a.starter_language || 'cpp');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shadow-glow-red-sm transition-all flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: MEMBERS ROSTER */}
      {activeTab === 'members' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-crimson-500" />
              <span>Enrolled Students ({members.length})</span>
            </h2>
          </div>

          {members.length === 0 ? (
            <div className="p-8 text-center text-dark-400 bg-white/80 dark:bg-[#0e0e13]/80 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <Users className="w-8 h-8 text-dark-500 mx-auto opacity-50" />
              <p className="text-xs font-medium">No students enrolled in this classroom yet.</p>
              <p className="text-[11px] text-slate-500 dark:text-dark-500">
                Share access key <span className="font-mono font-bold text-crimson-500">{classroom.invite_code}</span> with students.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.student_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-dark-400 font-mono">
                      @{m.student_username}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-dark-500">
                      Joined: {new Date(m.joined_at).toLocaleDateString()}
                    </p>
                  </div>

                  {isClassTeacher && (
                    <button
                      onClick={() => handleRemoveMember(m.student_id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                      title="Remove Student"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: LEADERBOARD */}
      {activeTab === 'leaderboard' && isClassTeacher && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Student Performance Leaderboard</span>
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0e0e13]/90">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-dark-950 text-slate-500 dark:text-dark-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Passed Testcases</th>
                  <th className="p-3">Attempts</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Submission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {leaderboard.map((lb, idx) => (
                  <tr key={lb.student_id} className="hover:bg-slate-50 dark:hover:bg-dark-800/40">
                    <td className="p-3 font-mono font-bold text-amber-400">#{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {lb.student_name} <span className="text-[10px] text-slate-400">(@{lb.student_username})</span>
                    </td>
                    <td className="p-3 font-mono">{lb.passed_count}/{lb.total_count}</td>
                    <td className="p-3 font-mono">{lb.attempts}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lb.verdict === 'Accepted'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : lb.verdict === 'Not started'
                          ? 'bg-slate-100 dark:bg-dark-800 text-slate-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {lb.verdict}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-400">
                      {lb.last_submitted ? new Date(lb.last_submitted).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POST ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Post Notice / Announcement
              </h3>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Quiz on Trees tomorrow"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your announcement details..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={annPinned}
                  onChange={(e) => setAnnPinned(e.target.checked)}
                  className="rounded text-crimson-600 focus:ring-crimson-500"
                />
                <label htmlFor="pinNotice" className="text-xs text-slate-700 dark:text-dark-300">
                  Pin to top of classroom announcements
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50"
                >
                  {actionLoading ? 'Posting...' : 'Post Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Add Study Note / Handout
              </h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Binary Search Trees & AVL Balances"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Category
                </label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                >
                  <option value="Lecture Notes">Lecture Notes</option>
                  <option value="Cheatsheet">Cheatsheet</option>
                  <option value="Reference">Reference Material</option>
                  <option value="Practice Problems">Practice Problem Sheet</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Upload Document / File (PDF, Images, DOC, Markdown)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNoteFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-slate-500 dark:text-dark-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-crimson-500/10 file:text-crimson-600 dark:file:text-crimson-400 hover:file:bg-crimson-500/20"
                  />
                </div>
                {uploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-crimson-500">
                      <span>Uploading to Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-dark-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-crimson-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  OR External Link / Drive / Mega URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://..."
                  value={noteUrl}
                  onChange={(e) => setNoteUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of this material..."
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CODE RESOURCE MODAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Add Code Snippet
              </h3>
              <button onClick={() => setShowCodeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCodeResource} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dijkstra Shortest Path Algorithm"
                  value={codeTitle}
                  onChange={(e) => setCodeTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                    Language
                  </label>
                  <select
                    value={codeLang}
                    onChange={(e) => setCodeLang(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                  >
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                    Category
                  </label>
                  <select
                    value={codeCategory}
                    onChange={(e) => setCodeCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                  >
                    <option value="Sample Code">Sample Code</option>
                    <option value="Starter Template">Starter Template</option>
                    <option value="Algorithm">Algorithm Reference</option>
                    <option value="Solution">Solution Key</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Source Code *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="// Paste your code snippet here..."
                  value={codeSource}
                  onChange={(e) => setCodeSource(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-crimson-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Add Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN PROBLEM MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Assign Problem to Classroom
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Breadth First Search"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                    Language
                  </label>
                  <select
                    value={assignStarterLang}
                    onChange={(e) => setAssignStarterLang(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                  >
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Instructions & Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify problem constraints and expected output format..."
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Starter Code (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="// Starter template for students..."
                  value={assignStarterCode}
                  onChange={(e) => setAssignStarterCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-crimson-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50"
                >
                  {actionLoading ? 'Assigning...' : 'Assign Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT ASSIGNMENT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Submit Work: {showSubmitModal.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-dark-400">
                  Paste your verified solution code for instructor review.
                </p>
              </div>
              <button onClick={() => setShowSubmitModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSolution} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Language
                </label>
                <select
                  value={submitLang}
                  onChange={(e) => setSubmitLang(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                >
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Solution Code *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="// Paste your solution code here..."
                  value={submitCode}
                  onChange={(e) => setSubmitCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-crimson-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Notes / Explanation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Time complexity O(V+E), space O(V)"
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGENERATE KEY CONFIRMATION */}
      {showRegenerateConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Rotate Access Key?
            </h3>
            <p className="text-xs text-slate-600 dark:text-dark-300 leading-relaxed">
              Generating a new key immediately revokes the old access key for new joiners. Existing students will remain enrolled.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerateKey}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm"
              >
                {actionLoading ? 'Rotating...' : 'Yes, Rotate Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CLASSROOM CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-rose-500/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-rose-500 text-base flex items-center gap-1.5">
              <AlertCircle className="w-5 h-5" />
              <span>Delete Classroom?</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-dark-300 leading-relaxed">
              This action is permanent and will delete all classroom assignments, announcements, and notes.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClassroom}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                {actionLoading ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE CLASSROOM CONFIRMATION */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Leave Classroom?
            </h3>
            <p className="text-xs text-slate-600 dark:text-dark-300 leading-relaxed">
              Are you sure you want to leave "{classroom.name}"? You will need an access key to join again.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveClassroom}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                {actionLoading ? 'Leaving...' : 'Leave Class'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassroomDetailPage;
