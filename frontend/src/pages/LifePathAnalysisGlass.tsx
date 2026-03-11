import React, { useEffect, useState } from 'react';
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
import { GlassBackground } from '../components/GlassBackground';
import { numerologyAPI, NumerologyProfile } from '../lib/numerology-api';
import { LoadingSpinner } from '../components/LoadingSpinner';
export function LifePathAnalysisGlass() {
  const navigate = useNavigate();
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await numerologyAPI.getNumerologyProfile();
        setProfile(data);
        setLifePathNumber(data?.life_path_number ?? null);
      } catch (e: any) {
        setError(e?.message || 'Unable to load numerology profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);
  const lifePathData: {
    [key: number]: any;
  } = {
    7: {
      title: 'The Seeker',
      tagline: 'Your path is one of spiritual wisdom and inner truth',
      description:
      'As a Life Path 7, you are a natural seeker of truth and wisdom. Your analytical mind and spiritual depth set you apart, making you a profound thinker who questions the mysteries of life.',
      color: 'from-purple-500 to-indigo-600',
      strengths: [
      'Deep analytical thinking and problem-solving abilities',
      'Strong intuition and spiritual awareness',
      'Natural researcher with love for knowledge',
      'Ability to see beyond surface appearances',
      'Independent and self-sufficient nature'],

      challenges: [
      'Tendency towards isolation and overthinking',
      'Difficulty trusting others and opening up emotionally',
      'Can be overly critical or perfectionist',
      'May struggle with practical, mundane tasks',
      'Risk of becoming too detached from reality'],

      career: [
      'Research scientist or academic',
      'Spiritual teacher or counselor',
      'Psychologist or therapist',
      'Data analyst or programmer',
      'Writer or philosopher',
      'Detective or investigator'],

      relationships:
      'You need a partner who respects your need for solitude and intellectual depth. Look for someone who can engage in meaningful conversations and understands your spiritual nature.',
      famous: [
      'Elon Musk',
      'Stephen Hawking',
      'Princess Diana',
      'Leonardo DiCaprio']

    }
  };
  const data = lifePathNumber != null ? lifePathData[lifePathNumber] : null;

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
            <button className="px-4 py-2 rounded-full border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all flex items-center gap-2">
              <ShareIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </motion.nav>

        {/* Main Content */}
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
            <p className="text-xl text-cyan-400 mb-6">{data.tagline}</p>
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
                {data.relationships}
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