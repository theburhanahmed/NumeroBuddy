import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, SparklesIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { numerologyAPI } from '../lib/numerology-api';
import { reportsAPI } from '../lib/api-client';
import { ReportLayout } from '../components/ReportLayout';

export function PhoneNumerology() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzePhoneNumber = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setResult(await numerologyAPI.analyzePhoneAsset(phoneNumber));
    } catch (err: any) {
      setResult(null);
      setError(err?.response?.data?.error || 'Unable to analyze this phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    if (!result) return;
    await reportsAPI.saveUniversal({ report_type: 'phone', title: 'Phone Numerology Report', input_data: { phone_number: phoneNumber }, calculated_results: result, recommendations: result.recommendations || [] });
  };

  return (
    <CosmicPageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"><PhoneIcon className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">Phone Numerology</h1><p className="text-white/70">Analyze your phone number with the Asset Numerology service</p></div>
        </div>
      </motion.div>

      <SpaceCard variant="premium" className="p-6 md:p-8 mb-8">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-2">Enter Phone Number</label>
        <input id="phoneNumber" type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+1 (555) 123-4567" className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />
        <TouchOptimizedButton variant="primary" size="lg" onClick={analyzePhoneNumber} disabled={!phoneNumber.trim() || isLoading} icon={<SparklesIcon className="w-5 h-5" />} className="w-full mt-6" ariaLabel="Analyze phone number">
          {isLoading ? 'Analyzing...' : 'Analyze Number'}
        </TouchOptimizedButton>
        {error && <p className="text-red-400 mt-4" role="alert">{error}</p>}
      </SpaceCard>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
          <ReportLayout onSave={save} title="Phone Numerology Report" subtitle={phoneNumber} sections={[{ title: 'Analysis', content: result.interpretation }, { title: 'Strengths', content: result.financial_influence }, { title: 'Challenges', content: result.stress_influence }, { title: 'Recommendations', content: <ul>{(result.recommendations || []).map((item: string) => <li key={item}>{item}</li>)}</ul> }]} />
          <SpaceCard variant="premium" className="p-6 md:p-8 text-center">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">Phone Number Report</h2>
            <div className="flex justify-center mb-6"><CrystalNumerologyCube number={result.vibration_number} size="lg" color="blue" /></div>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">{result.interpretation}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-8 text-left">
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"><h3 className="font-semibold text-white mb-2">Financial Influence</h3><p className="text-white/70">{result.financial_influence}</p></div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20"><h3 className="font-semibold text-white mb-2">Stress Influence</h3><p className="text-white/70">{result.stress_influence}</p></div>
            </div>
          </SpaceCard>
        </motion.div>
      )}
    </CosmicPageLayout>
  );
}
