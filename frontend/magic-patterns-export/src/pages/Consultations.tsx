import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  CheckIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function Consultations() {
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const experts = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Master Numerologist',
    experience: '15+ years',
    specialty: 'Life Path & Career Guidance',
    rating: 4.9,
    sessions: 1200,
    price: 99,
    image: '👩‍🏫'
  },
  {
    id: '2',
    name: 'Michael Torres',
    title: 'Relationship Expert',
    experience: '12+ years',
    specialty: 'Compatibility & Love',
    rating: 4.8,
    sessions: 950,
    price: 89,
    image: '👨‍💼'
  },
  {
    id: '3',
    name: 'Emma Williams',
    title: 'Business Numerologist',
    experience: '10+ years',
    specialty: 'Business & Finance',
    rating: 4.9,
    sessions: 800,
    price: 129,
    image: '👩‍💻'
  }];

  const benefits = [
  'One-on-one personalized guidance',
  'Deep dive into your numerology chart',
  'Actionable insights and recommendations',
  'Recording of session for review',
  'Follow-up email summary',
  '30-day email support'];

  return (
    <CosmicPageLayout>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Expert Consultations
            </h1>
            <p className="text-white/70">
              Book a session with certified numerologists
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
        className="mb-8">

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            What's Included
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) =>
            <div key={index} className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/80">{benefit}</span>
              </div>
            )}
          </div>
        </SpaceCard>
      </motion.div>

      <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
        Our Experts
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {experts.map((expert, index) =>
        <motion.div
          key={expert.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2 + index * 0.1
          }}
          whileHover={{
            y: -4
          }}>

            <SpaceCard variant="default" className="p-6 h-full">
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{expert.image}</div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {expert.name}
                </h3>
                <p className="text-cyan-400 text-sm mb-2">{expert.title}</p>
                <p className="text-white/60 text-sm">{expert.specialty}</p>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Experience:</span>
                  <span className="text-white">{expert.experience}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Rating:</span>
                  <span className="text-yellow-400">★ {expert.rating}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Sessions:</span>
                  <span className="text-white">{expert.sessions}+</span>
                </div>
              </div>

              <div className="border-t border-cyan-500/20 pt-4 mb-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">
                    ${expert.price}
                  </span>
                  <span className="text-white/60 text-sm">/session</span>
                </div>
              </div>

              <TouchOptimizedButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setSelectedExpert(expert.id)}
              ariaLabel={`Book session with ${expert.name}`}>

                Book Session
              </TouchOptimizedButton>
            </SpaceCard>
          </motion.div>
        )}
      </div>
    </CosmicPageLayout>);

}