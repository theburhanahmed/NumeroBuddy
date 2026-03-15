import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  HeartIcon,
  UserIcon,
  CalendarIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  Loader2Icon } from
'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { GlassBackground } from '../components/GlassBackground';
import { numerologyAPI } from '../lib/numerology-api';
export function CompatibilityCheckerGlass() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [person1, setPerson1] = useState({
    name: '',
    birthDate: ''
  });
  const [person2, setPerson2] = useState({
    name: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  React.useEffect(() => {
    numerologyAPI.getNumerologyProfile().then(profile => {
      if (profile) {
        setPerson1({
          name: profile.full_name || '',
          birthDate: profile.birth_date || ''
        });
      }
    }).catch(err => console.error("Failed to fetch user profile", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person2.name || !person2.birthDate) {
      setError("Please fill out the second person's details.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await numerologyAPI.checkCompatibility({
        partner_name: person2.name,
        partner_birth_date: person2.birthDate,
        relationship_type: 'romantic'
      });
      setResult(data);
      setStep('results');
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to check compatibility.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        
        <AppNavbar />

        <div className="max-w-5xl mx-auto px-8 py-8 pt-24">
          <AnimatePresence mode="wait">
            {step === 'input' ?
            <motion.div
              key="input"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -20
              }}>

                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                  initial={{
                    scale: 0
                  }}
                  animate={{
                    scale: 1
                  }}
                  transition={{
                    delay: 0.2,
                    type: 'spring'
                  }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">

                    <HeartIcon className="w-12 h-12" />
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                    Compatibility Checker
                  </h1>
                  <p className="text-xl text-white/70">
                    Discover the cosmic connection between two souls
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Person 1 */}
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
                    className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-serif text-white">
                          First Person
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">
                            Name
                          </label>
                          <input
                          type="text"
                          value={person1.name}
                          disabled
                          placeholder="Loading..."
                          className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white/70 placeholder:text-white/40 focus:outline-none transition-colors"
                          required />

                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">
                            Birth Date
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                              <CalendarIcon className="w-5 h-5" />
                            </div>
                            <input
                            type="date"
                            value={person1.birthDate}
                            disabled
                            className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white/70 focus:outline-none transition-colors"
                            required />

                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Person 2 */}
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
                    className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-serif text-white">
                          Second Person
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">
                            Name
                          </label>
                          <input
                          type="text"
                          value={person2.name}
                          onChange={(e) =>
                          setPerson2({
                            ...person2,
                            name: e.target.value
                          })
                          }
                          placeholder="Enter name"
                          className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                          required />

                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">
                            Birth Date
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                              <CalendarIcon className="w-5 h-5" />
                            </div>
                            <input
                            type="date"
                            value={person2.birthDate}
                            onChange={(e) =>
                            setPerson2({
                              ...person2,
                              birthDate: e.target.value
                            })
                            }
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                            required />

                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <motion.button
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
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    
                    {loading ? (
                       <><Loader2Icon className="w-5 h-5 animate-spin"/> Calculating Cosmic Bond...</>
                    ) : (
                       "Check Compatibility"
                    )}
                  </motion.button>
                </form>
              </motion.div> :

            <motion.div
              key="results"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -20
              }}>

                {/* Compatibility Summary (no mocked score) */}
                <div className="text-center mb-12">
                  <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center rounded-full border border-pink-400/40 bg-pink-500/10">
                    <HeartIcon className="w-16 h-16 text-pink-400" />
                  </div>

                  <h2 className="text-3xl font-serif text-white mb-2">
                    {person1.name || 'You'} & {person2.name || 'Partner'}
                  </h2>
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">
                    Compatibility Score: {result?.compatibility_score || 0}%
                  </p>
                  <p className="text-md text-pink-400/80 mt-2">
                    Explore how your numbers interact across key areas of your relationship.
                  </p>
                </div>

                {/* Life Path Numbers (conceptual preview only) */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
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
                    delay: 0.6
                  }}
                  className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 text-center">

                    <div className="text-sm text-white/60 mb-2">
                      {person1.name || 'Person 1'}
                    </div>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-600 mb-2">
                      ?
                    </div>
                    <div className="text-sm text-white/80">
                      Life Path Number
                    </div>
                  </motion.div>

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
                    delay: 0.6
                  }}
                  className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 text-center">

                    <div className="text-sm text-white/60 mb-2">
                      {person2.name || 'Person 2'}
                    </div>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-rose-600 mb-2">
                      ?
                    </div>
                    <div className="text-sm text-white/80">
                      Life Path Number
                    </div>
                  </motion.div>
                </div>

                {/* Strengths & Challenges */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
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
                  className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                        <CheckCircleIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif text-white">
                        Strengths
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {(result?.strengths || []).map((strength: string, i: number) =>
                    <li key={i} className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">{strength}</span>
                        </li>
                    )}
                      {(!result?.strengths || result.strengths.length === 0) && (
                        <p className="text-white/60 text-sm">No specific strengths listed.</p>
                      )}
                    </ul>
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
                    delay: 0.8
                  }}
                  className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                        <AlertCircleIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif text-white">
                        Areas to Nurture
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {(result?.challenges || []).map((challenge: string, i: number) =>
                    <li key={i} className="flex items-start gap-3">
                          <AlertCircleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">{challenge}</span>
                        </li>
                    )}
                      {(!result?.challenges || result.challenges.length === 0) && (
                        <p className="text-white/60 text-sm">No specific areas to nurture listed.</p>
                      )}
                    </ul>
                  </motion.div>
                </div>

                {/* Advice */}
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
                  delay: 1
                }}
                className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-rose-600/10 border border-pink-400/30 backdrop-blur-xl">

                  <h3 className="text-2xl font-serif text-white mb-4 text-center">
                    Cosmic Guidance
                  </h3>
                  <p className="text-white/80 leading-relaxed text-center max-w-3xl mx-auto">
                    {result?.advice || "No specific advice generated for this match. Remember to communicate openly and respect each other's boundaries."}
                  </p>
                </motion.div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}