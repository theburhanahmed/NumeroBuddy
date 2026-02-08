import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, AwardIcon, UsersIcon, ZapIcon } from 'lucide-react';
export function TrustBadges() {
  const badges = [
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: 'SSL Secured',
    description: 'Bank-level encryption'
  },
  {
    icon: <AwardIcon className="w-6 h-6" />,
    title: 'Award Winning',
    description: 'Best AI Numerology 2024'
  },
  {
    icon: <UsersIcon className="w-6 h-6" />,
    title: '50K+ Users',
    description: 'Trusted worldwide'
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    title: 'Instant Results',
    description: 'Real-time insights'
  }];

  return (
    <section className="relative py-12 px-4 md:px-6">
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
          className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {badges.map((badge, index) =>
          <motion.div
            key={badge.title}
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
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center text-cyan-400 mb-3">
                {badge.icon}
              </div>
              <h3 className="font-semibold text-white mb-1 text-sm">
                {badge.title}
              </h3>
              <p className="text-xs text-white/60">{badge.description}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}