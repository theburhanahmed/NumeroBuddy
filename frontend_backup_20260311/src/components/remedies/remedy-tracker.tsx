'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, XCircle, TrendingUp, Smile, Frown } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI } from '@/lib/numerology-api';

interface RemedyTracking {
  id: string;
  remedy_name: string;
  date: string;
  is_completed: boolean;
  notes?: string;
  effectiveness_rating?: number;
  mood_before?: string;
  mood_after?: string;
}

interface RemedyTrackerProps {
  remedyId?: string;
}

export function RemedyTracker({ remedyId }: RemedyTrackerProps) {
  const [trackings, setTrackings] = useState<RemedyTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    remedy_id: remedyId || '',
    date: selectedDate,
    is_completed: true,
    notes: '',
    effectiveness_rating: 5,
    mood_before: '',
    mood_after: '',
  });

  useEffect(() => {
    if (remedyId) {
      fetchRemedyTrackings(remedyId);
    } else {
      fetchAllTrackings();
    }
  }, [remedyId]);

  const fetchRemedyTrackings = async (id: string) => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getRemedyTrackings({ remedy_id: id });
      setTrackings(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch remedy trackings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTrackings = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getRemedyTrackings();
      setTrackings(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch trackings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await numerologyAPI.trackRemedyProgress({
        remedy_id: formData.remedy_id,
        date: formData.date,
        is_completed: formData.is_completed,
        notes: formData.notes,
        effectiveness_rating: formData.effectiveness_rating,
        mood_before: formData.mood_before || undefined,
        mood_after: formData.mood_after || undefined,
      });
      setShowAddForm(false);
      if (remedyId) {
        fetchRemedyTrackings(remedyId);
      } else {
        fetchAllTrackings();
      }
      // Reset form
      setFormData({
        remedy_id: remedyId || '',
        date: new Date().toISOString().split('T')[0],
        is_completed: true,
        notes: '',
        effectiveness_rating: 5,
        mood_before: '',
        mood_after: '',
      });
    } catch (error) {
      console.error('Failed to track remedy:', error);
      alert('Failed to save tracking');
    }
  };

  const completionRate = trackings.length > 0
    ? (trackings.filter(t => t.is_completed).length / trackings.length) * 100
    : 0;

  const averageEffectiveness = trackings
    .filter(t => t.effectiveness_rating)
    .reduce((sum, t) => sum + (t.effectiveness_rating || 0), 0) /
    trackings.filter(t => t.effectiveness_rating).length || 0;

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            Remedy Tracker
          </h2>
          <TouchOptimizedButton
            variant="primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Entry'}
          </TouchOptimizedButton>
        </div>
        <p className="text-white/70">Track your remedy practice and effectiveness</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">Total Entries</div>
          <div className="text-2xl font-bold text-white">{trackings.length}</div>
        </div>
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">Completion Rate</div>
          <div className="text-2xl font-bold text-cyan-400">{Math.round(completionRate)}%</div>
        </div>
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">Avg Effectiveness</div>
          <div className="text-2xl font-bold text-purple-400">
            {averageEffectiveness > 0 ? averageEffectiveness.toFixed(1) : 'N/A'}
          </div>
        </div>
        <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-1">This Week</div>
          <div className="text-2xl font-bold text-white">
            {trackings.filter(t => {
              const date = new Date(t.date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return date >= weekAgo;
            }).length}
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-[#1a2942]/40 rounded-xl border border-cyan-500/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Completed</label>
              <select
                value={formData.is_completed ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, is_completed: e.target.value === 'true' })}
                className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Effectiveness Rating (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.effectiveness_rating}
                onChange={(e) => setFormData({ ...formData, effectiveness_rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Mood Before</label>
              <input
                type="text"
                value={formData.mood_before}
                onChange={(e) => setFormData({ ...formData, mood_before: e.target.value })}
                placeholder="e.g., anxious, calm"
                className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Mood After</label>
              <input
                type="text"
                value={formData.mood_after}
                onChange={(e) => setFormData({ ...formData, mood_after: e.target.value })}
                placeholder="e.g., relaxed, energized"
                className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
              placeholder="Add any notes about your experience..."
            />
          </div>
          <TouchOptimizedButton variant="primary" type="submit">
            Save Entry
          </TouchOptimizedButton>
        </motion.form>
      )}

      {/* Tracking List */}
      <div className="space-y-3">
        {trackings.map((tracking) => (
          <motion.div
            key={tracking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                {tracking.is_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{tracking.remedy_name}</h3>
                  <div className="text-sm text-white/60">
                    {new Date(tracking.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {tracking.effectiveness_rating && (
                <div className="flex items-center gap-1 text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{tracking.effectiveness_rating}/10</span>
                </div>
              )}
            </div>

            {(tracking.mood_before || tracking.mood_after) && (
              <div className="flex items-center gap-4 mb-2 text-sm">
                {tracking.mood_before && (
                  <div className="flex items-center gap-1 text-white/70">
                    <Frown className="w-4 h-4" />
                    <span>Before: {tracking.mood_before}</span>
                  </div>
                )}
                {tracking.mood_after && (
                  <div className="flex items-center gap-1 text-white/70">
                    <Smile className="w-4 h-4" />
                    <span>After: {tracking.mood_after}</span>
                  </div>
                )}
              </div>
            )}

            {tracking.notes && (
              <p className="text-sm text-white/70 mt-2">{tracking.notes}</p>
            )}
          </motion.div>
        ))}
      </div>

      {trackings.length === 0 && (
        <div className="text-center py-12 text-white/50">
          No tracking entries yet. Click "Add Entry" to start tracking.
        </div>
      )}
    </SpaceCard>
  );
}