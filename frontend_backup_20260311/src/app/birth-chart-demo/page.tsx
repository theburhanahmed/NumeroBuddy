'use client'

/**
 * Birth Chart Demo Page
 * Public demo of 3D birth chart for non-authenticated users
 */

import React from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { StarIcon, ArrowRightIcon } from 'lucide-react'
import { GlassBackground } from '@/components/glass/glass-background'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingFooter } from '@/components/landing/landing-footer'
import { SpaceCard } from '@/components/space/space-card'
import { SpaceButton } from '@/components/space/space-button'

// Load 3D section only on client to avoid @react-three/fiber SSR/prerender errors
const BirthChartDemo3D = dynamic(
  () => import('./birth-chart-demo-3d').then((m) => m.BirthChartDemo3D),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-[600px] flex items-center justify-center rounded-xl bg-[#1a2942]/40 border border-cyan-500/20">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    ),
  }
)

export default function BirthChartDemoPage() {
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
            3D Birth Chart Demo
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Experience the power of 3D numerology visualization
          </p>
          <SpaceButton
            variant="primary"
            size="lg"
            onClick={() => router.push('/register')}
            icon={<ArrowRightIcon className="w-5 h-5" />}
          >
            Create Your Birth Chart
          </SpaceButton>
        </motion.div>

        {/* 3D Lo Shu Grid Demo — client-only to avoid prerender errors */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <BirthChartDemo3D />
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <SpaceCard variant="default" className="p-6 text-center">
            <StarIcon className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">3D Visualization</h3>
            <p className="text-white/70 text-sm">
              Experience your numerology chart in immersive 3D space
            </p>
          </SpaceCard>
          <SpaceCard variant="default" className="p-6 text-center">
            <StarIcon className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Interactive</h3>
            <p className="text-white/70 text-sm">
              Explore each number with hover effects and click interactions
            </p>
          </SpaceCard>
          <SpaceCard variant="default" className="p-6 text-center">
            <StarIcon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Personalized</h3>
            <p className="text-white/70 text-sm">
              Get your unique birth chart based on your numerology profile
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
            onClick={() => router.push('/register')}
            icon={<ArrowRightIcon className="w-5 h-5" />}
          >
            Get Your Birth Chart
          </SpaceButton>
        </motion.div>
      </div>

      <LandingFooter />
    </div>
  )
}
