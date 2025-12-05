'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function OnboardingModal() {
  const { completeOnboarding } = useOnboarding();

  const handleComplete = () => {
    completeOnboarding();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleComplete}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <GlassCard variant="liquid-premium" className="p-6">
            <div className="liquid-glass-content">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome to NumerAI!
                </h2>
                <button
                  onClick={handleComplete}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Get started by exploring your numerology insights and personalized readings.
              </p>
              <GlassButton
                variant="liquid"
                onClick={handleComplete}
                className="w-full glass-glow"
              >
                Get Started
              </GlassButton>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

