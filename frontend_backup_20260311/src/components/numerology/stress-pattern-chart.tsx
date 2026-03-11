'use client';

import React, { useState, useEffect } from 'react';
import { mentalStateAIAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, TrendingUp } from 'lucide-react';

export function StressPatternChart() {
  const [patterns, setPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mentalStateAIAPI.getStressPatterns();
      if (data.success && data.patterns) {
        setPatterns(data.patterns);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load stress patterns');
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
        <h2 className="text-2xl font-bold text-white mb-2">Stress Patterns</h2>
        <p className="text-white/70">Identify stress patterns correlated with numerology cycles</p>
      </div>

      {!patterns || (patterns.patterns && patterns.patterns.length === 0) ? (
        <SpaceCard variant="elevated" className="p-6 text-center">
          <TrendingUp className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">No stress patterns identified yet.</p>
          <p className="text-white/50 text-sm mt-2">Track your emotional state over time to identify patterns.</p>
        </SpaceCard>
      ) : (
        <div className="space-y-4">
          {patterns.patterns && patterns.patterns.map((pattern: any, index: number) => (
            <SpaceCard key={index} variant="elevated" className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{pattern.pattern_type || 'Stress Pattern'}</h3>
                  <p className="text-white/80 text-sm mb-3">{pattern.description}</p>
                  
                  {pattern.correlation && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-white/70 text-xs mb-1">Numerology Correlation:</p>
                      <p className="text-cyan-400 text-sm">{pattern.correlation}</p>
                    </div>
                  )}
                </div>
              </div>
            </SpaceCard>
          ))}
        </div>
      )}
    </div>
  );
}

