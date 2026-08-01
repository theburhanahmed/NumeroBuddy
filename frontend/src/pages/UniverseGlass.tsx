import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, CheckCircle2Icon, CrownIcon, DownloadIcon, GitBranchIcon, Loader2Icon, PlusIcon, SparklesIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { useAuth } from '../contexts/AuthContext';
import { CrossEntityAnalysis, EntityPayload, InfluenceMap, meusAPI, NextAction, UniverseDashboard, UniverseEntity, UniverseEvent, UniverseEntityType } from '../lib/meus-api';

const cardClass = 'rounded-3xl border border-cyan-500/20 bg-[#1a2942]/60 p-5 backdrop-blur-xl md:p-6';
const inputClass = 'w-full rounded-xl border border-cyan-500/20 bg-[#0a1628]/60 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors focus:border-cyan-400/60';

const asText = (value: unknown) => typeof value === 'string' ? value : '';
const apiError = (error: any, fallback: string) => error?.response?.data?.error?.message || error?.response?.data?.detail || (typeof error?.response?.data?.error === 'string' ? error.response.data.error : fallback);
const displayDate = (event: UniverseEvent) => event.event_date || event.created_at;
type CreateUniverseEntity = EntityPayload & { asset_type?: 'vehicle' | 'property' | 'business' | 'phone'; asset_number?: string };

function EntityForm({ onCreate, saving }: { onCreate: (payload: CreateUniverseEntity) => Promise<void>; saving: boolean }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<UniverseEntityType>('person');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [assetType, setAssetType] = useState<'vehicle' | 'property' | 'business' | 'phone'>('vehicle');
  const [assetNumber, setAssetNumber] = useState('');
  const [description, setDescription] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || (type === 'person' && !dateOfBirth) || (type === 'asset' && !assetNumber.trim())) return;
    const metadata = description.trim() ? { description: description.trim() } : undefined;
    await onCreate(type === 'person'
      ? { name: name.trim(), entity_type: type, date_of_birth: dateOfBirth, relationship_type: relationshipType.trim() || undefined, metadata }
      : { name: name.trim(), entity_type: type, relationship_type: relationshipType.trim() || undefined, metadata, ...(type === 'asset' ? { asset_type: assetType, asset_number: assetNumber.trim() } : {}) });
    setName('');
    setDateOfBirth('');
    setRelationshipType('');
    setAssetNumber('');
    setDescription('');
  };

  return <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
    <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="Name your person, asset, or event" aria-label="Entity name" />
    <select value={type} onChange={(event) => setType(event.target.value as UniverseEntityType)} className={inputClass} aria-label="Entity type">
      <option value="person">Person</option><option value="asset">Asset</option><option value="event">Event</option>
    </select>
    {type === 'person' && <input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className={inputClass} aria-label="Date of birth" required />}
    {type === 'asset' && <><select value={assetType} onChange={(event) => setAssetType(event.target.value as typeof assetType)} className={inputClass} aria-label="Asset type"><option value="vehicle">Vehicle</option><option value="property">Property</option><option value="business">Business</option><option value="phone">Phone</option></select><input value={assetNumber} onChange={(event) => setAssetNumber(event.target.value)} className={inputClass} placeholder="Plate, address, business, or phone number" aria-label="Asset number" required /></>}
    <select value={relationshipType} onChange={(event) => setRelationshipType(event.target.value)} className={inputClass} aria-label="Relationship type"><option value="">Relationship (optional)</option><option value="family">Family</option><option value="friend">Friend</option><option value="partner">Romantic partner</option><option value="colleague">Colleague</option><option value="business_partner">Business partner</option><option value="child">Child</option><option value="client">Client</option><option value="other">Other</option></select>
    <input value={description} onChange={(event) => setDescription(event.target.value)} className={inputClass} placeholder="A short context note (optional)" aria-label="Entity description" />
    <button disabled={saving || !name.trim() || (type === 'person' && !dateOfBirth) || (type === 'asset' && !assetNumber.trim())} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
      {saving ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <PlusIcon className="h-4 w-4" />} Add to universe
    </button>
  </form>;
}

export function UniverseGlass() {
  const navigate = useNavigate();
  const { entitlements, isEntitlementsLoading } = useAuth();
  const feature = entitlements?.features.meus_entities;
  const hasAccess = feature?.enabled === true;
  const hasRecommendationAccess = entitlements?.features.meus_recommendations?.enabled === true;
  const hasReportAccess = entitlements?.features.meus_reports?.enabled === true;
  const [dashboard, setDashboard] = useState<UniverseDashboard | null>(null);
  const [entities, setEntities] = useState<UniverseEntity[]>([]);
  const [events, setEvents] = useState<UniverseEvent[]>([]);
  const [actions, setActions] = useState<NextAction[]>([]);
  const [influence, setInfluence] = useState<InfluenceMap | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<CrossEntityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('other');
  const [eventDate, setEventDate] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const results = await Promise.allSettled([meusAPI.getDashboard(), meusAPI.listEntities(), meusAPI.listEvents(), hasRecommendationAccess ? meusAPI.getNextActions() : Promise.resolve([]), meusAPI.getInfluenceMap()]);
    const [dashboardResult, entitiesResult, eventsResult, actionsResult, influenceResult] = results;
    if (dashboardResult.status === 'fulfilled') setDashboard(dashboardResult.value.data);
    if (entitiesResult.status === 'fulfilled') setEntities(entitiesResult.value);
    if (eventsResult.status === 'fulfilled') setEvents(eventsResult.value);
    if (actionsResult.status === 'fulfilled') setActions(actionsResult.value);
    if (influenceResult.status === 'fulfilled') setInfluence(influenceResult.value.data);
    if (results.every((result) => result.status === 'rejected')) setError('Your universe could not be loaded. Please refresh and try again.');
    setIsLoading(false);
  }, [hasRecommendationAccess]);

  useEffect(() => { if (hasAccess) void load(); else setIsLoading(false); }, [hasAccess, load]);

  const createEntity = async (payload: CreateUniverseEntity) => {
    setIsSaving(true); setError(null);
    let createdEntity: UniverseEntity | null = null;
    try {
      const { asset_type, asset_number, ...entityPayload } = payload;
      const response = await meusAPI.createEntity(entityPayload as EntityPayload);
      createdEntity = response.data;
      if (entityPayload.entity_type === 'asset' && asset_type && asset_number) {
        await meusAPI.createAsset({ entity: response.data.id, asset_type, asset_number });
      }
      setEntities((current) => [response.data, ...current]);
    } catch (err: any) {
      if (createdEntity) await meusAPI.deleteEntity(createdEntity.id).catch(() => undefined);
      setError(apiError(err, 'Unable to add this entity.'));
    } finally { setIsSaving(false); }
  };

  const removeEntity = async (id: string) => {
    try { await meusAPI.deleteEntity(id); setEntities((current) => current.filter((entity) => entity.id !== id)); setSelectedIds((current) => current.filter((selectedId) => selectedId !== id)); }
    catch (err: any) { setError(apiError(err, 'Unable to remove this entity.')); }
  };

  const createEvent = async (event: FormEvent) => {
    event.preventDefault();
    if (!eventTitle.trim() || !eventDate) return;
    setIsSaving(true); setError(null);
    try {
      const response = await meusAPI.createEvent({ event_type: eventType, event_date: eventDate, title: eventTitle.trim(), related_entities: selectedIds });
      setEvents((current) => [response.data, ...current]); setEventTitle(''); setEventType('other'); setEventDate('');
    } catch (err: any) { setError(apiError(err, 'Unable to create this event.')); }
    finally { setIsSaving(false); }
  };

  const downloadReport = async () => {
    try {
      const report = (await meusAPI.getReport()).data;
      const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'numero-buddy-universe-report.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(apiError(err, 'Unable to generate your universe report.'));
    }
  };

  const runAnalysis = async () => {
    if (selectedIds.length < 2) return;
    setIsAnalyzing(true); setError(null);
    try { setAnalysis((await meusAPI.analyzeCrossEntity(selectedIds, 'influence')).data); }
    catch (err: any) { setError(apiError(err, 'Unable to analyze these entities.')); }
    finally { setIsAnalyzing(false); }
  };

  const stats = useMemo(() => dashboard?.summary || dashboard?.stats || {}, [dashboard]);
  const influenceCount = influence?.nodes?.length || influence?.relationships?.length || influence?.edges?.length || 0;
  const compatibilityMatrix = analysis?.compatibility_matrix || [];
  const analysisSummary = compatibilityMatrix.map((item) => asText(item.details)).find(Boolean) || '';
  const scores = compatibilityMatrix.map((item) => item.overall_score).filter((score): score is number => typeof score === 'number');
  const analysisScore = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : null;
  const relationshipCount = analysis?.relationships?.length || 0;
  const compatibilityCount = compatibilityMatrix.length;

  if (!isEntitlementsLoading && !hasAccess) return <CosmicPageLayout><section className="mx-auto max-w-2xl py-12 text-center"><div className={`${cardClass} border-purple-400/30 bg-purple-500/10`}><CrownIcon className="mx-auto mb-4 h-10 w-10 text-purple-300" /><h1 className="mb-3 text-4xl text-white">Build your universe</h1><p className="mx-auto max-w-lg text-white/70">MEUS connects the people, assets, and moments that shape your path. This feature requires {feature?.required_plan ? `${feature.required_plan} or higher` : 'an eligible plan'}.</p><button onClick={() => navigate('/pricing')} className="mt-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-5 py-3 font-semibold text-white">Explore plans</button></div></section></CosmicPageLayout>;

  return <CosmicPageLayout maxWidth="7xl"><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="mb-3 flex items-center gap-2 text-cyan-300"><SparklesIcon className="h-5 w-5" /><span className="text-sm font-semibold uppercase tracking-[0.2em]">MEUS</span></div><h1 className="mb-2 text-4xl text-white md:text-5xl">My Entity Universe</h1><p className="max-w-2xl text-white/70">See the relationships, timing, and next moves across the things that matter most.</p></div><div className="flex gap-2">{hasReportAccess && <button onClick={() => void downloadReport()} className="inline-flex items-center gap-2 rounded-xl border border-purple-400/30 px-4 py-2 text-sm font-semibold text-purple-200 hover:bg-purple-400/10"><DownloadIcon className="h-4 w-4" />Export report</button>}<button onClick={() => void load()} className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/10">Refresh universe</button></div></header>
    {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
    {isLoading ? <div className={`${cardClass} flex items-center gap-3 text-white/70`}><Loader2Icon className="h-5 w-5 animate-spin text-cyan-300" /> Mapping your universe…</div> : <>
      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(stats).slice(0, 4).map(([label, value]) => <div key={label} className={cardClass}><p className="text-sm capitalize text-white/60">{label.replaceAll('_', ' ')}</p><p className="mt-2 text-3xl font-semibold text-white">{String(value)}</p></div>)}{Object.keys(stats).length === 0 && <><div className={cardClass}><p className="text-sm text-white/60">Entities</p><p className="mt-2 text-3xl font-semibold text-white">{entities.length}</p></div><div className={cardClass}><p className="text-sm text-white/60">Events</p><p className="mt-2 text-3xl font-semibold text-white">{events.length}</p></div><div className={cardClass}><p className="text-sm text-white/60">Influence links</p><p className="mt-2 text-3xl font-semibold text-white">{influenceCount}</p></div></>}</section>
      <div className="grid gap-6 lg:grid-cols-5"><section className={`${cardClass} lg:col-span-3`}><div className="mb-5 flex items-center justify-between"><div><h2 className="mb-1 text-2xl text-white">Your entities</h2><p className="text-sm text-white/60">Select two or more for a shared influence reading.</p></div><UsersIcon className="h-6 w-6 text-cyan-300" /></div><EntityForm onCreate={createEntity} saving={isSaving} /><div className="mt-5 space-y-2">{entities.length === 0 ? <p className="rounded-xl border border-dashed border-white/20 p-5 text-center text-white/60">Add a person, asset, or event to begin mapping connections.</p> : entities.map((entity) => { const selected = selectedIds.includes(entity.id); return <div key={entity.id} className={`flex items-center gap-3 rounded-xl border p-3 ${selected ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-white/10 bg-[#0a1628]/35'}`}><input type="checkbox" checked={selected} onChange={() => setSelectedIds((current) => selected ? current.filter((id) => id !== entity.id) : [...current, entity.id])} className="h-4 w-4 accent-cyan-400" aria-label={`Select ${entity.name}`} /><div className="min-w-0 flex-1"><p className="truncate font-medium text-white">{entity.name}</p><p className="truncate text-xs capitalize text-white/55">{entity.entity_type}{asText(entity.metadata?.description) ? ` · ${asText(entity.metadata?.description)}` : ''}</p></div><button onClick={() => void removeEntity(entity.id)} className="rounded-lg p-2 text-white/45 hover:bg-red-500/10 hover:text-red-300" aria-label={`Remove ${entity.name}`}><Trash2Icon className="h-4 w-4" /></button></div>; })}</div></section>
      <aside className={`${cardClass} lg:col-span-2`}><div className="flex items-center gap-3"><GitBranchIcon className="h-6 w-6 text-purple-300" /><div><h2 className="mb-0 text-2xl text-white">Influence overview</h2><p className="text-sm text-white/60">{influenceCount} mapped connection{influenceCount === 1 ? '' : 's'}</p></div></div><p className="mt-5 text-sm leading-6 text-white/70">Choose entities to reveal how their timing, energy, and relationships overlap.</p><button onClick={() => void runAnalysis()} disabled={selectedIds.length < 2 || isAnalyzing} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isAnalyzing ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SparklesIcon className="h-4 w-4" />}{isAnalyzing ? 'Reading influences…' : `Analyze ${selectedIds.length || ''} selected`}</button>{analysis && <div className="mt-5 rounded-xl border border-purple-400/20 bg-purple-500/10 p-4 text-sm leading-6 text-white/80">{analysisScore !== null && <p className="text-2xl font-semibold text-purple-200">Compatibility score: {analysisScore}</p>}<p className={analysisScore !== null ? 'mt-2' : ''}>{analysisSummary || 'Your cross-entity analysis is ready.'}</p>{(compatibilityCount > 0 || relationshipCount > 0) && <p className="mt-2 text-white/60">{compatibilityCount > 0 && `${compatibilityCount} compatibility comparison${compatibilityCount === 1 ? '' : 's'}`}{compatibilityCount > 0 && relationshipCount > 0 && ' · '}{relationshipCount > 0 && `${relationshipCount} relationship${relationshipCount === 1 ? '' : 's'} analyzed`}</p>}</div>}</aside></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className={cardClass}><div className="mb-4 flex items-center gap-3"><CalendarIcon className="h-6 w-6 text-cyan-300" /><div><h2 className="mb-0 text-2xl text-white">Timeline</h2><p className="text-sm text-white/60">Capture moments connected to your universe.</p></div></div><form onSubmit={createEvent} className="grid gap-3 sm:grid-cols-2"><input value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} className={inputClass} placeholder="New event" aria-label="Event title" /><select value={eventType} onChange={(event) => setEventType(event.target.value)} className={inputClass} aria-label="Event type"><option value="other">Other</option><option value="wedding">Wedding</option><option value="business_launch">Business launch</option><option value="travel">Travel</option><option value="purchase">Purchase</option><option value="medical">Medical procedure</option><option value="decision">Big decision</option></select><input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} className={inputClass} aria-label="Event date" required /><button disabled={isSaving || !eventTitle.trim() || !eventDate} className="rounded-xl border border-cyan-400/30 px-4 py-3 font-semibold text-cyan-200 hover:bg-cyan-400/10 disabled:opacity-50">Add</button></form><div className="mt-4 space-y-2">{events.slice(0, 5).map((event) => <div key={event.id} className="flex items-center justify-between rounded-xl bg-[#0a1628]/35 px-4 py-3"><div><p className="font-medium text-white">{event.title || event.name}</p><p className="text-xs text-white/55">{displayDate(event) || 'Unscheduled'}</p></div></div>)}{events.length === 0 && <p className="py-3 text-sm text-white/60">No moments captured yet.</p>}</div></section>
      <section className={cardClass}><div className="mb-4 flex items-center gap-3"><CheckCircle2Icon className="h-6 w-6 text-emerald-300" /><div><h2 className="mb-0 text-2xl text-white">Recommended next actions</h2><p className="text-sm text-white/60">Guidance based on your universe.</p></div></div><div className="space-y-3">{actions.slice(0, 4).map((action, index) => <div key={action.id || index} className="rounded-xl border border-white/10 bg-[#0a1628]/35 p-4"><p className="font-medium text-white">{action.title || 'Suggested next step'}</p>{(action.message || action.description) && <p className="mt-1 text-sm leading-5 text-white/65">{action.message || action.description}</p>}</div>)}{actions.length === 0 && <p className="py-3 text-sm text-white/60">Recommendations will appear as your universe takes shape.</p>}</div></section></div>
    </>}</motion.div></CosmicPageLayout>;
}
