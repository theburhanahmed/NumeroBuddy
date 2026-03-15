import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  TrendingUpIcon,
  HeartIcon,
  BriefcaseIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  DownloadIcon,
  ShareIcon } from
'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { GlassBackground } from '../components/GlassBackground';
import { numerologyAPI, NumerologyProfile } from '../lib/numerology-api';
import { LoadingSpinner } from '../components/LoadingSpinner';
export function LifePathAnalysisGlass() {
  const navigate = useNavigate();
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [p, a] = await Promise.all([
          numerologyAPI.getNumerologyProfile(),
          numerologyAPI.getLifePathAnalysis(),
        ]);
        setProfile(p);
        setLifePathNumber(p?.life_path_number ?? null);
        setAnalysis(a);
      } catch (e: any) {
        setError(e?.message || 'Unable to load numerology profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);
  const interpretation = analysis?.interpretation;
  const data = useMemo(() => {
    if (!lifePathNumber) return null;
    const text =
      interpretation?.description ||
      interpretation?.summary ||
      interpretation?.meaning ||
      '';
    return {
      title: interpretation?.title || 'Life Path',
      tagline: interpretation?.tagline || '',
      description: text || 'No interpretation available.',
      color: 'from-purple-500 to-indigo-600',
      strengths: Array.isArray(interpretation?.strengths) ? interpretation.strengths : [],
      challenges: Array.isArray(interpretation?.challenges) ? interpretation.challenges : [],
      career: Array.isArray(interpretation?.careers) ? interpretation.careers : [],
      relationships: interpretation?.relationships || '',
      famous: Array.isArray(interpretation?.famous_people) ? interpretation.famous_people : [],
      pinnacle_cycles: Array.isArray(analysis?.pinnacle_cycles) ? analysis.pinnacle_cycles : [],
    };
  }, [analysis, interpretation, lifePathNumber]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#0a1628] overflow-hidden flex items-center justify-center">
        <GlassBackground starCount={60} />
        <div className="relative z-10">
          <LoadingSpinner size="lg" message="Loading your numerology profile..." variant="cosmic" />
        </div>
      </div>
    );
  }

  if (error || !data || lifePathNumber == null) {
    return (
      <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
        <GlassBackground starCount={60} />
        <div className="relative z-10 max-w-2xl mx-auto px-8 py-24 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Life Path Analysis
          </h1>
          <p className="text-white/70 mb-6">
            {error ||
              'We could not load your numerology profile. Please complete your profile or try again later.'}
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        
        <AppNavbar />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8 pt-24">
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
            className="text-center mb-16">

            <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200
              }}
              className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${data.color} flex items-center justify-center text-white mx-auto mb-8 shadow-2xl`}>

              <span className="text-6xl font-bold">{lifePathNumber}</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Life Path {lifePathNumber}: {data.title}
            </h1>
            {data.tagline && (
              <p className="text-xl text-cyan-400 mb-6">{data.tagline}</p>
            )}
            <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
              {data.description}
            </p>
          </motion.div>

          {/* Strengths & Challenges */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Strengths */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.3
              }}
              className="relative">

              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl blur-xl" />
              <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-serif text-white">
                    Your Strengths
                  </h2>
                </div>

                <ul className="space-y-4">
                  {data.strengths.length === 0 && (
                    <li className="text-white/70">No strengths data available.</li>
                  )}
                  {data.strengths.map((strength: string, index: number) =>
                  <motion.li
                    key={index}
                    initial={{
                      opacity: 0,
                      x: -10
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: 0.4 + index * 0.05
                    }}
                    className="flex items-start gap-3">

                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-white/80 leading-relaxed">
                        {strength}
                      </span>
                    </motion.li>
                  )}
                </ul>
              </div>
            </motion.div>

            {/* Challenges */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.3
              }}
              className="relative">

              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl blur-xl" />
              <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                    <AlertCircleIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-serif text-white">
                    Growth Areas
                  </h2>
                </div>

                <ul className="space-y-4">
                  {data.challenges.length === 0 && (
                    <li className="text-white/70">No challenges data available.</li>
                  )}
                  {data.challenges.map((challenge: string, index: number) =>
                  <motion.li
                    key={index}
                    initial={{
                      opacity: 0,
                      x: 10
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: 0.4 + index * 0.05
                    }}
                    className="flex items-start gap-3">

                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircleIcon className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-white/80 leading-relaxed">
                        {challenge}
                      </span>
                    </motion.li>
                  )}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Career & Relationships */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Career */}
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
                delay: 0.5
              }}
              className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                  <BriefcaseIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-serif text-white">
                  Ideal Careers
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {data.career.length === 0 && (
                  <div className="text-white/70 col-span-2">No career suggestions available.</div>
                )}
                {data.career.map((career: string, index: number) =>
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.9
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  transition={{
                    delay: 0.6 + index * 0.05
                  }}
                  className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-center">

                    <span className="text-sm text-white/80">{career}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Relationships */}
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
                delay: 0.5
              }}
              className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                  <HeartIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-serif text-white">
                  Relationships
                </h2>
              </div>

              <p className="text-white/80 leading-relaxed mb-6">
                {data.relationships || 'No relationship guidance available.'}
              </p>

              <button
                onClick={() => navigate('/compatibility')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all">

                Check Compatibility
              </button>
            </motion.div>
          </div>

          {/* Famous People */}
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
              delay: 0.7
            }}
            className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-400/30 backdrop-blur-xl text-center">

            <h2 className="text-2xl font-serif text-white mb-4">
              Famous Life Path {lifePathNumber}s
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {data.famous.length === 0 && (
                <div className="text-white/70">No examples available.</div>
              )}
              {data.famous.map((person: string, index: number) =>
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: 0.8 + index * 0.1
                }}
                className="px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 text-white">

                  {person}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Pinnacle Cycles */}
          {data.pinnacle_cycles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-16 p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20"
            >
              <h2 className="text-2xl font-serif text-white mb-6">Pinnacle Cycles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.pinnacle_cycles.map((c: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0a1628]/40 border border-cyan-500/10">
                    <div className="text-white font-semibold mb-1">
                      Cycle {c.cycle_number ?? idx + 1}{' '}
                      {typeof c.start_age === 'number' && typeof c.end_age === 'number'
                        ? `(${c.start_age}–${c.end_age})`
                        : ''}
                    </div>
                    <div className="text-white/70 text-sm">{c.description || ''}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
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
            className="text-center mt-12">

            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 rounded-full border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all">

              ← Back to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    </div>);

}