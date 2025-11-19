'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar,
  Users,
  ChevronLeft,
  Edit,
  FileText,
  Calculator
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { useAuth } from '@/contexts/auth-context';

interface Person {
  id: string;
  name: string;
  birth_date: string;
  relationship: string;
  notes: string;
  created_at: string;
}

interface NumerologyProfile {
  life_path_number: number;
  destiny_number: number;
  soul_urge_number: number;
  personality_number: number;
  attitude_number: number;
  maturity_number: number;
  balance_number: number;
  personal_year_number: number;
  personal_month_number: number;
  calculation_system: string;
  calculated_at: string;
}

export default function PersonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [person, setPerson] = useState<Person | null>(null);
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPerson();
  }, [params.id]);

  const fetchPerson = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch(`/api/people/${params.id}`);
      // const data = await response.json();
      // setPerson(data);
      
      // Mock data for demonstration
      setPerson({
        id: params.id as string,
        name: 'John Doe',
        birth_date: '1990-05-15',
        relationship: 'self',
        notes: 'This is a sample note about John.',
        created_at: '2023-01-15T10:30:00Z'
      });
      
      // Fetch numerology profile
      fetchNumerologyProfile();
    } catch (err) {
      console.error('Failed to fetch person:', err);
      setError('Failed to load person data');
    } finally {
      setLoading(false);
    }
  };

  const fetchNumerologyProfile = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch(`/api/people/${params.id}/profile/`);
      // const data = await response.json();
      // setProfile(data);
      
      // Mock data for demonstration
      setProfile({
        life_path_number: 7,
        destiny_number: 5,
        soul_urge_number: 1,
        personality_number: 4,
        attitude_number: 3,
        maturity_number: 8,
        balance_number: 2,
        personal_year_number: 6,
        personal_month_number: 9,
        calculation_system: 'pythagorean',
        calculated_at: '2023-06-15T10:30:00Z'
      });
    } catch (err) {
      console.error('Failed to fetch numerology profile:', err);
      // It's okay if profile doesn't exist yet
    }
  };

  const handleCalculateNumerology = async () => {
    if (!person) return;
    
    setCalculating(true);
    setError('');

    try {
      // In a real implementation, this would call the API
      // const response = await fetch(`/api/people/${params.id}/calculate/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ system: 'pythagorean' })
      // });
      // 
      // if (response.ok) {
      //   const data = await response.json();
      //   setProfile(data.profile);
      // } else {
      //   setError('Failed to calculate numerology');
      // }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful calculation
      setProfile({
        life_path_number: 7,
        destiny_number: 5,
        soul_urge_number: 1,
        personality_number: 4,
        attitude_number: 3,
        maturity_number: 8,
        balance_number: 2,
        personal_year_number: 6,
        personal_month_number: 9,
        calculation_system: 'pythagorean',
        calculated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to calculate numerology:', err);
      setError('Failed to calculate numerology');
    } finally {
      setCalculating(false);
    }
  };

  const handleGenerateReport = () => {
    if (!person) return;
    router.push(`/reports/generate?person=${person.id}`);
  };

  const handleEditPerson = () => {
    if (!person) return;
    router.push(`/people/${person.id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-white/50 dark:bg-gray-800/50 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-96 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard variant="default" className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Person Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The requested person could not be found.
            </p>
            <GlassButton 
              variant="primary" 
              onClick={() => router.push('/people')}
            >
              Back to People
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <GlassButton 
                variant="ghost" 
                onClick={() => router.push('/people')}
                className="mb-4"
                icon={<ChevronLeft className="w-5 h-5" />}
              >
                Back to People
              </GlassButton>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {person.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(person.birth_date).toLocaleDateString()}</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {person.relationship}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <GlassButton 
                variant="secondary" 
                onClick={handleEditPerson}
                icon={<Edit className="w-5 h-5" />}
              >
                Edit
              </GlassButton>
              <GlassButton 
                variant="primary" 
                onClick={handleGenerateReport}
                icon={<FileText className="w-5 h-5" />}
              >
                Generate Report
              </GlassButton>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Person Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Person Info Card */}
            <div className="lg:col-span-1">
              <GlassCard variant="default" className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Person Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-gray-900 dark:text-white font-medium">{person.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Birth Date</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(person.birth_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Relationship</p>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">
                      {person.relationship}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Added On</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(person.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {person.notes && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                      <p className="text-gray-900 dark:text-white font-medium">{person.notes}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Numerology Profile */}
            <div className="lg:col-span-2">
              <GlassCard variant="default" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Numerology Profile
                  </h2>
                  
                  {!profile ? (
                    <GlassButton 
                      variant="primary" 
                      onClick={handleCalculateNumerology}
                      disabled={calculating}
                      icon={<Calculator className="w-5 h-5" />}
                    >
                      {calculating ? 'Calculating...' : 'Calculate Profile'}
                    </GlassButton>
                  ) : (
                    <GlassButton 
                      variant="secondary" 
                      onClick={handleCalculateNumerology}
                      disabled={calculating}
                      icon={<Calculator className="w-5 h-5" />}
                    >
                      Recalculate
                    </GlassButton>
                  )}
                </div>
                
                {calculating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Calculating numerology profile...
                    </p>
                  </div>
                ) : profile ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Life Path</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {profile.life_path_number}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Destiny</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {profile.destiny_number}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Soul Urge</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {profile.soul_urge_number}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Personality</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {profile.personality_number}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Personal Year</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {profile.personal_year_number}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Attitude</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {profile.attitude_number}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Numerology Profile
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Calculate numerology profile to see insights about {person.name}
                    </p>
                    <GlassButton 
                      variant="primary" 
                      onClick={handleCalculateNumerology}
                      icon={<Calculator className="w-5 h-5" />}
                    >
                      Calculate Profile
                    </GlassButton>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <GlassButton 
              variant="secondary" 
              onClick={() => router.push('/people')}
            >
              Back to People
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={handleGenerateReport}
              icon={<FileText className="w-5 h-5" />}
            >
              Generate Report for {person.name}
            </GlassButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}