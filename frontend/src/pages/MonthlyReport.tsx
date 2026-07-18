import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, TrendingUpIcon, AlertTriangleIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { numerologyAPI } from '../lib/numerology-api';

export function MonthlyReport() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async (m: number, y: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await numerologyAPI.getMonthlyReport({ month: m, year: y });
      setReport(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to load monthly report.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadReport(month, year); }, [month, year]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <CosmicPageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">Monthly Report</h1>
            <p className="text-white/70">Your personalized monthly numerology forecast</p>
          </div>
        </div>
      </motion.div>

      <SpaceCard variant="premium" className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <TouchOptimizedButton variant="secondary" size="sm" onClick={prevMonth} ariaLabel="Previous month">
            <ChevronLeftIcon className="w-5 h-5" />
          </TouchOptimizedButton>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{report?.month_name || ''} {year}</h2>
            {report && <p className="text-cyan-400 text-sm mt-1">Personal Month {report.personal_month} - Personal Year {report.personal_year}</p>}
          </div>
          <TouchOptimizedButton variant="secondary" size="sm" onClick={nextMonth} ariaLabel="Next month">
            <ChevronRightIcon className="w-5 h-5" />
          </TouchOptimizedButton>
        </div>
      </SpaceCard>

      {error && <p className="text-red-400 mb-6" role="alert">{error}</p>}
      {isLoading && <p className="text-white/60 text-center py-12">Loading report...</p>}

      {report && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Theme & Energy */}
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Monthly Theme</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 text-center">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Theme</p>
                <p className="text-lg font-bold text-cyan-400">{report.theme}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 text-center">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Energy</p>
                <p className="text-lg font-bold text-purple-400">{report.energy}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 text-center">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Focus</p>
                <p className="text-sm font-medium text-amber-400">{report.focus}</p>
              </div>
            </div>
          </SpaceCard>

          {/* Opportunities & Challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            <SpaceCard variant="default" className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><TrendingUpIcon className="w-5 h-5 text-green-400" />Opportunities</h3>
              <ul className="space-y-2">
                {report.opportunities?.map((opp: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-sm"><span className="text-green-400 mt-0.5">+</span>{opp}</li>
                ))}
              </ul>
            </SpaceCard>
            <SpaceCard variant="default" className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><AlertTriangleIcon className="w-5 h-5 text-amber-400" />Challenges</h3>
              <ul className="space-y-2">
                {report.challenges?.map((ch: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-sm"><span className="text-amber-400 mt-0.5">!</span>{ch}</li>
                ))}
              </ul>
            </SpaceCard>
          </div>

          {/* Key Dates */}
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Key Dates</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-green-400 font-semibold mb-2 text-sm uppercase tracking-wider">Best Days</h4>
                <div className="flex flex-wrap gap-2">
                  {report.key_dates?.best_days?.map((d: any) => (
                    <span key={d.day} className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-400/30 text-green-400 text-sm font-medium">{d.day}</span>
                  ))}
                  {(!report.key_dates?.best_days?.length) && <span className="text-white/40 text-sm">None this month</span>}
                </div>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm uppercase tracking-wider">Opportunity Days</h4>
                <div className="flex flex-wrap gap-2">
                  {report.key_dates?.opportunity_days?.map((d: any) => (
                    <span key={d.day} className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 text-sm font-medium">{d.day}</span>
                  ))}
                  {(!report.key_dates?.opportunity_days?.length) && <span className="text-white/40 text-sm">None this month</span>}
                </div>
              </div>
              <div>
                <h4 className="text-red-400 font-semibold mb-2 text-sm uppercase tracking-wider">Challenging Days</h4>
                <div className="flex flex-wrap gap-2">
                  {report.key_dates?.challenging_days?.map((d: any) => (
                    <span key={d.day} className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-400/30 text-red-400 text-sm font-medium">{d.day}</span>
                  ))}
                  {(!report.key_dates?.challenging_days?.length) && <span className="text-white/40 text-sm">None this month</span>}
                </div>
              </div>
            </div>
          </SpaceCard>

          {/* Weekly Overview */}
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Weekly Overview</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {report.weekly_overview?.map((week: any) => (
                <div key={week.week} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Week {week.week}</p>
                  <p className="text-white/60 text-xs mb-2">Days {week.start_day}-{week.end_day}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(week.average_score)}`}>{week.average_score}</p>
                  <p className="text-white/50 text-xs mt-1">avg score</p>
                </div>
              ))}
            </div>
          </SpaceCard>

          {/* Daily Grid */}
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Daily Energy Map</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="text-center text-xs text-white/50 font-medium pb-1">{d}</div>
              ))}
              {(() => {
                const firstDay = new Date(year, month - 1, 1).getDay();
                const offset = firstDay === 0 ? 6 : firstDay - 1;
                const blanks = Array.from({ length: offset }, (_, i) => <div key={`blank-${i}`} />);
                const days = report.daily_insights?.map((day: any) => {
                  const bg = day.score >= 75 ? 'bg-green-500/30 border-green-400/40' : day.score >= 50 ? 'bg-cyan-500/20 border-cyan-400/30' : 'bg-red-500/20 border-red-400/30';
                  return (
                    <div key={day.day} className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs ${bg}`} title={`Day ${day.day}: ${day.energy} (${day.score}/100)`}>
                      <span className="text-white font-medium">{day.day}</span>
                      <span className={`text-[10px] ${getScoreColor(day.score)}`}>{day.score}</span>
                    </div>
                  );
                }) || [];
                return [...blanks, ...days];
              })()}
            </div>
          </SpaceCard>
        </motion.div>
      )}
    </CosmicPageLayout>
  );
}
