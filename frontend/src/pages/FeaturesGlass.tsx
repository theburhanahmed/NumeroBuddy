import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  TrendingUpIcon,
  CalendarIcon,
  MessageSquareIcon,
  BookOpenIcon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassNav } from '../components/GlassNav';
import { LandingFooter } from '../components/LandingFooter';
import { CosmicButton } from '../components/CosmicButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
export function FeaturesGlass() {
  const navigate = useNavigate();
  const features = [
  {
    icon: <SparklesIcon className="w-8 h-8" />,
    title: 'AI Numerologist Chat',
    description:
    'Get instant, personalized insights 24/7. Ask questions about your life path, relationships, and destiny with our advanced AI numerologist.',
    color: 'from-cyan-400 to-blue-600',
    details: [
    'Real-time responses',
    'Personalized guidance',
    'Unlimited conversations',
    'Context-aware insights']

  },
  {
    icon: <TrendingUpIcon className="w-8 h-8" />,
    title: 'Life Path Analysis',
    description:
    "Discover your soul's purpose with comprehensive Life Path analysis. Understand your natural strengths, challenges, and life mission.",
    color: 'from-purple-500 to-indigo-600',
    details: [
    'Core number calculation',
    'Detailed interpretation',
    'Life purpose insights',
    'Career guidance']

  },
  {
    icon: <HeartIcon className="w-8 h-8" />,
    title: 'Compatibility Checker',
    description:
    'Analyze relationship compatibility through numerological harmony. Discover deep connections and understand energetic bonds with others.',
    color: 'from-pink-500 to-rose-600',
    details: [
    'Romantic compatibility',
    'Friendship analysis',
    'Business partnerships',
    'Family dynamics']

  },
  {
    icon: <CalendarIcon className="w-8 h-8" />,
    title: 'Personal Cycles',
    description:
    'Navigate your future with Personal Year, Month, and Day forecasts. Understand the energetic currents shaping your journey.',
    color: 'from-green-500 to-emerald-600',
    details: [
    'Year cycles (1-9)',
    'Monthly forecasts',
    'Daily guidance',
    'Auspicious dates']

  },
  {
    icon: <BookOpenIcon className="w-8 h-8" />,
    title: 'Birth Chart Visualization',
    description:
    'Explore your complete numerological blueprint through interactive 3D charts. See all your core numbers in one stunning visualization.',
    color: 'from-amber-500 to-orange-600',
    details: [
    'Life Path number',
    'Destiny number',
    'Soul Urge number',
    'Personality number']

  },
  {
    icon: <MessageSquareIcon className="w-8 h-8" />,
    title: 'Daily Readings',
    description:
    'Receive personalized daily insights delivered to your dashboard. Start each day with cosmic guidance and clarity.',
    color: 'from-blue-500 to-cyan-600',
    details: [
    'Daily insights',
    'Personalized messages',
    'Actionable advice',
    'Email delivery']

  }];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        {/* Stars - REDUCED from 100 to 50 for performance */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) =>
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse will-change-opacity"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }} />

          )}
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-40 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <GlassNav />

        {/* Header */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-center mb-20">

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
                delay: 0.1
              }}
              className="inline-block mb-6">

              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
                ✨ Powerful Features
              </span>
            </motion.div>

            <h1 className="text-h1 text-white mb-6 leading-tight">
              Everything You Need
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                For Your Cosmic Journey
              </span>
            </h1>

            <p className="text-body text-white/60 max-w-2xl mx-auto">
              Powerful tools and insights to unlock the wisdom of numbers and
              navigate your destiny with clarity.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) =>
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 40
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2 + index * 0.1
              }}>

                <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-full flex flex-col">
                  <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}>

                    {feature.icon}
                  </div>

                  <h3 className="text-h3 text-white mb-3">{feature.title}</h3>

                  <p className="text-small text-white/70 leading-relaxed mb-6 flex-1">
                    {feature.description}
                  </p>

                  <ul className="space-y-2">
                    {feature.details.map((detail, i) =>
                  <li
                    key={i}
                    className="flex items-center gap-2 text-small text-white/60">

                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{detail}</span>
                      </li>
                  )}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* CTA Section */}
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
              delay: 0.8
            }}
            className="text-center mt-20">

            <div className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 backdrop-blur-xl">
              <h2 className="text-h2 text-white mb-4">
                Ready to Unlock Your Cosmic Blueprint?
              </h2>
              <p className="text-body text-white/70 mb-8 max-w-2xl mx-auto">
                Join 50,000+ seekers discovering their path. Start your journey
                today with a free account.
              </p>
              <CosmicButton
                onClick={() => navigate('/signup')}
                variant="primary"
                size="lg"
                icon={<SparklesIcon className="w-5 h-5" />}>

                Start Free Journey
              </CosmicButton>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <Suspense fallback={<LoadingSpinner />}>
          <LandingFooter />
        </Suspense>
      </div>
    </div>);

}