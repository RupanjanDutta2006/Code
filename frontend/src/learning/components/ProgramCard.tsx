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
    <div className="bg-white dark:bg-[#0e1222]/80 rounded-3xl p-6 flex flex-col justify-between space-y-5 border border-light-border dark:border-[#232b4b] group hover:border-light-blueBorder dark:hover:border-purple-500/40 shadow-card-light hover:shadow-card-hover-light transition-all duration-200">
      <div className="space-y-3.5">
        {/* Category & Difficulty Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-light-blue dark:text-purple-400 px-2.5 py-0.5 rounded-full bg-light-blueSoft dark:bg-purple-500/10 border border-light-blueBorder/40 dark:border-purple-500/20">
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
        <h3 className="text-xl font-extrabold text-light-textStrong dark:text-white group-hover:text-light-blue dark:group-hover:text-purple-400 transition-colors font-sans tracking-tight">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-light-textSecondary dark:text-dark-300 line-clamp-2 leading-relaxed">
          {program.description}
        </p>

        {/* Complexity Metadata */}
        <div className="flex items-center gap-3 pt-1 font-mono text-[11px] text-light-textMuted dark:text-dark-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-light-blue dark:text-purple-400" />
            <span>Time: {program.timeComplexity.average}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Space: {program.spaceComplexity}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {program.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-lg bg-light-secondary dark:bg-dark-900 text-light-textSecondary dark:text-dark-300 text-[10px] font-medium border border-light-border dark:border-[#1b223c]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Link Button */}
      <div className="pt-3 border-t border-light-border dark:border-[#1b223c]">
        <Link
          to={`/my-class/${program.slug}`}
          className="w-full py-3 px-4 rounded-2xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple dark:hover:from-brand-600 dark:hover:to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md dark:shadow-brand-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch Interactive Studio</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
