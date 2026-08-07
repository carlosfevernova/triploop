'use client';
import { useEffect, useState } from 'react';
import type { PlaceSuggestion, Trip } from '@/lib/types';

interface AiSuggestion extends PlaceSuggestion {
  _ai?: {
    description?: string;
    category?: string;
    suggested_duration_min?: number;
    best_time?: string;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  trip: Trip;
  onAdd: (place: PlaceSuggestion & { duration_min?: number; category?: string }) => void;
  isEs?: boolean;
}

const CATEGORY_EMOJI: Record<string, string> = {
  city: '🏙️', attraction: '🎡', nature: '🌲', food: '🍽️', hotel: '🏨', 'hidden-gem': '💎', other: '📍'
};

export function AiSuggestionsPanel({ open, onClose, trip, onAdd, isEs }: Props){
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [meta, setMeta] = useState<{ provider?: string; mode?: string; model?: string; message?: string }>({});
  const [interests, setInterests] = useState<string[]>(['nature', 'food', 'iconic']);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const INTEREST_OPTIONS = isEs
    ? ['naturaleza', 'comida', 'iconos', 'joyas ocultas', 'playas', 'ciudad', 'aventura', 'romance']
    : ['nature', 'food', 'iconic', 'hidden gems', 'beaches', 'city', 'adventure', 'romance'];

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/ai/suggest-stops', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          destination_city: trip.destination_city || trip.origin_city || 'California',
          days_count: trip.days_count,
          travelers_count: trip.travelers_count,
          interests,
          locale: isEs ? 'es' : 'en',
          existing_stops: trip.stops.map(s => ({ name: s.name, lat: s.lat, lng: s.lng }))
        })
      });
      const data = await r.json();
      if(!r.ok) throw new Error(data.detail || 'error');
      setSuggestions(data.suggestions || []);
      setMeta({ provider: data.provider, mode: data.mode, model: data.model, message: data.message });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(open && suggestions.length === 0 && !loading) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const handleAdd = (s: AiSuggestion) => {
    onAdd({
      place_id: s.place_id,
      name: s.name,
      formatted_address: s.formatted_address,
      lat: s.lat,
      lng: s.lng,
      types: s.types,
      duration_min: s._ai?.suggested_duration_min,
      category: s._ai?.category
    });
    setAdded((prev) => new Set(prev).add(s.place_id));
  };

  if(!open) return null;

  const providerLabel = meta.provider === 'fireworks'
    ? 'DeepSeek V3 · Fireworks'
    : meta.provider === 'groq'
      ? 'Llama 3.3 · Groq'
      : meta.provider === 'anthropic'
        ? 'Claude Haiku 4.5'
        : meta.provider === 'curated'
          ? (isEs ? 'Sugerencias curadas' : 'Curated picks')
          : '';

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm"
        aria-hidden
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-ink-100 bg-gradient-to-br from-coral-50 via-white to-ocean-400/5 p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                {isEs ? 'Sugerencias con IA' : 'AI suggestions'}
              </h2>
            </div>
            <p className="mt-1 text-xs text-ink-500">
              {isEs
                ? 'Genera paradas basadas en tus intereses. Arrastra o toca para agregar.'
                : 'AI-generated stops based on your interests. Tap to add to your trip.'}
            </p>
            {providerLabel && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-pill bg-ink-900/5 px-2 py-0.5 text-[10px] font-semibold text-ink-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {providerLabel}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-100"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        {/* Interests picker */}
        <div className="border-b border-ink-100 p-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            {isEs ? 'Tus intereses' : 'Your interests'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {INTEREST_OPTIONS.map((opt) => {
              const active = interests.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleInterest(opt)}
                  className={`rounded-pill border px-3 py-1 text-xs font-medium transition ${
                    active
                      ? 'border-coral-500 bg-coral-500 text-white'
                      : 'border-ink-200 bg-white text-ink-700 hover:border-coral-300'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="mt-3 w-full rounded-pill bg-ink-900 py-2 text-xs font-semibold text-white transition hover:bg-ink-700 disabled:opacity-50"
          >
            {loading
              ? (isEs ? 'Generando…' : 'Generating…')
              : (isEs ? '🔄 Regenerar sugerencias' : '🔄 Regenerate suggestions')}
          </button>
        </div>

        {/* Suggestions list */}
        <div className="flex-1 overflow-auto p-4">
          {loading && suggestions.length === 0 && (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-card bg-ink-100" />
              ))}
            </div>
          )}
          {error && (
            <div className="rounded-card border border-coral-200 bg-coral-50 p-4 text-sm text-coral-700">
              {error}
            </div>
          )}
          {!loading && suggestions.length === 0 && !error && (
            <div className="py-16 text-center text-ink-400">
              <div className="mb-2 text-4xl">🧭</div>
              <p className="text-sm">{isEs ? 'Sin sugerencias todavía.' : 'No suggestions yet.'}</p>
            </div>
          )}
          <ul className="space-y-2">
            {suggestions.map((s) => {
              const isAdded = added.has(s.place_id);
              const emoji = CATEGORY_EMOJI[s._ai?.category || 'other'];
              return (
                <li
                  key={s.place_id}
                  className="group overflow-hidden rounded-card border border-ink-100 bg-white transition hover:border-coral-300 hover:shadow-card"
                >
                  <div className="flex items-start gap-3 p-4">
                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-coral-100 to-coral-50 text-lg">
                      {emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="truncate font-display text-sm font-semibold text-ink-900">
                          {s.name}
                        </h3>
                      </div>
                      {s._ai?.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-snug text-ink-600">
                          {s._ai.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-ink-500">
                        {s._ai?.suggested_duration_min ? (
                          <span>⏱ {formatMin(s._ai.suggested_duration_min, isEs)}</span>
                        ) : null}
                        {s._ai?.best_time && s._ai.best_time !== 'any' ? (
                          <>
                            <span>·</span>
                            <span className="capitalize">{translateTime(s._ai.best_time, isEs)}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAdd(s)}
                      disabled={isAdded}
                      className={`flex-shrink-0 rounded-pill px-3 py-1.5 text-[11px] font-semibold transition ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-coral-500 text-white hover:bg-coral-600'
                      }`}
                    >
                      {isAdded ? (isEs ? '✓ Agregado' : '✓ Added') : (isEs ? '+ Agregar' : '+ Add')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {meta.mode === 'curated_fallback' && meta.message && (
            <div className="mt-4 rounded-card border border-amber-200 bg-amber-50 p-3 text-[10px] text-amber-800">
              {meta.message}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function formatMin(min: number, isEs?: boolean){
  if(min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : (isEs ? `${h}h` : `${h}h`);
}

function translateTime(t: string, isEs?: boolean){
  if(!isEs) return t;
  return { morning: 'mañana', afternoon: 'tarde', evening: 'noche', any: 'cualquier hora' }[t] || t;
}
