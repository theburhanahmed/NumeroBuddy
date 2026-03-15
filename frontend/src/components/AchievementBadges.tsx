import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { numerologyAPI, AchievementData } from '../lib/numerology-api';
import {
  TrophyIcon,
  StarIcon,
  ZapIcon,
  HeartIcon,
  SparklesIcon,
  CrownIcon,
  XIcon } from
'lucide-react';
interface Achievement extends AchievementData {
  iconNode?: React.ReactNode;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
{
  id: '1',
  name: 'First Steps',
  description: 'Complete your first numerology reading',
  iconNode: <StarIcon className="w-6 h-6" />,
  color: 'from-cyan-400 to-blue-600',
  unlocked: true,
  unlockedDate: '2024-01-15'
},
{
  id: '2',
  name: 'Streak Master',
  description: 'Maintain a 7-day reading streak',
  iconNode: <ZapIcon className="w-6 h-6" />,
  color: 'from-amber-500 to-orange-600',
  unlocked: true,
  unlockedDate: '2024-01-20'
},
{
  id: '3',
  name: 'Compatibility Expert',
  description: 'Check compatibility with 5 different people',
  iconNode: <HeartIcon className="w-6 h-6" />,
  color: 'from-pink-500 to-rose-600',
  unlocked: true,
  progress: 5,
  maxProgress: 5,
  unlockedDate: '2024-01-18'
},
{
  id: '4',
  name: 'Knowledge Seeker',
  description: 'Read 10 blog articles',
  iconNode: <SparklesIcon className="w-6 h-6" />,
  color: 'from-purple-500 to-indigo-600',
  unlocked: false,
  progress: 6,
  maxProgress: 10
},
{
  id: '5',
  name: 'Cosmic Explorer',
  description: 'Unlock all core numerology insights',
  iconNode: <TrophyIcon className="w-6 h-6" />,
  color: 'from-green-500 to-emerald-600',
  unlocked: false,
  progress: 15,
  maxProgress: 20
},
{
  id: '6',
  name: 'Master Numerologist',
  description: 'Complete 100 readings',
  iconNode: <CrownIcon className="w-6 h-6" />,
  color: 'from-yellow-500 to-amber-600',
  unlocked: false,
  progress: 24,
  maxProgress: 100
}];

export function AchievementBadges() {
  const [selectedAchievement, setSelectedAchievement] =
  useState<Achievement | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  useEffect(() => {
    numerologyAPI.getAchievements()
      .then(res => {
        if (res.achievements && res.achievements.length > 0) {
           // Merge with defaults for icons and colors if necessary
           const merged = res.achievements.map(a => {
             const defaultMatch = DEFAULT_ACHIEVEMENTS.find(da => da.name === a.name || da.id === a.id);
             return {
               ...defaultMatch,
               ...a,
               iconNode: defaultMatch?.iconNode || <StarIcon className="w-6 h-6" />,
               color: a.color || defaultMatch?.color || 'from-cyan-400 to-blue-600'
             };
           });
           setAchievements(merged);
        }
      })
      .catch(err => console.error("Failed to load achievements", err));
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length || 1; 

  return (
    <>
      <div className="p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-white mb-1">
              Achievements
            </h3>
            <p className="text-sm text-white/60">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              {Math.round(unlockedCount / totalCount * 100)}%
            </div>
            <div className="text-xs text-white/60">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-[#0a1628]/60 rounded-full overflow-hidden">
            <motion.div
              initial={{
                width: 0
              }}
              animate={{
                width: `${unlockedCount / totalCount * 100}%`
              }}
              transition={{
                duration: 1,
                ease: 'easeOut'
              }}
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" />

          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {achievements.map((achievement, index) =>
          <motion.button
            key={achievement.id}
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: index * 0.05
            }}
            onClick={() => setSelectedAchievement(achievement)}
            className={`relative aspect-square rounded-xl flex items-center justify-center transition-all ${achievement.unlocked ? `bg-gradient-to-br ${achievement.color} shadow-lg hover:scale-110` : 'bg-[#0a1628]/60 border border-cyan-500/10 hover:border-cyan-500/30'}`}>

              <div
              className={
              achievement.unlocked ? 'text-white' : 'text-white/30'
              }>

                {achievement.iconNode}
              </div>

              {/* Progress Ring for Locked Achievements */}
              {!achievement.unlocked &&
            achievement.progress &&
            achievement.maxProgress &&
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cyan-500/20" />

                    <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{
                  strokeDashoffset: 2 * Math.PI * 45
                }}
                animate={{
                  strokeDashoffset:
                  2 *
                  Math.PI *
                  45 * (
                  1 - achievement.progress / achievement.maxProgress)
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut'
                }}
                className="text-cyan-400" />

                  </svg>
            }

              {/* Unlock Checkmark */}
              {achievement.unlocked &&
            <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: [0, 1.2, 1]
              }}
              transition={{
                delay: index * 0.05 + 0.3
              }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0a1628] text-xs">

                  ✓
                </motion.div>
            }
            </motion.button>
          )}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement &&
        <>
            {/* Backdrop */}
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setSelectedAchievement(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />


            {/* Modal */}
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">

              <div className="p-8 rounded-3xl bg-[#1a2942]/95 backdrop-blur-xl border border-cyan-500/30 relative">
                {/* Close Button */}
                <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#0a1628]/60 flex items-center justify-center text-white/60 hover:text-white transition-colors">

                  <XIcon className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedAchievement.color} flex items-center justify-center text-white mx-auto mb-6 shadow-2xl ${!selectedAchievement.unlocked ? 'opacity-50' : ''}`}>

                  <div className="text-3xl">{selectedAchievement.iconNode}</div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif font-bold text-white text-center mb-2">
                  {selectedAchievement.name}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-center mb-6">
                  {selectedAchievement.description}
                </p>

                {/* Status */}
                {selectedAchievement.unlocked ?
              <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-400 text-sm font-semibold mb-2">
                      ✓ Unlocked
                    </div>
                    <p className="text-xs text-white/50">
                      {selectedAchievement.unlockedDate &&
                  new Date(
                    selectedAchievement.unlockedDate
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                    </p>
                  </div> :

              <div>
                    {selectedAchievement.progress &&
                selectedAchievement.maxProgress &&
                <>
                          <div className="flex justify-between text-sm text-white/60 mb-2">
                            <span>Progress</span>
                            <span>
                              {selectedAchievement.progress} /{' '}
                              {selectedAchievement.maxProgress}
                            </span>
                          </div>
                          <div className="h-2 bg-[#0a1628]/60 rounded-full overflow-hidden">
                            <motion.div
                      initial={{
                        width: 0
                      }}
                      animate={{
                        width: `${selectedAchievement.progress / selectedAchievement.maxProgress * 100}%`
                      }}
                      transition={{
                        duration: 0.5
                      }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" />

                          </div>
                        </>
                }
                  </div>
              }
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}