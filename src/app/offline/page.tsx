import Link from 'next/link';

export const metadata = {
  title: 'Offline — TripLoop',
  robots: { index: false }
};

export default function OfflinePage(){
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-coral-50/50 via-white to-ocean-400/5 px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">📡</div>
        <h1 className="font-display text-display-md text-ink-900">You&apos;re offline</h1>
        <p className="mt-3 text-ink-500">
          No signal? No problem. Trips you saved for offline are still available from your device — including maps.
        </p>
        <Link
          href="/en/my-trips"
          className="mt-6 inline-block rounded-pill bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-700"
        >
          View saved trips
        </Link>
      </div>
    </main>
  );
}
