import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  DownloadIcon,
  PrinterIcon,
  ShareIcon,
  ChevronDownIcon,
  ChevronUpIcon } from
'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { GlassBackground } from '../components/GlassBackground';
import { numerologyAPI } from '../lib/numerology-api';
import { useAuth } from '../contexts/AuthContext';
export function NumerologyReportGlass() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'life-path'
  );
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

  const reportSections = useMemo(() => {
    const profile = birthChart?.profile;
    const interpretations = birthChart?.interpretations || {};

    const getText = (interp: any, fallback: string) => {
      if (!interp) return fallback;
      if (typeof interp === 'string') return interp;
      return (
        interp?.summary ||
        interp?.meaning ||
        interp?.description ||
        fallback
      );
    };

    return [
      {
        id: 'life-path',
        title: 'Life Path Number',
        number: profile?.life_path_number,
        color: 'from-purple-500 to-indigo-600',
        summary: getText(interpretations.life_path_number, 'No interpretation available.'),
        content: getText(interpretations.life_path_number, 'No interpretation available.'),
      },
      {
        id: 'destiny',
        title: 'Destiny Number',
        number: profile?.destiny_number,
        color: 'from-blue-500 to-cyan-600',
        summary: getText(interpretations.destiny_number, 'No interpretation available.'),
        content: getText(interpretations.destiny_number, 'No interpretation available.'),
      },
      {
        id: 'soul-urge',
        title: 'Soul Urge Number',
        number: profile?.soul_urge_number,
        color: 'from-cyan-500 to-blue-600',
        summary: getText(interpretations.soul_urge_number, 'No interpretation available.'),
        content: getText(interpretations.soul_urge_number, 'No interpretation available.'),
      },
      {
        id: 'personality',
        title: 'Personality Number',
        number: profile?.personality_number,
        color: 'from-pink-500 to-rose-600',
        summary: getText(interpretations.personality_number, 'No interpretation available.'),
        content: getText(interpretations.personality_number, 'No interpretation available.'),
      },
    ];
  }, [birthChart]);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        
        <AppNavbar />

        <div className="max-w-4xl mx-auto px-8 py-8 pt-24">
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
              Complete Numerology Report
            </h1>
            <p className="text-xl text-white/70 mb-2">
              {user?.full_name || 'Your profile'}
            </p>
            <p className="text-white/60">
              {user?.date_of_birth ? `Born: ${user.date_of_birth}` : ''}
            </p>
          </motion.div>

          {/* Summary Card */}
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
            className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 backdrop-blur-xl mb-12">

            <h2 className="text-2xl font-serif text-white mb-6 text-center">
              Your Core Numbers
            </h2>
            {isLoading && (
              <div className="text-center text-white/60">Loading report...</div>
            )}
            {error && !isLoading && (
              <div className="text-center text-red-400">{error}</div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {reportSections.map((section, index) =>
              <motion.div
                key={section.id}
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
                className="text-center">

                  <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg`}>

                    {section.number ?? '–'}
                  </div>
                  <div className="text-sm text-white font-semibold">
                    {section.title.split(' ')[0]}
                  </div>
                  <div className="text-xs text-white/60">
                    {section.title.split(' ').slice(1).join(' ')}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {reportSections.map((section, index) =>
            <motion.div
              key={section.id}
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
              className="rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 overflow-hidden">

                {/* Section Header */}
                <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-cyan-500/5 transition-colors">

                  <div className="flex items-center gap-4">
                    <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>

                      {section.number}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-serif text-white">
                        {section.title}
                      </h3>
                      <p className="text-sm text-white/60">{section.summary}</p>
                    </div>
                  </div>
                  {expandedSection === section.id ?
                <ChevronUpIcon className="w-6 h-6 text-white/60" /> :

                <ChevronDownIcon className="w-6 h-6 text-white/60" />
                }
                </button>

                {/* Section Content */}
                {expandedSection === section.id &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                exit={{
                  opacity: 0,
                  height: 0
                }}
                className="px-6 pb-6">

                    <div className="pt-4 border-t border-cyan-500/10">
                      <p className="text-white/80 leading-relaxed mb-6">
                        {section.content}
                      </p>
                      <button
                    onClick={() => navigate('/life-path')}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm hover:shadow-lg hover:shadow-cyan-500/30 transition-all">

                        View Detailed Analysis
                      </button>
                    </div>
                  </motion.div>
              }
              </motion.div>
            )}
          </div>

          {/* Additional Insights */}
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
            className="mt-12 p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

            <h2 className="text-2xl font-serif text-white mb-6">
              Key Insights
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Insights are generated from your real numerology interpretations. Expand the sections above to read the full details for each core number.
            </p>
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
              delay: 0.8
            }}
            className="mt-12 text-center space-y-4">

            <p className="text-white/70">
              Want to dive deeper into your numbers?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/birth-chart')}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">

                View Birth Chart
              </button>
              <button
                onClick={() => navigate('/compatibility')}
                className="px-8 py-3 rounded-full border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all">

                Check Compatibility
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}