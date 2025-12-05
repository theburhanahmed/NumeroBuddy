'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, HeartIcon, UsersIcon, TrendingUpIcon, StarIcon, TargetIcon } from 'lucide-react';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingFooter } from '@/components/landing/landing-footer';
import { GlassCard } from '@/components/ui/glass-card';
import { LiquidGlassHero } from '@/components/ui/liquid-glass-hero';
import { FloatingOrbs } from '@/components/ui/floating-orbs';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { MagneticCard } from '@/components/ui/magnetic-card';
export default function AboutUs() {
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 transition-colors duration-500 relative overflow-hidden">
      <AmbientParticles />
      <FloatingOrbs />
      <LandingNav />

      {/* Hero Section */}
      <LiquidGlassHero title="About NumerAI" subtitle="We're on a mission to make ancient numerology wisdom accessible to everyone through the power of artificial intelligence" />

      {/* Mission & Vision */}
      <section className="section-spacing px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <MagneticCard variant="liquid-premium" className="p-8 h-full">
                <div className="liquid-glass-content">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                    <TargetIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Our Mission
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To democratize access to personalized numerology insights by
                    combining ancient wisdom with cutting-edge AI technology,
                    helping people discover their true path and potential.
                  </p>
                </div>
              </MagneticCard>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <MagneticCard variant="liquid-premium" className="p-8 h-full">
                <div className="liquid-glass-content">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                    <SparklesIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Our Vision
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To become the world's most trusted platform for numerology
                    guidance, empowering millions to make informed decisions and
                    live more fulfilling lives through personalized insights.
                  </p>
                </div>
              </MagneticCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Values
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-400">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard icon={<HeartIcon className="w-8 h-8" />} title="Authenticity" description="We honor the ancient wisdom of numerology while making it accessible" delay={0.1} />
            <ValueCard icon={<UsersIcon className="w-8 h-8" />} title="Community" description="Building a supportive community of seekers and believers" delay={0.2} />
            <ValueCard icon={<TrendingUpIcon className="w-8 h-8" />} title="Innovation" description="Continuously improving through technology and feedback" delay={0.3} />
            <ValueCard icon={<StarIcon className="w-8 h-8" />} title="Excellence" description="Delivering accurate, insightful, and meaningful guidance" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-spacing px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <MagneticCard variant="liquid-premium" className="p-8 md:p-12">
              <div className="liquid-glass-content">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    NumerAI was born from a simple observation: while numerology
                    has helped millions find clarity and direction for thousands
                    of years, accessing quality, personalized guidance remained
                    challenging and expensive.
                  </p>
                  <p>
                    Our founders, combining expertise in ancient numerology
                    practices with cutting-edge AI technology, set out to change
                    that. We spent years training our AI on thousands of
                    numerology texts, consulting with master numerologists, and
                    refining our algorithms to deliver insights that are both
                    accurate and deeply personal.
                  </p>
                  <p>
                    Today, NumerAI serves thousands of users worldwide, helping
                    them discover their life path, make important decisions, and
                    understand their relationships better. We're proud to make
                    this ancient wisdom accessible to everyone, anytime,
                    anywhere.
                  </p>
                </div>
              </div>
            </MagneticCard>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-spacing px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard number="50K+" label="Active Users" delay={0.1} />
            <StatCard number="500K+" label="Readings Generated" delay={0.2} />
            <StatCard number="4.9" label="Average Rating" delay={0.3} />
            <StatCard number="98%" label="Satisfaction Rate" delay={0.4} />
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>;
}
function ValueCard({
  icon,
  title,
  description,
  delay
}: any) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    delay
  }}>
      <MagneticCard variant="liquid" className="p-6 text-center h-full">
        <div className="liquid-glass-content">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </MagneticCard>
    </motion.div>;
}
function StatCard({
  number,
  label,
  delay
}: any) {
  return <motion.div initial={{
    opacity: 0,
    scale: 0.9
  }} whileInView={{
    opacity: 1,
    scale: 1
  }} viewport={{
    once: true
  }} transition={{
    delay
  }}>
      <MagneticCard variant="liquid-premium" className="p-6 text-center">
        <div className="liquid-glass-content">
          <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {number}
          </p>
          <p className="text-gray-700 dark:text-gray-400 font-medium">
            {label}
          </p>
        </div>
      </MagneticCard>
    </motion.div>;
}