import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Layers, 
  History, 
  ListChecks, 
  ArrowRight,
  Folder
} from 'lucide-react';
import { api, Program } from '../services/api';

const LANGUAGE_FILTERS = [
  { id: '', name: 'All Languages' },
  { id: 'python', name: 'Python' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'html', name: 'HTML/CSS' },
  { id: 'sql', name: 'SQL' },
];

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedLang) params.append('language', selectedLang);
      if (selectedCategory) params.append('category', selectedCategory);

      const res = await api.get<Program[]>(`/api/programs?${params.toString()}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setPrograms(res.data);
      } else {
        const { getLocalPrograms } = await import('../services/defaultPrograms');
        let local = getLocalPrograms();
        if (selectedLang) local = local.filter((p) => p.language.toLowerCase() === selectedLang.toLowerCase());
        if (searchQuery) local = local.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
        setPrograms(local);
      }
    } catch (err) {
      const { getLocalPrograms } = await import('../services/defaultPrograms');
      let local = getLocalPrograms();
      if (selectedLang) local = local.filter((p) => p.language.toLowerCase() === selectedLang.toLowerCase());
      if (searchQuery) local = local.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      setPrograms(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [selectedLang, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrograms();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 mesh-gradient-bg min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 sm:pb-2">
        <div>
          <h1 className="text-xl sm:text-4xl font-extrabold text-light-textStrong dark:text-white flex items-center gap-2.5 sm:gap-3 font-sans">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-light-blue dark:bg-gradient-to-tr dark:from-neon-blue dark:to-neon-purple text-white flex items-center justify-center shadow-md dark:shadow-brand-500/25 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Programs Library
          </h1>
          <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-300 mt-1 sm:mt-2">
            Explore, practice, and run verified student programs, algorithms, data structures, and examples.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-88">
          <Search className="w-4 h-4 text-light-textMuted dark:text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0e1222]/90 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-sm sm:text-xs text-light-textStrong dark:text-white placeholder-light-textMuted dark:placeholder-dark-400 focus:border-light-blue dark:focus:border-purple-500 outline-none transition-colors shadow-xs touch-target"
          />
        </form>
      </div>

      {/* Language Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {LANGUAGE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedLang(f.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-card-light ${
              selectedLang === f.id
                ? 'bg-light-blue border-light-blue text-white shadow-sm dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple dark:border-purple-400 dark:shadow-md dark:shadow-brand-500/25 scale-105'
                : 'bg-white dark:bg-dark-900/80 border-light-border dark:border-[#1b223c] text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:border-light-blueBorder dark:hover:border-purple-500/30'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div className="py-24 text-center text-light-textMuted dark:text-dark-400 font-semibold animate-pulse">
          Loading CodeVault program repository...
        </div>
      ) : programs.length === 0 ? (
        <div className="py-20 text-center text-light-textSecondary dark:text-dark-400 bg-white dark:bg-dark-900/80 rounded-3xl border border-light-border dark:border-[#232b4b] space-y-3 shadow-card-light">
          <p className="text-base font-bold text-light-textStrong dark:text-white">No programs found.</p>
          <p className="text-xs text-light-textMuted dark:text-dark-300">Try adjusting your search query or language filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Link
              key={p.id}
              to={`/programs/${p.id}`}
              className="group p-6 rounded-3xl bg-white dark:bg-[#0e1222]/80 border border-light-border dark:border-[#232b4b] hover:border-light-blueBorder dark:hover:border-purple-500/40 transition-all duration-200 flex flex-col justify-between shadow-card-light hover:shadow-card-hover-light"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-light-blueSoft text-light-blue border border-light-blueBorder/40 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25 font-mono text-[10px] font-bold uppercase">
                    {p.language}
                  </span>
                  <span className="text-[11px] text-light-textMuted dark:text-dark-400 flex items-center gap-1.5 font-medium">
                    <Folder className="w-3.5 h-3.5 text-light-blue dark:text-indigo-400" />
                    {p.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-light-textStrong dark:text-white group-hover:text-light-blue dark:group-hover:text-purple-300 transition-colors line-clamp-1 font-sans">
                  {p.title}
                </h3>

                <p className="text-xs text-light-textSecondary dark:text-dark-300 line-clamp-2 leading-relaxed">
                  {p.description || 'Verified student and classroom program repository.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-light-border dark:border-[#1b223c] flex items-center justify-between text-xs text-light-textMuted dark:text-dark-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono text-[11px]" title="Versions">
                    <History className="w-3.5 h-3.5 text-light-textMuted dark:text-dark-400" />
                    v{p.version_count || 1}
                  </span>

                  {(p.test_case_count || 0) > 0 && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold" title="Checks available">
                      <ListChecks className="w-3.5 h-3.5" />
                      {p.test_case_count} Checks
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-light-blue dark:text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
