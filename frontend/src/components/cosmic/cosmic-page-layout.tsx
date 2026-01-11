'use client'

import React from 'react'
import { AccessibleSpaceBackground } from '@/components/space/accessible-space-background'

interface CosmicPageLayoutProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl'
}

/**
 * Reusable cosmic page layout wrapper
 * Provides consistent structure across all pages
 * Adapted for Next.js App Router
 * Note: Navbar is now handled globally in root layout
 */
export function CosmicPageLayout({
  children,
  maxWidth = '7xl',
}: CosmicPageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
  }

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />

      <div
        className={`relative z-10 ${maxWidthClasses[maxWidth]} mx-auto px-4 md:px-6 py-6 md:py-8 pt-28`}
      >
        {children}
      </div>
    </div>
  )
}
