import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
  TrendingUpIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CosmicTooltip } from '../components/CosmicTooltip';
export function DailyReadings() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const readings = [
  {
    icon: <SunIcon className="w-6 h-6" />,
    title: 'Daily Energy',
    content:
    "Today's cosmic energy is vibrant and full of potential. The number 7 is strong, bringing opportunities for introspection and spiritual growth.",
    color: 'from-yellow-400 to-orange-600',
    score: 8
  },
  {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    title: 'Career & Success',
    content:
    'Professional matters are favored today. Your natural leadership qualities will shine, making it an excellent day for important meetings or presentations.',
    color: 'from-green-500 to-emerald-600',
    score: 9
  },
  {
    icon: <StarIcon className="w-6 h-6" />,
    title: 'Love & Relationships',
    content:
    'Emotional connections deepen today. Express your feelings openly and listen with your heart. A meaningful conversation could strengthen your bonds.',
    color: 'from-pink-500 to-rose-600',
    score: 7
  },
  {
    icon: <MoonIcon className="w-6 h-6" />,
    title: 'Personal Growth',
    content:
    'Take time for self-reflection and meditation. The universe is guiding you toward important realizations about your life path and purpose.',
    color: 'from-purple-500 to-indigo-600',
    score: 10
  }];

  const luckyNumbers = [7, 14, 21, 28];
  const luckyColors = ['Cyan', 'Silver', 'White'];
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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Daily Reading
            </h1>
            <p className="text-white/70">{today}</p>
          </div>
        </div>
      </motion.div>

      {/* Today's Overview */}
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
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            Today's Cosmic Overview
          </h2>
          <p className="text-lg text-white/80 leading-relaxed mb-6">
            The universe aligns in your favor today. With the number 7 as your
            daily vibration, this is a powerful day for spiritual insights and
            inner wisdom. Trust your intuition and pay attention to
            synchronicities around you.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-white">Lucky Numbers</h3>
                <CosmicTooltip
                  content="Use these numbers for important decisions today"
                  icon />

              </div>
              <div className="flex gap-2">
                {luckyNumbers.map((num) =>
                <div
                  key={num}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">

                    {num}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-white">Lucky Colors</h3>
                <CosmicTooltip
                  content="Wear or surround yourself with these colors"
                  icon />

              </div>
              <div className="flex gap-2">
                {luckyColors.map((color) =>
                <div
                  key={color}
                  className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20">

                    <span className="text-sm font-medium text-white">
                      {color}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SpaceCard>
      </motion.div>

      {/* Detailed Readings */}
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

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Detailed Readings
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {readings.map((reading, index) =>
          <motion.div
            key={reading.title}
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
                <div className="flex items-start justify-between mb-4">
                  <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${reading.color} flex items-center justify-center text-white shadow-lg`}>

                    {reading.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-cyan-400">
                      {reading.score}
                    </span>
                    <span className="text-sm text-white/60">/10</span>
                  </div>
                </div>
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                  {reading.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {reading.content}
                </p>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CosmicPageLayout>);

}