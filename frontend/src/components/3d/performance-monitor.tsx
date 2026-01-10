'use client'

/**
 * Performance Monitor Component (Dev Only)
 * Displays FPS and performance metrics for 3D rendering
 */

import React, { useEffect, useState } from 'react'
import { use3DPerformance } from '@/hooks/use-3d-performance'

interface PerformanceMonitorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  enabled?: boolean
}

/**
 * Performance monitor for 3D rendering (dev only)
 */
export function PerformanceMonitor({
  position = 'top-right',
  enabled = process.env.NODE_ENV === 'development',
}: PerformanceMonitorProps) {
  const { fps, capabilities, isPerformanceStable, shouldRender3D } =
    use3DPerformance()
  const [isVisible, setIsVisible] = useState(enabled)

  // Toggle visibility with 'P' key (dev only)
  useEffect(() => {
    if (!enabled) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [enabled])

  if (!enabled || !isVisible) {
    return null
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  const fpsColor =
    fps >= 55
      ? 'text-green-400'
      : fps >= 30
        ? 'text-yellow-400'
        : 'text-red-400'

  return (
    <div
      className={`fixed ${positionClasses[position]} z-[9999] pointer-events-none`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-[#1a2942]/90 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-3 text-xs font-mono text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white/60">FPS:</span>
            <span className={fpsColor}>{fps.toFixed(0)}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isPerformanceStable ? 'bg-green-400' : 'bg-red-400'
              }`}
              aria-label={
                isPerformanceStable ? 'Performance stable' : 'Performance poor'
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">3D:</span>
            <span className={shouldRender3D ? 'text-green-400' : 'text-red-400'}>
              {shouldRender3D ? 'ON' : 'OFF'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">WebGL:</span>
            <span
              className={capabilities.hasWebGL ? 'text-green-400' : 'text-red-400'}
            >
              {capabilities.hasWebGL ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">Device:</span>
            <span
              className={
                capabilities.isLowEndDevice ? 'text-yellow-400' : 'text-green-400'
              }
            >
              {capabilities.isLowEndDevice ? 'Low-end' : 'High-end'}
            </span>
          </div>
          {capabilities.isMobile && (
            <div className="flex items-center gap-2">
              <span className="text-white/60">Platform:</span>
              <span className="text-cyan-400">Mobile</span>
            </div>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-white/10 text-white/40">
          Press Cmd/Ctrl+P to toggle
        </div>
      </div>
    </div>
  )
}
