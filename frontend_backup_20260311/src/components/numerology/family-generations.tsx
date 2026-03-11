'use client';

import React, { useState, useEffect } from 'react';
import { generationalNumerologyAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Users, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';

export function FamilyGenerations() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (selectedPersonIds.length < 2) {
      setError('Please select at least 2 family members');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await generationalNumerologyAPI.analyzeFamily({
        family_member_ids: selectedPersonIds
      });
      setAnalysis(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze family generations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Family Generations Analysis</h2>
        <p className="text-white/70">Analyze generational patterns and numerology across your family tree</p>
      </div>

      <SpaceCard variant="elevated" className="p-6">
        <div className="mb-4">
          <p className="text-white/70 text-sm mb-2">Select family members to analyze (at least 2 required)</p>
          <p className="text-white/50 text-xs">Family member selection will be implemented with your people management system</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <TouchOptimizedButton
          onClick={handleAnalyze}
          disabled={loading || selectedPersonIds.length < 2}
          variant="primary"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            'Analyze Family Generations'
          )}
        </TouchOptimizedButton>
      </SpaceCard>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SpaceCard variant="premium" className="p-6" glow>
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Generational Analysis</h3>
            </div>

            {analysis.generational_number && (
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-2">Family Generational Number</p>
                <p className="text-5xl font-bold text-cyan-400">{analysis.generational_number}</p>
              </div>
            )}

            {analysis.analysis_data && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Analysis Summary</h4>
                  <p className="text-white/80">{analysis.analysis_data.summary || 'Generational analysis completed.'}</p>
                </div>

                {analysis.analysis_data.patterns && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Generational Patterns</h4>
                    <ul className="space-y-2">
                      {analysis.analysis_data.patterns.map((pattern: any, i: number) => (
                        <li key={i} className="text-white/80 text-sm">• {pattern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </SpaceCard>
        </motion.div>
      )}
    </div>
  );
}

