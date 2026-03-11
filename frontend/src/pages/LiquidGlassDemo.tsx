import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ZapIcon, LayersIcon } from 'lucide-react';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function LiquidGlassDemo() {
  const features = [
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'Glassmorphism',
    description: 'Beautiful frosted glass effects with backdrop blur',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    title: 'Smooth Animations',
    description: 'Fluid motion design with Framer Motion',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: <LayersIcon className="w-6 h-6" />,
    title: 'Layered Depth',
    description: 'Multi-layer cosmic backgrounds with parallax',
    color: 'from-green-500 to-emerald-600'
  }];

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="text-center mb-12">

          <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-6">
            Liquid Glass Design
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Experience the future of UI design with our cosmic glassmorphism
            aesthetic
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 0.2
          }}
          className="mb-12">

          <SpaceCard variant="premium" className="p-12 md:p-16 text-center">
            <div className="inline-block p-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 mb-6">
              <SparklesIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-4">
              Premium Glassmorphism
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Our design system combines frosted glass effects, cosmic
              backgrounds, and smooth animations to create an immersive, premium
              experience.
            </p>
            <TouchOptimizedButton
              variant="primary"
              size="lg"
              ariaLabel="Get started">

              Get Started
            </TouchOptimizedButton>
          </SpaceCard>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) =>
          <motion.div
            key={feature.title}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3 + index * 0.1
            }}
            whileHover={{
              y: -8,
              scale: 1.02
            }}>

              <SpaceCard variant="default" className="p-8 h-full">
                <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg`}>

                  {feature.icon}
                </div>
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </SpaceCard>
            </motion.div>
          )}
        </div>

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
            delay: 0.6
          }}>

          <SpaceCard variant="premium" className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
                  Cosmic Design System
                </h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Every element is carefully crafted to create a cohesive,
                  immersive experience. From subtle animations to bold
                  gradients, each detail serves a purpose.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-white/80">
                      Accessible and WCAG AA compliant
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-white/80">
                      Mobile-first responsive design
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-white/80">Optimized performance</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) =>
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  transition={{
                    delay: 0.7 + i * 0.1
                  }}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-600/20 backdrop-blur-xl border border-cyan-500/30" />

                )}
              </div>
            </div>
          </SpaceCard>
        </motion.div>
      </div>

      <LandingFooter />
    </div>);

}