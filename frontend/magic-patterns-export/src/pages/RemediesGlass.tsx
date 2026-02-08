import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  GemIcon,
  PaletteIcon,
  MusicIcon,
  SunIcon,
  CheckCircleIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
export function RemediesGlass() {
  const navigate = useNavigate();
  const [completedRemedies, setCompletedRemedies] = useState<string[]>([]);
  const remedyCategories = [
  {
    id: 'gemstones',
    icon: <GemIcon className="w-8 h-8" />,
    title: 'Gemstones',
    color: 'from-purple-500 to-indigo-600',
    items: [
    {
      name: 'Amethyst',
      benefit: 'Enhances spiritual awareness and intuition',
      howTo: 'Wear as jewelry or keep in meditation space'
    },
    {
      name: 'Clear Quartz',
      benefit: 'Amplifies energy and clarity of thought',
      howTo: 'Place on desk or carry in pocket'
    }]

  },
  {
    id: 'colors',
    icon: <PaletteIcon className="w-8 h-8" />,
    title: 'Color Therapy',
    color: 'from-blue-500 to-cyan-600',
    items: [
    {
      name: 'Purple',
      benefit: 'Supports spiritual growth and wisdom',
      howTo: 'Wear purple clothing or use in home decor'
    },
    {
      name: 'Silver',
      benefit: 'Enhances intuition and emotional balance',
      howTo: 'Incorporate silver accessories or accents'
    }]

  },
  {
    id: 'mantras',
    icon: <MusicIcon className="w-8 h-8" />,
    title: 'Mantras & Affirmations',
    color: 'from-cyan-500 to-blue-600',
    items: [
    {
      name: 'Morning Mantra',
      benefit: 'Sets positive intention for the day',
      howTo: 'Recite upon waking: "I trust my inner wisdom"'
    },
    {
      name: 'Evening Affirmation',
      benefit: 'Promotes peaceful rest and reflection',
      howTo: 'Say before sleep: "I am grateful for today\'s lessons"'
    }]

  },
  {
    id: 'lifestyle',
    icon: <SunIcon className="w-8 h-8" />,
    title: 'Lifestyle Adjustments',
    color: 'from-green-500 to-emerald-600',
    items: [
    {
      name: 'Daily Meditation',
      benefit: 'Strengthens connection to inner guidance',
      howTo: '15 minutes each morning in quiet space'
    },
    {
      name: 'Nature Walks',
      benefit: 'Grounds energy and provides clarity',
      howTo: 'Walk in nature 3x per week, mindfully'
    }]

  }];

  const toggleRemedy = (categoryId: string, itemName: string) => {
    const key = `${categoryId}-${itemName}`;
    if (completedRemedies.includes(key)) {
      setCompletedRemedies(completedRemedies.filter((r) => r !== key));
    } else {
      setCompletedRemedies([...completedRemedies, key]);
    }
  };
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        {/* Top Navigation */}
        <motion.nav
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/dashboard')}>

            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              NUMEROBUDDY
            </span>
          </div>
        </motion.nav>

        <div className="max-w-5xl mx-auto px-8 py-12">
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
            className="text-center mb-12">

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Personalized Remedies
            </h1>
            <p className="text-xl text-white/70">
              Enhance your cosmic energy with these tailored recommendations
            </p>
          </motion.div>

          {/* Progress */}
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
            className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/30 backdrop-blur-xl mb-12">

            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Your Progress</span>
              <span className="text-green-400 font-semibold">
                {completedRemedies.length} / 8 completed
              </span>
            </div>
            <div className="w-full h-2 bg-[#0a1628]/60 rounded-full overflow-hidden">
              <motion.div
                initial={{
                  width: 0
                }}
                animate={{
                  width: `${completedRemedies.length / 8 * 100}%`
                }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                transition={{
                  duration: 0.5
                }} />

            </div>
          </motion.div>

          {/* Remedy Categories */}
          <div className="space-y-8">
            {remedyCategories.map((category, index) =>
            <motion.div
              key={category.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2 + index * 0.1
              }}
              className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}>

                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-serif text-white">
                    {category.title}
                  </h2>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => {
                  const isCompleted = completedRemedies.includes(
                    `${category.id}-${item.name}`
                  );
                  return (
                    <motion.div
                      key={itemIndex}
                      initial={{
                        opacity: 0,
                        x: -20
                      }}
                      animate={{
                        opacity: 1,
                        x: 0
                      }}
                      transition={{
                        delay: 0.3 + index * 0.1 + itemIndex * 0.05
                      }}
                      className={`p-6 rounded-2xl border transition-all ${isCompleted ? 'bg-green-500/10 border-green-400/30' : 'bg-[#0a1628]/40 border-cyan-500/10'}`}>

                        <div className="flex items-start gap-4">
                          <button
                          onClick={() => toggleRemedy(category.id, item.name)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${isCompleted ? 'bg-green-500 border-green-500' : 'border-cyan-500/30 hover:border-cyan-500/60'}`}>

                            {isCompleted &&
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                          }
                          </button>
                          <div className="flex-1">
                            <h3
                            className={`text-lg font-semibold mb-2 ${isCompleted ? 'text-green-400' : 'text-white'}`}>

                              {item.name}
                            </h3>
                            <p className="text-white/70 text-sm mb-3">
                              {item.benefit}
                            </p>
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-cyan-400 font-semibold mt-0.5">
                                HOW:
                              </span>
                              <p className="text-white/60 text-sm">
                                {item.howTo}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>);

                })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Tips */}
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
            }}
            className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-start gap-4">

            <SparklesIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-2">
                Tips for Success
              </h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Start with one or two remedies and build gradually</li>
                <li>• Consistency is more important than perfection</li>
                <li>
                  • Track your progress and notice subtle shifts in energy
                </li>
                <li>• Combine remedies for enhanced effects</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}