'use client';

import { ReactNode } from 'react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { motion } from 'framer-motion';
import { FeatureHelp } from '@/components/ui/feature-help';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  color?: string;
  helpText?: string;
  tooltip?: string;
  description?: string;
}

export function DashboardWidget({
  title,
  icon,
  children,
  className = '',
  onClick,
  color = 'from-blue-500 to-purple-600',
  helpText,
  tooltip,
  description
}: DashboardWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { y: -2 } : {}}
      className={className}
    >
      <GlassCard
        variant="default"
        className={cn("p-6 h-full", onClick && "cursor-pointer")}
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && (
              <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-r flex items-center justify-center text-white flex-shrink-0", color)}>
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          {helpText && (
            <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                      aria-label="Feature information"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm leading-relaxed">{helpText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        {tooltip && !helpText && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              {tooltip}
            </p>
          </div>
        )}
        <div className="text-gray-600 dark:text-gray-400">
          {children}
        </div>
      </GlassCard>
    </motion.div>
  );
}

