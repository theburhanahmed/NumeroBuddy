'use client'

import React from 'react'
import { GlassBackground } from './glass-background'
import { GlassNav } from './glass-nav'

interface GlassPageLayoutProps {
  children: React.ReactNode
  showNav?: boolean
  showPlanet?: boolean
  showMountains?: boolean
  showSilhouettes?: boolean
  starCount?: number
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
}

const maxWidthClasses: Record<NonNullable<GlassPageLayoutProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

export function GlassPageLayout({
  children,
  showNav = true,
  showPlanet = false,
  showMountains = false,
  showSilhouettes = false,
  starCount = 80,
  maxWidth = '7xl',
}: GlassPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground
        starCount={starCount}
        showPlanet={showPlanet}
        showMountains={showMountains}
        showSilhouettes={showSilhouettes}
      />

      <div className="relative z-10">
        {showNav && <GlassNav />}
        <div
          className={`${maxWidthClasses[maxWidth]} mx-auto px-4 md:px-6 py-6 md:py-8 pt-28`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
