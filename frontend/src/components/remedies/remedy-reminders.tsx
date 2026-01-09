'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI } from '@/lib/numerology-api';

interface RemedyReminder {
  id: string;
  remedy_name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  reminder_time: string;
  is_active: boolean;
  days_of_week?: number[];
  created_at: string;
}

interface RemedyRemindersProps {
  remedyId?: string;
}

export function RemedyReminders({ remedyId }: RemedyRemindersProps) {
  const [reminders, setReminders] = useState<RemedyReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    remedy_id: remedyId || '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    reminder_time: '09:00',
    days_of_week: [] as number[],
  });

  useEffect(() => {
    if (remedyId) {
      fetchRemedyReminders(remedyId);
    } else {
      fetchAllReminders();
    }
  }, [remedyId]);

  const fetchRemedyReminders = async (id: string) => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getRemedyReminders({ remedy_id: id });
      setReminders(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReminders = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getRemedyReminders();
      setReminders(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await numerologyAPI.scheduleRemedyReminder({
        remedy_id: formData.remedy_id,
        frequency: formData.frequency,
        reminder_time: formData.reminder_time,
        days_of_week: formData.frequency === 'weekly' ? formData.days_of_week : undefined,
      });
      setShowAddForm(false);
      if (remedyId) {
        fetchRemedyReminders(remedyId);
      } else {
        fetchAllReminders();
      }
      // Reset form
      setFormData({
        remedy_id: remedyId || '',
        frequency: 'daily',
        reminder_time: '09:00',
        days_of_week: [],
      });
    } catch (error) {
      console.error('Failed to create reminder:', error);
      alert('Failed to create reminder');
    }
  };

  const handleToggleActive = async (reminderId: string, isActive: boolean) => {
    try {
      // This would need an update endpoint
      alert('Toggle functionality not yet implemented');
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
    }
  };

  const handleDelete = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await numerologyAPI.deleteRemedyReminder(reminderId);
      if (remedyId) {
        fetchRemedyReminders(remedyId);
      } else {
        fetchAllReminders();
      }
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      alert('Failed to delete reminder');
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            <Bell className="w-6 h-6 text-cyan-400" />
            Remedy Reminders
          </h2>
          <TouchOptimizedButton
            variant="primary"
            onClick={() => setShowAddForm(!showAddForm)}
            icon={<Plus className="w-4 h-4" />}
          >
            {showAddForm ? 'Cancel' : 'Add Reminder'}
          </TouchOptimizedButton>
        </div>
        <p className="text-white/70">Set reminders to practice your remedies regularly</p>
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
              <label className="block text-sm font-medium text-white/80 mb-2">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({
                  ...formData,
                  frequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                  days_of_week: e.target.value === 'weekly' ? formData.days_of_week : [],
                })}
                className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Reminder Time</label>
              <input
                type="time"
                value={formData.reminder_time}
                onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {formData.frequency === 'weekly' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-2">Days of Week</label>
              <div className="flex gap-2 flex-wrap">
                {dayNames.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const days = formData.days_of_week.includes(idx)
                        ? formData.days_of_week.filter(d => d !== idx)
                        : [...formData.days_of_week, idx];
                      setFormData({ ...formData, days_of_week: days });
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      formData.days_of_week.includes(idx)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-[#0a1629]/60 text-white/70 hover:bg-[#1a2942]/60'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <TouchOptimizedButton variant="primary" type="submit">
            Create Reminder
          </TouchOptimizedButton>
        </motion.form>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              reminder.is_active
                ? 'bg-[#1a2942]/40 border-cyan-500/30'
                : 'bg-[#1a2942]/20 border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{reminder.remedy_name}</h3>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{reminder.reminder_time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{getFrequencyLabel(reminder.frequency)}</span>
                  </div>
                  {reminder.frequency === 'weekly' && reminder.days_of_week && (
                    <div className="flex gap-1">
                      {reminder.days_of_week.map((day) => (
                        <span key={day} className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">
                          {dayNames[day]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                reminder.is_active
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {reminder.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="flex gap-2">
              <TouchOptimizedButton
                variant="secondary"
                size="sm"
                onClick={() => handleToggleActive(reminder.id, reminder.is_active)}
              >
                {reminder.is_active ? 'Pause' : 'Activate'}
              </TouchOptimizedButton>
              <TouchOptimizedButton
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(reminder.id)}
                icon={<Trash2 className="w-3 h-3" />}
              >
                Delete
              </TouchOptimizedButton>
            </div>
          </motion.div>
        ))}
      </div>

      {reminders.length === 0 && (
        <div className="text-center py-12 text-white/50">
          No reminders set. Click "Add Reminder" to create one.
        </div>
      )}
    </SpaceCard>
  );
}
