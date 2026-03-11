import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LockIcon, CrownIcon, SparklesIcon, ArrowUpIcon } from 'lucide-react';
import { useSubscription, SubscriptionTier } from '../contexts/SubscriptionContext';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { MagneticCard } from './MagneticCard';
interface SubscriptionGateProps {
  feature: string;
  requiredTier: SubscriptionTier;
  children: React.ReactNode;
  showPreview?: boolean;
  previewContent?: React.ReactNode;
}
export function SubscriptionGate({
  feature,
  requiredTier,
  children,
  showPreview = false,
  previewContent
}: SubscriptionGateProps) {
  const router = useRouter();
  const {
    hasAccess,
    tier
  } = useSubscription();
  const tierInfo = {
    premium: {
      name: 'Premium',
      icon: <SparklesIcon className="w-6 h-6" />,
      color: 'from-purple-500 to-blue-500',
      price: '$9.99/month',
      features: ['Full numerology reports', 'All calculators', 'Personalized remedies', '50 AI messages per day']
    },
    enterprise: {
      name: 'Enterprise',
      icon: <CrownIcon className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500',
      price: '$29.99/month',
      features: ['Everything unlimited', 'Expert consultations', 'Priority support', 'Advanced analytics']
    }
  };
  if (hasAccess(feature)) {
    return <>{children}</>;
  }
  const info = tierInfo[requiredTier as 'premium' | 'enterprise'];
  return <div className="relative">
      {showPreview && previewContent && <div className="relative">
          <div className="blur-sm pointer-events-none select-none">
            {previewContent}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900" />
        </div>}

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className={showPreview ? 'absolute inset-0 flex items-center justify-center p-4' : ''}>
        <MagneticCard variant="liquid-premium" className="card-padding-lg max-w-md mx-auto">
          <div className="liquid-glass-content text-center">
            <motion.div className={`w-20 h-20 bg-gradient-to-br ${info.color} rounded-3xl flex items-center justify-center text-white mb-6 mx-auto shadow-xl`} animate={{
            scale: [1, 1.05, 1]
          }} transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}>
              {info.icon}
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold mb-4">
              <LockIcon className="w-4 h-4" />
              Not Subscribed
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upgrade to {info.name}
            </h3>
            <p className="text-gray-600 dark:text-white/70 mb-6">
              Unlock this feature and get access to comprehensive numerology
              insights.
            </p>

            <div className="mb-6 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                What's included:
              </p>
              <ul className="space-y-2">
                {info.features.map((feat, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {feat}
                  </li>)}
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Currently on{' '}
                <span className="font-semibold capitalize">{tier}</span> plan
              </span>
              <ArrowUpIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {info.name}
              </span>
            </div>

            <GlassButton
              variant="liquid"
              size="lg"
              className="w-full glass-glow mb-3"
              onClick={() => router.push(`/subscription/checkout?plan=${requiredTier === 'enterprise' ? 'elite' : requiredTier}`)}
            >
              Upgrade to {info.name} - {info.price}
            </GlassButton>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cancel anytime • 7-day money-back guarantee
            </p>
          </div>
        </MagneticCard>
      </motion.div>
    </div>;
}