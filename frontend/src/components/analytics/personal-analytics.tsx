'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { analyticsAPI, PersonalAnalytics } from '@/lib/numerology-api';

interface PersonalAnalyticsProps {
  className?: string;
}

export function PersonalAnalyticsWidget({ className = '' }: PersonalAnalyticsProps) {
  const [analytics, setAnalytics] = useState<PersonalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getPersonalAnalytics(30);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassCard variant="default" className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <GlassCard variant="default" className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Analytics
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last {analytics.period_days} days
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Engagement</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.engagement_score.toFixed(1)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Actions</p>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {analytics.total_actions}
            </p>
          </div>
        </div>

        {analytics.feature_usage.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Most Used Features
            </h4>
            <div className="space-y-2">
              {analytics.feature_usage.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.action_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {feature.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

