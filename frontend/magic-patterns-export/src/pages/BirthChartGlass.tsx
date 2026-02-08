import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  DownloadIcon,
  InfoIcon,
  ZoomInIcon,
  ZoomOutIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { LoadingSpinner } from '../components/LoadingSpinner';
export function BirthChartGlass() {
  const navigate = useNavigate();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const coreNumbers = [
  {
    number: 7,
    label: 'Life Path',
    color: 'purple' as const,
    description: "Your life's purpose and journey"
  },
  {
    number: 3,
    label: 'Destiny',
    color: 'blue' as const,
    description: 'Your ultimate life goal'
  },
  {
    number: 5,
    label: 'Soul Urge',
    color: 'cyan' as const,
    description: 'Your inner desires and motivations'
  },
  {
    number: 9,
    label: 'Personality',
    color: 'pink' as const,
    description: 'How others perceive you'
  },
  {
    number: 11,
    label: 'Expression',
    color: 'green' as const,
    description: 'Your natural talents and abilities'
  },
  {
    number: 4,
    label: 'Maturity',
    color: 'amber' as const,
    description: 'Your later life direction'
  }];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        {/* Top Navigation */}
        <motion.nav
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/dashboard')}>

            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              NUMEROBUDDY
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="p-1 hover:bg-cyan-500/20 rounded transition-colors">

                <ZoomOutIcon className="w-4 h-4 text-white" />
              </button>
              <span className="text-white text-sm px-2">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className="p-1 hover:bg-cyan-500/20 rounded transition-colors">

                <ZoomInIcon className="w-4 h-4 text-white" />
              </button>
            </div>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </motion.nav>

        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-center mb-12">

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Your Cosmic Birth Chart
            </h1>
            <p className="text-xl text-white/70">
              Interactive visualization of your complete numerological blueprint
            </p>
          </motion.div>

          {/* Birth Chart Visualization */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.2
            }}
            className="mb-12">

            <div className="relative p-12 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
              {/* Center Circle */}
              <div
                className="relative mx-auto"
                style={{
                  width: '600px',
                  height: '600px',
                  maxWidth: '100%',
                  transform: `scale(${zoom})`,
                  transition: 'transform 0.3s'
                }}>

                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />

                {/* Middle Ring */}
                <div className="absolute inset-12 rounded-full border border-cyan-500/20" />

                {/* Inner Ring */}
                <div className="absolute inset-24 rounded-full border border-cyan-500/10" />

                {/* Core Numbers Positioned in Circle */}
                {coreNumbers.map((item, index) => {
                  const angle = index * 360 / coreNumbers.length - 90;
                  const radius = 220;
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  return (
                    <Suspense key={item.label} fallback={<LoadingSpinner />}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1
                        }}
                        transition={{
                          delay: 0.4 + index * 0.1
                        }}
                        className="absolute cursor-pointer"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                        }}
                        onClick={() =>
                        setSelectedNumber(
                          selectedNumber === index ? null : index
                        )
                        }>

                        <div className="relative">
                          <CrystalNumerologyCube
                            number={item.number}
                            size="md"
                            color={item.color} />

                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <div className="text-xs text-white/80 font-semibold">
                              {item.label}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Suspense>);

                })}

                {/* Center Info */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-white/60 mb-2">
                      Your Numbers
                    </div>
                    <div className="text-2xl font-serif text-white">
                      Birth Chart
                    </div>
                  </div>
                </div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {coreNumbers.map((_, index) => {
                    const angle1 = index * 360 / coreNumbers.length - 90;
                    const angle2 = (index + 1) * 360 / coreNumbers.length - 90;
                    const radius = 220;
                    const x1 = 300 + Math.cos(angle1 * Math.PI / 180) * radius;
                    const y1 = 300 + Math.sin(angle1 * Math.PI / 180) * radius;
                    const x2 = 300 + Math.cos(angle2 * Math.PI / 180) * radius;
                    const y2 = 300 + Math.sin(angle2 * Math.PI / 180) * radius;
                    return (
                      <line
                        key={index}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(6, 182, 212, 0.1)"
                        strokeWidth="1" />);


                  })}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Number Details */}
          {selectedNumber !== null &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 backdrop-blur-xl mb-12">

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <Suspense fallback={<LoadingSpinner />}>
                    <CrystalNumerologyCube
                    number={coreNumbers[selectedNumber].number}
                    size="lg"
                    color={coreNumbers[selectedNumber].color} />

                  </Suspense>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-white mb-2">
                    {coreNumbers[selectedNumber].label} Number:{' '}
                    {coreNumbers[selectedNumber].number}
                  </h3>
                  <p className="text-white/70 mb-4">
                    {coreNumbers[selectedNumber].description}
                  </p>
                  <button
                  onClick={() => navigate('/life-path')}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all">

                    View Detailed Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          }

          {/* Numbers Grid */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.6
            }}>

            <h2 className="text-2xl font-serif text-white mb-6">
              All Your Numbers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreNumbers.map((item, index) =>
              <motion.div
                key={item.label}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.7 + index * 0.05
                }}
                className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
                onClick={() => setSelectedNumber(index)}>

                  <div className="flex items-center gap-4 mb-4">
                    <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>

                      {item.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.label}</h3>
                      <p className="text-xs text-white/60">
                        Number {item.number}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">{item.description}</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.9
            }}
            className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-start gap-4">

            <InfoIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-2">
                How to Use Your Birth Chart
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Click on any number in the circular chart to learn more about
                its significance in your life. Each number represents a
                different aspect of your personality and destiny. Use the zoom
                controls to adjust the view, and download your chart for future
                reference.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}