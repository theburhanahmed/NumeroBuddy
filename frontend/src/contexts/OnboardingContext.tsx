import React, { useEffect, useState, createContext, useContext } from 'react';
interface OnboardingContextType {
  isOnboardingComplete: boolean;
  currentStep: number;
  totalSteps: number;
  userProfile: {
    birthDate: string;
    location: string;
  };
  setCurrentStep: (step: number) => void;
  updateUserProfile: (
  profile: Partial<OnboardingContextType['userProfile']>)
  => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}
const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);
export function OnboardingProvider({
  children


}: {children: React.ReactNode;}) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [userProfile, setUserProfile] = useState({
    birthDate: '',
    location: ''
  });
  const updateUserProfile = (
  profile: Partial<OnboardingContextType['userProfile']>) =>
  {
    setUserProfile((prev) => ({
      ...prev,
      ...profile
    }));
  };
  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  };
  const resetOnboarding = () => {
    setIsOnboardingComplete(false);
    setCurrentStep(0);
    localStorage.removeItem('onboardingComplete');
  };
  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        currentStep,
        totalSteps,
        userProfile,
        setCurrentStep,
        updateUserProfile,
        completeOnboarding,
        resetOnboarding
      }}>

      {children}
    </OnboardingContext.Provider>);

}
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}