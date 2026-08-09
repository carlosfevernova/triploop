'use client';
import { useEffect, useState } from 'react';
import type { ItineraryItem, ItineraryItemType, Priority, TripDay } from '@/lib/itinerary/types';

const TYPES: ItineraryItemType[] = ['place','meal','hotel','flight','train','drive','walk','event','note','free_time'];
const PRIORITIES: Priority[] = ['must','preferred','optional'];
const DURATION_PRESETS = [30, 60, 90, 120, 180, 240];

interface Props {
  open: boolean;
  onClose: () => void;
  item: ItineraryItem | null;
  days: TripDay[];
  locale: 'en' | 'es';
  onSave: (patch: Partial<ItineraryItem>) => Promise<void>;
}

export function EditItemDrawer({ open, onClose, item, days, locale, onSave }: Props){
  const isEs = locale === 'es';
  const [form, setForm] = useState<Partial<ItineraryItem>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if(item){
      setForm({
        title: item.title,
        type: item.type,
        priority: item.priority,
        start_local: item.start_local?.slice(0, 5) || '',
        duration_min: item.duration_min,
        trip_day_id: item.trip_day_id,
        notes: item.notes || '',
        fixed: item.fixed,
        address: item.address || ''
      });
    }
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') onClose(); };
    if(open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open || !item) return null;

  const submit = async () => {
    setSaving(true);
    try {
      const patch: Partial<ItineraryItem> = { ...form };
      if(typeof patch.start_local === 'string' && patch.start_local === '') patch.start_local = null;
      await onSave(patch);
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink-100 p-5">
          <h2 className="font-display text-lg font-semibold">{isEs ? 'Editar actividad' : 'Edit item'}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-ink-400 hover:bg-ink-100">✕</button>
        </header>

        <div className="flex-1 space-y-4 p-5">
          {/* Title */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{isEs ? 'Título' : 'Title'}</span>
            <input
              value={form.title || ''}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
            />
          </label>

          {/* Type */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{isEs ? 'Tipo' : 'Type'}</span>
            <select
              value={form.type || 'place'}
              onChange={(e) => setForm({...form, type: e.target.value as ItineraryItemType})}
              className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
            >
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          {/* Day */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{isEs ? 'Día' : 'Day'}</span>
            <select
              value={form.trip_day_id ?? ''}
              onChange={(e) => setForm({...form, trip_day_id: e.target.value ? Number(e.target.value) : null})}
              className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
            >
              <option value="">{isEs ? 'Sin día (Ideas)' : 'Unscheduled'}</option>
              {days.map(d => <option key={d.id} value={d.id}>{isEs ? 'Día' : 'Day'} {d.day_number} {d.date ? `· ${d.date}` : ''}</option>)}
            </select>
          </label>

          {/* Start time + duration */}
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{isEs ? 'Hora inicio' : 'Start time'}</span>
              <input
                type="time"
                value={typeof form.start_local === 'string' ? form.start_local : ''}
                onChange={(e) => setForm({...form, start_local: e.target.value})}
                className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
              />
            </label>
            <label>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{isEs ? 'Duración (min)' : 'Duration (min)'}</span>
              <input
                type="number"
                min={0}
                step={15}
                value={form.duration_min ?? ''}
                onChange={(e) => setForm({...form, duration_min: e.target.value ? Number(e.target.value) : null})}
                className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
              />
            </label>
          </div>

          {/* Duration presets */}
          <div className="flex flex-wrap gap-1.5">
            {DURATION_PRESETS.map(m => (
              <button
                key={m}
                onClick={() => setForm({...form, duration_min: m})}
                className={`rounded-pill border px-2.5 py-1 text-[11px] font-medium transition ${
                  form.duration_min === m ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-500'
                }`}
              >
                {m < 60 ? `${m} min` : `${m / 60}h`}
              </button>
            ))}
          </div>

          {/* Priority + Fixed */}
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{isEs ? 'Prioridad' : 'Priority'}</span>
              <select
                value={form.priority || 'preferred'}
                onChange={(e) => setForm({...form, priority: e.target.value as Priority})}
                className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 self-end pb-2">
              <input type="checkbox" checked={!!form.fixed} onChange={(e) => setForm({...form, fixed: e.target.checked})} className="h-4 w-4 rounded" />
              <span className="text-sm text-ink-700">🔒 {isEs ? 'Fijo (no mover)' : 'Fixed (no move)'}</span>
            </label>
          </div>

          {/* Notes */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{isEs ? 'Notas' : 'Notes'}</span>
            <textarea
              value={form.notes || ''}
              onChange={(e) => setForm({...form, notes: e.target.value.slice(0, 1000)})}
              rows={3}
              className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
            />
          </label>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-ink-100 p-5">
          <button onClick={onClose} className="rounded-pill px-4 py-2 text-sm text-ink-600 hover:text-ink-900">{isEs ? 'Cancelar' : 'Cancel'}</button>
          <button
            onClick={submit}
            disabled={saving || !form.title}
            className="rounded-pill bg-ink-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink-700 disabled:opacity-50"
          >
            {saving ? (isEs ? 'Guardando…' : 'Saving…') : (isEs ? 'Guardar' : 'Save')}
          </button>
        </footer>
      </div>
    </div>
  );
}
