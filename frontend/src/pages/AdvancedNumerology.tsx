import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, TrendingUpIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
export function AdvancedNumerology() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const tools = [
  {
    id: 'karmic-debt',
    title: 'Karmic Debt Calculator',
    description:
    'Discover karmic lessons from past lives through numbers 13, 14, 16, and 19.',
    icon: '🔮',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'pinnacle',
    title: 'Pinnacle Numbers',
    description:
    'Calculate the four major turning points in your life journey.',
    icon: '⛰️',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'challenge',
    title: 'Challenge Numbers',
    description:
    "Identify obstacles and lessons you'll face in different life periods.",
    icon: '🎯',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'maturity',
    title: 'Maturity Number',
    description: 'Reveal your true purpose that emerges in your later years.',
    icon: '🌟',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'hidden-passion',
    title: 'Hidden Passion Number',
    description: 'Uncover your deepest desires and natural talents.',
    icon: '💎',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'subconscious',
    title: 'Subconscious Self',
    description: 'Understand how you react to challenges and emergencies.',
    icon: '🧠',
    color: 'from-green-500 to-emerald-600'
  }];

  return (
    <CosmicPageLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Advanced Numerology
            </h1>
            <p className="text-white/70">
              Deep dive into specialized calculations
            </p>
          </div>
        </div>
      </motion.div>

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
        }}
        className="mb-8">

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            Unlock Deeper Insights
          </h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Go beyond basic numerology with these advanced tools. Each
            calculation reveals hidden aspects of your cosmic blueprint and
            provides profound insights into your life's journey.
          </p>
          <div className="flex items-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <TrendingUpIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-purple-400 font-semibold">
              Premium Feature
            </span>
          </div>
        </SpaceCard>
      </motion.div>

      <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
        Advanced Tools
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) =>
        <motion.div
          key={tool.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2 + index * 0.1
          }}
          whileHover={{
            y: -4
          }}>

            <SpaceCard
            variant="default"
            className="p-6 h-full flex flex-col cursor-pointer">

              <div className="text-5xl mb-4">{tool.icon}</div>

              <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                {tool.title}
              </h3>

              <p className="text-white/70 mb-6 flex-1 leading-relaxed">
                {tool.description}
              </p>

              <TouchOptimizedButton
              variant="primary"
              size="md"
              onClick={() => setSelectedTool(tool.id)}
              className="w-full"
              ariaLabel={`Calculate ${tool.title}`}>

                Calculate
              </TouchOptimizedButton>
            </SpaceCard>
          </motion.div>
        )}
      </div>

      {selectedTool &&
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setSelectedTool(null)}>

          <SpaceCard
          variant="premium"
          className="p-8 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}>

            <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6 text-center">
              {tools.find((t) => t.id === selectedTool)?.title}
            </h3>
            <div className="flex justify-center mb-6">
              <CrystalNumerologyCube number={7} size="lg" color="purple" />
            </div>
            <p className="text-center text-white/70 mb-6">
              This advanced calculation requires your complete numerology
              profile. Upgrade to Premium to unlock this feature.
            </p>
            <div className="flex gap-4">
              <TouchOptimizedButton
              variant="secondary"
              size="lg"
              onClick={() => setSelectedTool(null)}
              className="flex-1"
              ariaLabel="Close">

                Close
              </TouchOptimizedButton>
              <TouchOptimizedButton
              variant="primary"
              size="lg"
              className="flex-1"
              ariaLabel="Upgrade to Premium">

                Upgrade to Premium
              </TouchOptimizedButton>
            </div>
          </SpaceCard>
        </motion.div>
      }
    </CosmicPageLayout>);

}