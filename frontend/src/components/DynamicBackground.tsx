import React from 'react';
import { useBackground } from '../contexts/BackgroundContext';
import { ParallaxStarfield } from './ParallaxStarfield';
import { AnimatedShaderBackground } from './ui/animated-shader-background';
import { GlassBackground } from './GlassBackground';
export function DynamicBackground() {
  const { backgroundType } = useBackground();
  switch (backgroundType) {
    case 'parallax':
      return <ParallaxStarfield density="medium" />;
    case 'shader':
      return <AnimatedShaderBackground />;
    case 'glass':
      return <GlassBackground starCount={60} />;
    case 'minimal':
      return (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628]" />);

    default:
      return <ParallaxStarfield density="medium" />;
  }
}