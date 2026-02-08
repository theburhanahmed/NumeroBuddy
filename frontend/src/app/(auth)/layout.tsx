import React from 'react';
import { GlassBackground } from '@/components/glass/glass-background';

/**
 * Layout for authentication pages (login, register, etc.)
 * Provides a clean layout without main navigation
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={80} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

