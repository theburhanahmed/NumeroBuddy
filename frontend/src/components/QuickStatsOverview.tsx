import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUpIcon, SparklesIcon, HeartIcon, CalendarIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}
const stats: Stat[] = [{
  label: 'Readings This Month',
  value: '24',
  change: '+12%',
  trend: 'up',
  icon: <SparklesIcon className="w-5 h-5" />,
  color: 'from-cyan-400 to-blue-600'
}, {
  label: 'Current Streak',
  value: '7 days',
  change: 'Keep it up!',
  trend: 'up',
  icon: <CalendarIcon className="w-5 h-5" />,
  color: 'from-green-500 to-emerald-600'
}, {
  label: 'Compatibility Checks',
  value: '5',
  change: '+2 this week',
  trend: 'up',
  icon: <HeartIcon className="w-5 h-5" />,
  color: 'from-pink-500 to-rose-600'
}, {
  label: 'Insights Unlocked',
  value: '18',
  change: '3 remaining',
  trend: 'neutral',
  icon: <TrendingUpIcon className="w-5 h-5" />,
  color: 'from-purple-500 to-indigo-600'
}];
export function QuickStatsOverview() {
  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => <motion.div key={stat.label} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: index * 0.1
    }}>
          <SpaceCard variant="default" className="p-6 hover:border-cyan-500/40 transition-colors">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
              {stat.icon}
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-sm text-white/60 mb-2">{stat.label}</div>

            {/* Change */}
            <div className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-white/50'}`}>
              {stat.change}
            </div>
          </SpaceCard>
        </motion.div>)}
    </div>;
}