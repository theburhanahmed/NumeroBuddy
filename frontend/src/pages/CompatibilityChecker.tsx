import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  TrendingUpIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { numerologyAPI } from '../lib/numerology-api';
export function CompatibilityChecker() {
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const calculateCompatibility = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await numerologyAPI.checkCompatibility({
        partner_name: partnerName,
        partner_birth_date: partnerBirthDate,
      });
      setResult(data);
      setShowResults(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to check compatibility.');
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CosmicPageLayout>
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-8">

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Compatibility Checker
            </h1>
            <p className="text-white/70">Discover your cosmic connection</p>
          </div>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.1
        }}
        className="mb-8">

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Enter Partner Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Partner Name
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Partner Birth Date
              </label>
              <input
                type="date"
                value={partnerBirthDate}
                onChange={(e) => setPartnerBirthDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <TouchOptimizedButton
            variant="primary"
            size="lg"
            onClick={calculateCompatibility}
            className="w-full"
            icon={<SparklesIcon className="w-5 h-5" />}
            ariaLabel="Check compatibility">

            {isLoading ? 'Checking...' : 'Check Compatibility'}
          </TouchOptimizedButton>
        </SpaceCard>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {showResults &&
        <>
            {/* Overall Score */}
            <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              delay: 0.2
            }}
            className="mb-8">

              <SpaceCard variant="premium" className="p-6 md:p-8 text-center">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
                  Compatibility Score
                </h2>
                <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                transition={{
                  delay: 0.3,
                  type: 'spring'
                }}
                className="mb-6">

                  <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 mb-2">
                    {result?.compatibility_score ?? '–'}%
                  </div>
                </motion.div>
                <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
                  {result?.partner_name ? `Compatibility with ${result.partner_name}.` : ''}
                </p>
              </SpaceCard>
            </motion.div>

            {/* Advice Section */}
            <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.8
            }}
            className="mt-8">

              <SpaceCard variant="default" className="p-6 md:p-8">
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-4">
                  Relationship Advice
                </h3>
                <div className="space-y-4 text-white/70">
                  <p className="leading-relaxed">
                    <strong className="text-white">Strengths:</strong>{' '}
                    {Array.isArray(result?.strengths) ? result.strengths.join(' • ') : '—'}
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Challenges:</strong>{' '}
                    {Array.isArray(result?.challenges) ? result.challenges.join(' • ') : '—'}
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Advice:</strong>{' '}
                    {Array.isArray(result?.advice) ? result.advice.join(' • ') : '—'}
                  </p>
                </div>
              </SpaceCard>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </CosmicPageLayout>);

}