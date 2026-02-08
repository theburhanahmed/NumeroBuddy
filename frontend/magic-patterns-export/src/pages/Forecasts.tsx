import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  StarIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
export function Forecasts() {
  const periods = [
  {
    title: 'This Week',
    date: 'Dec 18-24, 2024',
    energy: 8,
    focus: 'Career & Ambition',
    description:
    'Strong professional energy this week. Perfect time for important meetings and presentations.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'This Month',
    date: 'December 2024',
    energy: 7,
    focus: 'Relationships & Growth',
    description:
    'Month of emotional connections and personal development. Focus on meaningful relationships.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    title: 'This Year',
    date: '2024',
    energy: 9,
    focus: 'Transformation & Success',
    description:
    'A powerful year of transformation. Major life changes bring success and fulfillment.',
    color: 'from-purple-500 to-indigo-600'
  }];

  const keyDates = [
  {
    date: 'Dec 22',
    event: 'Career Breakthrough',
    type: 'opportunity'
  },
  {
    date: 'Dec 28',
    event: 'Important Decision',
    type: 'challenge'
  },
  {
    date: 'Jan 5',
    event: 'New Beginning',
    type: 'opportunity'
  },
  {
    date: 'Jan 12',
    event: 'Relationship Milestone',
    type: 'love'
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

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Cosmic Forecasts
            </h1>
            <p className="text-white/70">
              Your personalized timeline predictions
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6 mb-8">
        {periods.map((period, index) =>
        <motion.div
          key={period.title}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.1 + index * 0.1
          }}>

            <SpaceCard variant="premium" className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-1">
                    {period.title}
                  </h2>
                  <p className="text-cyan-400">{period.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-400">
                    {period.energy}
                  </div>
                  <div className="text-xs text-white/60">Energy Level</div>
                </div>
              </div>

              <div
              className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${period.color} bg-opacity-20 border border-white/20 mb-4`}>

                <span className="text-sm font-semibold text-white">
                  Focus: {period.focus}
                </span>
              </div>

              <p className="text-white/80 leading-relaxed">
                {period.description}
              </p>
            </SpaceCard>
          </motion.div>
        )}
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
          delay: 0.4
        }}>

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Key Dates Ahead
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {keyDates.map((item, index) =>
          <motion.div
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
            }}>

              <SpaceCard variant="default" className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{item.event}</p>
                    <span
                    className={`text-xs px-2 py-1 rounded-full ${item.type === 'opportunity' ? 'bg-green-500/20 text-green-400' : item.type === 'challenge' ? 'bg-orange-500/20 text-orange-400' : 'bg-pink-500/20 text-pink-400'}`}>

                      {item.type}
                    </span>
                  </div>
                </div>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CosmicPageLayout>);

}