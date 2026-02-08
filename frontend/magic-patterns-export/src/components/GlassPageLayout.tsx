import React from 'react';
import { GlassBackground } from './GlassBackground';
import { GlassNav } from './GlassNav';
interface GlassPageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showPlanet?: boolean;
  showMountains?: boolean;
  showSilhouettes?: boolean;
  starCount?: number;
}
export function GlassPageLayout({
  children,
  showNav = true,
  showPlanet = false,
  showMountains = false,
  showSilhouettes = false,
  starCount = 80
}: GlassPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground
        starCount={starCount}
        showPlanet={showPlanet}
        showMountains={showMountains}
        showSilhouettes={showSilhouettes} />


      <div className="relative z-10">
        {showNav && <GlassNav />}
        {children}
      </div>
    </div>);

}