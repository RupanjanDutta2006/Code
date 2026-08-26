import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  Key, 
  Users, 
  Copy, 
  Check, 
  ArrowRight, 
  X, 
  Sparkles, 
  FileText, 
  Code2, 
  Layers, 
  School,
  Share2,
  Lock,
  Unlock,
  AlertCircle,
  HardDriveDownload
} from 'lucide-react';
import {
  CATEGORY_LABELS,
  searchLearningPrograms,
} from '../learning/registry/learningPrograms';
import { ProgramCard } from '../learning/components/ProgramCard';
import { AlgorithmCategory } from '../learning/core/types';
import { useAuth } from '../context/AuthContext';
import {
  FirestoreClassroom,
  normalizeAccessKey
} from '../services/classroomFirestore';
import { useUserClassrooms } from '../hooks/useUserClassrooms';
import { OfflineDownloadsTab } from '../components/OfflineDownloadsTab';
import { ModalPortal } from '../components/ModalPortal';

export const MyClassPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const initialTab: 'learning' | 'classrooms' | 'downloads' =
    rawTab === 'classrooms' ? 'classrooms' : rawTab === 'downloads' ? 'downloads' : 'learning';
  const [activeTab, setActiveTab] = useState<'learning' | 'classrooms' | 'downloads'>(initialTab);

  // Sync tab with URL search parameter
  const handleTabChange = (tab: 'learning' | 'classrooms' | 'downloads') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // -------------------------------------------------------------
  // INTERACTIVE LEARNING (DSA) STATE
  // -------------------------------------------------------------
  const [dsaSearchQuery, setDsaSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | 'all'>('all');

  const filteredPrograms = useMemo(() => {
    return searchLearningPrograms(dsaSearchQuery, selectedCategory);
  }, [dsaSearchQuery, selectedCategory]);

  const categories: (AlgorithmCategory | 'all')[] = [
    'all',
    'sorting',
    'searching',
    'linked-list',
    'stack-queue',
    'trees',
    'graphs',
    'recursion',
  ];

  // -------------------------------------------------------------
  // MULTI-TEACHER CLASSROOMS STATE (CANONICAL REALTIME HOOK)
  // -------------------------------------------------------------
  const { user, firebaseUser } = useAuth();
  const activeUid = firebaseUser?.uid || user?.uid || null;
  const { 
    classrooms, 
    loading: classroomLoading, 
    createClass, 
    joinClass,
    refresh: fetchClassrooms 
  } = useUserClassrooms(activeUid);

  const [classFilter, setClassFilter] = useState<'all' | 'enrolled' | 'created'>('all');
  const [classSearchQuery, setClassSearchQuery] = useState('');

  // Modals & Bottom Sheets
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [classSection, setClassSection] = useState('');
  const [classAcademicLevel, setClassAcademicLevel] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [createdClassInfo, setCreatedClassInfo] = useState<FirestoreClassroom | null>(null);

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreatedClassInfo(null);
    setActionError(null);
    setClassName('');
    setClassSubject('');
    setClassSection('');
    setClassAcademicLevel('');
    setClassDesc('');
  };

  const handleCloseJoinModal = () => {
    setShowJoinModal(false);
    setActionError(null);
    setInviteCodeInput('');
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    if (!activeUid) {
      setActionError('Please log in with Google or email to create a classroom.');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      const ownerName = user?.full_name || user?.displayName || firebaseUser?.displayName || user?.username || 'Instructor';
      const ownerEmail = user?.email || firebaseUser?.email || '';

      const created = await createClass(ownerName, ownerEmail, {
        name: className.trim(),
        subject: classSubject.trim() || 'General',
        section: classSection.trim() || undefined,
        academic_level: classAcademicLevel.trim() || undefined,
        description: classDesc.trim() || undefined,
      });

      setCreatedClassInfo(created);
      setClassName('');
      setClassSubject('');
      setClassSection('');
      setClassAcademicLevel('');
      setClassDesc('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to create classroom in Firestore. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = normalizeAccessKey(inviteCodeInput);
    if (!cleanKey) return;

    if (!activeUid) {
      setActionError('Please log in to join a classroom.');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      const studentName = user?.full_name || user?.displayName || firebaseUser?.displayName || user?.username || 'Student';
      const studentEmail = user?.email || firebaseUser?.email || '';

      await joinClass(studentName, studentEmail, cleanKey);
      handleCloseJoinModal();
    } catch (err: any) {
      setActionError(err.message || 'Invalid or expired classroom access key.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCode = (id: string, code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleShareKey = (classItem: FirestoreClassroom, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareText = `Join my CodeVault Pro classroom "${classItem.name}" with Access Key: ${classItem.invite_code}`;
    if (navigator.share) {
      navigator.share({
        title: classItem.name,
        text: shareText,
        url: window.location.origin + `/classrooms/${classItem.id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCodeId(classItem.id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((c) => {
      // Role filter
      if (classFilter === 'created' && c.my_role !== 'owner') return false;
      if (classFilter === 'enrolled' && c.my_role === 'owner') return false;

      // Search query
      if (classSearchQuery.trim()) {
        const q = classSearchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesSubject = c.subject?.toLowerCase().includes(q);
        const matchesTeacher = c.owner_name?.toLowerCase().includes(q);
        const matchesKey = c.invite_code.toLowerCase().includes(q);
        return matchesName || matchesSubject || matchesTeacher || matchesKey;
      }
      return true;
    });
  }, [classrooms, classFilter, classSearchQuery]);

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 mesh-gradient-bg transition-colors duration-200">
      
      {/* Primary Top Tabbed Segmented Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white/90 dark:bg-[#0c0c10]/90 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-xl gap-1.5 w-full sm:w-auto max-w-xl">
          <button
            onClick={() => handleTabChange('learning')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'learning'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm scale-[1.02]'
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Learning</span>
          </button>

          <button
            onClick={() => handleTabChange('classrooms')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'classrooms'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm scale-[1.02]'
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Classrooms</span>
          </button>

          <button
            onClick={() => handleTabChange('downloads')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'downloads'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm scale-[1.02]'
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>Downloads</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INTERACTIVE LEARNING (DSA) CONTENT                      */}
      {/* ============================================================== */}
      {activeTab === 'learning' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Learning Curriculum</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Interactive DSA Learning Hub
                </h1>
              </div>

              {/* Total Modules Counter */}
              <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-750 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-dark-400 block">Total Modules</span>
                <span className="text-base font-mono font-extrabold text-crimson-600 dark:text-crimson-400">
                  {filteredPrograms.length} Topics
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 max-w-2xl leading-relaxed">
              Step-by-step algorithmic concepts with animated visualizations, mathematical complexity breakdowns, theory cheat sheets, and live interactive compilers.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-400" />
                <input
                  type="text"
                  value={dsaSearchQuery}
                  onChange={(e) => setDsaSearchQuery(e.target.value)}
                  placeholder="Search algorithms by name, concept, or complexity (e.g. Quicksort, BFS)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-crimson-600 text-white border-crimson-500 shadow-glow-red-sm'
                      : 'bg-white dark:bg-[#111116] border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrograms.map((prog) => (
              <ProgramCard key={prog.id} program={prog} />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MULTI-TEACHER CLASSROOMS CONTENT (FIRESTORE)            */}
      {/* ============================================================== */}
      {activeTab === 'classrooms' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 text-xs font-bold font-mono">
                <School className="w-3.5 h-3.5" />
                <span>Cloud-Backed Classrooms</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Classrooms & Workspaces
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 max-w-xl leading-relaxed">
                Join your instructors, access study materials, write code in the browser, and submit verified assignments.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => {
                  setActionError(null);
                  setShowJoinModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2 shadow-sm touch-target"
              >
                <Key className="w-4 h-4 text-crimson-500" />
                <span>Join with Key</span>
              </button>

              <button
                onClick={() => {
                  setActionError(null);
                  setCreatedClassInfo(null);
                  setShowCreateModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shadow-glow-red-sm transition-all flex items-center gap-2 touch-target"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Classroom</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setClassFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  classFilter === 'all'
                    ? 'bg-crimson-600 text-white border-crimson-500 shadow-glow-red-sm'
                    : 'bg-white dark:bg-[#111116] border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300'
                }`}
              >
                All Classes ({classrooms.length})
              </button>

              <button
                onClick={() => setClassFilter('enrolled')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  classFilter === 'enrolled'
                    ? 'bg-crimson-600 text-white border-crimson-500 shadow-glow-red-sm'
                    : 'bg-white dark:bg-[#111116] border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300'
                }`}
              >
                Joined ({classrooms.filter((c) => c.my_role !== 'owner').length})
              </button>

              <button
                onClick={() => setClassFilter('created')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  classFilter === 'created'
                    ? 'bg-crimson-600 text-white border-crimson-500 shadow-glow-red-sm'
                    : 'bg-white dark:bg-[#111116] border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300'
                }`}
              >
                Created by Me ({classrooms.filter((c) => c.my_role === 'owner').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-dark-400" />
              <input
                type="text"
                value={classSearchQuery}
                onChange={(e) => setClassSearchQuery(e.target.value)}
                placeholder="Search by class, subject, teacher..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all"
              />
            </div>
          </div>

          {/* Classrooms Grid */}
          {classroomLoading ? (
            <div className="py-20 text-center text-dark-400 font-medium space-y-2">
              <div className="w-8 h-8 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Loading your classrooms from Firestore...</p>
            </div>
          ) : filteredClassrooms.length === 0 ? (
            <div className="py-16 text-center text-dark-400 bg-white/80 dark:bg-[#0e0e13]/80 rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-4 shadow-xl">
              <School className="w-12 h-12 text-crimson-500/60 mx-auto" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {classFilter === 'created'
                  ? "You haven't created any classrooms yet."
                  : classFilter === 'enrolled'
                  ? "You haven't joined any classrooms yet."
                  : "No classrooms found."}
              </h3>
              <p className="text-xs max-w-md mx-auto text-slate-500 dark:text-dark-400 leading-relaxed">
                {classFilter === 'created'
                  ? 'Click "Create Classroom" to start a new class and generate unique invitation keys for your students.'
                  : 'Ask your instructor for a classroom access key (e.g. DSA-7K4P) and click "Join with Key" to get permanent access.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActionError(null);
                    setShowJoinModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-dark-700 hover:border-crimson-500/40 transition-all"
                >
                  Join with Key
                </button>
                <button
                  onClick={() => {
                    setActionError(null);
                    setCreatedClassInfo(null);
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm transition-all"
                >
                  Create Classroom
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClassrooms.map((c) => (
                <Link
                  key={c.id}
                  to={`/classrooms/${c.id}`}
                  className="group relative p-5 rounded-3xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200/90 dark:border-white/10 hover:border-crimson-500/60 dark:hover:border-crimson-500/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl shadow-md overflow-hidden"
                >
                  {/* Subtle red reflection glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-crimson-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-crimson-500/10 transition-colors" />

                  <div className="space-y-3 relative z-10">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 border border-crimson-500/20 text-[11px] font-mono font-bold">
                        {c.subject || 'Classroom'}
                      </span>

                      {c.my_role === 'owner' ? (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          OWNER
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          STUDENT
                        </span>
                      )}
                    </div>

                    {/* Title & Teacher */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-crimson-500 dark:group-hover:text-crimson-400 transition-colors line-clamp-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">
                        By <span className="font-medium text-slate-700 dark:text-dark-200">{c.owner_name}</span>
                        {c.section && ` • ${c.section}`}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-dark-300 line-clamp-2 leading-relaxed">
                      {c.description || 'Interactive classroom with notes, assignments, and verified compiler solutions.'}
                    </p>

                    {/* Access Key Pill */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-slate-400 dark:text-dark-400" />
                        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-dark-200">
                          {c.invite_code}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleCopyCode(c.id, c.invite_code, e)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-slate-700 dark:text-dark-200 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        title="Copy Key"
                      >
                        {copiedCodeId === c.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{copiedCodeId === c.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-dark-400 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1" title="Enrolled Members">
                        <Users className="w-3.5 h-3.5 text-slate-400 dark:text-dark-500" />
                        {c.member_count}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-crimson-600 dark:text-crimson-400 font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>Enter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* CREATE CLASSROOM MODAL / BOTTOM SHEET                          */}
      {/* ============================================================== */}
      <ModalPortal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create Classroom"
        subtitle="Generate an isolated workspace with a unique access key"
        icon={<PlusCircle className="w-5 h-5" />}
        maxWidth="lg"
      >
        {actionError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {actionError}
          </div>
        )}

        {createdClassInfo ? (
          <div className="space-y-4 py-2 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Class Created Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
                Share this unique access key with your students to let them join.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-dark-950 border border-crimson-500/30 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-dark-400 uppercase tracking-wider block">
                Class Access Key
              </span>
              <div className="font-mono text-2xl font-extrabold text-crimson-600 dark:text-crimson-400 tracking-wider">
                {createdClassInfo.invite_code}
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(createdClassInfo.id, createdClassInfo.invite_code, e)}
                  className="px-4 py-1.5 rounded-xl bg-white dark:bg-dark-800 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 hover:border-crimson-500/40 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-crimson-500" />
                  <span>{copiedCodeId === createdClassInfo.id ? 'Copied!' : 'Copy Key'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleShareKey(createdClassInfo, e)}
                  className="px-4 py-1.5 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleCloseCreateModal}
                className="w-full sm:w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-750 transition-all text-center block"
              >
                Done
              </button>
              <Link
                to={`/classrooms/${createdClassInfo.id}`}
                onClick={handleCloseCreateModal}
                className="w-full sm:w-1/2 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm transition-all text-center block"
              >
                Open Classroom →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
                Class Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structures & Algorithms"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Python"
                  value={classSubject}
                  onChange={(e) => setClassSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
                  Section / Batch
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSE-A, Batch 2026"
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Weekly problem sets, trees, graphs, and competitive coding practice."
                value={classDesc}
                onChange={(e) => setClassDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all resize-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={handleCloseCreateModal}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-750 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50 transition-all"
              >
                {actionLoading ? 'Generating Key...' : 'Create & Generate Key'}
              </button>
            </div>
          </form>
        )}
      </ModalPortal>

      {/* ============================================================== */}
      {/* JOIN CLASSROOM MODAL / BOTTOM SHEET                            */}
      {/* ============================================================== */}
      <ModalPortal
        isOpen={showJoinModal}
        onClose={handleCloseJoinModal}
        title="Join Classroom"
        subtitle="Enter the access key provided by your instructor"
        icon={<Key className="w-5 h-5" />}
        maxWidth="md"
      >
        {actionError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {actionError}
          </div>
        )}

        <form onSubmit={handleJoinClass} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
              Classroom Access Key *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DSA-7K4P"
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-base font-mono font-extrabold uppercase text-crimson-600 dark:text-crimson-400 tracking-wider placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all text-center"
            />
            <p className="text-[11px] text-slate-500 dark:text-dark-400 mt-1.5 text-center">
              Case-insensitive. Once joined, this classroom appears permanently in your dashboard.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={handleCloseJoinModal}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-750 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50 transition-all"
            >
              {actionLoading ? 'Joining...' : 'Join Classroom'}
            </button>
          </div>
        </form>
      </ModalPortal>

      {/* ============================================================== */}
      {/* TAB 3: OFFLINE DOWNLOADS LIBRARY                               */}
      {/* ============================================================== */}
      {activeTab === 'downloads' && (
        <div className="animate-fade-in">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
            <OfflineDownloadsTab />
          </div>
        </div>
      )}

    </div>
  );
};

export default MyClassPage;
