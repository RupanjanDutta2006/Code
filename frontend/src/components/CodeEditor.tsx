import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

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
  java: 'java',
  javascript: 'javascript',
  typescript: 'typescript',
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
    <div className="w-full h-full rounded-xl overflow-hidden border border-dark-700 bg-[#1e1e1e] shadow-xl relative group">
      <Editor
        height={height}
        language={monacoLang}
        value={code}
        theme="vs-dark"
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
