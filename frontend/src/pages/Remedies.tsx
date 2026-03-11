import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GemIcon,
  SparklesIcon,
  HeartIcon,
  LeafIcon,
  SunIcon,
  MoonIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { CosmicTooltip } from '../components/CosmicTooltip';
import { numerologyAPI } from '../lib/numerology-api';
export function Remedies() {
  const [remedies, setRemedies] = useState<any[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [p, r] = await Promise.all([
          numerologyAPI.getNumerologyProfile(),
          numerologyAPI.getRemedies(),
        ]);
        setProfile(p);
        setRemedies(Array.isArray(r) ? r : []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load remedies.');
        setRemedies([]);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const remedyCategories = useMemo(() => {
    const groups: Record<string, any[]> = {};
    remedies.forEach((r) => {
      const key = r.remedy_type || 'other';
      groups[key] = groups[key] || [];
      groups[key].push(r);
    });

    const mapType = (t: string) => {
      switch (t) {
        case 'gemstone':
          return {
            icon: <GemIcon className="w-6 h-6" />,
            title: 'Crystals & Gemstones',
            description: 'Personalized gemstone suggestions from your profile',
            color: 'from-purple-500 to-indigo-600',
          };
        case 'color':
          return {
            icon: <SparklesIcon className="w-6 h-6" />,
            title: 'Colors & Vibrations',
            description: 'Color remedies aligned to your numerology',
            color: 'from-cyan-400 to-blue-600',
          };
        case 'ritual':
          return {
            icon: <LeafIcon className="w-6 h-6" />,
            title: 'Rituals & Practices',
            description: 'Daily practices recommended for your journey',
            color: 'from-green-500 to-emerald-600',
          };
        default:
          return {
            icon: <HeartIcon className="w-6 h-6" />,
            title: 'Other Remedies',
            description: 'Additional personalized suggestions',
            color: 'from-pink-500 to-rose-600',
          };
      }
    };

    return Object.entries(groups).map(([type, items]) => ({
      type,
      ...mapType(type),
      remedies: items,
    }));
  }, [remedies]);

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

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <GemIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Cosmic Remedies
            </h1>
            <p className="text-white/70">Align your energy with the universe</p>
          </div>
        </div>
      </motion.div>

      {/* Introduction */}
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
          {isLoading && (
            <p className="text-lg text-white/60 leading-relaxed">Loading your remedies...</p>
          )}
          {error && !isLoading && (
            <p className="text-lg text-red-400 leading-relaxed">{error}</p>
          )}
          {!isLoading && !error && (
            <p className="text-lg text-white/80 leading-relaxed">
              {profile?.life_path_number
                ? `These remedies are personalized to your Life Path number ${profile.life_path_number}.`
                : 'These remedies are personalized to your numerology profile.'}
            </p>
          )}
        </SpaceCard>
      </motion.div>

      {/* Remedy Categories */}
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
          Remedy Categories
        </h2>
        <div className="space-y-6">
          {!isLoading && !error && remedyCategories.length === 0 && (
            <SpaceCard variant="default" className="p-6">
              <p className="text-white/70">No remedies available yet.</p>
            </SpaceCard>
          )}
          {remedyCategories.map((category, index) =>
          <motion.div
            key={category.title}
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
            }}>

              <SpaceCard variant="default" className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>

                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">
                        {category.title}
                      </h3>
                      <CosmicTooltip content={category.description} icon />
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {category.remedies.map((remedy: any) =>
                <div
                  key={remedy.id || remedy.title}
                  className="p-4 bg-[#0a1628]/40 rounded-xl border border-cyan-500/10">

                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">
                          {remedy.title}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-cyan-500/20 rounded-full text-cyan-400">
                          {remedy.remedy_type}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{remedy.description}</p>
                      {remedy.recommendation && (
                        <p className="text-xs text-white/60 mt-2">{remedy.recommendation}</p>
                      )}
                    </div>
                )}
                </div>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>

    </CosmicPageLayout>);

}