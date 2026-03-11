import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  StarIcon,
  TrendingUpIcon,
  HeartIcon,
  SparklesIcon,
  DownloadIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CosmicTooltip } from '../components/CosmicTooltip';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { CosmicSkeletonLoader } from '../components/CosmicSkeletonLoader';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { numerologyAPI } from '../lib/numerology-api';
export function NumerologyReport() {
  const [numbersRef, numbersVisible] = useIntersectionObserver({
    threshold: 0.1
  });
  const [birthChart, setBirthChart] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await numerologyAPI.getBirthChart();
        setBirthChart(data);
      } catch (err: any) {
        setError(err?.message || 'Unable to load report.');
        setBirthChart(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const coreNumbers = useMemo(() => {
    const p = birthChart?.profile;
    return [
      { number: p?.life_path_number, label: 'Life Path', color: 'cyan' as const, description: "Your life's journey and purpose" },
      { number: p?.destiny_number, label: 'Destiny', color: 'purple' as const, description: 'Your ultimate potential' },
      { number: p?.soul_urge_number, label: 'Soul Urge', color: 'blue' as const, description: 'Your inner desires' },
      { number: p?.personality_number, label: 'Personality', color: 'pink' as const, description: 'How others see you' },
    ].filter((x) => typeof x.number === 'number');
  }, [birthChart]);

  const insights = useMemo(() => {
    const interp = birthChart?.interpretations || {};
    const getText = (i: any) => i?.description || i?.summary || i?.meaning || 'No interpretation available.';
    return [
      { icon: <TrendingUpIcon className="w-6 h-6" />, title: 'Life Path Analysis', content: getText(interp.life_path_number), color: 'from-cyan-400 to-blue-600' },
      { icon: <StarIcon className="w-6 h-6" />, title: 'Destiny Insights', content: getText(interp.destiny_number), color: 'from-purple-500 to-pink-600' },
      { icon: <HeartIcon className="w-6 h-6" />, title: 'Soul Purpose', content: getText(interp.soul_urge_number), color: 'from-pink-500 to-rose-600' },
      { icon: <SparklesIcon className="w-6 h-6" />, title: 'Personal Expression', content: getText(interp.personality_number), color: 'from-green-500 to-emerald-600' },
    ];
  }, [birthChart]);

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
        className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-2">
              Your Numerology Report
            </h1>
            <p className="text-white/70">
              Complete cosmic blueprint of your life path
            </p>
          </div>
          <TouchOptimizedButton
            variant="secondary"
            icon={<DownloadIcon className="w-5 h-5" />}
            ariaLabel="Download report">

            Download PDF
          </TouchOptimizedButton>
        </div>
      </motion.div>

      {/* Core Numbers */}
      <motion.div
        ref={numbersRef}
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white">
              Your Core Numbers
            </h2>
            <CosmicTooltip
              content="These numbers form your cosmic blueprint"
              icon />

          </div>

          {numbersVisible ?
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading && (
                <div className="col-span-2 lg:col-span-4 text-white/60">Loading...</div>
              )}
              {error && !isLoading && (
                <div className="col-span-2 lg:col-span-4 text-red-400">{error}</div>
              )}
              {coreNumbers.map((item, index) =>
            <Suspense
              key={item.label}
              fallback={<CosmicSkeletonLoader variant="cube" />}>

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
                  delay: 0.2 + index * 0.1
                }}
                className="flex flex-col items-center text-center">

                    <CrystalNumerologyCube
                  number={item.number ?? 0}
                  size="md"
                  color={item.color} />

                    <p className="text-lg font-semibold text-white mt-4 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm text-white/60">{item.description}</p>
                  </motion.div>
                </Suspense>
            )}
            </div> :

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <CosmicSkeletonLoader variant="cube" count={4} />
            </div>
          }
        </SpaceCard>
      </motion.div>

      {/* Detailed Insights */}
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
        }}
        className="mb-8">

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Detailed Insights
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) =>
          <motion.div
            key={insight.title}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3 + index * 0.1
            }}
            whileHover={{
              y: -4
            }}>

              <SpaceCard variant="default" className="p-6 h-full">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center text-white mb-4 shadow-lg`}>

                  {insight.icon}
                </div>
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                  {insight.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {insight.content}
                </p>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Compatibility Section */}
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
          delay: 0.4
        }}>

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            Compatibility Insights
          </h2>
          <p className="text-white/70 mb-6">
            Run a real compatibility check to see results based on your profile and a partner’s details.
          </p>
          <TouchOptimizedButton
            variant="primary"
            ariaLabel="Check compatibility"
            onClick={() => (window.location.href = '/compatibility')}
          >
            Check Compatibility
          </TouchOptimizedButton>
        </SpaceCard>
      </motion.div>
    </CosmicPageLayout>);

}