'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUpIcon, Calendar, Sparkles, AlertTriangle, Target, Zap, Clock, Loader2 } from 'lucide-react';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { predictiveNumerologyAPI } from '@/lib/numerology-api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

type ForecastTab = 'yearly' | '9year' | 'breakthrough' | 'crisis' | 'opportunities' | 'milestones';

export default function ForecastsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ForecastTab>('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yearlyForecast, setYearlyForecast] = useState<any>(null);
  const [nineYearCycle, setNineYearCycle] = useState<any>(null);
  const [breakthroughYears, setBreakthroughYears] = useState<any>(null);
  const [crisisYears, setCrisisYears] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any>(null);
  const [milestones, setMilestones] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent('/forecasts')}`);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchForecastData();
    }
  }, [user, activeTab, selectedYear]);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'yearly':
          const yearly = await predictiveNumerologyAPI.getYearlyForecast(selectedYear);
          setYearlyForecast(yearly);
          break;
        case '9year':
          const cycle = await predictiveNumerologyAPI.get9YearCycle(20);
          setNineYearCycle(cycle);
          break;
        case 'breakthrough':
          const breakthrough = await predictiveNumerologyAPI.getBreakthroughYears(20);
          setBreakthroughYears(breakthrough);
          break;
        case 'crisis':
          const crisis = await predictiveNumerologyAPI.getCrisisYears(20);
          setCrisisYears(crisis);
          break;
        case 'opportunities':
          const opps = await predictiveNumerologyAPI.getOpportunityPeriods(20);
          setOpportunities(opps);
          break;
        case 'milestones':
          const miles = await predictiveNumerologyAPI.getLifeMilestones(50);
          setMilestones(miles);
          break;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load forecast data. Please calculate your numerology profile first.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'yearly' as ForecastTab, label: 'Yearly Forecast', icon: Calendar },
    { id: '9year' as ForecastTab, label: '9-Year Cycle', icon: TrendingUpIcon },
    { id: 'breakthrough' as ForecastTab, label: 'Breakthrough Years', icon: Zap },
    { id: 'crisis' as ForecastTab, label: 'Crisis Years', icon: AlertTriangle },
    { id: 'opportunities' as ForecastTab, label: 'Opportunities', icon: Target },
    { id: 'milestones' as ForecastTab, label: 'Life Milestones', icon: Sparkles },
  ];

  if (authLoading) {
    return (
      <CosmicPageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </CosmicPageLayout>
    );
  }

  return (
    <CosmicPageLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Numerology Forecasts
              </h1>
              <p className="text-white/70">Discover your future cycles and opportunities</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Year Selector for Yearly Forecast */}
        {activeTab === 'yearly' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Select Year
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value) || new Date().getFullYear())}
              min={1900}
              max={2100}
              className="px-4 py-2 bg-[#1a2942]/60 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
              <p className="text-white/70">Loading forecast data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <SpaceCard variant="elevated" className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">Error</h2>
            </div>
            <p className="text-white/70 mb-4">{error}</p>
            <TouchOptimizedButton onClick={fetchForecastData} variant="primary">
              Retry
            </TouchOptimizedButton>
          </SpaceCard>
        )}

        {/* Yearly Forecast */}
        {!loading && !error && activeTab === 'yearly' && yearlyForecast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h2 className="text-2xl font-bold text-white mb-4">
                Year {selectedYear} Forecast
              </h2>
              {yearlyForecast.forecast && (
                <div className="space-y-4">
                  {yearlyForecast.forecast.overview && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Overview</h3>
                      <p className="text-white/80">{yearlyForecast.forecast.overview}</p>
                    </div>
                  )}
                  {yearlyForecast.forecast.themes && yearlyForecast.forecast.themes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">Key Themes</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {yearlyForecast.forecast.themes.map((theme: string, index: number) => (
                          <div key={index} className="p-3 bg-cyan-500/10 rounded-lg">
                            <p className="text-white/90 text-sm">{theme}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {yearlyForecast.forecast.monthly_forecasts && yearlyForecast.forecast.monthly_forecasts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">Monthly Forecasts</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {yearlyForecast.forecast.monthly_forecasts.map((month: any, index: number) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg">
                            <h4 className="font-semibold text-white mb-2">{month.month || `Month ${index + 1}`}</h4>
                            {month.description && (
                              <p className="text-white/70 text-sm">{month.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </SpaceCard>
          </motion.div>
        )}

        {/* 9-Year Cycle */}
        {!loading && !error && activeTab === '9year' && nineYearCycle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h2 className="text-2xl font-bold text-white mb-4">9-Year Cycle</h2>
              {nineYearCycle.cycles && nineYearCycle.cycles.length > 0 ? (
                <div className="space-y-4">
                  {nineYearCycle.cycles.map((cycle: any, index: number) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border-l-4 border-cyan-500">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-cyan-400">{cycle.year}</span>
                        <span className="text-white/70">Year {cycle.year_number || index + 1} of Cycle</span>
                      </div>
                      {cycle.theme && (
                        <p className="text-white/80 mb-2">
                          <strong>Theme:</strong> {cycle.theme}
                        </p>
                      )}
                      {cycle.description && (
                        <p className="text-white/70 text-sm">{cycle.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No cycle data available.</p>
              )}
            </SpaceCard>
          </motion.div>
        )}

        {/* Breakthrough Years */}
        {!loading && !error && activeTab === 'breakthrough' && breakthroughYears && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Breakthrough Years
              </h2>
              {breakthroughYears.years && breakthroughYears.years.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {breakthroughYears.years.map((year: any, index: number) => (
                    <div key={index} className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">{year.year}</div>
                      {year.description && (
                        <p className="text-white/80 text-sm">{year.description}</p>
                      )}
                      {year.opportunities && (
                        <div className="mt-3">
                          <p className="text-white/70 text-xs font-semibold mb-1">Opportunities:</p>
                          <ul className="space-y-1">
                            {Array.isArray(year.opportunities) ? (
                              year.opportunities.map((opp: string, i: number) => (
                                <li key={i} className="text-white/70 text-xs">• {opp}</li>
                              ))
                            ) : (
                              <li className="text-white/70 text-xs">• {year.opportunities}</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No breakthrough years identified.</p>
              )}
            </SpaceCard>
          </motion.div>
        )}

        {/* Crisis Years */}
        {!loading && !error && activeTab === 'crisis' && crisisYears && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Crisis Years
              </h2>
              {crisisYears.years && crisisYears.years.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {crisisYears.years.map((year: any, index: number) => (
                    <div key={index} className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                      <div className="text-2xl font-bold text-red-400 mb-2">{year.year}</div>
                      {year.description && (
                        <p className="text-white/80 text-sm mb-3">{year.description}</p>
                      )}
                      {year.guidance && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                          <p className="text-white/70 text-xs font-semibold mb-1">Guidance:</p>
                          <p className="text-white/80 text-xs">{year.guidance}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No crisis years identified.</p>
              )}
            </SpaceCard>
          </motion.div>
        )}

        {/* Opportunities */}
        {!loading && !error && activeTab === 'opportunities' && opportunities && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-400" />
                Opportunity Periods
              </h2>
              {opportunities.periods && opportunities.periods.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.periods.map((period: any, index: number) => (
                    <div key={index} className="p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-white">
                          {period.start_date || period.start} - {period.end_date || period.end}
                        </span>
                      </div>
                      {period.description && (
                        <p className="text-white/80 text-sm mb-2">{period.description}</p>
                      )}
                      {period.actions && (
                        <div className="mt-3">
                          <p className="text-white/70 text-xs font-semibold mb-1">Recommended Actions:</p>
                          <ul className="space-y-1">
                            {Array.isArray(period.actions) ? (
                              period.actions.map((action: string, i: number) => (
                                <li key={i} className="text-white/70 text-xs">• {action}</li>
                              ))
                            ) : (
                              <li className="text-white/70 text-xs">• {period.actions}</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No opportunity periods identified.</p>
              )}
            </SpaceCard>
          </motion.div>
        )}

        {/* Life Milestones */}
        {!loading && !error && activeTab === 'milestones' && milestones && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Life Milestones
              </h2>
              {milestones.milestones && milestones.milestones.length > 0 ? (
                <div className="space-y-4">
                  {milestones.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="p-4 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-purple-400">{milestone.year || milestone.age}</span>
                        <span className="font-semibold text-white">{milestone.title || milestone.type || 'Milestone'}</span>
                      </div>
                      {milestone.description && (
                        <p className="text-white/80 text-sm">{milestone.description}</p>
                      )}
                      {milestone.significance && (
                        <p className="text-white/70 text-xs mt-2">
                          <strong>Significance:</strong> {milestone.significance}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No milestones identified.</p>
              )}
            </SpaceCard>
          </motion.div>
        )}

        {/* No Data Message */}
        {!loading && !error && !yearlyForecast && !nineYearCycle && !breakthroughYears && !crisisYears && !opportunities && !milestones && (
          <SpaceCard variant="premium" className="p-6">
            <p className="text-white/70 text-center">
              No forecast data available. Please calculate your numerology profile first.
            </p>
          </SpaceCard>
        )}
      </div>
    </CosmicPageLayout>
  );
}
