import React from 'react';
import { SpaceBackground } from './SpaceBackground';
import { useReducedMotion } from '../hooks/useReducedMotion';
/**
 * Accessible wrapper for SpaceBackground that respects motion preferences
 */
export function AccessibleSpaceBackground() {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    // Static background for users who prefer reduced motion
    return <div className="fixed inset-0 z-0" style={{
      background: 'linear-gradient(to bottom, #0B0F19 0%, #1a2942 100%)'
    }} aria-hidden="true" />;
  }
  return <SpaceBackground />;
}