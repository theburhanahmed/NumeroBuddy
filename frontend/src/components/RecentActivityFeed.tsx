import React from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  CalendarIcon,
  TrendingUpIcon,
  ClockIcon } from
'lucide-react';
export function RecentActivityFeed() {
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

      {/* Empty State */}
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
          <SparklesIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="text-white/60 mb-4">
          Your numerobuddy activity will appear here after you start using readings, forecasts, and compatibility tools.
        </p>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          Get Your First Reading
        </button>
      </div>
    </div>);

}