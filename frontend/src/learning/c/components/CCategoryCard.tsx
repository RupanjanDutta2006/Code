import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  GitBranch,
  Hash,
  Grid,
  Layers,
  ArrowUpDown,
  Grid3X3,
  Type,
  Users2,
  Database,
  HardDrive,
  ArrowRight,
  FolderCode,
} from 'lucide-react';
import { CCategoryMeta } from '../core/types';

interface CCategoryCardProps {
  category: CCategoryMeta;
  lessonCount: number;
}

const ICONS: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-6 h-6 text-blue-500" />,
  GitBranch: <GitBranch className="w-6 h-6 text-emerald-500" />,
  Hash: <Hash className="w-6 h-6 text-amber-500" />,
  Grid: <Grid className="w-6 h-6 text-purple-500" />,
  Layers: <Layers className="w-6 h-6 text-cyan-500" />,
  ArrowUpDown: <ArrowUpDown className="w-6 h-6 text-rose-500" />,
  Grid3X3: <Grid3X3 className="w-6 h-6 text-indigo-500" />,
  Type: <Type className="w-6 h-6 text-teal-500" />,
  Users2: <Users2 className="w-6 h-6 text-orange-500" />,
  Database: <Database className="w-6 h-6 text-pink-500" />,
  HardDrive: <HardDrive className="w-6 h-6 text-slate-400" />,
};

export const CCategoryCard: React.FC<CCategoryCardProps> = ({ category, lessonCount }) => {
  return (
    <Link
      to={`/my-class/c/${category.id}`}
      className="liquid-glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4 border border-slate-200/80 dark:border-dark-700/80 hover:border-brand-500/50 group transition-all"
    >
      <div className="space-y-3">
        {/* Icon & Count Badge */}
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-dark-800/80 group-hover:scale-110 transition-transform">
            {ICONS[category.icon] || <FolderCode className="w-6 h-6 text-brand-500" />}
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-300 font-mono text-xs font-bold">
            {lessonCount} {lessonCount === 1 ? 'Program' : 'Programs'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
          {category.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-dark-300 leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
        <span>Explore Category</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
};
