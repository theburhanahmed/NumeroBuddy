'use client';

import React, { useState } from 'react';
import { fengShuiHybridAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Compass } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { useToast } from '@/components/ui/use-toast';

export function SpaceOptimizer() {
  const [analysisId, setAnalysisId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [direction, setDirection] = useState('');
  const [optimization, setOptimization] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!analysisId || !roomName) {
      setError('Analysis ID and room name are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fengShuiHybridAPI.optimizeSpace({
        analysis_id: analysisId,
        room_data: {
          room_name: roomName,
          room_number: roomNumber || undefined,
          direction: direction || undefined,
        },
      });
      setOptimization(data);
      toast({
        title: 'Optimization Complete',
        description: 'Space optimization completed successfully',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to optimize space';
      setError(errorMessage);
      toast({
        title: 'Optimization Failed',
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
        <h2 className="text-2xl font-bold text-white mb-2">Space Optimizer</h2>
        <p className="text-white/70">Optimize room layouts and arrangements based on Feng Shui × Numerology</p>
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

          <div>
            <label className="block text-white/70 text-sm mb-2">Room Name *</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g., Living Room, Bedroom, Office"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Room Number (Optional)</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Room number"
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Direction (Optional)</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Select direction</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="northeast">Northeast</option>
                <option value="northwest">Northwest</option>
                <option value="southeast">Southeast</option>
                <option value="southwest">Southwest</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <TouchOptimizedButton
            onClick={handleOptimize}
            disabled={loading || !analysisId || !roomName}
            variant="primary"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 mr-2" />
                Optimize Space
              </>
            )}
          </TouchOptimizedButton>
        </div>
      </SpaceCard>

      {optimization && optimization.optimization && (
        <SpaceCard variant="premium" className="p-6" glow>
          <h3 className="text-xl font-bold text-white mb-4">Optimization Results</h3>
          
          {optimization.optimization.color_recommendations && optimization.optimization.color_recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Recommended Colors</h4>
              <div className="flex flex-wrap gap-2">
                {optimization.optimization.color_recommendations.map((color: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {optimization.optimization.layout_suggestions && optimization.optimization.layout_suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Layout Suggestions</h4>
              <ul className="space-y-1">
                {optimization.optimization.layout_suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="text-white/80 text-sm">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </SpaceCard>
      )}
    </div>
  );
}

