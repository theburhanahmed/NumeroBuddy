'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Info } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI } from '@/lib/numerology-api';

interface RemedyCombination {
  id: string;
  name: string;
  description: string;
  remedies: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  synergy_score: number;
  expected_benefits: string[];
  precautions: string[];
}

interface RemedyCombinationsProps {
  onSelectCombination?: (combination: RemedyCombination) => void;
}

export function RemedyCombinations({ onSelectCombination }: RemedyCombinationsProps) {
  const [combinations, setCombinations] = useState<RemedyCombination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCombination, setSelectedCombination] = useState<RemedyCombination | null>(null);

  useEffect(() => {
    fetchCombinations();
  }, []);

  const fetchCombinations = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getRemedyCombinations();
      setCombinations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch combinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSynergyColor = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-600';
    if (score >= 6) return 'from-cyan-500 to-blue-600';
    if (score >= 4) return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
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

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          Remedy Combinations
        </h2>
        <p className="text-white/70">Synergistic combinations of remedies for enhanced effects</p>
      </div>

      {/* Combinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combinations.map((combination) => (
          <motion.div
            key={combination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedCombination?.id === combination.id
                ? 'bg-[#1a2942]/60 border-cyan-500/50'
                : 'bg-[#1a2942]/40 border-white/10 hover:border-cyan-500/50'
            }`}
            onClick={() => setSelectedCombination(
              selectedCombination?.id === combination.id ? null : combination
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{combination.name}</h3>
                <p className="text-sm text-white/70 line-clamp-2">{combination.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getSynergyColor(combination.synergy_score)} text-white`}>
                {combination.synergy_score}/10
              </div>
            </div>

            {/* Remedies in combination */}
            <div className="mb-3">
              <div className="text-xs text-white/60 mb-2">Remedies:</div>
              <div className="flex flex-wrap gap-2">
                {combination.remedies.map((remedy) => (
                  <span
                    key={remedy.id}
                    className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs"
                  >
                    {remedy.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Expanded details */}
            {selectedCombination?.id === combination.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-white/10 space-y-4"
              >
                {/* Expected Benefits */}
                {combination.expected_benefits.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Expected Benefits
                    </div>
                    <ul className="space-y-1">
                      {combination.expected_benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                          <span className="text-cyan-400">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Precautions */}
                {combination.precautions.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-yellow-400" />
                      Precautions
                    </div>
                    <ul className="space-y-1">
                      {combination.precautions.map((precaution, idx) => (
                        <li key={idx} className="text-sm text-yellow-400/80 flex items-start gap-2">
                          <span className="text-yellow-400">•</span>
                          <span>{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <TouchOptimizedButton
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectCombination && onSelectCombination(combination)}
                  className="w-full mt-4"
                >
                  Use This Combination
                </TouchOptimizedButton>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {combinations.length === 0 && (
        <div className="text-center py-12 text-white/50">
          No remedy combinations available
        </div>
      )}
    </SpaceCard>
  );
}