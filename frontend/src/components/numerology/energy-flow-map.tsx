'use client';

import React, { useState } from 'react';
import { fengShuiHybridAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Zap } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { useToast } from '@/components/ui/use-toast';

export function EnergyFlowMap() {
  const [analysisId, setAnalysisId] = useState('');
  const [energyFlow, setEnergyFlow] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!analysisId) {
      setError('Analysis ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fengShuiHybridAPI.getEnergyFlow(analysisId);
      if (data.success && data.energy_flow) {
        setEnergyFlow(data.energy_flow);
        toast({
          title: 'Analysis Complete',
          description: 'Energy flow analysis completed successfully',
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to analyze energy flow';
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
        <h2 className="text-2xl font-bold text-white mb-2">Energy Flow Map</h2>
        <p className="text-white/70">Visualize and optimize energy flow patterns in your space</p>
      </div>

      <SpaceCard variant="elevated" className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Analysis ID *</label>
            <input
              type="text"
              value={analysisId}
              onChange={(e) => setAnalysisId(e.target.value)}
              placeholder="Enter analysis ID from house analysis"
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
            disabled={loading || !analysisId}
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
                <Zap className="w-4 h-4 mr-2" />
                Analyze Energy Flow
              </>
            )}
          </TouchOptimizedButton>
        </div>
      </SpaceCard>

      {energyFlow && (
        <SpaceCard variant="premium" className="p-6" glow>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Energy Flow Analysis</h3>
          </div>

          {energyFlow.flow_score !== undefined && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">Energy Flow Score</span>
                <span className="text-white font-semibold">{energyFlow.flow_score}/100</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  style={{ width: `${energyFlow.flow_score}%` }}
                />
              </div>
            </div>
          )}

          {energyFlow.recommendations && energyFlow.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Energy Flow Recommendations</h4>
              <ul className="space-y-2">
                {energyFlow.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-white/80 text-sm">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </SpaceCard>
      )}
    </div>
  );
}

