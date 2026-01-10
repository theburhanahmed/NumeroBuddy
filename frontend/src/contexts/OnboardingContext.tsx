'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface OnboardingContextType {
  isOnboardingComplete: boolean
  showOnboarding: boolean
  completeOnboarding: () => void
  dismissOnboarding: () => void
  triggerOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check localStorage for onboarding status on mount
    // Only check completion status, don't auto-show onboarding
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('onboarding_complete') === 'true'
      setIsOnboardingComplete(completed)
      // Don't automatically show onboarding - it must be explicitly triggered
      // This prevents onboarding from appearing on landing page or other non-dashboard pages
    }
  }, [])

  const triggerOnboarding = () => {
    // Only trigger onboarding if not already completed and not dismissed
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('onboarding_complete') === 'true'
      const dismissed = localStorage.getItem('onboarding_dismissed') === 'true'
      if (!completed && !dismissed) {
        setShowOnboarding(true)
      }
    }
  }

  const completeOnboarding = () => {
    setIsOnboardingComplete(true)
    setShowOnboarding(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_complete', 'true')
      // Clear dismissed flag when completing onboarding
      localStorage.removeItem('onboarding_dismissed')
    }
  }

  const dismissOnboarding = () => {
    setShowOnboarding(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_dismissed', 'true')
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        showOnboarding,
        completeOnboarding,
        dismissOnboarding,
        triggerOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

