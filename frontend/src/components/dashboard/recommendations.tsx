'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Calendar, Sparkles, FileText } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI } from '@/lib/numerology-api';
import { useRouter } from 'next/navigation';

interface Recommendation {
  id: string;
  type: 'remedy' | 'report' | 'reading' | 'visualization' | 'action';
  title: string;
  description: string;
  priority: number;
  action_url?: string;
  action_label?: string;
  related_data?: Record<string, any>;
}

interface RecommendationsProps {
  recommendations?: Recommendation[];
}

export function Recommendations({ recommendations: providedRecommendations }: RecommendationsProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(providedRecommendations || []);
  const [loading, setLoading] = useState(!providedRecommendations);

  useEffect(() => {
    if (!providedRecommendations) {
      fetchRecommendations();
    }
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getDashboardRecommendations();
      setRecommendations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'remedy': return Sparkles;
      case 'report': return FileText;
      case 'reading': return Calendar;
      case 'visualization': return Star;
      default: return Star;
    }
  };

  const handleAction = (recommendation: Recommendation) => {
    if (recommendation.action_url) {
      router.push(recommendation.action_url);
    }
  };

  const sortedRecommendations = [...recommendations].sort((a, b) => b.priority - a.priority);

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
          <Star className="w-5 h-5 text-cyan-400" />
          Recommendations
        </h2>
      </div>

      <div className="space-y-3">
        {sortedRecommendations.slice(0, 5).map((recommendation) => {
          const Icon = getRecommendationIcon(recommendation.type);
          return (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 text-cyan-400" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white">{recommendation.title}</h3>
                    {recommendation.priority >= 8 && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70 mb-3">{recommendation.description}</p>
                  {recommendation.action_url && (
                    <TouchOptimizedButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAction(recommendation)}
                      icon={<ArrowRight className="w-3 h-3" />}
                    >
                      {recommendation.action_label || 'View'}
                    </TouchOptimizedButton>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No recommendations at this time
        </div>
      )}
    </SpaceCard>
  );
}