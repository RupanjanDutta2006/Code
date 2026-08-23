import React from 'react';
import { ArrowDown } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface CArrayVisualizerProps {
  step: CLearningStep;
}

export const CArrayVisualizer: React.FC<CArrayVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const arr: number[] = Array.isArray(state) ? state : state.array || [];
  const activeIndex = step.variables?.i ?? state.currentIndex;
  const highlights = step.highlights || {};
  const compareIndices: number[] = highlights.compareIndices ? [...highlights.compareIndices] : [];
  const swapIndices: number[] = highlights.swapIndices ? [...highlights.swapIndices] : [];
  const pointers = step.pointers || [];

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none overflow-x-auto">
      {/* Array Elements */}
      <div className="flex items-center gap-2 sm:gap-3 p-4 min-w-max">
        {arr.map((val, idx) => {
          const isActive = idx === Number(activeIndex);
          const isComparing = compareIndices.includes(idx);
          const isSwapping = swapIndices.includes(idx);
          const ptrs = pointers.filter((p) => p.index === idx);

          return (
            <div key={idx} className="flex flex-col items-center space-y-1.5">
              {/* Pointer labels */}
              <div className="h-6 flex items-end justify-center">
                {ptrs.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    style={{ backgroundColor: p.color || '#3b82f6' }}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md animate-bounce"
                  >
                    {p.label || p.name}
                  </span>
                ))}
              </div>

              {/* Value Box */}
              <div
                className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-base sm:text-lg border-2 shadow-lg transition-all duration-300 ${
                  isSwapping
                    ? 'border-pink-500 bg-pink-500/25 text-pink-300 scale-110'
                    : isComparing
                    ? 'border-amber-500 bg-amber-500/25 text-amber-300 scale-110'
                    : isActive
                    ? 'border-brand-500 bg-brand-500/20 text-brand-300 scale-105'
                    : 'border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-800 dark:text-white'
                }`}
              >
                {val}
              </div>

              {/* Index Number */}
              <span className="text-[11px] font-mono text-slate-400">[{idx}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
