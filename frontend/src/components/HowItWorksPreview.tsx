'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CalendarIcon, SparklesIcon, BrainIcon, TrendingUpIcon, ArrowRightIcon } from 'lucide-react';
import { TouchOptimizedButton } from './TouchOptimizedButton';
export function HowItWorksPreview() {
  const router = useRouter();
  const steps = [{
    icon: <CalendarIcon className="w-6 h-6" />,
    title: 'Enter Birth Date',
    description: 'Your cosmic blueprint begins'
  }, {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'AI Analysis',
    description: 'Patterns revealed instantly'
  }, {
    icon: <BrainIcon className="w-6 h-6" />,
    title: 'Get Insights',
    description: 'Personalized guidance'
  }, {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    title: 'Grow Daily',
    description: 'Track your journey'
  }];
  return <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => <motion.div key={step.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent -translate-x-1/2 z-0" />}

              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
                  {step.icon}
                </div>

                {/* Number */}
                <div className="text-sm font-bold text-cyan-400 mb-2">
                  STEP {index + 1}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/60">{step.description}</p>
              </div>
            </motion.div>)}
        </div>

        {/* CTA */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center">
          <TouchOptimizedButton variant="secondary" size="lg" onClick={() => router.push('/how-it-works')} icon={<ArrowRightIcon className="w-5 h-5" />} ariaLabel="Learn more about how NumerAI works">
            See Full Process
          </TouchOptimizedButton>
        </motion.div>
      </div>
    </section>;
}