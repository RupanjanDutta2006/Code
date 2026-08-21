import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { api, Program } from '../services/api';
import { CodeEditor } from '../components/CodeEditor';

const LANGUAGES = [
  { id: 'python', name: 'Python', defaultCode: 'def main():\n    print("Hello from Python!")\n\nif __name__ == "__main__":\n    main()' },
  { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++!" << endl;\n    return 0;\n}' },
  { id: 'c', name: 'C', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}' },
  { id: 'java', name: 'Java', defaultCode: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}' },
  { id: 'javascript', name: 'JavaScript', defaultCode: 'console.log("Hello from JavaScript!");' },
  { id: 'typescript', name: 'TypeScript', defaultCode: 'const greeting: string = "Hello from TypeScript!";\nconsole.log(greeting);' },
  { id: 'go', name: 'Go', defaultCode: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}' },
  { id: 'rust', name: 'Rust', defaultCode: 'fn main() {\n    println!("Hello from Rust!");\n}' },
  { id: 'kotlin', name: 'Kotlin', defaultCode: 'fun main() {\n    println("Hello from Kotlin!")\n}' },
  { id: 'html', name: 'HTML/CSS', defaultCode: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }\n  </style>\n</head>\n<body>\n  <h1>Hello CodeVault!</h1>\n</body>\n</html>' },
  { id: 'sql', name: 'SQL', defaultCode: 'CREATE TABLE demo (id INT, text TEXT);\nINSERT INTO demo VALUES (1, "Active");\nSELECT * FROM demo;' },
];

export const CreateProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('python');
  const [category, setCategory] = useState('Data Structures & Algorithms');
  const [isPublic, setIsPublic] = useState(true);
  const [sourceCode, setSourceCode] = useState(LANGUAGES[0].defaultCode);
  const [testCases, setTestCases] = useState<{ input_data: string; expected_output: string; is_sample: boolean }[]>([
    { input_data: '', expected_output: '', is_sample: true },
  ]);
  const [saving, setSaving] = useState(false);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const matched = LANGUAGES.find((l) => l.id === newLang);
    if (matched) {
      setSourceCode(matched.defaultCode);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input_data: '', expected_output: '', is_sample: true }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, idx) => idx !== index));
  };

  const handleTestCaseChange = (index: number, field: string, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sourceCode.trim()) return;

    setSaving(true);
    try {
      const validTestCases = testCases
        .filter((tc) => tc.expected_output.trim() !== '')
        .map((tc, i) => ({ ...tc, id: Date.now() + i, program_id: 0, order_index: i }));

      let createdProg: Program;
      try {
        const res = await api.post<Program>('/api/programs', {
          title,
          description,
          language,
          category,
          is_public: isPublic,
          source_code: sourceCode,
          test_cases: validTestCases,
        });
        createdProg = res.data;
      } catch (err) {
        const { saveLocalProgram } = await import('../services/defaultPrograms');
        createdProg = saveLocalProgram({
          title,
          description,
          language,
          category,
          is_public: isPublic,
          source_code: sourceCode,
          test_cases: validTestCases,
        });
      }

      navigate(`/programs/${createdProg.id}`);
    } catch (err: any) {
      console.error('Failed to create program:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-dark-700/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-brand-400" />
              Create New Program
            </h1>
            <p className="text-xs text-dark-300">
              Add a code snippet or full program to your library with optional practice check test cases.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                Program Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. QuickSort Algorithm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                Programming Language *
              </label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white outline-none focus:border-brand-500 font-mono"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                Category / Topic
              </label>
              <input
                type="text"
                placeholder="e.g. Data Structures & Algorithms, Web, Math"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-1.5">
                Visibility
              </label>
              <select
                value={isPublic ? 'true' : 'false'}
                onChange={(e) => setIsPublic(e.target.value === 'true')}
                className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white outline-none focus:border-brand-500"
              >
                <option value="true">Public (Visible in Code Library & Classrooms)</option>
                <option value="false">Private (Only visible to you)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-dark-300 block mb-1.5">
              Description & Notes
            </label>
            <textarea
              rows={2}
              placeholder="Explain the purpose, input format, or time complexity of this code..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500 resize-none"
            />
          </div>
        </div>

        {/* Source Code Editor */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider block font-mono">
            Source Code *
          </label>
          <div className="h-[380px]">
            <CodeEditor
              code={sourceCode}
              language={language}
              onChange={setSourceCode}
              height="380px"
            />
          </div>
        </div>

        {/* Practice Check Test Cases */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Practice Checks (Test Cases)</h3>
              <p className="text-xs text-dark-400">
                Attach sample inputs and expected outputs for automatic judge grading.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddTestCase}
              className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-white text-xs font-medium border border-dark-700 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Check</span>
            </button>
          </div>

          <div className="space-y-3">
            {testCases.map((tc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-dark-950 border border-dark-750 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Check #{idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-dark-400 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tc.is_sample}
                        onChange={(e) => handleTestCaseChange(idx, 'is_sample', e.target.checked)}
                        className="rounded bg-dark-900 border-dark-700"
                      />
                      <span>Sample (Visible)</span>
                    </label>
                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(idx)}
                        className="text-dark-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-dark-400 block mb-1">Input (STDIN):</label>
                    <textarea
                      rows={2}
                      value={tc.input_data}
                      onChange={(e) => handleTestCaseChange(idx, 'input_data', e.target.value)}
                      placeholder="e.g. 5&#10;10 20 30"
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2 text-xs text-white placeholder-dark-600 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-emerald-400 block mb-1">Expected Output:</label>
                    <textarea
                      rows={2}
                      value={tc.expected_output}
                      onChange={(e) => handleTestCaseChange(idx, 'expected_output', e.target.value)}
                      placeholder="e.g. Element found at index 2"
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2 text-xs text-white placeholder-dark-600 outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
