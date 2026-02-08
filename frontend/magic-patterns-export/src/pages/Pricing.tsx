import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  SparklesIcon,
  ZapIcon,
  CrownIcon,
  XIcon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { FeatureComparisonTable } from '../components/FeatureComparisonTable';
import { MoneyBackGuarantee } from '../components/MoneyBackGuarantee';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
export function Pricing() {
  const navigate = useNavigate();
  const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    icon: <ZapIcon className="w-6 h-6" />,
    description: 'Perfect for exploring numerology',
    features: [
    'Basic numerology readings',
    '3 daily insights',
    'Community forum access',
    'Life path number calculation'],

    limitations: [
    'No AI chat access',
    'Limited report downloads',
    'No compatibility checks'],

    popular: false,
    color: 'from-gray-400 to-gray-600'
  },
  {
    name: 'Premium',
    price: 9.99,
    period: 'month',
    icon: <SparklesIcon className="w-6 h-6" />,
    description: 'Most popular for serious seekers',
    features: [
    'Unlimited AI numerologist chat',
    'Unlimited daily readings',
    'Full birth chart analysis',
    'Compatibility checker',
    'Detailed PDF reports',
    'Priority email support',
    'Advanced forecasts',
    'Name numerology tools'],

    limitations: [],
    popular: true,
    color: 'from-cyan-400 to-blue-600'
  },
  {
    name: 'Enterprise',
    price: 29.99,
    period: 'month',
    icon: <CrownIcon className="w-6 h-6" />,
    description: 'For professionals and businesses',
    features: [
    'Everything in Premium',
    'Expert 1-on-1 consultations',
    'Custom numerology reports',
    'API access for integration',
    'White-label options',
    'Dedicated account manager',
    'Team collaboration tools',
    'Priority phone support'],

    limitations: [],
    popular: false,
    color: 'from-purple-500 to-pink-600'
  }];

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-28">
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
          className="text-center mb-12">

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
              💎 Transparent Pricing
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-4">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Cosmic Plan
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Start free, upgrade anytime. All plans include our core numerology
            features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) =>
          <motion.div
            key={plan.name}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
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
              className={`p-8 h-full flex flex-col ${plan.popular ? 'border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : ''}`}>

                {/* Header */}
                <div className="text-center mb-6">
                  <div
                  className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>

                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-white/60 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-white/70">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) =>
                  <li key={i} className="flex items-start gap-2">
                        <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                  )}
                    {plan.limitations.map((limitation, i) =>
                  <li key={i} className="flex items-start gap-2">
                        <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/50 text-sm line-through">
                          {limitation}
                        </span>
                      </li>
                  )}
                  </ul>
                </div>

                {/* CTA Button */}
                <TouchOptimizedButton
                variant={plan.popular ? 'primary' : 'secondary'}
                size="lg"
                onClick={() => navigate('/signup')}
                className="w-full"
                ariaLabel={`Get started with ${plan.name} plan`}>

                  {plan.price === 0 ? 'Start Free' : 'Get Started'}
                </TouchOptimizedButton>
              </SpaceCard>
            </motion.div>
          )}
        </div>

        {/* Money-Back Guarantee */}
        <MoneyBackGuarantee />

        {/* Feature Comparison Table */}
        <FeatureComparisonTable />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ Section */}
        <FAQSection />
      </div>

      <LandingFooter />
    </div>);

}