import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';
interface LifePathOrb3DProps {
  className?: string;
}
export function LifePathOrb3D({
  className = ''
}: LifePathOrb3DProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = 1000;
      setScrollProgress(Math.min(scrolled / maxScroll, 1));
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return <div className={`w-full h-full flex items-center justify-center ${className}`} onMouseEnter={() => !isMobile && setIsHovered(true)} onMouseLeave={() => !isMobile && setIsHovered(false)}>
      <div className="relative w-full h-full max-w-lg max-h-lg">
        {/* Central Orb */}
        <motion.div className="absolute inset-0 m-auto w-64 h-64 rounded-full" style={{
        background: 'radial-gradient(circle at 30% 30%, #3b82f6 0%, #1e40af 50%, #0ea5e9 100%)',
        boxShadow: `
              inset -20px -20px 40px rgba(0, 0, 0, 0.5),
              inset 10px 10px 30px rgba(255, 255, 255, 0.2),
              0 0 60px rgba(0, 212, 255, 0.4),
              0 0 100px rgba(0, 212, 255, 0.2)
            `
      }} animate={{
        rotate: scrollProgress * 360,
        scale: isHovered ? 1.1 : 1
      }} transition={{
        rotate: {
          duration: 0.3
        },
        scale: {
          duration: 0.3
        }
      }}>
          {/* Inner glow */}
          <motion.div className="absolute inset-8 rounded-full bg-cyan-400/60 blur-xl" animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />
        </motion.div>

        {/* Outer glow ring */}
        <motion.div className="absolute inset-0 m-auto w-80 h-80 rounded-full border-2 border-cyan-400/30" style={{
        boxShadow: '0 0 40px rgba(0, 212, 255, 0.3), inset 0 0 40px rgba(0, 212, 255, 0.2)'
      }} animate={{
        scale: [1, 1.05, 1],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }} />

        {/* Orbiting Numbers */}
        {numbers.map((number, index) => {
        const angle = index / numbers.length * Math.PI * 2;
        const radius = isHovered ? 200 : 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return <motion.div key={number} className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6" animate={{
          x: [x, x * 1.1, x],
          y: [y, y * 1.1, y],
          rotate: [0, 360]
        }} transition={{
          x: {
            duration: 6 + index * 0.5,
            repeat: Infinity,
            ease: 'linear'
          },
          y: {
            duration: 6 + index * 0.5,
            repeat: Infinity,
            ease: 'linear'
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }
        }}>
              <motion.div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg" style={{
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
          }} whileHover={{
            scale: 1.3,
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.8)'
          }} transition={{
            duration: 0.2
          }}>
                {number}
              </motion.div>
            </motion.div>;
      })}

        {/* Particle effects */}
        {[...Array(12)].map((_, i) => {
        const angle = i / 12 * Math.PI * 2;
        const radius = 250;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return <motion.div key={i} className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-cyan-400/50" style={{
          x,
          y
        }} animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.25,
          ease: 'easeInOut'
        }} />;
      })}
      </div>
    </div>;
}