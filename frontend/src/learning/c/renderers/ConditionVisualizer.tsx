import React from 'react';
import { GitBranch, Check, X } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface ConditionVisualizerProps {
  step: CLearningStep;
}

export const ConditionVisualizer: React.FC<ConditionVisualizerProps> = ({ step }) => {
  const highlights = step.highlights || {};
  const condText = highlights.conditionText || step.state?.conditionText || 'Condition Evaluation';
  const isTrue = highlights.conditionResult ?? step.state?.conditionResult;
  const branchTaken = highlights.branchTaken || step.state?.branchTaken;
  const ifText = step.state?.ifBranchText || 'True Branch (IF)';
  const elseText = step.state?.elseBranchText || 'False Branch (ELSE)';

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none">
      {/* Condition Test Card */}
      <div className="w-full max-w-lg p-5 rounded-2xl bg-white/90 dark:bg-dark-800/90 border border-slate-200 dark:border-dark-700 shadow-xl backdrop-blur-md space-y-3 text-center">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400 flex items-center justify-center gap-1.5">
          <GitBranch className="w-4 h-4 text-brand-500" />
          <span>Conditional Check</span>
        </div>
        <div className="text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white px-4 py-2 bg-slate-100 dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-750">
          {condText}
        </div>
        {isTrue !== undefined && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono text-slate-400">Evaluates to:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase flex items-center gap-1 ${
                isTrue
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40'
              }`}
            >
              {isTrue ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              {isTrue ? 'TRUE' : 'FALSE'}
            </span>
          </div>
        )}
      </div>

      {/* Decision Tree Fork */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {/* IF Block */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center space-y-2 ${
            branchTaken === 'if'
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-lg scale-105'
              : 'border-slate-200 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-900/50 opacity-40 text-slate-500'
          }`}
        >
          <div className="text-xs font-mono font-bold uppercase">IF Branch</div>
          <div className="text-sm font-semibold">{ifText}</div>
          {branchTaken === 'if' && (
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
              EXECUTED
            </span>
          )}
        </div>

        {/* ELSE Block */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center space-y-2 ${
            branchTaken === 'else'
              ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 shadow-lg scale-105'
              : 'border-slate-200 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-900/50 opacity-40 text-slate-500'
          }`}
        >
          <div className="text-xs font-mono font-bold uppercase">ELSE Branch</div>
          <div className="text-sm font-semibold">{elseText}</div>
          {branchTaken === 'else' && (
            <span className="inline-block px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold">
              EXECUTED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
