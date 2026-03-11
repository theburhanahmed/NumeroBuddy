import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUpIcon,
  SparklesIcon,
  HeartIcon,
  CalendarIcon } from
'lucide-react';
import { numerologyAPI, DashboardInsight } from '../lib/numerology-api';
export function QuickStatsOverview() {
  const [insights, setInsights] = useState<DashboardInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await numerologyAPI.getDashboardInsights();
        setInsights(res.insights || []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load insights.');
        setInsights([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const pickIcon = (i: DashboardInsight) => {
      if (i.type === 'cycle') return <CalendarIcon className="w-5 h-5" />;
      if (i.type === 'number') return <SparklesIcon className="w-5 h-5" />;
      if (i.type === 'activity') return <TrendingUpIcon className="w-5 h-5" />;
      return <HeartIcon className="w-5 h-5" />;
    };

    const pickColor = (i: DashboardInsight) => {
      if (i.type === 'cycle') return 'from-green-500 to-emerald-600';
      if (i.type === 'number') return 'from-cyan-400 to-blue-600';
      if (i.type === 'activity') return 'from-purple-500 to-indigo-600';
      return 'from-pink-500 to-rose-600';
    };

    return (insights || []).slice(0, 4).map((i) => ({
      label: i.title,
      description: i.description,
      icon: pickIcon(i),
      color: pickColor(i),
    }));
  }, [insights]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading && (
        <div className="col-span-2 lg:col-span-4 text-white/60">
          Loading insights...
        </div>
      )}
      {error && !isLoading && (
        <div className="col-span-2 lg:col-span-4 text-red-400">
          {error}
        </div>
      )}
      {!isLoading && !error && stats.map((stat, index) =>
      <motion.div
        key={stat.label}
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: index * 0.1
        }}
        className="group relative">

          {/* Glow Effect */}
          <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity`} />


          {/* Card */}
          <div className="relative p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            {/* Icon */}
            <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>

              {stat.icon}
            </div>

            {/* Label */}
            <div className="text-base font-semibold text-white mb-1">
              {stat.label}
            </div>

            {/* Description */}
            <div className="text-sm text-white/70">
              {stat.description}
            </div>
          </div>
        </motion.div>
      )}
    </div>);

}