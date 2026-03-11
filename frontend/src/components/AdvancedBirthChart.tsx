import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DownloadIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCwIcon,
  InfoIcon,
  XIcon } from
'lucide-react';
import { SpaceCard } from './SpaceCard';
import { TouchOptimizedButton } from './TouchOptimizedButton';
import { numerologyAPI } from '../lib/numerology-api';
interface NumberDetail {
  number: number;
  name: string;
  meaning: string;
  keywords: string[];
  color: string;
}
export function AdvancedBirthChart() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [birthChart, setBirthChart] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const bc = await numerologyAPI.getBirthChart();
        setBirthChart(bc);
      } catch (err: any) {
        setError(err?.message || 'Unable to load birth chart.');
        setBirthChart(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const numberDetails = useMemo(() => {
    const p = birthChart?.profile;
    const interp = birthChart?.interpretations || {};
    const mk = (num: number | undefined, name: string, color: string, interpKey: string): NumberDetail | null => {
      if (typeof num !== 'number') return null;
      const i = interp?.[interpKey];
      const meaning = i?.title || i?.summary || i?.meaning || i?.description || 'No interpretation available.';
      const keywords = Array.isArray(i?.keywords) ? i.keywords : [];
      return { number: num, name, meaning, keywords, color };
    };

    const list = [
      mk(p?.life_path_number, 'Life Path', 'from-cyan-400 to-blue-600', 'life_path_number'),
      mk(p?.destiny_number, 'Destiny', 'from-purple-500 to-indigo-600', 'destiny_number'),
      mk(p?.soul_urge_number, 'Soul Urge', 'from-blue-500 to-cyan-600', 'soul_urge_number'),
      mk(p?.personality_number, 'Personality', 'from-pink-500 to-rose-600', 'personality_number'),
      mk(p?.attitude_number, 'Attitude', 'from-amber-500 to-orange-600', 'attitude_number'),
      mk(p?.maturity_number, 'Maturity', 'from-green-500 to-emerald-600', 'maturity_number'),
    ].filter(Boolean) as NumberDetail[];

    const map: Record<number, NumberDetail> = {};
    list.forEach((d) => {
      map[d.number] = d;
    });
    return map;
  }, [birthChart]);

  const numbers = useMemo(() => Object.keys(numberDetails).map((k) => Number(k)), [numberDetails]);

  const handleDownload = () => {};
  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.6));
  const handleRotate = () => setRotation((rotation + 60) % 360);
  return (
    <>
      <SpaceCard variant="premium" className="p-6 md:p-8">
        {/* Header with Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white mb-2">
              Your Birth Chart
            </h2>
            <p className="text-white/60 text-sm">
              Click any number to explore its meaning
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-lg bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center text-white/60 hover:text-white hover:border-cyan-400 transition-colors"
              aria-label="Zoom out">

              <ZoomOutIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-lg bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center text-white/60 hover:text-white hover:border-cyan-400 transition-colors"
              aria-label="Zoom in">

              <ZoomInIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleRotate}
              className="w-10 h-10 rounded-lg bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center text-white/60 hover:text-white hover:border-cyan-400 transition-colors"
              aria-label="Rotate">

              <RotateCwIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
              aria-label="Download chart">

              <DownloadIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {isLoading && <div className="text-white/60 mb-6">Loading chart…</div>}
        {error && !isLoading && <div className="text-red-400 mb-6">{error}</div>}

        {/* Interactive Chart */}
        <div className="relative aspect-square max-w-2xl mx-auto mb-8">
          <motion.div
            animate={{
              rotate: rotation,
              scale: zoom
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut'
            }}
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d'
            }}>

            {/* Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 backdrop-blur-xl border-2 border-cyan-500/30 flex items-center justify-center">
                <span className="text-white/60 text-sm font-semibold">YOU</span>
              </div>
            </div>

            {/* Number Orbs in Circle */}
            {numbers.map((num, index) => {
              const angle = index * 360 / numbers.length;
              const radius = 45; // percentage
              const x = 50 + radius * Math.cos(angle * Math.PI / 180);
              const y = 50 + radius * Math.sin(angle * Math.PI / 180);
              const detail = numberDetails[num];
              return (
                <motion.button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  initial={{
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  transition={{
                    delay: index * 0.1
                  }}
                  whileHover={{
                    scale: 1.1
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`
                  }}>

                  {/* Orb */}
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${detail.color} shadow-2xl flex items-center justify-center border-2 border-white/20 group-hover:border-white/40 transition-all`}>

                    <span className="text-3xl font-bold text-white">{num}</span>
                  </div>

                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs font-semibold text-white/60 group-hover:text-white transition-colors">
                      {detail.name}
                    </span>
                  </div>

                  {/* Connection Line to Center */}
                  <svg
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      overflow: 'visible'
                    }}>

                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${50 - x + 50}%`}
                      y2={`${50 - y + 50}%`}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-cyan-500/20 group-hover:text-cyan-400/40 transition-colors"
                      strokeDasharray="4 4" />

                  </svg>
                </motion.button>);

            })}
          </motion.div>

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {numbers.slice(0, 6).map((num, index) => {
            const detail = numberDetails[num];
            return (
              <motion.button
                key={num}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.5 + index * 0.05
                }}
                onClick={() => setSelectedNumber(num)}
                className="p-4 rounded-xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-left group">

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${detail.color} flex items-center justify-center text-white font-bold shadow-lg`}>

                    {num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {detail.name}
                    </div>
                    <div className="text-xs text-white/60">
                      Click for details
                    </div>
                  </div>
                </div>
              </motion.button>);

          })}
        </div>
      </SpaceCard>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNumber &&
        <>
            {/* Backdrop */}
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setSelectedNumber(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />


            {/* Modal */}
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4">

              <SpaceCard variant="premium" className="p-8 relative">
                {/* Close Button */}
                <button
                onClick={() => setSelectedNumber(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#1a2942]/60 flex items-center justify-center text-white/60 hover:text-white transition-colors">

                  <XIcon className="w-5 h-5" />
                </button>

                {/* Number Display */}
                <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${numberDetails[selectedNumber].color} flex items-center justify-center text-white mx-auto mb-6 shadow-2xl`}>

                  <span className="text-5xl font-bold">{selectedNumber}</span>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-['Playfair_Display'] font-bold text-white text-center mb-2">
                  {numberDetails[selectedNumber].name}
                </h3>

                {/* Meaning */}
                <p className="text-white/70 text-center mb-6">
                  {numberDetails[selectedNumber].meaning}
                </p>

                {/* Keywords */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <InfoIcon className="w-4 h-4" />
                    Key Traits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(numberDetails[selectedNumber].keywords || []).length === 0 ? (
                      <span className="text-white/60 text-sm">No keywords available.</span>
                    ) : (
                      numberDetails[selectedNumber].keywords.map((keyword) =>
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm">

                        {keyword}
                      </span>
                      )
                    )}
                  </div>
                </div>

                {/* CTA */}
                <TouchOptimizedButton
                variant="primary"
                size="lg"
                onClick={() => setSelectedNumber(null)}
                className="w-full"
                ariaLabel="Close details">

                  Got It
                </TouchOptimizedButton>
              </SpaceCard>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}