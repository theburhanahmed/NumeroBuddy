'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, SparklesIcon, ChevronRightIcon, InfoIcon, Loader2 } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { MagneticCard } from '@/components/magnetic/magnetic-card';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/auth-context';
import { userAPI } from '@/lib/api-client';
import { phoneNumerologyAPI, type PhonePreview } from '@/lib/numerology-api';
import { toast } from 'sonner';

// Basic number interpretations for preview (matches backend DIGIT_MEANINGS)
const NUMBER_INTERPRETATIONS: Record<number, { energy: string; interpretation: string; strengths: string[]; challenges: string[]; bestFor: string[] }> = {
  1: {
    energy: 'Leadership & Independence',
    interpretation: 'Number 1 brings leadership, independence, and initiative. This number attracts business opportunities, new beginnings, and calls that advance your goals.',
    strengths: ['Attracts leadership and business calls', 'Good for career advancement', 'Promotes independence in communications', 'Ideal for entrepreneurs'],
    challenges: ['May attract competitive dynamics', 'Need to avoid being too dominant', 'Balance independence with collaboration'],
    bestFor: ['Executives', 'Business owners', 'Sales professionals', 'Consultants', 'Career-focused individuals'],
  },
  2: {
    energy: 'Cooperation & Diplomacy',
    interpretation: 'Number 2 brings cooperation, diplomacy, and relationship energy. This number attracts partnership opportunities, supportive connections, and harmonious communications.',
    strengths: ['Attracts partnership and collaboration', 'Good for relationship matters', 'Promotes diplomacy in communications', 'Ideal for mediators'],
    challenges: ['May attract people seeking support', 'Risk of being too accommodating', 'Need to assert boundaries'],
    bestFor: ['Counselors', 'Mediators', 'Partnership businesses', 'Customer relations', 'Team leaders'],
  },
  3: {
    energy: 'Communication & Creativity',
    interpretation: 'Number 3 brings communication, creativity, and sociability. This number attracts creative collaborations, social connections, and expressive opportunities.',
    strengths: ['Attracts creative and social calls', 'Good for networking', 'Promotes expression in communications', 'Ideal for creative professionals'],
    challenges: ['May attract scattered energy', 'Risk of over-commitment', 'Need to focus priorities'],
    bestFor: ['Artists', 'Writers', 'Marketing professionals', 'Social media', 'Event planners'],
  },
  4: {
    energy: 'Stability & Structure',
    interpretation: 'Number 4 brings stability, structure, and practicality. This number attracts solid opportunities, reliable connections, and work-related matters.',
    strengths: ['Attracts stable and reliable calls', 'Good for business and work', 'Promotes structure in communications', 'Ideal for building foundations'],
    challenges: ['May feel rigid at times', 'Risk of resistance to change', 'Need to allow flexibility'],
    bestFor: ['Architects', 'Engineers', 'Administrators', 'Real estate', 'Construction'],
  },
  5: {
    energy: 'Change & Freedom',
    interpretation: 'Number 5 brings change, freedom, and unpredictability. This number attracts dynamic opportunities, travel-related matters, and transformative connections.',
    strengths: ['Attracts dynamic and diverse calls', 'Good for travel and change', 'Promotes adaptability', 'Ideal for varied opportunities'],
    challenges: ['May attract instability', 'Risk of scattering energy', 'Need to ground periodically'],
    bestFor: ['Travel professionals', 'Sales', 'Adventurers', 'Freelancers', 'Consultants'],
  },
  6: {
    energy: 'Harmony & Responsibility',
    interpretation: 'Number 6 brings nurturing, caring, and harmonious energy. This number attracts family-oriented connections, supportive relationships, and opportunities for service.',
    strengths: ['Attracts caring and supportive people', 'Good for family and home-related matters', 'Promotes harmony in communications', 'Ideal for service-based businesses'],
    challenges: ['May attract people seeking help constantly', 'Risk of being too accommodating', 'Need to maintain boundaries'],
    bestFor: ['Healthcare professionals', 'Teachers and counselors', 'Family businesses', 'Customer service roles', 'Hospitality industry'],
  },
  7: {
    energy: 'Introspection & Spirituality',
    interpretation: 'Number 7 brings introspection, analysis, and spiritual energy. This number attracts deep conversations, research-related matters, and meaningful connections.',
    strengths: ['Attracts meaningful and deep calls', 'Good for research and analysis', 'Promotes spiritual connections', 'Ideal for consultants'],
    challenges: ['May attract isolation', 'Risk of over-analysis', 'Need to balance with action'],
    bestFor: ['Researchers', 'Psychologists', 'Spiritual advisors', 'Analysts', 'Scientists'],
  },
  8: {
    energy: 'Power & Abundance',
    interpretation: 'Number 8 brings power, abundance, and material success. This number attracts financial matters, authority connections, and business opportunities.',
    strengths: ['Attracts financial and business calls', 'Good for authority matters', 'Promotes success in communications', 'Ideal for executives'],
    challenges: ['May attract power dynamics', 'Risk of materialism', 'Need to balance with compassion'],
    bestFor: ['Finance professionals', 'Executives', 'Investors', 'Real estate', 'Business development'],
  },
  9: {
    energy: 'Completion & Humanitarianism',
    interpretation: 'Number 9 brings completion, humanitarianism, and wisdom. This number attracts philanthropic connections, endings and new cycles, and globally-minded opportunities.',
    strengths: ['Attracts humanitarian and global calls', 'Good for completion of cycles', 'Promotes wisdom in communications', 'Ideal for teachers'],
    challenges: ['May attract dramatic endings', 'Risk of idealism', 'Need to stay grounded'],
    bestFor: ['Non-profit leaders', 'Teachers', 'Healers', 'Global businesses', 'Philosophers'],
  },
};

export default function PhoneNumerology() {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [analyzeAnother, setAnalyzeAnother] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phonePreview, setPhonePreview] = useState<PhonePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || analyzeAnother) {
        setProfileLoading(false);
        return;
      }
      try {
        const res = await userAPI.getProfile();
        const data = res.data?.user ?? res.data;
        const phone = data?.phone ?? user?.phone;
        if (phone && !analyzeAnother) {
          setPhoneNumber(phone);
        }
      } catch {
        // Ignore
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [user, analyzeAnother]);

  const handleAnalyzeAnother = () => {
    setAnalyzeAnother(true);
    setPhoneNumber('');
    setShowResults(false);
    setPhonePreview(null);
    setError(null);
  };

  const handleCalculate = async () => {
    if (!phoneNumber.trim()) return;
    setLoading(true);
    setError(null);
    setPhonePreview(null);
    try {
      const preview = await phoneNumerologyAPI.preview({ phone_number: phoneNumber.trim() });
      setPhonePreview(preview);
      setShowResults(true);
      toast.success('Phone analysis complete!');
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? 'Failed to analyze phone number';
      setError(msg);
      toast.error(msg);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const reducedNumber = phonePreview?.computed?.core_number?.reduced ?? 0;
  const interpretation = NUMBER_INTERPRETATIONS[reducedNumber] ?? NUMBER_INTERPRETATIONS[6];

  return (
    <CosmicPageLayout>
      <main className="flex-1 section-spacing px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white mb-6 mx-auto shadow-xl"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PhoneIcon className="w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-300 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
              Phone Number Numerology
            </h1>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Discover the vibrational energy of your phone number and what it attracts
            </p>
          </motion.div>

          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <MagneticCard variant="liquid-premium" className="card-padding-lg">
              <div className="liquid-glass-content">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {analyzeAnother ? 'Analyze Another Number' : 'Your Phone Analysis'}
                </h2>
                <p className="text-gray-700 dark:text-white/90 mb-6">
                  Your phone number carries a specific vibration that influences the type of calls,
                  messages, and opportunities you attract.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {analyzeAnother ? 'Phone number to analyze' : 'Your Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter your full phone number including country code
                  </p>
                  {!analyzeAnother && !profileLoading && (
                    <button
                      type="button"
                      onClick={handleAnalyzeAnother}
                      className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Analyze another number
                    </button>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-400 mb-4">{error}</p>
                )}

                <TouchOptimizedButton
                  variant="liquid"
                  size="lg"
                  onClick={handleCalculate}
                  className="w-full glass-glow"
                  disabled={!phoneNumber.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    analyzeAnother ? 'Analyze Phone Number' : 'Analyze Your Phone'
                  )}
                </TouchOptimizedButton>
              </div>
            </MagneticCard>
          </motion.div>

          {/* Results */}
          {showResults && phonePreview && (
            <SubscriptionGate feature="phone-numerology" requiredTier="premium" showPreview={tier === 'free'}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <MagneticCard variant="liquid-premium" className="card-padding-lg">
                  <div className="liquid-glass-content">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-xl">
                        {reducedNumber}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{interpretation.energy}</h3>
                      <p className="text-sm text-white/70 mb-4">{phonePreview.phone_display}</p>
                      <p className="text-gray-700 dark:text-white/90">{interpretation.interpretation}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-green-500/10 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5 text-green-600" />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {interpretation.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/90">
                              <ChevronRightIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-6 bg-amber-500/10 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                          <InfoIcon className="w-5 h-5 text-amber-600" />
                          Challenges
                        </h4>
                        <ul className="space-y-2">
                          {interpretation.challenges.map((challenge, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/90">
                              <ChevronRightIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </MagneticCard>

                <MagneticCard variant="liquid" className="card-padding-lg">
                  <div className="liquid-glass-content">
                    <h4 className="font-semibold text-white mb-4">
                      Best Uses for Number {reducedNumber}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interpretation.bestFor.map((use, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-xl text-center"
                        >
                          <p className="text-sm font-semibold text-white">{use}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </MagneticCard>

                <MagneticCard variant="liquid" className="card-padding">
                  <div className="liquid-glass-content">
                    <h4 className="font-semibold text-white mb-4">Phone Number Vibrations Guide</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-white/90">
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Number 1:</strong> Leadership calls, business opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Number 3:</strong> Creative collaborations, social connections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Number 5:</strong> Dynamic opportunities, travel, change</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Number 6:</strong> Family matters, service, harmony</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Number 8:</strong> Financial matters, authority, success</span>
                      </li>
                    </ul>
                  </div>
                </MagneticCard>
              </motion.div>
            </SubscriptionGate>
          )}
        </div>
      </main>
    </CosmicPageLayout>
  );
}
