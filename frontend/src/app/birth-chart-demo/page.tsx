'use client'

/**
 * Birth Chart Demo Page
 * Public demo of 3D birth chart for non-authenticated users
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { StarIcon, ArrowRightIcon } from 'lucide-react'
import { AccessibleSpaceBackground } from '@/components/space/accessible-space-background'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingFooter } from '@/components/landing/landing-footer'
import { SpaceCard } from '@/components/space/space-card'
import { SpaceButton } from '@/components/space/space-button'
import { LoShu3DGrid } from '@/components/3d/birth-chart/lo-shu-3d-grid'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import { Suspense } from 'react'
import { Environment } from '@react-three/drei'

// Demo grid data (example)
const demoGrid: (number | null)[][] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
] // Classic Lo Shu grid for demo

export default function BirthChartDemoPage() {
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

        {/* 3D Lo Shu Grid Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <SpaceCard variant="premium" className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                Interactive 3D Lo Shu Grid
              </h2>
              <div className="flex items-center gap-2 text-cyan-400">
                <StarIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Interactive</span>
              </div>
            </div>

            {/* 3D Grid Demo */}
            <div className="relative w-full h-[600px] flex items-center justify-center">
              <CanvasWrapper
                className="w-full h-full"
                fallback={
                  /* CSS fallback */
                  <LoShu3DGrid
                    grid={demoGrid}
                    onNumberClick={(number, row, col) => {
                      console.log(`Number ${number} clicked (Row ${row}, Col ${col})`)
                    }}
                    enableHover={true}
                  />
                }
              >
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
                  <Suspense fallback={null}>
                    <Environment preset="city" />
                  </Suspense>
                  <LoShu3DGrid
                    grid={demoGrid}
                    onNumberClick={(number, row, col) => {
                      console.log(`Number ${number} clicked (Row ${row}, Col ${col})`)
                    }}
                    enableHover={true}
                    forceMode="webgl"
                  />
              </CanvasWrapper>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-6 bg-[#1a2942]/40 backdrop-blur-xl rounded-xl border border-cyan-500/20">
              <h3 className="text-lg font-semibold text-white mb-3">
                How to Use
              </h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Hover over numbers to see them highlight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Click on numbers to learn more about their meaning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Missing numbers appear as hollow spaces</span>
                </li>
              </ul>
            </div>
          </SpaceCard>
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
