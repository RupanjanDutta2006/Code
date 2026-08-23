import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCode, Sparkles } from 'lucide-react';
import { CProgramLesson } from '../core/types';

interface CLessonCardProps {
  lesson: CProgramLesson;
}

export const CLessonCard: React.FC<CLessonCardProps> = ({ lesson }) => {
  const difficultyColors = {
    beginner: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
    easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    medium: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  };

  return (
    <div className="liquid-glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border border-slate-200/80 dark:border-dark-700/80 group">
      <div className="space-y-2.5">
        {/* Category & Difficulty */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {lesson.categoryDisplay}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border ${
              difficultyColors[lesson.difficulty]
            }`}
          >
            {lesson.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
          {lesson.title}
        </h3>

        {/* Original filename badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-dark-400">
          <FileCode className="w-3.5 h-3.5" />
          <span>{lesson.originalFilename}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-dark-300 line-clamp-2 leading-relaxed">
          {lesson.conceptSummary || lesson.description}
        </p>
      </div>

      {/* Start Button */}
      <div className="pt-2 border-t border-slate-100 dark:border-dark-800">
        <Link
          to={`/my-class/c/${lesson.category}/${lesson.slug}`}
          className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 dark:bg-dark-800 hover:bg-brand-600 dark:hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-brand-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Learn C Visually</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
