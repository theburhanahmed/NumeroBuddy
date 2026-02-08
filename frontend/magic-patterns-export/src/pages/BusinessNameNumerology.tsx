import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, TrendingUpIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
export function BusinessNameNumerology() {
  const [businessName, setBusinessName] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const calculateBusinessNumber = () => {
    const value = businessName.split('').reduce((sum, char) => {
      const code = char.toUpperCase().charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return sum + ((code - 64) % 9 || 9);
      }
      return sum;
    }, 0);
    const reduced = value % 9 || 9;
    setResult(reduced);
  };
  const businessMeanings = {
    1: 'Innovation and leadership. Perfect for startups and tech companies.',
    2: 'Partnership and collaboration. Ideal for consulting and service businesses.',
    3: 'Creativity and communication. Great for marketing and media companies.',
    4: 'Stability and structure. Excellent for real estate and construction.',
    5: 'Adaptability and growth. Perfect for travel and e-commerce businesses.',
    6: 'Service and responsibility. Ideal for healthcare and education.',
    7: 'Research and expertise. Great for tech and analytical firms.',
    8: 'Success and abundance. Perfect for finance and luxury brands.',
    9: 'Humanitarian and global. Ideal for nonprofits and social enterprises.'
  };
  return (
    <CosmicPageLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <BriefcaseIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Business Name Numerology
            </h1>
            <p className="text-white/70">Find the perfect name for success</p>
          </div>
        </div>
      </motion.div>

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
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            Why Business Name Matters
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Your business name carries energy that influences success, customer
            attraction, and growth potential. Choose a name that aligns with
            your business goals and values.
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-white mb-2">

                Enter Business Name
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Corporation"
                className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

            </div>

            <TouchOptimizedButton
              variant="primary"
              size="lg"
              onClick={calculateBusinessNumber}
              disabled={!businessName.trim()}
              icon={<TrendingUpIcon className="w-5 h-5" />}
              className="w-full"
              ariaLabel="Calculate business number">

              Analyze Name
            </TouchOptimizedButton>
          </div>
        </SpaceCard>
      </motion.div>

      {result &&
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          type: 'spring'
        }}>

          <SpaceCard variant="premium" className="p-6 md:p-8 text-center">
            <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
              Business Name Number
            </h3>

            <div className="flex justify-center mb-6">
              <CrystalNumerologyCube number={result} size="lg" color="green" />
            </div>

            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-6">
              {businessMeanings[result as keyof typeof businessMeanings]}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  Success
                </div>
                <div className="text-sm text-white/70">High Potential</div>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  Growth
                </div>
                <div className="text-sm text-white/70">Excellent</div>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  Energy
                </div>
                <div className="text-sm text-white/70">Positive</div>
              </div>
            </div>
          </SpaceCard>
        </motion.div>
      }
    </CosmicPageLayout>);

}