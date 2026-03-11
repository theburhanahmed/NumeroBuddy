'use client';

import React, { useState, useEffect } from 'react';
import { generationalNumerologyAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Grid } from 'lucide-react';
import { motion } from 'framer-motion';

export function FamilyUnitMatrix() {
  const [matrix, setMatrix] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generationalNumerologyAPI.getFamilyCompatibilityMatrix();
      if (data.success && data.matrix) {
        setMatrix(data.matrix);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load compatibility matrix');
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
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
        <h2 className="text-2xl font-bold text-white mb-2">Family Compatibility Matrix</h2>
        <p className="text-white/70">See compatibility scores between all family members</p>
      </div>

      {!matrix || !matrix.members || matrix.members.length === 0 ? (
        <SpaceCard variant="elevated" className="p-6 text-center">
          <Grid className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">No compatibility matrix available.</p>
          <p className="text-white/50 text-sm mt-2">Add family members to generate compatibility matrix.</p>
        </SpaceCard>
      ) : (
        <SpaceCard variant="elevated" className="p-6 overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-white/70 text-sm font-semibold pb-3">Member</th>
                  {matrix.members.map((member: any, idx: number) => (
                    <th key={idx} className="text-center text-white/70 text-sm font-semibold pb-3">
                      {member.name || `Member ${idx + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.members.map((member: any, rowIdx: number) => (
                  <tr key={rowIdx} className="border-t border-white/10">
                    <td className="text-white font-medium py-3 pr-4">
                      {member.name || `Member ${rowIdx + 1}`}
                    </td>
                    {matrix.members.map((otherMember: any, colIdx: number) => {
                      const compatibility = matrix.compatibility_scores?.[rowIdx]?.[colIdx];
                      const score = typeof compatibility === 'number' ? compatibility : compatibility?.score;
                      
                      return (
                        <td key={colIdx} className="text-center py-3">
                          {rowIdx === colIdx ? (
                            <span className="text-white/30">-</span>
                          ) : score !== undefined ? (
                            <span
                              className={`px-3 py-1 rounded-lg border text-sm font-semibold ${getCompatibilityColor(score)}`}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-white/30">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {matrix.summary && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white mb-2">Summary</h4>
              <p className="text-white/80 text-sm">{matrix.summary}</p>
            </div>
          )}
        </SpaceCard>
      )}
    </div>
  );
}

