import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  SparklesIcon,
  Users2Icon } from
'lucide-react';
import { SpaceCard } from './SpaceCard';
interface CompatibilityScore {
  category: string;
  score: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}
interface Person {
  name: string;
  lifePath: number;
  destiny: number;
  soulUrge: number;
}
export function CompatibilityDeepDive() {
  const [person1] = useState<Person>({
    name: 'You',
    lifePath: 7,
    destiny: 3,
    soulUrge: 5
  });
  const [person2] = useState<Person>({
    name: 'Sarah',
    lifePath: 3,
    destiny: 6,
    soulUrge: 9
  });
  const overallScore = 85;
  const scores: CompatibilityScore[] = [
  {
    category: 'Romantic Chemistry',
    score: 92,
    description:
    'Strong emotional and physical attraction. Your numbers create magnetic energy.',
    icon: <HeartIcon className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-600'
  },
  {
    category: 'Communication',
    score: 78,
    description:
    'Good understanding but requires effort. Practice active listening.',
    icon: <Users2Icon className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    category: 'Life Goals',
    score: 85,
    description:
    "Aligned visions for the future. You support each other's dreams.",
    icon: <TrendingUpIcon className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-600'
  },
  {
    category: 'Conflict Resolution',
    score: 70,
    description: 'Different approaches to problems. Compromise is key.',
    icon: <AlertTriangleIcon className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-600'
  }];

  const strengths = [
  "Creative synergy - You inspire each other's artistic expression",
  'Emotional depth - Both value meaningful connections',
  'Growth mindset - You challenge each other to evolve',
  'Spiritual alignment - Shared interest in deeper meaning'];

  const challenges = [
  "Different communication styles - You're introspective, they're expressive",
  'Pace of life - You need solitude, they thrive in social settings',
  'Decision making - Analytical vs intuitive approaches'];

  const advice = [
  'Schedule regular "deep talk" sessions to maintain connection',
  "Respect each other's need for alone time and social time",
  'Combine your analytical mind with their creative intuition for balanced decisions',
  'Create shared rituals that honor both your spiritual and social needs'];

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <SpaceCard
          variant="premium"
          className="p-8 text-center relative overflow-hidden">

          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10" />

          <div className="relative z-10">
            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              {/* Background Circle */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-cyan-500/20" />

                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  initial={{
                    strokeDashoffset: 2 * Math.PI * 70
                  }}
                  animate={{
                    strokeDashoffset:
                    2 * Math.PI * 70 * (1 - overallScore / 100)
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeOut'
                  }} />

                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%">

                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                    transition={{
                      delay: 0.5,
                      type: 'spring'
                    }}
                    className="text-5xl font-bold text-white">

                    {overallScore}
                  </motion.div>
                  <div className="text-sm text-white/60">out of 100</div>
                </div>
              </div>
            </div>

            {/* Names */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-xl font-semibold text-white">
                {person1.name}
              </div>
              <HeartIcon className="w-6 h-6 text-pink-400" />
              <div className="text-xl font-semibold text-white">
                {person2.name}
              </div>
            </div>

            {/* Overall Assessment */}
            <p className="text-white/70 max-w-md mx-auto">
              <span className="text-green-400 font-semibold">
                Highly Compatible!
              </span>{' '}
              Your cosmic energies create a strong foundation for a meaningful
              relationship.
            </p>
          </div>
        </SpaceCard>
      </motion.div>

      {/* Detailed Scores */}
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
        }}>

        <SpaceCard variant="premium" className="p-6">
          <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-6">
            Compatibility Breakdown
          </h3>

          <div className="space-y-6">
            {scores.map((score, index) =>
            <motion.div
              key={score.category}
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.3 + index * 0.1
              }}>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${score.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>

                    {score.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">
                        {score.category}
                      </h4>
                      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        {score.score}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-[#1a2942]/60 rounded-full overflow-hidden mb-2">
                      <motion.div
                      initial={{
                        width: 0
                      }}
                      animate={{
                        width: `${score.score}%`
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.5 + index * 0.1
                      }}
                      className={`h-full bg-gradient-to-r ${score.color}`} />

                    </div>

                    <p className="text-sm text-white/60">{score.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </SpaceCard>
      </motion.div>

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
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

          <SpaceCard variant="default" className="p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Strengths</h3>
            </div>

            <ul className="space-y-3">
              {strengths.map((strength, index) =>
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  x: -10
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.5 + index * 0.05
                }}
                className="flex items-start gap-2 text-sm text-white/70">

                  <span className="text-green-400 mt-1">✓</span>
                  <span>{strength}</span>
                </motion.li>
              )}
            </ul>
          </SpaceCard>
        </motion.div>

        {/* Challenges */}
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

          <SpaceCard variant="default" className="p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                <AlertTriangleIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Challenges</h3>
            </div>

            <ul className="space-y-3">
              {challenges.map((challenge, index) =>
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  x: 10
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.5 + index * 0.05
                }}
                className="flex items-start gap-2 text-sm text-white/70">

                  <span className="text-amber-400 mt-1">!</span>
                  <span>{challenge}</span>
                </motion.li>
              )}
            </ul>
          </SpaceCard>
        </motion.div>
      </div>

      {/* Advice */}
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

        <SpaceCard variant="premium" className="p-6">
          <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-4">
            Cosmic Advice for Your Relationship
          </h3>

          <div className="space-y-3">
            {advice.map((tip, index) =>
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.7 + index * 0.05
              }}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/20">

                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-white/80 leading-relaxed">{tip}</p>
              </motion.div>
            )}
          </div>
        </SpaceCard>
      </motion.div>
    </div>);

}