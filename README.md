# TripLoop

**Trip route optimizer for international tourists visiting the USA — starting with California.**

Stack: Next.js 16 · Tailwind CSS · Supabase · Vercel Edge Functions · MapLibre GL · Claude API

---

## Quick start

```bash
npm install
cp .env.example .env.local  # Fill in your keys
npm run dev                  # http://localhost:3000
```

## Setup Supabase

1. Crear proyecto en https://supabase.com
2. Aplicar `supabase/waitlist.sql` en el SQL Editor
3. Copiar keys al `.env.local`

## Deploy Vercel

```bash
vercel link
vercel deploy --prod
```

## Roadmap

Ver documento interno de roadmap 20 sesiones. Fase actual: **Sesión 1 — Landing hero + waitlist**.
