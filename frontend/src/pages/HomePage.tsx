import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Square,
  RotateCcw,
  Sparkles, 
  Trophy, 
  GraduationCap, 
  FolderPlus, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Terminal, 
  Cpu,
  Layers,
  Bot
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { OutputTerminal, OutputTerminalHandle } from '../components/OutputTerminal';
import { ExecuteResult } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAIChat } from '../context/AIChatContext';

const LANGUAGES = [
  { id: 'python', name: 'Python', ext: '.py', icon: '🐍', color: 'border-yellow-500/30 dark:border-yellow-500/25 bg-yellow-500/5' },
  { id: 'cpp', name: 'C++', ext: '.cpp', icon: '⚡', color: 'border-blue-500/30 dark:border-blue-500/25 bg-blue-500/5' },
  { id: 'c', name: 'C', ext: '.c', icon: '⚙️', color: 'border-slate-400/30 dark:border-slate-500/25 bg-slate-500/5' },
  { id: 'java', name: 'Java', ext: '.java', icon: '☕', color: 'border-orange-500/30 dark:border-orange-500/25 bg-orange-500/5' },
  { id: 'javascript', name: 'JavaScript', ext: '.js', icon: '🟨', color: 'border-amber-500/30 dark:border-amber-500/25 bg-amber-500/5' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts', icon: '🔷', color: 'border-indigo-500/30 dark:border-indigo-500/25 bg-indigo-500/5' },
  { id: 'go', name: 'Go', ext: '.go', icon: '🐹', color: 'border-cyan-500/30 dark:border-cyan-500/25 bg-cyan-500/5' },
  { id: 'rust', name: 'Rust', ext: '.rs', icon: '🦀', color: 'border-orange-500/30 dark:border-orange-500/25 bg-orange-500/5' },
  { id: 'kotlin', name: 'Kotlin', ext: '.kt', icon: '💜', color: 'border-purple-500/30 dark:border-purple-500/25 bg-purple-500/5' },
  { id: 'html', name: 'HTML/CSS', ext: '.html', icon: '🌐', color: 'border-rose-500/30 dark:border-rose-500/25 bg-rose-500/5' },
  { id: 'sql', name: 'SQL (SQLite)', ext: '.sql', icon: '🗄️', color: 'border-emerald-500/30 dark:border-emerald-500/25 bg-emerald-500/5' },
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
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; text-align: center; padding: 40px; background: #0f172a; color: white; }
    h1 { color: #38bdf8; }
    .btn { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <h1>CodeVault Pro Live HTML</h1>
  <p>Interactive client-side web sandbox</p>
  <button class="btn" onclick="alert('Hello from CodeVault Pro!')">Click Me</button>
</body>
</html>`,
  sql: `CREATE TABLE languages (name TEXT, speed TEXT);
INSERT INTO languages VALUES ('C++', 'Ultra Fast'), ('Python', 'Super Productive'), ('Rust', 'Memory Safe');
SELECT * FROM languages;`,
};

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { toggleChat } = useAIChat();
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
    if (running) return;
    if (terminalRef.current) {
      setRunning(true);
      terminalRef.current.startInteractive(demoCode, selectedLang);
    }
  };

  const handleStop = () => {
    if (terminalRef.current) {
      terminalRef.current.stop();
      setRunning(false);
    }
  };

  const handleReset = () => {
    setDemoCode(DEFAULT_DEMO_CODE[selectedLang] || `# Code in ${selectedLang}\nprint("Running ${selectedLang} code!")`);
    if (terminalRef.current) {
      terminalRef.current.clear();
    }
    setResult(null);
    setRunning(false);
  };

  const [demoActiveTab, setDemoActiveTab] = useState<'code' | 'terminal'>('code');

  const handleMobileQuickRun = () => {
    if (window.innerWidth < 1024) {
      setDemoActiveTab('terminal');
    }
    handleQuickRun();
  };

  // Keyboard shortcuts: Ctrl+Enter to Run, Ctrl+Shift+K to Stop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleQuickRun();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoCode, selectedLang]);

  return (
    <div className="space-y-12 sm:space-y-20 pb-12 sm:pb-16 mesh-gradient-bg transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-6 px-4 max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Floating Top Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-light-blueSoft dark:bg-gradient-to-r dark:from-neon-blue/15 dark:to-neon-purple/15 border border-light-blueBorder/50 dark:border-purple-500/30 text-light-blue dark:text-purple-300 text-xs font-bold tracking-wide shadow-xs animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-light-blue dark:text-neon-purple" />
          <span>CodeVault Pro 2.0 • Real-Time AI & DSA Platform</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-light-textStrong dark:text-white tracking-tight font-sans leading-[1.15]">
            Master Coding Faster with{' '}
            <span className="text-gradient-neon">
              Interactive Execution
            </span>{' '}
            & AI Mentorship.
          </h1>
          <p className="text-xs sm:text-base text-light-textSecondary dark:text-dark-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Execute 11+ programming languages instantly in cloud sandboxes, visualize complex algorithms step-by-step, and collaborate with dual online & offline AI models.
          </p>
        </div>

        {/* Hero Primary Actions (Full width on mobile, row on tablet/desktop) */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2">
          <Link
            to="/programs"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple dark:hover:from-brand-600 dark:hover:to-purple-600 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 touch-target"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Explore Programs</span>
          </Link>

          <Link
            to="/my-class"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-light-secondary dark:bg-dark-900/80 dark:hover:bg-dark-850 text-light-textStrong dark:text-white font-bold text-xs sm:text-sm border border-light-border dark:border-[#1b223c] shadow-xs transition-all flex items-center justify-center gap-2 touch-target"
          >
            <GraduationCap className="w-4 h-4 text-amber-500 dark:text-accent-amber" />
            <span>My Class (DSA Visualizer)</span>
          </Link>

          <Link
            to="/playground"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-light-secondary dark:bg-dark-900/80 dark:hover:bg-dark-850 text-light-textStrong dark:text-white font-bold text-xs sm:text-sm border border-light-border dark:border-[#1b223c] shadow-xs transition-all flex items-center justify-center gap-2 touch-target"
          >
            <Users className="w-4 h-4 text-purple-600 dark:text-accent-violet" />
            <span>Live Playground</span>
          </Link>

          <button
            onClick={toggleChat}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-light-secondary dark:bg-dark-900/90 dark:hover:bg-dark-850 text-light-textStrong dark:text-white font-bold text-xs sm:text-sm border border-light-borderStrong dark:border-purple-500/30 shadow-xs hover:border-light-blueBorder transition-all flex items-center justify-center gap-2 touch-target"
          >
            <Sparkles className="w-4 h-4 text-light-blue dark:text-neon-purple" />
            <span>Ask CodeVault AI</span>
          </button>
        </div>

        {/* Quick Platform Metrics */}
        <div className="mt-8 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto text-left">
          {[
            { label: 'Cloud Sandboxes', val: '11 Compilers', icon: Terminal, color: 'text-light-blue dark:text-cyan-400' },
            { label: 'AI Intelligence', val: 'Nemotron + Offline', icon: Bot, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'DSA Traces', val: '15 Visualizers', icon: Layers, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Local Setup Needed', val: 'Zero Config', icon: Cpu, color: 'text-amber-600 dark:text-amber-400' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0e1222]/80 border border-light-border dark:border-[#1b223c] shadow-xs"
            >
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} mb-1.5`} />
              <div className="text-sm sm:text-lg font-bold text-light-textStrong dark:text-white font-sans">{stat.val}</div>
              <div className="text-[10px] sm:text-[11px] text-light-textSecondary dark:text-dark-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Quick Runner Demo */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-dark-900/80 p-4 sm:p-8 shadow-xs sm:shadow-md space-y-4 sm:space-y-5 transition-colors border border-light-border dark:border-[#232b4b]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-light-textStrong dark:text-white flex items-center gap-2 font-sans">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-light-blueSoft text-light-blue dark:bg-neon-blue/20 dark:text-neon-blue flex items-center justify-center border border-light-blueBorder/50 dark:border-neon-blue/30 shrink-0">
                  <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                Live Cloud Execution Engine
              </h2>
              <p className="text-[11px] sm:text-xs text-light-textSecondary dark:text-dark-400 mt-0.5">
                Select a language, write code, and stream inputs directly to the interactive cloud sandbox.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-light-secondary dark:bg-dark-900 border border-light-borderStrong dark:border-[#232b4b] text-light-textStrong dark:text-white text-xs rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 outline-none focus:border-light-blue dark:focus:border-purple-500 font-mono transition-colors touch-target"
                title="Select language"
                aria-label="Select language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.icon} {l.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 sm:py-2 rounded-xl bg-light-secondary dark:bg-dark-900 hover:bg-white dark:hover:bg-dark-850 text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white text-xs font-bold border border-light-border dark:border-[#1b223c] transition-all flex items-center gap-1 touch-target"
                title="Reset editor template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              {running ? (
                <button
                  onClick={handleStop}
                  className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 touch-target"
                  title="Stop execution"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={handleMobileQuickRun}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 touch-target"
                  title="Run code"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Tab Control (Visible on phone) */}
          <div className="lg:hidden grid grid-cols-2 gap-1 p-1 bg-light-secondary dark:bg-dark-950 rounded-xl border border-light-border dark:border-dark-800">
            <button
              onClick={() => setDemoActiveTab('code')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                demoActiveTab === 'code'
                  ? 'bg-light-blue text-white shadow-xs dark:bg-brand-600'
                  : 'text-light-textSecondary dark:text-dark-400'
              }`}
            >
              1. Code Editor
            </button>
            <button
              onClick={() => setDemoActiveTab('terminal')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                demoActiveTab === 'terminal'
                  ? 'bg-light-blue text-white shadow-xs dark:bg-brand-600'
                  : 'text-light-textSecondary dark:text-dark-400'
              }`}
            >
              2. Terminal Output
              {result && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-2" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`h-[340px] sm:h-[390px] rounded-2xl overflow-hidden border border-light-border dark:border-[#232b4b] shadow-xs ${demoActiveTab !== 'code' ? 'hidden lg:block' : ''}`}>
              <CodeEditor
                code={demoCode}
                language={selectedLang}
                onChange={setDemoCode}
                height="100%"
                onRun={handleMobileQuickRun}
              />
            </div>
            <div className={`h-[340px] sm:h-[390px] rounded-2xl overflow-hidden border border-light-border dark:border-[#232b4b] shadow-xs ${demoActiveTab !== 'terminal' ? 'hidden lg:block' : ''}`}>
              <OutputTerminal
                ref={terminalRef}
                result={result}
                isRunning={running}
                language={selectedLang}
                sourceCode={demoCode}
                onClear={() => setResult(null)}
                onStop={() => setRunning(false)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (SaaS Cards) */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-light-textStrong dark:text-white font-sans">
            Engineered for Students, Creators & Engineers
          </h2>
          <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-400">
            A comprehensive developer toolkit built with next-gen AI, interactive visualizers, and real-time execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Hybrid AI */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1222]/80 border border-light-border dark:border-[#232b4b] shadow-card-light dark:shadow-md hover:border-light-blueBorder dark:hover:border-purple-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-light-blueSoft dark:bg-gradient-to-tr dark:from-neon-blue dark:to-neon-purple text-light-blue dark:text-white flex items-center justify-center shadow-sm dark:shadow-brand-500/20 border border-light-blueBorder/40 dark:border-transparent">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-light-textStrong dark:text-white font-sans">CodeVault Hybrid AI</h3>
            <p className="text-xs text-light-textSecondary dark:text-dark-300 leading-relaxed">
              Powered by cloud NVIDIA Nemotron for deep reasoning, with full browser-side on-device fallback when you lose internet connection.
            </p>
            <div className="pt-2">
              <button
                onClick={toggleChat}
                className="text-xs text-light-blue dark:text-purple-400 hover:underline font-bold inline-flex items-center gap-1.5"
              >
                Open Assistant <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Interactive DSA */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1222]/80 border border-light-border dark:border-[#232b4b] shadow-card-light dark:shadow-md hover:border-amber-300 dark:hover:border-amber-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-gradient-to-tr dark:from-amber-500 dark:to-orange-500 text-amber-600 dark:text-white flex items-center justify-center shadow-sm dark:shadow-amber-500/20 border border-amber-200 dark:border-transparent">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-light-textStrong dark:text-white font-sans">My Class (Interactive DSA)</h3>
            <p className="text-xs text-light-textSecondary dark:text-dark-300 leading-relaxed">
              Step-by-step visualizers across sorting, searching, recursion, trees, and linked lists with real-time state inspect and adjustable speed.
            </p>
            <div className="pt-2">
              <Link
                to="/my-class"
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold inline-flex items-center gap-1.5"
              >
                Explore Lessons <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Practice & Check Judge */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1222]/80 border border-light-border dark:border-[#232b4b] shadow-card-light dark:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-gradient-to-tr dark:from-emerald-500 dark:to-teal-500 text-emerald-600 dark:text-white flex items-center justify-center shadow-sm dark:shadow-emerald-500/20 border border-emerald-200 dark:border-transparent">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-light-textStrong dark:text-white font-sans">Practice & Check Judge</h3>
            <p className="text-xs text-light-textSecondary dark:text-dark-300 leading-relaxed">
              Test your solutions against sample and hidden test cases with millisecond execution timing, memory limits, and automated verdicts.
            </p>
            <div className="pt-2">
              <Link
                to="/programs"
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold inline-flex items-center gap-1.5"
              >
                Practice Coding <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: Creator & Curated Resources Spotlight */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-white via-purple-50/50 to-white dark:from-dark-900 dark:via-purple-950/20 dark:to-dark-900 p-8 shadow-card-light dark:shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <img
                src="/team/rupanjan.jpg"
                alt="Coder Babuu"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg shadow-purple-500/20"
              />
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Creator & Free Resources</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-light-textStrong dark:text-white">
                  Curated Codes, DSA Notes & Assignments by Coder Babuu
                </h3>
                <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-300 max-w-xl">
                  Access free Python, C, C++, and DSA code repositories, downloadable lecture notes, and assignments directly on CodeVault.
                </p>
              </div>
            </div>

            <Link
              to="/creator"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 flex-shrink-0 hover:scale-[1.02]"
            >
              <span>Explore All Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Languages Sandbox Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-light-textStrong dark:text-white font-sans">
            11 Universal Compilers Supported
          </h2>
          <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-400">
            Write, compile, and execute standard algorithms across all major industry languages.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLangChange(lang.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between group shadow-card-light ${
                selectedLang === lang.id
                  ? 'bg-light-blueSoft border-light-blueBorder dark:bg-purple-950/40 dark:border-purple-500/60 shadow-sm'
                  : 'bg-white dark:bg-dark-900/60 border-light-border dark:border-[#1b223c] hover:border-light-blueBorder dark:hover:border-[#232b4b] hover:bg-light-secondary dark:hover:bg-dark-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl group-hover:scale-110 transition-transform">{lang.icon}</span>
                <span className="text-[10px] font-mono font-bold text-light-textMuted dark:text-dark-500">{lang.ext}</span>
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold text-light-textStrong dark:text-white font-sans">{lang.name}</div>
                <div className="text-[10px] text-light-textMuted dark:text-dark-400 font-medium">Cloud Sandbox</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
