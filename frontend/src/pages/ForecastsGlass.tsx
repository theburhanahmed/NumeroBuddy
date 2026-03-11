import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  TrendingUpIcon,
  CalendarIcon,
  AlertCircleIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
export function ForecastsGlass() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'year' | 'month' | 'day'>('year');
  const personalYear = {
    number: 5,
    theme: 'Change and Freedom',
    description:
    'This is a year of significant change, freedom, and adventure. Expect unexpected opportunities and the need to adapt quickly to new circumstances.',
    months: [
    {
      month: 'January',
      number: 6,
      theme: 'Responsibility'
    },
    {
      month: 'February',
      number: 7,
      theme: 'Introspection'
    },
    {
      month: 'March',
      number: 8,
      theme: 'Achievement'
    },
    {
      month: 'April',
      number: 9,
      theme: 'Completion'
    },
    {
      month: 'May',
      number: 1,
      theme: 'New Beginnings'
    },
    {
      month: 'June',
      number: 2,
      theme: 'Partnership'
    }]

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
              Personal Forecasts
            </h1>
            <p className="text-xl text-white/70">
              Navigate your future with cosmic cycle insights
            </p>
          </motion.div>

          {/* Tabs */}
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
            className="flex justify-center gap-4 mb-12">

            {(['year', 'month', 'day'] as const).map((tab) =>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${activeTab === tab ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-[#1a2942]/40 border border-cyan-500/20 text-white/70 hover:text-white'}`}>

                Personal {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )}
          </motion.div>

          {/* Personal Year */}
          {activeTab === 'year' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            key="year">

              {/* Year Number */}
              <div className="text-center mb-12">
                <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30 backdrop-blur-xl">
                  <div className="text-sm text-white/60 mb-2">
                    2024 Personal Year
                  </div>
                  <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 mb-2">
                    {personalYear.number}
                  </div>
                  <div className="text-xl text-white font-serif">
                    {personalYear.theme}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 mb-8">
                <h2 className="text-2xl font-serif text-white mb-4">
                  Year Overview
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {personalYear.description}
                </p>
              </div>

              {/* Monthly Breakdown */}
              <div>
                <h2 className="text-2xl font-serif text-white mb-6">
                  Monthly Cycles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {personalYear.months.map((month, index) =>
                <motion.div
                  key={month.month}
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.3 + index * 0.05
                  }}
                  className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">

                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          {month.month}
                        </h3>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {month.number}
                        </div>
                      </div>
                      <p className="text-white/70">{month.theme}</p>
                    </motion.div>
                )}
                </div>
              </div>
            </motion.div>
          }

          {/* Personal Month */}
          {activeTab === 'month' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            key="month"
            className="text-center p-12 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

              <CalendarIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-serif text-white mb-4">
                December 2024
              </h2>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-600 mb-4">
                3
              </div>
              <p className="text-xl text-white/80 mb-6">
                Month of Creativity and Expression
              </p>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
                This month brings opportunities for creative expression and
                social connection. Focus on communication, artistic pursuits,
                and enjoying life's pleasures.
              </p>
            </motion.div>
          }

          {/* Personal Day */}
          {activeTab === 'day' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            key="day"
            className="text-center p-12 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

              <TrendingUpIcon className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-serif text-white mb-4">Today</h2>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-600 mb-4">
                7
              </div>
              <p className="text-xl text-white/80 mb-6">Day of Introspection</p>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
                Today is ideal for reflection, meditation, and inner work. Trust
                your intuition and seek deeper understanding of yourself and
                your path.
              </p>
              <button
              onClick={() => navigate('/daily-readings')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">

                View Full Daily Reading
              </button>
            </motion.div>
          }

          {/* Info */}
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
            }}
            className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-start gap-4">

            <AlertCircleIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-2">
                Understanding Personal Cycles
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Personal cycles help you understand the energetic themes
                influencing different periods of your life. Use these insights
                to make informed decisions and align your actions with cosmic
                rhythms.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}