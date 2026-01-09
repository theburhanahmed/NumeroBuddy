'use client';

import React, { useState } from 'react';
import { fengShuiHybridAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Compass } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { useToast } from '@/components/ui/use-toast';

export function RoomNumerology() {
  const [analysisId, setAnalysisId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomAnalysis, setRoomAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!analysisId || !roomName) {
      setError('Analysis ID and room name are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fengShuiHybridAPI.getRoomNumerology(analysisId, {
        room_name: roomName,
        room_number: roomNumber || undefined,
      });
      if (data.success && data.room_numerology) {
        setRoomAnalysis(data.room_numerology);
        toast({
          title: 'Analysis Complete',
          description: 'Room numerology analysis completed successfully',
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to analyze room numerology';
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
        <h2 className="text-2xl font-bold text-white mb-2">Room Numerology</h2>
        <p className="text-white/70">Analyze individual room vibrations and numerology compatibility</p>
      </div>

      <SpaceCard variant="elevated" className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Analysis ID *</label>
            <input
              type="text"
              value={analysisId}
              onChange={(e) => setAnalysisId(e.target.value)}
              placeholder="Enter analysis ID"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Room Name *</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room name"
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

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
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <TouchOptimizedButton
            onClick={handleAnalyze}
            disabled={loading || !analysisId || !roomName}
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
                <Compass className="w-4 h-4 mr-2" />
                Analyze Room
              </>
            )}
          </TouchOptimizedButton>
        </div>
      </SpaceCard>

      {roomAnalysis && (
        <SpaceCard variant="premium" className="p-6" glow>
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Room Numerology Analysis</h3>
          </div>

          {roomAnalysis.room_vibration && (
            <div className="mb-6">
              <p className="text-white/70 text-sm mb-2">Room Vibration Number</p>
              <p className="text-5xl font-bold text-cyan-400">{roomAnalysis.room_vibration}</p>
            </div>
          )}

          {roomAnalysis.color_recommendations && roomAnalysis.color_recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Recommended Colors</h4>
              <div className="flex flex-wrap gap-2">
                {roomAnalysis.color_recommendations.map((color: string, i: number) => (
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

          {roomAnalysis.number_recommendations && roomAnalysis.number_recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Favorable Numbers</h4>
              <div className="flex flex-wrap gap-2">
                {roomAnalysis.number_recommendations.map((num: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold"
                  >
                    {typeof num === 'number' ? num : num.number || num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SpaceCard>
      )}
    </div>
  );
}

