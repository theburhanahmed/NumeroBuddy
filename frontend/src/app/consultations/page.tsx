'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UsersIcon, StarIcon, CalendarIcon, ClockIcon, VideoIcon, MessageSquareIcon, CheckCircleIcon, SparklesIcon } from 'lucide-react';
import { AppNavbar } from '@/components/navigation/app-navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { FloatingOrbs } from '@/components/ui/floating-orbs';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { MagneticCard } from '@/components/ui/magnetic-card';
import { toast } from 'sonner';
export default function Consultations() {
  const router = useRouter();
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const experts = [{
    id: 1,
    name: 'Dr. Maya Patel',
    title: 'Master Numerologist',
    experience: '15 years',
    rating: 4.9,
    reviews: 234,
    specialties: ['Life Path Analysis', 'Career Guidance', 'Relationship Compatibility'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    price: 150,
    availability: 'Available Today'
  }, {
    id: 2,
    name: 'James Chen',
    title: 'Spiritual Numerologist',
    experience: '12 years',
    rating: 4.8,
    reviews: 189,
    specialties: ['Spiritual Growth', 'Personal Year Cycles', 'Name Analysis'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    price: 120,
    availability: 'Next Available: Tomorrow'
  }, {
    id: 3,
    name: 'Sarah Williams',
    title: 'Business Numerologist',
    experience: '10 years',
    rating: 4.9,
    reviews: 156,
    specialties: ['Business Strategy', 'Brand Numerology', 'Financial Timing'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    price: 180,
    availability: 'Available Today'
  }];
  const consultationTypes = [{
    icon: <VideoIcon className="w-6 h-6" />,
    title: 'Video Consultation',
    duration: '60 minutes',
    description: 'Face-to-face session for in-depth analysis'
  }, {
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'Chat Consultation',
    duration: '45 minutes',
    description: 'Text-based session with detailed written analysis'
  }, {
    icon: <CalendarIcon className="w-6 h-6" />,
    title: 'Follow-up Session',
    duration: '30 minutes',
    description: 'Continue your journey with ongoing guidance'
  }];
  const handleBookConsultation = (expertName: string) => {
    toast.success(`Consultation request sent to ${expertName}!`, {
      description: 'You will receive a confirmation email shortly'
    });
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 transition-colors duration-500 relative overflow-hidden">
      <AmbientParticles />
      <FloatingOrbs />
      <AppNavbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <motion.div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg" animate={{
            rotate: [0, 5, -5, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity
          }}>
              <UsersIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                Expert Consultations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with certified numerology experts
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="mb-8">
          <GlassCard variant="liquid-premium" className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 liquid-glass-iridescent">
            <div className="liquid-glass-content">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Get Personalized Guidance
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Book a session with certified numerology experts for in-depth
                analysis and guidance
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {consultationTypes.map((type, index) => <motion.div key={type.title} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.2 + index * 0.1
              }}>
                    <MagneticCard variant="liquid" className="p-4">
                      <div className="liquid-glass-content">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                            {type.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {type.title}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {type.duration}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {type.description}
                        </p>
                      </div>
                    </MagneticCard>
                  </motion.div>)}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Experts Grid */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Our Expert Numerologists
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {experts.map((expert, index) => <motion.div key={expert.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4 + index * 0.1
          }}>
                <MagneticCard variant="liquid-premium" className="p-6 h-full">
                  <div className="liquid-glass-content">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div className="relative" whileHover={{
                    scale: 1.05
                  }}>
                        <img src={expert.image} alt={expert.name} className="w-20 h-20 rounded-2xl object-cover" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          <CheckCircleIcon className="w-5 h-5" />
                        </div>
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {expert.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {expert.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ({expert.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <GlassCard variant="liquid" className="p-4 mb-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                      <div className="liquid-glass-content">
                        <div className="flex items-center gap-2 mb-2">
                          <ClockIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {expert.experience} Experience
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {expert.availability}
                          </span>
                        </div>
                      </div>
                    </GlassCard>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Specialties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {expert.specialties.map((specialty, idx) => <span key={idx} className="px-3 py-1 bg-purple-500/20 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200">
                            {specialty}
                          </span>)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Starting at
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${expert.price}
                        </p>
                      </div>
                      <GlassButton variant="liquid" size="sm" onClick={() => handleBookConsultation(expert.name)} className="glass-glow">
                        Book Now
                      </GlassButton>
                    </div>
                  </div>
                </MagneticCard>
              </motion.div>)}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="mt-12">
          <GlassCard variant="liquid-premium" className="p-8">
            <div className="liquid-glass-content">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <MagneticCard variant="liquid" className="p-5">
                  <div className="liquid-glass-content">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How long is a typical consultation?
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Standard consultations are 60 minutes, but we also offer
                      30-minute follow-ups and 45-minute chat sessions.
                    </p>
                  </div>
                </MagneticCard>

                <MagneticCard variant="liquid" className="p-5">
                  <div className="liquid-glass-content">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Can I reschedule my appointment?
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Yes, you can reschedule up to 24 hours before your
                      appointment without any charges.
                    </p>
                  </div>
                </MagneticCard>

                <MagneticCard variant="liquid" className="p-5">
                  <div className="liquid-glass-content">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What should I prepare before the consultation?
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Have your birth date, full name, and any specific
                      questions ready. You will receive a detailed preparation
                      guide after booking.
                    </p>
                  </div>
                </MagneticCard>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>;
}