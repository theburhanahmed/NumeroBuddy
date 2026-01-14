'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TypeIcon, SparklesIcon, ChevronRightIcon, Loader2, AlertCircle } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { MagneticCard } from '@/components/magnetic/magnetic-card';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { nameNumerologyAPI, type NamePreview } from '@/lib/numerology-api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

export default function NameNumerology() {
  const { tier } = useSubscription();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameAnalysis, setNameAnalysis] = useState<NamePreview | null>(null);

  const handleCalculate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShowResults(false);
      
      const result = await nameNumerologyAPI.preview({
        name: name.trim(),
        system: 'pythagorean',
      });
      
      setNameAnalysis(result);
      setShowResults(true);
      toast.success('Name analysis completed!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to analyze name. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };
  return <CosmicPageLayout>
      <main className="flex-1 section-spacing px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center mb-12">
            <motion.div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mb-6 mx-auto shadow-xl" animate={{
            scale: [1, 1.05, 1]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}>
              <TypeIcon className="w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-purple-600 bg-clip-text text-transparent">
              Name Numerology
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Discover the vibrational energy and hidden meanings within your
              name
            </p>
          </motion.div>

          {/* Calculator */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="mb-8">
            <MagneticCard variant="liquid-premium" className="card-padding-lg">
              <div className="liquid-glass-content">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Name Analysis Calculator
                </h2>
                <p className="text-white/80 mb-6">
                  Your name carries vibrational energy that influences your
                  personality, desires, and how others perceive you.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500" />
                </div>

                <TouchOptimizedButton 
                  variant="primary" 
                  size="lg" 
                  onClick={handleCalculate} 
                  className="w-full glass-glow" 
                  disabled={!name.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Name'
                  )}
                </TouchOptimizedButton>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </div>
            </MagneticCard>
          </motion.div>

          {/* Results */}
          {showResults && nameAnalysis && (
            <SubscriptionGate feature="name-numerology" requiredTier="basic" showPreview={tier === 'free'}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  <MagneticCard variant="primary" className="card-padding text-center">
                    <div className="liquid-glass-content">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                        {nameAnalysis.numbers.expression.reduced}
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Expression Number
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-white/90">
                        Also known as Destiny Number. Represents your natural talents, abilities, and the path you&apos;re meant to follow. This is who you are at your core.
                      </p>
                      {nameAnalysis.numbers.expression.reduced === 11 || nameAnalysis.numbers.expression.reduced === 22 || nameAnalysis.numbers.expression.reduced === 33 ? (
                        <p className="text-xs text-yellow-400 mt-2">Master Number</p>
                      ) : null}
                    </div>
                  </MagneticCard>

                  <MagneticCard variant="primary" className="card-padding text-center">
                    <div className="liquid-glass-content">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                        {nameAnalysis.numbers.soul_urge.reduced}
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Soul Urge Number
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-white/90">
                        Also known as Heart&apos;s Desire. Reveals your inner desires, motivations, and what truly drives you. This is what your heart yearns for.
                      </p>
                      {nameAnalysis.numbers.soul_urge.reduced === 11 || nameAnalysis.numbers.soul_urge.reduced === 22 || nameAnalysis.numbers.soul_urge.reduced === 33 ? (
                        <p className="text-xs text-yellow-400 mt-2">Master Number</p>
                      ) : null}
                    </div>
                  </MagneticCard>

                  <MagneticCard variant="primary" className="card-padding text-center">
                    <div className="liquid-glass-content">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                        {nameAnalysis.numbers.personality.reduced}
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Personality Number
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-white/90">
                        Shows how others perceive you and the first impression you make. This is your outer personality and how you present yourself to the world.
                      </p>
                      {nameAnalysis.numbers.personality.reduced === 11 || nameAnalysis.numbers.personality.reduced === 22 || nameAnalysis.numbers.personality.reduced === 33 ? (
                        <p className="text-xs text-yellow-400 mt-2">Master Number</p>
                      ) : null}
                    </div>
                  </MagneticCard>
                </div>

                {/* Name Breakdown */}
                {nameAnalysis.breakdown && nameAnalysis.breakdown.length > 0 && (
                  <MagneticCard variant="liquid-premium" className="card-padding-lg">
                    <div className="liquid-glass-content">
                      <h3 className="text-xl font-bold text-white mb-4">
                        Name Breakdown: {nameAnalysis.normalized_name}
                      </h3>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                        {nameAnalysis.breakdown.map((item, index) => (
                          <div
                            key={index}
                            className="p-2 bg-white/5 rounded-lg text-center border border-white/10"
                          >
                            <div className="text-white font-bold text-lg">{item.letter}</div>
                            <div className="text-white/70 text-xs mt-1">{item.value}</div>
                            <div className="text-white/50 text-xs mt-1">
                              {item.is_vowel ? 'V' : item.is_consonant ? 'C' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MagneticCard>
                )}

                {/* Word Totals */}
                {nameAnalysis.word_totals && nameAnalysis.word_totals.length > 0 && (
                  <MagneticCard variant="liquid-premium" className="card-padding-lg">
                    <div className="liquid-glass-content">
                      <h3 className="text-xl font-bold text-white mb-4">
                        Word Totals
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {nameAnalysis.word_totals.map((word, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="font-semibold text-white mb-2">{word.word}</div>
                            <div className="text-sm text-white/70">
                              Total: {word.raw_total} → {word.reduced}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MagneticCard>
                )}

                {/* Detailed Interpretation */}
                <MagneticCard variant="liquid-premium" className="card-padding-lg">
                  <div className="liquid-glass-content">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Understanding Your Name Numbers
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-indigo-500/10 rounded-xl">
                        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5 text-indigo-600" />
                          Expression Number ({nameAnalysis.numbers.expression.reduced})
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-white/90">
                          Represents your natural talents, abilities, and the path
                          you&apos;re meant to follow. This is who you are at your
                          core. Calculated from all letters in your full name.
                        </p>
                      </div>

                      <div className="p-4 bg-pink-500/10 rounded-xl">
                        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5 text-pink-600" />
                          Soul Urge Number ({nameAnalysis.numbers.soul_urge.reduced})
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-white/90">
                          Reveals your inner desires, motivations, and what truly
                          drives you. This is what your heart yearns for. Calculated from vowels in your name.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-500/10 rounded-xl">
                        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5 text-blue-600" />
                          Personality Number ({nameAnalysis.numbers.personality.reduced})
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-white/90">
                          Shows how others perceive you and the first impression
                          you make. This is your outer personality. Calculated from consonants in your name.
                        </p>
                      </div>
                    </div>
                  </div>
                </MagneticCard>
              </motion.div>
            </SubscriptionGate>
          )}
        </div>
      </main>
    </CosmicPageLayout>;
}