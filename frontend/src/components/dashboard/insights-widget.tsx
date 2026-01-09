'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { numerologyAPI } from '@/lib/numerology-api';
import { toast } from 'sonner';

interface Insight {
  id: string;
  type: 'cycle' | 'number' | 'timing' | 'general';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function InsightsWidget() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await numerologyAPI.getDashboardInsights();
      setInsights(Array.isArray(data?.insights) ? data.insights : []);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visibleInsights = insights.filter((insight) => !dismissed.has(insight.id));

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cycle':
        return Calendar;
      case 'number':
        return TrendingUp;
      case 'timing':
        return Sparkles;
      default:
        return Lightbulb;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-cyan-400 bg-cyan-500/10';
      case 'medium':
        return 'border-yellow-400 bg-yellow-500/10';
      default:
        return 'border-gray-400 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <SpaceCard className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      </SpaceCard>
    );
  }

  if (visibleInsights.length === 0) {
    return null;
  }

  return (
    <SpaceCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        Personalized Insights
      </h3>
      <div className="space-y-3">
        <AnimatePresence>
          {visibleInsights.slice(0, 3).map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border-2 ${getInsightColor(insight.priority)} relative`}
              >
                <button
                  onClick={() => handleDismiss(insight.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{insight.title}</h4>
                    <p className="text-gray-300 text-sm">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </SpaceCard>
  );
}

