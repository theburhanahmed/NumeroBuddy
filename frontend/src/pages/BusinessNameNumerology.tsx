import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, TrendingUpIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { numerologyAPI } from '../lib/numerology-api';
import { reportsAPI } from '../lib/api-client';
import { ReportLayout } from '../components/ReportLayout';

export function BusinessNameNumerology() {
  const [businessName, setBusinessName] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeBusiness = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setResult(await numerologyAPI.analyzeBusiness({ business_name: businessName.trim() }));
    } catch (err: any) {
      setResult(null);
      setError(err?.response?.data?.error || 'Unable to analyze this business name.');
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    if (!result) return;
    await reportsAPI.saveUniversal({ report_type: 'business', title: `Business Report — ${businessName}`, input_data: { business_name: businessName }, calculated_results: result, recommendations: result.recommendations || [] });
  };

  return (
    <CosmicPageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <BriefcaseIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">Business Name Numerology</h1>
            <p className="text-white/70">Analyze your business name with your personalized numerology profile</p>
          </div>
        </div>
      </motion.div>

      <SpaceCard variant="premium" className="p-6 md:p-8 mb-8">
        <label htmlFor="businessName" className="block text-sm font-medium text-white mb-2">Enter Business Name</label>
        <input id="businessName" type="text" value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Acme Corporation" className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />
        <TouchOptimizedButton variant="primary" size="lg" onClick={analyzeBusiness} disabled={!businessName.trim() || isLoading} icon={<TrendingUpIcon className="w-5 h-5" />} className="w-full mt-6" ariaLabel="Analyze business name">
          {isLoading ? 'Analyzing...' : 'Analyze Name'}
        </TouchOptimizedButton>
        {error && <p className="text-red-400 mt-4" role="alert">{error}</p>}
      </SpaceCard>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
          <ReportLayout onSave={save} title="Business Numerology Report" subtitle={businessName} sections={[{ title: 'Business Analysis', content: <><div className="flex justify-center mb-6"><CrystalNumerologyCube number={result.name_vibration} size="lg" color="green" /></div><p>{result.interpretation}</p></> }, { title: 'Recommendations', content: <ul>{(result.recommendations || []).map((recommendation: string) => <li key={recommendation}>{recommendation}</li>)}</ul> }]} />
          <SpaceCard variant="premium" className="p-6 md:p-8 text-center">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">Business Analysis</h2>
            <div className="flex justify-center mb-6"><CrystalNumerologyCube number={result.name_vibration} size="lg" color="green" /></div>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">{result.interpretation}</p>
            {Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
              <div className="text-left mt-8"><h3 className="font-semibold text-white mb-3">Recommendations</h3><ul className="space-y-2 text-white/70">{result.recommendations.map((recommendation: string) => <li key={recommendation}>{recommendation}</li>)}</ul></div>
            )}
          </SpaceCard>
        </motion.div>
      )}
    </CosmicPageLayout>
  );
}
