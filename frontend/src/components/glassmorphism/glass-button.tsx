import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  type = 'button'
}: GlassButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 text-gray-900 dark:text-white',
    ghost: 'bg-transparent hover:bg-white/10 dark:hover:bg-gray-800/10 text-gray-900 dark:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={!disabled ? {
        scale: 1.02
      } : {}}
      whileTap={!disabled ? {
        scale: 0.98
      } : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}