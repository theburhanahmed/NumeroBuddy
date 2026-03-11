'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Calendar, Sparkles, BarChart3, User } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { numerologyAPI } from '@/lib/numerology-api';

interface Activity {
  id: string;
  type: 'report_generated' | 'daily_reading' | 'remedy_completed' | 'visualization_viewed' | 'profile_updated';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities?: Activity[];
  limit?: number;
}

export function ActivityFeed({ activities: providedActivities, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(providedActivities || []);
  const [loading, setLoading] = useState(!providedActivities);

  useEffect(() => {
    if (!providedActivities) {
      fetchActivities();
    }
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getDashboardActivity({ limit });
      const list = response?.activities ?? (Array.isArray(response) ? response : []);
      setActivities(list);
    } catch (error: any) {
      console.error('Failed to fetch activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report_generated':
      case 'report': return FileText;
      case 'daily_reading':
      case 'reading': return Calendar;
      case 'remedy_completed':
      case 'remedy': return Sparkles;
      case 'visualization_viewed': return BarChart3;
      case 'profile_updated': return User;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'report_generated':
      case 'report': return 'text-purple-400';
      case 'daily_reading':
      case 'reading': return 'text-cyan-400';
      case 'remedy_completed':
      case 'remedy': return 'text-green-400';
      case 'visualization_viewed': return 'text-yellow-400';
      case 'profile_updated': return 'text-blue-400';
      default: return 'text-white/70';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SpaceCard variant="premium" className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </SpaceCard>
    );
  }

  return (
    <SpaceCard variant="premium" className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Recent Activity
        </h2>
      </div>

      <div className="space-y-3">
        {activities.slice(0, limit).map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const iconColor = getActivityColor(activity.type);
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 bg-[#1a2942]/40 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm mb-1">{activity.title}</h3>
                    <p className="text-xs text-white/70 line-clamp-2">{activity.description}</p>
                  </div>
                  <span className="text-xs text-white/50 whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No recent activity
        </div>
      )}
    </SpaceCard>
  );
}