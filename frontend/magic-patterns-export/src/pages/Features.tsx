import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  BrainIcon,
  HeartIcon,
  TrendingUpIcon,
  CalendarIcon,
  GemIcon,
  MessageSquareIcon,
  BarChart3Icon,
  UsersIcon,
  ShieldCheckIcon,
  ZapIcon,
  StarIcon } from
'lucide-react';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CosmicTooltip } from '../components/CosmicTooltip';
import {
  BirthChart3D,
  AIChat3D,
  DailyReading3D,
  Compatibility3D,
  Remedies3D } from
'../components/Feature3DScenes';
export function Features() {
  const navigate = useNavigate();
  const coreFeatures = [
  {
    icon: <StarIcon className="w-8 h-8" />,
    title: 'Birth Chart Analysis',
    description:
    'Interactive 3D visualization of your complete numerological blueprint with detailed insights.',
    color: 'from-cyan-400 to-blue-600',
    tooltip: 'Includes Life Path, Destiny, Soul Urge & more',
    scene: <BirthChart3D />
  },
  {
    icon: <BrainIcon className="w-8 h-8" />,
    title: 'AI Numerologist Chat',
    description:
    'Get instant answers to your numerology questions 24/7 with our advanced AI assistant.',
    color: 'from-purple-500 to-indigo-600',
    tooltip: 'Powered by GPT-4 with numerology expertise',
    scene: <AIChat3D />
  },
  {
    icon: <CalendarIcon className="w-8 h-8" />,
    title: 'Daily Readings',
    description:
    'Personalized daily guidance based on your numbers and current cosmic energies.',
    color: 'from-pink-500 to-rose-600',
    tooltip: 'Updated every morning at 6 AM',
    scene: <DailyReading3D />
  },
  {
    icon: <HeartIcon className="w-8 h-8" />,
    title: 'Compatibility Checker',
    description:
    'Analyze relationship compatibility with partners, friends, and colleagues.',
    color: 'from-rose-500 to-pink-600',
    tooltip: 'Romantic, friendship & business compatibility',
    scene: <Compatibility3D />
  },
  {
    icon: <GemIcon className="w-8 h-8" />,
    title: 'Remedies & Solutions',
    description:
    'Personalized recommendations for crystals, colors, and practices to enhance your energy.',
    color: 'from-amber-500 to-orange-600',
    tooltip: 'Based on your unique numerological profile',
    scene: <Remedies3D />
  },
  {
    icon: <TrendingUpIcon className="w-8 h-8" />,
    title: 'Life Path Insights',
    description:
    'Deep dive into your life purpose, strengths, challenges, and growth opportunities.',
    color: 'from-green-500 to-emerald-600',
    tooltip: 'Includes career and personal development guidance',
    scene: null // Placeholder for future 3D scene
  }];

  const advancedFeatures = [
  {
    icon: <BarChart3Icon className="w-6 h-6" />,
    title: 'Forecasts & Predictions',
    description:
    'Weekly, monthly, and yearly predictions based on your personal cycles.'
  },
  {
    icon: <UsersIcon className="w-6 h-6" />,
    title: 'Expert Consultations',
    description:
    'Book one-on-one sessions with certified numerology consultants.'
  },
  {
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'Community Forum',
    description:
    'Connect with like-minded individuals and share your journey.'
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: 'Privacy & Security',
    description:
    'Your data is encrypted and never shared with third parties.'
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    title: 'Instant Reports',
    description: 'Generate comprehensive PDF reports in seconds.'
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'Regular Updates',
    description: 'New features and insights added monthly.'
  }];

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-28">
        {/* Header */}
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
          className="text-center mb-16">

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
              Everything You Need
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight">
            Powerful Features for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Your Cosmic Journey
            </span>
          </h1>

          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive suite of AI-powered numerology tools with
            interactive 3D visualizations.
          </p>
        </motion.div>

        {/* Core Features with 3D Scenes */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-8 text-center">
            Core Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) =>
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.1
              }}>

                <SpaceCard
                variant="premium"
                className="p-8 h-full group overflow-hidden">

                  {/* 3D Scene */}
                  {feature.scene &&
                <div className="mb-6 -mx-8 -mt-8 px-8 pt-8 bg-gradient-to-b from-black/20 to-transparent">
                      {feature.scene}
                    </div>
                }

                  {/* Content */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>

                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">
                          {feature.title}
                        </h3>
                        <CosmicTooltip
                        content={feature.tooltip}
                        icon
                        position="top" />

                      </div>
                      <p className="text-white/70 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </SpaceCard>
              </motion.div>
            )}
          </div>
        </div>

        {/* Advanced Features */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="mb-16">

          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-8 text-center">
            Advanced Capabilities
          </h2>

          <SpaceCard variant="premium" className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advancedFeatures.map((feature, index) =>
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: index * 0.05
                }}
                className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-white/70">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </SpaceCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center">

          <SpaceCard variant="premium" className="p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
              Start Your Journey Today
            </h2>

            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Get instant access to all features with our free plan. Upgrade
              anytime for advanced insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TouchOptimizedButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                ariaLabel="Start free trial">

                Start Free Trial
              </TouchOptimizedButton>

              <TouchOptimizedButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/pricing')}
                ariaLabel="View pricing">

                View Pricing
              </TouchOptimizedButton>
            </div>
          </SpaceCard>
        </motion.div>
      </div>

      <LandingFooter />
    </div>);

}