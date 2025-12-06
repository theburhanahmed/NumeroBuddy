'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

interface UsageLimits {
  monthlyReports: {
    used: number;
    limit: number;
  };
  [key: string]: {
    used: number;
    limit: number;
  };
}

interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  hasAccess: (feature: string) => boolean;
  usageLimits: UsageLimits;
  canUseFeature: (feature: string) => boolean;
  incrementUsage: (feature: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const tierLimits: Record<SubscriptionTier, UsageLimits> = {
  free: {
    monthlyReports: { used: 0, limit: 1 },
  },
  premium: {
    monthlyReports: { used: 0, limit: 10 },
  },
  enterprise: {
    monthlyReports: { used: 0, limit: -1 }, // -1 means unlimited
  },
};

const featureTierMap: Record<string, SubscriptionTier> = {
  'full-numerology-report': 'premium',
  'auspicious-dates': 'premium',
  'ai-chat': 'premium',
  'advanced-numerology': 'premium',
  'monthlyReports': 'free',
};

// Map backend subscription plans to frontend tiers
function mapBackendTierToFrontend(backendTier: string | undefined | null): SubscriptionTier {
  if (!backendTier) return 'free';
  
  const tierMap: Record<string, SubscriptionTier> = {
    'free': 'free',
    'basic': 'premium',
    'premium': 'premium',
    'elite': 'enterprise',
    'enterprise': 'enterprise',
  };
  
  return tierMap[backendTier.toLowerCase()] || 'free';
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tier, setTierState] = useState<SubscriptionTier>('free');
  const [usageLimits, setUsageLimits] = useState<UsageLimits>(tierLimits.free);

  useEffect(() => {
    // Check user's actual subscription from backend
    if (user) {
      // Check if user has is_premium flag or subscription_plan
      const userTier = mapBackendTierToFrontend(
        (user as any).subscription_plan || ((user as any).is_premium ? 'premium' : 'free')
      );
      setTierState(userTier);
      setUsageLimits(tierLimits[userTier]);
    } else {
      // No user, default to free
      setTierState('free');
      setUsageLimits(tierLimits.free);
    }

    // Load usage from localStorage
    const savedUsage = localStorage.getItem('subscription_usage');
    if (savedUsage) {
      try {
        const parsed = JSON.parse(savedUsage);
        setUsageLimits((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [user]);

  const setTier = useCallback((newTier: SubscriptionTier) => {
    setTierState(newTier);
    setUsageLimits(tierLimits[newTier]);
    localStorage.setItem('subscription_tier', newTier);
  }, []);

  const hasAccess = useCallback(
    (feature: string): boolean => {
      const requiredTier = featureTierMap[feature] || 'free';
      const tierHierarchy: Record<SubscriptionTier, number> = {
        free: 0,
        premium: 1,
        enterprise: 2,
      };
      return tierHierarchy[tier] >= tierHierarchy[requiredTier];
    },
    [tier]
  );

  const canUseFeature = useCallback(
    (feature: string): boolean => {
      if (!hasAccess(feature)) return false;
      const limit = usageLimits[feature];
      if (!limit) return true;
      if (limit.limit === -1) return true; // Unlimited
      return limit.used < limit.limit;
    },
    [hasAccess, usageLimits]
  );

  const incrementUsage = useCallback(
    (feature: string) => {
      setUsageLimits((prev) => {
        const newLimits = { ...prev };
        if (newLimits[feature]) {
          newLimits[feature] = {
            ...newLimits[feature],
            used: newLimits[feature].used + 1,
          };
        } else {
          newLimits[feature] = { used: 1, limit: 1 };
        }
        localStorage.setItem('subscription_usage', JSON.stringify(newLimits));
        return newLimits;
      });
    },
    []
  );

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        setTier,
        hasAccess,
        usageLimits,
        canUseFeature,
        incrementUsage,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

