'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckIcon, SparklesIcon, CrownIcon, ZapIcon, ArrowRightIcon, XIcon } from 'lucide-react';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingFooter } from '@/components/landing/landing-footer';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { AmbientParticles } from '@/components/AmbientParticles';
import { LiquidGlassHero } from '@/components/ui/liquid-glass-hero';
import { MagneticCard } from '@/components/ui/magnetic-card';
import { GlassButton } from '@/components/ui/glass-button';
type BillingCycle = 'monthly' | 'yearly';
export default function Pricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const plans = [{
    id: 'free',
    name: 'Free',
    description: 'Perfect for exploring numerology basics',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: <ZapIcon className="w-6 h-6" />,
    color: 'from-gray-500 to-slate-600',
    features: [{
      text: 'Basic Life Path analysis',
      included: true
    }, {
      text: '3 daily readings per day',
      included: true
    }, {
      text: 'Basic name analysis',
      included: true
    }, {
      text: 'Personal Year forecast',
      included: true
    }, {
      text: 'Community forum access',
      included: true
    }, {
      text: 'Full numerology reports',
      included: false
    }, {
      text: 'AI numerologist chat',
      included: false
    }, {
      text: 'Advanced calculators',
      included: false
    }, {
      text: 'Personalized remedies',
      included: false
    }],
    cta: 'Get Started Free',
    popular: false
  }, {
    id: 'premium',
    name: 'Premium',
    description: 'Complete numerology insights & guidance',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    icon: <SparklesIcon className="w-6 h-6" />,
    color: 'from-purple-500 to-blue-600',
    features: [{
      text: 'Everything in Free, plus:',
      included: true,
      bold: true
    }, {
      text: 'Unlimited daily readings',
      included: true
    }, {
      text: '10 full reports per month',
      included: true
    }, {
      text: 'AI numerologist (50 msgs/day)',
      included: true
    }, {
      text: 'All advanced calculators',
      included: true
    }, {
      text: 'Name & phone numerology',
      included: true
    }, {
      text: 'Personalized remedies',
      included: true
    }, {
      text: 'Compatibility analysis',
      included: true
    }, {
      text: 'Birth chart & forecasts',
      included: true
    }],
    cta: 'Start Premium',
    popular: true
  }, {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Everything unlimited with expert support',
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    icon: <CrownIcon className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-600',
    features: [{
      text: 'Everything in Premium, plus:',
      included: true,
      bold: true
    }, {
      text: 'Unlimited everything',
      included: true
    }, {
      text: 'Expert consultations',
      included: true
    }, {
      text: 'Priority support (24/7)',
      included: true
    }, {
      text: 'Advanced analytics',
      included: true
    }, {
      text: 'Custom reports',
      included: true
    }, {
      text: 'API access',
      included: true
    }, {
      text: 'Early feature access',
      included: true
    }, {
      text: 'Dedicated account manager',
      included: true
    }],
    cta: 'Contact Sales',
    popular: false
  }];
  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return 'Free';
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return `$${price}`;
  };
  const getSavings = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0 || billingCycle === 'monthly') return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    const percentage = Math.round(savings / monthlyCost * 100);
    return `Save ${percentage}%`;
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 transition-colors duration-500 relative overflow-hidden">
      <AmbientParticles />
      <FloatingOrbs />
      <LandingNav />

      {/* Hero Section */}
      <LiquidGlassHero title="Simple, Transparent Pricing" subtitle="Choose the perfect plan for your numerology journey. Start free, upgrade anytime." compact>
        {/* Billing Toggle */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="inline-flex items-center gap-3 p-1.5 bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/30 shadow-lg">
          <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2.5 rounded-xl font-medium transition-all ${billingCycle === 'monthly' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            Monthly
          </button>
          <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2.5 rounded-xl font-medium transition-all relative ${billingCycle === 'yearly' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            Yearly
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
              -17%
            </span>
          </button>
        </motion.div>
      </LiquidGlassHero>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-16">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => <motion.div key={plan.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1 * (index + 1)
        }} className="relative">
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>}

              <MagneticCard variant={plan.popular ? 'liquid-premium' : 'liquid'} className={`card-padding h-full ${plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''}`}>
                <div className="liquid-glass-content flex flex-col h-full">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {getPrice(plan)}
                      </span>
                      {plan.monthlyPrice > 0 && <span className="text-gray-700 dark:text-gray-400">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>}
                    </div>

                    {getSavings(plan) && <span className="inline-block px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        {getSavings(plan)}
                      </span>}
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => <li key={i} className="flex items-start gap-2">
                          {feature.included ? <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /> : <XIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />}
                          <span className={`text-sm ${feature.included ? feature.bold ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-300' : 'text-gray-500 dark:text-gray-600'}`}>
                            {feature.text}
                          </span>
                        </li>)}
                    </ul>
                  </div>

                  {/* CTA */}
                  <GlassButton variant={plan.popular ? 'liquid' : 'secondary'} size="lg" onClick={() => router.push('/signup')} className={`w-full ${plan.popular ? 'glass-glow' : ''}`} icon={<ArrowRightIcon className="w-5 h-5" />}>
                    {plan.cta}
                  </GlassButton>

                  {plan.monthlyPrice > 0 && <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
                      Cancel anytime • 7-day money-back guarantee
                    </p>}
                </div>
              </MagneticCard>
            </motion.div>)}
        </div>

        {/* FAQ Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[{
            q: 'Can I switch plans anytime?',
            a: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.'
          }, {
            q: 'What payment methods do you accept?',
            a: 'We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely.'
          }, {
            q: 'Is there a free trial?',
            a: 'The Free plan is available forever with no credit card required. Premium and Enterprise plans come with a 7-day money-back guarantee.'
          }, {
            q: 'What happens to my data if I cancel?',
            a: 'Your data remains accessible for 30 days after cancellation. You can reactivate anytime during this period.'
          }].map((faq, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6 + i * 0.1
          }}>
                <MagneticCard variant="liquid" className="card-padding">
                  <div className="liquid-glass-content">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {faq.a}
                    </p>
                  </div>
                </MagneticCard>
              </motion.div>)}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8
      }} className="text-center mt-16">
          <MagneticCard variant="liquid-premium" className="card-padding-lg max-w-2xl mx-auto bg-gradient-to-br from-purple-100/50 to-blue-100/50 dark:from-purple-500/20 dark:to-blue-500/20">
            <div className="liquid-glass-content">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to unlock your cosmic potential?
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mb-6">
                Join thousands discovering their numerology insights with
                NumerAI
              </p>
              <GlassButton variant="liquid" size="lg" onClick={() => router.push('/signup')} className="glass-glow" icon={<SparklesIcon className="w-5 h-5" />}>
                Start Your Journey Free
              </GlassButton>
            </div>
          </MagneticCard>
        </motion.div>
      </div>

      <LandingFooter />
    </div>;
}