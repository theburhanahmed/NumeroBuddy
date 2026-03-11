'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Info } from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { cn } from '@/lib/utils';

interface FeatureHelpProps {
  title?: string;
  content: string | React.ReactNode;
  className?: string;
  variant?: 'icon' | 'button' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

export function FeatureHelp({
  title,
  content,
  className,
  variant = 'icon',
  size = 'md'
}: FeatureHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'inline') {
    return (
      <div className={cn("inline-flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800", className)}>
        <Info className={cn("text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0", sizeClasses[size])} />
        <div className="flex-1 text-sm text-blue-800 dark:text-blue-200">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Show help information"
        aria-expanded={isOpen}
      >
        {variant === 'button' ? (
          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <Info className={sizeClasses[size]} />
            {title || 'Learn More'}
          </span>
        ) : (
          <HelpCircle className={cn("text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200", sizeClasses[size])} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Help Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 w-80"
            >
              <GlassCard variant="elevated" className="p-4 shadow-2xl">
                <div className="flex items-start justify-between gap-3 mb-3">
                  {title && (
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {title}
                    </h4>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close help"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {typeof content === 'string' ? <p>{content}</p> : content}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

