'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronDownIcon,
  TrendingUpIcon,
  HeartIcon,
  UsersIcon,
  Users2Icon,
  CalendarIcon,
  StarIcon,
  HashIcon,
  MountainIcon,
  Grid3x3Icon,
  BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  PhoneIcon,
  BriefcaseIcon,
  CarIcon,
  FileText,
  Plus,
  GitCompare as Compare,
  FileStack,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useAIChat } from '@/contexts/ai-chat-context'

interface SubmenuItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

interface SubmenuItems {
  [key: string]: SubmenuItem[]
}

const submenuItems: SubmenuItems = {
  'My Numerology': [
    { label: 'Life Path', path: '/life-path', icon: TrendingUpIcon },
    { label: 'Birth Chart', path: '/birth-chart', icon: StarIcon },
    { label: 'All Numbers', path: '/my-numerology/all-numbers', icon: HashIcon },
    { label: 'Pinnacles & Challenges', path: '/my-numerology/pinnacles', icon: MountainIcon },
    { label: 'Lo Shu Grid', path: '/lo-shu-grid', icon: Grid3x3Icon },
    { label: 'Karmic Analysis', path: '/my-numerology/karmic', icon: SparklesIcon },
  ],
  'Relationships': [
    { label: 'Compatibility', path: '/compatibility', icon: HeartIcon },
    { label: 'Compare People', path: '/relationships/compare', icon: UsersIcon },
    { label: 'Family Numerology', path: '/generational-numerology', icon: Users2Icon },
  ],
  'Timing & Cycles': [
    { label: 'Daily Reading', path: '/daily-reading', icon: BookOpenIcon },
    { label: 'Forecasts', path: '/forecasts', icon: TrendingUpIcon },
    { label: 'Auspicious Dates', path: '/auspicious-dates', icon: CalendarIcon },
    { label: 'Personal Cycles', path: '/timing-cycles/personal', icon: ClockIcon },
  ],
  'Tools': [
    { label: 'Name Analysis', path: '/name-numerology', icon: FileTextIcon },
    { label: 'Phone Analysis', path: '/phone-numerology', icon: PhoneIcon },
    { label: 'Business Analysis', path: '/business-name-numerology', icon: BriefcaseIcon },
    { label: 'Asset Analysis', path: '/tools/assets', icon: CarIcon },
  ],
  'Reports': [
    { label: 'My Reports', path: '/reports', icon: FileText },
    { label: 'Generate Reports', path: '/reports/generate', icon: Plus },
    { label: 'Combine Reports', path: '/reports/combine', icon: Compare },
    { label: 'Bulk Generate', path: '/reports/bulk-generate', icon: FileStack },
  ],
}

export function CosmicNavbar() {
  const router = useRouter()
  const { logout } = useAuth()
  const { openChat } = useAIChat()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Numerology', path: '/my-numerology', hasSubmenu: true },
    { label: 'Relationships', path: '/relationships', hasSubmenu: true },
    { label: 'Timing & Cycles', path: '/timing-cycles', hasSubmenu: true },
    { label: 'Tools', path: '/tools', hasSubmenu: true },
    { label: 'Reports', path: '/reports', hasSubmenu: true },
    { label: 'Remedies', path: '/remedies' },
    { label: 'Chat', action: openChat },
    { label: 'Consultations', path: '/consultations' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdownElement = dropdownRefs.current[openDropdown]
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [openDropdown])

  const handleNavItemClick = (item: typeof mainNavItems[0]) => {
    if (item.action) {
      item.action()
    } else if (item.hasSubmenu) {
      // Toggle dropdown for items with submenu
      setOpenDropdown(openDropdown === item.label ? null : item.label)
    } else if (item.path) {
      // Navigate directly for items without submenu
      router.push(item.path)
      setOpenDropdown(null)
    }
  }

  const handleSubmenuClick = (path: string) => {
    router.push(path)
    setOpenDropdown(null)
    setIsMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1a2942]/60 backdrop-blur-2xl rounded-3xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 group"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold font-['Playfair_Display'] text-white hidden sm:inline">
                  NumerAI
                </span>
              </motion.button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                {mainNavItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    ref={(el) => {
                      if (item.hasSubmenu) {
                        dropdownRefs.current[item.label] = el
                      }
                    }}
                  >
                    <motion.button
                      onClick={() => handleNavItemClick(item)}
                      className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center gap-1 relative z-10"
                      whileHover={{
                        y: -2,
                      }}
                    >
                      {item.label}
                      {item.hasSubmenu && (
                        <ChevronDownIcon
                          className={`w-3 h-3 transition-transform ${
                            openDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </motion.button>

                    {/* Dropdown Menu */}
                    {item.hasSubmenu && (
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <motion.div
                              initial={{
                                opacity: 0,
                                y: 10,
                                scale: 0.95,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                y: 10,
                                scale: 0.95,
                              }}
                              transition={{
                                duration: 0.2,
                              }}
                              className="absolute top-full left-0 mt-2 w-56 bg-[#1a2942]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-xl overflow-hidden z-50"
                            >
                              {submenuItems[item.label]?.map((subItem) => {
                                const Icon = subItem.icon
                                return (
                                  <button
                                    key={subItem.path}
                                    onClick={() => handleSubmenuClick(subItem.path)}
                                    className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 transition-colors flex items-center gap-3 group"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center group-hover:from-cyan-400/40 group-hover:to-blue-600/40 transition-colors">
                                      <Icon className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <span className="font-medium">{subItem.label}</span>
                                  </button>
                                )
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Profile Dropdown */}
                <div className="hidden md:block relative">
                  <motion.button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    aria-label="User profile menu"
                  >
                    <UserIcon className="w-5 h-5 text-white" />
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 10,
                            scale: 0.95,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: 10,
                            scale: 0.95,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          className="absolute right-0 mt-2 w-48 bg-[#1a2942]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-xl overflow-hidden z-50"
                        >
                          <button
                            onClick={() => {
                              router.push('/settings')
                              setIsProfileOpen(false)
                            }}
                            className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 transition-colors flex items-center gap-2"
                          >
                            <SettingsIcon className="w-4 h-4" />
                            Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 transition-colors flex items-center gap-2"
                          >
                            <LogOutIcon className="w-4 h-4" />
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-xl bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/20"
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  aria-label="Toggle mobile menu"
                >
                  {isMenuOpen ? (
                    <XIcon className="w-6 h-6 text-white" />
                  ) : (
                    <MenuIcon className="w-6 h-6 text-white" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden max-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              <div className="bg-[#1a2942]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
                <div className="p-4 space-y-2">
                  {mainNavItems.map((item) => {
                    const hasSubmenu = item.hasSubmenu && submenuItems[item.label]
                    const isSubmenuOpen = mobileSubmenuOpen === item.label

                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => {
                            if (hasSubmenu) {
                              setMobileSubmenuOpen(isSubmenuOpen ? null : item.label)
                            } else {
                              if (item.action) {
                                item.action()
                              } else if (item.path) {
                                router.push(item.path)
                              }
                              setIsMenuOpen(false)
                            }
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 rounded-xl transition-colors font-medium flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                          {hasSubmenu && (
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform ${
                                isSubmenuOpen ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>

                        {/* Mobile Submenu */}
                        {hasSubmenu && (
                          <AnimatePresence>
                            {isSubmenuOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pr-2 py-2 space-y-1">
                                  {submenuItems[item.label]?.map((subItem) => {
                                    const Icon = subItem.icon
                                    return (
                                      <button
                                        key={subItem.path}
                                        onClick={() => handleSubmenuClick(subItem.path)}
                                        className="w-full px-4 py-2 text-left text-white/80 hover:bg-cyan-500/10 rounded-lg transition-colors flex items-center gap-3 text-sm"
                                      >
                                        <Icon className="w-4 h-4 text-cyan-400" />
                                        <span>{subItem.label}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    )
                  })}

                  <div className="border-t border-cyan-500/20 pt-2">
                    <button
                      onClick={() => {
                        router.push('/settings')
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 rounded-xl transition-colors flex items-center gap-2 font-medium"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/10 rounded-xl transition-colors flex items-center gap-2 font-medium"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
