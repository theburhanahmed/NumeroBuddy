import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { userAPI } from '../lib/api-client';
import { numerologyAPI } from '../lib/numerology-api';
export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    birthDate: '',
    fullName: '',
    goals: [] as string[]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const steps = [
  {
    title: 'Welcome to Numerobuddy',
    subtitle: 'Your cosmic journey begins here',
    content:
    <div className="text-center">
          <div className="text-6xl mb-6">✨</div>
          <p className="text-lg text-white/80 leading-relaxed max-w-md mx-auto">
            Discover the hidden meanings in your numbers and unlock insights
            about your life path, relationships, and destiny.
          </p>
        </div>

  },
  {
    title: 'Enter Your Birth Date',
    subtitle: 'This helps us calculate your core numbers',
    content:
    <div className="max-w-md mx-auto">
          <label
        htmlFor="birthDate"
        className="block text-sm font-medium text-white mb-2">

            Birth Date
          </label>
          <input
        id="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={(e) =>
        setFormData({
          ...formData,
          birthDate: e.target.value
        })
        }
        className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />

        </div>

  },
  {
    title: "What', s, Your, Full, Name,",
    subtitle: 'Used for name numerology calculations',
    content:
    <div className="max-w-md mx-auto">
          <label
        htmlFor="fullName"
        className="block text-sm font-medium text-white mb-2">

            Full Name
          </label>
          <input
        id="fullName"
        type="text"
        value={formData.fullName}
        onChange={(e) =>
        setFormData({
          ...formData,
          fullName: e.target.value
        })
        }
        placeholder="John Doe"
        className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

        </div>

  },
  {
    title: 'What Are Your Goals?',
    subtitle: 'Select all that apply',
    content:
    <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {[
        'Self-Discovery',
        'Relationships',
        'Career Growth',
        'Spiritual Path',
        'Life Purpose',
        'Daily Guidance'].
        map((goal) =>
        <button
          key={goal}
          onClick={() => {
            const newGoals = formData.goals.includes(goal) ?
            formData.goals.filter((g) => g !== goal) :
            [...formData.goals, goal];
            setFormData({
              ...formData,
              goals: newGoals
            });
          }}
          className={`p-4 rounded-xl border-2 transition-all ${formData.goals.includes(goal) ? 'bg-cyan-500/20 border-cyan-500' : 'bg-[#0a1628]/40 border-cyan-500/20 hover:border-cyan-500/40'}`}>

                <span className="text-white font-medium">{goal}</span>
              </button>
        )}
          </div>
        </div>

  }];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await userAPI.updateProfile({
        full_name: formData.fullName.trim(),
        date_of_birth: formData.birthDate,
      });
      await numerologyAPI.calculateNumerologyProfile({
        full_name: formData.fullName.trim(),
        birth_date: formData.birthDate,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Unable to create your numerology profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return formData.birthDate !== '';
    if (currentStep === 2) return formData.fullName.trim() !== '';
    if (currentStep === 3) return formData.goals.length > 0;
    return false;
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AccessibleSpaceBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-4 w-full">
        <SpaceCard variant="premium" className="p-8 md:p-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((_, index) =>
              <div
                key={index}
                className={`h-2 flex-1 mx-1 rounded-full transition-colors ${index <= currentStep ? 'bg-cyan-500' : 'bg-cyan-500/20'}`} />

              )}
            </div>
            <p className="text-sm text-white/60 text-center">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              transition={{
                duration: 0.3
              }}
              className="mb-8">

              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white text-center mb-2">
                {steps[currentStep].title}
              </h1>
              <p className="text-white/70 text-center mb-8">
                {steps[currentStep].subtitle}
              </p>
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>

          {error && <p className="mb-4 text-center text-sm text-red-400" role="alert">{error}</p>}

          {/* Navigation */}
          <div className="flex gap-4">
            {currentStep > 0 &&
            <TouchOptimizedButton
              variant="secondary"
              size="lg"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
              ariaLabel="Go back">

                Back
              </TouchOptimizedButton>
            }
            <TouchOptimizedButton
              variant="primary"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed() || isSaving}
              icon={
              currentStep === steps.length - 1 ?
              <SparklesIcon className="w-5 h-5" /> :

              <ArrowRightIcon className="w-5 h-5" />

              }
              className="flex-1"
              ariaLabel={
              currentStep === steps.length - 1 ? 'Get started' : 'Continue'
              }>

              {currentStep === steps.length - 1 ? (isSaving ? 'Creating Profile...' : 'Get Started') : 'Continue'}
            </TouchOptimizedButton>
          </div>
        </SpaceCard>
      </div>
    </div>);

}