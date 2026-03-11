'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { fengShuiHybridAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { Loader2, Home, AlertTriangle, Compass, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { HouseVibrationAnalyzer } from '@/components/numerology/house-vibration-analyzer';
import { SpaceOptimizer } from '@/components/numerology/space-optimizer';
import { EnergyFlowMap } from '@/components/numerology/energy-flow-map';
import { RoomNumerology } from '@/components/numerology/room-numerology';

type TabType = 'overview' | 'house-analysis' | 'space-optimizer' | 'energy-flow' | 'room-numbers';

export default function FengShuiNumerologyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [analysis, setAnalysis] = useState<any>(null);
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
    { id: 'overview' as TabType, label: 'Overview', icon: Home },
    { id: 'house-analysis' as TabType, label: 'House Analysis', icon: Home },
    { id: 'space-optimizer' as TabType, label: 'Space Optimizer', icon: Compass },
    { id: 'energy-flow' as TabType, label: 'Energy Flow', icon: Zap },
    { id: 'room-numbers' as TabType, label: 'Room Numerology', icon: Compass },
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
            <h1 className="text-4xl font-bold text-white mb-2">Feng Shui × Numerology</h1>
            <p className="text-white/70">Harmonize your living space with numerology-based Feng Shui analysis</p>
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
                  <h2 className="text-2xl font-bold text-white mb-4">Feng Shui × Numerology Overview</h2>
                  <p className="text-white/80 mb-6">
                    Combine the ancient wisdom of Feng Shui with numerology to optimize your living or working space.
                    Analyze house vibrations, optimize room layouts, and enhance energy flow throughout your property.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SpaceCard variant="outlined" className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">House Vibration</h3>
                      <p className="text-white/70 text-sm">Analyze your property's numerology vibration</p>
                    </SpaceCard>
                    <SpaceCard variant="outlined" className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Space Optimization</h3>
                      <p className="text-white/70 text-sm">Optimize room layouts and arrangements</p>
                    </SpaceCard>
                    <SpaceCard variant="outlined" className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Energy Flow</h3>
                      <p className="text-white/70 text-sm">Map and enhance energy flow patterns</p>
                    </SpaceCard>
                    <SpaceCard variant="outlined" className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Room Numerology</h3>
                      <p className="text-white/70 text-sm">Analyze individual room vibrations</p>
                    </SpaceCard>
                  </div>
                </SpaceCard>
              </motion.div>
            )}

            {activeTab === 'house-analysis' && (
              <HouseVibrationAnalyzer />
            )}

            {activeTab === 'space-optimizer' && (
              <SpaceOptimizer />
            )}

            {activeTab === 'energy-flow' && (
              <EnergyFlowMap />
            )}

            {activeTab === 'room-numbers' && (
              <RoomNumerology />
            )}
          </div>
        </motion.div>
      </div>
    </CosmicPageLayout>
  );
}
