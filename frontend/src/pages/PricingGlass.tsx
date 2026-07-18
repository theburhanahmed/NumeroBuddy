import React, { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  SparklesIcon,
  ZapIcon,
  CrownIcon,
  XIcon,
  LoaderIcon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassNav } from '../components/GlassNav';
import { LandingFooter } from '../components/LandingFooter';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { paymentsAPI } from '../lib/api-client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
export function PricingGlass() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planName: string, price: number) => {
    if (price === 0) {
      navigate('/signup');
      return;
    }
    if (!user) {
      navigate('/signup');
      return;
    }
    setLoadingPlan(planName);
    try {
      const response = await paymentsAPI.createCheckoutSession(planName.toLowerCase());
      const { checkout_url, url } = response.data;
      const redirectUrl = checkout_url || url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error('Unable to create checkout session. Please try again.');
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.response?.data?.detail || 'Unable to start checkout. Please try again.';
      toast.error(message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
  {
    name: 'Free',
    key: 'free',
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
    color: 'from-gray-400 to-gray-600',
    glowColor: 'gray-500'
  },
  {
    name: 'Premium',
    key: 'premium',
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
    color: 'from-cyan-400 to-blue-600',
    glowColor: 'cyan-500'
  },
  {
    name: 'Elite',
    key: 'elite',
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
    color: 'from-purple-500 to-pink-600',
    glowColor: 'purple-500'
  }];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        {/* Stars */}
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

        {/* Ambient Glows */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <GlassNav />

        {/* Header */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-center mb-16">

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

            <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
              Choose Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Cosmic Plan
              </span>
            </h1>

            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Start free, upgrade anytime. All plans include our core numerology
              features.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) =>
            <motion.div
              key={plan.name}
              initial={{
                opacity: 0,
                y: 40
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2 + index * 0.1
              }}
              className="relative group">

                {/* Popular Badge */}
                {plan.popular &&
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg shadow-cyan-500/30">
                      MOST POPULAR
                    </span>
                  </div>
              }

                {/* Glow Effect */}
                <div
                className={`absolute inset-0 bg-gradient-to-br from-${plan.glowColor}/20 to-${plan.glowColor}/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />


                {/* Card */}
                <div
                className={`relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border transition-all h-full flex flex-col ${plan.popular ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : 'border-cyan-500/20 hover:border-cyan-500/40'}`}>

                  {/* Icon */}
                  <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>

                    {plan.icon}
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-serif text-white text-center mb-2">
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/60 text-center mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-white">
                        ${plan.price}
                      </span>
                      {plan.price > 0 &&
                    <span className="text-white/60">/{plan.period}</span>
                    }
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) =>
                    <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckIcon className="w-3 h-3 text-green-400" />
                          </div>
                          <span className="text-white/80 text-sm">
                            {feature}
                          </span>
                        </li>
                    )}
                      {plan.limitations.map((limitation, i) =>
                    <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <XIcon className="w-3 h-3 text-red-400" />
                          </div>
                          <span className="text-white/50 text-sm line-through">
                            {limitation}
                          </span>
                        </li>
                    )}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                  onClick={() => handleSelectPlan(plan.key, plan.price)}
                  disabled={loadingPlan === plan.key}
                  className={`w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50' : 'border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10'} ${loadingPlan === plan.key ? 'opacity-70 cursor-not-allowed' : ''}`}>

                    {loadingPlan === plan.key ? (
                      <>
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.price === 0 ? 'Start Free' : 'Get Started'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Money-Back Guarantee */}
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
            className="max-w-4xl mx-auto">

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/30 p-8 md:p-12">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl" />

              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                  <CheckIcon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">
                  30-Day Money-Back Guarantee
                </h3>

                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Try NumeroBuddy risk-free. If you're not completely satisfied
                  with your Premium or Enterprise plan within 30 days, we'll
                  refund your payment—no questions asked.
                </p>

                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                  {
                    icon: '⏰',
                    title: '30 Days',
                    desc: 'Full refund period'
                  },
                  {
                    icon: '😊',
                    title: 'No Questions',
                    desc: 'Hassle-free process'
                  },
                  {
                    icon: '🛡️',
                    title: '100% Secure',
                    desc: 'Your trust matters'
                  }].
                  map((item, index) =>
                  <div key={index} className="text-center">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <h4 className="font-semibold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  )}
                </div>
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