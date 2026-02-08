import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  HeartIcon,
  TargetIcon,
  UsersIcon,
  TrendingUpIcon } from
'lucide-react';
import { GlassPageLayout } from '../components/GlassPageLayout';
export function AboutUsGlass() {
  const navigate = useNavigate();
  const values = [
  {
    icon: <HeartIcon className="w-6 h-6" />,
    title: 'Authenticity',
    description:
    'We honor the ancient wisdom of numerology while embracing modern technology.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: <UsersIcon className="w-6 h-6" />,
    title: 'Community',
    description:
    'Building a supportive space for seekers to connect and grow together.',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: 'Empowerment',
    description:
    'Providing tools and insights that help you make confident life decisions.',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    title: 'Growth',
    description:
    'Continuously evolving our platform to serve your spiritual journey better.',
    color: 'from-green-500 to-emerald-600'
  }];

  const milestones = [
  {
    year: '2020',
    event: 'Founded with a vision to democratize numerology'
  },
  {
    year: '2021',
    event: 'Launched AI-powered numerology chat'
  },
  {
    year: '2022',
    event: 'Reached 10,000 active users'
  },
  {
    year: '2023',
    event: 'Introduced interactive birth charts'
  },
  {
    year: '2024',
    event: 'Serving 100,000+ seekers worldwide'
  }];

  return (
    <GlassPageLayout showNav={true} starCount={80}>
      <div className="max-w-7xl mx-auto px-8 py-20">
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
          className="text-center mb-20">

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
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              💫 Our Story
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Bridging Ancient Wisdom
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              With Modern Technology
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            NumeroBuddy was born from a simple belief: everyone deserves access
            to the transformative insights of numerology. We combine 7,000 years
            of ancient wisdom with cutting-edge AI to help you discover your
            cosmic purpose.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission */}
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
              delay: 0.2
            }}
            className="group relative">

            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg">
                <TargetIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-white mb-4">
                Our Mission
              </h2>
              <p className="text-white/70 leading-relaxed">
                To make numerology accessible, understandable, and actionable
                for everyone seeking clarity, purpose, and self-discovery in
                their life journey.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
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
              delay: 0.2
            }}
            className="group relative">

            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-6 shadow-lg">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-white mb-4">
                Our Vision
              </h2>
              <p className="text-white/70 leading-relaxed">
                To become the world's most trusted platform for numerological
                insights, empowering millions to live in alignment with their
                cosmic blueprint.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
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
          }}
          className="mb-20">

          <h2 className="text-3xl font-serif text-white text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) =>
            <motion.div
              key={value.title}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.5 + index * 0.1
              }}
              className="group relative">

                <div
                className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity`} />

                <div className="relative p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-center h-full">
                  <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>

                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Timeline */}
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
            delay: 0.6
          }}
          className="mb-20">

          <h2 className="text-3xl font-serif text-white text-center mb-12">
            Our Journey
          </h2>
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-600" />

            {/* Milestones */}
            <div className="space-y-8">
              {milestones.map((milestone, index) =>
              <motion.div
                key={milestone.year}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.7 + index * 0.1
                }}
                className="relative flex items-start gap-6">

                  {/* Year Badge */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg z-10 flex-shrink-0">
                    {milestone.year.slice(2)}
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
                    <div className="text-sm text-cyan-400 font-semibold mb-1">
                      {milestone.year}
                    </div>
                    <p className="text-white/80">{milestone.event}</p>
                  </div>
                </motion.div>
              )}
            </div>
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
            delay: 0.8
          }}
          className="text-center">

          <div className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Join Our Cosmic Community
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Be part of a growing community of seekers discovering their
              purpose through numerology.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">

              Start Your Journey
            </button>
          </div>
        </motion.div>
      </div>
    </GlassPageLayout>);

}