import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUpIcon,
  SparklesIcon,
  HeartIcon,
  CalendarIcon } from
'lucide-react';
export function QuickStatsOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[{
        label: 'Daily readings',
        description: 'Come back often to build your numerology habit.',
        icon: <SparklesIcon className="w-5 h-5" />,
        color: 'from-cyan-400 to-blue-600',
      }, {
        label: 'Streaks',
        description: 'We will track streaks once you start reading regularly.',
        icon: <CalendarIcon className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-600',
      }, {
        label: 'Compatibility checks',
        description: 'Explore compatibility tools from your dashboard.',
        icon: <HeartIcon className="w-5 h-5" />,
        color: 'from-pink-500 to-rose-600',
      }, {
        label: 'Insights unlocked',
        description: 'Unlock deeper insights as you explore numerobuddy.',
        icon: <TrendingUpIcon className="w-5 h-5" />,
        color: 'from-purple-500 to-indigo-600',
      }].map((stat, index) =>
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