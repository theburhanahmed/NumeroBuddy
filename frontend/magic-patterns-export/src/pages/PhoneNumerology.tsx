import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, SparklesIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
export function PhoneNumerology() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const calculatePhoneNumber = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    const value = digits.
    split('').
    reduce((sum, digit) => sum + parseInt(digit), 0);
    const reduced = value % 9 || 9;
    setResult(reduced);
  };
  const phoneMeanings = {
    1: 'Leadership energy. Great for business and professional calls.',
    2: 'Harmony and cooperation. Perfect for personal relationships.',
    3: 'Communication and creativity. Excellent for networking.',
    4: 'Stability and reliability. Ideal for long-term connections.',
    5: 'Dynamic and versatile. Perfect for sales and marketing.',
    6: 'Nurturing and supportive. Great for family and care.',
    7: 'Intuitive and analytical. Ideal for research and consulting.',
    8: 'Success and abundance. Perfect for business deals.',
    9: 'Compassionate and global. Great for humanitarian work.'
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <PhoneIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Phone Numerology
            </h1>
            <p className="text-white/70">Analyze your phone number's energy</p>
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
            Why Phone Numbers Matter
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Your phone number carries vibrational energy that influences
            communication, relationships, and opportunities. Understanding this
            energy can help you make the most of your connections.
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-white mb-2">

                Enter Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

              <p className="text-xs text-white/50 mt-2">
                Enter any format - we'll extract the digits
              </p>
            </div>

            <TouchOptimizedButton
              variant="primary"
              size="lg"
              onClick={calculatePhoneNumber}
              disabled={!phoneNumber.trim()}
              icon={<SparklesIcon className="w-5 h-5" />}
              className="w-full"
              ariaLabel="Analyze phone number">

              Analyze Number
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
              Phone Number Energy
            </h3>

            <div className="flex justify-center mb-6">
              <CrystalNumerologyCube number={result} size="lg" color="blue" />
            </div>

            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
              {phoneMeanings[result as keyof typeof phoneMeanings]}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <h4 className="font-semibold text-white mb-2">Best For</h4>
                <p className="text-sm text-white/70">
                  {result === 1 ?
                'Professional networking' :
                result === 2 ?
                'Personal relationships' :
                result === 3 ?
                'Creative collaborations' :
                result === 4 ?
                'Long-term partnerships' :
                result === 5 ?
                'Sales and marketing' :
                result === 6 ?
                'Family connections' :
                result === 7 ?
                'Consulting work' :
                result === 8 ?
                'Business deals' :
                'Humanitarian projects'}
                </p>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <h4 className="font-semibold text-white mb-2">Energy Type</h4>
                <p className="text-sm text-white/70">
                  {result <= 3 ?
                'Creative & Expressive' :
                result <= 6 ?
                'Stable & Nurturing' :
                'Analytical & Powerful'}
                </p>
              </div>
            </div>
          </SpaceCard>
        </motion.div>
      }
    </CosmicPageLayout>);

}