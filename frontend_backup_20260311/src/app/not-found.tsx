'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { GlassBackground } from '@/components/glass/glass-background'
import { SpaceCard } from '@/components/space/space-card'
import { SpaceButton } from '@/components/space/space-button'
import { HomeIcon } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a1628] relative overflow-hidden">
      <GlassBackground starCount={80} />

      <SpaceCard variant="premium" className="p-12 max-w-lg text-center relative z-10">
        <div className="mb-8">
          <div className="text-8xl font-bold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4">
            404
          </div>
          <h1 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-white/70 mb-8 leading-relaxed">
            The cosmic path you're seeking doesn't exist in this dimension.
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SpaceButton
            variant="primary"
            onClick={() => router.push('/')}
            icon={<HomeIcon className="w-5 h-5" />}
          >
            Go Home
          </SpaceButton>
          <SpaceButton
            variant="secondary"
            onClick={() => router.back()}
          >
            Go Back
          </SpaceButton>
        </div>
      </SpaceCard>
    </div>
  )
}

