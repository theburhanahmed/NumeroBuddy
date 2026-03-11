import React from 'react';
import { motion } from 'framer-motion';
interface CrystalNumerologyCubeProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'blue' | 'pink';
  className?: string;
}
export function CrystalNumerologyCube({
  number,
  size = 'md',
  color = 'cyan',
  className = ''
}: CrystalNumerologyCubeProps) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  const colorMap = {
    cyan: {
      primary: '#00d4ff',
      secondary: '#4a9eff',
      glow: 'rgba(0, 212, 255, 0.6)'
    },
    purple: {
      primary: '#a855f7',
      secondary: '#8b5cf6',
      glow: 'rgba(168, 85, 247, 0.6)'
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      glow: 'rgba(59, 130, 246, 0.6)'
    },
    pink: {
      primary: '#ec4899',
      secondary: '#db2777',
      glow: 'rgba(236, 72, 153, 0.6)'
    }
  };
  const colors = colorMap[color];
  return <motion.div className={`relative ${sizeMap[size]} ${className}`} style={{
    perspective: '1000px'
  }} animate={{
    rotateY: [0, 360],
    rotateX: [0, 15, 0]
  }} transition={{
    rotateY: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear'
    },
    rotateX: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }} whileHover={{
    scale: 1.1,
    rotateY: 180,
    transition: {
      duration: 0.6
    }
  }}>
      {/* Crystal Cube */}
      <div className="absolute inset-0" style={{
      transformStyle: 'preserve-3d',
      transform: 'rotateX(-15deg) rotateY(30deg)'
    }}>
        {/* Front Face */}
        <div className="absolute inset-0 flex items-center justify-center" style={{
        background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}20 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.primary}60`,
        boxShadow: `
              inset 0 0 30px ${colors.glow},
              0 0 40px ${colors.glow},
              0 20px 60px rgba(0, 0, 0, 0.5)
            `,
        transform: 'translateZ(50px)'
      }}>
          <motion.span className="text-4xl font-bold font-['Playfair_Display']" style={{
          color: colors.primary,
          textShadow: `
                0 0 20px ${colors.glow},
                0 0 40px ${colors.glow},
                0 0 60px ${colors.glow}
              `
        }} animate={{
          textShadow: [`0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`, `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`, `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }}>
            {number}
          </motion.span>
        </div>

        {/* Top Face */}
        <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${colors.primary}50 0%, ${colors.secondary}30 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.primary}50`,
        boxShadow: `inset 0 0 20px ${colors.glow}`,
        transform: 'rotateX(90deg) translateZ(50px)'
      }} />

        {/* Right Face */}
        <div className="absolute inset-0" style={{
        background: `linear-gradient(90deg, ${colors.secondary}30 0%, ${colors.primary}20 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.primary}40`,
        boxShadow: `inset 0 0 20px ${colors.glow}`,
        transform: 'rotateY(90deg) translateZ(50px)'
      }} />

        {/* Specular Highlights */}
        <motion.div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 40%)',
        transform: 'translateZ(51px)',
        filter: 'blur(4px)'
      }} animate={{
        opacity: [0.5, 1, 0.5]
      }} transition={{
        duration: 2,
        repeat: Infinity
      }} />
      </div>

      {/* Bloom Glow */}
      <motion.div className="absolute inset-0 rounded-lg" style={{
      background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
      filter: 'blur(30px)',
      transform: 'scale(1.5)'
    }} animate={{
      opacity: [0.4, 0.8, 0.4],
      scale: [1.5, 1.7, 1.5]
    }} transition={{
      duration: 3,
      repeat: Infinity
    }} />

      {/* Floating Animation */}
      <motion.div className="absolute inset-0" animate={{
      y: [0, -10, 0]
    }} transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />
    </motion.div>;
}