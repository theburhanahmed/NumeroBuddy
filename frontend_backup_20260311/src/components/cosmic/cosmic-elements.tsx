'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Deterministic "random" so server and client render the same (avoids hydration mismatch)
function seeded(i: number, seed: number) {
  const x = Math.sin(i * 12.9898 + seed) * 43758.5453
  return x - Math.floor(x)
}

// Fixed decimals so server and client serialize identical style strings (avoids hydration mismatch)
function fix(n: number, decimals = 4): string {
  const d = 10 ** decimals
  return (Math.round(n * d) / d).toString()
}

// Floating Neon Runes Component
export function FloatingNeonRunes({ count = 8 }: { count?: number }) {
  const runes = ['☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆']

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${fix(seeded(i, 1) * 100)}%`,
            top: `${fix(seeded(i, 2) * 100)}%`,
            fontSize: `${fix(24 + seeded(i, 3) * 24, 2)}px`,
            color: i % 2 === 0 ? '#00d4ff' : '#a855f7',
            textShadow: `
              0 0 20px currentColor,
              0 0 40px currentColor,
              0 0 60px currentColor
            `,
          }}
          animate={{
            y: [0, -30 - seeded(i, 4) * 30, 0],
            x: [0, seeded(i, 5) * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + seeded(i, 6) * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: seeded(i, 7) * 4,
          }}
        >
          {runes[i % runes.length]}
        </motion.div>
      ))}
    </div>
  )
}

// Particle Swarm Component (deterministic seeded values for SSR/client match)
export function ParticleSwarm({ count = 50 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => {
        const color = ['#00d4ff', '#4a9eff', '#a855f7', '#ec4899'][i % 4]
        const pathRadius = 100 + seeded(i, 10) * 200
        const duration = 15 + seeded(i, 11) * 10
        const w = 2 + seeded(i, 12) * 3
        const h = 2 + seeded(i, 13) * 3
        const glow1 = 8 + seeded(i, 14) * 8
        const glow2 = 16 + seeded(i, 15) * 16

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${fix(w)}px`,
              height: `${fix(h)}px`,
              left: '50%',
              top: '50%',
              background: color,
              boxShadow: `0 0 ${fix(glow1)}px ${color}, 0 0 ${fix(glow2)}px ${color}`,
            }}
            animate={{
              x: [
                0,
                pathRadius * Math.cos((i / count) * Math.PI * 2),
                pathRadius * Math.cos((i / count) * Math.PI * 2 + Math.PI),
                0,
              ],
              y: [
                0,
                pathRadius * Math.sin((i / count) * Math.PI * 2),
                pathRadius * Math.sin((i / count) * Math.PI * 2 + Math.PI),
                0,
              ],
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i / count) * duration,
            }}
          />
        )
      })}
    </div>
  )
}

// Nebula Streaks Component
export function NebulaStreaks() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal Streaks */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-px"
          style={{
            left: 0,
            right: 0,
            top: `${20 + i * 15}%`,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(0, 212, 255, 0.3) 20%, 
              rgba(168, 85, 247, 0.3) 50%, 
              rgba(236, 72, 153, 0.3) 80%, 
              transparent 100%
            )`,
            filter: 'blur(2px)',
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scaleX: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Diagonal Streaks */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`d-${i}`}
          className="absolute w-full h-px origin-left"
          style={{
            left: 0,
            top: `${30 + i * 20}%`,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(74, 158, 255, 0.4) 30%, 
              rgba(139, 92, 246, 0.4) 70%, 
              transparent 100%
            )`,
            filter: 'blur(3px)',
            transform: `rotate(${-15 + i * 10}deg)`,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scaleX: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}

      {/* Volumetric Fog Clouds (deterministic for hydration) */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`fog-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${fix(200 + seeded(i, 20) * 300)}px`,
            height: `${fix(100 + seeded(i, 21) * 150)}px`,
            left: `${fix(seeded(i, 22) * 80)}%`,
            top: `${fix(seeded(i, 23) * 80)}%`,
            background: `radial-gradient(ellipse, 
              rgba(0, 212, 255, 0.15) 0%, 
              rgba(168, 85, 247, 0.1) 50%, 
              transparent 100%
            )`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 3,
          }}
        />
      ))}
    </div>
  )
}

// Cosmic Fog Component (deterministic for hydration)
export function CosmicFog() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: `${fix(300 + seeded(i, 30) * 400)}px`,
            height: `${fix(200 + seeded(i, 31) * 300)}px`,
            left: `${fix(seeded(i, 32) * 100)}%`,
            top: `${fix(seeded(i, 33) * 100)}%`,
            background: `radial-gradient(ellipse, 
              rgba(0, 212, 255, 0.08) 0%, 
              rgba(74, 158, 255, 0.05) 30%,
              rgba(168, 85, 247, 0.03) 60%, 
              transparent 100%
            )`,
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 4,
          }}
        />
      ))}
    </div>
  )
}

