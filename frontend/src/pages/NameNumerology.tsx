import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TypeIcon, SparklesIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { numerologyAPI } from '../lib/numerology-api';
import { reportsAPI } from '../lib/api-client';
import { ReportLayout } from '../components/ReportLayout';
import { useAuth } from '../contexts/AuthContext';

export function NameNumerology() {
  const navigate = useNavigate();
  const { entitlements } = useAuth();
  const [name, setName] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasNameNumerologyAccess = entitlements?.features.name_numerology?.enabled === true;

  const previewNameNumerology = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setResult(await numerologyAPI.previewNameNumerology({ name: name.trim(), name_type: 'full_name', system: 'chaldean' }));
    } catch (err: any) {
      setResult(null);
      setError(err?.response?.data?.error || 'Unable to analyze this name.');
    } finally {
      setIsLoading(false);
    }
  };

  const nameNumber = result?.numbers?.expression_number ?? result?.numbers?.destiny_number ?? result?.numbers?.name_number;

  const save = async () => {
    if (!result) return;
    await reportsAPI.saveUniversal({ report_type: 'name', title: `Name Report — ${name}`, input_data: { name, system: 'chaldean' }, calculated_results: result, recommendations: result.suggestions || [] });
  };

  return (
    <CosmicPageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg"><TypeIcon className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">Name Numerology</h1><p className="text-white/70">View the server-calculated Chaldean number breakdown for your name</p></div>
        </div>
      </motion.div>

      <SpaceCard variant="premium" className="p-6 md:p-8 mb-8">
        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Enter Your Full Name</label>
        <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />
        {hasNameNumerologyAccess ? (
          <TouchOptimizedButton variant="primary" size="lg" onClick={previewNameNumerology} disabled={!name.trim() || isLoading} icon={<SparklesIcon className="w-5 h-5" />} className="w-full mt-6" ariaLabel="Calculate name number">
            {isLoading ? 'Calculating...' : 'Calculate'}
          </TouchOptimizedButton>
        ) : (
          <div className="mt-6 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-center">
            <p className="mb-3 text-white/80">Name Numerology is available on the Basic plan and above.</p>
            <TouchOptimizedButton variant="primary" size="lg" onClick={() => navigate('/pricing')} icon={<SparklesIcon className="w-5 h-5" />} className="w-full" ariaLabel="View subscription plans">
              View Plans
            </TouchOptimizedButton>
          </div>
        )}
        {error && <p className="text-red-400 mt-4" role="alert">{error}</p>}
      </SpaceCard>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
          <ReportLayout onSave={save} title="Name Numerology Report" subtitle={result.normalized_name} sections={[{ title: 'Core Numbers', content: <div>{Object.entries(result.numbers || {}).filter(([, value]) => typeof value === 'number').map(([key, value]) => <p key={key}>{key.replaceAll('_', ' ')}: {String(value)}</p>)}</div> }, { title: 'Analysis', content: typeof result.breakdown === 'string' ? result.breakdown : 'Server-calculated Chaldean analysis.' }]} />
          <SpaceCard variant="premium" className="p-6 md:p-8 text-center">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">Name Analysis</h2>
            {typeof nameNumber === 'number' && <div className="flex justify-center mb-6"><CrystalNumerologyCube number={nameNumber} size="lg" color="purple" /></div>}
            <p className="text-xl text-white/80 leading-relaxed">{result.normalized_name}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-8 text-left">{Object.entries(result.numbers || {}).filter(([, value]) => typeof value === 'number').map(([key, value]) => <div key={key} className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20"><p className="text-sm text-white/60 capitalize">{key.replaceAll('_', ' ')}</p><p className="text-2xl font-bold text-white">{String(value)}</p></div>)}</div>
          </SpaceCard>
        </motion.div>
      )}
    </CosmicPageLayout>
  );
}
