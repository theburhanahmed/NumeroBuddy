'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { numerologyAPI } from '@/lib/numerology-api';

interface RemedyEffectivenessData {
  remedy_id: string;
  remedy_name: string;
  total_completions: number;
  total_attempts: number;
  average_effectiveness: number;
  effectiveness_trend: Array<{
    date: string;
    effectiveness: number;
  }>;
  completion_rate: number;
  mood_improvement: {
    before: Record<string, number>;
    after: Record<string, number>;
  };
  recommendations: string[];
}

interface RemedyEffectivenessProps {
  remedyId: string;
}

export function RemedyEffectiveness({ remedyId }: RemedyEffectivenessProps) {
  const [effectivenessData, setEffectivenessData] = useState<RemedyEffectivenessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEffectivenessData();
  }, [remedyId]);

  const fetchEffectivenessData = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getRemedyEffectiveness({ remedy_id: remedyId });
      setEffectivenessData(response);
    } catch (error) {
      console.error('Failed to fetch effectiveness data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </SpaceCard>
    );
  }

  if (!effectivenessData) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="text-center text-white/70">No effectiveness data available</div>
      </SpaceCard>
    );
  }

  const maxEffectiveness = Math.max(
    ...effectivenessData.effectiveness_trend.map(d => d.effectiveness),
    10
  );

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          Remedy Effectiveness
        </h2>
        <p className="text-white/70">{effectivenessData.remedy_name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">Completion Rate</div>
          <div className="text-2xl font-bold text-cyan-400">
            {Math.round(effectivenessData.completion_rate)}%
          </div>
        </div>
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">Avg Effectiveness</div>
          <div className="text-2xl font-bold text-purple-400">
            {effectivenessData.average_effectiveness.toFixed(1)}/10
          </div>
        </div>
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">Total Completions</div>
          <div className="text-2xl font-bold text-white">
            {effectivenessData.total_completions}
          </div>
        </div>
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">Total Attempts</div>
          <div className="text-2xl font-bold text-white">
            {effectivenessData.total_attempts}
          </div>
        </div>
      </div>

      {/* Effectiveness Trend Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Effectiveness Trend
        </h3>
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="flex items-end gap-2 h-48">
            {effectivenessData.effectiveness_trend.map((dataPoint, idx) => {
              const height = (dataPoint.effectiveness / maxEffectiveness) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="w-full bg-gradient-to-t from-cyan-500 to-purple-600 rounded-t"
                  />
                  <div className="text-xs text-white/60 mt-2 text-center">
                    {new Date(dataPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs text-cyan-400 font-semibold mt-1">
                    {dataPoint.effectiveness.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mood Improvement */}
      {(Object.keys(effectivenessData.mood_improvement.before).length > 0 ||
        Object.keys(effectivenessData.mood_improvement.after).length > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mood Improvement</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
              <div className="text-sm text-white/60 mb-2">Before</div>
              <div className="space-y-2">
                {Object.entries(effectivenessData.mood_improvement.before).map(([mood, count]) => (
                  <div key={mood} className="flex items-center justify-between">
                    <span className="text-white/80 capitalize">{mood}</span>
                    <span className="text-cyan-400 font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
              <div className="text-sm text-white/60 mb-2">After</div>
              <div className="space-y-2">
                {Object.entries(effectivenessData.mood_improvement.after).map(([mood, count]) => (
                  <div key={mood} className="flex items-center justify-between">
                    <span className="text-white/80 capitalize">{mood}</span>
                    <span className="text-green-400 font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {effectivenessData.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
          <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-cyan-500/20">
            <ul className="space-y-2">
              {effectivenessData.recommendations.map((recommendation, idx) => (
                <li key={idx} className="text-white/80 flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </SpaceCard>
  );
}
