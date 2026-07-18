import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CopyIcon, PinIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { reportsAPI } from '../lib/api-client';

const reportTypes = ['', 'personal', 'business', 'phone', 'vehicle', 'name', 'compatibility'];

export function ReportHistory() {
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reportsAPI.listUniversal({ search: search || undefined, type: type || undefined });
      setReports(response.data.results || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to load report history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [type]);

  const remove = async (id: string) => {
    await reportsAPI.deleteUniversal(id);
    setReports((current) => current.filter((report) => report.id !== id));
  };

  const duplicate = async (id: string) => {
    const response = await reportsAPI.duplicateUniversal(id);
    setReports((current) => [response.data, ...current]);
  };

  const togglePinned = async (report: any) => {
    const response = await reportsAPI.updateUniversal(report.id, { is_pinned: !report.is_pinned });
    setReports((current) => current.map((item) => item.id === report.id ? response.data : item));
  };

  return <CosmicPageLayout>
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><h1 className="text-4xl font-serif text-white">Report History</h1><p className="text-white/70">Your saved numerology reports</p></div><Link to="/dashboard" className="text-cyan-400">Back to dashboard</Link></div>
    <SpaceCard variant="premium" className="p-6 mb-6"><div className="grid md:grid-cols-[1fr_180px_auto] gap-3"><label className="relative"><SearchIcon className="absolute left-3 top-3 text-white/50 w-5 h-5" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports" className="w-full pl-10 px-4 py-3 bg-[#0a1628]/60 border border-cyan-500/20 rounded-xl text-white" /></label><select value={type} onChange={(event) => setType(event.target.value)} className="px-4 py-3 bg-[#0a1628]/60 border border-cyan-500/20 rounded-xl text-white">{reportTypes.map((item) => <option key={item} value={item}>{item || 'All report types'}</option>)}</select><button onClick={load} className="px-5 py-3 rounded-xl bg-cyan-500 text-white">Search</button></div></SpaceCard>
    {isLoading && <p className="text-white/70">Loading reports...</p>}{error && <p className="text-red-400">{error}</p>}
    {!isLoading && !error && reports.length === 0 && <SpaceCard className="p-6"><p className="text-white/70">No universal reports yet. Generate and save a report from a calculator to see it here.</p></SpaceCard>}
    <div className="space-y-4">{reports.map((report) => <SpaceCard key={report.id} className="p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-wide text-cyan-400">{report.report_type}</p><h2 className="text-xl text-white">{report.title}</h2><p className="text-sm text-white/60">{new Date(report.updated_at).toLocaleString()}</p></div><div className="flex gap-2"><button onClick={() => togglePinned(report)} className="p-3 rounded-xl bg-white/10 text-white" aria-label="Pin report"><PinIcon className={`w-5 h-5 ${report.is_pinned ? 'fill-current text-cyan-400' : ''}`} /></button><button onClick={() => duplicate(report.id)} className="p-3 rounded-xl bg-white/10 text-white" aria-label="Duplicate report"><CopyIcon className="w-5 h-5" /></button><button onClick={() => remove(report.id)} className="p-3 rounded-xl bg-red-500/20 text-red-300" aria-label="Delete report"><TrashIcon className="w-5 h-5" /></button></div></div></SpaceCard>)}</div>
  </CosmicPageLayout>;
}
