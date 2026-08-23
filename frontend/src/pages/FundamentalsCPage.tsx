import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Terminal, Sparkles, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import { C_CATEGORIES } from '../learning/c/registry/cCategories';
import { ALL_C_LESSONS, searchCLessons } from '../learning/c/registry/cProgramsRegistry';
import { CCategoryCard } from '../learning/c/components/CCategoryCard';
import { CLessonCard } from '../learning/c/components/CLessonCard';

export const FundamentalsCPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Category lesson counts computed dynamically from the registry
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of C_CATEGORIES) {
      counts[cat.id] = ALL_C_LESSONS.filter((l) => l.category === cat.id).length;
    }
    return counts;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCLessons(searchQuery);
  }, [searchQuery]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Top Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Link
            to="/my-class"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 text-slate-700 dark:text-dark-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Class Hub</span>
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
          <Terminal className="w-4 h-4" />
          <span>FUNDAMENTALS OF C • {ALL_C_LESSONS.length} Verified Lessons</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Learn C Programming{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400 bg-clip-text text-transparent">
            Visually, Step by Step.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-dark-300 leading-relaxed">
          Explore complete standard C programs from the official repository with line-by-line simulation, variable tracking, digit breakdown, matrix visualizers, and memory scoping.
        </p>

        {/* Global C Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 146 C programs (e.g. maximum, armstrong, prime, matrix, bubble, string)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl liquid-glass border border-slate-300 dark:border-dark-700 text-slate-900 dark:text-white text-sm outline-none focus:border-brand-500 shadow-xl transition-all"
            />
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS VIEW (if search is active) */}
      {searchQuery.trim() ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
              Found {searchResults.length} C programs matching "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-brand-500 hover:underline"
            >
              Clear Search
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((lesson) => (
                <CLessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl liquid-glass space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No C programs matched "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-500 dark:text-dark-400">
                Try searching for keywords like "add", "even", "armstrong", "pattern", "max", or "matrix".
              </p>
            </div>
          )}
        </div>
      ) : (
        /* CATEGORIES DASHBOARD */
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Explore by Category
              </h2>
              <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">
                Browse through all 11 topics from the Fundamentals of C syllabus
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              11 Categories • {ALL_C_LESSONS.length} Programs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {C_CATEGORIES.map((cat) => (
              <CCategoryCard
                key={cat.id}
                category={cat}
                lessonCount={categoryCounts[cat.id] || 0}
              />
            ))}
          </div>

          {/* Featured Top Lessons */}
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Popular Reference Lessons</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-dark-400">
                  Quick start with core curriculum examples
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_C_LESSONS.slice(0, 6).map((lesson) => (
                <CLessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
