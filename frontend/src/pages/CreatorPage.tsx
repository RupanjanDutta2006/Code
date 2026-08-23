import React, { useState } from 'react';
import { 
  ExternalLink, 
  Share2, 
  Check, 
  Sparkles, 
  Code2, 
  FileText, 
  FolderArchive, 
  BookOpen, 
  Terminal, 
  Layers,
  Heart,
  CloudDownload,
  ArrowUpRight,
  FolderGit2
} from 'lucide-react';

// Custom SVG Brand Icons
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
  </svg>
);

interface ResourceLink {
  title: string;
  description: string;
  url: string;
  type: 'github' | 'mega';
  badge: string;
  iconBg: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  icon: string;
  accentBorder: string;
  links: ResourceLink[];
}

const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'python',
    title: 'Python Resources',
    icon: '🐍',
    accentBorder: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
    links: [
      {
        title: 'Python Codes',
        description: 'Complete Python exercises, scripts & algorithmic implementations.',
        url: 'https://github.com/RupanjanDutta2006/Python-Codes',
        type: 'github',
        badge: 'GitHub Repo',
        iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      },
      {
        title: 'Python Notes',
        description: 'Handcrafted theory notes, cheat-sheets & conceptual guides.',
        url: 'https://mega.nz/folder/guRx3RJK#qr9w7onbKe2oQxjqBfwacA',
        type: 'mega',
        badge: 'Mega Drive',
        iconBg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      },
      {
        title: 'Python Assignments',
        description: 'Practice problem sheets with verified solutions & test examples.',
        url: 'https://mega.nz/folder/J64mDTpD#bLNxmJFRPjCg2UY2Fpp1qw',
        type: 'mega',
        badge: 'Mega Drive',
        iconBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      },
    ],
  },
  {
    id: 'cpp',
    title: 'C / C++ Resources',
    icon: '💻',
    accentBorder: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
    links: [
      {
        title: 'All C Codes',
        description: 'Fundamentals of C, pointers, memory management & low-level basics.',
        url: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/FUNDAMENTALS%20OF%20C',
        type: 'github',
        badge: 'GitHub Repo',
        iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      },
      {
        title: 'DSA With C',
        description: 'Data Structures & Algorithms: Linked Lists, Stacks, Queues, Trees & Graphs.',
        url: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/DSA%20WITH%20C',
        type: 'github',
        badge: 'GitHub Repo',
        iconBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      },
      {
        title: 'C Notes',
        description: 'Comprehensive study materials & syntax references for C programming.',
        url: 'https://mega.nz/folder/fJ4zwBoS#v_iWF9tpDDPr1hrdzGofmA',
        type: 'mega',
        badge: 'Mega Drive',
        iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      },
      {
        title: 'DSA With C Notes',
        description: 'Deep-dive notes on algorithmic complexity, data structures & proofs.',
        url: 'https://mega.nz/folder/3xxV3K4L#zjxQnfiRHQiSBYZHa0PQAQ',
        type: 'mega',
        badge: 'Mega Drive',
        iconBg: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
      },
      {
        title: 'All CPP Codes',
        description: 'Modern C++ code collection, OOPs, templates, STL & advanced problems.',
        url: 'https://github.com/S0u1k/CPP',
        type: 'github',
        badge: 'GitHub Repo',
        iconBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      },
    ],
  },
  {
    id: 'portfolio',
    title: 'Complete Work & Repositories',
    icon: '🗂️',
    accentBorder: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
    links: [
      {
        title: 'All Codes Till Now',
        description: 'Explore the complete open-source code vault, all projects & contributions.',
        url: 'https://github.com/RupanjanDutta2006',
        type: 'github',
        badge: 'GitHub Profile',
        iconBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      },
    ],
  },
];

export const CreatorPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 animate-fade-in">
      
      {/* Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-dark-700/80 bg-white dark:bg-dark-900/90 shadow-2xl backdrop-blur-xl p-8 transition-colors">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-brand-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Glow Ring */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            <img
              src="https://ugc.production.linktr.ee/04a9a50a-252b-4d1f-962d-7787b0a45c2b_WhatsApp-Image-2026-04-20-at-10.37.37-AM.jpeg"
              alt="Coder Babuu"
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-dark-900 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-900 flex items-center justify-center text-white text-xs shadow-md" title="Active Developer">
              ✓
            </span>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <span>Coder Babuu 😮💨</span>
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </h1>
                <p className="text-sm font-mono font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                  @TheCodeEngineer
                </p>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="self-center sm:self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-700 dark:text-dark-200 text-xs font-semibold border border-slate-200 dark:border-dark-700 transition-all shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 leading-relaxed max-w-2xl">
              Software engineer, educator, and passionate creator behind CodeVault Pro. Curating clean code examples, in-depth DSA notes, and practical problem assignments for students & developers worldwide.
            </p>

            {/* Social Links Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
              <a
                href="https://github.com/RupanjanDutta2006"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-dark-700 hover:border-slate-400 dark:hover:border-dark-500 transition-all shadow-sm group"
              >
                <GithubIcon className="w-4 h-4 text-slate-700 dark:text-dark-200 group-hover:scale-110 transition-transform" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="https://www.instagram.com/thecodeengineer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-semibold border border-pink-500/20 hover:border-pink-500/40 transition-all shadow-sm group"
              >
                <InstagramIcon className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-pink-400/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="https://www.youtube.com/@TheCodeEngineer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-500/20 hover:border-red-500/40 transition-all shadow-sm group"
              >
                <YoutubeIcon className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                <span>YouTube</span>
                <ArrowUpRight className="w-3 h-3 text-red-400/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Resource Cards */}
      <div className="space-y-8">
        {RESOURCE_CATEGORIES.map((category) => (
          <div key={category.id} className="space-y-3.5">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-xl">{category.icon}</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {category.title}
              </h2>
              <span className="text-xs font-mono text-slate-500 dark:text-dark-400">
                ({category.links.length} resource{category.links.length > 1 ? 's' : ''})
              </span>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {category.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-dark-750 bg-white/90 dark:bg-dark-900/80 hover:bg-slate-50 dark:hover:bg-dark-850/90 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${category.accentBorder}`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Platform Icon Box */}
                    <div className={`p-2.5 rounded-xl border ${link.iconBg} flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                      {link.type === 'github' ? (
                        <GithubIcon className="w-5 h-5" />
                      ) : (
                        <CloudDownload className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                          {link.title}
                        </h3>
                        <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                          link.type === 'github'
                            ? 'bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 border-slate-200 dark:border-dark-700'
                            : 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/30'
                        }`}>
                          {link.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-dark-400 line-clamp-2 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  {/* External Arrow Icon */}
                  <div className="p-1 rounded-lg text-slate-400 group-hover:text-brand-500 dark:group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-dark-800 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-dark-900/60 dark:via-dark-850 dark:to-dark-900/60 text-center space-y-2">
        <p className="text-xs font-medium text-slate-600 dark:text-dark-300 flex items-center justify-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>for the developer and student community</span>
        </p>
        <p className="text-[11px] text-slate-400 dark:text-dark-500">
          All resources are freely accessible for learning & educational purposes.
        </p>
      </div>

    </div>
  );
};

export default CreatorPage;
