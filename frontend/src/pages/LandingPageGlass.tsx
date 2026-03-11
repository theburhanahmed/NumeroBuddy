import React, { useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  TrendingUpIcon,
  HeartIcon,
  ZapIcon,
  CrownIcon,
  CheckIcon,
  CalendarIcon,
  MessageSquareIcon,
  BookOpenIcon } from
'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LiveStatsCounter } from '../components/LiveStatsCounter';
import { TrustBadges } from '../components/TrustBadges';
import { HowItWorksPreview } from '../components/HowItWorksPreview';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { VideoExplainer } from '../components/VideoExplainer';
import { CaseStudiesSection } from '../components/CaseStudiesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BlogPreview } from '../components/BlogPreview';
import { FAQSection } from '../components/FAQSection';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { LandingFooter } from '../components/LandingFooter';
import { GlassCard } from '../components/GlassCard';
import { GlassNav } from '../components/GlassNav';
import { CosmicButton } from '../components/CosmicButton';
import { DynamicBackground } from '../components/DynamicBackground';
import { BackgroundToggle } from '../components/BackgroundToggle';
import { ConstellationConnections } from '../components/ConstellationConnections';
import { LiveTrustSignals } from '../components/LiveTrustSignals';
export function LandingPageGlass() {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const features = [
  {
    icon: <SparklesIcon className="w-8 h-8" />,
    title: 'AI Numerologist Chat',
    description:
    'Get instant, personalized insights 24/7. Ask questions about your life path, relationships, and destiny with our advanced AI numerologist.',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    icon: <TrendingUpIcon className="w-8 h-8" />,
    title: 'Life Path Analysis',
    description:
    "Discover your soul's purpose with comprehensive Life Path analysis. Understand your natural strengths, challenges, and life mission.",
    color: 'from-purple-500 to-indigo-600'
  },
  {
    icon: <HeartIcon className="w-8 h-8" />,
    title: 'Compatibility Checker',
    description:
    'Analyze relationship compatibility through numerological harmony. Discover deep connections and understand energetic bonds with others.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: <CalendarIcon className="w-8 h-8" />,
    title: 'Personal Cycles',
    description:
    'Navigate your future with Personal Year, Month, and Day forecasts. Understand the energetic currents shaping your journey.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: <BookOpenIcon className="w-8 h-8" />,
    title: 'Birth Chart Visualization',
    description:
    'Explore your complete numerological blueprint through interactive 3D charts. See all your core numbers in one stunning visualization.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: <MessageSquareIcon className="w-8 h-8" />,
    title: 'Daily Readings',
    description:
    'Receive personalized daily insights delivered to your dashboard. Start each day with cosmic guidance and clarity.',
    color: 'from-blue-500 to-cyan-600'
  }];

  const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    icon: <ZapIcon className="w-6 h-6" />,
    features: ['Basic readings', '3 daily insights', 'Community access'],
    popular: false
  },
  {
    name: 'Premium',
    price: 9.99,
    icon: <SparklesIcon className="w-6 h-6" />,
    features: [
    'Unlimited readings',
    'AI chat access',
    'Full reports',
    'Priority support'],

    popular: true,
    badge: '30-day money-back guarantee'
  },
  {
    name: 'Enterprise',
    price: 29.99,
    icon: <CrownIcon className="w-6 h-6" />,
    features: [
    'Everything in Premium',
    'Expert consultations',
    'Custom reports',
    'API access'],

    popular: false
  }];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      {/* Dynamic Background - Switches based on user preference */}
      <DynamicBackground />

      {/* Background Toggle Control */}
      <BackgroundToggle />

      {/* Live Trust Signals */}
      <LiveTrustSignals />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <GlassNav />

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-8 pt-20 pb-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left: Hero Content */}
            <motion.div
              initial={{
                opacity: 0,
                x: -50
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.8,
                delay: 0.2
              }}>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white mb-8 leading-tight">
                Unlock Your
                <br />
                <span className="block">Cosmic Blueprint</span>
              </h1>

              {/* Decorative Line */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 rounded-full border-2 border-cyan-400" />
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
              </div>

              {/* Description */}
              <p className="text-body text-white/70 leading-relaxed mb-6 max-w-lg">
                Ancient numerology wisdom meets modern AI. Discover your life
                path, understand your relationships, and navigate your destiny
                with personalized cosmic insights.
              </p>

              {/* Meta Info */}
              <div className="text-small text-white/40 mb-8">
                ANCIENT WISDOM • MODERN AI
              </div>

              {/* CTA Button */}
              <CosmicButton
                onClick={() => navigate('/signup')}
                variant="primary"
                size="lg"
                icon={<SparklesIcon className="w-5 h-5" />}>

                Start Free Journey
              </CosmicButton>

              {/* Social Proof with urgency */}
              <div className="mt-6 space-y-2">
                <p className="text-small text-white/50">
                  Join 50,000+ seekers discovering their cosmic path
                </p>
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>127 people signed up in the last 24 hours</span>
                </div>
              </div>

              {/* Floating Orb Indicator */}
              <div className="mt-12 flex items-center gap-4">
                <motion.div
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/50" />

                <motion.div
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.3
                  }}
                  className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/50" />

              </div>
            </motion.div>

            {/* Right: Planetary Visualization */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 1,
                delay: 0.4
              }}
              className="relative h-[600px]">

              {/* Main Planet with Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* Planet Core */}
                <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-300/40 to-blue-600/60 backdrop-blur-xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/30 relative overflow-hidden will-change-transform">

                  {/* Planet Texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(0,0,0,0.2),transparent_50%)]" />
                </motion.div>

                {/* Rings */}
                <motion.div
                  animate={{
                    rotate: -360
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute inset-0 -z-10 will-change-transform">

                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[120px] rounded-full border-2 border-cyan-400/20 transform rotate-[70deg]"
                    style={{
                      background:
                      'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)',
                      boxShadow: '0 0 40px rgba(6, 182, 212, 0.2)'
                    }} />

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[140px] rounded-full border border-cyan-400/10 transform rotate-[70deg]" />
                </motion.div>

                {/* Orbiting Small Orb */}
                <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full will-change-transform">

                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 shadow-lg shadow-blue-500/50" />
                </motion.div>
              </div>

              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>

        {/* Live Stats */}
        <Suspense fallback={<LoadingSpinner />}>
          <LiveStatsCounter />
        </Suspense>

        {/* Trust Badges */}
        <Suspense fallback={<LoadingSpinner />}>
          <TrustBadges />
        </Suspense>

        {/* How It Works */}
        <Suspense fallback={<LoadingSpinner />}>
          <HowItWorksPreview />
        </Suspense>

        {/* Interactive Demo */}
        <Suspense fallback={<LoadingSpinner />}>
          <InteractiveDemo />
        </Suspense>

        {/* Features Section with Constellation Connections */}
        <section className="py-20 px-8" ref={featuresRef}>
          <div className="max-w-7xl mx-auto relative">
            {/* Constellation connections between feature cards */}
            <ConstellationConnections
              cardCount={features.length}
              containerRef={featuresRef} />


            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              className="text-center mb-16">

              <h2 className="text-h2 text-white mb-6">
                Everything You Need
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                  For Your Cosmic Journey
                </span>
              </h2>
              <p className="text-body text-white/60 max-w-2xl mx-auto">
                Powerful tools and insights to unlock the wisdom of numbers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) =>
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: index * 0.1
                }}
                data-constellation-node>

                  <GlassCard className="p-8 h-full">
                    <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}>

                      {feature.icon}
                    </div>
                    <h3 className="text-h3 text-white mb-3">{feature.title}</h3>
                    <p className="text-small text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Video Explainer */}
        <Suspense fallback={<LoadingSpinner />}>
          <VideoExplainer />
        </Suspense>

        {/* Case Studies */}
        <Suspense fallback={<LoadingSpinner />}>
          <CaseStudiesSection />
        </Suspense>

        {/* Testimonials */}
        <Suspense fallback={<LoadingSpinner />}>
          <TestimonialsSection />
        </Suspense>

        {/* Pricing Section */}
        <section className="py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              className="text-center mb-16">

              <h2 className="text-h2 text-white mb-6">
                Choose Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                  Cosmic Plan
                </span>
              </h2>
              <p className="text-body text-white/60 max-w-2xl mx-auto">
                Start free, upgrade anytime. All plans include core features.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {pricingPlans.map((plan, index) =>
              <motion.div
                key={plan.name}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="relative">

                  {plan.popular &&
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg shadow-cyan-500/30">
                        MOST POPULAR
                      </span>
                    </div>
                }

                  <GlassCard
                  variant={plan.popular ? 'elevated' : 'default'}
                  className={`p-8 h-full ${plan.popular ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : ''}`}>

                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                        {plan.icon}
                      </div>
                      <h3 className="text-h3 text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        <span className="text-5xl font-bold text-white">
                          ${plan.price}
                        </span>
                        {plan.price > 0 &&
                      <span className="text-white/70">/mo</span>
                      }
                      </div>
                      {plan.badge &&
                    <div className="text-xs text-green-400 font-semibold">
                          {plan.badge}
                        </div>
                    }
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) =>
                    <li key={i} className="flex items-start gap-3">
                          <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5">
                            <CheckIcon className="w-3 h-3" />
                          </div>
                          <span className="text-small text-white/80">
                            {feature}
                          </span>
                        </li>
                    )}
                    </ul>

                    <CosmicButton
                    onClick={() => navigate('/signup')}
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full">

                      Start Free Journey
                    </CosmicButton>
                  </GlassCard>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Blog Preview */}
        <Suspense fallback={<LoadingSpinner />}>
          <BlogPreview />
        </Suspense>

        {/* FAQ Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <FAQSection />
        </Suspense>

        {/* Newsletter Signup */}
        <Suspense fallback={<LoadingSpinner />}>
          <NewsletterSignup />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={<LoadingSpinner />}>
          <LandingFooter />
        </Suspense>
      </div>
    </div>);

}