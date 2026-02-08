import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  TrendingUpIcon,
  CalendarIcon,
  HeartIcon,
  MessageSquareIcon,
  ArrowRightIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CosmicSkeletonLoader } from '../components/CosmicSkeletonLoader';
import { CosmicTooltip } from '../components/CosmicTooltip';
import { FeatureHighlight } from '../components/FeatureHighlight';
import { InteractiveTour } from '../components/InteractiveTour';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { QuickStatsOverview } from '../components/QuickStatsOverview';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { PersonalizedRecommendations } from '../components/PersonalizedRecommendations';
import { AchievementBadges } from '../components/AchievementBadges';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAIChat } from '../contexts/AIChatContext';
export function Dashboard() {
  const navigate = useNavigate();
  const { openChat } = useAIChat();
  const isMobile = useIsMobile();
  const [statsRef, statsVisible] = useIntersectionObserver({
    threshold: 0.1
  });
  const [hasSeenTour, setHasSeenTour] = useLocalStorage(
    'hasSeenDashboardTour',
    false
  );
  const [showTour, setShowTour] = useState(false);
  useEffect(() => {
    // Show tour for first-time dashboard visitors
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour]);
  const tourSteps = [
  {
    target: 'dashboard',
    title: 'Welcome to Your Dashboard',
    content:
    'This is your cosmic command center. Access all your numerology insights from here.'
  },
  {
    target: 'stats',
    title: 'Your Progress',
    content: 'Track your readings, streaks, and cosmic journey at a glance.'
  },
  {
    target: 'numbers',
    title: 'Your Core Numbers',
    content:
    'These crystal cubes represent your Life Path, Destiny, Soul Urge, and Personality numbers.'
  },
  {
    target: 'recommendations',
    title: 'Personalized Suggestions',
    content: 'Get AI-powered recommendations based on your cosmic profile.'
  }];

  const quickActions = [
  {
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'AI Numerologist',
    description: 'Chat with AI for instant insights',
    action: openChat,
    color: 'from-cyan-400 to-blue-600',
    tooltip: 'Get personalized numerology guidance 24/7'
  },
  {
    icon: <CalendarIcon className="w-6 h-6" />,
    title: 'Daily Reading',
    description: 'Your cosmic guidance for today',
    action: () => navigate('/daily-readings'),
    color: 'from-purple-500 to-pink-600',
    tooltip: 'Discover what the numbers reveal for today'
  },
  {
    icon: <HeartIcon className="w-6 h-6" />,
    title: 'Compatibility',
    description: 'Check relationship compatibility',
    action: () => navigate('/compatibility'),
    color: 'from-pink-500 to-rose-600',
    tooltip: 'Analyze cosmic connections with others'
  },
  {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    title: 'Life Path',
    description: 'Explore your life journey',
    action: () => navigate('/life-path'),
    color: 'from-green-500 to-emerald-600',
    tooltip: "Understand your life's purpose and direction"
  }];

  const coreNumbers = [
  {
    number: 7,
    label: 'Life Path',
    color: 'cyan' as const
  },
  {
    number: 3,
    label: 'Destiny',
    color: 'purple' as const
  },
  {
    number: 5,
    label: 'Soul Urge',
    color: 'blue' as const
  },
  {
    number: 9,
    label: 'Personality',
    color: 'pink' as const
  }];

  return (
    <CosmicPageLayout>
      {/* Interactive Tour */}
      {showTour &&
      <InteractiveTour
        steps={tourSteps}
        onComplete={() => {
          setHasSeenTour(true);
          setShowTour(false);
        }}
        onSkip={() => {
          setHasSeenTour(true);
          setShowTour(false);
        }} />

      }

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
        transition={{
          duration: 0.5
        }}
        className="mb-8"
        id="dashboard">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-2">
              Welcome Back, Sarah
            </h1>
            <p className="text-white/70 text-lg">
              Your cosmic dashboard awaits
            </p>
          </div>
          <div className="flex gap-3">
            <CosmicTooltip content="View your complete numerology profile">
              <TouchOptimizedButton
                variant="secondary"
                onClick={() => navigate('/report')}
                ariaLabel="View full report">

                View Full Report
              </TouchOptimizedButton>
            </CosmicTooltip>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Overview */}
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
        className="mb-8"
        id="stats">

        <QuickStatsOverview />
      </motion.div>

      {/* Core Numbers */}
      <motion.div
        ref={statsRef}
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
        className="mb-8"
        id="numbers">

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white">
              Your Core Numbers
            </h2>
            <CosmicTooltip
              content="These numbers define your cosmic blueprint"
              icon />

          </div>

          {statsVisible ?
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {coreNumbers.map((item, index) =>
            <Suspense
              key={item.label}
              fallback={<CosmicSkeletonLoader variant="cube" />}>

                  <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: 0.3 + index * 0.1
                }}
                className="flex flex-col items-center">

                    <CrystalNumerologyCube
                  number={item.number}
                  size={isMobile ? 'sm' : 'md'}
                  color={item.color} />

                    <p className="text-base font-semibold text-white mt-4">
                      {item.label}
                    </p>
                  </motion.div>
                </Suspense>
            )}
            </div> :

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <CosmicSkeletonLoader variant="cube" count={4} />
            </div>
          }
        </SpaceCard>
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
          delay: 0.3
        }}
        className="mb-8"
        id="recommendations">

        <PersonalizedRecommendations />
      </motion.div>

      {/* Two Column Layout: Activity Feed + Achievements */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity Feed */}
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
            delay: 0.4
          }}>

          <RecentActivityFeed />
        </motion.div>

        {/* Achievement Badges */}
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
            delay: 0.4
          }}>

          <AchievementBadges />
        </motion.div>
      </div>

      {/* Featured: AI Chat */}
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
        }}
        className="mb-8">

        <FeatureHighlight
          title="New: AI Numerologist Chat"
          description="Get instant answers to your numerology questions"
          badge="NEW">

          <TouchOptimizedButton
            variant="primary"
            onClick={openChat}
            icon={<ArrowRightIcon className="w-5 h-5" />}
            ariaLabel="Start AI chat">

            Start Chatting
          </TouchOptimizedButton>
        </FeatureHighlight>
      </motion.div>

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
        }}
        id="actions">

        <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) =>
          <motion.div
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
            }}>

              <SpaceCard
              variant="default"
              className="p-6 md:p-8 cursor-pointer group h-full flex flex-col"
              onClick={action.action}
              role="button"
              tabIndex={0}
              aria-label={action.title}>

                <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>

                  {action.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white text-lg">
                    {action.title}
                  </h3>
                  <CosmicTooltip content={action.tooltip} icon position="top" />
                </div>
                <p className="text-white/70 leading-relaxed">
                  {action.description}
                </p>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CosmicPageLayout>);

}