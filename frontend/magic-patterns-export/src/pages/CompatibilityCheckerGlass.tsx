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
  RefreshCwIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('results');
  };
  const compatibilityScore = 85; // Mock data
  const lifePathNumbers = {
    person1: 7,
    person2: 3
  };
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

          {step === 'results' &&
          <button
            onClick={() => setStep('input')}
            className="px-4 py-2 rounded-full border border-cyan-400/30 bg-transparent text-white hover:bg-cyan-500/10 transition-all flex items-center gap-2">

              <RefreshCwIcon className="w-4 h-4" />
              New Check
            </button>
          }
        </motion.nav>

        <div className="max-w-5xl mx-auto px-8 py-12">
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
                          onChange={(e) =>
                          setPerson1({
                            ...person1,
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
                            value={person1.birthDate}
                            onChange={(e) =>
                            setPerson1({
                              ...person1,
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
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all text-lg">

                    Check Compatibility
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

                {/* Compatibility Score */}
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
                  className="relative w-48 h-48 mx-auto mb-8">

                    <svg className="w-full h-full -rotate-90">
                      <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="rgba(6, 182, 212, 0.2)"
                      strokeWidth="12"
                      fill="none" />

                      <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{
                        strokeDasharray: '0 552'
                      }}
                      animate={{
                        strokeDasharray: `${compatibilityScore / 100 * 552} 552`
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5
                      }} />

                      <defs>
                        <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">

                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      transition={{
                        delay: 1
                      }}
                      className="text-6xl font-bold text-white">

                        {compatibilityScore}%
                      </motion.div>
                      <div className="text-sm text-white/60">Compatibility</div>
                    </div>
                  </motion.div>

                  <h2 className="text-3xl font-serif text-white mb-2">
                    {person1.name || 'Person 1'} & {person2.name || 'Person 2'}
                  </h2>
                  <p className="text-xl text-pink-400">
                    Excellent Match - Strong Cosmic Connection
                  </p>
                </div>

                {/* Life Path Numbers */}
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
                      {lifePathNumbers.person1}
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
                      {lifePathNumbers.person2}
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
                      {[
                    'Deep intellectual connection and stimulating conversations',
                    'Complementary energies that balance each other',
                    'Shared spiritual interests and growth mindset',
                    'Strong creative collaboration potential'].
                    map((strength, i) =>
                    <li key={i} className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">{strength}</span>
                        </li>
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
                      {[
                    'Need for personal space vs. togetherness balance',
                    'Different communication styles require patience',
                    'Practical matters may need extra attention',
                    'Emotional expression differences to navigate'].
                    map((challenge, i) =>
                    <li key={i} className="flex items-start gap-3">
                          <AlertCircleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">{challenge}</span>
                        </li>
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
                    This is a highly compatible pairing with strong potential
                    for a deep, meaningful connection. The key to success lies
                    in honoring each other's unique qualities while building on
                    your shared spiritual and intellectual interests. Regular
                    communication and mutual respect for personal space will
                    help this relationship flourish.
                  </p>
                </motion.div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}