import React, { useState } from 'react';
import { motion } from 'framer-motion';
interface CosmicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}
export function CosmicButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false
}: CosmicButtonProps) {
  const [ripples, setRipples] = useState<
    Array<{
      x: number;
      y: number;
      id: number;
    }>>(
    []);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    onClick?.();
  };
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[48px]'
  };
  const variantClasses = {
    primary:
    'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 border-none',
    secondary:
    'border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-xl text-white hover:bg-cyan-500/20',
    ghost: 'bg-transparent text-white hover:bg-white/10 border border-white/10'
  };
  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-full font-semibold
        transition-all duration-300 flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={
      disabled ?
      {} :
      {
        scale: 1.02
      }
      }
      whileTap={
      disabled ?
      {} :
      {
        scale: 0.98
      }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}>

      {/* Ripple Effect */}
      {ripples.map((ripple) =>
      <motion.span
        key={ripple.id}
        className="absolute rounded-full bg-white/30"
        style={{
          left: ripple.x,
          top: ripple.y,
          width: 0,
          height: 0
        }}
        initial={{
          width: 0,
          height: 0,
          opacity: 1
        }}
        animate={{
          width: 300,
          height: 300,
          opacity: 0,
          x: -150,
          y: -150
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut'
        }} />

      )}

      {/* Shimmer Effect */}
      {variant === 'primary' && !disabled &&
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{
          x: '-100%'
        }}
        animate={{
          x: '100%'
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'linear'
        }} />

      }

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </motion.button>);

}