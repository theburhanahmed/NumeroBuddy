'use client'

/**
 * Features Page (Deep)
 * Feature modules with micro-3D scenes
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  SparklesIcon,
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
  HeartIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MessageSquareIcon,
  GitCompareIcon,
} from 'lucide-react'
import { AccessibleSpaceBackground } from '@/components/space/accessible-space-background'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingFooter } from '@/components/landing/landing-footer'
import { SpaceCard } from '@/components/space/space-card'
import { SpaceButton } from '@/components/space/space-button'
import { CrystalNumerologyCube } from '@/components/3d/crystal-numerology-cube'
import { LiquidMetalOrb } from '@/components/effects/liquid-metal-orb'

const features = [
  {
    icon: <SparklesIcon className="w-8 h-8" />,
    title: 'AI Numerologist',
    description:
      'Chat with our AI-powered numerologist for instant personalized insights and guidance',
    tooltip: 'Get real-time answers to your numerology questions 24/7',
    color: 'cyan' as const,
    scene: 'ai-core', // AI Core sphere with pulse animations
  },
  {
    icon: <StarIcon className="w-8 h-8" />,
    title: 'Birth Chart Analysis',
    description: 'Detailed 3D visualization of your complete numerology profile',
    tooltip: 'Discover your Life Path, Destiny, and Soul Urge numbers',
    color: 'purple' as const,
    scene: 'grid', // 3D number grid forming
  },
  {
    icon: <MessageSquareIcon className="w-8 h-8" />,
    title: 'AI Chat',
    description:
      'Intelligent conversations that adapt to your numerology profile',
    tooltip: 'AI that understands your unique numerological makeup',
    color: 'blue' as const,
    scene: 'neural', // Pulsing neural-like number nodes
  },
  {
    icon: <CalendarIcon className="w-8 h-8" />,
    title: 'Daily Reading',
    description: 'Personalized daily insights delivered to your inbox',
    tooltip: 'Receive cosmic guidance every day',
    color: 'pink' as const,
    scene: 'cards', // Calendar cube flipping
  },
  {
    icon: <GitCompareIcon className="w-8 h-8" />,
    title: 'Compatibility',
    description: 'Analyze relationships and partnerships through numerology',
    tooltip: 'Understand relationship dynamics through numbers',
    color: 'purple' as const,
    scene: 'merge', // Two number orbs merging
  },
  {
    icon: <SparklesIcon className="w-8 h-8" />,
    title: 'Remedies',
    description: 'Personalized gemstones, colors, and rituals for balance',
    tooltip: 'Custom recommendations for harmony and alignment',
    color: 'pink' as const,
    scene: 'gemstones', // Gemstones floating & rotating
  },
]

export default function FeaturesPage() {
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
            Powerful Features
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Everything you need for your numerology journey
          </p>
        </motion.div>

        {/* Feature Modules with Micro-3D Scenes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20, z: -50 }}
              whileInView={{ opacity: 1, y: 0, z: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, z: 10 }}
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              <SpaceCard
                variant="premium"
                className="p-6 md:p-8 h-full group cursor-pointer"
              >
                {/* Micro-3D Scene */}
                <div className="relative h-32 mb-6 flex items-center justify-center">
                  {feature.scene === 'ai-core' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <LiquidMetalOrb size="md" />
                    </motion.div>
                  )}
                  {feature.scene === 'grid' && (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((num) => (
                        <motion.div
                          key={num}
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: num * 0.2,
                          }}
                        >
                          <CrystalNumerologyCube
                            number={num}
                            size="sm"
                            color={feature.color}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {feature.scene === 'neural' && (
                    <div className="relative">
                      {[1, 2, 3, 4].map((num) => (
                        <motion.div
                          key={num}
                          className="absolute"
                          style={{
                            left: `${(num % 2) * 40}%`,
                            top: `${Math.floor(num / 2) * 40}%`,
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: num * 0.2,
                          }}
                        >
                          <CrystalNumerologyCube
                            number={num}
                            size="sm"
                            color={feature.color}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {feature.scene === 'cards' && (
                    <motion.div
                      animate={{ rotateY: [0, 15, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 shadow-lg" />
                    </motion.div>
                  )}
                  {feature.scene === 'merge' && (
                    <div className="relative flex items-center justify-center gap-4">
                      <motion.div
                        animate={{ x: [-10, 0, -10] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CrystalNumerologyCube
                          number={1}
                          size="md"
                          color={feature.color}
                        />
                      </motion.div>
                      <motion.div
                        animate={{ x: [10, 0, 10] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CrystalNumerologyCube
                          number={2}
                          size="md"
                          color={feature.color}
                        />
                      </motion.div>
                    </div>
                  )}
                  {feature.scene === 'gemstones' && (
                    <div className="relative">
                      {[1, 2, 3].map((num) => (
                        <motion.div
                          key={num}
                          className="absolute"
                          style={{
                            left: `${num * 25}%`,
                            top: `${num * 20}%`,
                          }}
                          animate={{
                            rotate: [0, 360],
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 3 + num,
                            repeat: Infinity,
                            delay: num * 0.3,
                          }}
                        >
                          <CrystalNumerologyCube
                            number={num}
                            size="sm"
                            color={feature.color}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all border border-cyan-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
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
            Explore All Features
          </SpaceButton>
        </motion.div>
      </div>

      <LandingFooter />
    </div>
  )
}
