import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  CalendarIcon,
  BookmarkIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
import { numerologyAPI } from '../lib/numerology-api';

interface DailyReadingResponse {
  reading_date: string;
  personal_day_number: number;
  lucky_number?: number;
  lucky_numbers?: number[];
  lucky_color?: string;
  affirmation?: string;
  theme?: string;
  message?: string;
  guidance?: string[];
}

export function DailyReadingsGlass() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reading, setReading] = useState<DailyReadingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReading = async () => {
      setIsLoading(true);
      setError(null);
      setReading(null);
      try {
        const isoDate = selectedDate.toISOString().split('T')[0];
        const data = await numerologyAPI.getDailyReading({ date: isoDate });
        setReading(data as DailyReadingResponse);
      } catch (err: any) {
        setError(err?.message || 'Unable to load daily reading.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReading();
  }, [selectedDate]);

  const displayDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const luckyNumbers: number[] = reading?.lucky_numbers
    ? reading.lucky_numbers
    : reading?.lucky_number
    ? [reading.lucky_number]
    : [];
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
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
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-all ${isBookmarked ? 'bg-amber-500/20 text-amber-400' : 'bg-[#1a2942]/40 text-white/60 hover:text-white'}`}>

              <BookmarkIcon
                className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />

            </button>
            <button className="p-2 rounded-full bg-[#1a2942]/40 text-white/60 hover:text-white transition-all">
              <ShareIcon className="w-5 h-5" />
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
              Daily Reading
            </h1>
            <p className="text-xl text-white/70">
              Your personalized cosmic guidance for today
            </p>
          </motion.div>

          {/* Date Selector */}
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
            className="flex items-center justify-center gap-4 mb-12">

            <button
              onClick={() => changeDate(-1)}
              className="p-3 rounded-full bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">

              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>

            <div className="px-8 py-4 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold">{displayDate}</span>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-3 rounded-full bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">

              <ChevronRightIcon className="w-5 h-5 text-white" />
            </button>
          </motion.div>

          {/* Personal Day Number */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.2
            }}
            className="text-center mb-12">

            <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-400/30 backdrop-blur-xl">
              <div className="text-sm text-white/60 mb-2">
                Personal Day Number
              </div>
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-600 mb-2">
                {reading?.personal_day_number ?? '–'}
              </div>
              <div className="text-xl text-white font-serif">
                {reading?.theme || 'Your daily numerology insight will appear here.'}
              </div>
            </div>
          </motion.div>

          {/* Main Reading */}
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
            }}
            className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 mb-8">

            <h2 className="text-2xl font-serif text-white mb-4">
              Today's Message
            </h2>
            {isLoading && (
              <p className="text-white/60 leading-relaxed mb-6">
                Loading your daily reading...
              </p>
            )}
            {error && !isLoading && (
              <p className="text-red-400 leading-relaxed mb-6">{error}</p>
            )}
            {!isLoading && !error && (
              <p className="text-white/80 leading-relaxed mb-6">
                {reading?.message ||
                  'Once your numerology profile is ready, you will see a personalized daily message here.'}
              </p>
            )}

            <h3 className="text-xl font-serif text-white mb-4">
              Guidance for Today
            </h3>
            <ul className="space-y-3">
              {(reading?.guidance || [
                'Check back after your numerology profile is generated.',
              ]).map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <SparklesIcon className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Additional Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Lucky Numbers */}
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
              }}
              className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

              <h3 className="text-lg font-semibold text-white mb-4">
                Lucky Numbers
              </h3>
              <div className="flex flex-wrap gap-2">
                {luckyNumbers.length === 0 && (
                  <p className="text-sm text-white/60">
                    Lucky numbers will appear here once available.
                  </p>
                )}
                {luckyNumbers.map((num) => (
                  <div
                    key={num}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lucky Color */}
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
              className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

              <h3 className="text-lg font-semibold text-white mb-4">
                Lucky Color
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500 shadow-lg" />
                <span className="text-white font-semibold">
                  {reading?.lucky_color || 'Coming soon'}
                </span>
              </div>
            </motion.div>

            {/* Affirmation */}
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
              className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-600/10 border border-pink-400/30 backdrop-blur-xl md:col-span-1">

              <h3 className="text-lg font-semibold text-white mb-4">
                Affirmation
              </h3>
              <p className="text-white/80 italic leading-relaxed">
                "{reading?.affirmation || 'I am open to the guidance of the numbers in my life.'}"
              </p>
            </motion.div>
          </div>

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
              delay: 0.7
            }}
            className="text-center">

            <button
              onClick={() => navigate('/forecasts')}
              className="px-8 py-3 rounded-full border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all">

              View Long-Term Forecasts
            </button>
          </motion.div>
        </div>
      </div>
    </div>);

}