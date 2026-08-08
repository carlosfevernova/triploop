'use client';
import { useState } from 'react';
import type { TripStop } from '@/lib/types';

interface Props {
  slug: string;
  currentStops: TripStop[];
  locale: 'en' | 'es';
  onApply: (newStops: TripStop[]) => void;
  onClose: () => void;
}

type DisruptionType = 'flight_delay' | 'weather_closure' | 'tired' | 'sick' | 'schedule_change';

interface ReshuffleResult {
  new_stops: Array<{ id: string; name: string; lat: number; lng: number; day?: number; duration_min?: number; category?: string; notes?: string; is_new?: boolean }>;
  summary: string;
  dropped: string[];
  added: string[];
  reasoning: string;
}

export function ReshuffleWizard({ slug, currentStops, locale, onApply, onClose }: Props){
  const isEs = locale === 'es';
  const [step, setStep] = useState<'what' | 'prefs' | 'result'>('what');
  const [disruption, setDisruption] = useState<DisruptionType>('flight_delay');
  const [lostHours, setLostHours] = useState(6);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [keepIds, setKeepIds] = useState<string[]>([]);
  const [preferFewer, setPreferFewer] = useState(false);
  const [preferKeepHotel, setPreferKeepHotel] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReshuffleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disruptions: { k: DisruptionType; emoji: string; label: string }[] = [
    { k: 'flight_delay', emoji: '✈️', label: isEs ? 'Vuelo demorado' : 'Flight delayed' },
    { k: 'weather_closure', emoji: '🌧️', label: isEs ? 'Cierre por clima' : 'Weather closure' },
    { k: 'tired', emoji: '😴', label: isEs ? 'Cansancio' : 'Tired' },
    { k: 'sick', emoji: '🤒', label: isEs ? 'Enfermedad' : 'Sick' },
    { k: 'schedule_change', emoji: '🕐', label: isEs ? 'Cambio agenda' : 'Schedule change' }
  ];

  const toggle = (id: string, arr: string[], setter: (a: string[]) => void) => {
    setter(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/ai/reshuffle-trip', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug, locale,
          disruption: { type: disruption, lost_hours: disruption === 'flight_delay' ? lostHours : undefined, missed_stop_ids: missedIds, keep_stop_ids: keepIds },
          preferences: { prefer_fewer_stops: preferFewer, prefer_keep_hotel: preferKeepHotel }
        })
      });
      const data = await r.json();
      if(!r.ok || !data.reshuffle) { setError(data.error || 'reshuffle_failed'); setLoading(false); return; }
      setResult(data.reshuffle);
      setStep('result');
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const apply = () => {
    if(!result) return;
    const newTripStops: TripStop[] = result.new_stops.map((s, i) => ({
      id: s.id || crypto.randomUUID(),
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      duration_min: s.duration_min,
      day: s.day,
      category: (s.category as TripStop['category']) || 'other',
      notes: s.notes
    }));
    onApply(newTripStops);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card border border-ink-100 bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink-900">
            <span aria-hidden>🔄</span>
            {isEs ? 'Reorganizar viaje' : 'Reshuffle trip'}
          </h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 hover:border-ink-800 hover:text-ink-800" aria-label="Close">✕</button>
        </div>

        {step === 'what' && (
          <div>
            <h3 className="mb-1 font-display text-lg font-semibold text-ink-800">
              {isEs ? '¿Qué pasó?' : 'What happened?'}
            </h3>
            <p className="mb-4 text-sm text-ink-500">
              {isEs ? 'La IA reorganizará tu itinerario según la situación.' : 'AI will reshuffle your itinerary based on the situation.'}
            </p>
            <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-5">
              {disruptions.map(d => (
                <button key={d.k} type="button" onClick={() => setDisruption(d.k)}
                  className={`flex flex-col items-center gap-2 rounded-card border-2 px-3 py-3 transition ${disruption === d.k ? 'border-coral-500 bg-coral-50' : 'border-ink-100 bg-white hover:border-coral-200'}`}>
                  <span className="text-2xl" aria-hidden>{d.emoji}</span>
                  <span className="text-xs font-semibold text-ink-800">{d.label}</span>
                </button>
              ))}
            </div>

            {disruption === 'flight_delay' && (
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {isEs ? '¿Cuántas horas perdiste?' : 'How many hours lost?'}
                </label>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={24} value={lostHours} onChange={(e) => setLostHours(Number(e.target.value))} className="flex-1 accent-coral-500" />
                  <span className="font-display text-2xl font-semibold text-ink-900 tabular-nums">{lostHours}h</span>
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                {isEs ? '¿Cuáles ya no vas a alcanzar? (opcional)' : "Which won't you make it to? (optional)"}
              </label>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-ink-100 bg-ink-50/30 p-2">
                {currentStops.map(s => (
                  <label key={s.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white cursor-pointer">
                    <input type="checkbox" checked={missedIds.includes(s.id!)} onChange={() => toggle(s.id!, missedIds, setMissedIds)} className="h-4 w-4 text-red-600 focus:ring-red-500" />
                    <span className="text-sm text-ink-700">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setStep('prefs')} className="rounded-pill bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
                {isEs ? 'Siguiente →' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {step === 'prefs' && (
          <div>
            <h3 className="mb-1 font-display text-lg font-semibold text-ink-800">
              {isEs ? '¿Qué priorizas?' : 'What do you prioritize?'}
            </h3>
            <p className="mb-4 text-sm text-ink-500">
              {isEs ? 'Ayuda a la IA a decidir qué cortar.' : 'Helps AI decide what to cut.'}
            </p>

            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                {isEs ? 'Debe visitar (must-see)' : 'Must-see stops'}
              </label>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-ink-100 bg-ink-50/30 p-2">
                {currentStops.filter(s => !missedIds.includes(s.id!)).map(s => (
                  <label key={s.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white cursor-pointer">
                    <input type="checkbox" checked={keepIds.includes(s.id!)} onChange={() => toggle(s.id!, keepIds, setKeepIds)} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-ink-700">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5 space-y-2">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={preferFewer} onChange={(e) => setPreferFewer(e.target.checked)} className="h-4 w-4" />
                {isEs ? 'Prefiero menos paradas pero más tiempo en cada una' : 'Prefer fewer stops but more time each'}
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={preferKeepHotel} onChange={(e) => setPreferKeepHotel(e.target.checked)} className="h-4 w-4" />
                {isEs ? 'Mantener último hotel/ciudad' : 'Keep last hotel/city'}
              </label>
            </div>

            {error && <div className="mb-3 rounded-lg bg-coral-50 px-4 py-2 text-sm text-coral-700">{error}</div>}

            <div className="flex items-center justify-between">
              <button onClick={() => setStep('what')} className="text-sm text-ink-500 hover:text-ink-800">← {isEs ? 'Atrás' : 'Back'}</button>
              <button onClick={submit} disabled={loading} className="rounded-pill bg-gradient-to-r from-coral-500 to-coral-600 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:shadow-lg disabled:opacity-60">
                {loading ? (isEs ? 'Reorganizando…' : 'Reshuffling…') : (isEs ? '✨ Reorganizar con IA' : '✨ Reshuffle with AI')}
              </button>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div>
            <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-800">{isEs ? 'PROPUESTA IA' : 'AI PROPOSAL'}</div>
              <p className="mt-1 text-sm text-emerald-900">{result.summary}</p>
            </div>
            {result.reasoning && (
              <div className="mb-4 rounded-lg bg-ocean-50 px-4 py-3 text-xs text-ocean-900">
                💡 {result.reasoning}
              </div>
            )}
            {result.dropped.length > 0 && (
              <div className="mb-3 rounded-lg bg-red-50 px-4 py-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-red-800">{isEs ? 'ELIMINADOS' : 'REMOVED'}</div>
                <p className="mt-0.5 text-xs text-red-900">{result.dropped.join(', ')}</p>
              </div>
            )}
            {result.added.length > 0 && (
              <div className="mb-3 rounded-lg bg-emerald-50 px-4 py-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">{isEs ? 'NUEVOS' : 'NEW'}</div>
                <p className="mt-0.5 text-xs text-emerald-900">{result.added.join(', ')}</p>
              </div>
            )}
            <div className="mb-4 max-h-48 overflow-y-auto rounded-lg border border-ink-100 bg-ink-50/30 p-3">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ink-600">{isEs ? 'NUEVO ITINERARIO' : 'NEW ITINERARY'} ({result.new_stops.length})</div>
              <ol className="ml-4 list-decimal space-y-0.5">
                {result.new_stops.map((s, i) => (
                  <li key={i} className={`text-xs ${s.is_new ? 'font-semibold text-emerald-700' : 'text-ink-700'}`}>
                    {s.name}{s.is_new && ` ${isEs ? '(nuevo)' : '(new)'}`}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => { setStep('what'); setResult(null); }} className="text-sm text-ink-500 hover:text-ink-800">
                {isEs ? '← Empezar de nuevo' : '← Start over'}
              </button>
              <button onClick={apply} className="rounded-pill bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
                {isEs ? '✓ Aplicar cambios' : '✓ Apply changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
