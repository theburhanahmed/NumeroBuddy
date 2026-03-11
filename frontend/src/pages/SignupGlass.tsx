import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  CalendarIcon,
  CheckIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
import { useAuth } from '../contexts/AuthContext';

export function SignupGlass() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms to continue.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password, formData.birthDate);
      // signup will navigate to /login for now
    } catch (err: any) {
      setError(err?.message || 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const updateField = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden flex items-center justify-center py-12">
      <GlassBackground starCount={80} />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="flex items-center justify-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-white font-semibold text-2xl tracking-wide">
            NUMEROBUDDY
          </span>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          className="flex items-center justify-center gap-2 mb-8">

          {[1, 2, 3].map((s) =>
          <div
            key={s}
            className={`h-1 rounded-full transition-all ${s === step ? 'w-12 bg-gradient-to-r from-cyan-400 to-blue-600' : s < step ? 'w-8 bg-cyan-400/50' : 'w-8 bg-white/20'}`} />

          )}
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 0.1
          }}
          className="relative">

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl" />

          {/* Card */}
          <div className="relative p-8 md:p-10 rounded-3xl bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30">
            {/* Error Message */}
            {error &&
            <motion.div
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">

                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            }
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-white mb-2">
                {step === 1 && 'Create Account'}
                {step === 2 && 'Your Birth Date'}
                {step === 3 && 'Almost There'}
              </h1>
              <p className="text-white/60">
                {step === 1 && 'Join thousands on their cosmic journey'}
                {step === 2 && 'We need this to calculate your numbers'}
                {step === 3 && 'Review and confirm your details'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {step === 1 &&
                <motion.div
                  key="step1"
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
                  className="space-y-6">

                    {/* Name */}
                    <div>
                      <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-white mb-2">

                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                        required
                        disabled={isLoading} />

                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-white mb-2">

                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                          <MailIcon className="w-5 h-5" />
                        </div>
                        <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                        required
                        disabled={isLoading} />

                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-white mb-2">

                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                          <LockIcon className="w-5 h-5" />
                        </div>
                        <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                        updateField('password', e.target.value)
                        }
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                        required
                        disabled={isLoading} />

                      </div>
                      <p className="text-xs text-white/50 mt-2">
                        At least 8 characters with numbers and symbols
                      </p>
                    </div>
                  </motion.div>
                }

                {/* Step 2: Birth Date */}
                {step === 2 &&
                <motion.div
                  key="step2"
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
                  className="space-y-6">

                    <div>
                      <label
                      htmlFor="birthDate"
                      className="block text-sm font-semibold text-white mb-2">

                        Date of Birth
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                        updateField('birthDate', e.target.value)
                        }
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                        required
                        disabled={isLoading} />

                      </div>
                      <p className="text-sm text-white/60 mt-4 leading-relaxed">
                        Your birth date is essential for calculating your Life
                        Path number and other core numerological insights. We
                        keep this information private and secure.
                      </p>
                    </div>
                  </motion.div>
                }

                {/* Step 3: Confirmation */}
                {step === 3 &&
                <motion.div
                  key="step3"
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
                  className="space-y-6">

                    {/* Summary */}
                    <div className="p-6 rounded-2xl bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Name</span>
                        <span className="text-white font-semibold">
                          {formData.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Email</span>
                        <span className="text-white font-semibold">
                          {formData.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Birth Date</span>
                        <span className="text-white font-semibold">
                          {new Date(formData.birthDate).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          }
                        )}
                        </span>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                      updateField('agreeToTerms', e.target.checked)
                      }
                      className="mt-1 w-5 h-5 rounded border-cyan-500/30 bg-[#0a1628]/60 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                      required
                      disabled={isLoading} />

                      <span className="text-sm text-white/70 leading-relaxed">
                        I agree to the{' '}
                        <button
                        type="button"
                        onClick={() => window.open('/terms', '_blank')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors">

                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                        type="button"
                        onClick={() => window.open('/privacy', '_blank')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors">

                          Privacy Policy
                        </button>
                      </span>
                    </label>
                  </motion.div>
                }
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 &&
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 rounded-xl border border-cyan-500/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all">

                    Back
                  </button>
                }
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">

                  {step < 3
                    ? isLoading
                      ? 'Continuing...'
                      : 'Continue'
                    : isLoading
                      ? 'Creating Account...'
                      : 'Create Account'}
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-white/60">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">

                  Sign in
                </button>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.3
          }}
          className="text-center mt-8">

          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors text-sm">

            ← Back to home
          </button>
        </motion.div>
      </div>
    </div>);

}