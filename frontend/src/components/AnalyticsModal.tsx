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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-dark-850 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Program Statistics & Activity</h2>
              <p className="text-xs text-dark-300">
                {stats?.title || 'Program Analytics'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-dark-400">Loading analytics...</div>
          ) : stats ? (
            <>
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-dark-850 border border-dark-700 flex flex-col">
                  <div className="flex items-center gap-2 text-dark-400 text-xs font-medium">
                    <Eye className="w-4 h-4 text-accent-cyan" />
                    <span>Total Views</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-2">
                    {stats.views}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-850 border border-dark-700 flex flex-col">
                  <div className="flex items-center gap-2 text-dark-400 text-xs font-medium">
                    <Play className="w-4 h-4 text-accent-emerald" />
                    <span>Total Runs</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-2">
                    {stats.runs}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-850 border border-dark-700 flex flex-col">
                  <div className="flex items-center gap-2 text-dark-400 text-xs font-medium">
                    <Copy className="w-4 h-4 text-brand-400" />
                    <span>Copies Made</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-2">
                    {stats.copies}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-850 border border-dark-700 flex flex-col">
                  <div className="flex items-center gap-2 text-dark-400 text-xs font-medium">
                    <Clock className="w-4 h-4 text-accent-amber" />
                    <span>Last Executed</span>
                  </div>
                  <div className="text-sm font-semibold text-dark-200 mt-2 truncate">
                    {stats.last_run_at ? new Date(stats.last_run_at).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {/* 30-Day Activity Trend Chart */}
              <div className="p-5 rounded-xl bg-dark-850 border border-dark-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-semibold text-white">30-Day Activity Trend</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-dark-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block"></span>
                      Views
                    </span>
                    <span className="flex items-center gap-1.5 text-dark-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald inline-block"></span>
                      Runs
                    </span>
                  </div>
                </div>

                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.trend_30_days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                      <XAxis dataKey="date" stroke="#484f58" tick={{ fill: '#8b949e', fontSize: 10 }} />
                      <YAxis stroke="#484f58" tick={{ fill: '#8b949e', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '8px', color: '#f0f6fc' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="runs" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRuns)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-dark-400">
              No stats found or permission denied.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
