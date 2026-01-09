'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI } from '@/lib/numerology-api';

interface PersonalizedRemedy {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: number;
  difficulty: 'easy' | 'medium' | 'hard';
  duration_minutes?: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  personalization_data: Record<string, any>;
}

interface PersonalizedRemediesProps {
  onRemedySelect?: (remedy: PersonalizedRemedy) => void;
}

export function PersonalizedRemedies({ onRemedySelect }: PersonalizedRemediesProps) {
  const [remedies, setRemedies] = useState<PersonalizedRemedy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'difficulty' | 'name'>('priority');

  useEffect(() => {
    fetchPersonalizedRemedies();
  }, []);

  const fetchPersonalizedRemedies = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getPersonalizedRemedies();
      setRemedies(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch personalized remedies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-white/70';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'from-red-500 to-orange-600';
    if (priority >= 5) return 'from-yellow-500 to-orange-600';
    return 'from-cyan-500 to-blue-600';
  };

  const filteredAndSortedRemedies = remedies
    .filter(remedy => !filterCategory || remedy.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'priority') return b.priority - a.priority;
      if (sortBy === 'difficulty') {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      return a.name.localeCompare(b.name);
    });

  const categories = Array.from(new Set(remedies.map(r => r.category)));

  if (loading) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </SpaceCard>
    );
  }

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Personalized Remedies
        </h2>
        <p className="text-white/70 mb-4">AI-generated remedies tailored to your numerology profile</p>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-4">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-3 py-1 rounded-lg text-sm ${
              filterCategory === null
                ? 'bg-cyan-500 text-white'
                : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                filterCategory === category
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Sort by:</span>
          {(['priority', 'difficulty', 'name'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                sortBy === option
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Remedies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedRemedies.map((remedy) => (
          <motion.div
            key={remedy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer"
            onClick={() => onRemedySelect && onRemedySelect(remedy)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white flex-1">{remedy.name}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(remedy.priority)} text-white`}>
                P{remedy.priority}
              </div>
            </div>

            <p className="text-sm text-white/70 mb-3 line-clamp-2">
              {remedy.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span className="capitalize">{remedy.difficulty}</span>
              </div>
              {remedy.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{remedy.duration_minutes} min</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span className="capitalize">{remedy.frequency}</span>
              </div>
            </div>

            {remedy.personalization_data && Object.keys(remedy.personalization_data).length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-cyan-400">
                  Personalized for your {remedy.personalization_data.reason || 'profile'}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredAndSortedRemedies.length === 0 && (
        <div className="text-center py-12 text-white/50">
          No personalized remedies available
        </div>
      )}
    </SpaceCard>
  );
}