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
    <div className="rounded-2xl border border-crimson-500/30 bg-crimson-500/5 dark:bg-[#0f0f13]/90 dark:border-white/10 p-4 sm:p-5 shadow-card-light dark:shadow-xl backdrop-blur-xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-crimson-500 dark:text-crimson-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-crimson-600 dark:text-crimson-400">
            Teacher Explanation • Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-crimson-500/10 text-crimson-600 dark:bg-crimson-500/20 dark:text-crimson-300 text-[10px] font-mono font-bold border border-crimson-500/30">
          {step.event}
        </span>
      </div>

      <h4 className="text-sm sm:text-base font-bold text-light-textStrong dark:text-white">
        {step.action}
      </h4>

      <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-200 leading-relaxed font-sans">
        {step.description}
      </p>
    </div>
  );
};
