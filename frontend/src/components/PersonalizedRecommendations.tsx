import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, HeartIcon, TrendingUpIcon, BookOpenIcon, ArrowRightIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
interface Recommendation {
  id: string;
  type: 'reading' | 'compatibility' | 'forecast' | 'learning';
  title: string;
  description: string;
  action: string;
  route: string;
  icon: React.ReactNode;
  color: string;
  priority: 'high' | 'medium' | 'low';
}
const recommendations: Recommendation[] = [{
  id: '1',
  type: 'reading',
  title: 'Your Daily Reading Awaits',
  description: 'Today is a powerful day for your Life Path 7. Discover what the cosmos has in store.',
  action: 'Get Reading',
  route: '/daily-readings',
  icon: <SparklesIcon className="w-6 h-6" />,
  color: 'from-cyan-400 to-blue-600',
  priority: 'high'
}, {
  id: '2',
  type: 'compatibility',
  title: 'Check Compatibility',
  description: 'You have 2 pending compatibility analyses. See how your numbers align with others.',
  action: 'Check Now',
  route: '/compatibility',
  icon: <HeartIcon className="w-6 h-6" />,
  color: 'from-pink-500 to-rose-600',
  priority: 'medium'
}, {
  id: '3',
  type: 'forecast',
  title: 'Monthly Forecast Available',
  description: 'Your Personal Year 5 forecast for this month is ready. Plan ahead with cosmic guidance.',
  action: 'View Forecast',
  route: '/forecasts',
  icon: <TrendingUpIcon className="w-6 h-6" />,
  color: 'from-purple-500 to-indigo-600',
  priority: 'medium'
}, {
  id: '4',
  type: 'learning',
  title: 'Learn About Master Numbers',
  description: 'Deepen your understanding of Master Numbers 11, 22, and 33 in our latest blog post.',
  action: 'Read Article',
  route: '/blog',
  icon: <BookOpenIcon className="w-6 h-6" />,
  color: 'from-green-500 to-emerald-600',
  priority: 'low'
}];
export function PersonalizedRecommendations() {
  const navigate = useNavigate();
  return <SpaceCard variant="premium" className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2">
          Recommended for You
        </h3>
        <p className="text-sm text-white/60">
          Personalized suggestions based on your cosmic profile
        </p>
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => <motion.div key={rec.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }} onClick={() => navigate(rec.route)} className="p-6 rounded-xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer group relative overflow-hidden">
            {/* Priority Badge */}
            {rec.priority === 'high' && <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold">
                  Priority
                </span>
              </div>}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rec.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              {rec.icon}
            </div>

            {/* Content */}
            <h4 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {rec.title}
            </h4>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              {rec.description}
            </p>

            {/* Action */}
            <div className="flex items-center gap-2 text-sm text-cyan-400 font-semibold group-hover:gap-3 transition-all">
              {rec.action}
              <ArrowRightIcon className="w-4 h-4" />
            </div>

            {/* Hover Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rec.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
          </motion.div>)}
      </div>
    </SpaceCard>;
}