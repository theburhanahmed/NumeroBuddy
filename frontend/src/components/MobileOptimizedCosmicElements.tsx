import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
/**
 * Mobile-optimized versions of cosmic elements
 * Reduces particle count and complexity on small screens
 */
// Mobile-optimized Floating Particles
export function MobileFloatingParticles({
  count = 30
}: {
  count?: number;
}) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  // Reduce particle count on mobile
  const particleCount = isMobile ? Math.floor(count / 2) : count;
  if (prefersReducedMotion) return null;
  return <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(particleCount)].map((_, i) => <motion.div key={i} className="absolute rounded-full" style={{
      width: isMobile ? '2px' : `${2 + Math.random() * 3}px`,
      height: isMobile ? '2px' : `${2 + Math.random() * 3}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#4a9eff' : '#a855f7',
      boxShadow: `0 0 ${isMobile ? 4 : 8}px currentColor`
    }} animate={{
      y: [0, -30 - Math.random() * 20, 0],
      x: [0, Math.random() * 10 - 5, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0]
    }} transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 3,
      ease: 'easeInOut'
    }} />)}
    </div>;
}
// Mobile-optimized Nebula Streaks
export function MobileNebulaStreaks() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;
  const streakCount = isMobile ? 3 : 5;
  return <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(streakCount)].map((_, i) => <motion.div key={i} className="absolute h-px" style={{
      left: 0,
      right: 0,
      top: `${20 + i * (60 / streakCount)}%`,
      background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(0, 212, 255, ${isMobile ? 0.2 : 0.3}) 30%, 
              rgba(168, 85, 247, ${isMobile ? 0.2 : 0.3}) 70%, 
              transparent 100%
            )`,
      filter: `blur(${isMobile ? 1 : 2}px)`
    }} animate={{
      opacity: [0.2, 0.5, 0.2],
      scaleX: [0.8, 1, 0.8]
    }} transition={{
      duration: 8 + i * 2,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 1.5
    }} />)}
    </div>;
}