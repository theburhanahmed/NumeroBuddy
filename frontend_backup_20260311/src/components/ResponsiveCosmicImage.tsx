import React, { lazy } from 'react';
import { useIsMobile, useIsTablet } from '@/hooks/use-media-query';
interface ResponsiveCosmicImageProps {
  src: string;
  alt: string;
  mobileSrc?: string;
  tabletSrc?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}
/**
 * Responsive image component that serves appropriate sizes
 * Optimizes bandwidth on mobile devices
 */
export function ResponsiveCosmicImage({
  src,
  alt,
  mobileSrc,
  tabletSrc,
  className = '',
  loading = 'lazy'
}: ResponsiveCosmicImageProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const imageSrc = isMobile && mobileSrc ? mobileSrc : isTablet && tabletSrc ? tabletSrc : src;
  return <img src={imageSrc} alt={alt} loading={loading} className={className} style={{
    maxWidth: '100%',
    height: 'auto'
  }} />;
}