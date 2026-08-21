import React from 'react';
import { 
  Code2, 
  ShieldCheck, 
  HelpCircle, 
  Terminal, 
  GraduationCap, 
  Zap, 
  Wifi, 
  Users,
  BookOpen
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation & Architecture Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How CodeVault Pro Works
        </h1>
        <p className="text-sm text-dark-300 max-w-2xl mx-auto leading-relaxed">
          Designed for simplicity on the surface for school & college beginners, backed by a robust full-stack compiler & classroom engine.
        </p>
      </div>

      {/* Beginner Plain-Language Dictionary */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-400" />
          Plain-Language UX Dictionary
        </h2>
        <p className="text-xs text-dark-300">
          We intentionally translate technical engineering terminology into intuitive plain language:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-dark-700 text-dark-400">
                <th className="py-2.5 px-3">Technical Term</th>
                <th className="py-2.5 px-3">Shown to You As</th>
                <th className="py-2.5 px-3">What it Means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-dark-200">
              <tr>
                <td className="py-2.5 px-3 text-dark-400">Execute Source</td>
                <td className="py-2.5 px-3 text-brand-400 font-bold">Run Code</td>
                <td className="py-2.5 px-3 text-dark-300">Compiles & runs your code in the sandbox</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-dark-400">STDOUT / STDERR</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">Output</td>
                <td className="py-2.5 px-3 text-dark-300">Text printed by your program or errors</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-dark-400">STDIN</td>
                <td className="py-2.5 px-3 text-indigo-400 font-bold">Input</td>
                <td className="py-2.5 px-3 text-dark-300">Custom data or test values passed to your code</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-dark-400">Competitive Judge</td>
                <td className="py-2.5 px-3 text-amber-400 font-bold">Practice & Check</td>
                <td className="py-2.5 px-3 text-dark-300">Automatic testing against multiple test checks</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-dark-400">Diff Representation</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">What Changed</td>
                <td className="py-2.5 px-3 text-dark-300">Side-by-side comparison of code versions</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-dark-400">Revision History</td>
                <td className="py-2.5 px-3 text-purple-400 font-bold">Past Versions</td>
                <td className="py-2.5 px-3 text-dark-300">Saved snapshots of your past code iterations</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Execution Sandboxing</h3>
          <p className="text-xs text-dark-300 leading-relaxed">
            Every execution runs in an isolated ephemeral sandbox with strict CPU, RAM (256MB), and execution time limits (5.0s max). Build artifacts are hashed using SHA-256 to avoid redundant recompilation.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Classroom Privacy</h3>
          <p className="text-xs text-dark-300 leading-relaxed">
            Teachers can create classrooms with unique invite codes (e.g. <code>DSA-7F2K</code>). Students solve problems independently; submissions remain strictly private between the student and the teacher.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Collaborative Playground</h3>
          <p className="text-xs text-dark-300 leading-relaxed">
            Open a temporary playground room and share the link with peers. Edits, cursor presence, and shared run outputs synchronize over WebSockets. Rooms automatically expire after 2 hours.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-accent-cyan flex items-center justify-center">
            <Wifi className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Offline-First PWA</h3>
          <p className="text-xs text-dark-300 leading-relaxed">
            All previously loaded library programs and your playground code remain accessible offline. If you click &quot;Run Code&quot; while disconnected, CodeVault queues the execution and runs it as soon as your network reconnects.
          </p>
        </div>
      </div>
    </div>
  );
};
