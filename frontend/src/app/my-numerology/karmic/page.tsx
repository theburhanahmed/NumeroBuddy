'use client';

import React, { useState, useEffect } from 'react';
import { MyNumerologyHub } from '@/components/navigation/hubs/my-numerology-hub';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI, spiritualNumerologyAPI } from '@/lib/numerology-api';
import { Loader2, Sparkles, AlertTriangle, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function KarmicPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [karmicTimeline, setKarmicTimeline] = useState<any>(null);
  const [spiritualProfile, setSpiritualProfile] = useState<any>(null);

  useEffect(() => {
    fetchKarmicData();
  }, []);

  const fetchKarmicData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileData, timeline, spiritual] = await Promise.all([
        numerologyAPI.getProfile().catch(() => null),
        spiritualNumerologyAPI.getKarmicTimeline(50).catch(() => null),
        spiritualNumerologyAPI.getSpiritualProfile().catch(() => null),
      ]);

      setProfile(profileData);
      setKarmicTimeline(timeline);
      setSpiritualProfile(spiritual);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load karmic analysis. Please calculate your numerology profile first.';
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
            <p className="text-white/70">Loading Karmic Analysis...</p>
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
          <TouchOptimizedButton onClick={fetchKarmicData} variant="primary">
            Retry
          </TouchOptimizedButton>
        </SpaceCard>
      </MyNumerologyHub>
    );
  }

  const karmicDebtNumbers = profile?.karmic_debt_number ? [profile.karmic_debt_number] : [];
  const karmicLessons = spiritualProfile?.karmic_lessons || [];

  return (
    <MyNumerologyHub>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Karmic Analysis</h2>
            <p className="text-white/70">Explore your karmic debts, lessons, and spiritual journey</p>
          </div>
        </div>

        {/* Karmic Debt Numbers */}
        {karmicDebtNumbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                Karmic Debt Numbers
              </h3>
              <p className="text-white/70 mb-4">
                Karmic debt numbers indicate lessons from past lives that need to be resolved in this lifetime.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {karmicDebtNumbers.map((debt: number, index: number) => (
                  <div key={index} className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-amber-400">{debt}</span>
                      <span className="text-white/70 text-sm">Karmic Debt</span>
                    </div>
                    {debt === 13 && (
                      <p className="text-white/80 text-sm">
                        Past misuse of power. Focus on service and humility.
                      </p>
                    )}
                    {debt === 14 && (
                      <p className="text-white/80 text-sm">
                        Past misuse of freedom. Focus on discipline and responsibility.
                      </p>
                    )}
                    {debt === 16 && (
                      <p className="text-white/80 text-sm">
                        Past misuse of ego. Focus on humility and spiritual growth.
                      </p>
                    )}
                    {debt === 19 && (
                      <p className="text-white/80 text-sm">
                        Past misuse of power over others. Focus on leadership through service.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SpaceCard>
          </motion.div>
        )}

        {/* Karmic Lessons */}
        {karmicLessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Karmic Lessons
              </h3>
              <p className="text-white/70 mb-4">
                These are numbers missing from your name, representing areas where you need to grow and develop.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {karmicLessons.map((lesson: any, index: number) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400 mb-2">
                      {lesson.number || lesson}
                    </div>
                    {lesson.meaning && (
                      <p className="text-white/80 text-sm">{lesson.meaning}</p>
                    )}
                    {lesson.description && (
                      <p className="text-white/70 text-xs mt-2">{lesson.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </SpaceCard>
          </motion.div>
        )}

        {/* Karmic Timeline */}
        {karmicTimeline && karmicTimeline.cycles && karmicTimeline.cycles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                Karmic Timeline
              </h3>
              <p className="text-white/70 mb-4">
                Your karmic cycles and themes throughout your life journey.
              </p>
              <div className="space-y-4">
                {karmicTimeline.cycles.map((cycle: any, index: number) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <h4 className="font-semibold text-white">
                        {cycle.karmic_theme || `Cycle ${index + 1}`}
                      </h4>
                    </div>
                    {cycle.period && (
                      <p className="text-white/70 text-sm mb-2">
                        {cycle.period}
                      </p>
                    )}
                    {cycle.lessons && (
                      <div className="mt-2">
                        <p className="text-white/80 text-sm">
                          <strong>Lessons:</strong> {Array.isArray(cycle.lessons) ? cycle.lessons.join(', ') : cycle.lessons}
                        </p>
                      </div>
                    )}
                    {cycle.description && (
                      <p className="text-white/70 text-sm mt-2">{cycle.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </SpaceCard>
          </motion.div>
        )}

        {/* No Data Message */}
        {karmicDebtNumbers.length === 0 && karmicLessons.length === 0 && (!karmicTimeline || !karmicTimeline.cycles || karmicTimeline.cycles.length === 0) && (
          <SpaceCard variant="premium" className="p-6">
            <p className="text-white/70 text-center">
              No karmic data available. Please calculate your numerology profile first to see your karmic analysis.
            </p>
          </SpaceCard>
        )}
      </div>
    </MyNumerologyHub>
  );
}

