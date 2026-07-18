import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, SearchIcon, StarIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { numerologyAPI } from '../lib/numerology-api';

export function AngelNumbers() {
  const [numberInput, setNumberInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!numberInput.trim()) {
      setError('Please enter a number sequence to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await numerologyAPI.analyzeAngelNumbers(numberInput);
      setResult(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to analyze angel numbers.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPatterns = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '1111', '1212'];

  return (
    <CosmicPageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">Angel Numbers</h1>
            <p className="text-white/70">Discover the spiritual messages hidden in number sequences</p>
          </div>
        </div>
      </motion.div>

      <SpaceCard variant="premium" className="p-6 md:p-8 mb-8">
        <label htmlFor="angelInput" className="block text-sm font-medium text-white mb-2">Enter a number sequence</label>
        <div className="flex gap-3">
          <input
            id="angelInput"
            type="text"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            placeholder="e.g. 111, 444, 1212..."
            className="flex-1 px-4 py-3 bg-[#0a1628]/60 border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
          />
          <TouchOptimizedButton variant="primary" size="lg" onClick={handleAnalyze} disabled={isLoading} ariaLabel="Analyze angel numbers">
            {isLoading ? 'Analyzing...' : <><SearchIcon className="w-4 h-4 mr-2" />Analyze</>}
          </TouchOptimizedButton>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {quickPatterns.map((pattern) => (
            <button
              key={pattern}
              onClick={() => { setNumberInput(pattern); }}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-cyan-500/20 hover:border-cyan-400/30 transition-all"
            >
              {pattern}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 mt-4" role="alert">{error}</p>}
      </SpaceCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {result.is_angel_number && result.detected_patterns?.length > 0 ? (
            result.detected_patterns.map((pattern: any, i: number) => (
              <SpaceCard key={i} variant="default" className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{pattern.pattern}</span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-400 text-sm font-medium">{pattern.name}</span>
                    </div>
                    <p className="text-white/90 text-lg mb-3">{pattern.message}</p>
                  </div>
                  <StarIcon className="w-8 h-8 text-amber-400 fill-amber-400/30 flex-shrink-0" />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Guidance</p>
                    <p className="text-white/80 text-sm">{pattern.guidance}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Chakra</p>
                    <p className="text-white/80 text-sm">{pattern.chakra}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Element</p>
                    <p className="text-white/80 text-sm">{pattern.element}</p>
                  </div>
                </div>
              </SpaceCard>
            ))
          ) : (
            <SpaceCard variant="default" className="p-6 text-center">
              <p className="text-white/70">No recognized angel number patterns found in "{result.input}".</p>
              <p className="text-white/50 text-sm mt-2">The reduced number is {result.reduced_number}. Try entering repeating sequences like 111, 222, or 1212.</p>
            </SpaceCard>
          )}
        </motion.div>
      )}
    </CosmicPageLayout>
  );
}
