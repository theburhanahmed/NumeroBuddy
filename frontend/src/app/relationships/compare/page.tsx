'use client';

import React, { useState, useEffect } from 'react';
import { RelationshipsHub } from '@/components/navigation/hubs/relationships-hub';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { Loader2, Users, TrendingUp, AlertTriangle, Heart, Plus, X } from 'lucide-react';
import { relationshipNumerologyAPI, numerologyAPI, peopleAPI } from '@/lib/numerology-api';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface Partner {
  id?: string;
  name: string;
  birthDate: string;
  profile?: any;
}

export default function ComparePeoplePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([
    { name: '', birthDate: '' },
    { name: '', birthDate: '' },
  ]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [savedPeople, setSavedPeople] = useState<any[]>([]);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchSavedPeople();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await numerologyAPI.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchSavedPeople = async () => {
    try {
      setLoadingPeople(true);
      const people = await peopleAPI.getPeople();
      setSavedPeople(Array.isArray(people) ? people : []);
    } catch (error) {
      console.error('Failed to fetch people:', error);
    } finally {
      setLoadingPeople(false);
    }
  };

  const addPartner = () => {
    setPartners([...partners, { name: '', birthDate: '' }]);
  };

  const removePartner = (index: number) => {
    if (partners.length > 2) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };

  const updatePartner = (index: number, field: 'name' | 'birthDate', value: string) => {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    setPartners(updated);
  };

  const loadPersonFromSaved = (index: number, personId: string) => {
    const person = savedPeople.find(p => p.id === personId);
    if (person) {
      updatePartner(index, 'name', person.name);
      updatePartner(index, 'birthDate', person.date_of_birth || '');
    }
  };

  const comparePartners = async () => {
    // Validate inputs
    const validPartners = partners.filter(p => p.name && p.birthDate);
    if (validPartners.length < 2) {
      toast({
        title: 'Error',
        description: 'Please add at least 2 partners with names and birth dates',
        variant: 'destructive',
      });
      return;
    }

    if (!userProfile) {
      toast({
        title: 'Error',
        description: 'Please calculate your numerology profile first',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Calculate profiles for all partners
      const partnerProfiles = await Promise.all(
        validPartners.map(async (partner) => {
          try {
            // Create a temporary profile calculation
            const tempProfile = {
              full_name: partner.name,
              date_of_birth: partner.birthDate,
            };
            return { name: partner.name, id: partner.id, profile: tempProfile };
          } catch (error) {
            console.error(`Failed to calculate profile for ${partner.name}:`, error);
            return { name: partner.name, id: partner.id, profile: null };
          }
        })
      );

      const result = await relationshipNumerologyAPI.comparePartners({
        user_profile: userProfile,
        partner_profiles: partnerProfiles.filter(p => p.profile !== null),
      });

      setComparisonResult(result);
      toast({
        title: 'Success',
        description: 'Comparison completed successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to compare partners',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RelationshipsHub>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Compare Multiple Partners
          </h1>
          <p className="text-white/70">
            Compare numerology compatibility between yourself and multiple partners
          </p>
        </div>

        <SpaceCard variant="premium" className="p-6" glow>
          <h2 className="text-xl font-bold text-white mb-4">Partners to Compare</h2>
          
          <div className="space-y-4 mb-6">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#1a2942]/60 rounded-xl border border-cyan-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Partner {index + 1}</h3>
                  {partners.length > 2 && (
                    <button
                      onClick={() => removePartner(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {savedPeople.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm text-white/70 mb-2">Load from Saved People</label>
                    <select
                      onChange={(e) => e.target.value && loadPersonFromSaved(index, e.target.value)}
                      className="w-full px-4 py-2 bg-[#0a1628] border border-cyan-500/30 rounded-lg text-white text-sm"
                      defaultValue=""
                    >
                      <option value="">Select a saved person...</option>
                      {savedPeople.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name} ({person.date_of_birth ? new Date(person.date_of_birth).toLocaleDateString() : 'No DOB'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => updatePartner(index, 'name', e.target.value)}
                      placeholder="Enter partner name"
                      className="w-full px-4 py-2 bg-[#0a1628] border border-cyan-500/30 rounded-lg text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Birth Date</label>
                    <input
                      type="date"
                      value={partner.birthDate}
                      onChange={(e) => updatePartner(index, 'birthDate', e.target.value)}
                      className="w-full px-4 py-2 bg-[#0a1628] border border-cyan-500/30 rounded-lg text-white"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <TouchOptimizedButton
              variant="secondary"
              onClick={addPartner}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Partner
            </TouchOptimizedButton>
            <TouchOptimizedButton
              variant="primary"
              onClick={comparePartners}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Comparing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Compare Partners
                </>
              )}
            </TouchOptimizedButton>
          </div>
        </SpaceCard>

        {comparisonResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SpaceCard variant="premium" className="p-6" glow>
              <h2 className="text-xl font-bold text-white mb-4">Comparison Results</h2>
              
              {comparisonResult.comparisons && comparisonResult.comparisons.length > 0 ? (
                <div className="space-y-4">
                  {comparisonResult.comparisons.map((comp: any, index: number) => (
                    <div key={index} className="p-4 bg-[#1a2942]/60 rounded-xl border border-cyan-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          {comp.partner_name || `Partner ${index + 1}`}
                        </h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-cyan-400">{comp.compatibility_score || 0}%</div>
                          <p className="text-xs text-white/60">Compatibility</p>
                        </div>
                      </div>
                      
                      {comp.strengths && comp.strengths.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {comp.strengths.map((strength: string, i: number) => (
                              <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {comp.challenges && comp.challenges.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Challenges
                          </h4>
                          <ul className="space-y-1">
                            {comp.challenges.map((challenge: string, i: number) => (
                              <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {comp.advice && (
                        <div className="mt-3 pt-3 border-t border-cyan-500/20">
                          <p className="text-sm text-white/90">{comp.advice}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/70">
                  No comparison data available
                </div>
              )}

              {comparisonResult.recommendations && comparisonResult.recommendations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-cyan-500/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Overall Recommendations</h3>
                  <ul className="space-y-2">
                    {comparisonResult.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                        <Users className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SpaceCard>
          </motion.div>
        )}
      </div>
    </RelationshipsHub>
  );
}

