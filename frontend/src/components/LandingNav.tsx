import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react';
export function LandingNav() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const productLinks = [
  {
    label: 'How It Works',
    href: '/how-it-works'
  },
  {
    label: 'Features',
    href: '/features'
  },
  {
    label: 'AI Numerologist',
    href: '/ai-numerologist'
  },
  {
    label: 'Birth Chart Demo',
    href: '/birth-chart-demo'
  }];

  const navLinks = [
  {
    label: 'Pricing',
    href: '/pricing'
  },
  {
    label: 'Consultants',
    href: '/consultants'
  },
  {
    label: 'Community',
    href: '/community'
  },
  {
    label: 'Blog',
    href: '/blog'
  },
  {
    label: 'About',
    href: '/about'
  }];

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
    setIsProductOpen(false);
  };
  return (
    <>
      <motion.nav
        initial={{
          y: -100,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">

        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1a2942]/60 backdrop-blur-2xl rounded-3xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 group"
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{
                  scale: 0.95
                }}>

                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold font-['Playfair_Display'] text-white hidden sm:inline">
                  NumerAI
                </span>
              </motion.button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                {/* Product Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProductOpen(!isProductOpen)}
                    className="flex items-center gap-1 text-white/80 hover:text-cyan-400 font-medium transition-colors"
                    whileHover={{
                      y: -2
                    }}>

                    Product
                    <ChevronDownIcon className="w-4 h-4" />
                  </motion.button>

                  <AnimatePresence>
                    {isProductOpen &&
                    <>
                        <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProductOpen(false)} />

                        <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale: 0.95
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          scale: 0.95
                        }}
                        transition={{
                          duration: 0.2
                        }}
                        className="absolute right-0 mt-2 w-56 bg-[#1a2942]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-xl overflow-hidden z-50">

                          {productLinks.map((link) =>
                        <button
                          key={link.href}
                          onClick={() => handleNavClick(link.href)}
                          className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 transition-colors text-sm">

                              {link.label}
                            </button>
                        )}
                        </motion.div>
                      </>
                    }
                  </AnimatePresence>
                </div>

                {navLinks.map((link) =>
                <motion.button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white/80 hover:text-cyan-400 font-medium transition-colors"
                  whileHover={{
                    y: -2
                  }}>

                    {link.label}
                  </motion.button>
                )}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-white/80 hover:text-white font-medium transition-colors">

                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">

                    Get Started
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/20"
                  whileHover={{
                    scale: 1.1
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  aria-label="Toggle mobile menu">

                  {isMobileMenuOpen ?
                  <XIcon className="w-6 h-6 text-white" /> :

                  <MenuIcon className="w-6 h-6 text-white" />
                  }
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />


            <motion.div
            initial={{
              opacity: 0,
              y: -20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed top-20 left-4 right-4 z-50 lg:hidden max-h-[calc(100vh-6rem)] overflow-y-auto">

              <div className="bg-[#1a2942]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
                <div className="p-4 space-y-2">
                  {/* Product Section */}
                  <div className="border-b border-cyan-500/20 pb-2 mb-2">
                    <p className="px-4 py-2 text-xs text-white/60 font-semibold uppercase">
                      Product
                    </p>
                    {productLinks.map((link) =>
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 rounded-xl transition-colors font-medium">

                        {link.label}
                      </button>
                  )}
                  </div>

                  {navLinks.map((link) =>
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 rounded-xl transition-colors font-medium">

                      {link.label}
                    </button>
                )}

                  <div className="border-t border-cyan-500/20 pt-2 space-y-2">
                    <button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 rounded-xl transition-colors font-medium">

                      Sign In
                    </button>
                    <button
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg text-center">

                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}