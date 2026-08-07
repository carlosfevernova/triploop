import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Para Server Components (RSC)
export async function createClient(){
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll(){ return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]){
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Ignore desde RSC
          }
        }
      }
    }
  );
}

// Para Route Handlers (Edge/Node): recibe req y devuelve helpers
export function createClientFromRequest(req: Request){
  const cookieHeader = req.headers.get('cookie') || '';
  const parsed: Record<string, string> = {};
  cookieHeader.split(';').forEach((c) => {
    const [k, ...v] = c.trim().split('=');
    if(k) parsed[k] = decodeURIComponent(v.join('='));
  });
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll(){
          return Object.entries(parsed).map(([name, value]) => ({ name, value }));
        },
        setAll(){ /* no-op en route handlers */ }
      }
    }
  );
}
