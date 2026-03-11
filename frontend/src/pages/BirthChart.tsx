import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  CircleIcon,
  TriangleIcon,
  SquareIcon,
  InfoIcon,
  XIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { CosmicTooltip } from '../components/CosmicTooltip';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
// Lo Shu Grid configuration
const loShuGrid = [
{
  pos: 4,
  label: 'Wealth',
  color: 'green'
},
{
  pos: 9,
  label: 'Fame',
  color: 'pink'
},
{
  pos: 2,
  label: 'Relationships',
  color: 'rose'
},
{
  pos: 3,
  label: 'Family',
  color: 'blue'
},
{
  pos: 5,
  label: 'Health',
  color: 'yellow'
},
{
  pos: 7,
  label: 'Creativity',
  color: 'cyan'
},
{
  pos: 8,
  label: 'Knowledge',
  color: 'indigo'
},
{
  pos: 1,
  label: 'Career',
  color: 'purple'
},
{
  pos: 6,
  label: 'Helpers',
  color: 'slate'
}];

export function BirthChart() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  // Mock user data - normally would come from context/props
  const userNumbers = [1, 3, 5, 7, 9]; // Numbers present in user's chart
  const additionalNumbers = [
  {
    label: 'Expression Number',
    value: 11,
    description: 'How you express yourself to the world',
    icon: <StarIcon className="w-5 h-5" />
  },
  {
    label: 'Maturity Number',
    value: 4,
    description: 'Your ultimate life goal',
    icon: <CircleIcon className="w-5 h-5" />
  },
  {
    label: 'Balance Number',
    value: 6,
    description: 'How you handle challenges',
    icon: <TriangleIcon className="w-5 h-5" />
  },
  {
    label: 'Hidden Passion',
    value: 8,
    description: 'Your secret strength',
    icon: <SquareIcon className="w-5 h-5" />
  }];

  return (
    <CosmicPageLayout>
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
        transition={{
          duration: 0.5
        }}
        className="mb-8">

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <StarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Birth Chart
            </h1>
            <p className="text-white/70">
              Your complete numerological blueprint
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* 3D Lo Shu Grid Visualization */}
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
            delay: 0.1
          }}>

          <SpaceCard
            variant="premium"
            className="p-6 md:p-8 h-full flex flex-col">

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white">
                Lo Shu Grid
              </h2>
              <CosmicTooltip
                content="The ancient 3x3 magic square representing universal balance"
                icon />

            </div>

            <div className="flex-1 flex items-center justify-center py-8">
              <div className="grid grid-cols-3 gap-4 md:gap-6 perspective-1000">
                {loShuGrid.map((cell, index) => {
                  const isPresent = userNumbers.includes(cell.pos);
                  return (
                    <motion.div
                      key={cell.pos}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        rotateX: 30
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotateX: 0
                      }}
                      transition={{
                        delay: 0.2 + index * 0.05,
                        type: 'spring',
                        stiffness: 200
                      }}
                      whileHover={{
                        scale: 1.1,
                        z: 20,
                        rotateX: 10,
                        rotateY: 10
                      }}
                      onClick={() => setSelectedNumber(cell.pos)}
                      className="relative group cursor-pointer"
                      style={{
                        transformStyle: 'preserve-3d'
                      }}>

                      {isPresent ?
                      <div className="relative">
                          <CrystalNumerologyCube
                          number={cell.pos}
                          size="md"
                          color={cell.color as any} />

                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {cell.label}
                          </div>
                        </div> :

                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm transition-all group-hover:border-white/30 group-hover:bg-white/10">
                          <span className="text-2xl font-bold text-white/10 group-hover:text-white/30">
                            {cell.pos}
                          </span>
                        </div>
                      }
                    </motion.div>);

                })}
              </div>
            </div>

            <p className="text-center text-white/60 text-sm mt-6">
              Click any number to explore its meaning in your chart
            </p>
          </SpaceCard>
        </motion.div>

        {/* Selected Number Detail or General Info */}
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
            delay: 0.2
          }}>

          <AnimatePresence mode="wait">
            {selectedNumber ?
            <motion.div
              key="detail"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              className="h-full">

                <SpaceCard
                variant="default"
                className="p-6 md:p-8 h-full relative">

                  <button
                  onClick={() => setSelectedNumber(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors">

                    <XIcon className="w-5 h-5 text-white/70" />
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                      <span className="text-4xl font-bold text-cyan-400">
                        {selectedNumber}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                        {loShuGrid.find((n) => n.pos === selectedNumber)?.label}{' '}
                        Plane
                      </h3>
                      <p className="text-white/60">
                        {userNumbers.includes(selectedNumber) ?
                      'Present in your chart' :
                      'Missing from your chart'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-white/80 leading-relaxed">
                    <p>
                      The number {selectedNumber} in the Lo Shu grid represents{' '}
                      {loShuGrid.
                    find((n) => n.pos === selectedNumber)?.
                    label.toLowerCase()}
                      .
                      {userNumbers.includes(selectedNumber) ?
                    ' Its presence in your chart indicates a natural strength in this area. You have innate abilities that can be developed further.' :
                    ' Its absence suggests a karmic lesson or area for growth. You may need to consciously work on developing these qualities in this lifetime.'}
                    </p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-6">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <InfoIcon className="w-4 h-4 text-cyan-400" />
                        Key Attributes
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/70">
                        <li>Attribute 1 related to {selectedNumber}</li>
                        <li>Attribute 2 related to {selectedNumber}</li>
                        <li>Attribute 3 related to {selectedNumber}</li>
                      </ul>
                    </div>
                  </div>
                </SpaceCard>
              </motion.div> :

            <motion.div
              key="general"
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: 20
              }}
              className="h-full">

                <SpaceCard
                variant="default"
                className="p-6 md:p-8 h-full flex flex-col justify-center">

                  <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
                    Chart Interpretation
                  </h3>
                  <div className="space-y-4 text-white/80 leading-relaxed">
                    <p>
                      Your birth chart reveals a powerful combination of
                      spiritual insight (Life Path 7) and creative expression
                      (Destiny 3). This unique blend makes you a natural teacher
                      and communicator of deep wisdom.
                    </p>
                    <p>
                      The Soul Urge 5 adds a desire for freedom and adventure,
                      while Personality 9 shows your humanitarian nature.
                      Together, these numbers create a complex and fascinating
                      cosmic blueprint.
                    </p>
                    <p>
                      Your Expression Number 11 is a Master Number, indicating
                      heightened intuition and spiritual awareness. You are here
                      to inspire and enlighten others through your unique gifts.
                    </p>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <TouchOptimizedButton
                    variant="secondary"
                    onClick={() => setSelectedNumber(7)}>

                      Explore Your Numbers
                    </TouchOptimizedButton>
                  </div>
                </SpaceCard>
              </motion.div>
            }
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Additional Numbers */}
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
          delay: 0.3
        }}
        className="mb-8">

        <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white mb-6">
          Additional Influences
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {additionalNumbers.map((item, index) =>
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
              delay: 0.4 + index * 0.1
            }}>

              <SpaceCard variant="default" className="p-6 md:p-8 h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-cyan-500/20">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-lg">
                        {item.label}
                      </h3>
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CosmicPageLayout>);

}