'use client';

import React, { useState, useEffect } from 'react';
import { generationalNumerologyAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

export function GenerationalPatterns() {
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
      const data = await generationalNumerologyAPI.getGenerationalPatterns();
      if (data.success && data.patterns) {
        setPatterns(data.patterns);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load generational patterns');
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
        <h2 className="text-2xl font-bold text-white mb-2">Generational Patterns</h2>
        <p className="text-white/70">Discover repeating patterns and cycles across family generations</p>
      </div>

      {!patterns || (patterns.patterns && patterns.patterns.length === 0) ? (
        <SpaceCard variant="elevated" className="p-6 text-center">
          <GitBranch className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">No generational patterns identified.</p>
          <p className="text-white/50 text-sm mt-2">Add family members to analyze patterns.</p>
        </SpaceCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patterns.patterns && patterns.patterns.map((pattern: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <SpaceCard variant="elevated" className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <GitBranch className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{pattern.pattern_type || 'Pattern'}</h3>
                    <p className="text-white/80 text-sm">{pattern.description}</p>
                  </div>
                </div>
                {pattern.frequency && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-white/70 text-xs">Frequency: {pattern.frequency}</p>
                  </div>
                )}
              </SpaceCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

