import Link from 'next/link';

export const metadata = {
  title: '404 — Page not found | TripLoop',
  robots: { index: false }
};

export default function NotFound(){
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-coral-50/40 via-white to-ocean-400/5 px-6">
      <div className="max-w-md text-center">
        <div className="mb-4 font-display text-8xl font-semibold text-coral-500">404</div>
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink-900">This road doesn&apos;t exist</h1>
        <p className="mb-6 text-ink-500">
          The trip or page you&apos;re looking for isn&apos;t here. Let&apos;s get you back on the map.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link href="/en" className="rounded-pill bg-coral-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-coral-600">
            ← Back to TripLoop
          </Link>
          <Link href="/en/california" className="text-sm text-ink-500 hover:text-ink-800">
            or browse California road trips →
          </Link>
        </div>
      </div>
    </main>
  );
}
