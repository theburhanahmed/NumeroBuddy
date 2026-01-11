'use client'

/**
 * AI Numerologist Page
 * Abstract "AI Core" sphere with light pulses when AI responds
 * Conversation subtly affects the core shape
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MessageSquareIcon, SparklesIcon } from 'lucide-react'
import { AccessibleSpaceBackground } from '@/components/space/accessible-space-background'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingFooter } from '@/components/landing/landing-footer'
import { SpaceCard } from '@/components/space/space-card'
import { SpaceButton } from '@/components/space/space-button'
import { LiquidMetalOrb } from '@/components/effects/liquid-metal-orb'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'

export default function AINumerologistPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
            AI Numerologist
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Your personal numerology guide powered by advanced AI
          </p>
        </motion.div>

        {/* AI Core Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <SpaceCard variant="premium" className="p-6 md:p-8">
            <div className="relative h-[600px] flex items-center justify-center">
              {/* AI Core Sphere with Pulse Animation */}
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <LiquidMetalOrb size="lg" />

                {/* Pulsing Rings */}
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
                    style={{
                      width: `${100 + ring * 40}%`,
                      height: `${100 + ring * 40}%`,
                      left: `${-ring * 20}%`,
                      top: `${-ring * 20}%`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: ring * 0.3,
                    }}
                  />
                ))}

                {/* Neural Network Visualization */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2
                    const radius = 150
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius

                    return (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-cyan-400"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    )
                  })}
                </div>
              </motion.div>

              {/* Glassmorphism Info Panel */}
              <motion.div
                className="absolute bottom-8 left-8 right-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-[#1a2942]/40 backdrop-blur-2xl rounded-2xl border border-cyan-500/20 p-6 shadow-2xl shadow-cyan-500/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        <SparklesIcon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        AI-Powered Insights
                      </p>
                      <p className="text-xs text-white/60">
                        Real-time numerology analysis
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </SpaceCard>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">
              24/7 Availability
            </h3>
            <p className="text-white/70">
              Get instant answers to your numerology questions anytime, anywhere
            </p>
          </SpaceCard>
          <SpaceCard variant="default" className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">
              Personalized Guidance
            </h3>
            <p className="text-white/70">
              AI that understands your unique numerology profile and adapts to your needs
            </p>
          </SpaceCard>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <SpaceButton
            variant="primary"
            size="lg"
            onClick={() => router.push('/ai-chat')}
            icon={<MessageSquareIcon className="w-5 h-5" />}
          >
            Start Chatting
          </SpaceButton>
        </motion.div>
      </div>

      <LandingFooter />
    </div>
  )
}
