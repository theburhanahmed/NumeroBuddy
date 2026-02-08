'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, SparklesIcon, CheckCircleIcon, AlertCircleIcon, UsersIcon } from 'lucide-react';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { SpaceCard } from '@/components/space/space-card';
import { SpaceButton } from '@/components/space/space-button';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CrystalNumerologyCube } from '@/components/3d/crystal-numerology-cube';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/auth-context';
import { numerologyAPI } from '@/lib/numerology-api';
import { userAPI } from '@/lib/api-client';
import { toast } from 'sonner';

function formatDateForInput(isoDate?: string | null): string {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

export default function CompatibilityChecker() {
  const router = useRouter();
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [userProfile, setUserProfile] = useState<{ full_name?: string; date_of_birth?: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [partner, setPartner] = useState({ name: '', birthDate: '' });
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userFullName = userProfile?.full_name || user?.full_name || '';
  const userBirthDate = userProfile?.date_of_birth ? formatDateForInput(userProfile.date_of_birth) : '';
  const isProfileComplete = Boolean(userFullName && userBirthDate);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }
      try {
        const res = await userAPI.getProfile();
        const data = res.data?.user || res.data;
        setUserProfile(data || null);
      } catch {
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const calculateCompatibility = async () => {
    if (!partner.name || !partner.birthDate) {
      toast.error('Please enter partner name and birth date');
      return;
    }
    if (!isProfileComplete) {
      toast.error('Please complete your profile first');
      return;
    }

    try {
      setIsCalculating(true);
      setError(null);
      setResult(null);

      const formatDate = (dateStr: string) => {
        if (dateStr.includes('T')) return dateStr.split('T')[0];
        return dateStr;
      };

      const response = await numerologyAPI.checkCompatibility({
        partner_name: partner.name.trim(),
        partner_birth_date: formatDate(partner.birthDate),
        relationship_type: 'romantic',
      });

      setResult({
        score: response.compatibility_score || 0,
        lifePath1: response.user_life_path || null,
        lifePath2: response.partner_life_path || null,
        strengths: response.strengths || [],
        challenges: response.challenges || [],
        advice: response.advice || 'Compatibility analysis completed.',
        relationship_type: response.relationship_type || 'romantic',
      });

      toast.success('Compatibility calculated!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to calculate compatibility. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };
  return (
    <CosmicPageLayout>
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Compatibility Checker
            </h1>
            <p className="text-white/70">Compare you with partners, friends, and family</p>
          </div>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
        className="mb-8"
      >
        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            You vs Partner Compatibility
          </h2>

          {profileLoading ? (
            <div className="py-8 text-center text-white/70">Loading your profile...</div>
          ) : !isProfileComplete ? (
            <div className="py-8 text-center">
              <p className="text-white/80 mb-4">Complete your profile with your full name and birth date to check compatibility.</p>
              <TouchOptimizedButton
                variant="primary"
                onClick={() => router.push('/onboarding')}
                ariaLabel="Complete profile"
              >
                Complete Your Profile
              </TouchOptimizedButton>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* You (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-white mb-4">
                    You
                  </label>
                  <div className="px-4 py-3 bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white/90">
                    <p className="font-medium">{userFullName}</p>
                    <p className="text-sm text-white/70 mt-1">{userBirthDate ? new Date(userBirthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                  </div>
                  <p className="text-xs text-white/50 mt-2">From your profile</p>
                </div>

                {/* Partner (editable) */}
                <div>
                  <label className="block text-sm font-medium text-white mb-4">
                    Partner
                  </label>
                  <input
                    type="text"
                    value={partner.name}
                    onChange={(e) => setPartner({ ...partner, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-white/50"
                    placeholder="Enter partner name"
                  />
                  <label className="block text-sm font-medium text-white mb-4 mt-4">
                    Partner Birth Date
                  </label>
                  <input
                    type="date"
                    value={partner.birthDate}
                    onChange={(e) => setPartner({ ...partner, birthDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white"
                  />
                </div>
              </div>

              <TouchOptimizedButton
                variant="primary"
                size="lg"
                onClick={calculateCompatibility}
                className="w-full"
                icon={<SparklesIcon className="w-5 h-5" />}
                ariaLabel="Check compatibility"
                disabled={isCalculating || !partner.name || !partner.birthDate}
              >
                {isCalculating ? 'Calculating...' : 'Calculate Compatibility'}
              </TouchOptimizedButton>
            </>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </SpaceCard>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <SubscriptionGate
            feature="compatibility"
            requiredTier="premium"
            showPreview={tier === 'free'}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mb-8"
            >
              <SpaceCard variant="premium" className="p-6 md:p-8 text-center">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
                  Compatibility Score
                </h2>
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.3,
                    type: 'spring',
                  }}
                  className="mb-6"
                >
                  <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 mb-2">
                    {result.score}%
                  </div>
                  <div className="text-xl text-white/80">
                    {result.score >= 80
                      ? 'Excellent'
                      : result.score >= 60
                        ? 'Good'
                        : 'Moderate'}{' '}
                    Match
                  </div>
                </motion.div>
                <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
                  {userFullName} & {partner.name} - Life Path {result.lifePath1}{' '}
                  + Life Path {result.lifePath2}
                </p>
              </SpaceCard>
            </motion.div>

            {/* Detailed Aspects */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
              }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <SpaceCard variant="default" className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <h4 className="font-semibold text-white">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {result.strengths.map(
                      (strength: string, index: number) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-2 text-sm text-white/80"
                          initial={{
                            opacity: 0,
                            x: -20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay: index * 0.1,
                          }}
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span>
                          {strength}
                        </motion.li>
                      ),
                    )}
                  </ul>
                </SpaceCard>

                <SpaceCard variant="default" className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircleIcon className="w-6 h-6 text-amber-400" />
                    <h4 className="font-semibold text-white">Challenges</h4>
                  </div>
                  <ul className="space-y-2">
                    {result.challenges.map(
                      (challenge: string, index: number) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-2 text-sm text-white/80"
                          initial={{
                            opacity: 0,
                            x: 20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay: index * 0.1,
                          }}
                        >
                          <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></span>
                          {challenge}
                        </motion.li>
                      ),
                    )}
                  </ul>
                </SpaceCard>
              </div>

              <SpaceCard variant="default" className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="w-6 h-6 text-purple-400" />
                  <h4 className="font-semibold text-white">Advice</h4>
                </div>
                <p className="text-white/70">{result.advice}</p>
              </SpaceCard>
            </motion.div>
          </SubscriptionGate>
        )}
      </AnimatePresence>
    </CosmicPageLayout>
  );
}