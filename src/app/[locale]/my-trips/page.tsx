'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase-browser';
import { formatDistance, formatDuration } from '@/lib/format';
import type { Trip } from '@/lib/types';

export default function MyTripsPage(){
  const t = useTranslations('myTrips');
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const locale = params.locale;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if(!user){
        setAuthed(false);
        router.replace(`/${locale}/signin`);
        return;
      }
      setAuthed(true);
      try {
        const r = await fetch('/api/trips');
        const data = await r.json();
        setTrips(data.trips || []);
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (slug: string) => {
    if(!confirm(t('confirmDelete'))) return;
    await fetch(`/api/trips/${slug}`, { method: 'DELETE' });
    setTrips((ts) => ts.filter(t => t.slug !== slug));
  };

  if(authed === false) return null;
  if(loading) return <div className="grid min-h-screen place-items-center text-ink-500">…</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50/50 via-white to-ocean-400/5">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <Link href={`/${locale}`} className="mb-6 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
          <span aria-hidden>←</span>
          {locale === 'es' ? 'Volver' : 'Back'}
        </Link>
        <header className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-display-md text-ink-900">{t('title')}</h1>
            <p className="mt-2 text-ink-500">{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/trip/new`} className="rounded-pill bg-coral-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-coral-600">
            + {t('createNew')}
          </Link>
        </header>

        {trips.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 bg-white/60 p-16 text-center">
            <div className="mb-3 text-5xl">🗺️</div>
            <p className="text-ink-500">{t('empty')}</p>
            <Link href={`/${locale}/trip/new`} className="mt-4 inline-block rounded-pill bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-700">
              {t('createNew')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.slug} trip={trip} locale={locale} onDelete={() => remove(trip.slug)} t={t} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function TripCard({ trip, locale, onDelete, t }: { trip: Trip; locale: string; onDelete: () => void; t: ReturnType<typeof useTranslations> }){
  const stopsCount = Array.isArray(trip.stops) ? trip.stops.length : 0;
  return (
    <article className="group flex flex-col rounded-card border border-ink-100 bg-white p-5 shadow-card transition hover:shadow-card-hover">
      <Link href={`/${locale}/trip/${trip.slug}`} className="flex-1">
        <h3 className="font-display text-lg font-semibold text-ink-900 line-clamp-2">{trip.title}</h3>
        {(trip.origin_city || trip.destination_city) && (
          <p className="mt-1 text-sm text-ink-500 line-clamp-1">
            {trip.origin_city}{trip.destination_city ? ` → ${trip.destination_city}` : ''}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          <span>{trip.days_count} {t('days')}</span>
          <span>·</span>
          <span>{stopsCount} {t('stops')}</span>
          {trip.total_distance_m ? (
            <>
              <span>·</span>
              <span>{formatDistance(trip.total_distance_m, 'metric')}</span>
            </>
          ) : null}
          {trip.total_duration_s ? (
            <>
              <span>·</span>
              <span>{formatDuration(trip.total_duration_s)}</span>
            </>
          ) : null}
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
        <Link href={`/${locale}/trip/${trip.slug}`} className="text-xs font-semibold text-coral-600 hover:underline">
          {t('openTrip')} →
        </Link>
        <button
          onClick={onDelete}
          className="text-xs font-semibold text-ink-400 opacity-0 transition group-hover:opacity-100 hover:text-coral-600"
        >
          {t('deleteTrip')}
        </button>
      </div>
    </article>
  );
}
