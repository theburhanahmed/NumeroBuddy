import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUpIcon, TargetIcon, CompassIcon, MapIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { CosmicTooltip } from '../components/CosmicTooltip';
export function LifePathAnalysis() {
  const lifePathNumber = 7;
  const phases = [
  {
    age: '0-27',
    title: 'Foundation Phase',
    description:
    'Building your spiritual foundation and discovering your unique gifts. Focus on education and self-discovery.',
    icon: <CompassIcon className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-600'
  },
  {
    age: '28-54',
    title: 'Growth Phase',
    description:
    'Applying your wisdom and sharing your insights with others. Career and relationships flourish.',
    icon: <TrendingUpIcon className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-600'
  },
  {
    age: '55+',
    title: 'Mastery Phase',
    description:
    'Achieving spiritual mastery and becoming a guide for others. Legacy and wisdom sharing.',
    icon: <TargetIcon className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600'
  }];

  const strengths = [
  'Deep spiritual insight and intuition',
  'Analytical and research-oriented mind',
  'Natural wisdom and philosophical thinking',
  'Strong connection to inner guidance',
  'Ability to see beyond surface appearances'];

  const challenges = [
  'Tendency toward isolation and overthinking',
  'Difficulty trusting others fully',
  'May struggle with practical matters',
  'Can be overly critical of self and others',
  'Need to balance solitude with connection'];

  return (
    <CosmicPageLayout>
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
        className="mb-8">

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <MapIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Life Path Analysis
            </h1>
            <p className="text-white/70">Understanding your cosmic journey</p>
          </div>
        </div>
      </motion.div>

      {/* Life Path Number */}
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

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <CrystalNumerologyCube
                number={lifePathNumber}
                size="lg"
                color="cyan" />

            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white">
                  Life Path Number {lifePathNumber}
                </h2>
                <CosmicTooltip
                  content="Your most important numerology number"
                  icon />

              </div>
              <p className="text-xl text-white/80 leading-relaxed mb-4">
                The Seeker of Truth and Wisdom
              </p>
              <p className="text-white/70 leading-relaxed">
                Your Life Path 7 indicates a journey of spiritual growth, inner
                wisdom, and deep understanding. You are here to seek truth,
                develop your intuition, and share your insights with the world.
                Your path is one of introspection, analysis, and spiritual
                enlightenment.
              </p>
            </div>
          </div>
        </SpaceCard>
      </motion.div>

      {/* Life Phases */}
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
        className="mb-8">

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Life Journey Phases
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((phase, index) =>
          <motion.div
            key={phase.title}
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
            whileHover={{
              y: -4
            }}>

              <SpaceCard variant="default" className="p-6 h-full">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white mb-4 shadow-lg`}>

                  {phase.icon}
                </div>
                <div className="mb-3">
                  <span className="text-sm font-semibold text-cyan-400">
                    {phase.age} years
                  </span>
                  <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mt-1">
                    {phase.title}
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed">
                  {phase.description}
                </p>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Strengths & Challenges */}
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
        }}>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-4">
              Your Strengths
            </h3>
            <ul className="space-y-3">
              {strengths.map((strength, index) =>
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.5 + index * 0.1
                }}
                className="flex items-start gap-3">

                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white/80">{strength}</span>
                </motion.li>
              )}
            </ul>
          </SpaceCard>

          {/* Challenges */}
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-4">
              Growth Opportunities
            </h3>
            <ul className="space-y-3">
              {challenges.map((challenge, index) =>
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.5 + index * 0.1
                }}
                className="flex items-start gap-3">

                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="text-white/80">{challenge}</span>
                </motion.li>
              )}
            </ul>
          </SpaceCard>
        </div>
      </motion.div>
    </CosmicPageLayout>);

}