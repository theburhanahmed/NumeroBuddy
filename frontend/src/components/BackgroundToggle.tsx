import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  LayersIcon,
  GlassWaterIcon,
  MinusIcon } from
'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
export function BackgroundToggle() {
  const { backgroundType, setBackgroundType } = useBackground();
  const [isOpen, setIsOpen] = useState(false);
  const backgrounds = [
  {
    type: 'parallax' as const,
    name: 'Parallax Stars',
    icon: <SparklesIcon className="w-4 h-4" />,
    description: '3-layer depth effect'
  },
  {
    type: 'shader' as const,
    name: 'Aurora Shader',
    icon: <LayersIcon className="w-4 h-4" />,
    description: 'WebGL aurora effect'
  },
  {
    type: 'glass' as const,
    name: 'Glass Stars',
    icon: <GlassWaterIcon className="w-4 h-4" />,
    description: 'Classic starfield'
  },
  {
    type: 'minimal' as const,
    name: 'Minimal',
    icon: <MinusIcon className="w-4 h-4" />,
    description: 'Clean gradient'
  }];

  const currentBg = backgrounds.find((bg) => bg.type === backgroundType);
  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <AnimatePresence>
        {isOpen &&
        <>
            {/* Backdrop */}
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40" />


            {/* Options Panel */}
            <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            transition={{
              duration: 0.2
            }}
            className="absolute bottom-full left-0 mb-3 w-64 bg-[#1a2942]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-xl overflow-hidden z-50">

              <div className="p-3">
                <p className="text-xs text-white/50 font-semibold uppercase mb-3 px-2">
                  Background Style
                </p>
                <div className="space-y-1">
                  {backgrounds.map((bg) =>
                <button
                  key={bg.type}
                  onClick={() => {
                    setBackgroundType(bg.type);
                    setIsOpen(false);
                  }}
                  className={`
                        w-full px-3 py-3 rounded-xl text-left transition-all
                        flex items-center gap-3
                        ${backgroundType === bg.type ? 'bg-cyan-500/20 border border-cyan-500/40' : 'hover:bg-white/5 border border-transparent'}
                      `}>

                      <div
                    className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${backgroundType === bg.type ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white' : 'bg-white/10 text-white/60'}
                      `}>

                        {bg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {bg.name}
                        </p>
                        <p className="text-xs text-white/50">
                          {bg.description}
                        </p>
                      </div>
                      {backgroundType === bg.type &&
                  <motion.div
                    initial={{
                      scale: 0
                    }}
                    animate={{
                      scale: 1
                    }}
                    className="w-2 h-2 rounded-full bg-cyan-400" />

                  }
                    </button>
                )}
                </div>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1a2942]/90 backdrop-blur-xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10 hover:border-cyan-500/50 transition-all group"
        whileHover={{
          scale: 1.05
        }}
        whileTap={{
          scale: 0.95
        }}>

        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
          {currentBg?.icon}
        </div>
        <div className="text-left">
          <p className="text-xs text-white/50 font-medium">Background</p>
          <p className="text-sm text-white font-semibold">{currentBg?.name}</p>
        </div>
      </motion.button>
    </div>);

}