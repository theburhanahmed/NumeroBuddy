'use client';

import React, { useState, useEffect } from 'react';
import { TimingCyclesHub } from '@/components/navigation/hubs/timing-cycles-hub';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { Loader2, Calendar, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { enhancedCyclesAPI } from '@/lib/numerology-api';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

type TabType = 'essence' | 'timeline' | 'universal';

export default function PersonalCyclesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('essence');
  const [essenceCycles, setEssenceCycles] = useState<any>(null);
  const [cycleTimeline, setCycleTimeline] = useState<any>(null);
  const [universalCycles, setUniversalCycles] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timelineParams, setTimelineParams] = useState({ start_year: new Date().getFullYear(), end_year: new Date().getFullYear() + 5 });
  const [universalParams, setUniversalParams] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });

  useEffect(() => {
    if (activeTab === 'essence' && !essenceCycles) {
      fetchEssenceCycles();
    } else if (activeTab === 'timeline' && !cycleTimeline) {
      fetchCycleTimeline();
    } else if (activeTab === 'universal' && !universalCycles) {
      fetchUniversalCycles();
    }
  }, [activeTab]);

  const fetchEssenceCycles = async () => {
    try {
      setLoading(true);
      const data = await enhancedCyclesAPI.getEssenceCycles();
      setEssenceCycles(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load essence cycles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCycleTimeline = async () => {
    try {
      setLoading(true);
      const data = await enhancedCyclesAPI.getCycleTimeline(timelineParams);
      setCycleTimeline(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load cycle timeline',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversalCycles = async () => {
    try {
      setLoading(true);
      const data = await enhancedCyclesAPI.getUniversalCycles(universalParams);
      setUniversalCycles(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load universal cycles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'essence' as TabType, label: 'Essence Cycles', icon: Sparkles },
    { id: 'timeline' as TabType, label: 'Cycle Timeline', icon: Calendar },
    { id: 'universal' as TabType, label: 'Universal Cycles', icon: TrendingUp },
  ];

  return (
    <TimingCyclesHub>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Personal Cycles
          </h1>
          <p className="text-white/70">
            Explore your essence cycles, cycle timeline, and universal cycles
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-yellow-500/20">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                    border-b-2 whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-400'
                      : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/20'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {loading ? (
            <SpaceCard variant="premium" className="p-12 text-center" glow>
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
              <p className="text-white/70">Loading cycles...</p>
            </SpaceCard>
          ) : (
            <>
              {activeTab === 'essence' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <SpaceCard variant="premium" className="p-6" glow>
                    <h2 className="text-2xl font-bold text-white mb-4">Essence Cycles</h2>
                    {essenceCycles ? (
                      <div className="space-y-4">
                        {essenceCycles.cycles && essenceCycles.cycles.length > 0 ? (
                          essenceCycles.cycles.map((cycle: any, index: number) => (
                            <div key={index} className="p-4 bg-[#1a2942]/60 rounded-xl border border-yellow-500/20">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {cycle.name || `Cycle ${index + 1}`}
                                </h3>
                                {cycle.number && (
                                  <span className="text-2xl font-bold text-yellow-400">{cycle.number}</span>
                                )}
                              </div>
                              {cycle.description && (
                                <p className="text-white/70 mb-2">{cycle.description}</p>
                              )}
                              {cycle.start_date && cycle.end_date && (
                                <p className="text-sm text-white/60">
                                  {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-white/70">
                            No essence cycles data available
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TouchOptimizedButton variant="primary" onClick={fetchEssenceCycles}>
                          Load Essence Cycles
                        </TouchOptimizedButton>
                      </div>
                    )}
                  </SpaceCard>
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <SpaceCard variant="premium" className="p-6" glow>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">Cycle Timeline</h2>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={timelineParams.start_year}
                          onChange={(e) => setTimelineParams({ ...timelineParams, start_year: parseInt(e.target.value) })}
                          className="w-24 px-3 py-2 bg-[#0a1628] border border-yellow-500/30 rounded-lg text-white text-sm"
                          placeholder="Start Year"
                        />
                        <span className="text-white/70 self-center">-</span>
                        <input
                          type="number"
                          value={timelineParams.end_year}
                          onChange={(e) => setTimelineParams({ ...timelineParams, end_year: parseInt(e.target.value) })}
                          className="w-24 px-3 py-2 bg-[#0a1628] border border-yellow-500/30 rounded-lg text-white text-sm"
                          placeholder="End Year"
                        />
                        <TouchOptimizedButton variant="secondary" size="sm" onClick={fetchCycleTimeline}>
                          Update
                        </TouchOptimizedButton>
                      </div>
                    </div>
                    {cycleTimeline ? (
                      <div className="space-y-4">
                        {cycleTimeline.timeline && cycleTimeline.timeline.length > 0 ? (
                          cycleTimeline.timeline.map((item: any, index: number) => (
                            <div key={index} className="p-4 bg-[#1a2942]/60 rounded-xl border border-yellow-500/20">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {item.year || item.period || `Period ${index + 1}`}
                                </h3>
                                {item.cycle_number && (
                                  <span className="text-xl font-bold text-yellow-400">{item.cycle_number}</span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-white/70">{item.description}</p>
                              )}
                              {item.key_events && item.key_events.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-yellow-500/20">
                                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">Key Events</h4>
                                  <ul className="space-y-1">
                                    {item.key_events.map((event: string, i: number) => (
                                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                                        {event}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-white/70">
                            No timeline data available
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TouchOptimizedButton variant="primary" onClick={fetchCycleTimeline}>
                          Load Cycle Timeline
                        </TouchOptimizedButton>
                      </div>
                    )}
                  </SpaceCard>
                </motion.div>
              )}

              {activeTab === 'universal' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <SpaceCard variant="premium" className="p-6" glow>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">Universal Cycles</h2>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={universalParams.year}
                          onChange={(e) => setUniversalParams({ ...universalParams, year: parseInt(e.target.value) })}
                          className="w-20 px-3 py-2 bg-[#0a1628] border border-yellow-500/30 rounded-lg text-white text-sm"
                          placeholder="Year"
                        />
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={universalParams.month}
                          onChange={(e) => setUniversalParams({ ...universalParams, month: parseInt(e.target.value) })}
                          className="w-20 px-3 py-2 bg-[#0a1628] border border-yellow-500/30 rounded-lg text-white text-sm"
                          placeholder="Month"
                        />
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={universalParams.day}
                          onChange={(e) => setUniversalParams({ ...universalParams, day: parseInt(e.target.value) })}
                          className="w-20 px-3 py-2 bg-[#0a1628] border border-yellow-500/30 rounded-lg text-white text-sm"
                          placeholder="Day"
                        />
                        <TouchOptimizedButton variant="secondary" size="sm" onClick={fetchUniversalCycles}>
                          Update
                        </TouchOptimizedButton>
                      </div>
                    </div>
                    {universalCycles ? (
                      <div className="space-y-4">
                        {universalCycles.cycles && Object.keys(universalCycles.cycles).length > 0 ? (
                          Object.entries(universalCycles.cycles).map(([key, value]: [string, any]) => (
                            <div key={key} className="p-4 bg-[#1a2942]/60 rounded-xl border border-yellow-500/20">
                              <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                                {key.replace(/_/g, ' ')}
                              </h3>
                              {typeof value === 'object' && value !== null ? (
                                <div className="space-y-2">
                                  {value.number && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-white/70">Number:</span>
                                      <span className="text-xl font-bold text-yellow-400">{value.number}</span>
                                    </div>
                                  )}
                                  {value.meaning && (
                                    <p className="text-white/70">{value.meaning}</p>
                                  )}
                                  {value.influence && (
                                    <p className="text-sm text-white/60 italic">{value.influence}</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-white/70">{String(value)}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-white/70">
                            No universal cycles data available
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TouchOptimizedButton variant="primary" onClick={fetchUniversalCycles}>
                          Load Universal Cycles
                        </TouchOptimizedButton>
                      </div>
                    )}
                  </SpaceCard>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </TimingCyclesHub>
  );
}

