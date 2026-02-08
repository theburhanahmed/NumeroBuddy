import React from 'react';
import { motion } from 'framer-motion';
import { CookieIcon } from 'lucide-react';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
export function CookiePolicy() {
  const sections = [
  {
    title: '1. What Are Cookies',
    content:
    'Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing site usage.'
  },
  {
    title: '2. Types of Cookies We Use',
    content:
    'We use essential cookies (required for site functionality), analytics cookies (to understand usage patterns), and preference cookies (to remember your settings).'
  },
  {
    title: '3. Essential Cookies',
    content:
    'These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure areas access, and authentication.'
  },
  {
    title: '4. Analytics Cookies',
    content:
    'We use analytics cookies to understand how visitors interact with our website, helping us improve user experience and content.'
  },
  {
    title: '5. Managing Cookies',
    content:
    'You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect website functionality.'
  },
  {
    title: '6. Third-Party Cookies',
    content:
    'Some cookies are placed by third-party services like payment processors and analytics providers. These are governed by their respective privacy policies.'
  }];

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <CookieIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                Cookie Policy
              </h1>
              <p className="text-white/70">Last updated: December 2024</p>
            </div>
          </div>
        </motion.div>

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
            delay: 0.1
          }}>

          <SpaceCard variant="premium" className="p-8 md:p-10 mb-8">
            <p className="text-white/80 leading-relaxed mb-6">
              This Cookie Policy explains how Numerobuddy uses cookies and
              similar technologies to recognize you when you visit our website.
            </p>

            <div className="space-y-6">
              {sections.map((section, index) =>
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.2 + index * 0.05
                }}>

                  <h2 className="text-xl font-bold text-white mb-3">
                    {section.title}
                  </h2>
                  <p className="text-white/70 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-cyan-500/20">
              <h2 className="text-xl font-bold text-white mb-3">Questions?</h2>
              <p className="text-white/70 leading-relaxed">
                For questions about our cookie usage, contact us at{' '}
                <a
                  href="mailto:privacy@numerobuddy.com"
                  className="text-cyan-400 hover:text-cyan-300">

                  privacy@numerobuddy.com
                </a>
              </p>
            </div>
          </SpaceCard>
        </motion.div>
      </div>

      <LandingFooter />
    </div>);

}