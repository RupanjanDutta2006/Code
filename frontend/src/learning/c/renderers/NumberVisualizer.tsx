import React from 'react';
import { Sparkles, Hash, ArrowRight } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface NumberVisualizerProps {
  step: CLearningStep;
}

export const NumberVisualizer: React.FC<NumberVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const currentNum = state.currentNum ?? step.variables?.n ?? step.variables?.num;
  const digits: number[] = state.digits || [];
  const activeDigit = state.activeDigit ?? step.variables?.d ?? step.variables?.rem;
  const sumOrAccumulator = state.sum ?? step.variables?.sum ?? step.variables?.rev ?? step.variables?.c;
  const formula = state.formula;
  const isMatch = state.isMatch;
  const resultText = state.resultText;

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none">
      {/* Current Number & Extracted Digits */}
      <div className="w-full max-w-lg p-5 rounded-2xl bg-white/90 dark:bg-dark-800/90 border border-slate-200 dark:border-dark-700 shadow-xl backdrop-blur-md text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-brand-600 dark:text-brand-400">
            <Hash className="w-4 h-4" />
            <span>Number Processing</span>
          </div>
          {currentNum !== undefined && (
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-mono font-bold text-brand-600 dark:text-brand-300">
              Input: {currentNum}
            </span>
          )}
        </div>

        {/* Digits Chips */}
        {digits.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-slate-400">Extracted Digits:</div>
            <div className="flex items-center justify-center gap-2">
              {digits.map((d, idx) => {
                const isActive = d === activeDigit;

                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 font-mono font-black text-base transition-all duration-300 ${
                      isActive
                        ? 'border-brand-500 bg-brand-500/20 text-brand-500 dark:text-brand-300 scale-110 shadow-lg'
                        : 'border-slate-300 dark:border-dark-700 bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-dark-200'
                    }`}
                  >
                    <span>{d}</span>
                    <span className="text-[9px] text-slate-400 font-normal">#{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Formula calculation string */}
        {formula && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-750 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {formula}
          </div>
        )}

        {/* Final Decision Badge */}
        {isMatch !== undefined && (
          <div
            className={`p-3 rounded-xl border-2 font-mono font-bold text-sm flex items-center justify-center gap-2 ${
              isMatch
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-md'
                : 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-300 shadow-md'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{resultText || (isMatch ? 'Match Verified!' : 'Not a Match')}</span>
          </div>
        )}
      </div>

      {/* Accumulator / State Variables */}
      {sumOrAccumulator !== undefined && (
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center gap-2">
            <span className="text-slate-400">Current Computed Value:</span>
            <span className="font-bold text-brand-600 dark:text-brand-400 text-base">{sumOrAccumulator}</span>
          </div>
        </div>
      )}
    </div>
  );
};
