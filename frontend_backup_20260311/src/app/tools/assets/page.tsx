'use client';

import React, { useState } from 'react';
import { ToolsHub } from '@/components/navigation/hubs/tools-hub';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { Loader2, Car, Home, Building2, Phone, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { assetNumerologyAPI } from '@/lib/numerology-api';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

type AssetType = 'vehicle' | 'property' | 'business' | 'phone';

export default function AssetsPage() {
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<AssetType>('vehicle');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<AssetType, any>>({
    vehicle: null,
    property: null,
    business: null,
    phone: null,
  });

  const assetTypes = [
    { id: 'vehicle' as AssetType, label: 'Vehicle', icon: Car, description: 'License plate numerology' },
    { id: 'property' as AssetType, label: 'Property', icon: Home, description: 'House/flat number analysis' },
    { id: 'business' as AssetType, label: 'Business', icon: Building2, description: 'Business name & number' },
    { id: 'phone' as AssetType, label: 'Phone Asset', icon: Phone, description: 'Phone number analysis' },
  ];

  const handleCalculate = async () => {
    try {
      setLoading(true);
      
      let data: any;
      const formData = getFormData();

      switch (activeType) {
        case 'vehicle':
          if (!formData.licensePlate) {
            toast({ title: 'Error', description: 'Please enter a license plate number', variant: 'destructive' });
            return;
          }
          data = await assetNumerologyAPI.calculateVehicle({ license_plate: formData.licensePlate });
          break;
        case 'property':
          if (!formData.houseNumber) {
            toast({ title: 'Error', description: 'Please enter a house/flat number', variant: 'destructive' });
            return;
          }
          data = await assetNumerologyAPI.calculateProperty({
            house_number: formData.houseNumber,
            floor_number: formData.floorNumber ? parseInt(formData.floorNumber) : undefined,
          });
          break;
        case 'business':
          if (!formData.businessName) {
            toast({ title: 'Error', description: 'Please enter a business name', variant: 'destructive' });
            return;
          }
          data = await assetNumerologyAPI.calculateBusiness({
            business_name: formData.businessName,
            registration_number: formData.registrationNumber || undefined,
            launch_date: formData.launchDate || undefined,
          });
          break;
        case 'phone':
          if (!formData.phoneNumber) {
            toast({ title: 'Error', description: 'Please enter a phone number', variant: 'destructive' });
            return;
          }
          data = await assetNumerologyAPI.calculatePhoneAsset({ phone_number: formData.phoneNumber });
          break;
      }

      setResults(prev => ({ ...prev, [activeType]: data }));
      toast({ title: 'Success', description: 'Asset analysis completed', variant: 'default' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to calculate asset numerology',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getFormData = () => {
    return {
      licensePlate: (document.getElementById('license-plate') as HTMLInputElement)?.value || '',
      houseNumber: (document.getElementById('house-number') as HTMLInputElement)?.value || '',
      floorNumber: (document.getElementById('floor-number') as HTMLInputElement)?.value || '',
      businessName: (document.getElementById('business-name') as HTMLInputElement)?.value || '',
      registrationNumber: (document.getElementById('registration-number') as HTMLInputElement)?.value || '',
      launchDate: (document.getElementById('launch-date') as HTMLInputElement)?.value || '',
      phoneNumber: (document.getElementById('phone-number') as HTMLInputElement)?.value || '',
    };
  };

  const renderForm = () => {
    switch (activeType) {
      case 'vehicle':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">License Plate Number</label>
              <input
                id="license-plate"
                type="text"
                placeholder="ABC 1234"
                className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
          </div>
        );
      case 'property':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">House/Flat Number</label>
              <input
                id="house-number"
                type="text"
                placeholder="123 or A-123"
                className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Floor Number (Optional)</label>
              <input
                id="floor-number"
                type="number"
                placeholder="5"
                className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
          </div>
        );
      case 'business':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Business Name</label>
              <input
                id="business-name"
                type="text"
                placeholder="My Business Inc."
                className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Registration Number (Optional)</label>
              <input
                id="registration-number"
                type="text"
                placeholder="REG123456"
                className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Launch Date (Optional)</label>
              <input
                id="launch-date"
                type="date"
                className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
        );
      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Phone Number</label>
              <input
                id="phone-number"
                type="tel"
                placeholder="+1 234 567 8900"
                className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
          </div>
        );
    }
  };

  const renderResults = () => {
    const result = results[activeType];
    if (!result) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <SpaceCard variant="premium" className="p-6" glow>
          <h3 className="text-xl font-bold text-white mb-4">Analysis Results</h3>
          
          {activeType === 'vehicle' && (
            <div className="space-y-4">
              {result.vibration_number && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Vibration Number</p>
                  <p className="text-3xl font-bold text-cyan-400">{result.vibration_number}</p>
                </div>
              )}
              {result.safety_score !== undefined && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Safety Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#1a2942] rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          result.safety_score >= 70 ? 'bg-green-500' :
                          result.safety_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.safety_score}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">{result.safety_score}/100</span>
                  </div>
                </div>
              )}
              {result.compatibility_with_owner && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Compatibility with Owner</p>
                  <p className="text-white">{result.compatibility_with_owner}</p>
                </div>
              )}
              {result.interpretation && (
                <div className="mt-4 pt-4 border-t border-cyan-500/20">
                  <p className="text-white/90">{result.interpretation}</p>
                </div>
              )}
            </div>
          )}

          {activeType === 'property' && (
            <div className="space-y-4">
              {result.house_number_vibration && (
                <div>
                  <p className="text-white/70 text-sm mb-1">House Number Vibration</p>
                  <p className="text-3xl font-bold text-cyan-400">{result.house_number_vibration}</p>
                </div>
              )}
              {result.compatibility_with_owner && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Compatibility with Owner</p>
                  <p className="text-white">{result.compatibility_with_owner}</p>
                </div>
              )}
              {result.energy_type && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Energy Type</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    result.energy_type === 'positive' ? 'bg-green-500/20 text-green-300' :
                    result.energy_type === 'neutral' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {result.energy_type}
                  </span>
                </div>
              )}
              {result.interpretation && (
                <div className="mt-4 pt-4 border-t border-cyan-500/20">
                  <p className="text-white/90">{result.interpretation}</p>
                </div>
              )}
            </div>
          )}

          {activeType === 'business' && (
            <div className="space-y-4">
              {result.business_vibration && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Business Vibration Number</p>
                  <p className="text-3xl font-bold text-cyan-400">{result.business_vibration}</p>
                </div>
              )}
              {result.success_potential !== undefined && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Success Potential</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#1a2942] rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          result.success_potential >= 70 ? 'bg-green-500' :
                          result.success_potential >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.success_potential}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">{result.success_potential}/100</span>
                  </div>
                </div>
              )}
              {result.recommended_actions && result.recommended_actions.length > 0 && (
                <div>
                  <p className="text-white/70 text-sm mb-2">Recommended Actions</p>
                  <ul className="space-y-2">
                    {result.recommended_actions.map((action: string, index: number) => (
                      <li key={index} className="text-white/90 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.interpretation && (
                <div className="mt-4 pt-4 border-t border-cyan-500/20">
                  <p className="text-white/90">{result.interpretation}</p>
                </div>
              )}
            </div>
          )}

          {activeType === 'phone' && (
            <div className="space-y-4">
              {result.vibration_number && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Phone Vibration Number</p>
                  <p className="text-3xl font-bold text-cyan-400">{result.vibration_number}</p>
                </div>
              )}
              {result.financial_influence && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Financial Influence</p>
                  <p className="text-white">{result.financial_influence}</p>
                </div>
              )}
              {result.stress_level && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Stress Level</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    result.stress_level === 'low' ? 'bg-green-500/20 text-green-300' :
                    result.stress_level === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {result.stress_level}
                  </span>
                </div>
              )}
              {result.interpretation && (
                <div className="mt-4 pt-4 border-t border-cyan-500/20">
                  <p className="text-white/90">{result.interpretation}</p>
                </div>
              )}
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h4 className="text-lg font-semibold text-red-300">Warnings</h4>
              </div>
              <ul className="space-y-2">
                {result.warnings.map((warning: string, index: number) => (
                  <li key={index} className="text-red-300 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SpaceCard>
      </motion.div>
    );
  };

  return (
    <ToolsHub>
      <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Asset Numerology Analysis
          </h1>
          <p className="text-white/70">
            Analyze the numerology vibrations of your vehicles, properties, businesses, and phone numbers
          </p>
        </div>

        {/* Asset Type Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-cyan-500/20 pb-4">
          {assetTypes.map((type) => {
            const Icon = type.icon;
            const isActive = activeType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all
                  flex items-center gap-2
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-white/70 hover:text-white hover:bg-[#1a2942]/60'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Type Description */}
        <SpaceCard variant="elevated" className="p-4">
          <p className="text-white/80">
            {assetTypes.find(t => t.id === activeType)?.description}
          </p>
        </SpaceCard>

        {/* Form */}
        <SpaceCard variant="premium" className="p-6" glow>
          <h2 className="text-xl font-bold text-white mb-4">Enter Details</h2>
          {renderForm()}
          <TouchOptimizedButton
            variant="primary"
            onClick={handleCalculate}
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Calculating...
              </>
            ) : (
              'Calculate Numerology'
            )}
          </TouchOptimizedButton>
        </SpaceCard>

        {/* Results */}
        {renderResults()}
      </div>
    </ToolsHub>
  );
}

