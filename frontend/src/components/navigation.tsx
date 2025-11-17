/**
 * Navigation component with links to all main pages.
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { 
  Home, 
  User, 
  Calendar, 
  Sparkles, 
  LogOut, 
  MessageCircle,
  Heart,
  TrendingUp,
  Users,
  FileText,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassButton } from '@/components/glassmorphism/glass-button';

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/birth-chart', label: 'Birth Chart', icon: Sparkles },
    { href: '/daily-reading', label: 'Daily Reading', icon: Calendar },
    { href: '/life-path', label: 'Life Path', icon: User },
    { href: '/compatibility', label: 'Compatibility', icon: Heart },
    { href: '/remedies', label: 'Remedies', icon: TrendingUp },
    { href: '/numerology-report', label: 'Report', icon: FileText },
    { href: '/consultations', label: 'Consultations', icon: Users },
    { href: '/ai-chat', label: 'AI Chat', icon: MessageCircle },
  ];

  return (
    <nav className="fixed top-0 w-full backdrop-blur-2xl bg-white/30 dark:bg-gray-900/30 z-40 border-b border-white/20 dark:border-gray-700/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NumerAI
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-md"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <MoonIcon className="w-5 h-5 text-gray-700" /> : 
                <SunIcon className="w-5 h-5 text-yellow-400" />
              }
            </motion.button>
            
            <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline max-w-[150px] truncate">
              {user.email || user.phone}
            </span>
            
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={logout}
              icon={<LogOut className="w-4 h-4" />}
              className="gap-2"
            >
              Logout
            </GlassButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}