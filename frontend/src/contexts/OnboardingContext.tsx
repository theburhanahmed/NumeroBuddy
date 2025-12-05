'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    // Check localStorage for onboarding status
    const completed = localStorage.getItem('onboarding_complete') === 'true';
    setIsOnboardingComplete(completed);
  }, []);

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem('onboarding_complete', 'true');
  };

  return (
    <OnboardingContext.Provider value={{ isOnboardingComplete, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

