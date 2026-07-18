import React, { useState } from 'react';
import { CarIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { ReportLayout } from '../components/ReportLayout';
import { numerologyAPI } from '../lib/numerology-api';
import { reportsAPI } from '../lib/api-client';

export function VehicleNumerology() {
  const [licensePlate, setLicensePlate] = useState('');
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setReport(await numerologyAPI.analyzeVehicle(licensePlate));
    } catch (err: any) {
      setReport(null);
      setError(err?.response?.data?.error || 'Unable to analyze this vehicle.');
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    if (!report) return;
    await reportsAPI.saveUniversal({ report_type: 'vehicle', title: `Vehicle Report — ${report.license_plate}`, input_data: { license_plate: licensePlate }, calculated_results: report, recommendations: report.recommendations || [] });
  };

  return <CosmicPageLayout>
    <div className="flex items-center gap-4 mb-8"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center"><CarIcon className="w-6 h-6 text-white" /></div><div><h1 className="text-4xl font-serif text-white">Vehicle Numerology</h1><p className="text-white/70">Server-calculated license plate analysis</p></div></div>
    <SpaceCard variant="premium" className="p-6 mb-8"><label htmlFor="licensePlate" className="block text-sm font-medium text-white mb-2">License plate</label><input id="licensePlate" value={licensePlate} onChange={(event) => setLicensePlate(event.target.value)} className="w-full px-4 py-3 bg-[#0a1628]/60 border border-cyan-500/20 rounded-xl text-white" placeholder="ABC-1234" /><TouchOptimizedButton variant="primary" size="lg" className="w-full mt-6" ariaLabel="Analyze vehicle" onClick={analyze} disabled={!licensePlate.trim() || isLoading}>{isLoading ? 'Analyzing...' : 'Generate Vehicle Report'}</TouchOptimizedButton>{error && <p className="text-red-400 mt-4" role="alert">{error}</p>}</SpaceCard>
    {report && <ReportLayout onSave={save} title="Vehicle Numerology Report" subtitle={report.license_plate} sections={[{ title: 'Vibration Number', content: <div className="flex items-center gap-6"><CrystalNumerologyCube number={report.vibration_number} size="md" color="purple" /><p>Safety score: {report.safety_score}</p></div> }, { title: 'Analysis', content: report.interpretation }, { title: 'Recommendations', content: <ul>{(report.recommendations || []).map((item: string) => <li key={item}>{item}</li>)}</ul> }, { title: 'Owner Compatibility', content: report.compatibility_with_owner || 'Complete your profile to calculate owner compatibility.' }]} />}
  </CosmicPageLayout>;
}
