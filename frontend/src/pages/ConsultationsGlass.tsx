import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  StarIcon,
  ClockIcon,
  VideoIcon,
  CalendarIcon,
  CheckCircleIcon,
  Loader2Icon
} from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { GlassBackground } from '../components/GlassBackground';
import { numerologyAPI } from '../lib/numerology-api';

interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  rating: string | number;
  bio: string;
  profile_picture_url: string;
  is_verified: boolean;
}

export function ConsultationsGlass() {
  const navigate = useNavigate();
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setIsLoading(true);
        const data = await numerologyAPI.getExperts();
        setExperts(data.results || []);
      } catch (err) {
        console.error('Failed to fetch experts', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const packages = [
    {
      name: '30-Minute Session',
      duration: '30 min',
      description: 'Quick consultation for specific questions',
      features: [
        'One-on-one video call',
        'Focused topic discussion',
        'Written summary'
      ],
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
        'Follow-up email support'
      ],
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
        '2 weeks email support'
      ],
      popular: false
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        
        <AppNavbar />

        <div className="max-w-7xl mx-auto px-8 py-8 pt-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Expert Consultations
            </h1>
            <p className="text-xl text-white/70">
              Connect with certified numerologists for personalized guidance
            </p>
          </motion.div>

          {/* Packages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-serif text-white mb-8 text-center">
              Choose Your Session
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`relative p-6 rounded-3xl backdrop-blur-xl border transition-all ${
                    pkg.popular ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/40' : 'bg-[#1a2942]/40 border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                      MOST POPULAR
                    </div>
                  )}
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
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                        <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Experts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-serif text-white mb-8 text-center">
              Our Expert Numerologists
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2Icon className="w-10 h-10 text-cyan-400 animate-spin" />
              </div>
            ) : experts.length === 0 ? (
              <div className="text-center p-8 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                <p className="text-cyan-400">No experts available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {experts.map((expert, index) => (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-6 rounded-3xl backdrop-blur-xl border transition-all cursor-pointer ${
                      selectedExpertId === expert.id ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/40' : 'bg-[#1a2942]/40 border-cyan-500/20 hover:border-cyan-500/40'
                    }`}
                    onClick={() => setSelectedExpertId(expert.id)}
                  >
                    {/* Profile Image */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      {expert.profile_picture_url ? (
                        <img
                          src={expert.profile_picture_url}
                          alt={expert.name}
                          className="w-full h-full rounded-full object-cover border-4 border-cyan-500/30"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full border-4 border-cyan-500/30 bg-[#0a1628] flex items-center justify-center text-3xl text-cyan-500 font-serif">
                          {expert.name.charAt(0)}
                        </div>
                      )}
                      
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#0a1628] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-serif text-white mb-1">
                        {expert.name}
                      </h3>
                      <p className="text-sm text-cyan-400 mb-2">Verified Expert</p>
                      <p className="text-xs text-white/60 mb-3">
                        {expert.experience_years}+ years experience
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(Number(expert.rating) || 5) ? 'text-amber-400 fill-current' : 'text-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-white/70">
                          {Number(expert.rating) > 0 ? Number(expert.rating).toFixed(1) : 'New'}
                        </span>
                      </div>

                      {/* Availability */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-400 text-xs font-semibold mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        Available to book
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <p className="text-xs text-white/60 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs capitalize text-center w-full">
                          {expert.specialty.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-cyan-500/10">
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        Check Availability
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-start gap-4"
          >
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
    </div>
  );
}