import Link from 'next/link';
import { verifyUnsubToken } from '@/lib/email/send';
import { createAdminClient } from '@/lib/supabase-admin';

export const metadata = {
  title: 'Unsubscribed — TripLoop',
  robots: { index: false, follow: false }
};

interface PageProps {
  searchParams: Promise<{ t?: string }>;
}

export default async function UnsubscribePage({ searchParams }: PageProps){
  const { t: token } = await searchParams;
  const email = token ? verifyUnsubToken(token) : null;

  let status: 'ok' | 'invalid' | 'error' = 'ok';
  if(!email) status = 'invalid';
  else {
    try {
      const sb = createAdminClient();
      await sb.from('email_unsubscribes').upsert({ email, unsubscribed_at: new Date().toISOString(), reason: 'user_link' });
    } catch { status = 'error'; }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-white px-6">
      <div className="max-w-md text-center">
        {status === 'ok' && email && (
          <>
            <div className="mb-4 text-5xl">✅</div>
            <h1 className="font-display text-2xl font-semibold text-ink-900">You&apos;re unsubscribed</h1>
            <p className="mt-2 text-ink-500">We won&apos;t send more emails to <strong>{email}</strong>. Your trips and account remain untouched.</p>
          </>
        )}
        {status === 'invalid' && (
          <>
            <div className="mb-4 text-5xl">⚠️</div>
            <h1 className="font-display text-2xl font-semibold text-ink-900">Link expired or invalid</h1>
            <p className="mt-2 text-ink-500">Reply directly to any email you received from us and we&apos;ll unsubscribe you manually.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mb-4 text-5xl">😕</div>
            <h1 className="font-display text-2xl font-semibold text-ink-900">Something failed</h1>
            <p className="mt-2 text-ink-500">Try again or email us at hello@triploop.app to unsubscribe manually.</p>
          </>
        )}
        <Link href="/en" className="mt-6 inline-block rounded-pill border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-ink-800">
          ← Back to TripLoop
        </Link>
      </div>
    </main>
  );
}
