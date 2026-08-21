import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  onRun?: () => void;
}

const MONACO_LANG_MAP: Record<string, string> = {
  python: 'python',
  c: 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  java: 'java',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  go: 'go',
  rust: 'rust',
  kotlin: 'kotlin',
  html: 'html',
  sql: 'sql',
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
  readOnly = false,
  height = '500px',
  onRun,
}) => {
  const { isDark } = useTheme();
  const monacoLang = MONACO_LANG_MAP[language.toLowerCase()] || 'plaintext';

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Add Ctrl+Enter or Cmd+Enter shortcut to Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) {
        onRun();
      }
    });
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-300 dark:border-dark-700 bg-white dark:bg-[#1e1e1e] shadow-xl relative group transition-colors">
      <Editor
        height={height}
        language={monacoLang}
        value={code}
        theme={isDark ? 'vs-dark' : 'vs'}
        onChange={(val) => onChange && onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          renderWhitespace: 'none',
        }}
      />
    </div>
  );
};
