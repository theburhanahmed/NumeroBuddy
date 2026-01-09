'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Play, Pause, Trash2, Plus } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { reportAPI } from '@/lib/numerology-api';
import { peopleAPI } from '@/lib/numerology-api';

interface ScheduledReport {
  id: string;
  template_name: string;
  person_name: string;
  schedule_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_run_date: string;
  is_active: boolean;
  last_run_at?: string;
  created_at: string;
}

interface ScheduledReportsProps {
  onCreateSchedule?: () => void;
}

export function ScheduledReports({ onCreateSchedule }: ScheduledReportsProps) {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduledReports();
  }, []);

  const fetchScheduledReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.listScheduledReports();
      setScheduledReports(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch scheduled reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (scheduledReportId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await reportAPI.cancelScheduledReport(scheduledReportId);
      } else {
        // Reactivate would need a separate endpoint
        alert('Reactivation not yet implemented');
      }
      fetchScheduledReports();
    } catch (error) {
      console.error('Failed to toggle scheduled report:', error);
      alert('Failed to update scheduled report');
    }
  };

  const handleDelete = async (scheduledReportId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled report?')) return;

    try {
      await reportAPI.cancelScheduledReport(scheduledReportId);
      fetchScheduledReports();
    } catch (error) {
      console.error('Failed to delete scheduled report:', error);
      alert('Failed to delete scheduled report');
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            Scheduled Reports
          </h2>
          <TouchOptimizedButton
            variant="primary"
            onClick={onCreateSchedule}
            icon={<Plus className="w-4 h-4" />}
          >
            Schedule Report
          </TouchOptimizedButton>
        </div>
        <p className="text-white/70">Automatically generate reports on a schedule</p>
      </div>

      {/* Scheduled Reports List */}
      <div className="space-y-4">
        {scheduledReports.map((scheduledReport) => (
          <motion.div
            key={scheduledReport.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              scheduledReport.is_active
                ? 'bg-[#1a2942]/40 border-cyan-500/30'
                : 'bg-[#1a2942]/20 border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {scheduledReport.template_name}
                </h3>
                <p className="text-sm text-white/70">
                  For: {scheduledReport.person_name}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                scheduledReport.is_active
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {scheduledReport.is_active ? 'Active' : 'Paused'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <div className="text-white/60 mb-1">Frequency</div>
                <div className="text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getFrequencyLabel(scheduledReport.schedule_frequency)}
                </div>
              </div>
              <div>
                <div className="text-white/60 mb-1">Next Run</div>
                <div className="text-white">
                  {new Date(scheduledReport.next_run_date).toLocaleDateString()}
                </div>
              </div>
              {scheduledReport.last_run_at && (
                <div>
                  <div className="text-white/60 mb-1">Last Run</div>
                  <div className="text-white">
                    {new Date(scheduledReport.last_run_at).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div>
                <div className="text-white/60 mb-1">Created</div>
                <div className="text-white">
                  {new Date(scheduledReport.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <TouchOptimizedButton
                variant="secondary"
                size="sm"
                onClick={() => handleToggleActive(scheduledReport.id, scheduledReport.is_active)}
                icon={scheduledReport.is_active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              >
                {scheduledReport.is_active ? 'Pause' : 'Resume'}
              </TouchOptimizedButton>
              <TouchOptimizedButton
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(scheduledReport.id)}
                icon={<Trash2 className="w-3 h-3" />}
              >
                Delete
              </TouchOptimizedButton>
            </div>
          </motion.div>
        ))}
      </div>

      {scheduledReports.length === 0 && (
        <div className="text-center py-12 text-white/50">
          No scheduled reports. Click "Schedule Report" to create one.
        </div>
      )}
    </SpaceCard>
  );
}