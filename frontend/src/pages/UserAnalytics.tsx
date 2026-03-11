import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3Icon,
  TrendingUpIcon,
  CalendarIcon,
  ActivityIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { numerologyAPI } from '../lib/numerology-api';
export function UserAnalytics() {
  const [activity, setActivity] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [a, i, p] = await Promise.all([
          numerologyAPI.getDashboardActivity({ limit: 20 }),
          numerologyAPI.getDashboardInsights(),
          numerologyAPI.getNumerologyProfile(),
        ]);
        setActivity(a.activities || []);
        setInsights(i.insights || []);
        setProfile(p);
      } catch (err: any) {
        setError(err?.message || 'Unable to load analytics.');
        setActivity([]);
        setInsights([]);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const totalReadings = activity.filter((x) => x.type === 'daily_reading').length;
    const remedyCompleted = activity.filter((x) => x.type === 'remedy_completed').length;
    return [
      {
        label: 'Recent readings',
        value: totalReadings,
        change: '',
        icon: <ActivityIcon className="w-6 h-6" />,
        color: 'from-cyan-400 to-blue-600',
      },
      {
        label: 'Remedies completed',
        value: remedyCompleted,
        change: '',
        icon: <CalendarIcon className="w-6 h-6" />,
        color: 'from-purple-500 to-indigo-600',
      },
      {
        label: 'Insights available',
        value: insights.length,
        change: '',
        icon: <TrendingUpIcon className="w-6 h-6" />,
        color: 'from-green-500 to-emerald-600',
      },
      {
        label: 'Life Path',
        value: profile?.life_path_number ?? '–',
        change: '',
        icon: <BarChart3Icon className="w-6 h-6" />,
        color: 'from-yellow-500 to-orange-600',
      },
    ];
  }, [activity, insights, profile]);

  return (
    <CosmicPageLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <BarChart3Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Your Analytics
            </h1>
            <p className="text-white/70">Track your numerology journey</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.1
        }}
        className="mb-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) =>
          <motion.div
            key={stat.label}
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.2 + index * 0.05
            }}>

              <SpaceCard variant="premium" className="p-6">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 shadow-lg`}>

                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 mb-2">{stat.label}</div>
                {stat.change ? (
                  <div className="text-xs text-green-400 font-semibold">
                    {stat.change}
                  </div>
                ) : null}
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>

      {isLoading && <div className="text-white/60 mb-8">Loading analytics…</div>}
      {error && <div className="text-red-400 mb-8">{error}</div>}

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.5
        }}>

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Recent Activity
        </h2>
        <SpaceCard variant="default" className="p-6">
          <div className="space-y-4">
            {activity.length === 0 && (
              <div className="text-white/60">No recent activity.</div>
            )}
            {activity.map((a, index) =>
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.6 + index * 0.1
              }}
              className="flex items-center gap-4 p-4 bg-[#0a1628]/40 rounded-xl">

                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${a.type === 'daily_reading' ? 'bg-cyan-500/20 text-cyan-400' : a.type === 'report_generated' ? 'bg-purple-500/20 text-purple-400' : a.type === 'remedy_completed' ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'}`}>

                  <ActivityIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{a.title}</p>
                  <p className="text-sm text-white/60">{a.timestamp ? new Date(a.timestamp).toLocaleString() : ''}</p>
                </div>
              </motion.div>
            )}
          </div>
        </SpaceCard>
      </motion.div>
    </CosmicPageLayout>);

}