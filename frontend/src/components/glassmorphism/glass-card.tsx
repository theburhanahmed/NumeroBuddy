import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  onClick?: () => void;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  onClick,
  hover = true
}: GlassCardProps) {
  const variants = {
    default: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg',
    elevated: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 shadow-2xl',
    subtle: 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border border-white/10 dark:border-gray-700/20 shadow-md'
  };

  return (
    <motion.div 
      className={`rounded-3xl ${variants[variant]} ${hover ? 'transition-all duration-300' : ''} ${className}`}
      onClick={onClick}
      whileHover={hover ? {
        y: -4,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      } : {}}
      whileTap={onClick ? {
        scale: 0.98
      } : {}}
    >
      {children}
    </motion.div>
  );
}