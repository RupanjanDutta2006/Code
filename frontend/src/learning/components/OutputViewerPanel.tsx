import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface OutputViewerPanelProps {
  output?: string;
  stepNumber: number;
  totalSteps: number;
}

export const OutputViewerPanel: React.FC<OutputViewerPanelProps> = ({
  output,
  stepNumber,
  totalSteps,
}) => {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-light-border dark:border-white/10 bg-[#08080c] text-slate-100 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0e0e13] border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-crimson-400" />
          <span className="text-xs font-mono font-semibold text-dark-200">
            Console Output
          </span>
        </div>
        <span className="text-[10px] font-mono text-dark-400">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
        {output ? output : <span className="text-dark-500">[No output generated yet]</span>}
      </div>
    </div>
  );
};
