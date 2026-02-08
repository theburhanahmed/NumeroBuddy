'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { SpaceCard } from '@/components/space/space-card';
import { SpaceButton } from '@/components/space/space-button';
import { EngineResultCard } from '@/components/numerology/engine-result-card';
import { numerologyAPI } from '@/lib/numerology-api';
import { toast } from 'sonner';
import {
  CalculatorIcon,
  CalendarIcon,
  HeartIcon,
  Grid3X3Icon,
  HashIcon,
  Building2Icon,
  CompassIcon,
  HeartPulseIcon,
  Loader2Icon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EngineWarning } from '@/types/numerobuddy-engines';

type EngineId =
  | 'core-numbers'
  | 'personal-year'
  | 'compatibility'
  | 'lo-shu'
  | 'compound'
  | 'business'
  | 'kua'
  | 'health-kabala';

export default function NumerobuddyEnginesPage() {
  const [activeEngine, setActiveEngine] = useState<EngineId | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [warnings, setWarnings] = useState<EngineWarning[] | Record<string, unknown>[]>([]);
  const [enableValidation, setEnableValidation] = useState(false);

  // Form state per engine
  const [coreForm, setCoreForm] = useState({ day: 15, month: 6, year: 1990 });
  const [personalYearForm, setPersonalYearForm] = useState({
    birth_day: 15,
    birth_month: 6,
    birth_year: 1990,
    target_year: new Date().getFullYear(),
    driver_number: 3,
  });
  const [compatForm, setCompatForm] = useState({
    psychic1: 1,
    destiny1: 5,
    psychic2: 8,
    destiny2: 2,
  });
  const [loShuForm, setLoShuForm] = useState({
    dob_day: 15,
    dob_month: 6,
    dob_year: 1990,
    driver: 3,
    conductor: 9,
  });
  const [compoundForm, setCompoundForm] = useState({
    number: 60,
    prominent_numbers: '4,6,9',
  });
  const [businessForm, setBusinessForm] = useState({
    company_name: 'ABC PVT LTD',
    birth_number: 4,
    phone_number: '',
  });
  const [kuaForm, setKuaForm] = useState({ birth_year: 1990, gender: 'male' });
  const [healthForm, setHealthForm] = useState({ name: 'JOHN', birth_number: '' });

  const runEngine = async (engineId: EngineId) => {
    setActiveEngine(engineId);
    setLoading(true);
    setResult(null);
    setWarnings([]);

    try {
      let data: unknown;

      switch (engineId) {
        case 'core-numbers':
          data = await numerologyAPI.enginesCoreNumbers({
            day: coreForm.day,
            month: coreForm.month,
            year: coreForm.year,
            enable_validation: enableValidation,
          });
          break;
        case 'personal-year':
          data = await numerologyAPI.enginesPersonalYear({
            ...personalYearForm,
            enable_validation: enableValidation,
          });
          break;
        case 'compatibility':
          data = await numerologyAPI.enginesCompatibility81({
            ...compatForm,
            psychic2: compatForm.psychic2 || undefined,
            destiny2: compatForm.destiny2 || undefined,
            enable_validation: enableValidation,
          });
          break;
        case 'lo-shu':
          data = await numerologyAPI.enginesLoShuAnalyze({
            ...loShuForm,
            enable_validation: enableValidation,
          });
          break;
        case 'compound':
          data = await numerologyAPI.enginesCompoundNumber({
            number: compoundForm.number,
            prominent_numbers: compoundForm.prominent_numbers
              ? compoundForm.prominent_numbers.split(',').map((n) => parseInt(n.trim(), 10))
              : undefined,
            enable_validation: enableValidation,
          });
          break;
        case 'business':
          data = await numerologyAPI.enginesBusinessAnalyze({
            company_name: businessForm.company_name,
            birth_number: businessForm.birth_number,
            phone_number: businessForm.phone_number || undefined,
            enable_validation: enableValidation,
          });
          break;
        case 'kua':
          data = await numerologyAPI.enginesFengShuiKua({
            ...kuaForm,
            enable_validation: enableValidation,
          });
          break;
        case 'health-kabala':
          data = await numerologyAPI.enginesHealthKabala({
            name: healthForm.name,
            birth_number: healthForm.birth_number ? parseInt(healthForm.birth_number, 10) : undefined,
            enable_validation: enableValidation,
          });
          break;
        default:
          throw new Error('Unknown engine');
      }

      const payload = data as Record<string, unknown>;
      setResult(payload);

      const collected: unknown[] = [];
      const w = payload.warnings;
      if (Array.isArray(w)) {
        collected.push(...w);
      } else if (w && typeof w === 'object') {
        collected.push(w);
      }
      const biz = payload.business_name_analysis as Record<string, unknown> | undefined;
      if (biz?.warnings && Array.isArray(biz.warnings)) {
        collected.push(...(biz.warnings as unknown[]));
      }
      const mobile = payload.mobile_analysis as Record<string, unknown> | undefined;
      if (mobile?.warnings && Array.isArray(mobile.warnings)) {
        collected.push(...(mobile.warnings as unknown[]));
      }
      setWarnings(collected as EngineWarning[]);

      toast.success('Calculation complete');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Request failed';
      toast.error(String(message || 'Request failed'));
      setResult({ error: String(message) });
    } finally {
      setLoading(false);
    }
  };

  const engines: { id: EngineId; label: string; icon: React.ReactNode }[] = [
    { id: 'core-numbers', label: 'Birth & Destiny', icon: <CalculatorIcon className="w-5 h-5" /> },
    { id: 'personal-year', label: 'Personal Year', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'compatibility', label: '81 Compatibility', icon: <HeartIcon className="w-5 h-5" /> },
    { id: 'lo-shu', label: 'Lo Shu Grid', icon: <Grid3X3Icon className="w-5 h-5" /> },
    { id: 'compound', label: 'Compound Number', icon: <HashIcon className="w-5 h-5" /> },
    { id: 'business', label: 'Business & Mobile', icon: <Building2Icon className="w-5 h-5" /> },
    { id: 'kua', label: 'Kua / Feng Shui', icon: <CompassIcon className="w-5 h-5" /> },
    { id: 'health-kabala', label: 'Health & Kabala', icon: <HeartPulseIcon className="w-5 h-5" /> },
  ];

  return (
    <CosmicPageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display']">
            Numerobuddy Engines
          </h1>
          <p className="text-white/70 mt-1">
            Rule-based numerology with conflict resolution. All engines use only rule files and emit warnings where applicable.
          </p>
        </div>

        <SpaceCard variant="default" className="p-4">
          <label className="flex items-center gap-2 text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={enableValidation}
              onChange={(e) => setEnableValidation(e.target.checked)}
              className="rounded border-white/30 bg-white/10"
            />
            Include validation report (calculations, conflicts, risks)
          </label>
        </SpaceCard>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engines.map(({ id, label, icon }) => (
            <SpaceCard
              key={id}
              variant="interactive"
              onClick={() => setActiveEngine(id)}
              className={cn(
                'p-4 cursor-pointer transition-all',
                activeEngine === id && 'ring-2 ring-amber-500/50'
              )}
            >
              <div className="flex items-center gap-3 text-white">
                {icon}
                <span className="font-medium">{label}</span>
              </div>
            </SpaceCard>
          ))}
        </div>

        {activeEngine && (
          <SpaceCard variant="default" className="p-5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {engines.find((e) => e.id === activeEngine)?.label}
            </h2>

            {activeEngine === 'core-numbers' && (
              <div className="space-y-3 max-w-xs">
                <input
                  type="number"
                  placeholder="Day"
                  value={coreForm.day}
                  onChange={(e) => setCoreForm((p) => ({ ...p, day: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Month"
                  value={coreForm.month}
                  onChange={(e) => setCoreForm((p) => ({ ...p, month: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={coreForm.year}
                  onChange={(e) => setCoreForm((p) => ({ ...p, year: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
              </div>
            )}

            {activeEngine === 'personal-year' && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
                {(['birth_day', 'birth_month', 'birth_year', 'target_year', 'driver_number'] as const).map(
                  (key) => (
                    <input
                      key={key}
                      type="number"
                      placeholder={key.replace(/_/g, ' ')}
                      value={personalYearForm[key]}
                      onChange={(e) =>
                        setPersonalYearForm((p) => ({
                          ...p,
                          [key]: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                    />
                  )
                )}
              </div>
            )}

            {activeEngine === 'compatibility' && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
                <input
                  type="number"
                  placeholder="Psychic 1"
                  value={compatForm.psychic1}
                  onChange={(e) => setCompatForm((p) => ({ ...p, psychic1: parseInt(e.target.value, 10) || 0 }))}
                  className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Destiny 1"
                  value={compatForm.destiny1}
                  onChange={(e) => setCompatForm((p) => ({ ...p, destiny1: parseInt(e.target.value, 10) || 0 }))}
                  className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Psychic 2"
                  value={compatForm.psychic2}
                  onChange={(e) => setCompatForm((p) => ({ ...p, psychic2: parseInt(e.target.value, 10) || 0 }))}
                  className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Destiny 2"
                  value={compatForm.destiny2}
                  onChange={(e) => setCompatForm((p) => ({ ...p, destiny2: parseInt(e.target.value, 10) || 0 }))}
                  className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
              </div>
            )}

            {activeEngine === 'lo-shu' && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
                {(['dob_day', 'dob_month', 'dob_year', 'driver', 'conductor'] as const).map((key) => (
                  <input
                    key={key}
                    type="number"
                    placeholder={key.replace(/_/g, ' ')}
                    value={loShuForm[key]}
                    onChange={(e) =>
                      setLoShuForm((p) => ({
                        ...p,
                        [key]: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                  />
                ))}
              </div>
            )}

            {activeEngine === 'compound' && (
              <div className="space-y-3 max-w-xs">
                <input
                  type="number"
                  placeholder="Compound number (1–73)"
                  value={compoundForm.number}
                  onChange={(e) => setCompoundForm((p) => ({ ...p, number: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Prominent numbers (e.g. 4,6,9)"
                  value={compoundForm.prominent_numbers}
                  onChange={(e) => setCompoundForm((p) => ({ ...p, prominent_numbers: e.target.value }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
              </div>
            )}

            {activeEngine === 'business' && (
              <div className="space-y-3 max-w-md">
                <input
                  type="text"
                  placeholder="Company name"
                  value={businessForm.company_name}
                  onChange={(e) => setBusinessForm((p) => ({ ...p, company_name: e.target.value }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Birth number"
                  value={businessForm.birth_number}
                  onChange={(e) => setBusinessForm((p) => ({ ...p, birth_number: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Phone (optional)"
                  value={businessForm.phone_number}
                  onChange={(e) => setBusinessForm((p) => ({ ...p, phone_number: e.target.value }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
              </div>
            )}

            {activeEngine === 'kua' && (
              <div className="flex flex-wrap gap-3 max-w-md">
                <input
                  type="number"
                  placeholder="Birth year"
                  value={kuaForm.birth_year}
                  onChange={(e) => setKuaForm((p) => ({ ...p, birth_year: parseInt(e.target.value, 10) || 0 }))}
                  className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white w-32"
                />
                <select
                  value={kuaForm.gender}
                  onChange={(e) => setKuaForm((p) => ({ ...p, gender: e.target.value }))}
                  className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            )}

            {activeEngine === 'health-kabala' && (
              <div className="space-y-3 max-w-xs">
                <input
                  type="text"
                  placeholder="Name"
                  value={healthForm.name}
                  onChange={(e) => setHealthForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Birth number (optional)"
                  value={healthForm.birth_number}
                  onChange={(e) => setHealthForm((p) => ({ ...p, birth_number: e.target.value }))}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
                />
              </div>
            )}

            <div className="mt-4">
              <SpaceButton
                onClick={() => runEngine(activeEngine)}
                disabled={loading}
                className="min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                    Calculating…
                  </>
                ) : (
                  'Calculate'
                )}
              </SpaceButton>
            </div>
          </SpaceCard>
        )}

        {result && (
          <EngineResultCard
            title={
              activeEngine
                ? `${engines.find((e) => e.id === activeEngine)?.label ?? activeEngine} — Result`
                : 'Result'
            }
            result={result}
            warnings={warnings}
          />
        )}
      </motion.div>
    </CosmicPageLayout>
  );
}
