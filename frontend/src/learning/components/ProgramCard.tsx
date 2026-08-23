import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Box, Sparkles } from 'lucide-react';
import { LearningProgram } from '../core/types';

interface ProgramCardProps {
  program: LearningProgram;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const difficultyColors = {
    easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    medium: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    hard: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
  };

  return (
    <div className="liquid-glass-card rounded-3xl p-6 flex flex-col justify-between space-y-5 border border-slate-200/80 dark:border-dark-700/80 group">
      <div className="space-y-3">
        {/* Category & Difficulty Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {program.category}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border ${
              difficultyColors[program.difficulty]
            }`}
          >
            {program.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-dark-300 line-clamp-2 leading-relaxed">
          {program.description}
        </p>

        {/* Complexity Metadata */}
        <div className="flex items-center gap-3 pt-2 font-mono text-[11px] text-slate-400 dark:text-dark-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Time: {program.timeComplexity.average}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Box className="w-3.5 h-3.5 text-slate-400" />
            <span>Space: {program.spaceComplexity}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {program.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 text-[10px] font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Link Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-dark-800">
        <Link
          to={`/my-class/${program.slug}`}
          className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 dark:bg-dark-800 hover:bg-brand-600 dark:hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-brand-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Start Learning & Simulation</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
