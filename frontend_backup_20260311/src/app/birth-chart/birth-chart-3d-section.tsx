'use client'

/**
 * 3D Lo Shu Grid section for birth-chart page.
 * Loaded only on the client to avoid @react-three/fiber SSR/prerender errors.
 */

import React, { Suspense } from 'react'
import { LoShu3DGrid } from '@/components/3d/birth-chart/lo-shu-3d-grid'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import { Environment } from '@react-three/drei'

interface BirthChart3DSectionProps {
  grid: (number | null)[][]
  onNumberClick?: (number: number, row: number, col: number) => void
}

export function BirthChart3DSection({ grid, onNumberClick }: BirthChart3DSectionProps) {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <CanvasWrapper
        className="w-full h-full"
        fallback={
          <LoShu3DGrid
            grid={grid}
            onNumberClick={onNumberClick}
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
          grid={grid}
          onNumberClick={onNumberClick}
          enableHover={true}
          forceMode="webgl"
        />
      </CanvasWrapper>
    </div>
  )
}
