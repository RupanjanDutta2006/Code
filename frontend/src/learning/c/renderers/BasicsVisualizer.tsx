import React from 'react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface BasicsVisualizerProps {
  step: CLearningStep;
}

export const BasicsVisualizer: React.FC<BasicsVisualizerProps> = ({ step }) => {
  const vars = step.variables || {};
  const entries = Object.entries(vars);
  const expr = step.state?.expression;
  const result = step.state?.result;

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none">
      {/* Visual Expression Card */}
      {expr && (
        <div className="w-full max-w-lg p-5 rounded-2xl bg-gradient-to-r from-brand-600/10 via-indigo-600/10 to-teal-600/10 border border-brand-500/30 shadow-xl backdrop-blur-md text-center space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-brand-500 dark:text-brand-300 flex items-center justify-center gap-1.5">
            <Calculator className="w-4 h-4" />
            <span>Active Expression Evaluation</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
            <span className="px-3 py-1 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-slate-200 dark:border-dark-700">
              {expr}
            </span>
            {result !== undefined && (
              <>
                <ArrowRight className="w-5 h-5 text-brand-500 animate-pulse" />
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-xl shadow-sm border border-emerald-500/30">
                  {result}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Memory Grid */}
      <div className="w-full max-w-lg space-y-2">
        <div className="text-xs font-mono font-semibold text-slate-400 dark:text-dark-400">
          RAM Memory State (Variables):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map(([name, val]) => (
            <div
              key={name}
              className="p-3 rounded-2xl bg-white/90 dark:bg-dark-800/90 border border-slate-200 dark:border-dark-700 shadow-md flex flex-col items-center justify-center space-y-1"
            >
              <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-dark-400">
                var {name}
              </span>
              <span className="font-mono font-black text-lg text-slate-900 dark:text-white">
                {val === null || val === undefined ? '?' : String(val)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
