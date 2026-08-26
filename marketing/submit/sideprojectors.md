# SideProjectors — Submit Ready (copy-paste each field)

**URL to submit:** https://www.sideprojectors.com/#/submit  
**Cost:** Free · **Commission on sale:** 0%  
**Time to submit:** ~8 min

---

## Field-by-field (copy each block into corresponding form input)

### Project Name (max 80 chars)
```
TripLoop
```

### Tagline / Short Description (max 200 chars)
```
Production-ready AI road-trip planner SaaS. 27,897 LOC across 71 sprints. Multi-provider AI + Stripe subs + 4 native locales (EN/ES/PT/DE) + PWA + WhatsApp bot + 231 curated POIs across 24 regions.
```

### Category
```
SaaS
```

### Sub-category
```
Travel & Tourism
```

### Type
```
For Sale (Asset)
```

### Asking Price (USD)
```
35000
```

### Currency
```
USD
```

### Website / Live URL
```
https://triploop-sale.vercel.app
```

### Additional URLs (add each as separate field if form allows)
- Public MIT repo: `https://github.com/carlosfevernova/triploop`
- Sale pitch: `https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md`
- Live product URL: `https://triploop-six.vercel.app` (restored on buyer request within 30 sec)

### Tech Stack (comma-separated)
```
Next.js 15, React 19, TypeScript, Supabase Postgres, Stripe, Multi-provider AI (OpenRouter+Anthropic+Groq+Cloudflare+Fireworks), MapLibre GL, Serwist PWA, next-intl, Twilio WhatsApp, Resend, Tailwind CSS, Vercel Fluid Compute
```

### Tags (comma-separated, 5-10 recommended)
```
SaaS, AI, Travel, Next.js, Supabase, Stripe, PWA, Multi-tenant, WhatsApp, Multi-lingual, MVP, Pre-revenue
```

### Long Description (paste whole block below)

```markdown
Production-ready AI road-trip planner SaaS. Not a scaffold — this is the result of 71 shipping sprints across 3 months of full-time work (117 git commits, all in public MIT repo).

## Market opportunity

- **$215B/yr** international leisure travel to USA (US Travel Association 2024)
- **Layla acquired by Expedia in July 2026** (AI travel planner, pre-revenue) — direct sector validation for AI-first travel SaaS
- **Adjacent competitors** (Wanderlog, Roadtrippers, Mindtrip, GuideGeek) all either manual or chat-first
- **TripLoop positioning:** AI planning-first specialist with curated content moat + i18n native

## What's built (production-grade, verified)

**1. AI orchestration with 6-provider fallback**
- OpenRouter → Cloudflare → Fireworks → Groq → Anthropic → Vertex
- Prompt cache LRU 100 entries, 1h TTL — 10ms hits, 0 tokens
- Curated-first matching hits <200ms with 0 tokens on 60%+ of requests
- Streaming SSE endpoint — first stop in 500ms

**2. 231 hand-verified POIs across 24 regions in 7 continents**
- California, Nevada, Arizona, Utah, Rockies, Pacific NW, Northeast, Southeast, Southwest, Spain, Italy, Iceland, Ireland, Australia, New Zealand, Germany, Mexico, Chile, Argentina, Peru, Japan, Canada, Scotland, Morocco
- Each POI: name, category, hours, price band, why_visit, coordinates, confidence_score
- ~360+ hours of curation content moat

**3. Stripe subscriptions fully wired**
- Checkout Sessions with metadata
- Billing Portal
- Webhook with HMAC + idempotency table (migration 017)
- Trial-ending cron warning
- Tier gating in middleware

**4. 4 native locales (EN · ES · PT-BR · DE-DE)**
- ~1,300 strings hand-translated across S71g-n sprints
- Not machine-translated at runtime — every string authored
- Sitemap per locale, hreflang tags, per-locale metadata

**5. PWA with offline queue**
- Serwist 9.5 SW
- IndexedDB queue via `idb`
- MapLibre tile pre-caching
- Install prompt iOS/Android

**6. WhatsApp bot** — Twilio Business webhook with HMAC, conversation state per user, AI fallback

**7. Admin dashboard** — passphrase auth, AI cost tracker per provider, blog CMS with 4-locale editor, technical + investor reports

**8. Security** — Supabase RLS 12 tables, HMAC-signed unsubscribe tokens, rate limiting LRU, CSP headers, zero hardcoded secrets

## Verified metrics

- **27,897 LOC TypeScript** across 266 files
- **51 API endpoints**
- **25 Supabase migrations**
- **117 git commits**
- **80+ page routes**
- **44/44 Playwright E2E tests passing**
- **231 curated POIs** across 24 regions
- **60 trip templates**
- **130+ sitemap URLs**
- Homepage TTI ~400ms
- AI curated hit <200ms · 0 tokens
- Streaming SSE first stop in 500ms

## What's included

- ✅ Full MIT-licensed source (public GitHub repo)
- ✅ 25 Supabase migrations (idempotent, apply cleanly)
- ✅ 231 curated POIs in seed scripts
- ✅ 60 templates in seed scripts
- ✅ 4 locale message catalogs (EN·ES·PT·DE)
- ✅ AUDIT.md technical audit
- ✅ Admin reports (technical + investor + features)
- ✅ Vercel deploy config
- ✅ PWA config + icons
- ✅ 2h post-sale support (Buy-It-Now: 8h)
- ✅ Optional Vercel project transfer

## What's NOT included

- ❌ Supabase project (buyer creates own; 30-min setup)
- ❌ API keys (Google Maps, Stripe, Anthropic, Twilio, Resend)
- ❌ Custom domain (buyer registers ~$12/yr)
- ❌ Users / MRR (pre-revenue MVP)
- ❌ Trademark (name transfer negotiable)

## Why I'm selling

Focus. Multiple products in parallel — TripLoop needs full-time operator for outreach + partnerships + affiliate deals. Handoff cleanly to someone who can go full time.

## Ideal buyer

- Solo founder with travel/AI background who wants a 71-sprint head start
- Agency building AI-travel white-label for OTAs
- Investor pre-seed looking for AI-travel asset
- Adjacent player (Wanderlog / Roadtrippers / Mindtrip / GuideGeek) for acquihire
- Content publisher (travel media, YouTube) wanting owned SaaS + affiliate infra

## Process

1. Message via SideProjectors
2. Loom demo (5 min) + live URL within 24h
3. 45-min video call — code walkthrough + Q&A
4. 2-page asset purchase agreement
5. Payment via Wise / Stripe / PayPal / Escrow.com
6. Transfer: GitHub repo → Vercel project → env vars → 2h post-sale support

Time first message → fully transferred: ~7-10 days.

**Buy It Now:** $45,000 USD (includes 60-day handoff + 8h consulting)
**Bundle option:** TripLoop + FiestaMap = $40,000 total (see BUNDLE.md in repo)
```

### Screenshots (upload separately)

Order to upload:
1. **Prospectus hero** — screenshot of triploop-sale.vercel.app top (asking price + status chips visible)
2. **README metrics section** — screenshot of GitHub README showing "Verified metrics" table
3. **AUDIT.md architecture** — screenshot of AUDIT.md schema+security+performance tables
4. **File tree** — screenshot of repo file tree showing `src/`, `supabase/migrations/`, `marketing/`
5. **Sample UI mockup** — if you have Loom demo, use a still from that instead

To take these screenshots: use Windows Snip Tool (Win+Shift+S) or Playwright headless. Recommend 1280×720 or 1920×1080.

### Loom Demo (optional but recommended)

**Script (5 min):**
1. **0:00-0:30** — Open GitHub repo, walk through README top metrics
2. **0:30-1:30** — Open FOR_SALE.md, read valuation table + comparables
3. **1:30-3:30** — Open live prospectus (triploop-sale.vercel.app), scroll through 14 sections
4. **3:30-4:30** — Open codebase: `src/app/api/ai/generate-trip/stream/` streaming endpoint, `src/lib/ai/providers/` fallback chain
5. **4:30-5:00** — Recap: asking $35K firm, MIT license, DM me if interested

Loom link goes in "Additional links" or your DM to first serious buyer.

---

## After submitting

Track:
- Views per day (expect 10-30/day if SideProjectors surfaces it in feed)
- DM count
- Comments/questions

**Response time expectation:** SideProjectors surfaces new listings in weekly digest. Expect first DMs in 3-7 days.

**Bump strategy:** if no traction in 14 days, edit the listing (small tweak like adding a screenshot) — some marketplaces re-surface edited listings.
