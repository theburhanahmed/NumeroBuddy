import React from 'react';
import { motion } from 'framer-motion';
// Birth Chart - 3D number grid forming
export function BirthChart3D() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return <div className="relative w-full h-64 flex items-center justify-center" style={{
    perspective: '1000px'
  }}>
      <div className="grid grid-cols-3 gap-4">
        {numbers.map((num, i) => <motion.div key={num} initial={{
        opacity: 0,
        scale: 0,
        rotateX: -90,
        z: -200
      }} animate={{
        opacity: 1,
        scale: 1,
        rotateX: 0,
        z: 0
      }} transition={{
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1]
      }} className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center" style={{
        transformStyle: 'preserve-3d'
      }}>
            <motion.span animate={{
          textShadow: ['0 0 10px rgba(0, 212, 255, 0.5)', '0 0 20px rgba(0, 212, 255, 0.8)', '0 0 10px rgba(0, 212, 255, 0.5)']
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} className="text-2xl font-bold text-cyan-400">
              {num}
            </motion.span>
          </motion.div>)}
      </div>

      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{
      opacity: 0.2
    }}>
        <motion.line x1="33%" y1="0" x2="33%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-cyan-400" initial={{
        pathLength: 0
      }} animate={{
        pathLength: 1
      }} transition={{
        duration: 1,
        delay: 0.5
      }} />
        <motion.line x1="66%" y1="0" x2="66%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-cyan-400" initial={{
        pathLength: 0
      }} animate={{
        pathLength: 1
      }} transition={{
        duration: 1,
        delay: 0.6
      }} />
        <motion.line x1="0" y1="33%" x2="100%" y2="33%" stroke="currentColor" strokeWidth="1" className="text-cyan-400" initial={{
        pathLength: 0
      }} animate={{
        pathLength: 1
      }} transition={{
        duration: 1,
        delay: 0.7
      }} />
        <motion.line x1="0" y1="66%" x2="100%" y2="66%" stroke="currentColor" strokeWidth="1" className="text-cyan-400" initial={{
        pathLength: 0
      }} animate={{
        pathLength: 1
      }} transition={{
        duration: 1,
        delay: 0.8
      }} />
      </svg>
    </div>;
}
// AI Chat - Pulsing neural-like number nodes
export function AIChat3D() {
  const nodes = [{
    x: 50,
    y: 30,
    num: 7,
    delay: 0
  }, {
    x: 30,
    y: 50,
    num: 3,
    delay: 0.2
  }, {
    x: 70,
    y: 50,
    num: 9,
    delay: 0.4
  }, {
    x: 20,
    y: 70,
    num: 1,
    delay: 0.6
  }, {
    x: 50,
    y: 70,
    num: 5,
    delay: 0.8
  }, {
    x: 80,
    y: 70,
    num: 8,
    delay: 1.0
  }];
  const connections = [{
    from: 0,
    to: 1
  }, {
    from: 0,
    to: 2
  }, {
    from: 1,
    to: 3
  }, {
    from: 1,
    to: 4
  }, {
    from: 2,
    to: 4
  }, {
    from: 2,
    to: 5
  }, {
    from: 3,
    to: 4
  }, {
    from: 4,
    to: 5
  }];
  return <div className="relative w-full h-64 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, i) => {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        return <motion.line key={i} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`} stroke="url(#gradient)" strokeWidth="2" initial={{
          pathLength: 0,
          opacity: 0
        }} animate={{
          pathLength: 1,
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          pathLength: {
            duration: 1,
            delay: i * 0.1
          },
          opacity: {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2
          }
        }} />;
      })}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {nodes.map((node, i) => <motion.div key={i} className="absolute" style={{
      left: `${node.x}%`,
      top: `${node.y}%`,
      transform: 'translate(-50%, -50%)'
    }} initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: [1, 1.2, 1],
      opacity: 1
    }} transition={{
      scale: {
        duration: 2,
        repeat: Infinity,
        delay: node.delay
      },
      opacity: {
        duration: 0.5,
        delay: node.delay
      }
    }}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-600/30 backdrop-blur-xl border border-purple-400/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-lg font-bold text-purple-300">
              {node.num}
            </span>
          </div>
        </motion.div>)}
    </div>;
}
// Daily Reading - Calendar cube flipping
export function DailyReading3D() {
  return <div className="relative w-full h-64 flex items-center justify-center" style={{
    perspective: '1000px'
  }}>
      <motion.div animate={{
      rotateY: [0, 180, 360]
    }} transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'linear'
    }} style={{
      transformStyle: 'preserve-3d'
    }} className="relative w-32 h-32">
        {/* Front face */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-600/30 backdrop-blur-xl border border-pink-400/40 rounded-2xl flex flex-col items-center justify-center" style={{
        backfaceVisibility: 'hidden'
      }}>
          <span className="text-4xl font-bold text-pink-300">15</span>
          <span className="text-xs text-pink-300/70 mt-1">Today</span>
        </motion.div>

        {/* Back face */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-pink-600/30 backdrop-blur-xl border border-rose-400/40 rounded-2xl flex flex-col items-center justify-center" style={{
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)'
      }}>
          <span className="text-4xl font-bold text-rose-300">16</span>
          <span className="text-xs text-rose-300/70 mt-1">Tomorrow</span>
        </motion.div>
      </motion.div>

      {/* Floating date markers */}
      {[...Array(8)].map((_, i) => <motion.div key={i} className="absolute w-8 h-8 rounded-lg bg-pink-400/20 backdrop-blur-sm border border-pink-400/30 flex items-center justify-center text-xs text-pink-300" style={{
      left: `${20 + i % 4 * 20}%`,
      top: `${30 + Math.floor(i / 4) * 40}%`
    }} animate={{
      y: [0, -10, 0],
      opacity: [0.3, 0.6, 0.3]
    }} transition={{
      duration: 2,
      repeat: Infinity,
      delay: i * 0.2
    }}>
          {i + 1}
        </motion.div>)}
    </div>;
}
// Compatibility - Two number orbs merging
export function Compatibility3D() {
  return <div className="relative w-full h-64 flex items-center justify-center">
      {/* Left orb */}
      <motion.div className="absolute" animate={{
      x: [-60, 0, -60],
      scale: [1, 1.1, 1]
    }} transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }}>
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/40 to-pink-600/40 rounded-full blur-xl" />
          <div className="absolute inset-2 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold text-white">7</span>
          </div>
        </div>
      </motion.div>

      {/* Right orb */}
      <motion.div className="absolute" animate={{
      x: [60, 0, 60],
      scale: [1, 1.1, 1]
    }} transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }}>
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-blue-600/40 rounded-full blur-xl" />
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold text-white">3</span>
          </div>
        </div>
      </motion.div>

      {/* Merge effect */}
      <motion.div className="absolute w-32 h-32 rounded-full border-2 border-purple-400/30" animate={{
      scale: [0.8, 1.2, 0.8],
      opacity: [0, 0.5, 0]
    }} transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />

      {/* Heart particles */}
      {[...Array(12)].map((_, i) => {
      const angle = i / 12 * Math.PI * 2;
      const radius = 80;
      return <motion.div key={i} className="absolute w-2 h-2 bg-pink-400 rounded-full" style={{
        left: '50%',
        top: '50%'
      }} animate={{
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        scale: [0, 1, 0],
        opacity: [0, 1, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        delay: i * 0.1
      }} />;
    })}
    </div>;
}
// Remedies - Gemstones floating & rotating
export function Remedies3D() {
  const gemstones = [{
    color: 'from-red-500 to-rose-600',
    name: 'Ruby',
    x: 30,
    y: 40,
    delay: 0
  }, {
    color: 'from-blue-500 to-cyan-600',
    name: 'Sapphire',
    x: 50,
    y: 30,
    delay: 0.3
  }, {
    color: 'from-green-500 to-emerald-600',
    name: 'Emerald',
    x: 70,
    y: 40,
    delay: 0.6
  }, {
    color: 'from-purple-500 to-violet-600',
    name: 'Amethyst',
    x: 40,
    y: 65,
    delay: 0.9
  }, {
    color: 'from-amber-500 to-yellow-600',
    name: 'Citrine',
    x: 60,
    y: 65,
    delay: 1.2
  }];
  return <div className="relative w-full h-64 flex items-center justify-center" style={{
    perspective: '1000px'
  }}>
      {gemstones.map((gem, i) => <motion.div key={i} className="absolute" style={{
      left: `${gem.x}%`,
      top: `${gem.y}%`,
      transform: 'translate(-50%, -50%)',
      transformStyle: 'preserve-3d'
    }} animate={{
      rotateY: [0, 360],
      y: [0, -20, 0],
      rotateZ: [0, 10, -10, 0]
    }} transition={{
      rotateY: {
        duration: 4,
        repeat: Infinity,
        ease: 'linear',
        delay: gem.delay
      },
      y: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: gem.delay
      },
      rotateZ: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: gem.delay
      }
    }}>
          <div className="relative">
            {/* Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gem.color} rounded-lg blur-xl opacity-60`} />

            {/* Gemstone */}
            <div className={`relative w-16 h-16 bg-gradient-to-br ${gem.color} rounded-lg shadow-2xl`} style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}>
              {/* Facets */}
              <div className="absolute inset-0 bg-white/20" style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 50% 50%)'
          }} />
              <div className="absolute inset-0 bg-white/10" style={{
            clipPath: 'polygon(0% 25%, 50% 50%, 0% 75%)'
          }} />
              <div className="absolute inset-0 bg-black/10" style={{
            clipPath: 'polygon(50% 50%, 100% 75%, 50% 100%)'
          }} />
            </div>

            {/* Label */}
            <motion.div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/70 whitespace-nowrap" animate={{
          opacity: [0.5, 1, 0.5]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          delay: gem.delay
        }}>
              {gem.name}
            </motion.div>
          </div>
        </motion.div>)}

      {/* Energy particles */}
      {[...Array(15)].map((_, i) => <motion.div key={i} className="absolute w-1 h-1 bg-amber-400/60 rounded-full" style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }} animate={{
      scale: [0, 1.5, 0],
      opacity: [0, 0.8, 0]
    }} transition={{
      duration: 2,
      repeat: Infinity,
      delay: Math.random() * 2
    }} />)}
    </div>;
}