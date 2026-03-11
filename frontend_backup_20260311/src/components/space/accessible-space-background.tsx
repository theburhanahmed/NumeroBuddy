'use client'

import { GlassBackground } from '@/components/glass/glass-background'

/**
 * @deprecated Use GlassBackground from @/components/glass/glass-background instead.
 * This component is kept for backward compatibility.
 */
export function AccessibleSpaceBackground() {
  return <GlassBackground starCount={80} />
}
