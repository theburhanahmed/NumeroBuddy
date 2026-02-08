'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon, MenuIcon, XIcon } from 'lucide-react'
import { CosmicButton } from '@/components/glassmorphism/cosmic-button'

interface GlassNavProps {
  showLinks?: boolean
  ctaText?: string
  ctaAction?: () => void
}

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'FEATURES', href: '/features' },
  { label: 'PRICING', href: '/subscription' },
  { label: 'HOW IT WORKS', href: '/how-it-works' },
  { label: 'BLOG', href: '/blog' },
  { label: 'CONTACT', href: '/contact' },
]

export function GlassNav({
  showLinks = true,
  ctaText = 'START FREE JOURNEY',
  ctaAction,
}: GlassNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleCTA = () => {
    if (ctaAction) {
      ctaAction()
    } else {
      router.push('/register')
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center justify-between px-6 md:px-8 py-4 md:py-6 max-w-7xl mx-auto"
    >
      {/* Logo */}
      <motion.div
        className="flex items-center gap-3 cursor-pointer min-h-[44px]"
        onClick={() => router.push('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <span className="text-white font-semibold text-base md:text-lg tracking-wide">
          NumerAI
        </span>
      </motion.div>

      {/* Nav Links */}
      {showLinks && (
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-white transition-colors py-2 relative ${
                pathname === link.href ? 'text-white' : ''
              }`}
            >
              <motion.span
                className="block"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.span>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <div className="flex items-center gap-4">
        <CosmicButton
          onClick={handleCTA}
          variant="secondary"
          size="md"
          icon={<SparklesIcon className="w-4 h-4 text-cyan-400" />}
        >
          {ctaText}
        </CosmicButton>

        {/* Mobile Menu Toggle */}
        <motion.button
          className="md:hidden text-white p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-[#1a2942]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-xl overflow-hidden z-50"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-white hover:bg-cyan-500/10 transition-colors ${
                    pathname === link.href ? 'bg-cyan-500/20' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
