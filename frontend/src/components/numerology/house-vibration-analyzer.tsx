'use client';

import React, { useState } from 'react';
import { fengShuiHybridAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { useToast } from '@/components/ui/use-toast';

export function HouseVibrationAnalyzer() {
  const [houseNumber, setHouseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!houseNumber) {
      setError('House number is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fengShuiHybridAPI.analyzeSpace({
        house_number: houseNumber,
        address: address || undefined,
      });
      setAnalysis(data);
      toast({
        title: 'Analysis Complete',
        description: 'House vibration analysis completed successfully',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to analyze house vibration';
      setError(errorMessage);
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">House Vibration Analysis</h2>
        <p className="text-white/70">Analyze your property's numerology vibration and Feng Shui compatibility</p>
      </div>

      <SpaceCard variant="elevated" className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">House/Flat Number *</label>
            <input
              type="text"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              placeholder="e.g., 123, 45A, 7B"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Property Address (Optional)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <TouchOptimizedButton
            onClick={handleAnalyze}
            disabled={loading || !houseNumber}
            variant="primary"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Home className="w-4 h-4 mr-2" />
                Analyze House Vibration
              </>
            )}
          </TouchOptimizedButton>
        </div>
      </SpaceCard>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SpaceCard variant="premium" className="p-6" glow>
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Analysis Results</h3>
            </div>

            {analysis.numerology_vibration && (
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-2">House Numerology Vibration</p>
                <p className="text-5xl font-bold text-cyan-400">{analysis.numerology_vibration}</p>
              </div>
            )}

            {analysis.hybrid_score !== undefined && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Overall Compatibility Score</span>
                  <span className="text-white font-semibold">{analysis.hybrid_score}/100</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    style={{ width: `${analysis.hybrid_score}%` }}
                  />
                </div>
              </div>
            )}

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: any, i: number) => (
                    <li key={i} className="text-white/80 text-sm">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </SpaceCard>
        </motion.div>
      )}
    </div>
  );
}

