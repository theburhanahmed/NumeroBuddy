'use client'

/**
 * Depth-based Page Transitions
 * Forward navigation → move into scene
 * Back navigation → pull out
 */

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface DepthTransitionProps {
  children: React.ReactNode
}

/**
 * Depth-based page transition wrapper
 * Creates a 3D-like depth effect when navigating between pages
 */
export function DepthTransition({ children }: DepthTransitionProps) {
  const pathname = usePathname()
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [previousPath, setPreviousPath] = useState<string | null>(null)

  useEffect(() => {
    if (previousPath && previousPath !== pathname) {
      // Determine direction based on navigation history
      // This is a simplified version - in a real app, you'd track navigation history
      setDirection('forward')
      setPreviousPath(pathname)
    }
  }, [pathname, previousPath])

  // Forward navigation: move into scene (translateZ: 100 → 0)
  // Back navigation: pull out (translateZ: 0 → -100)
  const variants = {
    forward: {
      initial: {
        opacity: 0,
        scale: 0.95,
        z: 100,
      },
      animate: {
        opacity: 1,
        scale: 1,
        z: 0,
      },
      exit: {
        opacity: 0,
        scale: 1.05,
        z: -100,
      },
    },
    back: {
      initial: {
        opacity: 0,
        scale: 1.05,
        z: -100,
      },
      animate: {
        opacity: 1,
        scale: 1,
        z: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        z: 100,
      },
    },
  }

  return (
    <div
      className="relative"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants[direction]}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            transformStyle: 'preserve-3d',
            transform: (variants[direction].animate.z as number) !== undefined
              ? `translateZ(${variants[direction].animate.z}px)`
              : undefined,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
