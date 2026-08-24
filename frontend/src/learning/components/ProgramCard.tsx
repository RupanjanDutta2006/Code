import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Box, Sparkles } from 'lucide-react';
import { LearningProgram } from '../core/types';

interface ProgramCardProps {
  program: LearningProgram;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const difficultyColors = {
    easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  return (
    <div className="oky-glass-card rounded-3xl p-6 flex flex-col justify-between space-y-5 border border-slate-200/80 dark:border-[#232b4b] group hover:border-purple-500/40">
      <div className="space-y-3.5">
        {/* Category & Difficulty Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
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
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-400 transition-colors font-sans tracking-tight">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-dark-300 line-clamp-2 leading-relaxed">
          {program.description}
        </p>

        {/* Complexity Metadata */}
        <div className="flex items-center gap-3 pt-1 font-mono text-[11px] text-slate-400 dark:text-dark-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Time: {program.timeComplexity.average}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>Space: {program.spaceComplexity}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {program.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-dark-900 text-slate-600 dark:text-dark-300 text-[10px] font-medium border border-transparent dark:border-[#1b223c]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Link Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#1b223c]">
        <Link
          to={`/my-class/${program.slug}`}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple hover:from-brand-600 hover:to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-500/20 group-hover:shadow-neon-purple"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch Interactive Studio</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
