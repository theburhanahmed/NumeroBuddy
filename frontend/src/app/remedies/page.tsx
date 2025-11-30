'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  GemIcon, 
  PaletteIcon,
  CalendarIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { usePersonalizedRemedies } from '@/lib/hooks';

export default function RemediesPage() {
  const router = useRouter();
  const { remedies, loading, error } = usePersonalizedRemedies();

  // Map remedy types to icons and colors
  const getRemedyIcon = (type: string) => {
    switch (type) {
      case 'gemstone': return <GemIcon className="w-6 h-6" />;
      case 'color': return <PaletteIcon className="w-6 h-6" />;
      case 'ritual': return <SunIcon className="w-6 h-6" />;
      case 'mantra': return <MoonIcon className="w-6 h-6" />;
      default: return <SparklesIcon className="w-6 h-6" />;
    }
  };

  const getRemedyColor = (type: string) => {
    switch (type) {
      case 'gemstone': return 'from-purple-500 to-indigo-600';
      case 'color': return 'from-blue-500 to-sky-600';
      case 'ritual': return 'from-amber-500 to-orange-600';
      case 'mantra': return 'from-green-500 to-emerald-600';
      case 'dietary': return 'from-red-500 to-pink-600';
      case 'exercise': return 'from-teal-500 to-cyan-600';
      default: return 'from-purple-500 to-indigo-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Personalized Remedies
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Custom recommendations for gemstones, colors, and rituals
              </p>
            </div>
            
            <GlassButton 
              variant="secondary" 
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </GlassButton>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <GlassCard key={item} variant="default" className="p-6 h-64">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded w-1/3"></div>
                    <div className="h-8 bg-white/50 dark:bg-gray-800/50 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded"></div>
                      <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-5/6"></div>
                    </div>
                    <div className="h-10 bg-white/50 dark:bg-gray-800/50 rounded w-1/2"></div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : error ? (
            <GlassCard variant="default" className="p-12 text-center">
              <SparklesIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Remedies</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <GlassButton 
                variant="primary" 
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </GlassButton>
            </GlassCard>
          ) : remedies.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remedies.map((remedy) => (
                  <motion.div
                    key={remedy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: parseInt(remedy.id.slice(0, 8), 16) % 10 * 0.1 }}
                  >
                    <GlassCard variant="default" className="p-6 h-full flex flex-col">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getRemedyColor(remedy.remedy_type)} flex items-center justify-center text-white mb-4`}>
                        {getRemedyIcon(remedy.remedy_type)}
                      </div>
                      
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded-full text-gray-700 dark:text-gray-300 w-fit mb-2">
                        {remedy.remedy_type 
                          ? remedy.remedy_type.charAt(0).toUpperCase() + remedy.remedy_type.slice(1)
                          : 'Remedy'}
                      </span>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {remedy.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        {remedy.description}
                      </p>
                      
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Recommendation:</span> {remedy.recommendation}
                        </p>
                      </div>
                      
                      <GlassButton variant="secondary" size="sm">
                        Add to Daily Reminder
                      </GlassButton>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
              
              {/* Daily Practice Section */}
              <GlassCard variant="elevated" className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Practice</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Track your remedies and build positive habits
                    </p>
                  </div>
                  <GlassButton variant="primary">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    View Calendar
                  </GlassButton>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <GemIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Gemstones</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Worn today: Amethyst
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-sky-600 rounded-lg flex items-center justify-center">
                        <PaletteIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Colors</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Focus color: Royal Blue
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <SunIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Rituals</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Meditation: 15 minutes completed
                    </p>
                  </div>
                </div>
              </GlassCard>
              
              {/* AI Recommendations */}
              <div className="text-center py-8">
                <GlassCard variant="default" className="p-8 max-w-2xl mx-auto">
                  <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Want Personalized Recommendations?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Our AI numerologist can provide custom remedies based on your current life situation and goals.
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => router.push('/ai-chat')}
                    icon={<SparklesIcon className="w-5 h-5" />}
                  >
                    Chat with AI Numerologist
                  </GlassButton>
                </GlassCard>
              </div>
            </div>
          ) : (
            <GlassCard variant="default" className="p-12 text-center">
              <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Remedies Available</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn&apos;t find personalized remedies for you. Please ensure your numerology profile is complete.
              </p>
              <GlassButton 
                variant="primary" 
                onClick={() => router.push('/birth-chart')}
              >
                Generate Birth Chart
              </GlassButton>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}