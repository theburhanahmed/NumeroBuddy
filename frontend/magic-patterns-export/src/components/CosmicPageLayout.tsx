import React from 'react';
import { AppNavbar } from './AppNavbar';
import { AccessibleSpaceBackground } from './AccessibleSpaceBackground';
interface CosmicPageLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  showNavbar?: boolean;
  className?: string;
}
/**
 * Reusable cosmic page layout wrapper
 * Provides consistent structure and spacing across all pages
 * Enforces pt-28 for navbar clearance
 */
export function CosmicPageLayout({
  children,
  maxWidth = '7xl',
  showNavbar = true,
  className = ''
}: CosmicPageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };
  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      {showNavbar && <AppNavbar />}

      <main
        className={`
          relative z-10 
          mx-auto 
          px-4 md:px-6 
          py-6 md:py-8 
          ${showNavbar ? 'pt-28' : 'pt-8'} 
          ${maxWidthClasses[maxWidth]}
          ${className}
        `}>

        {children}
      </main>
    </div>);

}