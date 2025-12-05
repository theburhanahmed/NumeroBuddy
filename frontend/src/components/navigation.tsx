'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppNavbar } from '@/components/navigation/app-navbar';
import { LandingNav } from '@/components/landing/landing-nav';

export function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Use LandingNav for landing page, AppNavbar for authenticated pages
  const isLandingPage = pathname === '/';
  
  if (isLandingPage) {
    return <LandingNav />;
  }
  
  if (user) {
    return <AppNavbar />;
  }
  
  // For unauthenticated pages (login, register, etc.), show nothing or minimal nav
  return null;
}