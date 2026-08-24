import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { useAIChat } from '../context/AIChatContext';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  onRun?: () => void;
  fileName?: string;
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
  fileName,
}) => {
  const { isDark } = useTheme();
  const { askAboutSelection, setWorkspaceContext } = useAIChat();
  const monacoLang = MONACO_LANG_MAP[language.toLowerCase()] || 'plaintext';

  // Keep global workspace context updated
  React.useEffect(() => {
    setWorkspaceContext({
      code,
      language,
      fileName: fileName || `main.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language}`,
    });
  }, [code, language, fileName, setWorkspaceContext]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Add Ctrl+Enter or Cmd+Enter shortcut to Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) {
        onRun();
      }
    });

    // Helper to get selected text or whole code
    const getSelectedOrFullCode = () => {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        return editor.getModel()?.getValueInRange(selection) || code;
      }
      return code;
    };

    // 1. Monaco Action: Explain Selection with Nemotron
    editor.addAction({
      id: 'nemotron-explain-code',
      label: '🤖 Nemotron: Explain Selected Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyE],
      contextMenuGroupId: '1_nemotron',
      contextMenuOrder: 1,
      run: () => {
        const text = getSelectedOrFullCode();
        askAboutSelection(text, 'explain');
      },
    });

    // 2. Monaco Action: Fix / Debug with Nemotron
    editor.addAction({
      id: 'nemotron-fix-code',
      label: '🛠️ Nemotron: Find & Fix Bugs in Selection',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      contextMenuGroupId: '1_nemotron',
      contextMenuOrder: 2,
      run: () => {
        const text = getSelectedOrFullCode();
        askAboutSelection(text, 'fix');
      },
    });

    // 3. Monaco Action: Optimize with Nemotron
    editor.addAction({
      id: 'nemotron-optimize-code',
      label: '⚡ Nemotron: Optimize Selected Code',
      contextMenuGroupId: '1_nemotron',
      contextMenuOrder: 3,
      run: () => {
        const text = getSelectedOrFullCode();
        askAboutSelection(text, 'optimize');
      },
    });

    // 4. Monaco Action: Add Comments with Nemotron
    editor.addAction({
      id: 'nemotron-comment-code',
      label: '📝 Nemotron: Add Explanatory Comments',
      contextMenuGroupId: '1_nemotron',
      contextMenuOrder: 4,
      run: () => {
        const text = getSelectedOrFullCode();
        askAboutSelection(text, 'comments');
      },
    });

    // 5. Monaco Action: Generate Tests with Nemotron
    editor.addAction({
      id: 'nemotron-test-code',
      label: '🧪 Nemotron: Generate Edge Test Cases',
      contextMenuGroupId: '1_nemotron',
      contextMenuOrder: 5,
      run: () => {
        const text = getSelectedOrFullCode();
        askAboutSelection(text, 'tests');
      },
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
