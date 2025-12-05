'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, MenuIcon, XIcon, MoonIcon, SunIcon } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { useTheme } from '@/contexts/theme-context';
import { MobileNav } from './mobile-nav';

export function LandingNav() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/subscription' },
    { label: 'Testimonials', href: '#testimonials' }
  ];
  
  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <SparklesIcon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
                  NumerAI
                </span>
              </motion.button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 hidden sm:block"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'light' ? (
                    <MoonIcon className="w-5 h-5 text-gray-700" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  )}
                </motion.button>

                {/* Auth Buttons - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                  <GlassButton variant="ghost" size="sm" onClick={() => router.push('/login')}>
                    Sign In
                  </GlassButton>
                  <GlassButton variant="liquid" size="sm" onClick={() => router.push('/register')} className="glass-glow">
                    Get Started
                  </GlassButton>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMobileMenuOpen ? (
                    <XIcon className="w-6 h-6 text-gray-700 dark:text-white" />
                  ) : (
                    <MenuIcon className="w-6 h-6 text-gray-700 dark:text-white" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav
            navLinks={navLinks}
            onNavigate={handleNavClick}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

