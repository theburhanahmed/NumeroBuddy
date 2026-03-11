import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, SlidersIcon } from 'lucide-react';
import { InteractiveParticleBackground } from '../components/InteractiveParticleBackground';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function ParticleDemo() {
  const [particleCount, setParticleCount] = useState(100);
  const [glowIntensity, setGlowIntensity] = useState(0.8);
  const [gravityStrength, setGravityStrength] = useState(0.5);
  const [mouseRadius, setMouseRadius] = useState(150);
  const [particleColor, setParticleColor] = useState('#22D3EE');
  const [showControls, setShowControls] = useState(true);
  const presets = [
  {
    name: 'Cosmic',
    color: '#22D3EE',
    count: 100,
    glow: 0.8,
    gravity: 0.5,
    radius: 150
  },
  {
    name: 'Aurora',
    color: '#A855F7',
    count: 150,
    glow: 1.0,
    gravity: 0.3,
    radius: 200
  },
  {
    name: 'Fire',
    color: '#F97316',
    count: 200,
    glow: 0.9,
    gravity: 0.7,
    radius: 120
  },
  {
    name: 'Ocean',
    color: '#06B6D4',
    count: 80,
    glow: 0.6,
    gravity: 0.4,
    radius: 180
  }];

  const applyPreset = (preset: (typeof presets)[0]) => {
    setParticleColor(preset.color);
    setParticleCount(preset.count);
    setGlowIntensity(preset.glow);
    setGravityStrength(preset.gravity);
    setMouseRadius(preset.radius);
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      <InteractiveParticleBackground
        particleCount={particleCount}
        particleColor={particleColor}
        glowIntensity={glowIntensity}
        gravityStrength={gravityStrength}
        mouseRadius={mouseRadius} />


      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
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
            duration: 0.5
          }}
          className="max-w-4xl w-full">

          <div className="text-center mb-8">
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
              className="inline-block p-4 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 mb-6">

              <SparklesIcon className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h1
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.3
              }}
              className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-4">

              Interactive Particles
            </motion.h1>
            <motion.p
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.4
              }}
              className="text-xl text-white/70 max-w-2xl mx-auto">

              Move your mouse to interact with the particles. Watch them react
              with dynamic gravity and glowing effects.
            </motion.p>
          </div>

          {showControls &&
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
              delay: 0.5
            }}>

              <SpaceCard variant="premium" className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white flex items-center gap-3">
                    <SlidersIcon className="w-6 h-6 text-cyan-400" />
                    Customize
                  </h2>
                  <TouchOptimizedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowControls(false)}
                  ariaLabel="Hide controls">

                    Hide
                  </TouchOptimizedButton>
                </div>

                {/* Presets */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-3">
                    Presets
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {presets.map((preset) =>
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="p-4 rounded-xl bg-[#0a1628]/60 border-2 border-cyan-500/20 hover:border-cyan-500/50 transition-colors text-white font-medium">

                        {preset.name}
                      </button>
                  )}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Particle Count: {particleCount}
                    </label>
                    <input
                    type="range"
                    min="20"
                    max="300"
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="w-full h-2 bg-[#0a1628]/60 rounded-lg appearance-none cursor-pointer accent-cyan-500" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Glow Intensity: {glowIntensity.toFixed(1)}
                    </label>
                    <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={glowIntensity}
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-[#0a1628]/60 rounded-lg appearance-none cursor-pointer accent-cyan-500" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Gravity Strength: {gravityStrength.toFixed(1)}
                    </label>
                    <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={gravityStrength}
                    onChange={(e) =>
                    setGravityStrength(Number(e.target.value))
                    }
                    className="w-full h-2 bg-[#0a1628]/60 rounded-lg appearance-none cursor-pointer accent-cyan-500" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Mouse Radius: {mouseRadius}px
                    </label>
                    <input
                    type="range"
                    min="50"
                    max="300"
                    value={mouseRadius}
                    onChange={(e) => setMouseRadius(Number(e.target.value))}
                    className="w-full h-2 bg-[#0a1628]/60 rounded-lg appearance-none cursor-pointer accent-cyan-500" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Particle Color
                    </label>
                    <div className="flex gap-3">
                      {[
                    '#22D3EE',
                    '#A855F7',
                    '#F97316',
                    '#06B6D4',
                    '#10B981',
                    '#EC4899'].
                    map((color) =>
                    <button
                      key={color}
                      onClick={() => setParticleColor(color)}
                      className={`w-12 h-12 rounded-xl transition-all ${particleColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                      style={{
                        backgroundColor: color
                      }}
                      aria-label={`Select ${color} color`} />

                    )}
                    </div>
                  </div>
                </div>
              </SpaceCard>
            </motion.div>
          }

          {!showControls &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="text-center">

              <TouchOptimizedButton
              variant="primary"
              size="lg"
              onClick={() => setShowControls(true)}
              icon={<SlidersIcon className="w-5 h-5" />}
              ariaLabel="Show controls">

                Show Controls
              </TouchOptimizedButton>
            </motion.div>
          }
        </motion.div>
      </div>
    </div>);

}