'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { generationalNumerologyAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { Loader2, Users, AlertTriangle, GitBranch, Grid } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FamilyGenerations } from '@/components/numerology/family-generations';
import { KarmicContracts } from '@/components/numerology/karmic-contracts';
import { GenerationalPatterns } from '@/components/numerology/generational-patterns';
import { FamilyUnitMatrix } from '@/components/numerology/family-unit-matrix';

type TabType = 'overview' | 'generations' | 'karmic-contracts' | 'patterns' | 'compatibility';

export default function GenerationalNumerologyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [familyData, setFamilyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchFamilyAnalysis();
  }, [isAuthenticated, router]);

  const fetchFamilyAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generationalNumerologyAPI.getGenerationalFamilyAnalysis();
      setFamilyData(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load generational numerology';
      setError(errorMessage);
      
      if (err.response?.status === 403) {
        toast({
          title: 'Feature Not Available',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CosmicPageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
            <p className="text-white/70">Loading Generational Numerology...</p>
          </div>
        </div>
      </CosmicPageLayout>
    );
  }

  if (error) {
    return (
      <CosmicPageLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <SpaceCard variant="elevated" className="p-6 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">Error</h2>
            </div>
            <p className="text-white/70 mb-4">{error}</p>
            <TouchOptimizedButton onClick={fetchFamilyAnalysis} variant="primary">Retry</TouchOptimizedButton>
          </SpaceCard>
        </div>
      </CosmicPageLayout>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Users },
    { id: 'generations' as TabType, label: 'Generations', icon: GitBranch },
    { id: 'karmic-contracts' as TabType, label: 'Karmic Contracts', icon: Users },
    { id: 'patterns' as TabType, label: 'Patterns', icon: GitBranch },
    { id: 'compatibility' as TabType, label: 'Compatibility Matrix', icon: Grid },
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
            <h1 className="text-4xl font-bold text-white mb-2">Generational Numerology</h1>
            <p className="text-white/70">Analyze family patterns, karmic contracts, and generational dynamics</p>
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
                  <h2 className="text-2xl font-bold text-white mb-4">Family Overview</h2>
                  {familyData?.generational_number && (
                    <div className="mb-6">
                      <p className="text-white/70 mb-2">Generational Number</p>
                      <p className="text-4xl font-bold text-cyan-400">{familyData.generational_number}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <SpaceCard variant="outlined" className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Family Members</h3>
                      <p className="text-white/70">Add family members to begin analysis</p>
                    </SpaceCard>
                  </div>
                </SpaceCard>
              </motion.div>
            )}

            {activeTab === 'generations' && (
              <FamilyGenerations />
            )}

            {activeTab === 'karmic-contracts' && (
              <KarmicContracts />
            )}

            {activeTab === 'patterns' && (
              <GenerationalPatterns />
            )}

            {activeTab === 'compatibility' && (
              <FamilyUnitMatrix />
            )}
          </div>
        </motion.div>
      </div>
    </CosmicPageLayout>
  );
}
