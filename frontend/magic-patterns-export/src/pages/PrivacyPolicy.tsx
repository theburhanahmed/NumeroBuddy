import React from 'react';
import { motion } from 'framer-motion';
import { ShieldIcon } from 'lucide-react';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
export function PrivacyPolicy() {
  const sections = [
  {
    title: '1. Information We Collect',
    content:
    'We collect information you provide directly, including name, email, birth date, and payment information. We also collect usage data to improve our services.'
  },
  {
    title: '2. How We Use Your Information',
    content:
    'Your information is used to provide numerology readings, personalize your experience, process payments, send updates, and improve our services.'
  },
  {
    title: '3. Data Security',
    content:
    'We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.'
  },
  {
    title: '4. Sharing Your Information',
    content:
    'We do not sell your personal information. We may share data with service providers who help us operate our platform, always under strict confidentiality agreements.'
  },
  {
    title: '5. Your Rights',
    content:
    'You have the right to access, correct, or delete your personal data. You can also opt-out of marketing communications at any time.'
  },
  {
    title: '6. Cookies and Tracking',
    content:
    'We use cookies to enhance your experience, analyze usage, and provide personalized content. You can control cookie preferences in your browser settings.'
  },
  {
    title: '7. Third-Party Services',
    content:
    'We use third-party services like payment processors and analytics tools. These services have their own privacy policies governing data use.'
  },
  {
    title: '8. Changes to Privacy Policy',
    content:
    'We may update this policy periodically. We will notify you of significant changes via email or through prominent notices on our platform.'
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <ShieldIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                Privacy Policy
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
              At Numerobuddy, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, and protect your personal
              information.
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
              <h2 className="text-xl font-bold text-white mb-3">Contact Us</h2>
              <p className="text-white/70 leading-relaxed">
                For privacy-related questions or to exercise your rights,
                contact us at{' '}
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