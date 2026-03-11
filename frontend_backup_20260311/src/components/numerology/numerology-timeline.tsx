'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { CosmicTooltip } from '@/components/cosmic/cosmic-tooltip';
import { numerologyAPI } from '@/lib/numerology-api';

interface TimelineEvent {
  date: string;
  type: 'birth' | 'personal_year' | 'personal_month';
  label: string;
  year: number;
  personal_year?: number;
  personal_month?: number;
  personal_day?: number;
  is_cycle_transition?: boolean;
  is_pinnacle_transition?: boolean;
  age?: number;
}

interface NumerologyTimelineData {
  events: TimelineEvent[];
  current_position: number;
  birth_date: string;
  current_date: string;
  total_events: number;
  years_covered: number;
}

interface NumerologyTimelineProps {
  data?: NumerologyTimelineData;
  yearsAhead?: number;
}

export function NumerologyTimeline({ data, yearsAhead = 10 }: NumerologyTimelineProps) {
  const [timelineData, setTimelineData] = useState<NumerologyTimelineData | null>(data || null);
  const [loading, setLoading] = useState(!data);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'years' | 'months'>('all');

  useEffect(() => {
    if (!data) {
      fetchTimelineData();
    }
  }, [yearsAhead]);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getNumerologyTimeline({ years_ahead: yearsAhead });
      setTimelineData(response);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setLoading(false);
    }
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

  if (!timelineData) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="text-center text-white/70">Failed to load timeline</div>
      </SpaceCard>
    );
  }

  const filteredEvents = timelineData.events.filter(event => {
    if (viewMode === 'years') return event.type === 'personal_year' || event.type === 'birth';
    if (viewMode === 'months') return event.type === 'personal_month' || event.type === 'birth';
    return true;
  });

  const getEventColor = (event: TimelineEvent) => {
    if (event.type === 'birth') return 'from-purple-500 to-pink-600';
    if (event.is_pinnacle_transition) return 'from-yellow-500 to-orange-600';
    if (event.is_cycle_transition) return 'from-cyan-500 to-blue-600';
    if (event.type === 'personal_year') return 'from-blue-500 to-cyan-600';
    return 'from-gray-500 to-gray-600';
  };

  const getEventIcon = (event: TimelineEvent) => {
    if (event.type === 'birth') return Calendar;
    if (event.is_pinnacle_transition) return TrendingUp;
    if (event.is_cycle_transition) return AlertCircle;
    return Clock;
  };

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            Numerology Timeline
          </h2>
          <div className="flex gap-2">
            {(['all', 'years', 'months'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-cyan-500 text-white'
                    : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <p className="text-white/70">Life events and cycles visualized on a timeline</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500"></div>

        {/* Events */}
        <div className="space-y-6">
          {filteredEvents.map((event, idx) => {
            const Icon = getEventIcon(event);
            const colorClass = getEventColor(event);
            const isCurrent = idx === timelineData.current_position;
            const isPast = idx < timelineData.current_position;

            return (
              <motion.div
                key={`${event.date}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center shadow-lg ${
                  isCurrent ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-[#0a1629]' : ''
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Event content */}
                <div
                  className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-500/50'
                      : isPast
                      ? 'bg-[#1a2942]/40 border-white/10'
                      : 'bg-[#1a2942]/20 border-white/5'
                  }`}
                  onClick={() => setSelectedEvent(selectedEvent === event ? null : event)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{event.label}</h3>
                    <span className="text-sm text-white/60">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {event.personal_year && (
                    <div className="text-sm text-white/80">
                      Personal Year: <span className="font-semibold text-cyan-400">{event.personal_year}</span>
                    </div>
                  )}
                  
                  {event.personal_month && (
                    <div className="text-sm text-white/80">
                      Personal Month: <span className="font-semibold text-purple-400">{event.personal_month}</span>
                    </div>
                  )}

                  {event.is_cycle_transition && (
                    <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Cycle Transition
                    </div>
                  )}

                  {event.is_pinnacle_transition && (
                    <div className="mt-2 text-xs text-orange-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Pinnacle Transition
                    </div>
                  )}

                  {selectedEvent === event && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="text-sm text-white/70 space-y-1">
                        <div>Year: {event.year}</div>
                        {event.age !== undefined && <div>Age: {event.age}</div>}
                        {event.personal_day && <div>Personal Day: {event.personal_day}</div>}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current position indicator */}
      <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
        <div className="text-sm text-white/80">
          <span className="font-semibold text-cyan-400">Current Position: </span>
          {filteredEvents[timelineData.current_position]?.label || 'N/A'}
        </div>
      </div>
    </SpaceCard>
  );
}