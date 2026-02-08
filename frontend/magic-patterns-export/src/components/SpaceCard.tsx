import React, { Component } from 'react';
import { motion } from 'framer-motion';
interface SpaceCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'interactive';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
}
/**
 * Standardized Glassmorphism Card Component
 *
 * Variants:
 * - default: Standard glass effect, lighter border
 * - premium: Enhanced glass effect, stronger border/shadow
 * - interactive: Cursor pointer, enhanced hover states
 */
export function SpaceCard({
  children,
  variant = 'default',
  className = '',
  onClick,
  hover = true,
  role,
  tabIndex,
  'aria-label': ariaLabel
}: SpaceCardProps) {
  const baseStyles = 'rounded-3xl transition-all duration-300';
  // Standardized variant styles
  const variantStyles = {
    default:
    'bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 shadow-lg',
    premium:
    'bg-[#1a2942]/60 backdrop-blur-2xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10',
    interactive:
    'bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 shadow-lg cursor-pointer'
  };
  // Standardized hover styles
  const hoverStyles = hover ?
  'hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:shadow-2xl' :
  '';
  // Always use motion.div to avoid nested button issues
  const handleClick = onClick ?
  (e: React.MouseEvent) => {
    // Prevent event bubbling if this is a clickable card
    e.stopPropagation();
    onClick();
  } :
  undefined;
  const handleKeyDown = onClick ?
  (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  } :
  undefined;
  // Determine accessibility props
  const a11yProps = onClick ?
  {
    role: role || 'button',
    tabIndex: tabIndex ?? 0,
    'aria-label': ariaLabel,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    style: {
      cursor: 'pointer'
    }
  } :
  {
    role,
    tabIndex,
    'aria-label': ariaLabel
  };
  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      whileHover={
      onClick || hover ?
      {
        y: -4 // Standardized hover lift
      } :
      undefined
      }
      whileTap={
      onClick ?
      {
        scale: 0.98 // Standardized tap scale
      } :
      undefined
      }
      {...a11yProps}>

      {children}
    </motion.div>);

}