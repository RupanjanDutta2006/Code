import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Play, 
  Sparkles, 
  Trophy, 
  GraduationCap, 
  FolderPlus, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Terminal, 
  FileCode,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { OutputTerminal, OutputTerminalHandle } from '../components/OutputTerminal';
import { api, ExecuteResult } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { id: 'python', name: 'Python', ext: '.py', icon: '🐍', color: 'from-amber-500/20 to-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'cpp', name: 'C++', ext: '.cpp', icon: '⚡', color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30' },
  { id: 'c', name: 'C', ext: '.c', icon: '⚙️', color: 'from-slate-500/20 to-zinc-500/20 text-zinc-300 border-zinc-500/30' },
  { id: 'java', name: 'Java', ext: '.java', icon: '☕', color: 'from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30' },
  { id: 'javascript', name: 'JavaScript', ext: '.js', icon: '🟨', color: 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts', icon: '🔷', color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'go', name: 'Go', ext: '.go', icon: '🐹', color: 'from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'rust', name: 'Rust', ext: '.rs', icon: '🦀', color: 'from-orange-500/20 to-amber-600/20 text-orange-400 border-orange-500/30' },
  { id: 'kotlin', name: 'Kotlin', ext: '.kt', icon: '💜', color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30' },
  { id: 'html', name: 'HTML/CSS', ext: '.html', icon: '🌐', color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30' },
  { id: 'sql', name: 'SQL (SQLite)', ext: '.sql', icon: '🗄️', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
];

const DEFAULT_DEMO_CODE: Record<string, string> = {
  python: `# Welcome to CodeVault Pro!
a = 10
b = 20
print(f"CodeVault Pro Python Engine: {a} + {b} = {a + b}")`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int x = 15, y = 25;
    cout << "CodeVault Pro C++ Engine: Sum = " << (x + y) << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("CodeVault Pro C Engine: Online Compiler Active!\\n");
    for (int i = 1; i <= 3; i++) {
        printf("Running iteration: %d\\n", i);
    }
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("CodeVault Pro Java Runner Active!");
        int num = 42;
        System.out.println("Answer = " + num);
    }
}`,
  javascript: `// JavaScript (Node.js)
console.log("CodeVault Pro JavaScript Engine Active!");
const items = [10, 20, 30, 40, 50];
const total = items.reduce((acc, curr) => acc + curr, 0);
console.log("Array total sum:", total);`,
  typescript: `// TypeScript
interface Student {
  name: string;
  score: number;
}

const student: Student = { name: "Rupanjan", score: 100 };
console.log(\`Student \${student.name} achieved: \${student.score}/100\`);`,
  go: `package main
import "fmt"

func main() {
    fmt.Println("CodeVault Pro Go Engine Active!")
    fmt.Printf("Status: %s\\n", "Ready to compile and run")
}`,
  rust: `fn main() {
    println!("CodeVault Pro Rust Compiler Active!");
    let numbers = [1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum of numbers: {}", sum);
}`,
  kotlin: `fun main() {
    println("CodeVault Pro Kotlin Engine Active!")
    val languages = listOf("Python", "C++", "Java", "Kotlin", "Rust")
    println("Supported: " + languages.joinToString(", "))
}`,
  sql: `CREATE TABLE languages (name TEXT, speed TEXT);
INSERT INTO languages VALUES ('C++', 'Ultra Fast'), ('Python', 'Super Productive'), ('Rust', 'Memory Safe');
SELECT * FROM languages;`,
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: white; text-align: center; padding: 30px; }
    .card { background: #1e293b; padding: 25px; border-radius: 16px; display: inline-block; border: 1px solid #334155; }
    h1 { color: #38bdf8; margin-top: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 CodeVault Pro Live Preview</h1>
    <p>Interactive HTML/CSS/JS rendering in real-time!</p>
  </div>
</body>
</html>`,
};

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('python');
  const [demoCode, setDemoCode] = useState(DEFAULT_DEMO_CODE['python']);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecuteResult | null>(null);
  const terminalRef = useRef<OutputTerminalHandle>(null);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setDemoCode(DEFAULT_DEMO_CODE[lang] || `# Code in ${lang}\nprint("Running ${lang} code!")`);
    setResult(null);
  };

  const handleQuickRun = () => {
    if (terminalRef.current) {
      terminalRef.current.startInteractive(demoCode, selectedLang);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden text-center max-w-5xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-brand-600/20 via-indigo-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Upgraded with Practice Judge, Live Streaming & Classrooms</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Your Code. Saved Online.<br />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
            Run Anywhere.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
          Store your programming files, organize by folder, run code in 11 languages, practice for contests, and share with your class — from any device.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/programs"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <FolderPlus className="w-5 h-5" />
            Explore Programs
          </Link>

          {!user && (
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-white font-semibold text-base border border-dark-700 transition-all flex items-center gap-2"
            >
              Get Started (Login)
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            to="/playground"
            className="px-6 py-3 rounded-xl bg-dark-800/90 hover:bg-dark-750 text-dark-200 hover:text-white font-semibold text-base border border-dark-700/80 transition-all flex items-center gap-2"
          >
            <Users className="w-5 h-5 text-accent-violet" />
            Live Playground
          </Link>
        </div>
      </section>

      {/* Interactive Quick Runner Demo */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white/80 dark:bg-dark-900/80 p-6 shadow-2xl backdrop-blur-xl space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                Try Running Code Right Here
              </h2>
              <p className="text-xs text-slate-500 dark:text-dark-400">
                Choose a language, click Run Code, and type inputs directly in the terminal just like a real IDE.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-dark-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-500 font-mono transition-colors"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.icon} {l.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleQuickRun}
                disabled={running}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {running ? 'Running...' : 'Run Code'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[380px]">
              <CodeEditor
                code={demoCode}
                language={selectedLang}
                onChange={setDemoCode}
                height="380px"
                onRun={handleQuickRun}
              />
            </div>
            <div className="h-[380px]">
              <OutputTerminal
                ref={terminalRef}
                result={result}
                isRunning={running}
                language={selectedLang}
                sourceCode={demoCode}
                onClear={() => setResult(null)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Practice & Check (Judge Mode) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                <span>New Feature</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Practice & Check
              </h2>
              <p className="text-dark-300 text-sm leading-relaxed">
                Attach sample inputs and expected answers to any program. Instantly see if your solution passes every test case — exactly like a mini contest judge.
              </p>
              <ul className="space-y-2 text-xs text-dark-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time per-testcase pass/fail comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hidden test cases for teacher assignments & contests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Reuses ultra-fast SHA-256 build cache</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/programs/1"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-white font-medium text-xs border border-dark-700 transition-colors"
                >
                  <span>Try Practice Mode with Binary Search</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </div>
            </div>

            {/* Visual Card */}
            <div className="p-5 rounded-xl bg-dark-950 border border-dark-700 shadow-inner space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <span className="text-dark-400">Binary Search — Practice Checks</span>
                <span className="text-emerald-400 font-bold">3 / 3 Passed ✓</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-dark-900 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-400">Check 1: Sample</span>
                  <span className="text-emerald-400">Passed (24 ms) ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-400">Check 2: Edge Case</span>
                  <span className="text-emerald-400">Passed (18 ms) ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-400">Check 3: Hidden Test</span>
                  <span className="text-emerald-400">Passed (21 ms) ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Classrooms for Teachers & Students */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Visual Leaderboard Mock */}
            <div className="order-2 lg:order-1 p-5 rounded-xl bg-dark-950 border border-dark-700 shadow-inner space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750 text-xs">
                <span className="font-semibold text-white">DSA Section A — Leaderboard</span>
                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono text-[11px]">
                  Code: DSA-7F2K
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-750 flex items-center justify-between">
                  <span className="text-white font-medium">1. Asha R.</span>
                  <span className="text-emerald-400 font-mono font-bold">3/3 Passed ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-750 flex items-center justify-between">
                  <span className="text-white font-medium">2. Rohit K.</span>
                  <span className="text-amber-400 font-mono font-bold">2/3 Passed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-750 flex items-center justify-between">
                  <span className="text-dark-400">3. Meera S.</span>
                  <span className="text-dark-500 font-mono">Not started</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Classroom Platform</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Classrooms Without Spreadsheets
              </h2>
              <p className="text-dark-300 text-sm leading-relaxed">
                Teachers can create classes with instant invite codes, assign coding problems with checks, and view student progress on a simple live leaderboard.
              </p>
              <div className="pt-2">
                <Link
                  to="/classrooms"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md shadow-brand-500/20 transition-colors"
                >
                  <span>Explore My Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Languages Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">
            11 Supported Languages & Sandboxes
          </h2>
          <p className="text-sm text-dark-300">
            Real compilers and interpreters running with resource limits and instant caching.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.id}
              className={`p-4 rounded-xl border bg-dark-900/60 flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-all ${lang.color}`}
            >
              <span className="text-2xl">{lang.icon}</span>
              <span className="font-semibold text-xs text-white">{lang.name}</span>
              <span className="font-mono text-[10px] text-dark-400">{lang.ext}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
