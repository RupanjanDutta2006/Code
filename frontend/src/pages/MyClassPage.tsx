import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, BookOpen } from 'lucide-react';
import {
  CATEGORY_LABELS,
  searchLearningPrograms,
} from '../learning/registry/learningPrograms';
import { ProgramCard } from '../learning/components/ProgramCard';
import { AlgorithmCategory } from '../learning/core/types';

export const MyClassPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | 'all'>('all');

  const filteredPrograms = useMemo(() => {
    return searchLearningPrograms(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 mesh-gradient-bg">
      {/* Hero Header */}
      <div className="text-center space-y-5 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-neon-blue/15 to-neon-purple/15 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide shadow-sm">
          <GraduationCap className="w-4 h-4 text-neon-purple" />
          <span>Interactive DSA Studio & Execution Traces</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
          Understand Code Visually,{' '}
          <span className="text-gradient-neon">
            One Step at a Time.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-dark-300 leading-relaxed max-w-2xl mx-auto font-normal">
          Watch algorithm execution synchronized with animated data structures, step-by-step state inspection, and line-by-line code tracing.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithms, data structures, concepts (e.g. bubble sort, binary search, tree)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl oky-glass border border-slate-300 dark:border-[#232b4b] text-slate-900 dark:text-white text-sm outline-none focus:border-purple-500 shadow-xl transition-all"
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white border-purple-400 shadow-lg shadow-brand-500/25 scale-105'
                  : 'bg-white/80 dark:bg-dark-900/80 border-slate-200 dark:border-[#1b223c] text-slate-600 dark:text-dark-300 hover:text-white hover:border-purple-500/30'
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
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-dark-400">
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
          <div className="text-center py-16 rounded-3xl oky-glass space-y-4 border border-[#232b4b]">
            <BookOpen className="w-12 h-12 text-dark-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
              No programs matched "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-dark-400 max-w-sm mx-auto">
              Try searching for "bubble", "binary", "linked list", "stack", or clear active filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-md shadow-brand-500/20"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
