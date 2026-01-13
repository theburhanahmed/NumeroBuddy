import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';
interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}
/**
 * Touch-optimized button with proper touch targets (min 44x44px)
 * Includes haptic feedback simulation and enhanced touch states
 */
export function TouchOptimizedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel
}: TouchOptimizedButtonProps) {
  const isMobile = useIsMobile();
  // Ensure minimum touch target size on mobile
  const sizeClasses = {
    sm: isMobile ? 'px-5 py-3 text-sm min-h-[44px]' : 'px-4 py-2 text-sm',
    md: isMobile ? 'px-7 py-4 text-base min-h-[48px]' : 'px-6 py-3 text-base',
    lg: isMobile ? 'px-9 py-5 text-lg min-h-[52px]' : 'px-8 py-4 text-lg'
  };
  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/30',
    secondary: 'bg-[#1a2942]/60 backdrop-blur-xl text-white border border-cyan-500/30',
    ghost: 'bg-transparent text-cyan-400 border border-cyan-500/30'
  };
  const handleClick = () => {
    // Simulate haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.();
  };
  return <motion.button type={type} onClick={handleClick} disabled={disabled} aria-label={ariaLabel} className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl 
        transition-all duration-300 relative overflow-hidden
        ${sizeClasses[size]} 
        ${variantStyles[variant]} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        ${className}
      `} whileHover={!disabled && !isMobile ? {
    scale: 1.05,
    y: -2
  } : undefined} whileTap={!disabled ? {
    scale: 0.95
  } : undefined}
  // Enhanced touch feedback
  style={{
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  }}>
      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>;
}