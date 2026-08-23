import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, Sparkles, Code2, BookOpen, Layers, Terminal, ArrowRight } from 'lucide-react';
import {
  ALL_LEARNING_PROGRAMS,
  CATEGORY_LABELS,
  searchLearningPrograms,
} from '../learning/registry/learningPrograms';
import { ALL_C_LESSONS } from '../learning/c/registry/cProgramsRegistry';
import { C_CATEGORIES } from '../learning/c/registry/cCategories';
import { ProgramCard } from '../learning/components/ProgramCard';
import { CCategoryCard } from '../learning/c/components/CCategoryCard';
import { AlgorithmCategory } from '../learning/core/types';

export const MyClassPage: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'all' | 'c' | 'dsa'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | 'all'>('all');

  const filteredDSA = useMemo(() => {
    return searchLearningPrograms(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const categories: (AlgorithmCategory | 'all')[] = [
    'all',
    'sorting',
    'searching',
    'arrays',
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
          <span>Interactive Code Classroom</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Understand Code Visually,{' '}
          <span className="bg-gradient-to-r from-brand-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            One Step at a Time.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-dark-300 leading-relaxed">
          Watch code execute synchronized with animated data structures, step-by-step variable inspection, memory state, and real-time execution flow.
        </p>

        {/* Top-Level Curriculums Switcher */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setActiveMainTab('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeMainTab === 'all'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-105'
                : 'bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-dark-300'
            }`}
          >
            All Tracks ({ALL_C_LESSONS.length + ALL_LEARNING_PROGRAMS.length})
          </button>

          <Link
            to="/my-class/c"
            className="px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Fundamentals of C ({ALL_C_LESSONS.length} Programs)</span>
          </Link>

          <button
            onClick={() => setActiveMainTab('dsa')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeMainTab === 'dsa'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                : 'bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-dark-300'
            }`}
          >
            DSA Visualizer ({ALL_LEARNING_PROGRAMS.length} Lessons)
          </button>
        </div>
      </div>

      {/* PROMINENT "FUNDAMENTALS OF C" BANNER SECTION */}
      {(activeMainTab === 'all' || activeMainTab === 'c') && (
        <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-teal-500/10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-mono font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>NEW CURRICULUM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Fundamentals of C Programming
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300">
                146 complete C programs across 11 categories: Basics, If-Else, Number Checking, Nested Loops, Arrays, Sorting, 2D Matrix, Strings, Structs, and Files.
              </p>
            </div>

            <Link
              to="/my-class/c"
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <span>Explore All 146 C Lessons</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Categories Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
            {C_CATEGORIES.slice(0, 8).map((cat) => {
              const count = ALL_C_LESSONS.filter((l) => l.category === cat.id).length;

              return (
                <Link
                  key={cat.id}
                  to={`/my-class/c/${cat.id}`}
                  className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-800/80 hover:bg-white dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700 text-xs font-semibold flex items-center justify-between transition-all group"
                >
                  <span className="text-slate-800 dark:text-white truncate group-hover:text-blue-500">
                    {cat.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono text-[10px] font-bold">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* DATA STRUCTURES & ALGORITHMS SECTION */}
      {(activeMainTab === 'all' || activeMainTab === 'dsa') && (
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-500" />
                <span>Data Structures & Algorithm Simulations</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-dark-400">
                Interactive multi-language algorithm traces with animated visualizers
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-white/80 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-dark-300'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DSA Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDSA.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
