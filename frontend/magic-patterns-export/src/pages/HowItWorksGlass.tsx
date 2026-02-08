import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  UserIcon,
  CalendarIcon,
  BarChart3Icon,
  HeartIcon,
  CheckIcon } from
'lucide-react';
import { GlassNav } from '../components/GlassNav';
import { LandingFooter } from '../components/LandingFooter';
import { LoadingSpinner } from '../components/LoadingSpinner';
export function HowItWorksGlass() {
  const navigate = useNavigate();
  const steps = [
  {
    number: 1,
    icon: <UserIcon className="w-8 h-8" />,
    title: 'Create Your Account',
    description:
    'Sign up in seconds with your email or social account. We only need your birth date to unlock your cosmic blueprint.',
    color: 'from-cyan-400 to-blue-600',
    features: [
    'Quick signup process',
    'Secure data encryption',
    'Social login options']

  },
  {
    number: 2,
    icon: <CalendarIcon className="w-8 h-8" />,
    title: 'Calculate Your Numbers',
    description:
    'Our advanced algorithms instantly calculate your Life Path, Destiny, Soul Urge, and Personality numbers based on your birth date.',
    color: 'from-purple-500 to-indigo-600',
    features: [
    'Instant calculations',
    'Multiple number systems',
    'Detailed interpretations']

  },
  {
    number: 3,
    icon: <BarChart3Icon className="w-8 h-8" />,
    title: 'Explore Your Insights',
    description:
    'Dive deep into personalized readings, compatibility checks, and forecasts. Chat with our AI numerologist for instant guidance.',
    color: 'from-pink-500 to-rose-600',
    features: [
    'Daily readings',
    'AI chat support',
    'Interactive visualizations']

  },
  {
    number: 4,
    icon: <HeartIcon className="w-8 h-8" />,
    title: 'Transform Your Life',
    description:
    'Apply cosmic wisdom to your relationships, career, and personal growth. Track your progress and celebrate milestones.',
    color: 'from-green-500 to-emerald-600',
    features: [
    'Actionable guidance',
    'Progress tracking',
    'Achievement system']

  }];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) =>
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }} />

          )}
        </div>
        <div className="absolute top-40 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <GlassNav />

        <div className="max-w-7xl mx-auto px-8 py-20">
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-center mb-20">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                delay: 0.1
              }}
              className="inline-block mb-6">

              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
                🚀 Simple Process
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
              How NumeroBuddy
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Works for You
              </span>
            </h1>

            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Four simple steps to unlock your cosmic potential and transform
              your life through the ancient wisdom of numerology.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-green-500" />

            {/* Steps */}
            <div className="space-y-24">
              {steps.map((step, index) =>
              <motion.div
                key={step.number}
                initial={{
                  opacity: 0,
                  y: 40
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.2 + index * 0.15
                }}
                className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                  {/* Content Card */}
                  <div className="flex-1 group relative">
                    {/* Glow Effect */}
                    <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity`} />


                    {/* Card */}
                    <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                      {/* Step Number */}
                      <div className="flex items-center gap-4 mb-6">
                        <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>

                          {step.icon}
                        </div>
                        <div>
                          <div className="text-sm text-cyan-400 font-semibold mb-1">
                            STEP {step.number}
                          </div>
                          <h3 className="text-2xl font-serif text-white">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/70 leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2">
                        {step.features.map((feature, i) =>
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-white/60">

                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <CheckIcon className="w-3 h-3 text-green-400" />
                            </div>
                            <span>{feature}</span>
                          </li>
                      )}
                      </ul>
                    </div>
                  </div>

                  {/* Center Number (Desktop) */}
                  <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-[#1a2942] to-[#0a1628] border-4 border-cyan-500/30 flex items-center justify-center text-4xl font-bold text-white shadow-2xl z-10">
                    {step.number}
                  </div>

                  {/* Spacer (Desktop) */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.8
            }}
            className="text-center mt-24">

            <div className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 backdrop-blur-xl">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands who have discovered their cosmic purpose. Start
                your free account today and unlock your numerological blueprint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">

                  Get Started Free
                </button>
                <button
                  onClick={() => navigate('/features')}
                  className="px-8 py-3 rounded-full border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all">

                  Explore Features
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <Suspense fallback={<LoadingSpinner />}>
          <LandingFooter />
        </Suspense>
      </div>
    </div>);

}