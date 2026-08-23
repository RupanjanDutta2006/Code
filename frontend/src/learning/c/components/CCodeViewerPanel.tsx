import React, { useEffect, useRef } from 'react';
import { Play, Code } from 'lucide-react';

interface CCodeViewerPanelProps {
  sourceCode: string;
  activeLineNumber?: number;
  originalPath?: string;
}

export const CCodeViewerPanel: React.FC<CCodeViewerPanelProps> = ({
  sourceCode,
  activeLineNumber,
  originalPath,
}) => {
  const codeLines = (sourceCode || '').split('\n');
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active line smoothly
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-300 dark:border-dark-700/80 bg-slate-950 text-slate-100 overflow-hidden shadow-xl">
      {/* Code Header Bar (C Only) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-300 ml-2">
            C Source Code
          </span>
        </div>

        {/* C Badge Only - No other languages */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[11px] font-mono font-bold">
            Language: C
          </span>
        </div>
      </div>

      {/* Code Lines with Smooth Highlighting */}
      <div
        ref={containerRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed select-text"
      >
        {codeLines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLineNumber;

          return (
            <div
              key={lineNum}
              ref={isActive ? activeLineRef : null}
              className={`flex items-center gap-3 px-2 py-0.5 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/25 border-l-4 border-brand-400 text-white font-medium shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900/50'
              }`}
            >
              {/* Active Arrow Indicator */}
              <div className="w-4 flex items-center justify-center">
                {isActive ? (
                  <Play className="w-3 h-3 text-brand-400 fill-brand-400 animate-pulse" />
                ) : (
                  <span className="w-3" />
                )}
              </div>

              {/* Line Number */}
              <span
                className={`w-6 text-right select-none font-mono text-[11px] ${
                  isActive ? 'text-brand-300 font-bold' : 'text-slate-600'
                }`}
              >
                {lineNum}
              </span>

              {/* Code Text */}
              <span className="flex-1 font-mono whitespace-pre">{lineText || ' '}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
