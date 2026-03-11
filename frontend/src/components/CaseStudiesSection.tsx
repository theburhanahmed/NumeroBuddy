import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  TrendingUpIcon,
  HeartIcon,
  BriefcaseIcon } from
'lucide-react';
import { SpaceCard } from './SpaceCard';
interface CaseStudy {
  name: string;
  role: string;
  avatar: string;
  category: 'career' | 'relationship' | 'personal';
  icon: React.ReactNode;
  challenge: string;
  solution: string;
  result: string;
  metrics: {
    label: string;
    value: string;
  }[];
  quote: string;
}
const caseStudies: CaseStudy[] = [
{
  name: 'Alex Thompson',
  role: 'Marketing Director',
  avatar: '👨‍💼',
  category: 'career',
  icon: <BriefcaseIcon className="w-6 h-6" />,
  challenge: 'Felt stuck in career, unsure about taking a leadership role',
  solution:
  'Used Life Path 8 insights to understand natural leadership abilities and timing for career moves',
  result:
  'Accepted promotion, increased team productivity by 40%, and found work-life balance',
  metrics: [
  {
    label: 'Career Growth',
    value: '2 Levels'
  },
  {
    label: 'Confidence',
    value: '+85%'
  },
  {
    label: 'Time to Decision',
    value: '2 Weeks'
  }],

  quote:
  "NumerAI helped me see my natural strengths clearly. The timing guidance was spot-on—I made the leap and haven't looked back."
},
{
  name: 'Sarah & Michael',
  role: 'Engaged Couple',
  avatar: '💑',
  category: 'relationship',
  icon: <HeartIcon className="w-6 h-6" />,
  challenge: 'Frequent conflicts, considering ending 3-year relationship',
  solution:
  'Compatibility analysis revealed complementary Life Paths (3 & 6) and communication strategies',
  result: 'Resolved core issues, got engaged, and built stronger foundation',
  metrics: [
  {
    label: 'Conflicts',
    value: '-70%'
  },
  {
    label: 'Understanding',
    value: '+90%'
  },
  {
    label: 'Relationship Score',
    value: '9.2/10'
  }],

  quote:
  "The compatibility report was eye-opening. We learned to appreciate our differences instead of fighting them. We're now planning our wedding!"
},
{
  name: 'Priya Patel',
  role: 'Entrepreneur',
  avatar: '👩‍💻',
  category: 'personal',
  icon: <TrendingUpIcon className="w-6 h-6" />,
  challenge:
  'Burnout, lost sense of purpose, struggling with business direction',
  solution:
  'Daily readings and Life Path 5 guidance on embracing change and freedom',
  result:
  'Pivoted business model, regained passion, and achieved work-life harmony',
  metrics: [
  {
    label: 'Business Growth',
    value: '+150%'
  },
  {
    label: 'Stress Level',
    value: '-60%'
  },
  {
    label: 'Life Satisfaction',
    value: '9.5/10'
  }],

  quote:
  "NumerAI's daily guidance kept me grounded during my pivot. Understanding my Life Path 5 need for freedom transformed how I run my business."
}];

const categoryColors = {
  career: 'from-blue-500 to-cyan-600',
  relationship: 'from-pink-500 to-rose-600',
  personal: 'from-purple-500 to-indigo-600'
};
export function CaseStudiesSection() {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mb-16">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              📖 Real Stories
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Life-Changing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Success Stories
            </span>
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover how NumerAI has transformed lives through personalized
            cosmic guidance
          </p>
        </motion.div>

        {/* Case Studies */}
        <div className="space-y-12">
          {caseStudies.map((study, index) =>
          <motion.div
            key={study.name}
            initial={{
              opacity: 0,
              y: 40
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.2
            }}>

              <SpaceCard variant="premium" className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8 md:p-12">
                  {/* Left: Profile & Challenge */}
                  <div className="lg:col-span-1">
                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center text-3xl border border-cyan-500/30">
                        {study.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {study.name}
                        </h3>
                        <p className="text-sm text-white/60">{study.role}</p>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[study.category]} bg-opacity-20 border border-white/20 mb-6`}>

                      {study.icon}
                      <span className="text-sm font-semibold text-white capitalize">
                        {study.category}
                      </span>
                    </div>

                    {/* Challenge */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                        THE CHALLENGE
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3">
                      {study.metrics.map((metric) =>
                    <div
                      key={metric.label}
                      className="flex justify-between items-center">

                          <span className="text-sm text-white/60">
                            {metric.label}
                          </span>
                          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                            {metric.value}
                          </span>
                        </div>
                    )}
                    </div>
                  </div>

                  {/* Right: Solution & Result */}
                  <div className="lg:col-span-2">
                    {/* Solution */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          1
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          The Solution
                        </h4>
                      </div>
                      <p className="text-white/80 leading-relaxed pl-10">
                        {study.solution}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center my-6">
                      <ArrowRightIcon className="w-6 h-6 text-cyan-400 rotate-90 lg:rotate-0" />
                    </div>

                    {/* Result */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                          2
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          The Result
                        </h4>
                      </div>
                      <p className="text-white/80 leading-relaxed pl-10">
                        {study.result}
                      </p>
                    </div>

                    {/* Quote */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 mt-8">
                      <div className="flex gap-4">
                        <div className="text-4xl text-cyan-400 leading-none">
                          "
                        </div>
                        <div>
                          <p className="text-white/90 italic leading-relaxed mb-2">
                            {study.quote}
                          </p>
                          <p className="text-sm text-cyan-400 font-semibold">
                            — {study.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SpaceCard>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mt-12">

          <p className="text-white/70 mb-4">
            Ready to write your own success story?
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">

            Start Your Journey
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>);

}