'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  MessageSquareIcon, 
  BookOpenIcon, 
  SettingsIcon, 
  LogOutIcon, 
  MoonIcon, 
  SunIcon, 
  StarIcon, 
  ChevronDownIcon, 
  LayoutDashboardIcon, 
  CalendarIcon, 
  UsersIcon, 
  ShieldIcon, 
  LineChartIcon, 
  CompassIcon, 
  MenuIcon, 
  XIcon, 
  HeartIcon, 
  TrendingUpIcon, 
  GridIcon, 
  VideoIcon, 
  MessageCircleIcon, 
  TrophyIcon, 
  GraduationCapIcon, 
  BarChart3Icon, 
  AlertCircleIcon, 
  TypeIcon, 
  BriefcaseIcon, 
  PhoneIcon, 
  Users2Icon 
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useAIChat } from '@/contexts/ai-chat-context';
import { useAuth } from '@/contexts/auth-context';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { toast } from 'sonner';

export function AppNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { openChat } = useAIChat();
  const { logout } = useAuth();
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    {
      icon: <LayoutDashboardIcon className="w-4 h-4" />,
      label: 'Dashboard',
      path: '/dashboard',
      action: () => router.push('/dashboard')
    },
    {
      icon: <MessageSquareIcon className="w-4 h-4" />,
      label: 'AI Numerologist',
      path: '/ai-chat',
      action: () => {
        openChat();
      }
    },
    {
      icon: <BookOpenIcon className="w-4 h-4" />,
      label: 'My Reports',
      path: '/reports',
      action: () => router.push('/reports')
    },
    {
      icon: <Users2Icon className="w-4 h-4" />,
      label: 'MEUS',
      path: '/meus/dashboard',
      action: () => router.push('/meus/dashboard')
    }
  ];

  const toolsMenuSections = [
    {
      title: 'Your Numerology',
      items: [
        { icon: <CompassIcon className="w-5 h-5" />, label: 'Your Life Path', description: 'Discover your life purpose and journey', path: '/life-path' },
        { icon: <CalendarIcon className="w-5 h-5" />, label: 'Your Daily Reading', description: "Today's personalized numerology insights", path: '/daily-reading' },
        { icon: <LineChartIcon className="w-5 h-5" />, label: 'Your Birth Chart', description: 'Complete visual numerology analysis', path: '/birth-chart' },
        { icon: <GridIcon className="w-5 h-5" />, label: 'Your Lo Shu Grid', description: 'Chinese numerology magic square', path: '/lo-shu-grid' },
        { icon: <TrendingUpIcon className="w-5 h-5" />, label: 'Pinnacles & Challenges', description: 'Understand your life cycles', path: '/advanced-numerology' },
        { icon: <BookOpenIcon className="w-5 h-5" />, label: 'My Reports', description: 'Generate and view your reports', path: '/reports' },
      ],
    },
    {
      title: 'Tools',
      description: 'Analyze names and numbers (uses your data by default)',
      items: [
        { icon: <TypeIcon className="w-5 h-5" />, label: 'Name Numerology', description: 'Your name analysis or analyze another', path: '/name-numerology' },
        { icon: <PhoneIcon className="w-5 h-5" />, label: 'Phone Numerology', description: 'Your phone energy or analyze another', path: '/phone-numerology' },
        { icon: <BriefcaseIcon className="w-5 h-5" />, label: 'Business Name', description: 'Numerology for your business', path: '/business-name-numerology' },
        { icon: <BarChart3Icon className="w-5 h-5" />, label: 'Numerobuddy Engines', description: 'Rule-based engines with conflict resolution', path: '/numerobuddy-engines' },
      ],
    },
    {
      title: 'Relationships',
      description: 'Compare you with partners, friends, family',
      items: [
        { icon: <HeartIcon className="w-5 h-5" />, label: 'Compatibility (You vs Partner)', description: 'Analyze relationships and partnerships', path: '/compatibility' },
        { icon: <Users2Icon className="w-5 h-5" />, label: 'My People', description: 'Manage people in your life', path: '/people' },
      ],
    },
    {
      title: 'Forecasts & Timing',
      items: [
        { icon: <TrendingUpIcon className="w-5 h-5" />, label: 'Forecasts', description: 'Weekly, monthly, yearly predictions', path: '/weekly-report' },
        { icon: <CalendarIcon className="w-5 h-5" />, label: 'Personal Year', description: 'Your current year energy', path: '/yearly-report' },
        { icon: <StarIcon className="w-5 h-5" />, label: 'Auspicious Dates', description: 'Find perfect timing for events', path: '/auspicious-dates' },
      ],
    },
    {
      title: 'More',
      items: [
        { icon: <AlertCircleIcon className="w-5 h-5" />, label: 'Karmic Lessons', description: 'Identify missing numbers and lessons', path: '/advanced-numerology' },
        { icon: <CompassIcon className="w-5 h-5" />, label: 'Decision Engine', description: 'Numerology guidance for decisions', path: '/decisions' },
        { icon: <ShieldIcon className="w-5 h-5" />, label: 'Remedies', description: 'Personalized guidance', path: '/remedies' },
        { icon: <VideoIcon className="w-5 h-5" />, label: 'Consultations', description: 'Book expert numerologists', path: '/consultations' },
        { icon: <MessageCircleIcon className="w-5 h-5" />, label: 'Community', description: 'Forum discussions', path: '/forum' },
        { icon: <TrophyIcon className="w-5 h-5" />, label: 'Rewards', description: 'Achievements and rewards', path: '/rewards' },
        { icon: <GraduationCapIcon className="w-5 h-5" />, label: 'Learning Hub', description: 'Educational content', path: '/content-hub' },
        { icon: <BarChart3Icon className="w-5 h-5" />, label: 'Your Analytics', description: 'Track your progress', path: '/user-analytics' },
      ],
    },
  ];

  const toolsMenuItems = toolsMenuSections.flatMap(s => s.items);

  const isActivePath = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-2xl bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700/30"
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 md:gap-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NumerAI
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-2xl">
            {mainNavItems.map(item => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActivePath(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </motion.button>
            ))}

            {/* Tools Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StarIcon className="w-4 h-4" />
                <span className="font-medium text-sm">More Tools</span>
                <motion.div
                  animate={{ rotate: toolsMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {toolsMenuOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0"
                      onClick={() => setToolsMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 w-80 max-h-[80vh] overflow-y-auto backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl"
                    >
                      <div className="p-2">
                        {toolsMenuSections.map((section, sectionIndex) => (
                          <div key={section.title} className={sectionIndex > 0 ? 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-700' : ''}>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-1.5 uppercase tracking-wider">
                              {section.title}
                            </p>
                            {section.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 mb-2">
                                {section.description}
                              </p>
                            )}
                            {section.items.map((item, index) => (
                              <motion.button
                                key={item.label}
                                onClick={() => {
                                  router.push(item.path);
                                  setToolsMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 transition-all text-left group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (sectionIndex * 5 + index) * 0.02 }}
                                whileHover={{ x: 4 }}
                              >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {item.description}
                                  </p>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <motion.button
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              ) : (
                <SunIcon className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              )}
            </motion.button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={() => router.push('/profile')}
                className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Settings"
              >
                <SettingsIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Sign out"
              >
                <LogOutIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/20 dark:border-gray-700/30 mt-3 pt-3 overflow-hidden"
            >
              <div className="space-y-1 mb-3">
                {mainNavItems.map(item => (
                  <motion.button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 transition-all text-left"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mb-3 max-h-96 overflow-y-auto">
                {toolsMenuSections.map((section) => (
                  <div key={section.title} className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 mb-1.5 uppercase tracking-wider">
                      {section.title}
                    </p>
                    {section.items.map(item => (
                      <motion.button
                        key={item.label}
                        onClick={() => {
                          router.push(item.path);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 transition-all text-left"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  icon={<SettingsIcon className="w-4 h-4" />}
                  onClick={() => {
                    router.push('/profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  Settings
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  icon={<LogOutIcon className="w-4 h-4" />}
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </GlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

