import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
interface ParallaxStarfieldProps {
  density?: 'low' | 'medium' | 'high';
}
export function ParallaxStarfield({
  density = 'medium'
}: ParallaxStarfieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const starCounts = {
    low: {
      near: 8,
      mid: 12,
      far: 15
    },
    medium: {
      near: 12,
      mid: 18,
      far: 20
    },
    high: {
      near: 15,
      mid: 25,
      far: 30
    }
  };
  const counts = starCounts[density];
  // Parallax transforms for different depth layers
  const nearY = useTransform(scrollY, [0, 1000], [0, -150]);
  const midY = useTransform(scrollY, [0, 1000], [0, -80]);
  const farY = useTransform(scrollY, [0, 1000], [0, -30]);
  // Generate consistent star positions
  const generateStars = (count: number, seed: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      // Use seed for consistent positioning
      const x = (i * 37 + seed * 13) % 100;
      const y = (i * 53 + seed * 17) % 100;
      stars.push({
        x,
        y,
        id: `${seed}-${i}`
      });
    }
    return stars;
  };
  const nearStars = generateStars(counts.near, 1);
  const midStars = generateStars(counts.mid, 2);
  const farStars = generateStars(counts.far, 3);
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* Far layer - slowest parallax, smallest stars */}
      <motion.div
        style={{
          y: farY
        }}
        className="absolute inset-0">

        {farStars.map((star) =>
        <motion.div
          key={star.id}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: 0.3
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }} />

        )}
      </motion.div>

      {/* Mid layer - medium parallax, medium stars */}
      <motion.div
        style={{
          y: midY
        }}
        className="absolute inset-0">

        {midStars.map((star) =>
        <motion.div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: 0.5,
            boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }} />

        )}
      </motion.div>

      {/* Near layer - fastest parallax, largest stars */}
      <motion.div
        style={{
          y: nearY
        }}
        className="absolute inset-0">

        {nearStars.map((star) =>
        <motion.div
          key={star.id}
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: 0.7,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            opacity: [0.5, 0.9, 0.5],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }} />

        )}
      </motion.div>
    </div>);

}