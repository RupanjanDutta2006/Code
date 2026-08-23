import React from 'react';
import { ArrowDown } from 'lucide-react';
import { LearningStep, PointerInfo } from '../core/types';

interface StackVisualizerProps {
  step: LearningStep;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ step }) => {
  const stack: number[] = step.state?.stack || [];
  const poppedValue = step.state?.poppedValue;
  const pointers: PointerInfo[] = step.pointers || [];

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none">
      {/* Top indicator */}
      <div className="h-8 flex items-center justify-center">
        {pointers.map((p, idx) => (
          <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold shadow-lg animate-bounce">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{p.label || p.name}</span>
          </div>
        ))}
        {stack.length === 0 && (
          <span className="text-xs font-mono text-slate-400 dark:text-dark-400">
            [Stack is Empty • Top = NULL]
          </span>
        )}
      </div>

      {/* Vertical Glass Stack Container */}
      <div className="w-48 sm:w-56 min-h-[220px] p-3 rounded-2xl border-2 border-b-4 border-slate-400 dark:border-dark-600 bg-slate-100/50 dark:bg-dark-900/50 flex flex-col-reverse justify-start gap-2 shadow-2xl backdrop-blur-md">
        {stack.map((val, idx) => {
          const isTop = idx === stack.length - 1;

          return (
            <div
              key={idx}
              className={`w-full py-3 px-4 rounded-xl border-2 font-mono font-bold text-center text-sm sm:text-base transition-all duration-300 shadow-md ${
                isTop
                  ? 'border-brand-500 bg-brand-500/20 text-brand-300 scale-105'
                  : 'border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-800 dark:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">[{idx}]</span>
                <span>{val}</span>
                {isTop && (
                  <span className="text-[10px] uppercase font-bold text-brand-400">TOP</span>
                )}
              </div>
            </div>
          );
        })}

        {stack.length === 0 && (
          <div className="m-auto text-xs font-mono text-slate-400 dark:text-dark-500 text-center">
            Empty Stack
          </div>
        )}
      </div>

      {/* Pop animation notification if any */}
      {poppedValue !== undefined && (
        <div className="text-xs font-mono text-pink-500 dark:text-pink-400 flex items-center gap-1.5 animate-pulse">
          <span>Popped value:</span>
          <span className="font-bold">{poppedValue}</span>
        </div>
      )}
    </div>
  );
};
