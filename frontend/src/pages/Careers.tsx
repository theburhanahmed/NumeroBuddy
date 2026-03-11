import React from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon } from
'lucide-react';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function Careers() {
  const positions = [
  {
    title: 'Senior Numerologist',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    description:
    'Lead numerology content creation and provide expert consultations to premium users.',
    requirements: [
    '10+ years numerology experience',
    'Certification in numerology',
    'Excellent communication skills']

  },
  {
    title: 'Full Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description:
    'Build and scale our React/Node.js platform serving 50K+ users worldwide.',
    requirements: [
    '5+ years React/TypeScript',
    'Node.js backend experience',
    'AWS/cloud infrastructure']

  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description:
    'Design beautiful, intuitive experiences for our cosmic numerology platform.',
    requirements: [
    '4+ years product design',
    'Figma expertise',
    'Portfolio showcasing mobile/web']

  },
  {
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
    'Develop AI-powered numerology insights and natural language processing features.',
    requirements: [
    'ML/NLP experience',
    'Python/TensorFlow',
    'Experience with LLMs']

  }];

  const benefits = [
  {
    icon: '💰',
    title: 'Competitive Salary',
    description: 'Market-leading compensation'
  },
  {
    icon: '🏥',
    title: 'Health Benefits',
    description: 'Medical, dental, vision'
  },
  {
    icon: '🌴',
    title: 'Unlimited PTO',
    description: 'Take time when you need it'
  },
  {
    icon: '🏠',
    title: 'Remote Work',
    description: 'Work from anywhere'
  },
  {
    icon: '📚',
    title: 'Learning Budget',
    description: '$2K annual education'
  },
  {
    icon: '🚀',
    title: 'Equity',
    description: 'Stock options for all'
  }];

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-28">
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <BriefcaseIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                Join Our Team
              </h1>
              <p className="text-white/70">
                Help us bring numerology to the world
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
          className="mb-12">

          <SpaceCard variant="premium" className="p-8 md:p-10">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
              Why Numerobuddy?
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              We're on a mission to make ancient numerology wisdom accessible to
              everyone through modern technology. Join a passionate team
              building the future of spiritual guidance.
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {benefits.map((benefit, index) =>
              <motion.div
                key={benefit.title}
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: 0.2 + index * 0.05
                }}
                className="text-center">

                  <div className="text-3xl mb-2">{benefit.icon}</div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-white/60">{benefit.description}</p>
                </motion.div>
              )}
            </div>
          </SpaceCard>
        </motion.div>

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Open Positions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {positions.map((position, index) =>
          <motion.div
            key={position.title}
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

              <SpaceCard variant="default" className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2">
                    {position.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400">
                      {position.department}
                    </span>
                    <span className="flex items-center gap-1 text-white/60">
                      <MapPinIcon className="w-4 h-4" />
                      {position.location}
                    </span>
                    <span className="flex items-center gap-1 text-white/60">
                      <ClockIcon className="w-4 h-4" />
                      {position.type}
                    </span>
                  </div>
                </div>

                <p className="text-white/70 mb-4 leading-relaxed">
                  {position.description}
                </p>

                <div className="mb-4 flex-1">
                  <h4 className="text-sm font-semibold text-white mb-2">
                    Requirements:
                  </h4>
                  <ul className="space-y-1">
                    {position.requirements.map((req, i) =>
                  <li
                    key={i}
                    className="text-sm text-white/70 flex items-start gap-2">

                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                  )}
                  </ul>
                </div>

                <TouchOptimizedButton
                variant="primary"
                size="md"
                icon={<ArrowRightIcon className="w-4 h-4" />}
                ariaLabel={`Apply for ${position.title}`}
                className="w-full">

                  Apply Now
                </TouchOptimizedButton>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </div>

      <LandingFooter />
    </div>);

}