'use client'

import React from 'react'
import { GlassBackground } from '@/components/glass/glass-background'

interface CosmicPageLayoutProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
}

/**
 * Reusable cosmic page layout wrapper using glassmorphism design
 * Provides consistent structure across all app pages
 * Adapted for Next.js App Router
 * Note: Navbar is now handled globally in root layout
 */
export function CosmicPageLayout({
  children,
  maxWidth = '7xl',
}: CosmicPageLayoutProps) {
  const maxWidthClasses: Record<NonNullable<CosmicPageLayoutProps['maxWidth']>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={80} />

      <div
        className={`relative z-10 ${maxWidthClasses[maxWidth]} mx-auto px-4 md:px-6 py-6 md:py-8 pt-28`}
      >
        {children}
      </div>
    </div>
  )
}
