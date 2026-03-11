import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, StarIcon, AlertCircleIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
export function AuspiciousDates() {
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const dates = [
  {
    date: 'Jan 5, 2025',
    day: 'Sunday',
    rating: 9,
    energy: 'New Beginnings',
    description:
    'Perfect day for starting new projects, launching businesses, or making major life changes.',
    activities: [
    'Start new projects',
    'Make important decisions',
    'Sign contracts'],

    avoid: ['Ending relationships', 'Quitting jobs'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    date: 'Jan 12, 2025',
    day: 'Sunday',
    rating: 8,
    energy: 'Love & Relationships',
    description:
    'Excellent energy for romance, proposals, weddings, and deepening connections.',
    activities: ['Propose marriage', 'Plan weddings', 'First dates'],
    avoid: ['Confrontations', 'Breaking up'],
    color: 'from-pink-500 to-rose-600'
  },
  {
    date: 'Jan 18, 2025',
    day: 'Saturday',
    rating: 7,
    energy: 'Financial Growth',
    description:
    'Strong day for investments, negotiations, and financial planning.',
    activities: ['Invest money', 'Negotiate deals', 'Open accounts'],
    avoid: ['Impulsive purchases', 'Lending money'],
    color: 'from-yellow-500 to-orange-600'
  },
  {
    date: 'Jan 23, 2025',
    day: 'Thursday',
    rating: 6,
    energy: 'Caution Advised',
    description:
    'A day to proceed carefully. Good for reflection and planning, not major actions.',
    activities: ['Plan and strategize', 'Reflect and meditate', 'Research'],
    avoid: ['Major decisions', 'Starting new ventures', 'Confrontations'],
    color: 'from-orange-500 to-red-600'
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Auspicious Dates
            </h1>
            <p className="text-white/70">
              Plan your important events with cosmic timing
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

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            Understanding Auspicious Dates
          </h2>
          <p className="text-white/70 leading-relaxed">
            Auspicious dates are determined by numerological calculations that
            align cosmic energies with your personal numbers. These dates offer
            optimal timing for important life events, decisions, and new
            beginnings.
          </p>
        </SpaceCard>
      </motion.div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white">
          {selectedMonth}
        </h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors">

          <option>January 2025</option>
          <option>February 2025</option>
          <option>March 2025</option>
        </select>
      </div>

      <div className="space-y-6">
        {dates.map((date, index) =>
        <motion.div
          key={date.date}
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
          }}>

            <SpaceCard variant="default" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-1">
                    {date.date}
                  </h3>
                  <p className="text-white/60">{date.day}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(10)].map((_, i) =>
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < date.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />

                  )}
                  </div>
                  <span className="text-2xl font-bold text-cyan-400">
                    {date.rating}/10
                  </span>
                </div>
              </div>

              <div
              className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${date.color} bg-opacity-20 border border-white/20 mb-4`}>

                <span className="text-sm font-semibold text-white">
                  {date.energy}
                </span>
              </div>

              <p className="text-white/80 leading-relaxed mb-6">
                {date.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-3">
                    <StarIcon className="w-4 h-4" />
                    Recommended Activities
                  </h4>
                  <ul className="space-y-2">
                    {date.activities.map((activity, i) =>
                  <li
                    key={i}
                    className="text-sm text-white/70 flex items-start gap-2">

                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{activity}</span>
                      </li>
                  )}
                  </ul>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-3">
                    <AlertCircleIcon className="w-4 h-4" />
                    Best to Avoid
                  </h4>
                  <ul className="space-y-2">
                    {date.avoid.map((item, i) =>
                  <li
                    key={i}
                    className="text-sm text-white/70 flex items-start gap-2">

                        <span className="text-red-400 mt-0.5">✗</span>
                        <span>{item}</span>
                      </li>
                  )}
                  </ul>
                </div>
              </div>
            </SpaceCard>
          </motion.div>
        )}
      </div>
    </CosmicPageLayout>);

}