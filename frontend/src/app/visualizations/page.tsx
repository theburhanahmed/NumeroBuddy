'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Calendar, Grid3x3, Box } from 'lucide-react';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { SpaceCard } from '@/components/space/space-card';
import { NumerologyWheel } from '@/components/numerology/numerology-wheel';
import { NumerologyTimeline } from '@/components/numerology/numerology-timeline';
import { ComparisonCharts } from '@/components/numerology/comparison-charts';
import { NumerologyHeatmap } from '@/components/numerology/numerology-heatmap';
import { Numerology3DVisualization } from '@/components/numerology/3d-numerology-visualization';
import { useAuth } from '@/contexts/auth-context';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { useSubscription } from '@/contexts/SubscriptionContext';

type VisualizationTab = 'wheel' | 'timeline' | 'comparison' | 'heatmap' | '3d';

export default function VisualizationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [activeTab, setActiveTab] = useState<VisualizationTab>('wheel');

  const tabs = [
    { id: 'wheel' as VisualizationTab, label: 'Wheel', icon: Sparkles },
    { id: 'timeline' as VisualizationTab, label: 'Timeline', icon: Calendar },
    { id: 'comparison' as VisualizationTab, label: 'Comparison', icon: BarChart3 },
    { id: 'heatmap' as VisualizationTab, label: 'Heatmap', icon: Grid3x3 },
    { id: '3d' as VisualizationTab, label: '3D View', icon: Box },
  ];

  return (
    <CosmicPageLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Numerology Visualizations
            </h1>
            <p className="text-white/70">
              Interactive visualizations of your numerology profile
            </p>
          </div>

          <SubscriptionGate feature="numerology_visualizations" requiredTier="premium" showPreview={tier === 'free'}>
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                          : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Visualization Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'wheel' && <NumerologyWheel />}
              {activeTab === 'timeline' && <NumerologyTimeline />}
              {activeTab === 'comparison' && <ComparisonCharts />}
              {activeTab === 'heatmap' && <NumerologyHeatmap />}
              {activeTab === '3d' && <Numerology3DVisualization />}
            </motion.div>
          </SubscriptionGate>
        </motion.div>
      </div>
    </CosmicPageLayout>
  );
}