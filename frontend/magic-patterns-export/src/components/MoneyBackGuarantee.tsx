import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ClockIcon, SmileIcon } from 'lucide-react';
export function MoneyBackGuarantee() {
  return (
    <section className="relative py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/30 p-8 md:p-12">

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{
                scale: 0
              }}
              whileInView={{
                scale: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 mb-6 shadow-lg shadow-green-500/30">

              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </motion.div>

            {/* Heading */}
            <h3 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-4">
              30-Day Money-Back Guarantee
            </h3>

            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              Try NumerAI risk-free. If you're not completely satisfied with
              your Premium or Enterprise plan within 30 days, we'll refund your
              payment—no questions asked.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6">
              {[
              {
                icon: <ClockIcon className="w-6 h-6" />,
                title: '30 Days',
                description: 'Full refund period'
              },
              {
                icon: <SmileIcon className="w-6 h-6" />,
                title: 'No Questions',
                description: 'Hassle-free process'
              },
              {
                icon: <ShieldCheckIcon className="w-6 h-6" />,
                title: '100% Secure',
                description: 'Your trust matters'
              }].
              map((feature, index) =>
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
                  delay: 0.3 + index * 0.1
                }}
                className="flex flex-col items-center text-center">

                  <div className="w-12 h-12 rounded-xl bg-green-400/20 flex items-center justify-center text-green-300 mb-3">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </motion.div>
              )}
            </div>

            {/* Fine print */}
            <p className="text-xs text-white/50 mt-8 text-center">
              * Refund applies to first-time Premium and Enterprise
              subscriptions only. Free plan users can upgrade anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>);

}