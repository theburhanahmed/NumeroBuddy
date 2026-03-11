import React from 'react';
interface GlassBackgroundProps {
  starCount?: number;
  showPlanet?: boolean;
  showMountains?: boolean;
  showSilhouettes?: boolean;
}
export function GlassBackground({
  starCount = 50,
  showPlanet = false,
  showMountains = false,
  showSilhouettes = false
}: GlassBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Stars - Optimized with will-change */}
      <div className="absolute inset-0">
        {[...Array(starCount)].map((_, i) =>
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse will-change-opacity"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.7 + 0.3
          }} />

        )}
      </div>

      {/* Ambient Glows - Consolidated into single layer for performance */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/15 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-600/15 blur-3xl" />
      </div>

      {/* Optional Planet */}
      {showPlanet &&
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/25 to-cyan-600/15 blur-3xl" />
      }

      {/* Optional Mountains */}
      {showMountains &&
      <div className="absolute bottom-0 left-0 right-0 h-64">
          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <defs>
              <linearGradient
              id="mountainGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%">

                <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0a1628" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
            fill="url(#mountainGradient)"
            d="M0,160 L48,176 C96,192 192,224 288,224 C384,224 480,192 576,181.3 C672,171 768,181 864,197.3 C960,213 1056,235 1152,224 C1248,213 1344,171 1392,149.3 L1440,128 L1440,320 L0,320 Z" />

          </svg>
        </div>
      }

      {/* Optional Silhouettes */}
      {showSilhouettes &&
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-8">
          <div
          className="w-12 h-32 bg-gradient-to-t from-[#0a1628] to-transparent"
          style={{
            clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)'
          }} />

          <div
          className="w-12 h-28 bg-gradient-to-t from-[#0a1628] to-transparent"
          style={{
            clipPath: 'polygon(35% 0%, 65% 0%, 75% 100%, 25% 100%)'
          }} />

        </div>
      }
    </div>);

}