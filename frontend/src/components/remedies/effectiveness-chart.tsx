'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { numerologyAPI, Remedy } from '@/lib/numerology-api';
import { toast } from 'sonner';

export function EffectivenessChart() {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [selectedRemedy, setSelectedRemedy] = useState<string>('');
  const [effectivenessData, setEffectivenessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRemedies();
  }, []);

  useEffect(() => {
    if (selectedRemedy) {
      fetchEffectiveness();
    }
  }, [selectedRemedy]);

  const fetchRemedies = async () => {
    try {
      const data = await numerologyAPI.getPersonalizedRemedies();
      setRemedies(Array.isArray(data) ? data : []);
      if (data.length > 0) {
        setSelectedRemedy(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch remedies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEffectiveness = async () => {
    try {
      const data = await numerologyAPI.getRemedyEffectiveness({
        remedy_id: selectedRemedy,
        period_days: 90,
      });
      setEffectivenessData(data);
    } catch (error) {
      console.error('Failed to fetch effectiveness data:', error);
      toast.error('Failed to load effectiveness data');
    }
  };

  if (loading) {
    return (
      <SpaceCard className="p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      </SpaceCard>
    );
  }

  const maxValue = effectivenessData?.scores?.length
    ? Math.max(...effectivenessData.scores.map((s: any) => s.score))
    : 5;

  return (
    <div className="space-y-6">
      {/* Remedy Selection */}
      <SpaceCard className="p-6">
        <label className="text-gray-400 text-sm mb-2 block">Select Remedy</label>
        <select
          value={selectedRemedy}
          onChange={(e) => setSelectedRemedy(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
        >
          {remedies.map((remedy) => (
            <option key={remedy.id} value={remedy.id}>
              {remedy.title}
            </option>
          ))}
        </select>
      </SpaceCard>

      {/* Effectiveness Chart */}
      {effectivenessData && (
        <SpaceCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Effectiveness Over Time</h3>
          <div className="space-y-4">
            {/* Line Chart */}
            <div className="h-64 flex items-end gap-2">
              {effectivenessData.scores?.map((scoreData: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${(scoreData.score / maxValue) * 100}%` }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg flex flex-col items-center justify-end p-2"
                >
                  <span className="text-white text-xs font-bold mb-1">{scoreData.score.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs">{new Date(scoreData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </motion.div>
              ))}
            </div>

            {/* Average Score */}
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-400">Average Effectiveness</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {effectivenessData.average_score?.toFixed(1) || '0.0'}/5.0
              </div>
            </div>
          </div>
        </SpaceCard>
      )}
    </div>
  );
}

