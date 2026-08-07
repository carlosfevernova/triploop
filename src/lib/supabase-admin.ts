import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client con service_role (bypass RLS).
// Solo usar en Edge Functions / Server Components, NUNCA en cliente.
export function createAdminClient(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if(!url || !key) throw new Error('Supabase server env vars missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// Server-side Supabase con anon key (lee público via RLS)
export function createPublicClient(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url || !key) throw new Error('Supabase public env vars missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
