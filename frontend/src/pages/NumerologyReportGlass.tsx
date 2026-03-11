import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  DownloadIcon,
  PrinterIcon,
  ShareIcon,
  ChevronDownIcon,
  ChevronUpIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
export function NumerologyReportGlass() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'life-path'
  );
  const reportSections = [
  {
    id: 'life-path',
    title: 'Life Path Number',
    number: 7,
    color: 'from-purple-500 to-indigo-600',
    summary:
    'The Seeker - Your path is one of spiritual wisdom and inner truth',
    content:
    'As a Life Path 7, you are a natural seeker of truth and wisdom. Your analytical mind and spiritual depth set you apart, making you a profound thinker who questions the mysteries of life. You possess exceptional intuition and a desire to understand the deeper meaning behind everything.'
  },
  {
    id: 'destiny',
    title: 'Destiny Number',
    number: 3,
    color: 'from-blue-500 to-cyan-600',
    summary:
    'The Creative Communicator - Your ultimate life goal involves expression',
    content:
    "Your Destiny Number 3 reveals that your life's purpose is centered around creative expression and communication. You are meant to inspire others through your words, art, or presence. Your natural charisma and optimism are gifts to share with the world."
  },
  {
    id: 'soul-urge',
    title: 'Soul Urge Number',
    number: 5,
    color: 'from-cyan-500 to-blue-600',
    summary:
    'The Freedom Seeker - Your inner desires crave adventure and change',
    content:
    'Deep within, you crave freedom, adventure, and variety. Your Soul Urge Number 5 shows that you are motivated by experiences, travel, and the excitement of the unknown. You need constant stimulation and the ability to explore life on your own terms.'
  },
  {
    id: 'personality',
    title: 'Personality Number',
    number: 9,
    color: 'from-pink-500 to-rose-600',
    summary: 'The Humanitarian - Others see you as compassionate and wise',
    content:
    'Your Personality Number 9 means others perceive you as compassionate, wise, and humanitarian. You project an aura of understanding and acceptance. People are drawn to your warmth and your ability to see the bigger picture in any situation.'
  }];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
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

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-[#1a2942]/40 text-white/60 hover:text-white transition-all">
              <ShareIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-[#1a2942]/40 text-white/60 hover:text-white transition-all">
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </motion.nav>

        <div className="max-w-4xl mx-auto px-8 py-12">
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
              Complete Numerology Report
            </h1>
            <p className="text-xl text-white/70 mb-2">Sarah Chen</p>
            <p className="text-white/60">Born: July 15, 1990</p>
          </motion.div>

          {/* Summary Card */}
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
            className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 backdrop-blur-xl mb-12">

            <h2 className="text-2xl font-serif text-white mb-6 text-center">
              Your Core Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {reportSections.map((section, index) =>
              <motion.div
                key={section.id}
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: 0.2 + index * 0.1
                }}
                className="text-center">

                  <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg`}>

                    {section.number}
                  </div>
                  <div className="text-sm text-white font-semibold">
                    {section.title.split(' ')[0]}
                  </div>
                  <div className="text-xs text-white/60">
                    {section.title.split(' ').slice(1).join(' ')}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {reportSections.map((section, index) =>
            <motion.div
              key={section.id}
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
              className="rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 overflow-hidden">

                {/* Section Header */}
                <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-cyan-500/5 transition-colors">

                  <div className="flex items-center gap-4">
                    <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>

                      {section.number}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-serif text-white">
                        {section.title}
                      </h3>
                      <p className="text-sm text-white/60">{section.summary}</p>
                    </div>
                  </div>
                  {expandedSection === section.id ?
                <ChevronUpIcon className="w-6 h-6 text-white/60" /> :

                <ChevronDownIcon className="w-6 h-6 text-white/60" />
                }
                </button>

                {/* Section Content */}
                {expandedSection === section.id &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                exit={{
                  opacity: 0,
                  height: 0
                }}
                className="px-6 pb-6">

                    <div className="pt-4 border-t border-cyan-500/10">
                      <p className="text-white/80 leading-relaxed mb-6">
                        {section.content}
                      </p>
                      <button
                    onClick={() => navigate('/life-path')}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm hover:shadow-lg hover:shadow-cyan-500/30 transition-all">

                        View Detailed Analysis
                      </button>
                    </div>
                  </motion.div>
              }
              </motion.div>
            )}
          </div>

          {/* Additional Insights */}
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
              delay: 0.7
            }}
            className="mt-12 p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

            <h2 className="text-2xl font-serif text-white mb-6">
              Key Insights
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SparklesIcon className="w-3 h-3 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Your Greatest Strength
                  </h4>
                  <p className="text-white/70 text-sm">
                    Deep intuition combined with analytical thinking allows you
                    to understand complex situations others miss.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SparklesIcon className="w-3 h-3 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Area for Growth
                  </h4>
                  <p className="text-white/70 text-sm">
                    Learning to balance your need for solitude with meaningful
                    social connections will enhance your life journey.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SparklesIcon className="w-3 h-3 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Life Purpose
                  </h4>
                  <p className="text-white/70 text-sm">
                    You are here to seek truth, share wisdom, and help others
                    understand the deeper meaning of their experiences.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
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
              delay: 0.8
            }}
            className="mt-12 text-center space-y-4">

            <p className="text-white/70">
              Want to dive deeper into your numbers?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/birth-chart')}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">

                View Birth Chart
              </button>
              <button
                onClick={() => navigate('/compatibility')}
                className="px-8 py-3 rounded-full border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all">

                Check Compatibility
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}