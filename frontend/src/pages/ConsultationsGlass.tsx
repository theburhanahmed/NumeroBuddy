import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  StarIcon,
  ClockIcon,
  VideoIcon,
  CalendarIcon,
  CheckCircleIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
export function ConsultationsGlass() {
  const navigate = useNavigate();
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const experts = [
  {
    name: 'Dr. Maya Patel',
    title: 'Master Numerologist',
    experience: '15+ years',
    rating: 4.9,
    reviews: 234,
    specialties: [
    'Life Path Analysis',
    'Career Guidance',
    'Relationship Compatibility'],

    image:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    price: 150,
    availability: 'Available this week'
  },
  {
    name: 'James Chen',
    title: 'Spiritual Numerologist',
    experience: '12+ years',
    rating: 4.8,
    reviews: 189,
    specialties: ['Spiritual Growth', 'Personal Cycles', 'Name Analysis'],
    image:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    price: 120,
    availability: 'Available today'
  },
  {
    name: 'Sarah Williams',
    title: 'Advanced Numerologist',
    experience: '10+ years',
    rating: 4.9,
    reviews: 156,
    specialties: ['Business Numerology', 'Forecasting', 'Remedies'],
    image:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    price: 130,
    availability: 'Available tomorrow'
  }];

  const packages = [
  {
    name: '30-Minute Session',
    duration: '30 min',
    description: 'Quick consultation for specific questions',
    features: [
    'One-on-one video call',
    'Focused topic discussion',
    'Written summary'],

    popular: false
  },
  {
    name: '60-Minute Session',
    duration: '60 min',
    description: 'Comprehensive analysis and guidance',
    features: [
    'In-depth numerology reading',
    'Personalized recommendations',
    'Detailed written report',
    'Follow-up email support'],

    popular: true
  },
  {
    name: '90-Minute Deep Dive',
    duration: '90 min',
    description: 'Complete life path exploration',
    features: [
    'Full numerology chart analysis',
    'Life purpose guidance',
    'Relationship insights',
    'Career direction',
    'Comprehensive PDF report',
    '2 weeks email support'],

    popular: false
  }];

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
        </motion.nav>

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
            className="text-center mb-12">

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Expert Consultations
            </h1>
            <p className="text-xl text-white/70">
              Connect with certified numerologists for personalized guidance
            </p>
          </motion.div>

          {/* Packages */}
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
            className="mb-16">

            <h2 className="text-2xl font-serif text-white mb-8 text-center">
              Choose Your Session
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, index) =>
              <motion.div
                key={pkg.name}
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
                className={`relative p-6 rounded-3xl backdrop-blur-xl border transition-all ${pkg.popular ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/40' : 'bg-[#1a2942]/40 border-cyan-500/20 hover:border-cyan-500/40'}`}>

                  {pkg.popular &&
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                      MOST POPULAR
                    </div>
                }
                  <div className="flex items-center gap-3 mb-4">
                    <ClockIcon className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-white/60">{pkg.duration}</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-6">
                    {pkg.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, i) =>
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-white/80">

                        <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                  )}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Experts */}
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
            }}>

            <h2 className="text-2xl font-serif text-white mb-8 text-center">
              Our Expert Numerologists
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {experts.map((expert, index) =>
              <motion.div
                key={expert.name}
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
                className={`p-6 rounded-3xl backdrop-blur-xl border transition-all cursor-pointer ${selectedExpert === index ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/40' : 'bg-[#1a2942]/40 border-cyan-500/20 hover:border-cyan-500/40'}`}
                onClick={() => setSelectedExpert(index)}>

                  {/* Profile Image */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-full h-full rounded-full object-cover border-4 border-cyan-500/30" />

                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#0a1628] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-serif text-white mb-1">
                      {expert.name}
                    </h3>
                    <p className="text-sm text-cyan-400 mb-2">{expert.title}</p>
                    <p className="text-xs text-white/60 mb-3">
                      {expert.experience} experience
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) =>
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(expert.rating) ? 'text-amber-400 fill-current' : 'text-white/20'}`} />

                      )}
                      </div>
                      <span className="text-sm text-white/70">
                        {expert.rating} ({expert.reviews})
                      </span>
                    </div>

                    {/* Availability */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-400 text-xs font-semibold mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      {expert.availability}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-xs text-white/60 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((specialty, i) =>
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs">

                          {specialty}
                        </span>
                    )}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-cyan-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60 text-sm">Starting at</span>
                      <span className="text-2xl font-bold text-white">
                        ${expert.price}
                      </span>
                    </div>
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Book Session
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Info */}
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
            className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-start gap-4">

            <VideoIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-2">How It Works</h4>
              <ol className="text-white/70 text-sm space-y-1">
                <li>1. Choose your session package and expert numerologist</li>
                <li>2. Select a convenient time from their calendar</li>
                <li>3. Complete payment and receive confirmation email</li>
                <li>4. Join the video call at scheduled time</li>
                <li>5. Receive your personalized report after the session</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}