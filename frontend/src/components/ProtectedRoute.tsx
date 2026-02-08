'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/loading/loading-spinner';
import { GlassBackground } from '@/components/glass/glass-background';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="relative w-full min-h-screen bg-[#0a1628] flex items-center justify-center">
        <GlassBackground starCount={80} />
        <div className="relative z-10">
          <LoadingSpinner size="lg" message="Loading..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}