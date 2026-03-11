import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangleIcon } from 'lucide-react';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
export function Disclaimer() {
  const sections = [
  {
    title: '1. Entertainment Purpose',
    content:
    'Numerobuddy provides numerology readings for entertainment and personal growth purposes only. Our services should not be considered professional advice.'
  },
  {
    title: '2. Not Professional Advice',
    content:
    'Our numerology readings are not a substitute for professional medical, legal, financial, or psychological advice. Always consult qualified professionals for important decisions.'
  },
  {
    title: '3. Accuracy of Information',
    content:
    'While we strive for accuracy, numerology is an interpretive practice. Results may vary and should be viewed as guidance rather than absolute predictions.'
  },
  {
    title: '4. AI-Generated Content',
    content:
    'Our AI numerologist provides automated responses based on numerological principles. These are not from human experts and should be interpreted accordingly.'
  },
  {
    title: '5. Personal Responsibility',
    content:
    'You are responsible for decisions made based on our readings. We encourage critical thinking and personal judgment in all matters.'
  },
  {
    title: '6. No Guarantees',
    content:
    'We make no guarantees about specific outcomes, future events, or life changes resulting from using our services.'
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
              <AlertTriangleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                Disclaimer
              </h1>
              <p className="text-white/70">
                Important information about our services
              </p>
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
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
              <p className="text-yellow-400 font-semibold">
                ⚠️ Please read this disclaimer carefully before using
                Numerobuddy services.
              </p>
            </div>

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
              <p className="text-white/70 leading-relaxed">
                By using Numerobuddy, you acknowledge that you have read,
                understood, and agree to this disclaimer.
              </p>
            </div>
          </SpaceCard>
        </motion.div>
      </div>

      <LandingFooter />
    </div>);

}