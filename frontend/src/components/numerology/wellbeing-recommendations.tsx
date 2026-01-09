'use client';

import React, { useState, useEffect } from 'react';
import { mentalStateAIAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function WellbeingRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mentalStateAIAPI.getWellbeingRecommendations();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load wellbeing recommendations');
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Wellbeing Recommendations</h2>
        <p className="text-white/70">Personalized wellbeing advice based on your numerology cycles</p>
      </div>

      {recommendations.length === 0 ? (
        <SpaceCard variant="elevated" className="p-6 text-center">
          <Heart className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">No recommendations available yet.</p>
          <p className="text-white/50 text-sm mt-2">Track your emotional state to receive personalized recommendations.</p>
        </SpaceCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <SpaceCard variant="premium" className="p-6" glow>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{rec.category || 'Recommendation'}</h3>
                    <p className="text-white/80 text-sm mb-3">{rec.recommendation || rec}</p>
                    {rec.related_cycle && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-white/70 text-xs">Related Cycle: <span className="text-cyan-400">{rec.related_cycle}</span></p>
                      </div>
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

