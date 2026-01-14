'use client';

import React, { useState, useEffect } from 'react';
import { MyNumerologyHub } from '@/components/navigation/hubs/my-numerology-hub';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI } from '@/lib/numerology-api';
import { Loader2, MountainIcon, AlertTriangle, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PinnaclesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pinnaclesData, setPinnaclesData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [challengesData, setChallengesData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'pinnacles' | 'challenges' | 'timeline'>('pinnacles');

  useEffect(() => {
    fetchPinnaclesData();
  }, []);

  const fetchPinnaclesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pinnacles, timeline, challenges] = await Promise.all([
        numerologyAPI.getPinnaclesDetailed().catch(() => null),
        numerologyAPI.getPinnaclesTimeline().catch(() => null),
        numerologyAPI.getChallengeRemedies().catch(() => null),
      ]);

      setPinnaclesData(pinnacles);
      setTimelineData(timeline);
      setChallengesData(challenges);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load pinnacles and challenges data. Please calculate your numerology profile first.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MyNumerologyHub>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
            <p className="text-white/70">Loading Pinnacles & Challenges...</p>
          </div>
        </div>
      </MyNumerologyHub>
    );
  }

  if (error) {
    return (
      <MyNumerologyHub>
        <SpaceCard variant="elevated" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Error</h2>
          </div>
          <p className="text-white/70 mb-4">{error}</p>
          <TouchOptimizedButton onClick={fetchPinnaclesData} variant="primary">
            Retry
          </TouchOptimizedButton>
        </SpaceCard>
      </MyNumerologyHub>
    );
  }

  return (
    <MyNumerologyHub>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MountainIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Pinnacles & Challenges</h2>
            <p className="text-white/70">Discover your life cycles and growth opportunities</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('pinnacles')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'pinnacles'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Pinnacles
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'challenges'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Challenges
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'timeline'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Pinnacles Tab */}
        {activeTab === 'pinnacles' && pinnaclesData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {pinnaclesData.pinnacle_details && pinnaclesData.pinnacle_details.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {pinnaclesData.pinnacle_details.map((pinnacle: any, index: number) => (
                  <SpaceCard key={index} variant="premium" className="p-6" glow>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{pinnacle.number || pinnacle.pinnacle_number}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {pinnacle.pinnacle === 1 ? 'First' : pinnacle.pinnacle === 2 ? 'Second' : pinnacle.pinnacle === 3 ? 'Third' : 'Fourth'} Pinnacle
                        </h3>
                        <p className="text-white/70 text-sm">
                          Ages {pinnacle.start_age || pinnacle.age_start} - {pinnacle.end_age || pinnacle.age_end}
                        </p>
                      </div>
                    </div>
                    {pinnacle.meaning && (
                      <p className="text-white/90 mb-3">{pinnacle.meaning}</p>
                    )}
                    {pinnacle.characteristics && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white text-sm">Characteristics:</h4>
                        <ul className="space-y-1">
                          {Array.isArray(pinnacle.characteristics) ? (
                            pinnacle.characteristics.map((char: string, i: number) => (
                              <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                                {char}
                              </li>
                            ))
                          ) : (
                            <li className="text-white/80 text-sm">{pinnacle.characteristics}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </SpaceCard>
                ))}
              </div>
            ) : (
              <SpaceCard variant="premium" className="p-6">
                <p className="text-white/70">No pinnacle data available. Please calculate your numerology profile first.</p>
              </SpaceCard>
            )}
          </motion.div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {pinnaclesData?.challenges && pinnaclesData.challenges.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {pinnaclesData.challenges.map((challenge: any, index: number) => (
                  <SpaceCard key={index} variant="premium" className="p-6" glow>
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                      <h3 className="text-xl font-bold text-white">
                        Challenge {index + 1}
                      </h3>
                    </div>
                    {challenge.number && (
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-amber-400">{challenge.number}</span>
                      </div>
                    )}
                    {challenge.meaning && (
                      <p className="text-white/90 mb-3">{challenge.meaning}</p>
                    )}
                    {challenge.lesson && (
                      <div className="p-3 bg-amber-500/10 rounded-lg">
                        <p className="text-white/80 text-sm">
                          <strong>Lesson:</strong> {challenge.lesson}
                        </p>
                      </div>
                    )}
                  </SpaceCard>
                ))}
              </div>
            ) : challengesData ? (
              <SpaceCard variant="premium" className="p-6">
                <p className="text-white/70">No challenge data available.</p>
              </SpaceCard>
            ) : (
              <SpaceCard variant="premium" className="p-6">
                <p className="text-white/70">No challenge data available. Please calculate your numerology profile first.</p>
              </SpaceCard>
            )}

            {challengesData && challengesData.remedies && challengesData.remedies.length > 0 && (
              <SpaceCard variant="premium" className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Remedies for Challenges</h3>
                <div className="space-y-3">
                  {challengesData.remedies.map((remedy: any, index: number) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">{remedy.title || `Remedy ${index + 1}`}</h4>
                      {remedy.description && (
                        <p className="text-white/80 text-sm">{remedy.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </SpaceCard>
            )}
          </motion.div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && timelineData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpaceCard variant="premium" className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-400" />
                Pinnacle Timeline
              </h3>
              {timelineData.timeline && timelineData.timeline.length > 0 ? (
                <div className="space-y-4">
                  {timelineData.timeline.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white font-bold">{item.number || item.pinnacle_number}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {item.label || `Pinnacle ${index + 1}`}
                        </h4>
                        <p className="text-white/70 text-sm mb-2">
                          {item.start_age || item.age_start} - {item.end_age || item.age_end} years old
                        </p>
                        {item.description && (
                          <p className="text-white/80 text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No timeline data available.</p>
              )}
            </SpaceCard>
          </motion.div>
        )}
      </div>
    </MyNumerologyHub>
  );
}

