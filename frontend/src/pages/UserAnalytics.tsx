import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3Icon,
  TrendingUpIcon,
  CalendarIcon,
  ActivityIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
export function UserAnalytics() {
  const stats = [
  {
    label: 'Total Readings',
    value: 47,
    change: '+12%',
    icon: <ActivityIcon className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-600'
  },
  {
    label: 'Days Active',
    value: 23,
    change: '+5%',
    icon: <CalendarIcon className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    label: 'Insights Gained',
    value: 156,
    change: '+28%',
    icon: <TrendingUpIcon className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600'
  },
  {
    label: 'Growth Score',
    value: 8.5,
    change: '+1.2',
    icon: <BarChart3Icon className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-600'
  }];

  const activityData = [
  {
    month: 'Jan',
    readings: 8,
    insights: 24
  },
  {
    month: 'Feb',
    readings: 12,
    insights: 36
  },
  {
    month: 'Mar',
    readings: 15,
    insights: 45
  },
  {
    month: 'Apr',
    readings: 12,
    insights: 51
  }];

  const topNumbers = [
  {
    number: 7,
    frequency: 23,
    meaning: 'Spiritual Growth'
  },
  {
    number: 3,
    frequency: 18,
    meaning: 'Creative Expression'
  },
  {
    number: 5,
    frequency: 15,
    meaning: 'Change & Freedom'
  }];

  const recentActivity = [
  {
    date: '2 hours ago',
    action: 'Completed Daily Reading',
    type: 'reading'
  },
  {
    date: '1 day ago',
    action: 'Checked Compatibility',
    type: 'compatibility'
  },
  {
    date: '2 days ago',
    action: 'Viewed Birth Chart',
    type: 'chart'
  },
  {
    date: '3 days ago',
    action: 'Calculated Life Path',
    type: 'calculation'
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <BarChart3Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Your Analytics
            </h1>
            <p className="text-white/70">Track your numerology journey</p>
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

              <SpaceCard variant="premium" className="p-6">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 shadow-lg`}>

                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 mb-2">{stat.label}</div>
                <div className="text-xs text-green-400 font-semibold">
                  {stat.change}
                </div>
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
            Activity Over Time
          </h2>
          <SpaceCard variant="premium" className="p-6">
            <div className="space-y-4">
              {activityData.map((data, index) =>
              <div key={data.month} className="flex items-end gap-2">
                  <div className="text-sm text-white/60 w-12">{data.month}</div>
                  <div className="flex-1 flex gap-2">
                    <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${data.readings / 15 * 100}%`
                    }}
                    transition={{
                      delay: 0.4 + index * 0.1,
                      duration: 0.8
                    }}
                    className="h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-end pr-2">

                      <span className="text-xs text-white font-semibold">
                        {data.readings}
                      </span>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-400 to-blue-600"></div>
                  <span className="text-white/70">Readings</span>
                </div>
              </div>
            </div>
          </SpaceCard>
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
            delay: 0.4
          }}>

          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Your Top Numbers
          </h2>
          <SpaceCard variant="premium" className="p-6">
            <div className="space-y-6">
              {topNumbers.map((item, index) =>
              <motion.div
                key={item.number}
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
                className="flex items-center gap-4">

                  <CrystalNumerologyCube
                  number={item.number}
                  size="sm"
                  color="cyan" />

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">
                        {item.meaning}
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {item.frequency}x
                      </span>
                    </div>
                    <div className="h-2 bg-[#0a1628]/60 rounded-full overflow-hidden">
                      <motion.div
                      initial={{
                        width: 0
                      }}
                      animate={{
                        width: `${item.frequency / 23 * 100}%`
                      }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        duration: 0.8
                      }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" />

                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </SpaceCard>
        </motion.div>
      </div>

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
          Recent Activity
        </h2>
        <SpaceCard variant="default" className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) =>
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.6 + index * 0.1
              }}
              className="flex items-center gap-4 p-4 bg-[#0a1628]/40 rounded-xl">

                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'reading' ? 'bg-cyan-500/20 text-cyan-400' : activity.type === 'compatibility' ? 'bg-pink-500/20 text-pink-400' : activity.type === 'chart' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>

                  <ActivityIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-sm text-white/60">{activity.date}</p>
                </div>
              </motion.div>
            )}
          </div>
        </SpaceCard>
      </motion.div>
    </CosmicPageLayout>);

}