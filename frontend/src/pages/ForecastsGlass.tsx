import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  TrendingUpIcon,
  CalendarIcon,
  AlertCircleIcon } from
'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { GlassBackground } from '../components/GlassBackground';
import { numerologyAPI } from '../lib/numerology-api';
export function ForecastsGlass() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'year' | 'month' | 'day'>('year');
  const [birthChart, setBirthChart] = useState<any | null>(null);
  const [daily, setDaily] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [bc, dr] = await Promise.all([
          numerologyAPI.getBirthChart(),
          numerologyAPI.getDailyReading({ date: new Date().toISOString().split('T')[0] }),
        ]);
        setBirthChart(bc);
        setDaily(dr);
      } catch (err: any) {
        setError(err?.message || 'Unable to load forecasts.');
        setBirthChart(null);
        setDaily(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const yearNumber = birthChart?.profile?.personal_year_number;
  const monthNumber = birthChart?.profile?.personal_month_number;
  const dayNumber = daily?.personal_day_number;

  const yearText = useMemo(() => {
    const interp = birthChart?.interpretations?.personal_year_number;
    return interp?.description || interp?.summary || interp?.meaning || 'No personal year interpretation available.';
  }, [birthChart]);

  const monthText = useMemo(() => {
    const interp = birthChart?.interpretations?.personal_month_number;
    return interp?.description || interp?.summary || interp?.meaning || 'No personal month interpretation available.';
  }, [birthChart]);

  const dayText = useMemo(() => {
    return daily?.actionable_tip || daily?.message || daily?.warning || 'No personal day guidance available.';
  }, [daily]);
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        
        <AppNavbar />

        <div className="max-w-5xl mx-auto px-8 py-8 pt-24">
          {isLoading && (
            <div className="text-center text-white/60 mb-8">Loading forecasts...</div>
          )}
          {error && !isLoading && (
            <div className="text-center text-red-400 mb-8">{error}</div>
          )}
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
                    Personal Year
                  </div>
                  <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 mb-2">
                    {yearNumber ?? '–'}
                  </div>
                  <div className="text-xl text-white font-serif">Year theme</div>
                </div>
              </div>

              {/* Description */}
              <div className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 mb-8">
                <h2 className="text-2xl font-serif text-white mb-4">
                  Year Overview
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {yearText}
                </p>
              </div>

              {/* Monthly Number */}
              <div className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
                <h2 className="text-2xl font-serif text-white mb-4">
                  Current Personal Month
                </h2>
                <div className="flex items-center justify-between">
                  <div className="text-white/70">{monthText}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {monthNumber ?? '–'}
                  </div>
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
                Personal Month
              </h2>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-600 mb-4">
                {monthNumber ?? '–'}
              </div>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
                {monthText}
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
                {dayNumber ?? '–'}
              </div>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
                {dayText}
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