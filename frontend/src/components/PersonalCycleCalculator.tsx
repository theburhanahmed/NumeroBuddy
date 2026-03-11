import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, TrendingUpIcon, SunIcon, MoonIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
import { numerologyAPI } from '../lib/numerology-api';
interface CycleInfo {
  number: number;
  name: string;
  theme: string;
  energy: string;
  advice: string;
  color: string;
}
const cycleData: {
  [key: number]: CycleInfo;
} = {
  1: {
    number: 1,
    name: 'New Beginnings',
    theme: 'Fresh starts and independence',
    energy: 'Pioneering, assertive, confident',
    advice: 'Take initiative. Start new projects. Be bold and independent.',
    color: 'from-red-500 to-rose-600'
  },
  2: {
    number: 2,
    name: 'Cooperation',
    theme: 'Partnerships and patience',
    energy: 'Diplomatic, sensitive, harmonious',
    advice:
    'Focus on relationships. Practice patience. Seek balance and cooperation.',
    color: 'from-orange-500 to-amber-600'
  },
  3: {
    number: 3,
    name: 'Creative Expression',
    theme: 'Joy and self-expression',
    energy: 'Optimistic, creative, social',
    advice: 'Express yourself. Socialize. Embrace creativity and joy.',
    color: 'from-yellow-500 to-orange-600'
  },
  4: {
    number: 4,
    name: 'Foundation Building',
    theme: 'Hard work and stability',
    energy: 'Practical, disciplined, organized',
    advice: 'Build solid foundations. Work hard. Focus on practical matters.',
    color: 'from-green-500 to-emerald-600'
  },
  5: {
    number: 5,
    name: 'Change & Freedom',
    theme: 'Adventure and transformation',
    energy: 'Dynamic, versatile, adventurous',
    advice: 'Embrace change. Seek adventure. Be flexible and adaptable.',
    color: 'from-cyan-500 to-blue-600'
  },
  6: {
    number: 6,
    name: 'Responsibility',
    theme: 'Love and service',
    energy: 'Nurturing, responsible, harmonious',
    advice: 'Focus on family. Take responsibility. Nurture relationships.',
    color: 'from-blue-500 to-indigo-600'
  },
  7: {
    number: 7,
    name: 'Spiritual Growth',
    theme: 'Inner wisdom and reflection',
    energy: 'Introspective, spiritual, analytical',
    advice: 'Seek inner truth. Meditate. Trust your intuition.',
    color: 'from-purple-500 to-violet-600'
  },
  8: {
    number: 8,
    name: 'Power & Success',
    theme: 'Achievement and abundance',
    energy: 'Ambitious, powerful, successful',
    advice: 'Pursue goals. Manage resources. Embrace your power.',
    color: 'from-pink-500 to-rose-600'
  },
  9: {
    number: 9,
    name: 'Completion',
    theme: 'Endings and transformation',
    energy: 'Compassionate, wise, humanitarian',
    advice: 'Let go of the past. Complete projects. Prepare for new cycles.',
    color: 'from-indigo-500 to-purple-600'
  }
};
export function PersonalCycleCalculator() {
  const [currentDate] = useState(new Date());
  const [personalYear, setPersonalYear] = useState<number | null>(null);
  const [personalMonth, setPersonalMonth] = useState<number | null>(null);
  const [personalDay, setPersonalDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCycles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await numerologyAPI.getNumerologyProfile();
        if (profile) {
          setPersonalYear(profile.personal_year_number);
          setPersonalMonth(profile.personal_month_number);
        }
        const isoDate = currentDate.toISOString().split('T')[0];
        const daily = await numerologyAPI.getDailyReading({ date: isoDate });
        if (daily && typeof daily.personal_day_number === 'number') {
          setPersonalDay(daily.personal_day_number);
        }
      } catch (err: any) {
        setError(err?.message || 'Unable to load personal cycles.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycles();
  }, [currentDate]);
  return (
    <div className="space-y-6">
      {/* Current Date Display */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <SpaceCard variant="premium" className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-white/60 text-sm">Today's Date</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </SpaceCard>
      </motion.div>

      {/* Personal Year */}
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
        }}>

        <SpaceCard variant="premium" className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <TrendingUpIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">
                Personal Year {personalYear ?? '–'}
              </h3>
              <p className="text-sm text-white/60">
                Your annual cycle theme
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Number Display */}
            <div className="flex items-center justify-center">
              <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                transition={{
                  delay: 0.3,
                  type: 'spring',
                  stiffness: 200
                }}
                className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${
                  personalYear ? cycleData[personalYear].color : 'from-slate-500 to-slate-700'
                } flex items-center justify-center shadow-2xl`}>

                <span className="text-6xl font-bold text-white">
                  {personalYear ?? '–'}
                </span>
              </motion.div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-1">
                  Theme
                </h4>
                  <p className="text-white">
                    {personalYear ? cycleData[personalYear].theme : 'Your personal year will appear here.'}
                  </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-1">
                  Energy
                </h4>
                  <p className="text-white/70">
                    {personalYear ? cycleData[personalYear].energy : 'We will show your energy once available.'}
                  </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-1">
                  Advice
                </h4>
                  <p className="text-white/70">
                    {personalYear ? cycleData[personalYear].advice : 'Start by completing your numerology profile.'}
                  </p>
              </div>
            </div>
          </div>
        </SpaceCard>
      </motion.div>

      {/* Personal Month & Day */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Month */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            delay: 0.2
          }}>

          <SpaceCard variant="default" className="p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                <MoonIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Personal Month {personalMonth ?? '–'}
                </h3>
                <p className="text-xs text-white/60">Monthly focus</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-purple-400 mb-1">
                  Theme
                </h4>
                <p className="text-sm text-white/80">
                  {personalMonth ? cycleData[personalMonth].theme : 'Your monthly focus will appear here.'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-purple-400 mb-1">
                  Advice
                </h4>
                <p className="text-sm text-white/70">
                  {personalMonth ? cycleData[personalMonth].advice : 'Check back after your profile is calculated.'}
                </p>
              </div>
            </div>
          </SpaceCard>
        </motion.div>

        {/* Personal Day */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            delay: 0.2
          }}>

          <SpaceCard variant="default" className="p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                <SunIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Personal Day {personalDay ?? '–'}
                </h3>
                <p className="text-xs text-white/60">Today's energy</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-amber-400 mb-1">
                  Theme
                </h4>
                <p className="text-sm text-white/80">
                  {personalDay ? cycleData[personalDay].theme : 'Your daily energy will appear here.'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-amber-400 mb-1">
                  Advice
                </h4>
                <p className="text-sm text-white/70">
                  {personalDay ? cycleData[personalDay].advice : 'We will show personalized advice once available.'}
                </p>
              </div>
            </div>
          </SpaceCard>
        </motion.div>
      </div>

      {/* Timeline View */}
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

        <SpaceCard variant="premium" className="p-6">
          <h3 className="text-lg font-['Playfair_Display'] font-bold text-white mb-6">
            Your 9-Year Cycle
          </h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-600" />

            {/* Year Markers */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((year, index) => {
                const isCurrent = year === personalYear;
                const isPast = year < personalYear;
                return (
                  <motion.div
                    key={year}
                    initial={{
                      opacity: 0,
                      x: -20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: 0.4 + index * 0.05
                    }}
                    className="relative flex items-center gap-4">

                    {/* Marker */}
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold z-10 transition-all ${isCurrent ? `bg-gradient-to-br ${cycleData[year].color} shadow-2xl scale-110` : isPast ? 'bg-[#1a2942]/60 border border-cyan-500/20' : 'bg-[#1a2942]/40 border border-cyan-500/10'}`}>

                      {year}
                    </div>

                    {/* Info */}
                    <div
                      className={`flex-1 transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-60'}`}>

                      <h4
                        className={`font-semibold ${isCurrent ? 'text-white' : 'text-white/70'}`}>

                        Year {year}: {cycleData[year].name}
                      </h4>
                      <p className="text-sm text-white/60">
                        {cycleData[year].theme}
                      </p>
                    </div>

                    {/* Current Indicator */}
                    {isCurrent &&
                    <motion.div
                      initial={{
                        scale: 0
                      }}
                      animate={{
                        scale: 1
                      }}
                      className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold">

                        Current
                      </motion.div>
                    }
                  </motion.div>);

              })}
            </div>
          </div>
        </SpaceCard>
      </motion.div>
    </div>);

}