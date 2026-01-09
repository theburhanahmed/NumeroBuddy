'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { SpaceButton } from '@/components/space/space-button';
import { numerologyAPI, Remedy } from '@/lib/numerology-api';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  remedy: Remedy;
  frequency: string;
  reminder_time: string;
  is_active: boolean;
  next_send_at: string;
}

export function ReminderSettings() {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    remedy_id: '',
    frequency: 'daily',
    reminder_time: '09:00',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [remediesData, remindersData] = await Promise.all([
        numerologyAPI.getPersonalizedRemedies(),
        numerologyAPI.getRemedyReminders(),
      ]);
      setRemedies(Array.isArray(remediesData) ? remediesData : []);
      setReminders(Array.isArray(remindersData) ? remindersData : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.remedy_id) {
      toast.error('Please select a remedy');
      return;
    }

    try {
      await numerologyAPI.createRemedyReminder({
        remedy_id: formData.remedy_id,
        frequency: formData.frequency,
        reminder_time: formData.reminder_time,
      });
      toast.success('Reminder created successfully!');
      setShowCreateModal(false);
      setFormData({ remedy_id: '', frequency: 'daily', reminder_time: '09:00' });
      fetchData();
    } catch (error) {
      console.error('Failed to create reminder:', error);
      toast.error('Failed to create reminder');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await numerologyAPI.deleteRemedyReminder(id);
      toast.success('Reminder deleted');
      fetchData();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  if (loading) {
    return (
      <SpaceCard className="p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      </SpaceCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Remedy Reminders</h3>
        <SpaceButton
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Reminder
        </SpaceButton>
      </div>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <SpaceCard className="p-8 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No reminders set. Create one to get started!</p>
        </SpaceCard>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SpaceCard className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-lg font-semibold text-white">
                        {reminder.remedy?.title || 'Unknown Remedy'}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          reminder.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {reminder.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4" />
                          Frequency
                        </div>
                        <div className="text-white capitalize">{reminder.frequency}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Time</div>
                        <div className="text-white">{reminder.reminder_time}</div>
                      </div>
                    </div>
                    {reminder.next_send_at && (
                      <div className="text-xs text-gray-500 mt-2">
                        Next reminder: {new Date(reminder.next_send_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <SpaceButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(reminder.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </SpaceButton>
                </div>
              </SpaceCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Create Reminder</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Remedy</label>
                <select
                  value={formData.remedy_id}
                  onChange={(e) => setFormData({ ...formData, remedy_id: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                >
                  <option value="">Select remedy...</option>
                  {remedies.map((remedy) => (
                    <option key={remedy.id} value={remedy.id}>
                      {remedy.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Time</label>
                <input
                  type="time"
                  value={formData.reminder_time}
                  onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                />
              </div>
              <div className="flex gap-3">
                <SpaceButton onClick={handleCreate} className="flex-1">
                  Create
                </SpaceButton>
                <SpaceButton
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </SpaceButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

