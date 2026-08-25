import React, { useEffect, useState } from 'react';
import { BarChart3, Eye, Play, Copy, Clock, X, TrendingUp } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { api, AnalyticsStats } from '../services/api';

interface AnalyticsModalProps {
  programId: number;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ programId, onClose }) => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<AnalyticsStats>(`/api/programs/${programId}/stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load analytics stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [programId]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-900 border border-light-border dark:border-dark-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-light-secondary dark:bg-dark-850 border-b border-light-border dark:border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-light-blueSoft dark:bg-brand-500/20 text-light-blue dark:text-brand-400 flex items-center justify-center border border-light-blueBorder/40 dark:border-transparent">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-light-textStrong dark:text-white">Program Statistics & Activity</h2>
              <p className="text-xs text-light-textSecondary dark:text-dark-300">
                {stats?.title || 'Program Analytics'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-light-textMuted dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white hover:bg-light-secondary dark:hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-light-textMuted dark:text-dark-400">Loading analytics...</div>
          ) : stats ? (
            <>
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-light-secondary dark:bg-dark-850 border border-light-border dark:border-dark-700 flex flex-col shadow-card-light">
                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-400 text-xs font-medium">
                    <Eye className="w-4 h-4 text-cyan-600 dark:text-accent-cyan" />
                    <span>Total Views</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-light-textStrong dark:text-white mt-2">
                    {stats.views}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-light-secondary dark:bg-dark-850 border border-light-border dark:border-dark-700 flex flex-col shadow-card-light">
                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-400 text-xs font-medium">
                    <Play className="w-4 h-4 text-emerald-600 dark:text-accent-emerald" />
                    <span>Total Runs</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-light-textStrong dark:text-white mt-2">
                    {stats.runs}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-light-secondary dark:bg-dark-850 border border-light-border dark:border-dark-700 flex flex-col shadow-card-light">
                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-400 text-xs font-medium">
                    <Copy className="w-4 h-4 text-light-blue dark:text-brand-400" />
                    <span>Copies Made</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-light-textStrong dark:text-white mt-2">
                    {stats.copies}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-light-secondary dark:bg-dark-850 border border-light-border dark:border-dark-700 flex flex-col shadow-card-light">
                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-dark-400 text-xs font-medium">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-accent-amber" />
                    <span>Last Executed</span>
                  </div>
                  <div className="text-sm font-semibold text-light-textStrong dark:text-dark-200 mt-2 truncate">
                    {stats.last_run_at ? new Date(stats.last_run_at).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {/* 30-Day Activity Trend Chart */}
              <div className="p-5 rounded-2xl bg-light-secondary dark:bg-dark-850 border border-light-border dark:border-dark-700 shadow-card-light">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-light-blue dark:text-brand-400" />
                    <h3 className="text-sm font-bold text-light-textStrong dark:text-white">30-Day Activity Trend</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-light-textSecondary dark:text-dark-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-light-blue inline-block"></span>
                      Views
                    </span>
                    <span className="flex items-center gap-1.5 text-light-textSecondary dark:text-dark-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      Runs
                    </span>
                  </div>
                </div>

                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.trend_30_days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2D6ED1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2D6ED1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                      <XAxis dataKey="date" stroke="#98A2B3" tick={{ fill: '#667085', fontSize: 10 }} />
                      <YAxis stroke="#98A2B3" tick={{ fill: '#667085', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9F0', borderRadius: '12px', color: '#1D2433', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#2D6ED1" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="runs" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRuns)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-light-textMuted dark:text-dark-400">
              No stats found or permission denied.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
