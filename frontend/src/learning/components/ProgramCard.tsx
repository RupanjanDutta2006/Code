import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Box, Sparkles } from 'lucide-react';
import { LearningProgram } from '../core/types';

interface ProgramCardProps {
  program: LearningProgram;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const difficultyColors = {
    easy: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30',
    medium: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30',
    hard: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30',
  };

  return (
    <div className="bg-white dark:bg-[#0f0f13]/85 rounded-3xl p-6 flex flex-col justify-between space-y-5 border border-light-border dark:border-white/10 group hover:border-crimson-500/40 dark:hover:border-crimson-500/40 shadow-card-light dark:shadow-md hover:shadow-glow-red-sm transition-all duration-200 backdrop-blur-xl hover:translate-y-[-2px]">
      <div className="space-y-3.5">
        {/* Category & Difficulty Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-crimson-600 dark:text-crimson-400 px-2.5 py-0.5 rounded-full bg-crimson-500/10 dark:bg-crimson-500/10 border border-crimson-500/30 dark:border-crimson-500/30">
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
        <h3 className="text-xl font-extrabold text-light-textStrong dark:text-white group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors font-sans tracking-tight">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-light-textSecondary dark:text-dark-300 line-clamp-2 leading-relaxed">
          {program.description}
        </p>

        {/* Complexity Metadata */}
        <div className="flex items-center gap-3 pt-1 font-mono text-[11px] text-light-textMuted dark:text-dark-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-crimson-500 dark:text-crimson-400" />
            <span>Time: {program.timeComplexity.average}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-crimson-500 dark:text-crimson-400" />
            <span>Space: {program.spaceComplexity}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {program.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-lg bg-light-secondary dark:bg-[#141419] text-light-textSecondary dark:text-dark-300 text-[10px] font-medium border border-light-border dark:border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Link Button */}
      <div className="pt-3 border-t border-light-border dark:border-white/10">
        <Link
          to={`/my-class/${program.slug}`}
          className="w-full py-3 px-4 rounded-2xl bg-crimson-600 hover:bg-crimson-700 dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 dark:hover:from-crimson-500 dark:hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-red-sm hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch Interactive Studio</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
