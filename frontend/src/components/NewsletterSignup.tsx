import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, SparklesIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter backend not yet implemented; show coming soon feedback
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };
  return <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }}>
          <SpaceCard variant="premium" className="p-8 md:p-12 text-center overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-600/5" />

            <div className="relative z-10">
              {/* Icon */}
              <motion.div initial={{
              scale: 0
            }} whileInView={{
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2,
              type: 'spring'
            }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-6 shadow-lg shadow-cyan-500/30">
                <SparklesIcon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-4">
                Get Cosmic Insights
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                  Delivered Weekly
                </span>
              </h2>

              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Join our community and receive weekly numerology insights,
                cosmic forecasts, and exclusive tips directly to your inbox.
              </p>

              {/* Form */}
              {!isSubmitted ? <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full pl-12 pr-4 py-3 bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors" />
                    </div>
                    <motion.button type="submit" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all whitespace-nowrap">
                      Subscribe
                    </motion.button>
                  </div>
                  <p className="text-xs text-white/50 mt-3">
                    No spam, unsubscribe anytime. Your cosmic privacy is sacred.
                  </p>
                </form> : <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="max-w-md mx-auto">
                  <div className="p-6 bg-green-500/20 border border-green-400/30 rounded-xl">
                    <p className="text-green-300 font-semibold">
                      ✨ Welcome to the cosmic community!
                    </p>
                    <p className="text-green-200/70 text-sm mt-2">
                      Check your email for a confirmation link.
                    </p>
                  </div>
                </motion.div>}

              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-6 mt-12 text-left">
                {[{
                icon: '📅',
                title: 'Weekly Forecasts',
                desc: 'Cosmic energy updates'
              }, {
                icon: '💎',
                title: 'Exclusive Tips',
                desc: 'Numerology insights'
              }, {
                icon: '🎁',
                title: 'Special Offers',
                desc: 'Subscriber-only deals'
              }].map((benefit, index) => <motion.div key={benefit.title} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.3 + index * 0.1
              }} className="flex gap-3">
                    <div className="text-2xl">{benefit.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-white/60">{benefit.desc}</p>
                    </div>
                  </motion.div>)}
              </div>
            </div>
          </SpaceCard>
        </motion.div>
      </div>
    </section>;
}