'use client';

import React, { useState, useEffect } from 'react';
import { generationalNumerologyAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function KarmicContracts() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generationalNumerologyAPI.getKarmicContracts();
      if (data.success && data.contracts) {
        setContracts(data.contracts);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load karmic contracts');
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
        <h2 className="text-2xl font-bold text-white mb-2">Karmic Contracts</h2>
        <p className="text-white/70">Parent-child karmic relationships and soul agreements</p>
      </div>

      {contracts.length === 0 ? (
        <SpaceCard variant="elevated" className="p-6 text-center">
          <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 mb-4">No karmic contracts found.</p>
          <p className="text-white/50 text-sm">Analyze parent-child relationships to discover karmic contracts.</p>
        </SpaceCard>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SpaceCard variant="elevated" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {contract.parent?.name} & {contract.child?.name}
                      </h3>
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-500/20 text-purple-400 capitalize">
                        {contract.contract_type?.replace('_', ' ')}
                      </span>
                    </div>

                    {contract.compatibility_score !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70 text-sm">Compatibility</span>
                          <span className="text-white font-semibold">{contract.compatibility_score}/100</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${contract.compatibility_score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {contract.karmic_lessons && contract.karmic_lessons.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <h4 className="text-sm font-semibold text-white mb-2">Karmic Lessons</h4>
                        <ul className="space-y-1">
                          {contract.karmic_lessons.map((lesson: string, i: number) => (
                            <li key={i} className="text-white/80 text-sm">• {lesson}</li>
                          ))}
                        </ul>
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

