import React from 'react';
import { LearningStep, PointerInfo } from '../core/types';

interface ArrayVisualizerProps {
  step: LearningStep;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ step }) => {
  const arr: number[] = Array.isArray(step.state) ? step.state : [];
  const highlights = step.highlights || {};
  const compareIndices: number[] = highlights.compareIndices ? [...highlights.compareIndices] : [];
  const swapIndices: number[] = highlights.swapIndices ? [...highlights.swapIndices] : [];
  const sortedIndices: number[] = highlights.sortedIndices ? [...highlights.sortedIndices] : [];
  const discardedIndices: number[] = highlights.discardedIndices ? [...highlights.discardedIndices] : [];
  const activeIndices: number[] = highlights.indices ? [...highlights.indices] : [];
  const pointers: PointerInfo[] = step.pointers || [];

  if (arr.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 dark:text-dark-400 font-mono text-sm">
        No array elements to display.
      </div>
    );
  }

  // Calculate max value for relative bar heights
  const maxVal = Math.max(...arr, 1);

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-8 select-none">
      {/* Top Pointer Badges */}
      <div className="flex items-end justify-center gap-3 sm:gap-4 h-10">
        {arr.map((_, idx) => {
          const ptrs = pointers.filter((p) => p.index === idx);
          if (ptrs.length === 0) return <div key={idx} className="w-12 sm:w-16" />;

          return (
            <div key={idx} className="w-12 sm:w-16 flex flex-col items-center justify-end">
              <div className="flex flex-wrap items-center justify-center gap-1">
                {ptrs.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    style={{ backgroundColor: p.color || '#3b82f6' }}
                    className="px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold text-white shadow-md animate-bounce"
                  >
                    {p.label || p.name}
                  </span>
                ))}
              </div>
              <div className="w-0.5 h-3 bg-brand-500/80 mt-1" />
            </div>
          );
        })}
      </div>

      {/* Array Elements Container */}
      <div className="flex items-end justify-center gap-3 sm:gap-4 px-4 overflow-x-auto w-full max-w-full py-2">
        {arr.map((val, idx) => {
          const isComparing = compareIndices.includes(idx);
          const isSwapping = swapIndices.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const isDiscarded = discardedIndices.includes(idx);
          const isActive = activeIndices.includes(idx);

          // Determine card style
          let borderClass = 'border-slate-300 dark:border-dark-700 bg-white/90 dark:bg-dark-800/90 text-slate-800 dark:text-white';
          let shadowClass = 'shadow-md';

          if (isSwapping) {
            borderClass = 'border-pink-500 bg-pink-500/20 text-pink-300 scale-105';
            shadowClass = 'shadow-lg shadow-pink-500/30';
          } else if (isComparing) {
            borderClass = 'border-amber-400 bg-amber-400/20 text-amber-300 scale-105';
            shadowClass = 'shadow-lg shadow-amber-400/30 animate-pulse';
          } else if (isSorted) {
            borderClass = 'border-emerald-500/80 bg-emerald-500/15 text-emerald-400';
            shadowClass = 'shadow-md shadow-emerald-500/20';
          } else if (isActive) {
            borderClass = 'border-brand-500 bg-brand-500/20 text-brand-300 scale-105';
            shadowClass = 'shadow-lg shadow-brand-500/30';
          } else if (isDiscarded) {
            borderClass = 'border-slate-300 dark:border-dark-800/60 bg-slate-200/40 dark:bg-dark-900/40 text-slate-400 dark:text-dark-500 opacity-40';
            shadowClass = 'shadow-none';
          }

          const barHeightPercent = Math.max(20, Math.round((Math.abs(val) / maxVal) * 100));

          return (
            <div
              key={idx}
              className="flex flex-col items-center space-y-2 transition-all duration-300"
            >
              {/* Visual Bar representation */}
              <div className="w-12 sm:w-16 h-28 flex items-end justify-center">
                <div
                  style={{ height: `${barHeightPercent}%` }}
                  className={`w-full rounded-t-xl transition-all duration-300 ${
                    isSwapping
                      ? 'bg-gradient-to-t from-pink-600 to-pink-400'
                      : isComparing
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                      : isSorted
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                      : isActive
                      ? 'bg-gradient-to-t from-brand-600 to-brand-400'
                      : isDiscarded
                      ? 'bg-slate-300 dark:bg-dark-800'
                      : 'bg-gradient-to-t from-slate-400 dark:from-dark-700 to-slate-300 dark:to-dark-600'
                  }`}
                />
              </div>

              {/* Number Card */}
              <div
                className={`w-12 sm:w-16 h-12 sm:h-14 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-base sm:text-lg transition-all duration-300 ${borderClass} ${shadowClass}`}
              >
                {val}
              </div>

              {/* Index Label */}
              <div className="font-mono text-xs text-slate-400 dark:text-dark-400">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
