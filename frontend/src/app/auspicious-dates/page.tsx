'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { numerologyAPI } from '@/lib/numerology-api';
import { PageLayout } from '@/components/layout/page-layout';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { LoadingSpinner } from '@/components/loading/loading-spinner';
import { useAuth } from '@/contexts/auth-context';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { motion } from 'framer-motion';
import { Calendar, StarIcon, SparklesIcon, ClockIcon, TargetIcon, AlertCircleIcon, AlertTriangle, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { timingNumerologyAPI } from '@/lib/numerology-api';

interface AuspiciousDate {
  date: string;
  personal_day_number: number;
  activity_type: string;
  reasoning: string;
  score: number;
}

type TabType = 'auspicious' | 'danger' | 'optimize';

export default function AuspiciousDatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [activeTab, setActiveTab] = useState<TabType>('auspicious');
  const [dates, setDates] = useState<AuspiciousDate[]>([]);
  const [dangerDates, setDangerDates] = useState<any[]>([]);
  const [optimizedDates, setOptimizedDates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));

  const fetchAuspiciousDates = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await numerologyAPI.getAuspiciousDates({
        activity_type: activityType || undefined,
        start_date: startDate,
        end_date: endDate,
      });
      setDates(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to fetch auspicious dates:', error);
      toast.error(error.response?.data?.error || 'Failed to load auspicious dates');
      setDates([]);
    } finally {
      setLoading(false);
    }
  }, [user, activityType, startDate, endDate]);

  const fetchDangerDates = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const profile = await numerologyAPI.getProfile();
      const birthDate = profile?.birth_date || user?.date_of_birth;
      
      if (!birthDate) {
        toast.error('Please set your birth date in your profile');
        return;
      }

      const data = await timingNumerologyAPI.findDangerDates({
        birth_date: birthDate,
        start_date: startDate,
        end_date: endDate,
      });
      setDangerDates(Array.isArray(data?.danger_dates || data) ? (data?.danger_dates || data) : []);
    } catch (error: any) {
      console.error('Failed to fetch danger dates:', error);
      toast.error(error.response?.data?.error || 'Failed to load danger dates');
      setDangerDates([]);
    } finally {
      setLoading(false);
    }
  }, [user, startDate, endDate]);

  const optimizeTiming = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const profile = await numerologyAPI.getProfile();
      const birthDate = profile?.birth_date || user?.date_of_birth;
      
      if (!birthDate) {
        toast.error('Please set your birth date in your profile');
        return;
      }

      const eventType = activityType || 'general';
      const data = await timingNumerologyAPI.optimizeTiming({
        birth_date: birthDate,
        event_type: eventType,
      });
      setOptimizedDates(data);
    } catch (error: any) {
      console.error('Failed to optimize timing:', error);
      toast.error(error.response?.data?.error || 'Failed to optimize timing');
    } finally {
      setLoading(false);
    }
  }, [user, activityType]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (activeTab === 'auspicious') {
      fetchAuspiciousDates();
    } else if (activeTab === 'danger') {
      fetchDangerDates();
    }
  }, [user, router, activeTab]);

  const activityTypes = [
    { value: '', label: 'All Activities' },
    { value: 'business', label: 'Business & Career' },
    { value: 'romance', label: 'Romance & Relationships' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'travel', label: 'Travel & Adventure' },
    { value: 'education', label: 'Education & Learning' },
    { value: 'financial', label: 'Financial Decisions' },
    { value: 'creative', label: 'Creative Projects' },
  ];

  return (
    <SubscriptionGate feature="auspicious-dates" requiredTier="premium">
      <PageLayout showNav={false}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <StarIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Auspicious Dates
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Discover the perfect timing for your important activities
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex gap-2 border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('auspicious')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'auspicious'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <StarIcon className="w-4 h-4 inline mr-2" />
                Auspicious Dates
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'danger'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Danger Dates
              </button>
              <button
                onClick={() => setActiveTab('optimize')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'optimize'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Optimize Timing
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <GlassButton
                    variant="liquid"
                    onClick={activeTab === 'auspicious' ? fetchAuspiciousDates : activeTab === 'danger' ? fetchDangerDates : optimizeTiming}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : activeTab === 'optimize' ? 'Optimize' : 'Search Dates'}
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" message={activeTab === 'danger' ? 'Finding danger dates...' : activeTab === 'optimize' ? 'Optimizing timing...' : 'Finding auspicious dates...'} />
            </div>
          ) : activeTab === 'danger' ? (
            dangerDates.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  No Danger Dates Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Great news! No danger dates found in this period.
                </p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {dangerDates.map((date: any, index) => (
                  <motion.div
                    key={date.date || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6 border-2 border-red-300 dark:border-red-700 hover:scale-105 transition-transform">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {format(parseISO(date.date || date.start_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          {date.severity && (
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              date.severity === 'high' ? 'bg-red-500/20 text-red-600' :
                              date.severity === 'moderate' ? 'bg-orange-500/20 text-orange-600' :
                              'bg-yellow-500/20 text-yellow-600'
                            }`}>
                              {date.severity.toUpperCase()} RISK
                            </span>
                          )}
                        </div>
                      </div>
                      {date.reasoning && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {date.reasoning}
                        </p>
                      )}
                      {date.warnings && date.warnings.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-red-300 dark:border-red-700">
                          <p className="text-xs font-semibold text-red-600 mb-2">Warnings:</p>
                          <ul className="space-y-1">
                            {date.warnings.map((warning: string, i: number) => (
                              <li key={i} className="text-xs text-red-500">• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {date.recommendations && date.recommendations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-red-300 dark:border-red-700">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommendations:</p>
                          <ul className="space-y-1">
                            {date.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="text-xs text-gray-600 dark:text-gray-400">• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )
          ) : activeTab === 'optimize' ? (
            optimizedDates ? (
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Optimized Timing</h3>
                {optimizedDates.recommended_dates && optimizedDates.recommended_dates.length > 0 ? (
                  <div className="space-y-4">
                    {optimizedDates.recommended_dates.map((date: any, index: number) => (
                      <div key={index} className="p-4 bg-white/50 dark:bg-white/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {format(parseISO(date.date), 'MMM dd, yyyy')}
                          </span>
                          <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-semibold">
                            Score: {date.score || 'N/A'}
                          </span>
                        </div>
                        {date.reasoning && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{date.reasoning}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">Optimization complete. Check the recommendations above.</p>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-8 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Optimize Event Timing
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select an activity type and click "Optimize" to find the best timing.
                </p>
              </GlassCard>
            )
          ) : dates.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                No Auspicious Dates Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or date range to find more dates.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {dates.map((date, index) => (
                <motion.div
                  key={date.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 hover:scale-105 transition-transform">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <span className="font-bold text-lg text-gray-900 dark:text-white">
                            {format(parseISO(date.date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SparklesIcon className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Personal Day {date.personal_day_number}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {date.score || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TargetIcon className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">
                          {date.activity_type ? date.activity_type.replace('_', ' ') : 'General Activity'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {date.reasoning}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>Optimal timing for this activity</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageLayout>
    </SubscriptionGate>
  );
}

