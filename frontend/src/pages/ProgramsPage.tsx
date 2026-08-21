import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Layers, 
  Code2, 
  Play, 
  History, 
  ListChecks, 
  Clock, 
  User,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-brand-400" />
            Public Code Library
          </h1>
          <p className="text-sm text-dark-300 mt-1">
            Browse and run verified student programs, algorithms, data structures, and examples.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-400 focus:border-brand-500 outline-none transition-colors"
          />
        </form>
      </div>

      {/* Language Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {LANGUAGE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedLang(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              selectedLang === f.id
                ? 'bg-brand-600 border-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'bg-dark-900 border-dark-700 text-dark-300 hover:text-white hover:bg-dark-800'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-dark-400 font-medium">
          Loading code library...
        </div>
      ) : programs.length === 0 ? (
        <div className="py-20 text-center text-dark-400 bg-dark-900 rounded-2xl border border-dark-700 space-y-2">
          <p className="text-base font-semibold text-dark-200">No programs found.</p>
          <p className="text-xs">Try adjusting your search query or language filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p) => (
            <Link
              key={p.id}
              to={`/programs/${p.id}`}
              className="group p-5 rounded-2xl bg-dark-900/90 border border-dark-700/80 hover:border-brand-500/50 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono text-[11px] font-semibold uppercase">
                    {p.language}
                  </span>
                  <span className="text-[11px] text-dark-400 flex items-center gap-1 font-medium">
                    <Folder className="w-3.5 h-3.5 text-dark-500" />
                    {p.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {p.title}
                </h3>

                <p className="text-xs text-dark-300 line-clamp-2 leading-relaxed">
                  {p.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1" title="Versions">
                    <History className="w-3.5 h-3.5 text-dark-400" />
                    v{p.version_count || 1}
                  </span>

                  {(p.test_case_count || 0) > 0 && (
                    <span className="flex items-center gap-1 text-emerald-400" title="Checks available">
                      <ListChecks className="w-3.5 h-3.5" />
                      {p.test_case_count} Checks
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-brand-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Open</span>
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
