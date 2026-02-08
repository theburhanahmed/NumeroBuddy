import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TypeIcon, SparklesIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
export function NameNumerology() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const calculateNameNumber = () => {
    // Simple calculation for demo
    const value = name.split('').reduce((sum, char) => {
      const code = char.toUpperCase().charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return sum + ((code - 64) % 9 || 9);
      }
      return sum;
    }, 0);
    const reduced = value % 9 || 9;
    setResult(reduced);
  };
  const meanings = {
    1: 'Leadership and independence. You are a natural pioneer.',
    2: 'Harmony and cooperation. You excel in partnerships.',
    3: 'Creativity and expression. You inspire others with joy.',
    4: 'Stability and structure. You build solid foundations.',
    5: 'Freedom and adventure. You embrace change and variety.',
    6: 'Nurturing and responsibility. You care deeply for others.',
    7: 'Wisdom and introspection. You seek deeper truths.',
    8: 'Power and success. You achieve material abundance.',
    9: 'Compassion and completion. You serve humanity.'
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <TypeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Name Numerology
            </h1>
            <p className="text-white/70">Discover the power in your name</p>
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
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Calculate Your Name Number
          </h2>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-2">

                Enter Your Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

            </div>

            <TouchOptimizedButton
              variant="primary"
              size="lg"
              onClick={calculateNameNumber}
              disabled={!name.trim()}
              icon={<SparklesIcon className="w-5 h-5" />}
              className="w-full"
              ariaLabel="Calculate name number">

              Calculate
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
              Your Name Number
            </h3>

            <div className="flex justify-center mb-6">
              <CrystalNumerologyCube number={result} size="lg" color="purple" />
            </div>

            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              {meanings[result as keyof typeof meanings]}
            </p>
          </SpaceCard>
        </motion.div>
      }
    </CosmicPageLayout>);

}