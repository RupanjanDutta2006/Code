import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, Layers, Sparkles } from 'lucide-react';
import { C_CATEGORIES, getCategoryMeta } from '../learning/c/registry/cCategories';
import { ALL_C_LESSONS } from '../learning/c/registry/cProgramsRegistry';
import { CLessonCard } from '../learning/c/components/CLessonCard';
import { CCategoryId } from '../learning/c/core/types';

export const CCategoryPage: React.FC = () => {
  const { category: categoryId } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [filterQuery, setFilterQuery] = useState('');

  const category = useMemo(() => {
    return getCategoryMeta((categoryId || 'basics') as CCategoryId);
  }, [categoryId]);

  const lessons = useMemo(() => {
    return ALL_C_LESSONS.filter((l) => l.category === categoryId);
  }, [categoryId]);

  const filteredLessons = useMemo(() => {
    if (!filterQuery.trim()) return lessons;
    const q = filterQuery.toLowerCase().trim();
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.originalFilename.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [lessons, filterQuery]);

  if (!category) {
    return (
      <div className="min-h-screen py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Category not found</h2>
        <Link to="/my-class/c" className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs">
          Back to Fundamentals of C
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/my-class" className="hover:text-white transition-colors">
          My Class
        </Link>
        <span>&gt;</span>
        <Link to="/my-class/c" className="hover:text-white transition-colors">
          Fundamentals of C
        </Link>
        <span>&gt;</span>
        <span className="text-brand-400 font-bold">{category.name}</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl liquid-glass border border-slate-200/80 dark:border-dark-700/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link
              to="/my-class/c"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-700 dark:text-dark-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {category.name}
            </h1>
            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-300 font-mono text-xs font-bold">
              {lessons.length} {lessons.length === 1 ? 'Program' : 'Programs'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-dark-300">
            {category.description}
          </p>
        </div>

        {/* Filter within category */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter within category..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/80 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Program Cards Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <CLessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl liquid-glass space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No programs found matching "{filterQuery}"
          </h3>
          <button
            onClick={() => setFilterQuery('')}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};
