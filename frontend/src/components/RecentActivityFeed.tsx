import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, HeartIcon, CalendarIcon, TrendingUpIcon, ClockIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
interface Activity {
  id: string;
  type: 'reading' | 'compatibility' | 'forecast' | 'insight';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}
const activities: Activity[] = [{
  id: '1',
  type: 'reading',
  title: 'Daily Reading Completed',
  description: 'Your Life Path 7 energy is strong today. Focus on introspection and spiritual growth.',
  timestamp: '2 hours ago',
  icon: <SparklesIcon className="w-5 h-5" />,
  color: 'from-cyan-400 to-blue-600'
}, {
  id: '2',
  type: 'compatibility',
  title: 'Compatibility Check',
  description: 'Analyzed compatibility with Sarah (Life Path 3). High harmony in creative pursuits.',
  timestamp: '5 hours ago',
  icon: <HeartIcon className="w-5 h-5" />,
  color: 'from-pink-500 to-rose-600'
}, {
  id: '3',
  type: 'forecast',
  title: 'Weekly Forecast Generated',
  description: 'Your Personal Year 5 brings opportunities for change and adventure this week.',
  timestamp: '1 day ago',
  icon: <CalendarIcon className="w-5 h-5" />,
  color: 'from-purple-500 to-indigo-600'
}, {
  id: '4',
  type: 'insight',
  title: 'New Insight Unlocked',
  description: 'Discovered your Expression Number 8 indicates natural leadership abilities.',
  timestamp: '2 days ago',
  icon: <TrendingUpIcon className="w-5 h-5" />,
  color: 'from-green-500 to-emerald-600'
}];
export function RecentActivityFeed() {
  return <SpaceCard variant="premium" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity, index) => <motion.div key={activity.id} initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: index * 0.1
      }} className="flex gap-4 p-4 rounded-xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer group">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {activity.title}
              </h4>
              <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                <ClockIcon className="w-3 h-3" />
                {activity.timestamp}
              </div>
            </div>
          </motion.div>)}
      </div>

      {/* Empty State (when no activities) */}
      {activities.length === 0 && <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-white/60 mb-4">No recent activity</p>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Get Your First Reading
          </button>
        </div>}
    </SpaceCard>;
}