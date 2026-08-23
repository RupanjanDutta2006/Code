import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, Sparkles, Code2, BookOpen, Layers } from 'lucide-react';
import {
  ALL_LEARNING_PROGRAMS,
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide">
          <GraduationCap className="w-4 h-4" />
          <span>Interactive Algorithm Classroom</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Understand Code Visually,{' '}
          <span className="bg-gradient-to-r from-brand-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            One Step at a Time.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-dark-300 leading-relaxed">
          Watch code execute synchronized with animated data structures, step-by-step variable inspection, and real-time execution flow.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs, algorithms, concepts (e.g. bubble, binary search, tree)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl liquid-glass border border-slate-300 dark:border-dark-700 text-slate-900 dark:text-white text-sm outline-none focus:border-brand-500 shadow-xl transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-105'
                  : 'bg-white/80 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-dark-300 hover:border-slate-300 dark:hover:border-dark-600'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
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
          <div className="text-center py-16 rounded-3xl liquid-glass space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No programs matched "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-dark-400">
              Try searching for "bubble", "binary", "list", "stack", or clear filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
