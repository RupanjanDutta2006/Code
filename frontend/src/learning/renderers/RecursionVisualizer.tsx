import React from 'react';
import { Layers } from 'lucide-react';
import { LearningStep } from '../core/types';

interface RecursionVisualizerProps {
  step: LearningStep;
}

export const RecursionVisualizer: React.FC<RecursionVisualizerProps> = ({ step }) => {
  const stack: any[] = step.state?.stack || [];
  const phase = step.state?.phase || 'winding';

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 space-y-5 select-none">
      {/* Header phase badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${
            phase === 'winding'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : phase === 'base_case'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          {phase === 'winding' ? '⬇ Winding Phase (Call Frames Pushing)' : phase === 'base_case' ? '⚡ Base Case Reached' : '⬆ Unwinding Phase (Returning Values)'}
        </span>
      </div>

      {/* Call Stack Tower */}
      <div className="w-full max-w-sm min-h-[220px] p-4 rounded-2xl border-2 border-slate-400 dark:border-dark-600 bg-slate-100/50 dark:bg-dark-900/50 flex flex-col-reverse justify-start gap-2 shadow-2xl backdrop-blur-md">
        {stack.map((frame, idx) => {
          const isTop = idx === stack.length - 1;

          return (
            <div
              key={idx}
              className={`w-full p-3 rounded-xl border-2 font-mono text-xs transition-all duration-300 shadow-md ${
                isTop
                  ? 'border-brand-500 bg-brand-500/20 text-brand-300 scale-105'
                  : 'border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-800 dark:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-400" />
                  <span>{frame.funcName}</span>
                </span>
                <span className="text-[10px] text-slate-400">Frame #{frame.id}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-dark-300">
                <span>param n = {frame.paramN}</span>
                {frame.returnValue !== undefined ? (
                  <span className="text-emerald-400 font-bold">Returns {frame.returnValue}</span>
                ) : (
                  <span className="text-amber-400">Waiting for child</span>
                )}
              </div>
            </div>
          );
        })}

        {stack.length === 0 && (
          <div className="m-auto text-xs font-mono text-slate-400 dark:text-dark-500 text-center">
            Call Stack Empty
          </div>
        )}
      </div>
    </div>
  );
};
