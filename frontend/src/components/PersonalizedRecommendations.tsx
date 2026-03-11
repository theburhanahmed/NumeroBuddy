import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  HeartIcon,
  TrendingUpIcon,
  BookOpenIcon,
  ArrowRightIcon } from
'lucide-react';
import { numerologyAPI, DashboardRecommendation } from '../lib/numerology-api';
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
export function PersonalizedRecommendations() {
  const navigate = useNavigate();
  const [items, setItems] = useState<DashboardRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await numerologyAPI.getDashboardRecommendations();
        setItems(res.recommendations || []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load recommendations.');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const recommendations: Recommendation[] = useMemo(() => {
    const map = (rec: DashboardRecommendation, idx: number): Recommendation => {
      const type = rec.category === 'remedies'
        ? 'learning'
        : rec.category === 'readings'
        ? 'reading'
        : rec.category === 'timing'
        ? 'forecast'
        : rec.category === 'reports'
        ? 'learning'
        : 'learning';

      const icon =
        type === 'reading'
          ? <SparklesIcon className="w-6 h-6" />
          : type === 'forecast'
          ? <TrendingUpIcon className="w-6 h-6" />
          : type === 'compatibility'
          ? <HeartIcon className="w-6 h-6" />
          : <BookOpenIcon className="w-6 h-6" />;

      const color =
        type === 'reading'
          ? 'from-cyan-400 to-blue-600'
          : type === 'forecast'
          ? 'from-purple-500 to-indigo-600'
          : type === 'compatibility'
          ? 'from-pink-500 to-rose-600'
          : 'from-green-500 to-emerald-600';

      return {
        id: String(idx),
        type,
        title: rec.title,
        description: rec.description,
        action: rec.path ? 'Open' : 'Learn More',
        route: rec.path || '/dashboard',
        icon,
        color,
        priority: (rec.priority as any) || 'medium',
      };
    };

    return (items || []).map(map);
  }, [items]);

  return (
    <div className="p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-serif font-bold text-white mb-2">
          Recommended for You
        </h3>
        <p className="text-sm text-white/60">
          Personalized suggestions based on your cosmic profile
        </p>
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading && (
          <div className="text-white/60">Loading recommendations...</div>
        )}
        {error && !isLoading && (
          <div className="text-red-400">{error}</div>
        )}
        {!isLoading && !error && recommendations.length === 0 && (
          <div className="text-white/60">No recommendations yet.</div>
        )}
        {!isLoading && !error && recommendations.map((rec, index) =>
        <motion.div
          key={rec.id}
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
          onClick={() => navigate(rec.route)}
          className="group relative p-6 rounded-xl bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer overflow-hidden">

            {/* Priority Badge */}
            {rec.priority === 'high' &&
          <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold">
                  Priority
                </span>
              </div>
          }

            {/* Icon */}
            <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rec.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>

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
            <div
            className={`absolute inset-0 bg-gradient-to-br ${rec.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />

          </motion.div>
        )}
      </div>
    </div>);

}