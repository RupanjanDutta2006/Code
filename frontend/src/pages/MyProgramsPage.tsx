import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FolderPlus, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit, 
  History, 
  BarChart3, 
  ArrowRight,
  Folder,
  Globe,
  Lock,
  ListChecks
} from 'lucide-react';
import { api, Program } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MyProgramsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMyPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get<Program[]>('/api/programs?only_mine=true');
      setPrograms(res.data);
    } catch (err) {
      console.error('Failed to load my programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPrograms();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this program from your library?')) return;

    try {
      await api.delete(`/api/programs/${id}`);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete program:', err);
    }
  };

  const filteredPrograms = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-brand-400" />
            My Programs
          </h1>
          <p className="text-sm text-dark-300 mt-1">
            Manage, organize, version, and inspect analytics for your personal code library.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/import"
            className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-white font-medium text-xs border border-dark-700 transition-colors flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4 text-accent-cyan" />
            <span>Import Folder</span>
          </Link>
          <Link
            to="/create"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Program</span>
          </Link>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter your programs by title, language, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-400 focus:border-brand-500 outline-none transition-colors"
        />
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-dark-400 font-medium">
          Loading your personal programs...
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="py-20 text-center text-dark-400 bg-dark-900 rounded-2xl border border-dark-700 p-8 space-y-4">
          <p className="text-base font-semibold text-dark-200">No programs in your library yet.</p>
          <p className="text-xs max-w-md mx-auto">
            You can write a new program directly online or import entire folders from your local computer in one click!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/create"
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              Create Program
            </Link>
            <Link
              to="/import"
              className="px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-white text-xs font-semibold"
            >
              Import Local Folder
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/programs/${p.id}`)}
              className="group p-5 rounded-2xl bg-dark-900/90 border border-dark-700/80 hover:border-brand-500/50 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono text-[11px] font-semibold uppercase">
                    {p.language}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.is_public ? (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Public
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>
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
                  <span className="flex items-center gap-1" title="Revisions">
                    <History className="w-3.5 h-3.5" />
                    v{p.version_count || 1}
                  </span>

                  {(p.test_case_count || 0) > 0 && (
                    <span className="flex items-center gap-1 text-emerald-400" title="Checks attached">
                      <ListChecks className="w-3.5 h-3.5" />
                      {p.test_case_count}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(e, p.id)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-rose-400 hover:bg-dark-800 transition-colors"
                    title="Delete program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-brand-400 font-semibold flex items-center gap-0.5 ml-1">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
