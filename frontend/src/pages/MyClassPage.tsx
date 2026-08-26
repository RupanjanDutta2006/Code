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
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-10 mesh-gradient-bg transition-colors duration-200">
      {/* Hero Header */}
      <div className="text-center space-y-3 sm:space-y-5 max-w-3xl mx-auto pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-light-blueSoft dark:bg-gradient-to-r dark:from-neon-blue/15 dark:to-neon-purple/15 border border-light-blueBorder/50 dark:border-purple-500/30 text-light-blue dark:text-purple-300 text-xs font-bold tracking-wide shadow-xs">
          <GraduationCap className="w-4 h-4 text-light-blue dark:text-neon-purple" />
          <span>Interactive DSA Studio & Execution Traces</span>
        </div>

        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-light-textStrong dark:text-white tracking-tight font-sans">
          Understand Code Visually,{' '}
          <span className="text-gradient-neon">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithms, data structures (e.g. bubble sort, binary search, tree)..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 rounded-2xl bg-white dark:bg-[#0e1222]/90 border border-light-borderStrong dark:border-[#232b4b] text-light-textStrong dark:text-white text-sm sm:text-sm outline-none focus:border-light-blue dark:focus:border-purple-500 shadow-xs sm:shadow-md transition-all touch-target"
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
                  ? 'bg-light-blue border-light-blue text-white shadow-sm dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple dark:border-purple-400 dark:shadow-lg dark:shadow-brand-500/25 scale-105'
                  : 'bg-white dark:bg-dark-900/80 border-light-border dark:border-[#1b223c] text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:border-light-blueBorder dark:hover:border-purple-500/30'
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
          <div className="text-center py-16 rounded-3xl bg-white dark:bg-[#0e1222]/80 space-y-4 border border-light-border dark:border-[#232b4b] shadow-card-light">
            <BookOpen className="w-12 h-12 text-light-textMuted dark:text-dark-500 mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-light-textStrong dark:text-white font-sans">
              No matching algorithms found
            </h3>
            <p className="text-xs text-light-textSecondary dark:text-dark-400 max-w-sm mx-auto">
              We couldn't find any lessons matching "{searchQuery}". Try selecting "All Categories" or searching another topic.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2 rounded-xl bg-light-blueSoft text-light-blue border border-light-blueBorder/50 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 text-xs font-bold hover:scale-105 transition-all"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
