import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STARTED_AT = Date.now();
const COMMIT_SHA = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local';
const REGION = process.env.VERCEL_REGION || 'unknown';
const ENV = process.env.VERCEL_ENV || 'development';

export async function GET(){
  return NextResponse.json({
    status: 'ok',
    service: 'triploop',
    version: '0.1.0',
    commit: COMMIT_SHA,
    region: REGION,
    environment: ENV,
    uptime_seconds: Math.round((Date.now() - STARTED_AT) / 1000),
    timestamp: new Date().toISOString(),
    checks: {
      supabase_url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_secret_configured: !!process.env.SUPABASE_SECRET_KEY,
      stripe_configured: !!process.env.STRIPE_SECRET_KEY,
      openrouter_configured: !!process.env.OPENROUTER_API_KEY,
      google_maps_configured: !!process.env.GOOGLE_MAPS_API_KEY,
      resend_configured: !!process.env.RESEND_API_KEY
    }
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=10, stale-while-revalidate=30'
    }
  });
}

export async function HEAD(){
  return new NextResponse(null, { status: 200 });
}
