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
  Share2
} from 'lucide-react';
import {
  CATEGORY_LABELS,
  searchLearningPrograms,
} from '../learning/registry/learningPrograms';
import { ProgramCard } from '../learning/components/ProgramCard';
import { AlgorithmCategory } from '../learning/core/types';
import { api, Classroom } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MyClassPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'classrooms' ? 'classrooms' : 'learning';
  const [activeTab, setActiveTab] = useState<'learning' | 'classrooms'>(initialTab);

  // Sync tab with URL search parameter
  const handleTabChange = (tab: 'learning' | 'classrooms') => {
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
  // MULTI-TEACHER CLASSROOMS STATE
  // -------------------------------------------------------------
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomLoading, setClassroomLoading] = useState(false);
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
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);
  const [createdClassInfo, setCreatedClassInfo] = useState<Classroom | null>(null);

  const fetchClassrooms = async () => {
    if (!user) return;
    setClassroomLoading(true);
    try {
      const res = await api.get<Classroom[]>('/api/classrooms');
      setClassrooms(res.data);
    } catch (err) {
      console.error('Failed to load classrooms:', err);
    } finally {
      setClassroomLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'classrooms') {
      fetchClassrooms();
    }
  }, [activeTab, user]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    setActionLoading(true);
    setActionError(null);
    try {
      const res = await api.post<Classroom>('/api/classrooms', {
        name: className.trim(),
        subject: classSubject.trim() || undefined,
        section: classSection.trim() || undefined,
        academic_level: classAcademicLevel.trim() || undefined,
        description: classDesc.trim() || undefined,
      });
      setClassrooms((prev) => [res.data, ...prev]);
      setCreatedClassInfo(res.data);
      setClassName('');
      setClassSubject('');
      setClassSection('');
      setClassAcademicLevel('');
      setClassDesc('');
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Failed to create classroom. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    setActionLoading(true);
    setActionError(null);
    try {
      const res = await api.post<Classroom>('/api/classrooms/join', {
        invite_code: inviteCodeInput.trim(),
      });
      // Add or update classroom list
      setClassrooms((prev) => {
        const filtered = prev.filter((c) => c.id !== res.data.id);
        return [res.data, ...filtered];
      });
      setShowJoinModal(false);
      setInviteCodeInput('');
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Invalid or expired classroom access key.');
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

  const handleShareKey = (classItem: Classroom, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareText = `Join my CodeVault Pro classroom "${classItem.name}" with Access Key: ${classItem.invite_code}`;
    if (navigator.share) {
      navigator.share({
        title: classItem.name,
        text: shareText,
        url: window.location.origin + `/my-class?tab=classrooms`,
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
      if (classFilter === 'created' && !c.is_teacher) return false;
      if (classFilter === 'enrolled' && c.is_teacher) return false;

      // Search query
      if (classSearchQuery.trim()) {
        const q = classSearchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesSubject = c.subject?.toLowerCase().includes(q);
        const matchesTeacher = c.teacher_name?.toLowerCase().includes(q);
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
        <div className="inline-flex p-1.5 rounded-2xl bg-white/90 dark:bg-[#0c0c10]/90 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-xl gap-1.5 w-full sm:w-auto max-w-md">
          <button
            onClick={() => handleTabChange('learning')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'learning'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm scale-[1.02]'
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-white" />
            <span>Interactive Learning</span>
          </button>

          <button
            onClick={() => handleTabChange('classrooms')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'classrooms'
                ? 'bg-crimson-600 text-white shadow-glow-red-sm scale-[1.02]'
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800'
            }`}
          >
            <School className="w-4 h-4 text-white" />
            <span>My Classrooms</span>
            {classrooms.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                {classrooms.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INTERACTIVE DSA STUDIO & STEP-BY-STEP TRACES            */}
      {/* ============================================================== */}
      {activeTab === 'learning' && (
        <div className="space-y-6 sm:space-y-10 animate-fade-in">
          {/* Hero Header */}
          <div className="text-center space-y-3 sm:space-y-5 max-w-3xl mx-auto pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-500/10 dark:bg-[#141418] border border-crimson-500/30 text-crimson-600 dark:text-crimson-400 text-xs font-bold tracking-wide shadow-xs">
              <GraduationCap className="w-4 h-4 text-crimson-500 dark:text-crimson-400" />
              <span>Interactive DSA Studio & Execution Traces</span>
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-light-textStrong dark:text-white tracking-tight font-sans">
              Understand Code Visually,{' '}
              <span className="text-gradient-red">
                One Step at a Time.
              </span>
            </h1>

            <p className="text-xs sm:text-base text-light-textSecondary dark:text-dark-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Watch algorithm execution synchronized with animated data structures, step-by-step state inspection, and line-by-line code tracing.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto pt-2 sm:pt-4">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 text-light-textMuted dark:text-dark-400" />
                <input
                  type="text"
                  value={dsaSearchQuery}
                  onChange={(e) => setDsaSearchQuery(e.target.value)}
                  placeholder="Search algorithms, data structures (e.g. bubble sort, binary search, tree)..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 rounded-2xl bg-white dark:bg-[#0e0e13]/90 border border-light-borderStrong dark:border-white/10 text-light-textStrong dark:text-white text-sm sm:text-sm outline-none focus:border-crimson-500 shadow-xs sm:shadow-md transition-all touch-target"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 justify-start sm:justify-center">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border shadow-card-light ${
                    isSelected
                      ? 'bg-crimson-600 border-crimson-500 text-white shadow-glow-red-sm dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 dark:border-crimson-400 scale-105'
                      : 'bg-white dark:bg-[#111116]/80 border-light-border dark:border-white/10 text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:border-crimson-500/30 dark:hover:border-crimson-500/30'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* Results Count & Grid */}
          <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono font-medium text-light-textMuted dark:text-dark-400">
                Showing {filteredPrograms.length} Interactive Lessons
              </span>
            </div>

            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl bg-white dark:bg-[#0e0e13]/80 space-y-4 border border-light-border dark:border-white/10 shadow-card-light">
                <BookOpen className="w-12 h-12 text-light-textMuted dark:text-dark-500 mx-auto opacity-60" />
                <h3 className="text-lg font-bold text-light-textStrong dark:text-white font-sans">
                  No matching algorithms found
                </h3>
                <p className="text-xs text-light-textSecondary dark:text-dark-400 max-w-sm mx-auto">
                  We couldn't find any lessons matching "{dsaSearchQuery}". Try selecting "All Categories" or searching another topic.
                </p>
                <button
                  onClick={() => {
                    setDsaSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-5 py-2 rounded-xl bg-crimson-500/10 text-crimson-600 border border-crimson-500/30 dark:bg-crimson-950/40 dark:text-crimson-300 dark:border-crimson-500/40 text-xs font-bold hover:scale-105 transition-all shadow-glow-red-sm"
                >
                  Reset Search & Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MULTI-TEACHER CLASSROOMS & ACCESS KEYS                  */}
      {/* ============================================================== */}
      {activeTab === 'classrooms' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-500">
                  <School className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  CodeVault Classrooms
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 max-w-xl leading-relaxed">
                Connect with your instructors, access private lecture notes, complete coding assignments, and practice live in the compiler.
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
                Joined ({classrooms.filter((c) => !c.is_teacher).length})
              </button>

              <button
                onClick={() => setClassFilter('created')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  classFilter === 'created'
                    ? 'bg-crimson-600 text-white border-crimson-500 shadow-glow-red-sm'
                    : 'bg-white dark:bg-[#111116] border-slate-200 dark:border-white/10 text-slate-600 dark:text-dark-300'
                }`}
              >
                Created by Me ({classrooms.filter((c) => c.is_teacher).length})
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
              <p className="text-xs">Loading your classrooms...</p>
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

                      {c.is_teacher ? (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          Instructor
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          Enrolled
                        </span>
                      )}
                    </div>

                    {/* Title & Teacher */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-crimson-500 dark:group-hover:text-crimson-400 transition-colors line-clamp-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">
                        By <span className="font-medium text-slate-700 dark:text-dark-200">{c.teacher_name}</span>
                        {c.section && ` • ${c.section}`}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-dark-300 line-clamp-2 leading-relaxed">
                      {c.description || 'Interactive classroom with notes, assignments, and verified compiler solutions.'}
                    </p>

                    {/* Access Key Pill */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-dark-950/60 border border-slate-200 dark:border-white/5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-crimson-500" />
                        <span className="font-mono font-bold text-slate-800 dark:text-dark-100">
                          {c.invite_code}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleCopyCode(c.id, c.invite_code, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
                          title="Copy Access Key"
                        >
                          {copiedCodeId === c.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleShareKey(c, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors"
                          title="Share Key"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-dark-400 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400 dark:text-dark-500" />
                        {c.member_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-dark-500" />
                        {c.resource_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-slate-400 dark:text-dark-500" />
                        {c.assignment_count || 0}
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
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-crimson-500/10 text-crimson-500 border border-crimson-500/30">
                  <PlusCircle className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Create Classroom
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-dark-400">
                    Generate an isolated workspace with a unique access key
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                    Classroom Created Successfully!
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
                      onClick={(e) => handleCopyCode(createdClassInfo.id, createdClassInfo.invite_code, e)}
                      className="px-4 py-1.5 rounded-xl bg-white dark:bg-dark-800 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 hover:border-crimson-500/40 flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-crimson-500" />
                      <span>{copiedCodeId === createdClassInfo.id ? 'Copied!' : 'Copy Key'}</span>
                    </button>
                    <button
                      onClick={(e) => handleShareKey(createdClassInfo, e)}
                      className="px-4 py-1.5 rounded-xl bg-crimson-600 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Link
                    to={`/classrooms/${createdClassInfo.id}`}
                    className="w-full py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm transition-all text-center block"
                  >
                    Open Classroom Workspace →
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
                    onClick={() => setShowCreateModal(false)}
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
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* JOIN CLASSROOM MODAL / BOTTOM SHEET                            */}
      {/* ============================================================== */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-crimson-500/10 text-crimson-500 border border-crimson-500/30">
                  <Key className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Join Classroom
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-dark-400">
                    Enter the access key provided by your instructor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                  Once joined, this classroom appears permanently in your dashboard.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-750 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50 transition-all"
                >
                  {actionLoading ? 'Validating Key...' : 'Join Classroom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyClassPage;

