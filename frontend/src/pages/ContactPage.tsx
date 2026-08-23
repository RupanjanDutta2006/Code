import React, { useState } from 'react';
import {
  Mail,
  Phone,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Code2,
  Terminal,
  Compass,
  Cpu,
  Layers,
  Share2,
  ArrowUpRight,
  ShieldCheck,
  Send,
  MessageSquareCode
} from 'lucide-react';

// Custom SVG Brand Icons
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinktreeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m13.736 5.853 4.006-4.103a.75.75 0 0 1 1.077 1.042l-3.69 3.778h5.37a.75.75 0 0 1 0 1.5h-5.37l3.69 3.78a.75.75 0 1 1-1.077 1.04l-4.006-4.103v5.187h5.186a.75.75 0 1 1 0 1.5h-5.186v5.275a.75.75 0 0 1-1.5 0v-5.275H3.05a.75.75 0 0 1 0-1.5h5.186V9.967L4.23 14.07a.75.75 0 1 1-1.077-1.04l3.69-3.78H1.473a.75.75 0 0 1 0-1.5h5.37L3.153 1.972A.75.75 0 1 1 4.23.93l4.006 4.103 4.006-4.103a.75.75 0 0 1 1.077 1.042L9.63 5.853h2.606v5.187z" />
  </svg>
);

interface SkillTag {
  name: string;
  colorClass: string;
}

interface TeamMember {
  name: string;
  badge: string;
  badgeColor: string;
  subtitle: string;
  description: string;
  avatar: string;
  skills: SkillTag[];
  email: string;
  phone: string;
  github: string;
  portfolio: string;
  portfolioLabel: string;
  glowGradient: string;
  borderColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rupanjan Dutta',
    badge: 'CORE ENGINEER',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
    subtitle: 'Lead Developer & Full Stack Engineer',
    description: 'Building and optimizing the CodeVault Pro platform with full-stack architecture, multi-language compiler sandboxing, and real-time collaboration systems.',
    avatar: '/team/rupanjan.jpg',
    skills: [
      { name: 'Python', colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
      { name: 'React', colorClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
      { name: 'FastAPI', colorClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
      { name: 'TypeScript', colorClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
      { name: 'DSA', colorClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    ],
    email: 'rupanjan@codevault.ai',
    phone: '9123642268',
    github: 'https://github.com/RupanjanDutta2006',
    portfolio: 'https://linktr.ee/TheCodeEngineer',
    portfolioLabel: 'Linktree Profile',
    glowGradient: 'from-emerald-500/20 via-teal-500/15 to-transparent',
    borderColor: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20',
  },
  {
    name: 'Souvik Saha',
    badge: 'PRODUCT LEAD',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10',
    subtitle: 'Lead Developer & Full Stack Engineer',
    description: 'Driving product direction, user experience, and platform growth to make CodeVault Pro approachable and powerful for every student and developer.',
    avatar: '/team/souvik.jpg',
    skills: [
      { name: 'Product Strategy', colorClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
      { name: 'UI/UX', colorClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
      { name: 'C++', colorClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
      { name: 'Support', colorClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
      { name: 'User Research', colorClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
    ],
    email: 'tsaha5005@gmail.com',
    phone: '6289532773',
    github: 'https://github.com/S0u1k',
    portfolio: 'https://github.com/S0u1k',
    portfolioLabel: 'GitHub Portfolio',
    glowGradient: 'from-cyan-500/20 via-blue-500/15 to-transparent',
    borderColor: 'hover:border-cyan-500/60 hover:shadow-cyan-500/20',
  },
];

export const ContactPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToastMessage(`Copied ${label} (${text}) to clipboard!`);
    setTimeout(() => {
      setCopiedKey(null);
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 animate-fade-in overflow-hidden">

      {/* Background Code Ambient Symbols */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20 dark:opacity-15 -z-10 font-mono text-xs text-brand-400/40 dark:text-emerald-400/30 flex flex-wrap gap-16 justify-around overflow-hidden">
        <span className="animate-pulse">{'{ compiler: "ready" }'}</span>
        <span className="animate-bounce">{'<CodeVault />'}</span>
        <span>{'const sandbox = true;'}</span>
        <span>{'fn main() -> Ok'}</span>
        <span>{'async () => deploy'}</span>
        <span className="hidden sm:inline">{'import { execute }'}</span>
        <span className="hidden sm:inline">{'01100011 01101111 01100100 01100101'}</span>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-dark-900/95 text-white text-xs font-medium border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl animate-slide-up">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Meet the Team & Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Built by Developers,<br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            for Developers.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-dark-300 leading-relaxed">
          The engineering minds and product strategists behind CodeVault Pro. Reach out for collaborations, questions, or ideas.
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-dark-700/80 bg-white/80 dark:bg-dark-900/85 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 p-6 sm:p-8 flex flex-col justify-between ${member.borderColor}`}
          >
            {/* Ambient Corner Glow */}
            <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl ${member.glowGradient} rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500`} />
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/20 group-hover:via-teal-500/20 group-hover:to-cyan-500/20 pointer-events-none transition-all duration-500" />

            <div className="relative z-10 space-y-6">
              {/* Profile Top Row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Rounded Square Avatar with Glowing Ring */}
                <div className="relative group/avatar flex-shrink-0">
                  <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 opacity-60 blur-md group-hover/avatar:opacity-100 transition-opacity duration-300 animate-pulse" />
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white dark:border-dark-800 shadow-xl"
                  />
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-900 flex items-center justify-center text-white text-[10px]" title="Active">
                    ✓
                  </span>
                </div>

                {/* Name & Role Header */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {member.name}
                    </h2>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${member.badgeColor}`}>
                      {member.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {member.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-dark-300 leading-relaxed pt-1">
                    {member.description}
                  </p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-dark-400">
                  Core Specializations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`text-xs font-mono font-medium px-2.5 py-1 rounded-xl border transition-all ${skill.colorClass}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info Action Buttons */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-200/80 dark:border-dark-800/80 space-y-2.5">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-2">
                Direct Contact & Socials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Email Pill (Click to copy) */}
                <button
                  onClick={() => copyToClipboard(member.email, 'Email', `${member.name}-email`)}
                  className="group/btn relative flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800/90 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/80 hover:border-emerald-500/40 text-slate-700 dark:text-dark-200 transition-all text-xs font-mono text-left shadow-sm"
                  title="Click to copy email"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {copiedKey === `${member.name}-email` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-slate-600 dark:group-hover/btn:text-white flex-shrink-0" />
                  )}
                </button>

                {/* Phone Pill (Click to copy) */}
                <button
                  onClick={() => copyToClipboard(member.phone, 'Phone Number', `${member.name}-phone`)}
                  className="group/btn relative flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800/90 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/80 hover:border-teal-500/40 text-slate-700 dark:text-dark-200 transition-all text-xs font-mono text-left shadow-sm"
                  title="Click to copy phone number"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>+91 {member.phone}</span>
                  </div>
                  {copiedKey === `${member.name}-phone` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-slate-600 dark:group-hover/btn:text-white flex-shrink-0" />
                  )}
                </button>

                {/* GitHub Pill */}
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800/90 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/80 hover:border-cyan-500/40 text-slate-700 dark:text-dark-200 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-mono shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-slate-700 dark:text-dark-300 group-hover/btn:text-white" />
                    <span>GitHub Profile</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>

                {/* Portfolio / Linktree Pill */}
                <a
                  href={member.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800/90 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/80 hover:border-purple-500/40 text-slate-700 dark:text-dark-200 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-mono shadow-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <LinktreeIcon className="w-4 h-4 text-purple-400" />
                    <span className="truncate">{member.portfolioLabel}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform flex-shrink-0" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collaboration / Feedback Banner */}
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-dark-700/80 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-dark-900/90 dark:via-dark-850 dark:to-dark-900/90 text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <MessageSquareCode className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Have Feedback, Feature Ideas, or Collaboration Inquiries?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 max-w-xl mx-auto">
            CodeVault Pro is an open initiative for students, teachers, and developers. Feel free to copy our emails or connect directly on GitHub.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ContactPage;
