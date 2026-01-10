'use client'

/**
 * Lo Shu 3D Grid - Wrapper Component
 * 3×3 grid in 3D space for birth chart visualization
 * Falls back to CSS grid when WebGL is unavailable
 */

import React from 'react'
import { use3DPerformance } from '@/hooks/use-3d-performance'
import { LoShu3DGridWebGL } from './lo-shu-3d-grid-webgl'
import { CrystalNumerologyCube } from '@/components/3d/crystal-numerology-cube'

interface LoShu3DGridProps {
  grid: (number | null)[][] // 3x3 grid, null for missing numbers
  onNumberClick?: (number: number, row: number, col: number) => void
  enableHover?: boolean
  className?: string
  /**
   * Force render as WebGL (inside Canvas) or CSS (outside Canvas)
   * If undefined, auto-detects based on context
   */
  forceMode?: 'webgl' | 'css'
}

/**
 * Lo Shu 3D Grid Component
 * Wrapper that chooses between CSS fallback and WebGL version
 * - If WebGL unavailable: renders CSS grid with CrystalNumerologyCube
 * - If WebGL available and inside Canvas: renders WebGL version
 * - If WebGL available but outside Canvas: renders CSS version
 */
export function LoShu3DGrid({
  grid,
  onNumberClick,
  enableHover = true,
  className = '',
  forceMode,
}: LoShu3DGridProps) {
  const { shouldRender3D, capabilities } = use3DPerformance()

  // If force mode is set, use it
  if (forceMode === 'webgl' && shouldRender3D && capabilities.hasWebGL) {
    return <LoShu3DGridWebGL grid={grid} onNumberClick={onNumberClick} enableHover={enableHover} />
  }

  // If WebGL unavailable or force CSS, render CSS fallback
  if (forceMode === 'css' || !shouldRender3D || !capabilities.hasWebGL) {
    return (
      <div className={`grid grid-cols-3 gap-4 ${className}`}>
        {grid.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            if (number === null) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-24 h-24 rounded-lg border-2 border-cyan-500/20 bg-[#1a2942]/40 backdrop-blur-xl flex items-center justify-center"
                  aria-label="Missing number"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-500/30" />
                </div>
              )
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="relative group cursor-pointer"
                onClick={() => onNumberClick?.(number, rowIndex, colIndex)}
              >
                <CrystalNumerologyCube
                  number={number}
                  size="lg"
                  color="cyan"
                  animate={true}
                />
                {enableHover && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="px-2 py-1 bg-[#1a2942]/90 backdrop-blur-xl rounded-lg border border-cyan-500/30 text-xs text-white whitespace-nowrap">
                      Number {number}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    )
  }

  // Default: try WebGL if available (assumes inside Canvas when forceMode is 'webgl')
  // Parent component should ensure this is only called inside Canvas when using forceMode='webgl'
  if (shouldRender3D && capabilities.hasWebGL) {
    return <LoShu3DGridWebGL grid={grid} onNumberClick={onNumberClick} enableHover={enableHover} />
  }

  // Final fallback to CSS (should not reach here, but just in case)
  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {grid.map((row, rowIndex) =>
        row.map((number, colIndex) => {
          if (number === null) {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-24 h-24 rounded-lg border-2 border-cyan-500/20 bg-[#1a2942]/40 backdrop-blur-xl flex items-center justify-center"
                aria-label="Missing number"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-500/30" />
              </div>
            )
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="relative group cursor-pointer"
              onClick={() => onNumberClick?.(number, rowIndex, colIndex)}
            >
              <CrystalNumerologyCube
                number={number}
                size="lg"
                color="cyan"
                animate={true}
              />
              {enableHover && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="px-2 py-1 bg-[#1a2942]/90 backdrop-blur-xl rounded-lg border border-cyan-500/30 text-xs text-white whitespace-nowrap">
                    Number {number}
                  </div>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
