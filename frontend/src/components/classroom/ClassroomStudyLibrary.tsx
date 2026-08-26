import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Code2, 
  FileText, 
  ExternalLink, 
  Download, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  FolderGit2, 
  Plus, 
  Check, 
  Copy, 
  Layers, 
  Tag, 
  Trash2,
  AlertCircle,
  FolderArchive
} from 'lucide-react';
import { StudySubject, StudyTopic, StudyResourceItem, SupportedLanguage } from '../../services/studyLibraryRegistry';
import { ClassroomCustomLibraryItem, addClassroomLibraryItem, removeClassroomLibraryItem } from '../../services/studyLibraryFirestore';
import { ModalPortal } from '../ModalPortal';
import { saveMaterial } from '../../services/studyMaterialsStorage';
import { useAuth } from '../../context/AuthContext';

interface ClassroomStudyLibraryProps {
  classroomId: string;
  isOwner: boolean;
  subjects: StudySubject[];
  customItems: ClassroomCustomLibraryItem[];
}

export const ClassroomStudyLibrary: React.FC<ClassroomStudyLibraryProps> = ({
  classroomId,
  isOwner,
  subjects,
  customItems
}) => {
  const navigate = useNavigate();
  const { user, firebaseUser } = useAuth();
  const activeUid = firebaseUser?.uid || user?.uid || '';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('dsa');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('sorting');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>({});

  // Add Resource Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjectId, setNewSubjectId] = useState('dsa');
  const [newTopicId, setNewTopicId] = useState('sorting');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'theory' | 'notes' | 'code' | 'document' | 'assignment' | 'link' | 'github'>('code');
  const [newLang, setNewLang] = useState('c');
  const [newCode, setNewCode] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const currentSubject = useMemo(() => {
    return subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  }, [subjects, selectedSubjectId]);

  // Filter topics and resources based on search query and selected language
  const filteredTopics = useMemo(() => {
    if (!currentSubject) return [];

    const query = searchQuery.trim().toLowerCase();

    return currentSubject.topics.map(topic => {
      const matchingResources = topic.resources.filter(res => {
        // Language filter for DSA
        if (selectedSubjectId === 'dsa' && selectedLanguage !== 'all' && res.language) {
          if (res.language !== selectedLanguage) return false;
        }

        if (!query) return true;

        const inTitle = res.title.toLowerCase().includes(query);
        const inDesc = (res.description || '').toLowerCase().includes(query);
        const inLang = (res.language || '').toLowerCase().includes(query);
        const inType = res.resourceType.toLowerCase().includes(query);
        const inTopic = topic.title.toLowerCase().includes(query);

        return inTitle || inDesc || inLang || inType || inTopic;
      });

      return {
        ...topic,
        resources: matchingResources
      };
    }).filter(topic => topic.resources.length > 0 || !searchQuery);
  }, [currentSubject, selectedSubjectId, selectedLanguage, searchQuery]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePracticeInCompiler = (code: string, language?: string) => {
    let lang = (language || 'cpp').toLowerCase();
    if (lang === 'c') lang = 'c';
    else if (lang === 'python' || lang === 'py') lang = 'python';
    else if (lang === 'java') lang = 'java';
    else if (lang === 'cpp' || lang === 'c++') lang = 'cpp';
    else if (lang === 'javascript' || lang === 'js') lang = 'javascript';

    sessionStorage.setItem('codevault_prefill_code', code);
    sessionStorage.setItem('codevault_prefill_lang', lang);
    navigate('/playground');
  };

  const handleDownloadOffline = async (res: StudyResourceItem) => {
    if (!activeUid) return;
    try {
      const content = res.sourceCode || res.description || res.title;
      await saveMaterial({
        resourceId: res.id,
        resourceType: res.resourceType === 'theory' ? 'lesson' : res.resourceType === 'code' ? 'code-snippet' : 'note',
        title: res.title,
        userUid: activeUid,
        classroomId: classroomId,
        content: content,
        language: res.language || 'text',
        mimeType: 'text/plain',
        downloadedAt: Date.now(),
        sizeBytes: new Blob([content]).size,
      });
      setDownloadedIds(prev => ({ ...prev, [res.id]: true }));
      setTimeout(() => {
        setDownloadedIds(prev => ({ ...prev, [res.id]: false }));
      }, 2500);
    } catch (err) {
      console.warn('Offline download save error:', err);
    }
  };

  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setModalError('Title is required.');
      return;
    }

    setModalLoading(true);
    setModalError(null);
    try {
      await addClassroomLibraryItem(classroomId, {
        classroom_id: classroomId,
        subject_id: newSubjectId,
        topic_id: newTopicId.trim().toLowerCase().replace(/\s+/g, '-'),
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        resource_type: newType,
        language: newType === 'code' ? newLang : undefined,
        source_code: newType === 'code' ? newCode.trim() : undefined,
        github_url: (newType === 'github' || newLinkUrl.includes('github')) ? newLinkUrl.trim() : undefined,
        mega_url: newLinkUrl.includes('mega') ? newLinkUrl.trim() : undefined,
        file_url: (!newLinkUrl.includes('github') && !newLinkUrl.includes('mega')) ? newLinkUrl.trim() : undefined,
        author_name: user?.full_name || user?.displayName || user?.username || 'Instructor',
        uploaded_by: activeUid
      });

      setShowAddModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewCode('');
      setNewLinkUrl('');
    } catch (err: any) {
      console.error('Error adding library item:', err);
      setModalError(err.message || 'Failed to add resource to classroom library.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCustomItem = async (resourceId: string) => {
    if (!window.confirm('Remove this custom resource from the classroom library?')) return;
    try {
      await removeClassroomLibraryItem(classroomId, resourceId);
    } catch (err) {
      console.error('Delete resource error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0d0d12]/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-600 dark:text-crimson-400 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STUDY LIBRARY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Classroom Study & Algorithms Library
            </h2>
            <p className="text-xs text-slate-600 dark:text-dark-300 max-w-xl">
              Curated Data Structures & Algorithms, language tracks (C, Python, Java), theory notes, verified code implementations, and problem assignments.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowAddModal(true)}
              className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search topics, algorithms, languages (e.g. 'bubble sort', 'pointers', 'python oop')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-colors font-medium shadow-inner"
          />
        </div>
      </div>

      {/* Main Subjects Pill Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id);
                setExpandedTopicId(sub.topics[0]?.id || null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-crimson-500/10 border-crimson-500/50 shadow-glow-red-sm'
                  : 'bg-white dark:bg-[#0f0f14] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{sub.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sub.badgeBg}`}>
                  {sub.topics.reduce((acc, t) => acc + t.resources.length, 0)} Items
                </span>
              </div>
              <div>
                <h4 className={`text-xs font-extrabold ${isSelected ? 'text-crimson-600 dark:text-crimson-400' : 'text-slate-900 dark:text-white'}`}>
                  {sub.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-dark-400 truncate mt-0.5">
                  {sub.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* For DSA: Language Track Pills */}
      {selectedSubjectId === 'dsa' && (
        <div className="p-3 rounded-2xl bg-white dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-dark-300">
            <Code2 className="w-4 h-4 text-crimson-500" />
            <span>DSA Language Track:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['all', 'c', 'python', 'java', 'cpp'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                  selectedLanguage === lang
                    ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                    : 'bg-slate-100 dark:bg-dark-900 text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'all' ? 'All' : lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Topics & Resources List */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#0e0e13]/80 border border-slate-200 dark:border-white/10 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No materials found</h3>
            <p className="text-xs text-slate-500 dark:text-dark-400">
              No matching resources in this category. Try clearing your search filter.
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                className="rounded-3xl bg-white dark:bg-[#0e0e13]/90 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm transition-all"
              >
                {/* Topic Header Accordion Button */}
                <button
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-lg">
                      {topic.icon || '📁'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {topic.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-800 text-[10px] font-bold text-slate-500 dark:text-dark-400">
                          {topic.resources.length} {topic.resources.length === 1 ? 'Resource' : 'Resources'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-dark-400 line-clamp-1 mt-0.5">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 dark:text-dark-500">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Topic Resources */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-dark-950/40 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 gap-3.5">
                      {topic.resources.map((res) => {
                        const isCustom = customItems.some(c => c.id === res.id);
                        return (
                          <div
                            key={res.id}
                            className="p-4 rounded-2xl bg-white dark:bg-[#121217] border border-slate-200 dark:border-white/10 hover:border-crimson-500/40 transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Resource Type Badge */}
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-800 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-dark-300">
                                    {res.resourceType}
                                  </span>

                                  {/* Language Badge */}
                                  {res.language && (
                                    <span className="px-2 py-0.5 rounded-md bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-[10px] font-bold uppercase font-mono">
                                      {res.language}
                                    </span>
                                  )}

                                  {isCustom && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                                      Classroom Upload
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {res.title}
                                </h4>
                                {res.description && (
                                  <p className="text-[11px] text-slate-500 dark:text-dark-400 leading-relaxed">
                                    {res.description}
                                  </p>
                                )}
                              </div>

                              {/* Top Action Buttons */}
                              <div className="flex items-center gap-1.5 self-end sm:self-start">
                                {res.downloadableOffline && (
                                  <button
                                    onClick={() => handleDownloadOffline(res)}
                                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-600 dark:text-dark-300 text-xs font-medium transition-colors flex items-center gap-1"
                                    title="Download for Offline Access"
                                  >
                                    {downloadedIds[res.id] ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-[10px] text-emerald-500 font-bold">Saved!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Download className="w-3.5 h-3.5" />
                                        <span className="text-[10px]">Save Offline</span>
                                      </>
                                    )}
                                  </button>
                                )}

                                {isOwner && isCustom && (
                                  <button
                                    onClick={() => handleDeleteCustomItem(res.id)}
                                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs transition-colors"
                                    title="Delete custom resource"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Source Code Block */}
                            {res.sourceCode && (
                              <div className="space-y-2">
                                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5 text-[10px] font-mono text-slate-400">
                                    <span>{res.language?.toUpperCase() || 'CODE'}</span>
                                    <button
                                      onClick={() => handleCopyCode(res.id, res.sourceCode!)}
                                      className="flex items-center gap-1 hover:text-white transition-colors"
                                    >
                                      {copiedId === res.id ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-400" />
                                          <span className="text-emerald-400">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-3 text-[11px] font-mono text-slate-200 overflow-x-auto max-h-48 leading-relaxed">
                                    <code>{res.sourceCode}</code>
                                  </pre>
                                </div>

                                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                                  <button
                                    onClick={() => handlePracticeInCompiler(res.sourceCode!, res.language)}
                                    className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-1.5 transition-all"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Practice in Compiler</span>
                                  </button>

                                  {res.githubUrl && (
                                    <a
                                      href={res.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-dark-200 text-xs font-bold border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-all"
                                    >
                                      <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                                      <span>GitHub Source</span>
                                      <ExternalLink className="w-3 h-3 opacity-60" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* External Mega / Notes / Document Links */}
                            {(res.megaUrl || res.githubUrl || res.fileUrl) && !res.sourceCode && (
                              <div className="pt-1 flex items-center gap-2 flex-wrap">
                                {res.megaUrl && (
                                  <a
                                    href={res.megaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                                  >
                                    <FolderArchive className="w-3.5 h-3.5" />
                                    <span>Open Mega Storage Drive</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}

                                {res.githubUrl && (
                                  <a
                                    href={res.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-dark-200 border border-slate-200 dark:border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                                  >
                                    <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Open GitHub Repository</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}

                                {res.fileUrl && (
                                  <a
                                    href={res.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-xl bg-crimson-500/10 hover:bg-crimson-500/20 text-crimson-500 border border-crimson-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>View Document</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Classroom Resource Modal */}
      <ModalPortal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Classroom Resource"
        subtitle="Add theory, code, notes or problem sets to the study library"
        icon={<Plus className="w-5 h-5 text-crimson-500" />}
        maxWidth="lg"
      >
        <form onSubmit={handleAddResourceSubmit} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subject Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                Subject
              </label>
              <select
                value={newSubjectId}
                onChange={(e) => setNewSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              >
                <option value="dsa">🧠 Data Structures & Algorithms</option>
                <option value="c">💻 C Programming</option>
                <option value="python">🐍 Python Programming</option>
                <option value="java">☕ Java Programming</option>
              </select>
            </div>

            {/* Resource Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                Resource Type
              </label>
              <select
                value={newType}
                onChange={(e: any) => setNewType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              >
                <option value="code">Code Snippet (Interactive Compiler)</option>
                <option value="theory">Theory & Concepts</option>
                <option value="notes">Notes & Cheat Sheet</option>
                <option value="assignment">Assignment & Practice</option>
                <option value="github">GitHub Link</option>
                <option value="document">Document / Storage Link</option>
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
              Topic Name (e.g. 'sorting', 'pointers', 'oop', 'graphs')
            </label>
            <input
              type="text"
              required
              placeholder="e.g. sorting"
              value={newTopicId}
              onChange={(e) => setNewTopicId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 font-mono"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
              Resource Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Quick Sort Implementation in C"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief explanation or complexity notes..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
            />
          </div>

          {/* If Code Type */}
          {newType === 'code' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Programming Language
                </label>
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 uppercase font-mono"
                >
                  <option value="c">C</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                  Source Code
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste executable source code here..."
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 font-mono outline-none focus:border-crimson-500"
                />
              </div>
            </div>
          )}

          {/* External Link or GitHub / Mega URL */}
          {(newType === 'github' || newType === 'document' || newType === 'link' || newType === 'assignment') && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1">
                Resource URL (GitHub, Mega Drive, or Cloud Document)
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500 font-mono"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-750 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading || !newTitle.trim()}
              className="px-5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{modalLoading ? 'Adding...' : 'Add to Library'}</span>
            </button>
          </div>
        </form>
      </ModalPortal>
    </div>
  );
};
