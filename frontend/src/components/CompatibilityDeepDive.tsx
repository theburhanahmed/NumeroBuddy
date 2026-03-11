import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  SparklesIcon,
  Users2Icon } from
'lucide-react';
import { SpaceCard } from './SpaceCard';
import { numerologyAPI } from '../lib/numerology-api';
export function CompatibilityDeepDive() {
  const [latest, setLatest] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await numerologyAPI.getCompatibilityHistory({ page: 1, page_size: 1 });
        const item = res?.results?.[0] || null;
        setLatest(item);
      } catch (err: any) {
        setError(err?.message || 'Unable to load compatibility history.');
        setLatest(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const overallScore = latest?.compatibility_score;
  const strengths = useMemo(() => (Array.isArray(latest?.strengths) ? latest.strengths : []), [latest]);
  const challenges = useMemo(() => (Array.isArray(latest?.challenges) ? latest.challenges : []), [latest]);
  const advice = useMemo(() => (Array.isArray(latest?.advice) ? latest.advice : []), [latest]);

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
                    2 * Math.PI * 70 * (1 - (typeof overallScore === 'number' ? overallScore : 0) / 100)
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

                    {typeof overallScore === 'number' ? overallScore : '–'}
                  </motion.div>
                  <div className="text-sm text-white/60">out of 100</div>
                </div>
              </div>
            </div>

            {/* Names */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-xl font-semibold text-white">
                You
              </div>
              <HeartIcon className="w-6 h-6 text-pink-400" />
              <div className="text-xl font-semibold text-white">
                {latest?.partner_name || 'Partner'}
              </div>
            </div>

            {/* Overall Assessment */}
            {isLoading && <p className="text-white/60">Loading latest compatibility check…</p>}
            {error && !isLoading && <p className="text-red-400">{error}</p>}
            {!isLoading && !error && !latest && (
              <p className="text-white/70 max-w-md mx-auto">
                No compatibility checks yet. Run one from the Compatibility page to see results here.
              </p>
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
              {strengths.length === 0 && (
                <li className="text-sm text-white/60">No strengths available.</li>
              )}
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
              {challenges.length === 0 && (
                <li className="text-sm text-white/60">No challenges available.</li>
              )}
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
            {advice.length === 0 && (
              <div className="text-white/60">No advice available.</div>
            )}
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