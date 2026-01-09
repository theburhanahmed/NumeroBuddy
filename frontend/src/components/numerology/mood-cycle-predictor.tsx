'use client';

import React, { useState, useEffect } from 'react';
import { mentalStateAIAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';

export function MoodCyclePredictor() {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mentalStateAIAPI.getMoodPredictions();
      if (data.success && data.predictions) {
        setPredictions(data.predictions);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load mood predictions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (error) {
    return (
      <SpaceCard variant="elevated" className="p-6">
        <p className="text-red-400">{error}</p>
      </SpaceCard>
    );
  }

  const getMoodColor = (mood: string) => {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes('positive') || moodLower.includes('high')) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (moodLower.includes('neutral') || moodLower.includes('stable')) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Mood Cycle Predictions</h2>
        <p className="text-white/70">Predict mood cycles based on numerology personal cycles</p>
      </div>

      {!predictions || (predictions.predictions && predictions.predictions.length === 0) ? (
        <SpaceCard variant="elevated" className="p-6 text-center">
          <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">No mood predictions available yet.</p>
          <p className="text-white/50 text-sm mt-2">Track your emotional state to enable mood predictions.</p>
        </SpaceCard>
      ) : (
        <div className="space-y-4">
          {predictions.predictions && predictions.predictions.map((prediction: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SpaceCard variant="elevated" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {prediction.date ? format(new Date(prediction.date), 'MMM d, yyyy') : `Prediction ${index + 1}`}
                      </h3>
                      {prediction.predicted_mood && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${getMoodColor(prediction.predicted_mood)}`}>
                          {prediction.predicted_mood}
                        </span>
                      )}
                    </div>
                    {prediction.confidence && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70 text-xs">Confidence</span>
                          <span className="text-white font-semibold text-sm">{prediction.confidence}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500"
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {prediction.reasoning && (
                      <p className="text-white/80 text-sm">{prediction.reasoning}</p>
                    )}
                  </div>
                </div>
              </SpaceCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

