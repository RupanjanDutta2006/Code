import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

interface DiffViewerProps {
  originalCode: string;
  modifiedCode: string;
  language: string;
  height?: string;
  originalTitle?: string;
  modifiedTitle?: string;
}

const MONACO_LANG_MAP: Record<string, string> = {
  python: 'python',
  c: 'c',
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript',
  typescript: 'typescript',
  go: 'go',
  rust: 'rust',
  kotlin: 'kotlin',
  html: 'html',
  sql: 'sql',
};

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalCode,
  modifiedCode,
  language,
  height = '450px',
  originalTitle = 'Original Version',
  modifiedTitle = 'Modified Version',
}) => {
  const monacoLang = MONACO_LANG_MAP[language.toLowerCase()] || 'plaintext';

  return (
    <div className="w-full rounded-xl overflow-hidden border border-dark-700 bg-[#1e1e1e] shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-900 border-b border-dark-700 text-xs font-mono text-dark-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span>{originalTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span>{modifiedTitle}</span>
        </div>
      </div>
      <DiffEditor
        height={height}
        language={monacoLang}
        original={originalCode}
        modified={modifiedCode}
        theme="vs-dark"
        options={{
          readOnly: true,
          renderSideBySide: true,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
};
