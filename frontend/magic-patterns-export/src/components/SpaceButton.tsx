import React from 'react';
import { motion } from 'framer-motion';
interface SpaceButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
export function SpaceButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}: SpaceButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 relative overflow-hidden';
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  const variantStyles = {
    primary:
    'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:shadow-xl',
    secondary:
    'bg-[#1a2942]/60 backdrop-blur-xl text-white border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-[#1a2942]/80',
    ghost:
    'bg-transparent text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500/50'
  };
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={
      !disabled ?
      {
        scale: 1.05,
        y: -2
      } :
      undefined
      }
      whileTap={
      !disabled ?
      {
        scale: 0.95
      } :
      undefined
      }>

      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>);

}