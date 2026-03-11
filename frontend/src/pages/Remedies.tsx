import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  GemIcon,
  SparklesIcon,
  HeartIcon,
  LeafIcon,
  SunIcon,
  MoonIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CosmicTooltip } from '../components/CosmicTooltip';
export function Remedies() {
  const remedyCategories = [
  {
    icon: <GemIcon className="w-6 h-6" />,
    title: 'Crystals & Gemstones',
    description: 'Harness the power of crystals aligned with your numbers',
    color: 'from-purple-500 to-indigo-600',
    remedies: [
    {
      name: 'Amethyst',
      benefit: 'Enhances spiritual awareness and intuition',
      number: 7
    },
    {
      name: 'Citrine',
      benefit: 'Attracts abundance and creativity',
      number: 3
    },
    {
      name: 'Rose Quartz',
      benefit: 'Opens heart chakra and promotes love',
      number: 6
    }]

  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'Colors & Vibrations',
    description: 'Align your energy with cosmic color frequencies',
    color: 'from-cyan-400 to-blue-600',
    remedies: [
    {
      name: 'Violet & Purple',
      benefit: 'Spiritual growth and wisdom',
      number: 7
    },
    {
      name: 'Yellow & Gold',
      benefit: 'Joy, creativity, and self-expression',
      number: 3
    },
    {
      name: 'Blue & Silver',
      benefit: 'Communication and clarity',
      number: 5
    }]

  },
  {
    icon: <LeafIcon className="w-6 h-6" />,
    title: 'Herbs & Aromatherapy',
    description: 'Natural remedies for balancing your energy',
    color: 'from-green-500 to-emerald-600',
    remedies: [
    {
      name: 'Lavender',
      benefit: 'Calms mind and enhances meditation',
      number: 7
    },
    {
      name: 'Rosemary',
      benefit: 'Boosts mental clarity and memory',
      number: 5
    },
    {
      name: 'Jasmine',
      benefit: 'Promotes love and emotional healing',
      number: 6
    }]

  },
  {
    icon: <HeartIcon className="w-6 h-6" />,
    title: 'Mantras & Affirmations',
    description: 'Powerful words to align with your cosmic purpose',
    color: 'from-pink-500 to-rose-600',
    remedies: [
    {
      name: 'Om Shanti',
      benefit: 'Peace and spiritual connection',
      number: 7
    },
    {
      name: 'I Am Creative',
      benefit: 'Unlocks creative potential',
      number: 3
    },
    {
      name: 'I Am Free',
      benefit: 'Embraces change and adventure',
      number: 5
    }]

  }];

  const dailyPractices = [
  {
    icon: <SunIcon className="w-6 h-6" />,
    title: 'Morning Ritual',
    time: '6:00 AM - 8:00 AM',
    practice:
    'Meditate on your Life Path number. Visualize its energy flowing through you.',
    color: 'from-yellow-400 to-orange-600'
  },
  {
    icon: <MoonIcon className="w-6 h-6" />,
    title: 'Evening Reflection',
    time: '8:00 PM - 10:00 PM',
    practice:
    'Journal about how your numbers manifested today. Express gratitude.',
    color: 'from-indigo-500 to-purple-600'
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <GemIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Cosmic Remedies
            </h1>
            <p className="text-white/70">Align your energy with the universe</p>
          </div>
        </div>
      </motion.div>

      {/* Introduction */}
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
          <p className="text-lg text-white/80 leading-relaxed">
            Based on your Life Path number 7, these remedies are specifically
            chosen to enhance your spiritual journey, deepen your intuition, and
            help you maintain balance in your life. Incorporate these practices
            to align with your cosmic purpose.
          </p>
        </SpaceCard>
      </motion.div>

      {/* Remedy Categories */}
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
          Remedy Categories
        </h2>
        <div className="space-y-6">
          {remedyCategories.map((category, index) =>
          <motion.div
            key={category.title}
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
            }}>

              <SpaceCard variant="default" className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>

                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">
                        {category.title}
                      </h3>
                      <CosmicTooltip content={category.description} icon />
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {category.remedies.map((remedy) =>
                <div
                  key={remedy.name}
                  className="p-4 bg-[#0a1628]/40 rounded-xl border border-cyan-500/10">

                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">
                          {remedy.name}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-cyan-500/20 rounded-full text-cyan-400">
                          #{remedy.number}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{remedy.benefit}</p>
                    </div>
                )}
                </div>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Daily Practices */}
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

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Daily Practices
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {dailyPractices.map((practice, index) =>
          <motion.div
            key={practice.title}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.7 + index * 0.1
            }}
            whileHover={{
              y: -4
            }}>

              <SpaceCard variant="default" className="p-6 h-full">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${practice.color} flex items-center justify-center text-white mb-4 shadow-lg`}>

                  {practice.icon}
                </div>
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2">
                  {practice.title}
                </h3>
                <p className="text-sm text-cyan-400 mb-3">{practice.time}</p>
                <p className="text-white/70 leading-relaxed">
                  {practice.practice}
                </p>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CosmicPageLayout>);

}