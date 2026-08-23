import React from 'react';
import { Type } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface CStringVisualizerProps {
  step: CLearningStep;
}

export const CStringVisualizer: React.FC<CStringVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const chars: string[] = state.chars || (state.str ? state.str.split('') : []);
  const activeIndex = state.currentIndex ?? step.variables?.i;
  const vowelCount = state.vowelCount ?? step.variables?.vowels ?? step.variables?.v;
  const consonantCount = state.consonantCount ?? step.variables?.consonants ?? step.variables?.c;

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none overflow-x-auto">
      {/* String Characters Row */}
      <div className="flex items-center gap-2 p-2 min-w-max">
        {chars.map((char, idx) => {
          const isActive = idx === Number(activeIndex);
          const isNull = char === '\\0' || idx === chars.length - 1;

          return (
            <div key={idx} className="flex flex-col items-center space-y-1.5">
              <div
                className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-lg border-2 shadow-md transition-all duration-200 ${
                  isActive
                    ? 'border-brand-500 bg-brand-500/20 text-brand-300 scale-110'
                    : isNull
                    ? 'border-slate-400/40 bg-slate-200/40 dark:bg-dark-900/40 text-slate-400'
                    : 'border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-800 dark:text-white'
                }`}
              >
                <span>{char === ' ' ? '␣' : char}</span>
                <span className="text-[9px] text-slate-400 font-normal">char</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* String metrics */}
      {(vowelCount !== undefined || consonantCount !== undefined) && (
        <div className="flex items-center gap-3 font-mono text-xs">
          {vowelCount !== undefined && (
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold">
              Vowels: {vowelCount}
            </div>
          )}
          {consonantCount !== undefined && (
            <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-500 font-bold">
              Consonants: {consonantCount}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
