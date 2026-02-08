import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, SparklesIcon, CrownIcon, ZapIcon, XIcon } from 'lucide-react';
import { MagneticCard } from './MagneticCard';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { SubscriptionTier } from '../contexts/SubscriptionContext';
interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: {
    text: string;
    included: boolean;
  }[];
  recommended?: boolean;
  limits?: string[];
}
interface SubscriptionPricingCardsProps {
  onSelectTier: (tier: SubscriptionTier) => void;
  selectedTier?: SubscriptionTier;
  showSelection?: boolean;
}
export function SubscriptionPricingCards({
  onSelectTier,
  selectedTier,
  showSelection = true
}: SubscriptionPricingCardsProps) {
  const tiers: PricingTier[] = [{
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring numerology basics',
    icon: <ZapIcon className="w-6 h-6" />,
    color: 'from-gray-500 to-slate-500',
    limits: ['3 daily readings per day', '1 report per month', 'Basic calculators only'],
    features: [{
      text: 'Basic Life Path analysis',
      included: true
    }, {
      text: 'Limited daily readings (3/day)',
      included: true
    }, {
      text: 'Basic name analysis',
      included: true
    }, {
      text: 'Personal Year forecast',
      included: true
    }, {
      text: 'Full numerology report',
      included: false
    }, {
      text: 'All calculators',
      included: false
    }, {
      text: 'AI chat',
      included: false
    }, {
      text: 'Remedies & suggestions',
      included: false
    }, {
      text: 'Consultations',
      included: false
    }]
  }, {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    description: 'Complete numerology insights & guidance',
    icon: <SparklesIcon className="w-6 h-6" />,
    color: 'from-purple-500 to-blue-500',
    recommended: true,
    limits: ['Unlimited daily readings', '10 reports per month', '50 AI messages per day'],
    features: [{
      text: 'Everything in Free, plus:',
      included: true
    }, {
      text: 'Full numerology report',
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
      text: 'AI numerologist chat (50/day)',
      included: true
    }, {
      text: 'Compatibility analysis',
      included: true
    }, {
      text: 'Birth chart & forecasts',
      included: true
    }, {
      text: 'Consultations',
      included: false
    }]
  }, {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$29.99',
    description: 'Everything unlimited with expert support',
    icon: <CrownIcon className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    limits: ['Everything unlimited', 'Priority support', 'Exclusive features'],
    features: [{
      text: 'Everything in Premium, plus:',
      included: true
    }, {
      text: 'Unlimited everything',
      included: true
    }, {
      text: 'Expert consultations',
      included: true
    }, {
      text: 'Priority support',
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
      text: 'Early access to features',
      included: true
    }]
  }];
  return <div className="grid md:grid-cols-3 gap-6">
      {tiers.map((tier, index) => <motion.div key={tier.id} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: index * 0.1
    }} className="relative">
          {tier.recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                RECOMMENDED
              </span>
            </div>}

          <MagneticCard variant={selectedTier === tier.id ? 'liquid-premium' : 'liquid'} className={`card-padding h-full ${selectedTier === tier.id ? 'ring-2 ring-purple-500' : ''} ${tier.recommended ? 'scale-105' : ''}`}>
            <div className="liquid-glass-content flex flex-col h-full">
              {/* Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  {tier.id !== 'free' && <span className="text-gray-600 dark:text-gray-400">
                      /month
                    </span>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tier.description}
                </p>
              </div>

              {/* Limits */}
              {tier.limits && <div className="mb-6 p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Usage Limits:
                  </p>
                  <ul className="space-y-1">
                    {tier.limits.map((limit, i) => <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                        {limit}
                      </li>)}
                  </ul>
                </div>}

              {/* Features */}
              <div className="flex-1 mb-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => <li key={i} className="flex items-start gap-2">
                      {feature.included ? <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /> : <XIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />}
                      <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                        {feature.text}
                      </span>
                    </li>)}
                </ul>
              </div>

              {/* Action Button */}
              {showSelection && <GlassButton variant={tier.recommended ? 'liquid' : 'secondary'} size="lg" onClick={() => onSelectTier(tier.id)} className={`w-full ${tier.recommended ? 'glass-glow' : ''}`} disabled={selectedTier === tier.id}>
                  {selectedTier === tier.id ? 'Selected' : `Select ${tier.name}`}
                </GlassButton>}

              {tier.id !== 'free' && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                  Cancel anytime • 7-day money-back guarantee
                </p>}
            </div>
          </MagneticCard>
        </motion.div>)}
    </div>;
}