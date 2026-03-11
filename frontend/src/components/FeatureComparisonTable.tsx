import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
interface Feature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  enterprise: boolean | string;
}
const features: Feature[] = [
{
  name: 'Basic Numerology Readings',
  free: true,
  premium: true,
  enterprise: true
},
{
  name: 'Daily Insights',
  free: '3 per day',
  premium: 'Unlimited',
  enterprise: 'Unlimited'
},
{
  name: 'Birth Chart Visualization',
  free: 'Basic',
  premium: '3D Interactive',
  enterprise: '3D Interactive'
},
{
  name: 'AI Chat Support',
  free: false,
  premium: true,
  enterprise: true
},
{
  name: 'Compatibility Analysis',
  free: '1 per month',
  premium: 'Unlimited',
  enterprise: 'Unlimited'
},
{
  name: 'Life Path Reports',
  free: 'Summary',
  premium: 'Detailed PDF',
  enterprise: 'Custom Reports'
},
{
  name: 'Daily Readings',
  free: true,
  premium: true,
  enterprise: true
},
{
  name: 'Forecasts & Predictions',
  free: false,
  premium: 'Monthly',
  enterprise: 'Weekly + Custom'
},
{
  name: 'Remedies & Solutions',
  free: 'Basic',
  premium: 'Personalized',
  enterprise: 'Expert Curated'
},
{
  name: 'Expert Consultations',
  free: false,
  premium: '1 per month',
  enterprise: 'Unlimited'
},
{
  name: 'Priority Support',
  free: false,
  premium: true,
  enterprise: true
},
{
  name: 'API Access',
  free: false,
  premium: false,
  enterprise: true
},
{
  name: 'Custom Integrations',
  free: false,
  premium: false,
  enterprise: true
},
{
  name: 'Dedicated Account Manager',
  free: false,
  premium: false,
  enterprise: true
}];

function FeatureCell({ value }: {value: boolean | string;}) {
  if (typeof value === 'boolean') {
    return value ?
    <CheckIcon className="w-5 h-5 text-green-400 mx-auto" /> :

    <XIcon className="w-5 h-5 text-white/30 mx-auto" />;

  }
  return (
    <span className="text-sm text-white/80 text-center block">{value}</span>);

}
export function FeatureComparisonTable() {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              Compare Plans
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Choose the Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Plan for You
            </span>
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Detailed comparison of features across all plans
          </p>
        </motion.div>

        {/* Table */}
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
          }}>

          <SpaceCard variant="premium" className="overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left p-6 text-white font-semibold">
                      Features
                    </th>
                    <th className="p-6 text-center">
                      <div className="text-white font-semibold mb-1">Free</div>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        $0
                      </div>
                    </th>
                    <th className="p-6 text-center bg-cyan-500/5">
                      <div className="text-white font-semibold mb-1">
                        Premium
                      </div>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        $9.99
                      </div>
                      <div className="text-xs text-cyan-400 mt-1">
                        MOST POPULAR
                      </div>
                    </th>
                    <th className="p-6 text-center">
                      <div className="text-white font-semibold mb-1">
                        Enterprise
                      </div>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        $29.99
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) =>
                  <motion.tr
                    key={feature.name}
                    initial={{
                      opacity: 0
                    }}
                    whileInView={{
                      opacity: 1
                    }}
                    viewport={{
                      once: true
                    }}
                    transition={{
                      delay: index * 0.02
                    }}
                    className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">

                      <td className="p-4 text-white/80">{feature.name}</td>
                      <td className="p-4 text-center">
                        <FeatureCell value={feature.free} />
                      </td>
                      <td className="p-4 text-center bg-cyan-500/5">
                        <FeatureCell value={feature.premium} />
                      </td>
                      <td className="p-4 text-center">
                        <FeatureCell value={feature.enterprise} />
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-6 p-6">
              {['Free', 'Premium', 'Enterprise'].map((plan) =>
              <div
                key={plan}
                className={`p-6 rounded-2xl border ${plan === 'Premium' ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-cyan-500/20'}`}>

                  <h3 className="text-xl font-bold text-white mb-4">{plan}</h3>
                  <div className="space-y-3">
                    {features.map((feature) => {
                    const value =
                    plan === 'Free' ?
                    feature.free :
                    plan === 'Premium' ?
                    feature.premium :
                    feature.enterprise;
                    return (
                      <div
                        key={feature.name}
                        className="flex items-center justify-between gap-4">

                          <span className="text-sm text-white/70">
                            {feature.name}
                          </span>
                          <FeatureCell value={value} />
                        </div>);

                  })}
                  </div>
                </div>
              )}
            </div>
          </SpaceCard>
        </motion.div>
      </div>
    </section>);

}