'use client'

/**
 * 3D Lo Shu Grid demo block — loaded only on the client to avoid SSR/prerender
 * issues with @react-three/fiber and @react-three/drei.
 */

import React, { Suspense } from 'react'
import { SpaceCard } from '@/components/space/space-card'
import { LoShu3DGrid } from '@/components/3d/birth-chart/lo-shu-3d-grid'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import { Environment } from '@react-three/drei'
import { StarIcon } from 'lucide-react'

const demoGrid: (number | null)[][] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
]

export function BirthChartDemo3D() {
  return (
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

      <div className="relative w-full h-[600px] flex items-center justify-center">
        <CanvasWrapper
          className="w-full h-full"
          fallback={
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

      <div className="mt-8 p-6 bg-[#1a2942]/40 backdrop-blur-xl rounded-xl border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
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
  )
}
