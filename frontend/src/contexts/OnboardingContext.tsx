'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { userAPI } from '@/lib/api-client'

interface OnboardingContextType {
  isOnboardingComplete: boolean
  showOnboarding: boolean
  completeOnboarding: () => void
  dismissOnboarding: () => void
  triggerOnboarding: () => void
  refreshOnboardingStatus: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const refreshOnboardingStatus = useCallback(async () => {
    if (!user || typeof window === 'undefined') return
    try {
      const response = await userAPI.getProfile()
      const profileData = response.data?.user || response.data
      // Primary: use profile_completed_at from API (server-side source of truth)
      const serverComplete = Boolean(profileData?.profile_completed_at)
      const hasRequiredFields = Boolean(profileData?.date_of_birth && (profileData?.full_name || user?.full_name))
      const completed = serverComplete || hasRequiredFields
      setIsOnboardingComplete(completed)
      if (completed) {
        localStorage.setItem('onboarding_complete', 'true')
      }
    } catch {
      // Fallback: localStorage for backward compatibility when API fails
      const localComplete = localStorage.getItem('onboarding_complete') === 'true'
      setIsOnboardingComplete(localComplete)
    }
  }, [user])

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      refreshOnboardingStatus()
    } else if (typeof window !== 'undefined') {
      const localComplete = localStorage.getItem('onboarding_complete') === 'true'
      setIsOnboardingComplete(localComplete)
    }
  }, [user, refreshOnboardingStatus])

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
        refreshOnboardingStatus,
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

