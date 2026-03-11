'use client'

/**
 * How It Works Page
 * 3D timeline with floating steps in depth
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  CalendarIcon,
  SparklesIcon,
  BrainIcon,
  LightbulbIcon,
} from 'lucide-react'
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout'
import { SpaceCard } from '@/components/space/space-card'
import { SpaceButton } from '@/components/space/space-button'
import { GlassBackground } from '@/components/glass/glass-background'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingFooter } from '@/components/landing/landing-footer'
import { CrystalNumerologyCube } from '@/components/3d/crystal-numerology-cube'

const steps = [
  {
    number: 1,
    icon: <CalendarIcon className="w-8 h-8" />,
    title: 'Enter Your Birth Date',
    description:
      'Provide your date of birth and we\'ll calculate your core numerology numbers',
    color: 'cyan' as const,
  },
  {
    number: 2,
    icon: <SparklesIcon className="w-8 h-8" />,
    title: 'AI Calculation',
    description:
      'Our AI analyzes your numbers using ancient numerology wisdom combined with modern algorithms',
    color: 'purple' as const,
  },
  {
    number: 3,
    icon: <BrainIcon className="w-8 h-8" />,
    title: 'AI Interpretation',
    description:
      'Get personalized insights and interpretations based on your unique numerology profile',
    color: 'blue' as const,
  },
  {
    number: 4,
    icon: <LightbulbIcon className="w-8 h-8" />,
    title: 'Daily Guidance',
    description:
      'Receive daily readings, predictions, and actionable guidance for your life journey',
    color: 'pink' as const,
  },
]

export default function HowItWorksPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={80} />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
            How It Works
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover your cosmic destiny in four simple steps
          </p>
        </motion.div>

        {/* 3D Timeline with Floating Steps */}
        <div className="relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -50, z: -100 }}
              whileInView={{ opacity: 1, x: 0, z: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="mb-12 last:mb-0"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                zIndex: steps.length - index, // Higher z-index for earlier steps
              }}
            >
              <SpaceCard
                variant="premium"
                className="p-6 md:p-8 hover:shadow-cyan-500/20 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Step Number (3D Cube) */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                    className="flex-shrink-0"
                  >
                    <CrystalNumerologyCube
                      number={step.number}
                      size="lg"
                      color={step.color}
                      animate={true}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                        {step.icon}
                      </div>
                      <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                        {step.title}
                      </h2>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </SpaceCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <SpaceButton
            variant="primary"
            size="lg"
            onClick={() => router.push('/register')}
            icon={<SparklesIcon className="w-5 h-5" />}
          >
            Start Your Journey
          </SpaceButton>
        </motion.div>
      </div>

      <LandingFooter />
    </div>
  )
}
