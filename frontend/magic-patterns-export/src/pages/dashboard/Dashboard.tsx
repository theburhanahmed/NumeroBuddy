import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  MessageSquareIcon,
  HeartIcon,
  BookOpenIcon,
  SparklesIcon,
  StarIcon,
  TrendingUpIcon } from
'lucide-react';
import { AppNavbar } from '../../components/AppNavbar';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { AnimatedNumber } from '../../components/AnimatedNumber';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FloatingOrbs } from '../../components/FloatingOrbs';
import { toast } from 'sonner';
export function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Welcome back, Sarah!', {
        description: 'Your daily reading is ready'
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your dashboard..." />
      </div>);

  }
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-500">
      <FloatingOrbs />
      <AppNavbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Profile Hero Card with Liquid Glass */}
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

              <GlassCard
                variant="liquid-premium"
                className="p-6 md:p-8 bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white overflow-hidden relative">

                <div className="liquid-glass-content">
                  <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <motion.div
                          className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30"
                          whileHover={{
                            scale: 1.1,
                            rotate: 5
                          }}>

                          <UserIcon className="w-8 h-8 md:w-10 md:h-10" />
                        </motion.div>
                        <div>
                          <motion.h2
                            className="text-2xl md:text-3xl font-bold mb-1"
                            initial={{
                              opacity: 0,
                              x: -20
                            }}
                            animate={{
                              opacity: 1,
                              x: 0
                            }}
                            transition={{
                              delay: 0.2
                            }}>

                            Welcome, Sarah
                          </motion.h2>
                          <p className="text-white/80 text-sm md:text-base">
                            Born: March 15, 1990
                          </p>
                        </div>
                      </div>
                      <GlassButton variant="liquid" size="sm">
                        Edit Profile
                      </GlassButton>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <AnimatedNumber
                        number="7"
                        label="Life Path"
                        delay={0.3} />

                      <AnimatedNumber number="3" label="Destiny" delay={0.4} />
                      <AnimatedNumber
                        number="5"
                        label="Soul Urge"
                        delay={0.5} />

                      <AnimatedNumber
                        number="9"
                        label="Personality"
                        delay={0.6} />

                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Today's Reading with Liquid Glass */}
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

              <GlassCard variant="liquid-premium" className="p-6 md:p-8">
                <div className="liquid-glass-content">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Today's Reading
                    </h3>
                    <motion.div
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full border border-blue-500/30"
                      animate={{
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}>

                      <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </motion.div>
                  </div>
                  <GlassCard
                    variant="liquid"
                    className="p-5 md:p-6 mb-4 md:mb-6">

                    <div className="liquid-glass-content">
                      <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <motion.div
                          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-xl"
                          animate={{
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}>

                          5
                        </motion.div>
                        <div>
                          <p className="font-semibold text-base md:text-lg text-gray-900 dark:text-white">
                            Personal Day Number
                          </p>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            Change and Adventure
                          </p>
                        </div>
                      </div>
                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        Today brings opportunities for change and new
                        experiences. Embrace spontaneity and be open to
                        unexpected opportunities.
                      </p>
                    </div>
                  </GlassCard>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <GlassCard variant="liquid" className="p-4">
                      <div className="liquid-glass-content">
                        <p className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          Lucky Number
                        </p>
                        <motion.p
                          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                          animate={{
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity
                          }}>

                          8
                        </motion.p>
                      </div>
                    </GlassCard>
                    <GlassCard variant="liquid" className="p-4">
                      <div className="liquid-glass-content">
                        <p className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          Lucky Color
                        </p>
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg"
                            animate={{
                              rotate: 360
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'linear'
                            }}>
                          </motion.div>
                          <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            Gold
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions with Liquid Glass */}
          <div className="space-y-4 md:space-y-6">
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
              }}>

              <GlassCard variant="liquid-premium" className="p-5 md:p-6">
                <div className="liquid-glass-content">
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <ActionCard
                      icon={<MessageSquareIcon className="w-5 h-5" />}
                      label="Ask AI Numerologist"
                      description="Get instant answers"
                      onClick={() => navigate('/chat')}
                      delay={0.4} />

                    <ActionCard
                      icon={<SparklesIcon className="w-5 h-5" />}
                      label="Get Remedies"
                      description="Personalized guidance"
                      onClick={() => navigate('/remedies')}
                      delay={0.5} />

                    <ActionCard
                      icon={<HeartIcon className="w-5 h-5" />}
                      label="Check Compatibility"
                      description="Relationship insights"
                      onClick={() => navigate('/compatibility')}
                      delay={0.6} />

                    <ActionCard
                      icon={<BookOpenIcon className="w-5 h-5" />}
                      label="View Full Report"
                      description="Complete analysis"
                      onClick={() => navigate('/report')}
                      delay={0.7} />

                  </div>
                </div>
              </GlassCard>
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
                delay: 0.4
              }}>

              <GlassCard
                variant="liquid"
                className="p-5 md:p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20">

                <div className="liquid-glass-content">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUpIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                      This Week's Insights
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Your numbers suggest a strong focus on personal growth and
                    relationships this week.
                  </p>
                  <GlassButton variant="liquid" size="sm" className="w-full">
                    Learn More
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>);

}
function ActionCard({ icon, label, description, onClick, delay }: any) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full"
      initial={{
        opacity: 0,
        x: -20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      transition={{
        delay
      }}
      whileHover={{
        scale: 1.02,
        x: 4
      }}
      whileTap={{
        scale: 0.98
      }}>

      <GlassCard
        variant="liquid"
        className="p-4 text-left flex items-center gap-3 group">

        <div className="liquid-glass-content w-full flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {label}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {description}
            </p>
          </div>
          <StarIcon className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </GlassCard>
    </motion.button>);

}