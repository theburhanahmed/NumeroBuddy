'use client'

import React from 'react'
import { GlassBackground } from '@/components/glass/glass-background'
import { AppNavbar } from '@/components/navigation/app-navbar'

interface PageLayoutProps {
  children: React.ReactNode
  showNav?: boolean
  className?: string
  showEffects?: boolean
}

/**
 * Base page layout with glass cosmic background and navigation
 */
export function PageLayout({
  children,
  showNav = true,
  className = '',
  showEffects = true,
}: PageLayoutProps) {
  return (
    <div
      className={`w-full min-h-screen bg-[#0a1628] relative overflow-hidden ${className}`}
    >
      {showEffects && <GlassBackground starCount={80} />}
      {showNav && <AppNavbar />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

