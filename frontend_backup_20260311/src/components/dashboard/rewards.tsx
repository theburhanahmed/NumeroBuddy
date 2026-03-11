'use client';

import React, { useState, useEffect } from 'react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { Trophy, Star, Gift, TrendingUp, Loader2, Award } from 'lucide-react';
import { rewardsAPI } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface RewardsProps {
  className?: string;
}

interface PointsData {
  total_points: number;
  available_points: number;
  lifetime_points: number;
  level?: number;
  next_level_points?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  unlocked_at?: string;
  points_awarded?: number;
}

interface RewardItem {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category?: string;
  icon?: string;
}

export function Rewards({ className }: RewardsProps) {
  const router = useRouter();
  const [points, setPoints] = useState<PointsData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'points' | 'achievements' | 'catalog'>('points');

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      setLoading(true);
      const [pointsData, achievementsData, catalogData] = await Promise.all([
        rewardsAPI.getUserPoints().catch(() => null),
        rewardsAPI.getUserAchievements().catch(() => null),
        rewardsAPI.getRewardCatalog().catch(() => null),
      ]);

      if (pointsData?.data) {
        setPoints(pointsData.data);
      }
      if (achievementsData?.data) {
        setAchievements(Array.isArray(achievementsData.data) ? achievementsData.data : []);
      }
      if (catalogData?.data) {
        setCatalog(Array.isArray(catalogData.data) ? catalogData.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SpaceCard variant="premium" className={`p-6 ${className}`} glow>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
        </div>
      </SpaceCard>
    );
  }

  return (
    <SpaceCard variant="premium" className={`p-6 ${className}`} glow>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Rewards & Achievements</h3>
            <p className="text-sm text-white/60">Track your progress and unlock rewards</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cyan-500/20 pb-4 mb-6">
        {[
          { id: 'points' as const, label: 'Points', icon: Star },
          { id: 'achievements' as const, label: 'Achievements', icon: Award },
          { id: 'catalog' as const, label: 'Catalog', icon: Gift },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-white/70 hover:text-white hover:bg-[#1a2942]/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'points' && (
          <div className="space-y-4">
            {points ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <p className="text-sm text-white/70">Available Points</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{points.available_points || 0}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-white/70">Lifetime Points</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{points.lifetime_points || 0}</p>
                  </motion.div>

                  {points.level && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-white/70">Level</p>
                      </div>
                      <p className="text-3xl font-bold text-white">{points.level}</p>
                    </motion.div>
                  )}
                </div>

                {points.next_level_points && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                      <span>Progress to Next Level</span>
                      <span>{points.available_points || 0} / {points.next_level_points} points</span>
                    </div>
                    <div className="w-full bg-[#1a2942] rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(((points.available_points || 0) / points.next_level_points) * 100, 100)}%`,
                        }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No points data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-3">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    achievement.unlocked_at
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                      : 'bg-[#1a2942]/60 border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.unlocked_at
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : 'bg-[#1a2942] border border-cyan-500/30'
                    }`}>
                      <Award className={`w-6 h-6 ${achievement.unlocked_at ? 'text-white' : 'text-white/30'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold ${achievement.unlocked_at ? 'text-white' : 'text-white/60'}`}>
                          {achievement.name}
                        </h4>
                        {achievement.unlocked_at && (
                          <span className="text-xs text-yellow-400">Unlocked</span>
                        )}
                      </div>
                      <p className="text-sm text-white/70">{achievement.description}</p>
                      {achievement.points_awarded && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">{achievement.points_awarded} points</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No achievements available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-3">
            {catalog.length > 0 ? (
              catalog.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-[#1a2942]/60 rounded-xl border border-cyan-500/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                        <Gift className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{reward.name}</h4>
                        <p className="text-sm text-white/70 mb-2">{reward.description}</p>
                        {reward.category && (
                          <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                            {reward.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-lg font-bold text-white">{reward.points_cost}</span>
                      </div>
                      <TouchOptimizedButton
                        variant="secondary"
                        size="sm"
                        disabled={!points || (points.available_points || 0) < reward.points_cost}
                      >
                        Redeem
                      </TouchOptimizedButton>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Gift className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No rewards available in catalog</p>
              </div>
            )}
          </div>
        )}
      </div>
    </SpaceCard>
  );
}

