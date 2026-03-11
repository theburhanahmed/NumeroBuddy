'use client'

/**
 * Hero 3D Scene - Main Container
 * Wraps WebGL 3D components with fallback to CSS version
 */

import React, { Suspense } from 'react'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import { LifePathOrb } from './life-path-orb'
import { NumberTorus } from './number-torus'
import { ScrollInteraction } from './scroll-interaction'
import { OrbitControls, Environment } from '@react-three/drei'
import { use3DPerformance } from '@/hooks/use-3d-performance'

interface Hero3DSceneProps {
  lifePathNumber?: number
  numbers?: number[]
  onCTAClick?: () => void
  className?: string
}

/**
 * Hero 3D Scene Component
 * Renders WebGL 3D scene with fallback to CSS-based CosmicHero
 */
export function Hero3DScene({
  lifePathNumber = 7,
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  onCTAClick,
  className = '',
}: Hero3DSceneProps) {
  const { shouldRender3D, capabilities } = use3DPerformance()

  // If WebGL unavailable, return null - parent component handles CSS fallback
  if (!shouldRender3D || !capabilities.hasWebGL) {
    return null
  }

  return (
    <CanvasWrapper
      className={`relative w-full h-full ${className}`}
      enableShadows={capabilities.supportsShadows}
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 animate-pulse" />
            <p className="text-sm">Loading 3D scene...</p>
          </div>
        </div>
      }
    >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />

          {/* Environment for better lighting */}
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          {/* Camera is handled by CanvasWrapper */}

          {/* Scroll interactions */}
          <ScrollInteraction enabled={true} />

          {/* Main Life Path Orb (center) */}
          <LifePathOrb
            number={lifePathNumber}
            position={[0, 0, 0]}
            size={1.5}
            glowIntensity={2}
            rotationSpeed={0.3}
            pulseSpeed={1.5}
          />

          {/* Number Torus (orbiting numbers) */}
          <NumberTorus
            numbers={numbers}
            radius={3}
            tubeRadius={0.8}
            rotationSpeed={0.2}
            hoverExpand={true}
          />

          {/* Orbit controls for interaction (optional, can disable) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(2 * Math.PI) / 3}
          />
      </CanvasWrapper>
  )
}

