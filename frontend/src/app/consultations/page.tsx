'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon,
  VideoIcon,
  MessageCircleIcon,
  SparklesIcon,
  StarIcon,
  PhoneIcon
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { useConsultations, useExperts } from '@/lib/hooks';

export default function ConsultationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const { upcoming, past, loading: consultationsLoading, error: consultationsError } = useConsultations();
  const { experts, loading: expertsLoading, error: expertsError } = useExperts();

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get icon for consultation type
  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoIcon className="w-5 h-5 text-gray-400" />;
      case 'chat': return <MessageCircleIcon className="w-5 h-5 text-gray-400" />;
      case 'phone': return <PhoneIcon className="w-5 h-5 text-gray-400" />;
      default: return <VideoIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
          Confirmed
        </span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-full">
          Pending
        </span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
          Completed
        </span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs font-medium rounded-full">
          Cancelled
        </span>;
      default:
        return <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Expert Consultations
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Book sessions with professional numerologists
              </p>
            </div>
            
            <GlassButton 
              variant="primary" 
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </GlassButton>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'upcoming' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Consultations
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'past' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('past')}
            >
              Past Consultations
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'experts' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('experts')}
            >
              Find Experts
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Consultations</h2>
              
              {consultationsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((item) => (
                    <GlassCard key={item} variant="default" className="p-6 h-64 animate-pulse">
                      <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded w-3/4 mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded"></div>
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-5/6"></div>
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-2/3"></div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <div className="h-10 bg-white/50 dark:bg-gray-800/50 rounded w-24"></div>
                        <div className="h-10 bg-white/50 dark:bg-gray-800/50 rounded w-24"></div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : consultationsError ? (
                <GlassCard variant="default" className="p-12 text-center">
                  <UsersIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Consultations</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {consultationsError}
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => router.push('/dashboard')}
                  >
                    Back to Dashboard
                  </GlassButton>
                </GlassCard>
              ) : upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcoming.map((consultation) => (
                    <GlassCard key={consultation.id} variant="default" className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {consultation.expert_name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {consultation.expert_specialty}
                          </p>
                        </div>
                        {getStatusBadge(consultation.status)}
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDate(consultation.scheduled_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatTime(consultation.scheduled_at)} ({consultation.duration_minutes} min)
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getConsultationIcon(consultation.consultation_type)}
                          <span className="text-gray-700 dark:text-gray-300 capitalize">
                            {consultation.consultation_type} consultation
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <GlassButton variant="primary" size="sm">
                          Join Session
                        </GlassButton>
                        <GlassButton variant="secondary" size="sm">
                          Reschedule
                        </GlassButton>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard variant="default" className="p-12 text-center">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Upcoming Consultations</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You don't have any scheduled consultations. Book a session with an expert to get started.
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => setActiveTab('experts')}
                  >
                    Find Experts
                  </GlassButton>
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past Consultations</h2>
              
              {consultationsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((item) => (
                    <GlassCard key={item} variant="default" className="p-6 h-64 animate-pulse">
                      <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded w-3/4 mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded"></div>
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-5/6"></div>
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-2/3"></div>
                      </div>
                      <div className="h-10 bg-white/50 dark:bg-gray-800/50 rounded w-24 mt-6"></div>
                    </GlassCard>
                  ))}
                </div>
              ) : consultationsError ? (
                <GlassCard variant="default" className="p-12 text-center">
                  <UsersIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Consultations</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {consultationsError}
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => router.push('/dashboard')}
                  >
                    Back to Dashboard
                  </GlassButton>
                </GlassCard>
              ) : past.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {past.map((consultation) => (
                    <GlassCard key={consultation.id} variant="default" className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {consultation.expert_name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {consultation.expert_specialty}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`w-4 h-4 ${i < (consultation.review?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {new Date(consultation.scheduled_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatTime(consultation.scheduled_at)} ({consultation.duration_minutes} min)
                          </span>
                        </div>
                      </div>
                      
                      <GlassButton variant="secondary" size="sm">
                        View Details
                      </GlassButton>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard variant="default" className="p-12 text-center">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Past Consultations</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your consultation history will appear here after your sessions.
                  </p>
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === 'experts' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Experts</h2>
              
              {expertsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <GlassCard key={item} variant="default" className="p-6 h-64 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/50 dark:bg-gray-800/50 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-white/50 dark:bg-gray-800/50 rounded w-3/4"></div>
                          <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-1/2"></div>
                        <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-1/3"></div>
                      </div>
                      <div className="h-10 bg-white/50 dark:bg-gray-800/50 rounded"></div>
                    </GlassCard>
                  ))}
                </div>
              ) : expertsError ? (
                <GlassCard variant="default" className="p-12 text-center">
                  <UsersIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Experts</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {expertsError}
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => router.push('/dashboard')}
                  >
                    Back to Dashboard
                  </GlassButton>
                </GlassCard>
              ) : experts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experts.map((expert) => (
                    <GlassCard key={expert.id} variant="default" className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            {expert.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {expert.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {expert.specialty}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2">
                          <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {expert.rating} · {expert.experience_years} years experience
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Starting at $100/session
                        </p>
                      </div>
                      
                      <GlassButton variant="primary" className="w-full">
                        Book Consultation
                      </GlassButton>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard variant="default" className="p-12 text-center">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Experts Available</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    There are currently no experts available. Please check back later.
                  </p>
                </GlassCard>
              )}
              
              {/* AI Recommendation */}
              <div className="text-center py-8">
                <GlassCard variant="elevated" className="p-8 max-w-2xl mx-auto">
                  <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Not Sure Which Expert to Choose?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Our AI numerologist can recommend the best expert based on your numerology profile and consultation goals.
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => router.push('/ai-chat')}
                    icon={<SparklesIcon className="w-5 h-5" />}
                  >
                    Get AI Recommendation
                  </GlassButton>
                </GlassCard>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}