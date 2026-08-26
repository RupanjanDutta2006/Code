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
import { useAuth } from '../context/AuthContext';
import { 
  FirestoreClassroom, 
  FirestoreClassResource, 
  FirestoreClassAnnouncement, 
  FirestoreClassroomMember, 
  FirestoreClassAssignment,
  FirestoreAssignmentSubmission,
  getFirestoreClassroom,
  getFirestoreAnnouncements,
  getFirestoreResources,
  getFirestoreAssignments,
  getFirestoreMembers,
  getFirestoreSubmissions,
  createFirestoreAnnouncement,
  deleteFirestoreAnnouncement,
  createFirestoreResource,
  deleteFirestoreResource,
  createFirestoreAssignment,
  submitFirestoreAssignment,
  regenerateFirestoreAccessKey,
  toggleFirestoreJoining,
  deleteFirestoreClassroom,
  leaveFirestoreClassroom,
  removeFirestoreMember
} from '../services/classroomFirestore';

export const ClassroomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, firebaseUser } = useAuth();

  const [classroom, setClassroom] = useState<FirestoreClassroom | null>(null);
  const [activeTab, setActiveTab] = useState<'announcements' | 'notes' | 'code' | 'assignments' | 'members'>('announcements');
  
  // Data states
  const [announcements, setAnnouncements] = useState<FirestoreClassAnnouncement[]>([]);
  const [resources, setResources] = useState<FirestoreClassResource[]>([]);
  const [assignments, setAssignments] = useState<FirestoreClassAssignment[]>([]);
  const [members, setMembers] = useState<FirestoreClassroomMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState<FirestoreClassAssignment | null>(null);
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

  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignStarterCode, setAssignStarterCode] = useState('');
  const [assignStarterLang, setAssignStarterLang] = useState('cpp');
  const [assignDueDate, setAssignDueDate] = useState('');

  const [submitCode, setSubmitCode] = useState('');
  const [submitLang, setSubmitLang] = useState('cpp');

  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const uid = firebaseUser?.uid || user?.uid || '';
  const currentUserName = user?.full_name || firebaseUser?.displayName || user?.username || 'Member';
  const currentUserEmail = user?.email || firebaseUser?.email || '';

  const fetchClassroomData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [classData, annData, resData, assignData, memData] = await Promise.all([
        getFirestoreClassroom(id, uid),
        getFirestoreAnnouncements(id),
        getFirestoreResources(id),
        getFirestoreAssignments(id, uid),
        getFirestoreMembers(id),
      ]);
      setClassroom(classData);
      setAnnouncements(annData);
      setResources(resData);
      setAssignments(assignData);
      setMembers(memData);
    } catch (err) {
      console.error('Failed to load classroom details from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomData();
  }, [id, user, firebaseUser]);

  const isClassTeacher = classroom?.my_role === 'owner' || classroom?.ownerUid === uid || classroom?.owner_id === uid;

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
        url: window.location.origin + `/classrooms/${classroom.id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRegenerateKey = async () => {
    if (!id || !uid) return;
    setActionLoading(true);
    try {
      const newKey = await regenerateFirestoreAccessKey(id, uid, classroom?.subject);
      if (classroom) {
        setClassroom({ ...classroom, invite_code: newKey, access_key: newKey });
      }
      setShowRegenerateConfirm(false);
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate key.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleJoining = async () => {
    if (!id || !classroom) return;
    try {
      const nextState = !classroom.joining_enabled;
      await toggleFirestoreJoining(id, nextState);
      setClassroom({ ...classroom, joining_enabled: nextState });
    } catch (err: any) {
      alert(err.message || 'Failed to update enrollment status.');
    }
  };

  const handleDeleteClassroom = async () => {
    if (!id || !uid) return;
    setActionLoading(true);
    try {
      await deleteFirestoreClassroom(id, uid);
      navigate('/my-class?tab=classrooms');
    } catch (err: any) {
      alert(err.message || 'Failed to delete classroom.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClassroom = async () => {
    if (!id || !uid) return;
    setActionLoading(true);
    try {
      await leaveFirestoreClassroom(id, uid);
      navigate('/my-class?tab=classrooms');
    } catch (err: any) {
      alert(err.message || 'Failed to leave classroom.');
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
      const created = await createFirestoreAnnouncement(
        id, 
        uid, 
        currentUserName, 
        annTitle, 
        annContent, 
        annPinned
      );
      setAnnouncements((prev) => [created, ...prev]);
      setShowAnnouncementModal(false);
      setAnnTitle('');
      setAnnContent('');
      setAnnPinned(false);
    } catch (err: any) {
      alert(err.message || 'Failed to post announcement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (annId: string) => {
    if (!id || !window.confirm('Delete this announcement?')) return;
    try {
      await deleteFirestoreAnnouncement(id, annId);
      setAnnouncements((prev) => prev.filter((a) => a.id !== annId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete announcement.');
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !noteTitle.trim()) return;

    setActionLoading(true);
    setUploadProgress(null);
    try {
      const created = await createFirestoreResource(
        id,
        uid,
        currentUserName,
        {
          resource_type: noteFile ? 'document' : (noteUrl ? 'link' : 'note'),
          title: noteTitle,
          description: noteDesc,
          category: noteCategory,
          file: noteFile,
          file_url: noteUrl || undefined,
        },
        (progress) => setUploadProgress(progress)
      );
      setResources((prev) => [created, ...prev]);
      setShowNoteModal(false);
      setNoteTitle('');
      setNoteDesc('');
      setNoteUrl('');
      setNoteFile(null);
      setUploadProgress(null);
    } catch (err: any) {
      alert(err.message || 'Failed to upload note/document.');
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
      const created = await createFirestoreResource(
        id,
        uid,
        currentUserName,
        {
          resource_type: 'code',
          title: codeTitle,
          description: codeDesc,
          category: codeCategory,
          language: codeLang,
          source_code: codeSource,
        }
      );
      setResources((prev) => [created, ...prev]);
      setShowCodeModal(false);
      setCodeTitle('');
      setCodeDesc('');
      setCodeSource('');
    } catch (err: any) {
      alert(err.message || 'Failed to create code snippet.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteResource = async (resId: string) => {
    if (!id || !window.confirm('Delete this resource?')) return;
    try {
      await deleteFirestoreResource(id, resId);
      setResources((prev) => prev.filter((r) => r.id !== resId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete resource.');
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
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !assignTitle.trim()) return;

    setActionLoading(true);
    try {
      const created = await createFirestoreAssignment(
        id,
        uid,
        currentUserName,
        {
          title: assignTitle,
          description: assignDesc,
          instructions: assignInstructions,
          starter_code: assignStarterCode,
          starter_language: assignStarterLang,
          due_date: assignDueDate || undefined,
        }
      );
      setAssignments((prev) => [created, ...prev]);
      setShowAssignModal(false);
      setAssignTitle('');
      setAssignDesc('');
      setAssignInstructions('');
      setAssignStarterCode('');
      setAssignDueDate('');
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !showSubmitModal || !submitCode.trim()) return;

    setActionLoading(true);
    try {
      await submitFirestoreAssignment(
        id,
        showSubmitModal.id,
        uid,
        currentUserName,
        currentUserEmail,
        submitCode,
        submitLang
      );
      setAssignments((prev) => prev.map((a) => a.id === showSubmitModal.id ? { ...a, my_submission_status: 'submitted' } : a));
      setShowSubmitModal(null);
      setSubmitCode('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit solution.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (studentUid: string) => {
    if (!id || !window.confirm('Remove this member from the classroom?')) return;
    try {
      await removeFirestoreMember(id, studentUid);
      setMembers((prev) => prev.filter((m) => m.user_id !== studentUid && m.id !== studentUid));
      if (classroom) {
        setClassroom({ ...classroom, member_count: Math.max(1, classroom.member_count - 1) });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to remove member.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-dark-400 space-y-3">
        <div className="w-8 h-8 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading classroom workspace from Firestore...</p>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="py-24 text-center text-dark-300 max-w-md mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-crimson-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Classroom not found or access denied.</h2>
        <p className="text-xs text-dark-400">
          You might not have enrolled in this classroom or the class was deleted.
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

  const noteResources = resources.filter((r) => r.resource_type === 'note' || r.resource_type === 'document' || r.resource_type === 'link');
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
                {isClassTeacher ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
                    OWNER
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    STUDENT
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {classroom.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-dark-400">
              Instructor: <span className="font-semibold text-slate-700 dark:text-dark-200">{classroom.owner_name}</span>
              {classroom.description && ` • ${classroom.description}`}
            </p>
          </div>

          {/* Access Key & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-white/10 flex items-center gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-dark-500 block">Class Key</span>
                <span className="text-xs sm:text-sm font-mono font-extrabold text-crimson-600 dark:text-crimson-400 tracking-wider">
                  {classroom.invite_code}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-xl bg-white dark:bg-dark-800 text-slate-700 dark:text-dark-300 hover:text-crimson-500 border border-slate-200 dark:border-white/10 transition-colors"
                title="Copy Key"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShareKey}
                className="p-1.5 rounded-xl bg-crimson-600 text-white shadow-glow-red-sm transition-transform hover:scale-105"
                title="Share Class Key"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {isClassTeacher ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowRegenerateConfirm(true)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-700 dark:text-dark-300 border border-slate-200 dark:border-white/10 transition-colors"
                  title="Regenerate Key"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleJoining}
                  className={`p-2 rounded-xl border transition-colors ${
                    classroom.joining_enabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  }`}
                  title={classroom.joining_enabled ? "Enrollment Active (Click to Lock)" : "Enrollment Locked (Click to Unlock)"}
                >
                  {classroom.joining_enabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
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
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave Class</span>
              </button>
            )}
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-t border-slate-200 dark:border-white/10 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Announcements ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lecture Notes ({noteResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Vault ({codeResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Assignments ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members ({members.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pin className="w-4 h-4 text-crimson-500" />
              <span>Announcements & Updates</span>
            </h2>
            {isClassTeacher && (
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            )}
          </div>

          {announcements.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 text-center text-dark-400 space-y-2">
              <Pin className="w-8 h-8 text-slate-400 dark:text-dark-500 mx-auto" />
              <p className="text-xs font-medium">No announcements posted in this classroom yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    a.is_pinned
                      ? 'bg-crimson-500/5 dark:bg-crimson-500/10 border-crimson-500/30'
                      : 'bg-white/90 dark:bg-[#0e0e13]/90 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {a.is_pinned && (
                          <span className="px-2 py-0.5 rounded-md bg-crimson-500/20 text-crimson-600 dark:text-crimson-400 text-[10px] font-bold">
                            PINNED
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{a.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-dark-400">
                        Posted by {a.author_name} • {a.created_at}
                      </p>
                    </div>
                    {isClassTeacher && (
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-dark-200 mt-2.5 whitespace-pre-wrap leading-relaxed">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LECTURE NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-crimson-500" />
              <span>Lecture Notes & Documents</span>
            </h2>
            {isClassTeacher && (
              <button
                onClick={() => setShowNoteModal(true)}
                className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Upload Note</span>
              </button>
            )}
          </div>

          {noteResources.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 text-center text-dark-400 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 dark:text-dark-500 mx-auto" />
              <p className="text-xs font-medium">No notes uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {noteResources.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-bold">
                        {r.category}
                      </span>
                      {isClassTeacher && (
                        <button
                          onClick={() => handleDeleteResource(r.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
                    {r.description && (
                      <p className="text-xs text-slate-600 dark:text-dark-300 line-clamp-2">{r.description}</p>
                    )}
                  </div>
                  {r.file_url && (
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-xs font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-crimson-500" />
                      <span>Open Document</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CODE VAULT */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-crimson-500" />
              <span>Shared Code & Snippets</span>
            </h2>
            {isClassTeacher && (
              <button
                onClick={() => setShowCodeModal(true)}
                className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Share Code</span>
              </button>
            )}
          </div>

          {codeResources.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 text-center text-dark-400 space-y-2">
              <Code2 className="w-8 h-8 text-slate-400 dark:text-dark-500 mx-auto" />
              <p className="text-xs font-medium">No code snippets shared yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {codeResources.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
                      <span className="text-[10px] font-mono text-crimson-500 uppercase font-bold">{r.language || 'CPP'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePracticeInCompiler(r.source_code || '', r.language || 'cpp')}
                        className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Run in Sandbox</span>
                      </button>
                      {isClassTeacher && (
                        <button
                          onClick={() => handleDeleteResource(r.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {r.source_code && (
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-white/5 max-h-56">
                      {r.source_code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-crimson-500" />
              <span>Classroom Assignments</span>
            </h2>
            {isClassTeacher && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Assignment</span>
              </button>
            )}
          </div>

          {assignments.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 text-center text-dark-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-400 dark:text-dark-500 mx-auto" />
              <p className="text-xs font-medium">No assignments active right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                        Max Score: {a.max_score}
                      </span>
                      {a.my_submission_status === 'submitted' && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                          SUBMITTED
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{a.title}</h3>
                    {a.description && (
                      <p className="text-xs text-slate-600 dark:text-dark-300">{a.description}</p>
                    )}
                    {a.due_date && (
                      <p className="text-[11px] text-slate-500 dark:text-dark-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Due: {a.due_date}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    {a.starter_code && (
                      <button
                        onClick={() => handlePracticeInCompiler(a.starter_code || '', a.starter_language || 'cpp')}
                        className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-xs font-bold text-slate-800 dark:text-white transition-colors"
                      >
                        Open Starter Code
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowSubmitModal(a);
                        setSubmitCode(a.starter_code || '');
                        setSubmitLang(a.starter_language || 'cpp');
                      }}
                      className="flex-1 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm transition-colors text-center"
                    >
                      {a.my_submission_status === 'submitted' ? 'Resubmit Solution' : 'Submit Solution'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-crimson-500" />
            <span>Classroom Roster ({members.length})</span>
          </h2>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
            {members.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-crimson-500/10 text-crimson-500 font-bold flex items-center justify-center text-xs">
                    {m.student_name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.student_name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-dark-400">{m.email || 'Classroom Member'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    m.role === 'owner' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {m.role === 'owner' ? 'OWNER' : 'STUDENT'}
                  </span>
                  {isClassTeacher && m.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(m.user_id || m.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REGENERATE CONFIRM MODAL */}
      {showRegenerateConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Regenerate Access Key?</h3>
            <p className="text-xs text-slate-500 dark:text-dark-400 leading-relaxed">
              The existing key will stop working for new joins. Existing enrolled members will retain full access.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold text-slate-700 dark:text-dark-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerateKey}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm"
              >
                {actionLoading ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Classroom?</h3>
            <p className="text-xs text-rose-500 dark:text-rose-400 leading-relaxed">
              This action cannot be undone. All notes, announcements, and assignments will be permanently deleted.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold text-slate-700 dark:text-dark-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClassroom}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-glow-red-sm"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE CONFIRM MODAL */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Leave Classroom?</h3>
            <p className="text-xs text-slate-500 dark:text-dark-400 leading-relaxed">
              You will lose access to classroom resources until you re-join with a valid access key.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold text-slate-700 dark:text-dark-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveClassroom}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-glow-red-sm"
              >
                {actionLoading ? 'Leaving...' : 'Leave Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Post Announcement</h3>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Announcement Title"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
              <textarea
                required
                rows={4}
                placeholder="Write your announcement message..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 resize-none"
              />
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-dark-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={annPinned}
                  onChange={(e) => setAnnPinned(e.target.checked)}
                  className="rounded text-crimson-600 focus:ring-crimson-500"
                />
                <span>Pin announcement to the top</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm"
                >
                  {actionLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTE UPLOAD MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Note / Document</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNote} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Document Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
              <input
                type="text"
                placeholder="Category (e.g. Trees, Algorithms)"
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
              <textarea
                rows={2}
                placeholder="Description"
                value={noteDesc}
                onChange={(e) => setNoteDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 resize-none"
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block">Attach File</label>
                <input
                  type="file"
                  onChange={(e) => setNoteFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-crimson-500/10 file:text-crimson-500 hover:file:bg-crimson-500/20"
                />
              </div>
              <input
                type="url"
                placeholder="Or external URL (Drive, Mega, etc.)"
                value={noteUrl}
                onChange={(e) => setNoteUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
              {uploadProgress !== null && (
                <div className="w-full bg-slate-200 dark:bg-dark-800 rounded-full h-2">
                  <div className="bg-crimson-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm"
                >
                  {actionLoading ? 'Uploading...' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CODE SHARE MODAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Share Code Snippet</h3>
              <button onClick={() => setShowCodeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCodeResource} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Snippet Title"
                value={codeTitle}
                onChange={(e) => setCodeTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
              <select
                value={codeLang}
                onChange={(e) => setCodeLang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              >
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
              <textarea
                required
                rows={6}
                placeholder="Paste code snippet here..."
                value={codeSource}
                onChange={(e) => setCodeSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 font-mono text-emerald-400 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-crimson-500 resize-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm"
                >
                  {actionLoading ? 'Saving...' : 'Share Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGNMENT CREATE MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Assignment</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Problem Title"
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
              <textarea
                rows={2}
                placeholder="Problem description and task"
                value={assignDesc}
                onChange={(e) => setAssignDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 resize-none"
              />
              <textarea
                rows={4}
                placeholder="Starter code (optional)"
                value={assignStarterCode}
                onChange={(e) => setAssignStarterCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 font-mono text-emerald-400 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-crimson-500 resize-none"
              />
              <input
                type="date"
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm"
                >
                  {actionLoading ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT SOLUTION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Solution: {showSubmitModal.title}
              </h3>
              <button onClick={() => setShowSubmitModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitSolution} className="space-y-3">
              <textarea
                required
                rows={8}
                placeholder="Paste your completed solution code here..."
                value={submitCode}
                onChange={(e) => setSubmitCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 font-mono text-emerald-400 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-crimson-500 resize-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassroomDetailPage;
