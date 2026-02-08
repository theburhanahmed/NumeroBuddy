import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShiftingDropDown } from '../components/ui/shifting-dropdown';
import { DynamicBackground } from '../components/DynamicBackground';
import { ArrowLeftIcon } from 'lucide-react';
export function ShiftingDropdownDemo() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <DynamicBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Back Button */}
        <motion.button
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors">

          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>

        {/* Demo Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-20">
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
              delay: 0.2
            }}
            className="text-center mb-12">

            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Shifting Dropdown Navigation
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Hover over the tabs to see smooth content transitions with
              directional animations
            </p>
          </motion.div>

          {/* Component Demo */}
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
              delay: 0.4
            }}>

            <ShiftingDropDown />
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.6
            }}
            className="mt-16 max-w-2xl mx-auto">

            <div className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">
                Features:
              </h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>
                    Smooth directional animations based on tab selection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>
                    Dynamic positioning indicator (nub) that follows hover
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Glassmorphism styling matching NumeroBuddy theme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Keyboard accessible with focus states</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Responsive design with mobile considerations</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}