'use client'

/**
 * WebGL Canvas Wrapper with Performance Guards
 * Provides fallback to CSS-based 3D when WebGL is unavailable
 */

import React, { Suspense, ReactNode } from 'react'
import { Canvas, CanvasProps } from '@react-three/fiber'
import { use3DPerformance } from '@/hooks/use-3d-performance'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface CanvasWrapperProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode
  fallback?: ReactNode
  enableShadows?: boolean
  minFPS?: number
  autoDisable?: boolean
  className?: string
}

/**
 * Canvas wrapper with performance guards and CSS fallback
 */
export function CanvasWrapper({
  children,
  fallback,
  enableShadows,
  minFPS = 30,
  autoDisable = true,
  className = '',
  ...canvasProps
}: CanvasWrapperProps) {
  const { shouldRender3D, settings, capabilities } = use3DPerformance(
    minFPS,
    autoDisable
  )
  const prefersReducedMotion = useReducedMotion()

  // Mobile detection is handled by capabilities.isMobile from use3DPerformance

  // Don't render 3D if disabled or reduced motion preferred
  if (!shouldRender3D || prefersReducedMotion || !capabilities.hasWebGL) {
    return (
      <div className={`relative ${className}`} aria-hidden="true">
        {fallback || (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            {/* Default CSS fallback */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20" />
              <p className="text-sm">3D rendering unavailable</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Merge performance-optimized settings with user-provided props
  // Mobile optimizations: disable shadows, reduce antialias
  const mergedProps: CanvasProps = {
    dpr: settings.dpr as [number, number],
    shadows: enableShadows !== undefined ? enableShadows : (settings.shadows && !capabilities.isMobile),
    gl: {
      antialias: settings.antialias && !capabilities.isMobile,
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: capabilities.isLowEndDevice ? 'default' : 'high-performance',
      // Mobile optimizations
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false,
    },
    camera: {
      position: [0, 0, 5],
      fov: capabilities.isMobile ? 60 : 75, // Smaller FOV on mobile for performance
    },
    // Performance: only one WebGL canvas per page
    frameloop: prefersReducedMotion ? 'never' : 'always',
    ...canvasProps,
  }

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <Suspense
        fallback={
          fallback || (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          )
        }
      >
        <Canvas {...mergedProps}>{children}</Canvas>
      </Suspense>
    </div>
  )
}
