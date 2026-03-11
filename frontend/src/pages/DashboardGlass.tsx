import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  TrendingUpIcon,
  CalendarIcon,
  HeartIcon,
  MessageSquareIcon,
  ArrowRightIcon,
  InfoIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
import { AppNavbar } from '../components/AppNavbar';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { QuickStatsOverview } from '../components/QuickStatsOverview';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { PersonalizedRecommendations } from '../components/PersonalizedRecommendations';
import { AchievementBadges } from '../components/AchievementBadges';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useAIChat } from '../contexts/AIChatContext';
import { useAuth } from '../contexts/AuthContext';
import { numerologyAPI, NumerologyProfile as ApiNumerologyProfile } from '../lib/numerology-api';
export function DashboardGlass() {
  const navigate = useNavigate();
  const { openChat } = useAIChat();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ApiNumerologyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const p = await numerologyAPI.getNumerologyProfile();
        setProfile(p);
      } catch (err: any) {
        setError(err?.message || 'Unable to load numerology profile.');
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const coreNumbers = [
    {
      number: profile?.life_path_number,
      label: 'Life Path',
      color: 'cyan' as const,
      description: 'Your spiritual journey and life purpose',
      insight: 'Life path',
      action: () => navigate('/life-path'),
    },
    {
      number: profile?.destiny_number,
      label: 'Destiny',
      color: 'purple' as const,
      description: 'Your natural talents and potential',
      insight: 'Destiny',
      action: () => navigate('/report'),
    },
    {
      number: profile?.soul_urge_number,
      label: 'Soul Urge',
      color: 'blue' as const,
      description: 'Your inner desires and motivations',
      insight: 'Soul urge',
      action: () => navigate('/report'),
    },
    {
      number: profile?.personality_number,
      label: 'Personality',
      color: 'pink' as const,
      description: 'How others perceive you',
      insight: 'Personality',
      action: () => navigate('/report'),
    },
  ];

  const quickActions = [
  {
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'AI Numerologist',
    description: 'Chat with AI for instant insights',
    action: openChat,
    color: 'from-cyan-400 to-blue-600'
  },
  {
    icon: <CalendarIcon className="w-6 h-6" />,
    title: 'Daily Reading',
    description: 'Your cosmic guidance for today',
    action: () => navigate('/daily-readings'),
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: <HeartIcon className="w-6 h-6" />,
    title: 'Compatibility',
    description: 'Check relationship compatibility',
    action: () => navigate('/compatibility'),
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    title: 'Life Path',
    description: 'Explore your life journey',
    action: () => navigate('/life-path'),
    color: 'from-green-500 to-emerald-600'
  }];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      {/* App Navbar */}
      <AppNavbar />

      <div className="relative z-10">
        {/* Main Content - Add top padding for fixed navbar */}
        <div className="max-w-7xl mx-auto px-8 py-8 pt-24">
          {/* Welcome Section */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="mb-12">

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
              Welcome back{user?.full_name ? `, ${user.full_name}` : ''}
            </h1>
            <p className="text-white/70 text-lg">
              Your cosmic dashboard awaits
            </p>
          </motion.div>

          {/* Quick Stats */}
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
            className="mb-12">

            <QuickStatsOverview />
          </motion.div>

          {/* Core Numbers - Enhanced Interactive Cards */}
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
              delay: 0.2
            }}
            className="mb-12">

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-white">
                Your Core Numbers
              </h2>
              <button
                onClick={() => navigate('/report')}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-2 transition-colors">

                View Full Report
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading && (
                <div className="lg:col-span-4 text-white/60">Loading your core numbers...</div>
              )}
              {error && !isLoading && (
                <div className="lg:col-span-4 text-red-400">{error}</div>
              )}
              {coreNumbers.map((item, index) =>
              <Suspense key={item.label} fallback={<LoadingSpinner />}>
                  <motion.button
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.3 + index * 0.1
                  }}
                  onClick={item.action}
                  className="group relative p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-left overflow-hidden"
                  whileHover={{
                    y: -4,
                    scale: 1.02
                  }}
                  whileTap={{
                    scale: 0.98
                  }}>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:to-blue-600/10 rounded-3xl blur-xl transition-all duration-300" />

                    {/* Content */}
                    <div className="relative flex flex-col items-center">
                      {/* Crystal Cube */}
                      <div className="mb-4">
                        <CrystalNumerologyCube
                        number={item.number ?? 0}
                        size={isMobile ? 'sm' : 'md'}
                        color={item.color} />

                      </div>

                      {/* Label */}
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.label}
                      </h3>

                      {/* Insight */}
                      <p className="text-cyan-400 text-sm font-medium mb-3 text-center">
                        {item.number ? item.insight : '—'}
                      </p>

                      {/* Description */}
                      <p className="text-white/60 text-xs text-center leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Learn More CTA */}
                      <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Learn More</span>
                        <ArrowRightIcon className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Info icon indicator */}
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <InfoIcon className="w-3 h-3 text-cyan-400" />
                    </div>
                  </motion.button>
                </Suspense>
              )}
            </div>

            {/* Helper text */}
            <motion.p
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                delay: 0.7
              }}
              className="text-white/50 text-sm text-center mt-6">

              Click any number to explore its deeper meaning and influence on
              your life
            </motion.p>
          </motion.div>

          {/* Personalized Recommendations */}
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
              delay: 0.4
            }}
            className="mb-12">

            <PersonalizedRecommendations />
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Recent Activity */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.5
              }}>

              <RecentActivityFeed />
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.5
              }}>

              <AchievementBadges />
            </motion.div>
          </div>

          {/* Quick Actions */}
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
              delay: 0.6
            }}>

            <h2 className="text-2xl font-serif text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) =>
              <motion.button
                key={action.title}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.7 + index * 0.1
                }}
                onClick={action.action}
                className="group relative p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-left"
                whileHover={{
                  y: -4
                }}
                whileTap={{
                  scale: 0.98
                }}>

                  {/* Glow Effect */}
                  <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity`} />


                  <div className="relative">
                    <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>

                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {action.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {action.description}
                    </p>
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}