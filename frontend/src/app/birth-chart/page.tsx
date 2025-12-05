'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, TrendingUpIcon, SparklesIcon } from 'lucide-react';
import { AppNavbar } from '@/components/AppNavbar';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { AmbientParticles } from '@/components/AmbientParticles';
import { MagneticCard } from '@/components/ui/magnetic-card';
export default function BirthChart() {
  const coreNumbers = [{
    label: 'Life Path',
    number: 7,
    color: 'from-blue-500 to-cyan-600',
    position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }, {
    label: 'Destiny',
    number: 3,
    color: 'from-purple-500 to-pink-600',
    position: 'top-1/4 left-1/2 -translate-x-1/2'
  }, {
    label: 'Soul Urge',
    number: 5,
    color: 'from-yellow-500 to-amber-600',
    position: 'top-1/2 left-1/4 -translate-y-1/2'
  }, {
    label: 'Personality',
    number: 9,
    color: 'from-green-500 to-emerald-600',
    position: 'top-1/2 right-1/4 -translate-y-1/2'
  }, {
    label: 'Birth Day',
    number: 6,
    color: 'from-pink-500 to-rose-600',
    position: 'bottom-1/4 left-1/2 -translate-x-1/2'
  }];
  const cycles = [{
    period: 'First Cycle',
    age: '0-28',
    number: 3,
    theme: 'Learning & Growth'
  }, {
    period: 'Second Cycle',
    age: '29-56',
    number: 1,
    theme: 'Independence & Leadership'
  }, {
    period: 'Third Cycle',
    age: '57+',
    number: 5,
    theme: 'Freedom & Adventure'
  }];
  const challenges = [{
    name: 'First Challenge',
    number: 4,
    description: 'Learning discipline and structure'
  }, {
    name: 'Second Challenge',
    number: 2,
    description: 'Balancing cooperation and independence'
  }, {
    name: 'Third Challenge',
    number: 6,
    description: 'Taking responsibility without over-giving'
  }];
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 transition-colors duration-500 relative overflow-hidden">
      <AmbientParticles />
      <FloatingOrbs />
      <AppNavbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <motion.div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg" animate={{
            rotate: [0, 5, -5, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity
          }}>
              <StarIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                Birth Chart
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Visual representation of your numerology profile
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chart Visualization */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.1
      }} className="mb-8">
          <GlassCard variant="liquid-premium" className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-600/10 liquid-glass-iridescent">
            <div className="liquid-glass-content">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Your Numerology Chart
              </h2>
              <div className="relative w-full max-w-2xl mx-auto" style={{
              aspectRatio: '1/1'
            }}>
                {/* Center Circle */}
                <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl" animate={{
                rotate: 360
              }} transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}>
                  <div className="text-center text-white">
                    <p className="text-xs mb-1">Sarah</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </motion.div>

                {/* Orbiting Numbers */}
                {coreNumbers.map((num, index) => <motion.div key={num.label} className={`absolute ${num.position}`} initial={{
                opacity: 0,
                scale: 0
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.2 + index * 0.1,
                type: 'spring'
              }}>
                    <motion.div className={`w-24 h-24 bg-gradient-to-r ${num.color} rounded-2xl flex flex-col items-center justify-center text-white shadow-xl`} whileHover={{
                  scale: 1.1,
                  rotate: 5
                }}>
                      <p className="text-xs mb-1">{num.label}</p>
                      <p className="text-3xl font-bold">{num.number}</p>
                    </motion.div>
                  </motion.div>)}

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.circle cx="50%" cy="50%" r="30%" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-300/30 dark:text-purple-500/30" initial={{
                  pathLength: 0
                }} animate={{
                  pathLength: 1
                }} transition={{
                  duration: 2,
                  delay: 0.5
                }} />
                  <motion.circle cx="50%" cy="50%" r="20%" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300/30 dark:text-blue-500/30" initial={{
                  pathLength: 0
                }} animate={{
                  pathLength: 1
                }} transition={{
                  duration: 2,
                  delay: 0.7
                }} />
                </svg>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Life Cycles */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Life Cycles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cycles.map((cycle, index) => <motion.div key={cycle.period} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4 + index * 0.1
          }}>
                <MagneticCard variant="liquid-premium" className="p-6">
                  <div className="liquid-glass-content">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {cycle.period}
                      </h3>
                      <motion.div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg" whileHover={{
                    scale: 1.1,
                    rotate: 5
                  }}>
                        {cycle.number}
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Ages {cycle.age}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {cycle.theme}
                    </p>
                  </div>
                </MagneticCard>
              </motion.div>)}
          </div>
        </motion.div>

        {/* Challenges & Lessons */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Life Challenges & Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => <motion.div key={challenge.name} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.6 + index * 0.1
          }}>
                <MagneticCard variant="liquid-premium" className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                  <div className="liquid-glass-content">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {challenge.number}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {challenge.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {challenge.description}
                    </p>
                  </div>
                </MagneticCard>
              </motion.div>)}
          </div>
        </motion.div>

        {/* Pinnacles */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7
      }}>
          <GlassCard variant="liquid-premium" className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 liquid-glass-iridescent">
            <div className="liquid-glass-content">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUpIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Pinnacles
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Pinnacles represent the major themes and opportunities in
                different periods of your life.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MagneticCard variant="liquid" className="p-5">
                  <div className="liquid-glass-content">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Current Pinnacle
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        5
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Freedom & Change
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Active until age 36
                        </p>
                      </div>
                    </div>
                  </div>
                </MagneticCard>

                <MagneticCard variant="liquid" className="p-5">
                  <div className="liquid-glass-content">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Next Pinnacle
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        8
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Power & Success
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Begins at age 37
                        </p>
                      </div>
                    </div>
                  </div>
                </MagneticCard>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>;
}