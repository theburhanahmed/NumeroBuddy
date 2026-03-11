'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface GlassCardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'subtle' | 'liquid' | 'liquid-premium'
  theme?: 'cosmic' | 'neutral'
  className?: string
  onClick?: () => void
  hover?: boolean
}

const cosmicVariantStyles = {
  default: 'bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20',
  elevated:
    'bg-[#1a2942]/50 backdrop-blur-2xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10',
  subtle: 'bg-[#1a2942]/30 backdrop-blur-lg border border-cyan-500/10',
  liquid:
    'liquid-glass bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0px_6px_21px_-8px_rgba(0,212,255,0.1)]',
  'liquid-premium':
    'liquid-glass liquid-glass-premium bg-[#1a2942]/60 backdrop-blur-2xl border border-cyan-500/40 shadow-[0px_8px_32px_-8px_rgba(0,212,255,0.15)]',
}

const neutralVariantStyles = {
  default:
    'bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-gray-700/30',
  elevated:
    'bg-white/80 dark:bg-gray-800/50 backdrop-blur-2xl border border-gray-200 dark:border-gray-700/40 shadow-xl',
  subtle:
    'bg-white/60 dark:bg-gray-800/30 backdrop-blur-lg border border-gray-200 dark:border-gray-700/20',
  liquid:
    'liquid-glass border border-gray-200 dark:border-gray-700/30 shadow-[0px_6px_21px_-8px_rgba(0,0,0,0.1)]',
  'liquid-premium':
    'liquid-glass liquid-glass-premium border border-gray-300 dark:border-gray-700/40 shadow-[0px_8px_32px_-8px_rgba(0,0,0,0.15)]',
}

export function GlassCard({
  children,
  variant = 'default',
  theme = 'cosmic',
  className = '',
  onClick,
  hover = true,
}: GlassCardProps) {
  const baseStyles = 'rounded-3xl transition-all duration-300'
  const variantStyles = theme === 'cosmic' ? cosmicVariantStyles : neutralVariantStyles
  const CardComponent = onClick ? motion.button : motion.div

  return (
    <>
      {/* SVG Filters - only render once */}
      <svg
        width="0"
        height="0"
        style={{
          position: 'absolute',
        }}
      >
        <defs>
          {/* Default Liquid Glass Distortion */}
          <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025 0.025"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="65"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Subtle Distortion */}
          <filter
            id="glass-distortion-subtle"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.02"
              numOctaves="1"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.5" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="35"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Premium Distortion */}
          <filter
            id="glass-distortion-premium"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03 0.03"
              numOctaves="3"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2.5" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="85"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <CardComponent
        className={`${baseStyles} ${variantStyles[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        whileHover={
          onClick && hover
            ? {
                scale: 1.02,
                y: -2,
              }
            : undefined
        }
        whileTap={
          onClick
            ? {
                scale: 0.98,
              }
            : undefined
        }
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Content wrapper with z-index: 10 */}
        <div
          className={variant.includes('liquid') ? 'liquid-glass-content' : ''}
        >
          {children}
        </div>
      </CardComponent>
    </>
  )
}