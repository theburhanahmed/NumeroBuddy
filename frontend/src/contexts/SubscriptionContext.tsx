import React, { useEffect, useState, createContext, useContext } from 'react';
export type SubscriptionTier = 'free' | 'premium' | 'enterprise';
interface UsageLimits {
  dailyReadings: {
    used: number;
    limit: number;
  };
  monthlyReports: {
    used: number;
    limit: number;
  };
  aiMessages: {
    used: number;
    limit: number;
  };
}
interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  hasAccess: (feature: string) => boolean;
  canAccessFeature: (requiredTier: SubscriptionTier) => boolean;
  usageLimits: UsageLimits;
  incrementUsage: (feature: keyof UsageLimits) => boolean;
  canUseFeature: (feature: keyof UsageLimits) => boolean;
  resetDailyLimits: () => void;
}
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);
const tierHierarchy: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 1,
  enterprise: 2
};
const featureAccess: Record<string, SubscriptionTier> = {
  // Free features
  'basic-life-path': 'free',
  'basic-daily-reading': 'free',
  'basic-name-analysis': 'free',
  // Premium features
  'full-numerology-report': 'premium',
  'all-calculators': 'premium',
  'unlimited-daily-readings': 'premium',
  remedies: 'premium',
  'ai-chat': 'premium',
  forecasts: 'premium',
  'birth-chart': 'premium',
  compatibility: 'premium',
  'phone-numerology': 'premium',
  'business-numerology': 'premium',
  'auspicious-dates': 'premium',
  'community-forum': 'premium',
  'learning-hub': 'premium',
  // Enterprise features
  consultations: 'enterprise',
  'priority-support': 'enterprise',
  'advanced-analytics': 'enterprise',
  'custom-reports': 'enterprise',
  'api-access': 'enterprise'
};
const defaultLimits: Record<SubscriptionTier, UsageLimits> = {
  free: {
    dailyReadings: {
      used: 0,
      limit: 3
    },
    monthlyReports: {
      used: 0,
      limit: 1
    },
    aiMessages: {
      used: 0,
      limit: 0
    }
  },
  premium: {
    dailyReadings: {
      used: 0,
      limit: -1
    },
    monthlyReports: {
      used: 0,
      limit: 10
    },
    aiMessages: {
      used: 0,
      limit: 50
    }
  },
  enterprise: {
    dailyReadings: {
      used: 0,
      limit: -1
    },
    monthlyReports: {
      used: 0,
      limit: -1
    },
    aiMessages: {
      used: 0,
      limit: -1
    }
  }
};
export function SubscriptionProvider({ children }: {children: ReactNode;}) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [usageLimits, setUsageLimits] = useState<UsageLimits>(
    defaultLimits.free
  );
  // Update usage limits when tier changes
  useEffect(() => {
    setUsageLimits(defaultLimits[tier]);
  }, [tier]);
  const hasAccess = (feature: string): boolean => {
    const requiredTier = featureAccess[feature];
    if (!requiredTier) return true;
    return tierHierarchy[tier] >= tierHierarchy[requiredTier];
  };
  const canAccessFeature = (requiredTier: SubscriptionTier): boolean => {
    return tierHierarchy[tier] >= tierHierarchy[requiredTier];
  };
  const canUseFeature = (feature: keyof UsageLimits): boolean => {
    const limit = usageLimits[feature];
    if (limit.limit === -1) return true; // Unlimited
    return limit.used < limit.limit;
  };
  const incrementUsage = (feature: keyof UsageLimits): boolean => {
    if (!canUseFeature(feature)) return false;
    setUsageLimits((prev) => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        used: prev[feature].used + 1
      }
    }));
    return true;
  };
  const resetDailyLimits = () => {
    setUsageLimits((prev) => ({
      ...prev,
      dailyReadings: {
        ...prev.dailyReadings,
        used: 0
      },
      aiMessages: {
        ...prev.aiMessages,
        used: 0
      }
    }));
  };
  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        setTier,
        hasAccess,
        canAccessFeature,
        usageLimits,
        incrementUsage,
        canUseFeature,
        resetDailyLimits
      }}>

      {children}
    </SubscriptionContext.Provider>);

}
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }
  return context;
}