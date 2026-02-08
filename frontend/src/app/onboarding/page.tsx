/**
 * Onboarding Flow Page
 *
 * Multi-step onboarding wizard for first-time users.
 * Pre-populates from signup data; only collects missing optional fields.
 */

'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  SparklesIcon,
  UserIcon,
  CalendarIcon,
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XIcon,
} from "lucide-react"
import { GlassBackground } from "@/components/glass/glass-background"
import { BaseButton } from "@/components/base/BaseButton"
import { BaseCard } from "@/components/base/BaseCard"
import { BaseInput } from "@/components/base/BaseInput"
import { useAuth } from "@/contexts/auth-context"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { userAPI } from "@/lib/api-client"
import { numerologyAPI } from "@/lib/numerology-api"
import { toast } from "sonner"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  component: React.ReactNode
}

function formatDateForInput(isoDate?: string | null): string {
  if (!isoDate) return ''
  try {
    const d = new Date(isoDate)
    return d.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { completeOnboarding, refreshOnboardingStatus } = useOnboarding()

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent('/onboarding')}`)
    }
  }, [authLoading, user, router])
  const [currentStep, setCurrentStep] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [profileLoaded, setProfileLoaded] = React.useState(false)
  const [formData, setFormData] = React.useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    timezone: 'Asia/Kolkata',
    location: '',
  })

  React.useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      try {
        const res = await userAPI.getProfile()
        const data = res.data?.user || res.data
        if (data) {
          setFormData(prev => ({
            ...prev,
            fullName: data.full_name || user.full_name || prev.fullName,
            dateOfBirth: formatDateForInput(data.date_of_birth) || prev.dateOfBirth,
            gender: data.gender || prev.gender,
            timezone: data.timezone || prev.timezone,
            location: data.location || prev.location,
          }))
          if (data.profile_completed_at && data.date_of_birth) {
            router.replace('/dashboard')
            return
          }
        } else {
          setFormData(prev => ({
            ...prev,
            fullName: user.full_name || prev.fullName,
          }))
        }
      } catch {
        setFormData(prev => ({ ...prev, fullName: user.full_name || prev.fullName }))
      } finally {
        setProfileLoaded(true)
      }
    }
    loadProfile()
  }, [user, router])

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to NumerAI',
      description: 'Discover your life path through the ancient wisdom of numerology',
      icon: <SparklesIcon className="w-8 h-8" />,
      component: <WelcomeStep />,
    },
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us about yourself to get personalized insights',
      icon: <UserIcon className="w-8 h-8" />,
      component: (
        <ProfileStep
          formData={formData}
          setFormData={setFormData}
          loading={loading}
        />
      ),
    },
    {
      id: 'calculate',
      title: 'Calculate Your Numerology',
      description: 'Generate your complete numerology profile',
      icon: <StarIcon className="w-8 h-8" />,
      component: <CalculateStep loading={loading} />,
    },
    {
      id: 'features',
      title: 'Explore Features',
      description: 'Discover what NumerAI can do for you',
      icon: <CalendarIcon className="w-8 h-8" />,
      component: <FeaturesStep />,
    },
  ]

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await handleComplete()
      return
    }

    if (currentStep === 1) {
      if (!formData.fullName || !formData.dateOfBirth) {
        toast.error('Please fill in all required fields')
        return
      }
    }

    setCurrentStep((prev) => prev + 1)
  }

  const isProfileComplete = Boolean(formData.fullName && formData.dateOfBirth)

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      if (formData.fullName || formData.dateOfBirth || formData.gender || formData.timezone || formData.location) {
        await userAPI.updateProfile({
          full_name: formData.fullName || undefined,
          date_of_birth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          timezone: formData.timezone || undefined,
          location: formData.location || undefined,
        })
      }

      if (formData.dateOfBirth) {
        try {
          await numerologyAPI.calculateProfile('pythagorean')
        } catch (error) {
          console.error('Failed to calculate profile:', error)
        }
      }

      await refreshOnboardingStatus()
      completeOnboarding()
      toast.success('Welcome to NumerAI!')
      router.push('/dashboard')
    } catch (error: unknown) {
      console.error('Onboarding completion failed:', error)
      toast.error('Failed to complete onboarding. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    if (isProfileComplete) {
      try {
        await userAPI.updateProfile({
          full_name: formData.fullName || undefined,
          date_of_birth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          timezone: formData.timezone || undefined,
          location: formData.location || undefined,
        })
        if (formData.dateOfBirth) {
          await numerologyAPI.calculateProfile('pythagorean')
        }
        await refreshOnboardingStatus()
      } catch (e) {
        console.error('Skip save failed:', e)
      }
    }
    completeOnboarding()
    router.push('/dashboard')
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="relative min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <GlassBackground starCount={80} />
      <BaseCard
        variant="space"
        padding="xl"
        className="w-full max-w-2xl relative z-10 overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Skip onboarding"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-3xl font-bold mb-2 font-['Playfair_Display']">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="min-h-[300px]">
              {steps[currentStep].component}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <BaseButton
            variant="outline"
            onClick={currentStep === 0 ? handleSkip : handleBack}
            disabled={loading}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Skip' : 'Back'}
          </BaseButton>

          <BaseButton
            variant="space"
            onClick={handleNext}
            loading={loading}
            className="gap-2"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep < steps.length - 1 && (
              <ArrowRightIcon className="w-4 h-4" />
            )}
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  )
}

// Step Components
function WelcomeStep() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-lg">
          NumerAI combines ancient numerology wisdom with modern AI technology
          to provide personalized insights into your life path, relationships,
          and future.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: '✨', title: 'AI-Powered', desc: 'Smart numerology insights' },
            { icon: '📊', title: 'Detailed Reports', desc: 'Comprehensive analysis' },
            { icon: '💫', title: 'Daily Guidance', desc: 'Personalized readings' },
          ].map((feature, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="font-semibold">{feature.title}</div>
              <div className="text-sm text-muted-foreground">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ProfileStepProps {
  formData: {
    fullName: string
    dateOfBirth: string
    gender: string
    timezone: string
    location: string
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    fullName: string
    dateOfBirth: string
    gender: string
    timezone: string
    location: string
  }>>
  loading: boolean
}

function ProfileStep({ formData, setFormData, loading }: ProfileStepProps) {
  const hasNameFromSignup = Boolean(formData.fullName)
  const hasDobFromSignup = Boolean(formData.dateOfBirth)
  const nameRequired = !hasNameFromSignup
  const dobRequired = !hasDobFromSignup

  return (
    <div className="space-y-4">
      <BaseInput
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, fullName: e.target.value }))
        }
        disabled={loading || hasNameFromSignup}
        required={nameRequired}
      />

      <BaseInput
        label="Date of Birth"
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
        }
        disabled={loading || hasDobFromSignup}
        required={dobRequired}
      />

      <div>
        <label className="block text-sm font-medium mb-2">Gender (Optional)</label>
        <select
          value={formData.gender}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, gender: e.target.value }))
          }
          disabled={loading}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <BaseInput
        label="Timezone (Optional)"
        placeholder="e.g. Asia/Kolkata"
        value={formData.timezone}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, timezone: e.target.value }))
        }
        disabled={loading}
      />

      <BaseInput
        label="Location (Optional)"
        placeholder="City, Country"
        value={formData.location}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, location: e.target.value }))
        }
        disabled={loading}
      />
    </div>
  )
}

function CalculateStep({ loading }: { loading: boolean }) {
  return (
    <div className="text-center space-y-6">
      <p className="text-muted-foreground">
        We'll calculate your numerology profile based on your name and birth date.
        This includes your Life Path, Destiny, Soul Urge, and other important numbers.
      </p>
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </div>
  )
}

function FeaturesStep() {
  const features = [
    { name: 'Daily Readings', desc: 'Get personalized numerology insights every day' },
    { name: 'AI Chat', desc: 'Ask questions to our AI numerologist' },
    { name: 'Compatibility', desc: 'Check relationship compatibility' },
    { name: 'Reports', desc: 'Generate detailed numerology reports' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center mb-6">
        Here are some key features you can explore:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border bg-card flex items-start gap-3"
          >
            <CheckIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold mb-1">{feature.name}</div>
              <div className="text-sm text-muted-foreground">{feature.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

