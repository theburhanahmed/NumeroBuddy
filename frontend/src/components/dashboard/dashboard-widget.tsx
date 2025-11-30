'use client';

import { ReactNode } from 'react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { motion } from 'framer-motion';

interface DashboardWidgetProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  color?: string;
}

export function DashboardWidget({
  title,
  icon,
  children,
  className = '',
  onClick,
  color = 'from-blue-500 to-purple-600'
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
        className={`p-6 h-full ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white`}>
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {children}
        </div>
      </GlassCard>
    </motion.div>
  );
}

