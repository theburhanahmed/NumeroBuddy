'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOutIcon, XIcon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { mobileMoreLinks } from '@/config/navigation';

export interface MobileMoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMoreSheet({ open, onOpenChange }: MobileMoreSheetProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigate = (path: string) => {
    router.push(path);
    onOpenChange(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] md:hidden rounded-t-3xl bg-[#1a2942]/98 backdrop-blur-xl border border-t border-cyan-500/20 shadow-2xl overflow-hidden"
            style={{ overscrollBehavior: 'contain' }}
            role="dialog"
            aria-modal="true"
            aria-label="More menu"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20">
              <h2 className="text-lg font-semibold text-white">More</h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-cyan-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2942]"
                aria-label="Close more menu"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1" style={{ overscrollBehavior: 'contain' }}>
              {mobileMoreLinks.map(({ label, path, icon: Icon }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => handleNavigate(path)}
                  className={cn(
                    'w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left text-white hover:bg-cyan-500/10 transition-colors min-h-[44px]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-inset'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left text-white/90 hover:bg-red-500/10 transition-colors min-h-[44px]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-inset'
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <LogOutIcon className="w-5 h-5 text-red-400" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
