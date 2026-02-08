import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  StarIcon,
  TrendingUpIcon,
  CheckIcon,
  ZapIcon,
  CrownIcon } from
'lucide-react';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CosmicTooltip } from '../components/CosmicTooltip';
import { MobileFloatingParticles } from '../components/MobileOptimizedCosmicElements';
import { LifePathOrb3D } from '../components/LifePathOrb3D';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TrustBadges } from '../components/TrustBadges';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { HowItWorksPreview } from '../components/HowItWorksPreview';
import { LiveStatsCounter } from '../components/LiveStatsCounter';
import { VideoExplainer } from '../components/VideoExplainer';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { CaseStudiesSection } from '../components/CaseStudiesSection';
import { BlogPreview } from '../components/BlogPreview';
import { useIsMobile } from '../hooks/useMediaQuery';
export function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const features = [
  {
    icon: <SparklesIcon className="w-8 h-8" />,
    title: 'AI Numerologist',
    description:
    'Chat with our AI-powered numerologist for instant personalized insights',
    tooltip: 'Get real-time answers to your numerology questions 24/7'
  },
  {
    icon: <StarIcon className="w-8 h-8" />,
    title: 'Birth Chart Analysis',
    description: 'Detailed visualization of your complete numerology profile',
    tooltip: 'Discover your Life Path, Destiny, and Soul Urge numbers'
  },
  {
    icon: <TrendingUpIcon className="w-8 h-8" />,
    title: 'Life Path Insights',
    description:
    'Discover your purpose and destiny through the wisdom of numbers',
    tooltip: "Understand your life's journey and core purpose"
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

    popular: true
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
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      {/* Mobile-optimized particles */}
      <MobileFloatingParticles count={isMobile ? 15 : 30} />

      {/* HERO SECTION WITH 3D ORB */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 pt-28">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
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
                duration: 0.8
              }}
              className="text-center lg:text-left">

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
                  delay: 0.2
                }}
                className="inline-block mb-6">

                <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
                  ✨ AI-Powered Cosmic Wisdom
                </span>
              </motion.div>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.3
                }}
                className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight">

                Unlock Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  Cosmic Destiny
                </span>
              </motion.h1>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.4
                }}
                className="text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">

                Discover the ancient wisdom of numerology combined with
                cutting-edge AI. Your personalized cosmic journey begins here.
              </motion.p>

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
                  delay: 0.5
                }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                <TouchOptimizedButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  ariaLabel="Start your free reading">

                  Start Free Reading
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/pricing')}
                  ariaLabel="View pricing plans">

                  View Pricing
                </TouchOptimizedButton>
              </motion.div>

              {/* Stats */}
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
                  delay: 0.6
                }}
                className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto lg:mx-0">

                {[
                {
                  value: '50K+',
                  label: 'Active Users'
                },
                {
                  value: '500K+',
                  label: 'Readings'
                },
                {
                  value: '4.9★',
                  label: 'Rating'
                }].
                map((stat, index) =>
                <div key={index} className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      {stat.label}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Right: 3D Orb */}
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
                delay: 0.3
              }}
              className="relative h-[500px] lg:h-[600px]">

              <Suspense
                fallback={
                <div className="w-full h-full flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                }>

                <LifePathOrb3D />
              </Suspense>

              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* LIVE STATS COUNTER */}
      <LiveStatsCounter />

      {/* TRUST BADGES */}
      <TrustBadges />

      {/* HOW IT WORKS PREVIEW */}
      <HowItWorksPreview />

      {/* INTERACTIVE DEMO */}
      <InteractiveDemo />

      {/* FEATURE CARDS */}
      <section id="features" className="relative z-10 py-20 px-4 md:px-6">
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
            transition={{
              duration: 0.5
            }}
            className="text-center mb-16">

            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">
              Explore the Universe
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                of Numerology
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful insights through our AI-powered cosmic platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
              }}>

                <SpaceCard
                variant="premium"
                className="p-8 h-full group cursor-pointer flex flex-col items-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                      {feature.title}
                    </h3>
                    <CosmicTooltip
                    content={feature.tooltip}
                    icon
                    position="top" />

                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </SpaceCard>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* VIDEO EXPLAINER */}
      <VideoExplainer />

      {/* CASE STUDIES */}
      <CaseStudiesSection />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* PRICING PLANS */}
      <section id="pricing" className="relative z-10 py-20 px-4 md:px-6">
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
            transition={{
              duration: 0.5
            }}
            className="text-center mb-16">

            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">
              Choose Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Cosmic Plan
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Start free, upgrade anytime. All plans include our core features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
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

                <SpaceCard
                variant={plan.popular ? 'premium' : 'default'}
                className={`p-8 h-full ${plan.popular ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : ''}`}>

                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-5xl font-bold text-white">
                        ${plan.price}
                      </span>
                      {plan.price > 0 &&
                    <span className="text-white/70">/mo</span>
                    }
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) =>
                  <li key={i} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5">
                          <CheckIcon className="w-3 h-3" />
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </li>
                  )}
                  </ul>

                  <TouchOptimizedButton
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="w-full"
                  ariaLabel={`Get started with ${plan.name} plan`}>

                    Get Started
                  </TouchOptimizedButton>
                </SpaceCard>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <BlogPreview />

      {/* FAQ SECTION */}
      <FAQSection />

      {/* NEWSLETTER SIGNUP */}
      <NewsletterSignup />

      <LandingFooter />
    </div>);

}