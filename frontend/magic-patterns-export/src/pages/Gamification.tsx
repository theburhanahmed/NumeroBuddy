import React from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  ZapIcon,
  TargetIcon,
  AwardIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
export function Gamification() {
  const stats = [
  {
    label: 'Level',
    value: 12,
    icon: <TrophyIcon className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    label: 'Points',
    value: 2450,
    icon: <StarIcon className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-600'
  },
  {
    label: 'Streak',
    value: 7,
    icon: <ZapIcon className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600'
  },
  {
    label: 'Badges',
    value: 15,
    icon: <AwardIcon className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-600'
  }];

  const achievements = [
  {
    title: 'First Steps',
    description: 'Complete your first numerology reading',
    progress: 100,
    unlocked: true,
    icon: '🎯',
    points: 50
  },
  {
    title: 'Week Warrior',
    description: 'Check daily readings for 7 consecutive days',
    progress: 100,
    unlocked: true,
    icon: '🔥',
    points: 100
  },
  {
    title: 'Social Butterfly',
    description: 'Check compatibility with 5 different people',
    progress: 60,
    unlocked: false,
    icon: '💕',
    points: 150
  },
  {
    title: 'Knowledge Seeker',
    description: 'Read 10 blog articles',
    progress: 40,
    unlocked: false,
    icon: '📚',
    points: 200
  }];

  const leaderboard = [
  {
    rank: 1,
    name: 'CosmicMaster',
    points: 5240,
    avatar: '👑'
  },
  {
    rank: 2,
    name: 'NumerologyPro',
    points: 4890,
    avatar: '⭐'
  },
  {
    rank: 3,
    name: 'SpiritSeeker',
    points: 4560,
    avatar: '✨'
  },
  {
    rank: 4,
    name: 'You',
    points: 2450,
    avatar: '🌟',
    isYou: true
  },
  {
    rank: 5,
    name: 'PathFinder',
    points: 2340,
    avatar: '🔮'
  }];

  return (
    <CosmicPageLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Your Journey
            </h1>
            <p className="text-white/70">
              Track your progress and achievements
            </p>
          </div>
        </div>
      </motion.div>

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) =>
          <motion.div
            key={stat.label}
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.2 + index * 0.05
            }}>

              <SpaceCard variant="premium" className="p-6 text-center">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mx-auto mb-3 shadow-lg`}>

                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
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
          }}>

          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Achievements
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) =>
            <motion.div
              key={achievement.title}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.4 + index * 0.1
              }}>

                <SpaceCard variant="default" className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                    className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>

                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">
                          {achievement.title}
                        </h3>
                        <span className="text-cyan-400 font-bold">
                          +{achievement.points}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-3">
                        {achievement.description}
                      </p>
                      <div className="h-2 bg-[#0a1628]/60 rounded-full overflow-hidden">
                        <motion.div
                        initial={{
                          width: 0
                        }}
                        animate={{
                          width: `${achievement.progress}%`
                        }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          duration: 0.8
                        }}
                        className={`h-full ${achievement.unlocked ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-cyan-400 to-blue-600'}`} />

                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        {achievement.progress}% complete
                      </p>
                    </div>
                  </div>
                </SpaceCard>
              </motion.div>
            )}
          </div>
        </motion.div>

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
          }}>

          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Leaderboard
          </h2>
          <SpaceCard variant="premium" className="p-6">
            <div className="space-y-4">
              {leaderboard.map((user, index) =>
              <motion.div
                key={user.rank}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.6 + index * 0.1
                }}
                className={`flex items-center gap-4 p-4 rounded-xl ${user.isYou ? 'bg-cyan-500/20 border-2 border-cyan-500' : 'bg-[#0a1628]/40'}`}>

                  <div className="text-2xl font-bold text-white w-8">
                    {user.rank}
                  </div>
                  <div className="text-3xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-sm text-white/60">
                      {user.points} points
                    </div>
                  </div>
                  {user.rank <= 3 &&
                <TrophyIcon
                  className={`w-6 h-6 ${user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-400' : 'text-orange-600'}`} />

                }
                </motion.div>
              )}
            </div>
          </SpaceCard>
        </motion.div>
      </div>
    </CosmicPageLayout>);

}