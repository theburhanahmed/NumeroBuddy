'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, SparklesIcon, ChevronRightIcon, TrendingUpIcon, Loader2, AlertCircle } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { MagneticCard } from '@/components/magnetic/magnetic-card';
import { assetNumerologyAPI } from '@/lib/numerology-api';
import { toast } from 'sonner';

export default function BusinessNameNumerology() {
  const [businessName, setBusinessName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessAnalysis, setBusinessAnalysis] = useState<any>(null);

  const handleCalculate = async () => {
    if (!businessName.trim()) {
      toast.error('Please enter a business name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShowResults(false);
      
      const result = await assetNumerologyAPI.calculateBusiness({
        business_name: businessName.trim(),
        registration_number: registrationNumber.trim() || undefined,
        launch_date: launchDate || undefined,
      });
      
      setBusinessAnalysis(result);
      setShowResults(true);
      toast.success('Business analysis completed!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to analyze business name. Please try again.';
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
            <motion.div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center text-white mb-6 mx-auto shadow-xl" animate={{
            rotate: [0, 5, -5, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}>
              <BriefcaseIcon className="w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-300 dark:via-orange-300 dark:to-red-300 bg-clip-text text-transparent">
              Business Name Numerology
            </h1>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Choose a business name that attracts success and aligns with your
              goals
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
                  Business Name Analysis
                </h2>
                <p className="text-gray-700 dark:text-white/90 mb-6">
                  The vibration of your business name influences its energy,
                  potential for success, and how customers perceive your brand.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Business Name *
                    </label>
                    <input 
                      type="text" 
                      value={businessName} 
                      onChange={e => setBusinessName(e.target.value)} 
                      placeholder="Enter your business name" 
                      className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Registration Number (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={registrationNumber} 
                      onChange={e => setRegistrationNumber(e.target.value)} 
                      placeholder="Enter registration number" 
                      className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Launch Date (Optional)
                    </label>
                    <input 
                      type="date" 
                      value={launchDate} 
                      onChange={e => setLaunchDate(e.target.value)} 
                      className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500" 
                    />
                  </div>
                </div>

                <TouchOptimizedButton 
                  variant="liquid" 
                  size="lg" 
                  onClick={handleCalculate} 
                  className="w-full glass-glow" 
                  disabled={!businessName.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Business Name'
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
          {showResults && businessAnalysis && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <MagneticCard variant="liquid-premium" className="card-padding-lg">
                <div className="liquid-glass-content">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-xl">
                      {businessAnalysis.business_number || businessAnalysis.number}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {businessAnalysis.business_name || businessName}
                    </h3>
                    <p className="text-gray-700 dark:text-white/90">
                      {businessAnalysis.interpretation || businessAnalysis.analysis || businessAnalysis.description || 'Business numerology analysis completed.'}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {businessAnalysis.strengths && businessAnalysis.strengths.length > 0 && (
                      <div className="p-6 bg-green-500/10 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUpIcon className="w-5 h-5 text-green-600" />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {(Array.isArray(businessAnalysis.strengths) ? businessAnalysis.strengths : []).map((strength: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/90">
                              <ChevronRightIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(businessAnalysis.considerations || businessAnalysis.challenges || businessAnalysis.warnings) && (
                      <div className="p-6 bg-amber-500/10 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5 text-amber-600" />
                          {businessAnalysis.considerations ? 'Considerations' : businessAnalysis.challenges ? 'Challenges' : 'Warnings'}
                        </h4>
                        <ul className="space-y-2">
                          {(Array.isArray(businessAnalysis.considerations || businessAnalysis.challenges || businessAnalysis.warnings) 
                            ? (businessAnalysis.considerations || businessAnalysis.challenges || businessAnalysis.warnings) 
                            : []).map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/90">
                              <ChevronRightIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {businessAnalysis.recommendations && businessAnalysis.recommendations.length > 0 && (
                    <div className="mt-6 p-6 bg-blue-500/10 rounded-2xl">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-blue-600" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {businessAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/90">
                            <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {businessAnalysis.best_industries && businessAnalysis.best_industries.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-white mb-4">
                        Best Industries for Number {businessAnalysis.business_number || businessAnalysis.number}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {businessAnalysis.best_industries.map((industry: string, index: number) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-xl text-center"
                          >
                            <p className="text-sm font-semibold text-white">{industry}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </MagneticCard>

              {(!businessAnalysis.best_industries || businessAnalysis.best_industries.length === 0) && (
                <MagneticCard variant="liquid" className="card-padding">
                  <div className="liquid-glass-content">
                    <h4 className="font-semibold text-white mb-4">
                      Business Name Number Guide
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-white/90">
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Number 1:</strong> Leadership, innovation, pioneering spirit
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Number 5:</strong> Dynamic, adaptable, marketing-focused
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Number 8:</strong> Material success, authority, abundance
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Number 9:</strong> Humanitarian, global reach, service-oriented
                        </span>
                      </li>
                    </ul>
                  </div>
                </MagneticCard>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </CosmicPageLayout>;
}