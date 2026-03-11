import React from 'react';
import { motion } from 'framer-motion';
import { FileTextIcon } from 'lucide-react';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
export function TermsOfService() {
  const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
    'By accessing and using Numerobuddy, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.'
  },
  {
    title: '2. Use License',
    content:
    'Permission is granted to temporarily access the materials on Numerobuddy for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
  },
  {
    title: '3. User Account',
    content:
    'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.'
  },
  {
    title: '4. Service Description',
    content:
    'Numerobuddy provides numerology readings, AI-powered insights, and related services. These are for entertainment and personal growth purposes only and should not replace professional advice.'
  },
  {
    title: '5. Payment Terms',
    content:
    'Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law or as explicitly stated in our refund policy.'
  },
  {
    title: '6. Intellectual Property',
    content:
    'All content, features, and functionality are owned by Numerobuddy and are protected by international copyright, trademark, and other intellectual property laws.'
  },
  {
    title: '7. Limitation of Liability',
    content:
    'Numerobuddy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
  },
  {
    title: '8. Changes to Terms',
    content:
    'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.'
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
              <FileTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                Terms of Service
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
              Please read these Terms of Service carefully before using
              Numerobuddy. These terms govern your access to and use of our
              services.
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
                If you have any questions about these Terms of Service, please
                contact us at{' '}
                <a
                  href="mailto:legal@numerobuddy.com"
                  className="text-cyan-400 hover:text-cyan-300">

                  legal@numerobuddy.com
                </a>
              </p>
            </div>
          </SpaceCard>
        </motion.div>
      </div>

      <LandingFooter />
    </div>);

}