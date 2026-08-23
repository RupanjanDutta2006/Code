import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { LearningStep } from '../core/types';

interface StepExplanationPanelProps {
  step: LearningStep;
  stepIndex: number;
  totalSteps: number;
}

export const StepExplanationPanel: React.FC<StepExplanationPanelProps> = ({
  step,
  stepIndex,
  totalSteps,
}) => {
  return (
    <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 dark:bg-brand-500/10 p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Teacher Explanation • Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-500 dark:text-brand-300 text-[10px] font-mono font-bold">
          {step.event}
        </span>
      </div>

      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
        {step.action}
      </h4>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-200 leading-relaxed font-sans">
        {step.description}
      </p>
    </div>
  );
};
