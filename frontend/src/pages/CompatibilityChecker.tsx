import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  TrendingUpIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
export function CompatibilityChecker() {
  const [yourNumber, setYourNumber] = useState(7);
  const [partnerNumber, setPartnerNumber] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const calculateCompatibility = () => {
    setShowResults(true);
  };
  const compatibilityScore = 85;
  const compatibilityLevel =
  compatibilityScore >= 80 ?
  'Excellent' :
  compatibilityScore >= 60 ?
  'Good' :
  'Moderate';
  const aspects = [
  {
    icon: <HeartIcon className="w-6 h-6" />,
    title: 'Emotional Connection',
    score: 90,
    description:
    'Deep emotional understanding and mutual respect. You both value meaningful conversations.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: <UsersIcon className="w-6 h-6" />,
    title: 'Communication',
    score: 85,
    description:
    "Strong communication flow. You complement each other's communication styles beautifully.",
    color: 'from-cyan-400 to-blue-600'
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'Shared Values',
    score: 80,
    description:
    'Similar life philosophies and goals. Your values align in important areas.',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    title: 'Growth Potential',
    score: 88,
    description:
    'You inspire each other to grow. This relationship has excellent long-term potential.',
    color: 'from-green-500 to-emerald-600'
  }];

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Compatibility Checker
            </h1>
            <p className="text-white/70">Discover your cosmic connection</p>
          </div>
        </div>
      </motion.div>

      {/* Input Section */}
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
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Enter Life Path Numbers
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Your Number */}
            <div className="text-center">
              <label className="block text-sm font-medium text-white mb-4">
                Your Life Path Number
              </label>
              <div className="flex justify-center mb-4">
                <CrystalNumerologyCube
                  number={yourNumber}
                  size="md"
                  color="cyan" />

              </div>
              <input
                type="range"
                min="1"
                max="9"
                value={yourNumber}
                onChange={(e) => setYourNumber(parseInt(e.target.value))}
                className="w-full h-2 bg-cyan-500/20 rounded-lg appearance-none cursor-pointer accent-cyan-500" />

              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>1</span>
                <span>5</span>
                <span>9</span>
              </div>
            </div>

            {/* Partner Number */}
            <div className="text-center">
              <label className="block text-sm font-medium text-white mb-4">
                Partner's Life Path Number
              </label>
              <div className="flex justify-center mb-4">
                <CrystalNumerologyCube
                  number={partnerNumber}
                  size="md"
                  color="pink" />

              </div>
              <input
                type="range"
                min="1"
                max="9"
                value={partnerNumber}
                onChange={(e) => setPartnerNumber(parseInt(e.target.value))}
                className="w-full h-2 bg-pink-500/20 rounded-lg appearance-none cursor-pointer accent-pink-500" />

              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>1</span>
                <span>5</span>
                <span>9</span>
              </div>
            </div>
          </div>

          <TouchOptimizedButton
            variant="primary"
            size="lg"
            onClick={calculateCompatibility}
            className="w-full"
            icon={<SparklesIcon className="w-5 h-5" />}
            ariaLabel="Check compatibility">

            Check Compatibility
          </TouchOptimizedButton>
        </SpaceCard>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {showResults &&
        <>
            {/* Overall Score */}
            <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              delay: 0.2
            }}
            className="mb-8">

              <SpaceCard variant="premium" className="p-6 md:p-8 text-center">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
                  Compatibility Score
                </h2>
                <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                transition={{
                  delay: 0.3,
                  type: 'spring'
                }}
                className="mb-6">

                  <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 mb-2">
                    {compatibilityScore}%
                  </div>
                  <div className="text-xl text-white/80">
                    {compatibilityLevel} Match
                  </div>
                </motion.div>
                <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Life Path {yourNumber} and {partnerNumber} create a harmonious
                  and balanced partnership. Your energies complement each other
                  beautifully, fostering growth and mutual understanding.
                </p>
              </SpaceCard>
            </motion.div>

            {/* Detailed Aspects */}
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

              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
                Compatibility Breakdown
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {aspects.map((aspect, index) =>
              <motion.div
                key={aspect.title}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.5 + index * 0.1
                }}
                whileHover={{
                  y: -4
                }}>

                    <SpaceCard variant="default" className="p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${aspect.color} flex items-center justify-center text-white shadow-lg`}>

                          {aspect.icon}
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-cyan-400">
                            {aspect.score}
                          </div>
                          <div className="text-xs text-white/60">/ 100</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2">
                        {aspect.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {aspect.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-4 h-2 bg-[#0a1628]/60 rounded-full overflow-hidden">
                        <motion.div
                      initial={{
                        width: 0
                      }}
                      animate={{
                        width: `${aspect.score}%`
                      }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        duration: 0.8
                      }}
                      className={`h-full bg-gradient-to-r ${aspect.color}`} />

                      </div>
                    </SpaceCard>
                  </motion.div>
              )}
              </div>
            </motion.div>

            {/* Advice Section */}
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
            className="mt-8">

              <SpaceCard variant="default" className="p-6 md:p-8">
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-4">
                  Relationship Advice
                </h3>
                <div className="space-y-4 text-white/70">
                  <p className="leading-relaxed">
                    <strong className="text-white">Strengths:</strong> Your
                    combination brings together spiritual depth and creative
                    expression. You inspire each other to explore new ideas and
                    perspectives.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Growth Areas:</strong>{' '}
                    Balance alone time with quality time together. The 7 needs
                    solitude while the 3 thrives on social interaction.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Tips:</strong> Communicate
                    openly about your needs. Create rituals that honor both your
                    introspective and expressive natures.
                  </p>
                </div>
              </SpaceCard>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </CosmicPageLayout>);

}