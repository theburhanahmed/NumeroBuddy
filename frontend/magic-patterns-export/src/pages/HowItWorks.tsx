import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { Timeline3D } from '../components/Timeline3D';
export function HowItWorks() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-28">
        {/* Header */}
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
            duration: 0.5
          }}
          className="text-center mb-20">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              Simple & Powerful
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight">
            How NumerAI
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Works
            </span>
          </h1>

          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover your cosmic destiny in four simple steps. Scroll to see
            each step come forward in 3D space.
          </p>

          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3
            }}
            className="flex items-center justify-center gap-2 text-cyan-400 text-sm">

            <span>Scroll to explore</span>
            <motion.div
              animate={{
                y: [0, 5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}>

              ↓
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 3D Timeline */}
        <Timeline3D />

        {/* Why It Works Section */}
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
          className="mt-32 mb-16">

          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-12 text-center">
            Why NumerAI
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Is Different
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
            {
              title: 'AI-Powered Accuracy',
              description:
              'Our advanced AI analyzes thousands of numerological patterns to provide the most accurate insights.',
              stat: '99.9%',
              label: 'Accuracy'
            },
            {
              title: 'Ancient Wisdom',
              description:
              'Based on thousands of years of numerological knowledge from cultures around the world.',
              stat: '5000+',
              label: 'Years'
            },
            {
              title: 'Modern Technology',
              description:
              'Cutting-edge algorithms combined with traditional numerology for unprecedented insights.',
              stat: '24/7',
              label: 'Available'
            }].
            map((item, index) =>
            <motion.div
              key={item.title}
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
              }}>

                <SpaceCard variant="premium" className="p-8 h-full text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                    {item.stat}
                  </div>
                  <div className="text-sm text-cyan-400 mb-4">{item.label}</div>
                  <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </SpaceCard>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* CTA Section */}
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
          className="text-center">

          <SpaceCard variant="premium" className="p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
              Ready to Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Cosmic Blueprint?
              </span>
            </h2>

            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Join thousands of users who have unlocked their numerological
              insights and transformed their lives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TouchOptimizedButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                icon={<ArrowRightIcon className="w-5 h-5" />}
                ariaLabel="Get started with NumerAI">

                Get Started Free
              </TouchOptimizedButton>

              <TouchOptimizedButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/features')}
                ariaLabel="Explore all features">

                Explore Features
              </TouchOptimizedButton>
            </div>
          </SpaceCard>
        </motion.div>
      </div>

      <LandingFooter />
    </div>);

}