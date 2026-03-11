'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { mentalStateAIAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { Loader2, Brain, AlertTriangle, TrendingUp, Heart, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { EmotionalStateTracker } from '@/components/numerology/emotional-state-tracker';
import { StressPatternChart } from '@/components/numerology/stress-pattern-chart';
import { WellbeingRecommendations } from '@/components/numerology/wellbeing-recommendations';
import { MoodCyclePredictor } from '@/components/numerology/mood-cycle-predictor';

type TabType = 'overview' | 'tracker' | 'stress-patterns' | 'wellbeing' | 'mood-predictions';

export default function MentalStateNumerologyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Brain },
    { id: 'tracker' as TabType, label: 'Track Emotions', icon: Heart },
    { id: 'stress-patterns' as TabType, label: 'Stress Patterns', icon: TrendingUp },
    { id: 'wellbeing' as TabType, label: 'Wellbeing', icon: Heart },
    { id: 'mood-predictions' as TabType, label: 'Mood Predictions', icon: Calendar },
  ];

  return (
    <CosmicPageLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mental State Numerology</h1>
            <p className="text-white/70">Track emotions, identify patterns, and optimize wellbeing using numerology</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-white/10">
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
                        ? 'border-cyan-500 text-cyan-400'
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
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SpaceCard variant="elevated" className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Mental State Overview</h2>
                  <p className="text-white/80 mb-6">
                    Track your emotional state, identify stress patterns correlated with numerology cycles,
                    and receive personalized wellbeing recommendations based on your numerology profile.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SpaceCard variant="outlined" className="p-4">
                      <Heart className="w-6 h-6 text-pink-400 mb-2" />
                      <h3 className="text-lg font-semibold text-white mb-2">Emotional Tracking</h3>
                      <p className="text-white/70 text-sm">Track daily emotional states and mood patterns</p>
                    </SpaceCard>
                    
                    <SpaceCard variant="outlined" className="p-4">
                      <TrendingUp className="w-6 h-6 text-red-400 mb-2" />
                      <h3 className="text-lg font-semibold text-white mb-2">Stress Patterns</h3>
                      <p className="text-white/70 text-sm">Identify stress patterns and numerology correlations</p>
                    </SpaceCard>
                    
                    <SpaceCard variant="outlined" className="p-4">
                      <Heart className="w-6 h-6 text-green-400 mb-2" />
                      <h3 className="text-lg font-semibold text-white mb-2">Wellbeing Recommendations</h3>
                      <p className="text-white/70 text-sm">Get personalized wellbeing advice based on your cycles</p>
                    </SpaceCard>
                    
                    <SpaceCard variant="outlined" className="p-4">
                      <Calendar className="w-6 h-6 text-purple-400 mb-2" />
                      <h3 className="text-lg font-semibold text-white mb-2">Mood Predictions</h3>
                      <p className="text-white/70 text-sm">Predict mood cycles based on numerology</p>
                    </SpaceCard>
                  </div>
                </SpaceCard>
              </motion.div>
            )}

            {activeTab === 'tracker' && (
              <EmotionalStateTracker />
            )}

            {activeTab === 'stress-patterns' && (
              <StressPatternChart />
            )}

            {activeTab === 'wellbeing' && (
              <WellbeingRecommendations />
            )}

            {activeTab === 'mood-predictions' && (
              <MoodCyclePredictor />
            )}
          </div>
        </motion.div>
      </div>
    </CosmicPageLayout>
  );
}
