import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainIcon, LayersIcon, RefreshCwIcon, BarChart3Icon, RepeatIcon, CircleDotIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { numerologyAPI } from '../lib/numerology-api';

type Tab = 'bridge' | 'transit' | 'repeated' | 'lifecycle' | 'rational';

export function AdvancedNumerology() {
  const [activeTab, setActiveTab] = useState<Tab>('bridge');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transitYear, setTransitYear] = useState(new Date().getFullYear());

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'bridge', label: 'Bridge Numbers', icon: <LayersIcon className="w-4 h-4" /> },
    { id: 'transit', label: 'Transit Letters', icon: <RefreshCwIcon className="w-4 h-4" /> },
    { id: 'repeated', label: 'Number Intensity', icon: <BarChart3Icon className="w-4 h-4" /> },
    { id: 'lifecycle', label: 'Life Cycles', icon: <CircleDotIcon className="w-4 h-4" /> },
    { id: 'rational', label: 'Rational Thought', icon: <BrainIcon className="w-4 h-4" /> },
  ];

  const loadData = async (tab: Tab) => {
    setIsLoading(true);
    setError(null);
    try {
      switch (tab) {
        case 'bridge': setData(await numerologyAPI.getBridgeNumbers()); break;
        case 'transit': setData(await numerologyAPI.getTransitLetters(transitYear)); break;
        case 'repeated': setData(await numerologyAPI.getRepeatedNumbers()); break;
        case 'lifecycle': setData(await numerologyAPI.getLifeCycles()); break;
        case 'rational': setData(await numerologyAPI.getRationalThoughtNumber()); break;
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(activeTab); }, [activeTab, transitYear]);

  const intensityColor = (intensity: string) => {
    switch (intensity) {
      case 'dominant': return 'bg-red-500/30 border-red-400/40 text-red-400';
      case 'strong': return 'bg-amber-500/30 border-amber-400/40 text-amber-400';
      case 'normal': return 'bg-green-500/30 border-green-400/40 text-green-400';
      case 'absent': return 'bg-gray-500/20 border-gray-400/20 text-gray-400';
      default: return 'bg-white/5 border-white/10 text-white/60';
    }
  };

  return (
    <CosmicPageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <BrainIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">Advanced Numerology</h1>
            <p className="text-white/70">Deep analysis of your numerological profile</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setData(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 mb-6" role="alert">{error}</p>}
      {isLoading && <p className="text-white/60 text-center py-12">Loading...</p>}

      {data && !isLoading && (
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Bridge Numbers */}
          {activeTab === 'bridge' && (
            <>
              <p className="text-white/60 text-sm mb-4">{data.summary}</p>
              {data.bridge_numbers?.map((bridge: any) => (
                <SpaceCard key={bridge.bridge_number} variant="default" className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">{bridge.value}</span>
                    <div>
                      <h3 className="text-white font-bold">Bridge {bridge.bridge_number}: {bridge.between}</h3>
                      <p className="text-white/60 text-sm">{bridge.description}</p>
                    </div>
                  </div>
                  <p className="text-cyan-300 text-sm mt-2">{bridge.advice}</p>
                </SpaceCard>
              ))}
            </>
          )}

          {/* Transit Letters */}
          {activeTab === 'transit' && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setTransitYear(transitYear - 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10">Prev</button>
                <span className="text-white font-bold text-xl">{transitYear}</span>
                <button onClick={() => setTransitYear(transitYear + 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10">Next</button>
                <span className="text-white/50 text-sm ml-2">Age: {data.transit_letters?.age}</span>
              </div>
              <p className="text-white/60 text-sm mb-4">{data.summary}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {['physical', 'mental', 'spiritual'].map((type) => {
                  const t = data.transit_letters?.[type];
                  return (
                    <SpaceCard key={type} variant="default" className="p-6 text-center">
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-2">{type} Transit</p>
                      <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">{t?.letter || '-'}</p>
                      <p className="text-white/70 text-sm">Value: {t?.value || 0}</p>
                      <p className="text-white/50 text-xs mt-1">{t?.years_remaining || 0} year(s) remaining</p>
                    </SpaceCard>
                  );
                })}
              </div>
              <SpaceCard variant="premium" className="p-6 mt-4 text-center">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Essence Number</p>
                <p className="text-4xl font-bold text-amber-400">{data.transit_letters?.essence_number}</p>
                <p className="text-white/60 text-sm mt-1">The combined influence of all transit letters this year</p>
              </SpaceCard>
            </>
          )}

          {/* Repeated Numbers / Intensity */}
          {activeTab === 'repeated' && (
            <>
              <SpaceCard variant="premium" className="p-6 text-center mb-4">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Balance Score</p>
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">{data.balance_score}/100</p>
                <p className="text-white/60 text-sm mt-1">Higher is more balanced across all numbers</p>
              </SpaceCard>
              <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
                {data.number_analysis?.map((item: any) => (
                  <div key={item.number} className={`aspect-square rounded-xl border flex flex-col items-center justify-center ${intensityColor(item.intensity)}`} title={item.trait}>
                    <span className="text-2xl font-bold">{item.number}</span>
                    <span className="text-[10px] uppercase">{item.intensity}</span>
                    <span className="text-xs opacity-60">x{item.count}</span>
                  </div>
                ))}
              </div>
              {data.dominant_numbers?.length > 0 && (
                <SpaceCard variant="default" className="p-6 mt-4">
                  <h3 className="text-lg font-bold text-red-400 mb-3">Dominant Numbers (Overemphasized)</h3>
                  {data.dominant_numbers.map((d: any) => (
                    <div key={d.number} className="mb-4 last:mb-0">
                      <p className="text-white font-medium">Number {d.number} - {d.trait} ({d.count}x in: {d.sources.join(', ')})</p>
                      <p className="text-white/70 text-sm mt-1">{d.interpretation}</p>
                      {d.remedy && <p className="text-cyan-300 text-sm mt-1">{d.remedy}</p>}
                    </div>
                  ))}
                </SpaceCard>
              )}
            </>
          )}

          {/* Life Cycles */}
          {activeTab === 'lifecycle' && (
            <>
              <p className="text-white/60 text-sm mb-4">{data.summary}</p>
              {data.life_cycles?.map((cycle: any) => (
                <SpaceCard key={cycle.cycle} variant={cycle.is_active ? 'premium' : 'default'} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">{cycle.number}</span>
                      <div>
                        <h3 className="text-white font-bold">{cycle.name}</h3>
                        <p className="text-white/60 text-sm">Age {cycle.start_age} - {cycle.end_age ?? 'End'}</p>
                      </div>
                    </div>
                    {cycle.is_active && <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-400 text-xs font-medium">Active</span>}
                  </div>
                  <p className="text-cyan-300 text-sm mb-2">{cycle.theme}</p>
                  <p className="text-white/70 text-sm">{cycle.description}</p>
                </SpaceCard>
              ))}
            </>
          )}

          {/* Rational Thought */}
          {activeTab === 'rational' && (
            <SpaceCard variant="premium" className="p-8 text-center">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Rational Thought Number</p>
              <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500 mb-4">{data.rational_thought_number}</p>
              <p className="text-white/80 text-lg max-w-xl mx-auto">{data.interpretation}</p>
              <div className="flex justify-center gap-8 mt-6 text-sm text-white/50">
                <div>First name: <span className="text-white/80">{data.first_name}</span></div>
                <div>Birth day: <span className="text-white/80">{data.birth_day}</span></div>
              </div>
            </SpaceCard>
          )}
        </motion.div>
      )}
    </CosmicPageLayout>
  );
}
