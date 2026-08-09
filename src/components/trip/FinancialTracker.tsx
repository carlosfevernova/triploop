'use client';
import { useState, useEffect, useCallback } from 'react';

// S43 P1: Financial tracker per trip.
// Estados por categoría: budgeted (del BudgetCard) vs booked (reservado) vs actual (pagado) vs remaining.
// GET/POST /api/trips/{slug}/expenses (RLS-protected).

interface Expense {
  id: number;
  trip_slug: string;
  category: string;
  amount: number;
  currency: string;
  kind: 'booked' | 'actual';
  description: string | null;
  incurred_at: string | null;
  created_at: string;
}

interface Props {
  slug: string;
  budgeted: { gas: number; hotels: number; food: number; attractions: number; buffer: number; total: number };
  currency: string;
  symbol: string;
  locale: 'en' | 'es';
}

const CATEGORIES = ['gas', 'hotels', 'food', 'attractions', 'flights', 'shopping', 'other'] as const;
const CAT_LABEL_EN: Record<string, string> = { gas: '⛽ Gas', hotels: '🏨 Hotels', food: '🍽️ Food', attractions: '🎟️ Attractions', flights: '✈️ Flights', shopping: '🛍️ Shopping', other: '📦 Other' };
const CAT_LABEL_ES: Record<string, string> = { gas: '⛽ Gasolina', hotels: '🏨 Hoteles', food: '🍽️ Comida', attractions: '🎟️ Atracciones', flights: '✈️ Vuelos', shopping: '🛍️ Compras', other: '📦 Otros' };

export function FinancialTracker({ slug, budgeted, currency, symbol, locale }: Props){
  const isEs = locale === 'es';
  const catLabel = isEs ? CAT_LABEL_ES : CAT_LABEL_EN;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'food', amount: '', kind: 'actual' as 'actual' | 'booked', description: '' });

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/trips/${slug}/expenses`, { credentials: 'same-origin' });
      const data = await r.json();
      if(!r.ok){
        if(data.error === 'auth_required') setError('signin');
        else setError(data.error || 'load_failed');
        return;
      }
      setExpenses(data.expenses || []);
      setError(null);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    const amount = parseFloat(form.amount);
    if(!isFinite(amount) || amount <= 0) return;
    try {
      const r = await fetch(`/api/trips/${slug}/expenses`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ category: form.category, amount, kind: form.kind, description: form.description || null, currency })
      });
      const data = await r.json();
      if(r.ok && data.expense){
        setExpenses(prev => [data.expense, ...prev]);
        setForm({ category: 'food', amount: '', kind: 'actual', description: '' });
        setShowForm(false);
      }
    } catch { /* silent */ }
  };

  const del = async (id: number) => {
    try {
      const r = await fetch(`/api/trips/${slug}/expenses?id=${id}`, { method: 'DELETE', credentials: 'same-origin' });
      if(r.ok) setExpenses(prev => prev.filter(e => e.id !== id));
    } catch {}
  };

  // Aggregate per category
  const perCat: Record<string, { booked: number; actual: number }> = {};
  for(const e of expenses){
    if(!perCat[e.category]) perCat[e.category] = { booked: 0, actual: 0 };
    perCat[e.category][e.kind] += Number(e.amount);
  }
  const totalBooked = Object.values(perCat).reduce((s, x) => s + x.booked, 0);
  const totalActual = Object.values(perCat).reduce((s, x) => s + x.actual, 0);
  const remaining = Math.max(0, budgeted.total - totalActual);
  const projected = totalActual + totalBooked;
  const projectedVsBudget = budgeted.total ? Math.round((projected / budgeted.total) * 100) : 0;

  const fmt = (n: number) => `${symbol}${n.toLocaleString(isEs ? 'es-MX' : 'en-US')}`;

  if(error === 'signin'){
    return (
      <div className="rounded-card border border-ocean-200 bg-ocean-50/40 p-5 text-sm text-ocean-900">
        <p className="font-semibold">{isEs ? 'Inicia sesión para trackear gastos' : 'Sign in to track expenses'}</p>
        <p className="mt-1 text-xs">{isEs ? 'El tracker de gastos requiere cuenta (privado por RLS).' : 'Expense tracker requires an account (private via RLS).'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-ink-100 bg-white p-5 shadow-card md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <span aria-hidden>💳</span>
          {isEs ? 'Tracker Financiero' : 'Financial Tracker'}
        </h3>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">
          {isEs ? 'Privado · RLS' : 'Private · RLS'}
        </span>
      </div>

      {/* Overall progress */}
      <div className="mb-4 rounded-card bg-gradient-to-br from-emerald-50 via-white to-ocean-400/5 p-4">
        <div className="mb-2 grid grid-cols-3 gap-3 text-center text-[11px]">
          <div>
            <div className="text-ink-500">{isEs ? 'Presupuesto' : 'Budget'}</div>
            <div className="mt-0.5 font-display text-lg font-semibold text-ink-900">{fmt(budgeted.total)}</div>
          </div>
          <div>
            <div className="text-ink-500">{isEs ? 'Actual + Booked' : 'Actual + Booked'}</div>
            <div className="mt-0.5 font-display text-lg font-semibold text-coral-600">{fmt(projected)}</div>
          </div>
          <div>
            <div className="text-ink-500">{isEs ? 'Restante' : 'Remaining'}</div>
            <div className={`mt-0.5 font-display text-lg font-semibold ${remaining > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(remaining)}</div>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
          <div className={`h-full transition-all duration-500 ${projectedVsBudget > 100 ? 'bg-red-500' : projectedVsBudget > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, projectedVsBudget)}%` }} />
        </div>
        <div className="mt-1 text-center text-[10px] text-ink-500">
          {projectedVsBudget}% {isEs ? 'del presupuesto' : 'of budget'}{projectedVsBudget > 100 && ` · ${fmt(projected - budgeted.total)} ${isEs ? 'sobre' : 'over'}`}
        </div>
      </div>

      {/* Per category */}
      <div className="mb-4 space-y-1.5">
        {CATEGORIES.map(cat => {
          const c = perCat[cat] || { booked: 0, actual: 0 };
          const bg = cat === 'gas' ? budgeted.gas : cat === 'hotels' ? budgeted.hotels : cat === 'food' ? budgeted.food : cat === 'attractions' ? budgeted.attractions : 0;
          if(bg === 0 && c.booked === 0 && c.actual === 0) return null;
          return (
            <div key={cat} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-ink-50/50">
              <span className="font-semibold text-ink-800">{catLabel[cat]}</span>
              <div className="flex items-center gap-3 tabular-nums">
                {bg > 0 && <span className="text-ink-400">{fmt(bg)}</span>}
                {c.booked > 0 && <span className="text-ocean-600" title={isEs ? 'Reservado' : 'Booked'}>📅 {fmt(c.booked)}</span>}
                {c.actual > 0 && <span className="font-semibold text-coral-600" title={isEs ? 'Gastado' : 'Actual'}>✓ {fmt(c.actual)}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-pill border border-dashed border-ink-300 py-2 text-xs font-semibold text-ink-700 transition hover:border-coral-500 hover:text-coral-700"
        >+ {isEs ? 'Agregar gasto' : 'Add expense'}</button>
      ) : (
        <div className="rounded-card border border-ink-100 bg-ink-50/30 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs">
              {CATEGORIES.map(c => <option key={c} value={c}>{catLabel[c]}</option>)}
            </select>
            <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} placeholder={isEs ? 'Monto' : 'Amount'} className="rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs" step="0.01" min="0" />
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="flex gap-1 rounded-pill border border-ink-200 bg-white p-0.5">
              <button onClick={() => setForm({...form, kind: 'actual'})} className={`flex-1 rounded-pill px-2 py-1 text-[11px] font-semibold ${form.kind === 'actual' ? 'bg-coral-500 text-white' : 'text-ink-500'}`}>{isEs ? '✓ Actual' : '✓ Actual'}</button>
              <button onClick={() => setForm({...form, kind: 'booked'})} className={`flex-1 rounded-pill px-2 py-1 text-[11px] font-semibold ${form.kind === 'booked' ? 'bg-ocean-500 text-white' : 'text-ink-500'}`}>{isEs ? '📅 Reservado' : '📅 Booked'}</button>
            </div>
            <input type="text" value={form.description} onChange={(e) => setForm({...form, description: e.target.value.slice(0, 100)})} placeholder={isEs ? 'Descripción (opcional)' : 'Description (optional)'} className="rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs" />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="text-xs text-ink-500 hover:text-ink-800">{isEs ? 'Cancelar' : 'Cancel'}</button>
            <button onClick={submit} disabled={!form.amount} className="rounded-pill bg-ink-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-ink-800 disabled:opacity-40">{isEs ? 'Agregar' : 'Add'}</button>
          </div>
        </div>
      )}

      {/* Recent list */}
      {expenses.length > 0 && (
        <div className="mt-4 max-h-64 space-y-1 overflow-y-auto border-t border-ink-100 pt-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            {isEs ? 'Historial' : 'History'} ({expenses.length})
          </div>
          {expenses.map(e => (
            <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs hover:bg-ink-50/60">
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-ink-800">
                  {catLabel[e.category] || e.category} · {e.kind === 'booked' ? '📅' : '✓'} {fmt(Number(e.amount))}
                </div>
                {e.description && <div className="truncate text-[10px] text-ink-500">{e.description}</div>}
              </div>
              <button onClick={() => del(e.id)} className="text-[10px] text-ink-400 hover:text-red-600" title={isEs ? 'Eliminar' : 'Delete'}>✕</button>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="mt-3 text-center text-[10px] text-ink-400">{isEs ? 'Cargando…' : 'Loading…'}</p>}
    </div>
  );
}
