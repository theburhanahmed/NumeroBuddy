'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { numerologyAPI } from '@/lib/numerology-api';

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'opportunity';
  title: string;
  description: string;
  priority: number;
  related_numbers?: number[];
  action_suggestion?: string;
}

interface InsightsProps {
  insights?: Insight[];
}

export function Insights({ insights: providedInsights }: InsightsProps) {
  const [insights, setInsights] = useState<Insight[]>(providedInsights || []);
  const [loading, setLoading] = useState(!providedInsights);

  useEffect(() => {
    if (!providedInsights) {
      fetchInsights();
    }
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getDashboardInsights();
      setInsights(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return TrendingUp;
      case 'warning': return AlertCircle;
      case 'opportunity': return Lightbulb;
      default: return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'opportunity': return 'border-cyan-500/30 bg-cyan-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const sortedInsights = [...insights].sort((a, b) => b.priority - a.priority);

  if (loading) {
    return (
      <SpaceCard variant="premium" className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </SpaceCard>
    );
  }

  return (
    <SpaceCard variant="premium" className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          Personalized Insights
        </h2>
      </div>

      <div className="space-y-3">
        {sortedInsights.slice(0, 5).map((insight) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${
                  insight.type === 'positive' ? 'text-green-400' :
                  insight.type === 'warning' ? 'text-yellow-400' :
                  insight.type === 'opportunity' ? 'text-cyan-400' :
                  'text-blue-400'
                }`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
                  <p className="text-sm text-white/80 mb-2">{insight.description}</p>
                  {insight.related_numbers && insight.related_numbers.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {insight.related_numbers.map((num, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  )}
                  {insight.action_suggestion && (
                    <div className="text-xs text-white/60 italic">
                      💡 {insight.action_suggestion}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No insights available at this time
        </div>
      )}
    </SpaceCard>
  );
}
