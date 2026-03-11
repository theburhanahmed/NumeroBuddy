'use client';

import React, { useState } from 'react';
import { mentalStateAIAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { Loader2, Heart } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export function EmotionalStateTracker() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(50);
  const [moodScore, setMoodScore] = useState(50);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTrack = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mentalStateAIAPI.trackMentalState({
        date,
        emotional_state: emotionalState,
        stress_level: stressLevel,
        mood_score: moodScore,
        notes: notes || undefined,
      });
      
      toast({
        title: 'State Tracked',
        description: 'Your emotional state has been recorded successfully',
      });
      
      // Reset form
      setEmotionalState('neutral');
      setStressLevel(50);
      setMoodScore(50);
      setNotes('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to track emotional state';
      setError(errorMessage);
      toast({
        title: 'Tracking Failed',
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
        <h2 className="text-2xl font-bold text-white mb-2">Track Emotional State</h2>
        <p className="text-white/70">Record your daily emotional state to identify patterns with numerology cycles</p>
      </div>

      <SpaceCard variant="elevated" className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Emotional State</label>
            <select
              value={emotionalState}
              onChange={(e) => setEmotionalState(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="very_positive">Very Positive</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
              <option value="very_negative">Very Negative</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Stress Level: {stressLevel}/100</label>
            <input
              type="range"
              min="0"
              max="100"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Mood Score: {moodScore}/100</label>
            <input
              type="range"
              min="0"
              max="100"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any additional notes about your emotional state..."
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <TouchOptimizedButton
            onClick={handleTrack}
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Tracking...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Track Emotional State
              </>
            )}
          </TouchOptimizedButton>
        </div>
      </SpaceCard>
    </div>
  );
}

