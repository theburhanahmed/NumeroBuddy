import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  CalendarIcon,
  TrendingUpIcon,
  ClockIcon,
} from 'lucide-react';
import { numerologyAPI, DashboardActivityItem } from '../lib/numerology-api';

interface ActivityUI {
  id: string;
  title: string;
  description?: string;
  timestampLabel: string;
  icon: React.ReactNode;
  color: string;
}
export function RecentActivityFeed() {
  const [items, setItems] = useState<DashboardActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await numerologyAPI.getDashboardActivity({ limit: 10 });
        setItems(res.activities || []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load activity.');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const activities: ActivityUI[] = useMemo(() => {
    const formatTimestamp = (iso?: string) => {
      if (!iso) return 'Recently';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return 'Recently';
      return d.toLocaleString();
    };

    const mapTypeToUI = (type?: string) => {
      switch (type) {
        case 'daily_reading':
          return { icon: <SparklesIcon className="w-5 h-5" />, color: 'from-cyan-400 to-blue-600' };
        case 'remedy_completed':
          return { icon: <CalendarIcon className="w-5 h-5" />, color: 'from-purple-500 to-indigo-600' };
        case 'report_generated':
          return { icon: <TrendingUpIcon className="w-5 h-5" />, color: 'from-green-500 to-emerald-600' };
        default:
          return { icon: <HeartIcon className="w-5 h-5" />, color: 'from-pink-500 to-rose-600' };
      }
    };

    return (items || []).map((it) => {
      const ui = mapTypeToUI(it.type);
      return {
        id: it.id,
        title: it.title,
        description: it.description,
        timestampLabel: formatTimestamp(it.timestamp),
        icon: ui.icon,
        color: ui.color,
      };
    });
  }, [items]);

  return (
    <div className="p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          View All
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-white/60">Loading activity...</div>
      )}

      {error && !isLoading && (
        <div className="text-center py-12 text-red-400">{error}</div>
      )}

      {!isLoading && !error && activities.length > 0 && (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group flex gap-4 p-4 rounded-xl bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}
              >
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                  {activity.title}
                </h4>
                {activity.description && (
                  <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                    {activity.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                  <ClockIcon className="w-3 h-3" />
                  {activity.timestampLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && !error && activities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-white/60 mb-4">No recent activity yet.</p>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Get Your First Reading
          </button>
        </div>
      )}
    </div>);

}