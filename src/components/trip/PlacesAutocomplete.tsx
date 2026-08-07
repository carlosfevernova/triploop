'use client';
import { useEffect, useRef, useState } from 'react';
import type { PlaceSuggestion } from '@/lib/types';

interface Props {
  placeholder?: string;
  onSelect: (place: PlaceSuggestion) => void;
  className?: string;
  autoFocus?: boolean;
}

export function PlacesAutocomplete({ placeholder = 'Search a city, park, attraction...', onSelect, className = '', autoFocus }: Props){
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(query.length < 2){ setSuggestions([]); return; }
    if(debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/places/autocomplete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const data = await r.json();
        setSuggestions(data.suggestions || []);
        setOpen(true);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    }, 300);
    return () => { if(debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if(!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleSelect = (s: PlaceSuggestion) => {
    onSelect(s);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-pill border border-ink-200 bg-white px-5 py-3.5 text-sm text-ink-800 placeholder-ink-400 outline-none transition focus:border-coral-500 focus:ring-4 focus:ring-coral-100"
      />
      {loading && (
        <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-coral-500 border-t-transparent" />
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-card border border-ink-100 bg-white p-1 shadow-card-hover">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-coral-50"
              >
                <span className="mt-0.5 text-lg">📍</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink-900">{s.name}</div>
                  <div className="truncate text-xs text-ink-500">{s.formatted_address}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
