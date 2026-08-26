# TripLoop

> **🏷 FOR SALE:** Production-ready AI road-trip planner. Full-stack Next.js 15 + Supabase + Stripe + multi-provider AI + PWA. **Asking $35,000 USD firm ($45,000 with 60-day handoff).** See [FOR_SALE.md](./FOR_SALE.md) for full details.

**AI road-trip planner for international tourists — 24 regions curated, 60 templates, 231 hand-picked POIs. Streaming AI itinerary generation, multi-provider fallback chain, 4 native locales (EN·ES·PT·DE), Stripe subscriptions, WhatsApp bot, PWA with offline mode.**

**Live product:** https://triploop-six.vercel.app · **Sale prospectus:** https://triploop-sale.vercel.app · **Repo (public MIT):** https://github.com/carlosfevernova/triploop

---

## What this is

TripLoop is a **fully working** AI road-trip planning SaaS. It's not a scaffold, not a demo — it's the result of **71 shipping sprints (117 commits)** with production-grade patterns end-to-end:

- **AI orchestration** — 6-provider fallback chain (OpenRouter → Cloudflare → Fireworks → Groq → Anthropic → Vertex) with in-memory prompt cache (LRU 100 entries, 1h TTL) and curated-first template matching that hits <200ms with $0 tokens on ~60% of requests
- **Streaming generation** — SSE endpoint emits phase → region_hint → meta → stop (1×1) → complete events, so the UI shows the first stop in 500ms curated / 2-5s AI
- **Route optimization** — Google Routes v2 with 2-opt fallback heuristic, plus EV charger overlay via OpenChargeMap
- **Multi-tenant curated moat** — 231 POIs hand-verified across 24 regions in 7 continents, seeded from admin, gated by `confidence_score`
- **Stripe subscriptions** — Checkout + Billing Portal + Webhooks with HMAC signature verification and **idempotency table** (S40 P0.1) preventing duplicate event processing
- **PWA** — Serwist SW with runtime caching, IndexedDB queue for offline mutations, MapLibre tile pre-caching
- **4 locales native** — EN · ES · PT-BR · DE-DE with hreflang tags and per-locale sitemap; 100% of user-facing strings translated (not machine-translated at runtime)
- **WhatsApp bot** — Twilio webhook with signature verification, context-aware conversation state per user
- **Admin dashboard** — reports (technical + investor), AI cost tracker per provider, blog CMS with i18n, region editor, template scoring
- **Security** — Supabase RLS on 12 tables, service_role isolated to Node routes, HMAC-signed unsubscribe tokens, in-memory rate limiting LRU, CSP headers via middleware, zero hardcoded secrets

---

## Verified metrics (`git log` + `find | wc`)

| Metric | Value |
|---|---|
| Lines of code (TypeScript) | **27,897** |
| Source files | **266** |
| API endpoints | **51** |
| Supabase migrations | **25** (all applied) |
| Git commits | **117** |
| Page routes | **80+** (24 regions × index+detail + admin + blog + trip) |
| Playwright E2E tests | **44/44 passing** |
| Native locales | **4** (EN · ES · PT-BR · DE-DE) |
| Curated POIs | **231** verified |
| Templates | **60** |
| Sitemap URLs | **130+** |
| Build time (Turbopack) | ~1.5s incremental |
| Bundle first load JS | 105 kB shared / 200 kB trip page |
| Homepage TTI | ~400ms |
| AI curated hit | <200ms · 0 tokens |
| AI cache hit | ~10ms · 0 tokens |

## Stack

- **Frontend:** Next.js 15.1 App Router · React 19 · Tailwind CSS 3 · next-intl 3.26
- **Backend:** Vercel Fluid Compute (Node.js, no cold starts) · Supabase Postgres + Auth + Realtime + Storage
- **AI:** Multi-provider with fallback — OpenRouter, Cloudflare Workers AI, Fireworks, Groq, Anthropic
- **Payments:** Stripe SDK v22 (Checkout + Portal + Webhooks HMAC)
- **Maps:** MapLibre GL 6.2 · Carto Voyager tiles · Google Places New · Google Routes v2 · OpenChargeMap EV
- **PWA:** Serwist 9.5 · IndexedDB via `idb` · offline queue
- **Comms:** Twilio WhatsApp Business API · Resend email
- **UI kit:** @dnd-kit for drag+drop itinerary reordering
- **DX:** TypeScript strict · Turbopack · Vercel Cron · Web Vitals RUM

## Quick start (dev)

```bash
git clone https://github.com/carlosfevernova/triploop.git
cd triploop
npm install
cp .env.example .env.local  # fill in keys
npm run dev  # http://localhost:3000
```

## Environment variables

See `.env.example` — 33 variables fully documented across 8 categories (Supabase, AI providers × 6, Maps, Stripe, Email + WhatsApp, Admin + cron, Affiliates, Vercel runtime metadata) with dashboard URLs and free-tier notes per key.

**Live config verification:** `curl https://triploop-six.vercel.app/api/health` returns a JSON `checks` object reporting which required env vars are configured (without leaking values). Buyer due-diligence tool.

```json
{
  "status": "ok",
  "service": "triploop",
  "commit": "9fb9cd4",
  "region": "iad1",
  "environment": "production",
  "checks": {
    "supabase_url_configured": true,
    "supabase_secret_configured": true,
    "stripe_configured": false,
    "openrouter_configured": true,
    "google_maps_configured": true,
    "resend_configured": false
  }
}
```

## Deploy

Wired for **Vercel Fluid Compute** (default runtime). Zero Edge-runtime code — everything runs on Node.js with 300s default timeout.

```bash
vercel link
vercel env pull  # optional, syncs from Vercel to .env.local
vercel deploy --prod
```

Supabase migrations apply cleanly to a fresh project via SQL Editor or `supabase db push`. See `supabase/migrations/` — 25 files, all idempotent (`if not exists` throughout).

## Repository map

```
src/
├── app/
│   ├── [locale]/                   # 4 locales EN·ES·PT·DE
│   │   ├── page.tsx                # Landing (Hero + FeaturesShowcase + Comparison + FAQ)
│   │   ├── {region}/               # 24 regions × index+detail
│   │   ├── trip/
│   │   │   ├── new/                # Trip creation wizard
│   │   │   ├── new/ai/             # AI streaming generation SSE
│   │   │   └── [slug]/             # Trip detail + itinerary + print
│   │   ├── blog/                   # Blog i18n with JSON-LD
│   │   ├── agenda/                 # Multi-trip calendar
│   │   └── ...
│   ├── admin/(app)/                # Password-protected admin
│   │   ├── page.tsx                # Dashboard
│   │   ├── ai-costs/               # Per-provider AI spend tracker
│   │   ├── blog/                   # CMS with 4-locale editor
│   │   └── reports/                # Technical + investor reports
│   └── api/                        # 51 endpoints
│       ├── ai/                     # generate-trip + describe-stop + photo-spots + reshuffle + suggest-stops
│       ├── ai/generate-trip/stream # SSE streaming
│       ├── places/                 # autocomplete + curated + discover + enrich + ev-chargers + nearby
│       ├── routes/                 # optimize + optimize-order
│       ├── stripe/                 # checkout + portal + webhook (HMAC)
│       ├── trips/[slug]/itinerary/ # 8 endpoints (days, items, opening-hours, optimize-day, reorder, ...)
│       ├── whatsapp/webhook        # Twilio inbound
│       ├── emails/                 # waitlist + welcome
│       └── cron/                   # trial-ending + weekly-digest
├── components/                     # UI components (all 4-locale native)
├── lib/                            # Business logic (planner, matcher, cache, providers, validators)
├── i18n/                           # 4-locale message catalogs
└── proxy.ts                        # Next 16-style middleware (CSP + rate limit + auth)

supabase/migrations/                # 25 SQL files, sequential
scripts/                            # Seed + admin scripts
```

## What's differentiating

1. **Curated-first AI moat** — 231 hand-picked POIs across 24 regions get preferentially injected into AI context, so answers cite real trusted places instead of hallucinating. Score-gated fallback to pure AI only when curated coverage <45%.
2. **Multi-provider AI fallback** — never blocked by a single provider being down/rate-limited. Free tiers first (OpenRouter, Cloudflare, Groq), paid Anthropic as last resort.
3. **4 native locales, not runtime translation** — every user-facing string translated by hand across EN/ES/PT-BR/DE-DE. Sitemap and hreflang per-locale.
4. **Streaming SSE UX** — first stop visible in 500ms via curated match, rest streams while user reads.
5. **Full Stripe production wiring** — Checkout, Portal, and Webhook with idempotency table. Not stub.
6. **PWA with offline queue** — user can add stops offline, syncs when reconnected. IndexedDB via `idb`.
7. **WhatsApp bot** — full Twilio webhook with signature verify, conversation state per user, AI fallback.
8. **Admin dashboard with cost tracking** — per-provider AI spend, Maps API spend, gross margin visible.

## Business context

- **Comparable acquisition:** Layla acquired by Expedia in July 2026 for undisclosed 8-figure sum (pre-revenue AI travel planner)
- **Adjacent players:** Wanderlog, Roadtrippers, Mindtrip, GuideGeek
- **TripLoop positioning:** AI-first road-trip specialist (Layla focuses on flights/hotels; Wanderlog is manual planner; Roadtrippers is legacy PDF-era)
- **Total addressable market:** international leisure travel to USA = $215B annually (US Travel Association 2024)
- **Traffic:** pre-launch (waitlist active)
- **Revenue:** $0 (pre-revenue MVP with Stripe wired for launch)

## License

MIT. Buyer of the asset receives full IP transfer via asset purchase agreement.

## Contact

Interested? See [FOR_SALE.md](./FOR_SALE.md) for the pitch, [LISTINGS.md](./LISTINGS.md) for marketplace listings, and message via GitHub Issues or `hola@nano-almacen.mx`.

---

*Repository last updated: 2026-08-26. This README reflects the current state of the codebase (post-S71n sprint). See `AUDIT.md` for the technical audit as of S40.*
