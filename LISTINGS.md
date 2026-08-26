# TripLoop — Marketplace Listings

Copy-paste ready listings for each marketplace, plus private-outreach targets.

---

## SideProjectors Listing

### Title (max 80 chars)
```
TripLoop · AI road-trip planner · Next 15 + Supabase + Stripe + 4 locales
```

### Category
`SaaS` → `Travel & Tourism`

### Asking Price
`$35,000 USD` (firm; buy-it-now $45,000 with 60-day handoff + 8h support)

### Live URLs
- Live product: https://triploop-six.vercel.app
- Sale prospectus: https://triploop-sale.vercel.app
- GitHub repo: https://github.com/carlosfevernova/triploop
- Loom demo: (to be recorded — request via DM)

### Short Description (max 200 chars)
```
Production-ready AI road-trip planner. 27,897 LOC across 71 sprints. Multi-provider AI + Stripe subs + 4 native locales (EN/ES/PT/DE) + PWA + WhatsApp bot + 231 curated POIs across 24 regions.
```

### Long Description

**AI road-trip planner for international tourists. Not a scaffold — this is the result of 71 shipping sprints across 3 months of full-time work.**

## Market opportunity

- **$215B/yr** international leisure travel to USA (US Travel Association 2024)
- **Layla (AI travel planner) acquired by Expedia July 2026** — direct sector validation for AI-first travel SaaS
- Adjacent competitors (Wanderlog, Roadtrippers, Mindtrip, GuideGeek) all either manual or chat-first
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

## Tech stack

- Next.js 15.1 App Router + Turbopack + React 19
- Supabase Postgres + Auth + Realtime + Storage
- Stripe SDK v22
- MapLibre GL 6.2 + Google Places New + Routes v2 + OpenChargeMap
- Serwist 9.5 PWA + IndexedDB
- next-intl 3.26 (4 locales)
- Twilio WhatsApp + Resend email + Vercel Cron
- TypeScript strict
- Playwright E2E 44/44 passing

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
- ❌ API keys (buyer's own — Google Maps, Stripe, Anthropic, Twilio, Resend)
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
4. 2-page asset purchase agreement (I have template)
5. Payment via Wise / Stripe / PayPal / Escrow.com
6. Transfer: GitHub repo → Vercel project → env vars → 2h post-sale support

Time first message → fully transferred: ~7-10 days.

### Category tags
`SaaS` `Next.js` `Supabase` `AI` `Travel` `MultiTenant` `Stripe` `PWA` `WhatsApp` `MultiLingual` `MVP` `PreRevenue`

---

## Flippa Listing

Same content, plus Flippa-specific fields:

### Business Type
`Starter (Pre-Revenue)`

### Monetization
`Subscription (Stripe wired, launch-ready)`

### Traffic
- Organic: waitlist stage (pre-launch)
- Direct: 0
- Waitlist signups: {fetch count from Supabase at time of listing}

### Financials
- Monthly Revenue: **$0** (pre-revenue MVP, Stripe wired)
- Monthly Expenses: ~$0 (Vercel Hobby + Supabase free tier + Gemini free)
- Net Profit: $0
- Total Costs to Build: **~$0 out of pocket** (my time only, ~470h)

### Verification Documents

Upload:
- 6 screenshots (landing, trip detail, admin dashboard, streaming SSE, blog i18n, region page)
- Live URL access (SSO temporarily disabled for eval)
- GitHub public repo link
- Loom demo video (5-min walkthrough)
- FOR_SALE.md from repo
- AUDIT.md from repo
- Migrations directory tree
- `find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1` proof output

### Auction Duration
`30 days`

### Reserve Price
`$25,000 USD` (allows negotiation window from $35K asking)

### Buy It Now
`$45,000 USD` (premium immediate close with 60-day handoff + 8h consulting)

---

## Private outreach targets (high-conviction)

### Tier 1 — Adjacent SaaS teams (best fit for acquihire or tech tuck-in)

**Wanderlog team** — LinkedIn cofounders (based SF; ~$3M ARR estimated; manual planner limitation is real). Angle: "TripLoop is your AI upgrade path. Curated moat + 4 locales + streaming SSE = 6-9 months of dev you skip."

**Mindtrip (Sean O'Brien)** — YC-backed AI travel chat. Angle: "You do conversational discovery, TripLoop does trip execution. Bolt-on or acqui."

**Roadtrippers** — Legacy but adjacent. Angle: "You have the brand, we have the AI + streaming + i18n."

**GuideGeek (Matt Landau)** — Travel AI newsletter guy. Angle: "You have the audience; TripLoop is the product."

### Tier 2 — Acquisition-focused funds and studios

**Tiny (Andrew Wilkinson)** — buys profitable + interesting internet businesses. Angle: pre-revenue is normally out of thesis, but TripLoop's code + curated content + 4-locale native make it "asset-holding grade." Direct email: hi@tiny.com or DM Andrew.

**SureSwift Capital** — micro-SaaS acquirer. Threshold usually $500K+ ARR but they buy interesting pre-rev assets occasionally. Angle: replacement cost + Stripe wired + acquirer sector validation from Layla exit.

**MicroAcquire (now Acquire.com)** — cannot list pre-revenue on the main marketplace, but they run a Discord for buyers. Post there.

**Xoogler.co, Ex-Airbnb, Ex-Booking founders** in Slack/Discord communities — potential acqui-founders looking for travel asset.

### Tier 3 — Individual buyers (LinkedIn + X)

**LinkedIn search:** `"travel tech" OR "travel AI" OR "OTA" founder acquired site:linkedin.com`. Filter to founders who have exited before ($1M-10M range) and might be scratching an itch.

**X DM targets:**
- `@marc_louvion` (Marc Lou) — indie SaaS mentor, may reshare even if not buying
- `@levelsio` (Pieter Levels) — nomad indie SaaS, may reshare
- `@shpigford` (Josh Pigford, Baremetrics founder) — may DM to travel network
- `@arvidkahl` (SureSwift-adjacent, indie hackers audience)
- MX/LATAM travel/AI: Rappi Travel alumni, Despegar product alumni

### Tier 4 — Content publishers with monetization gap

**Travel YouTube channels** with 100K+ subs but no owned SaaS. They earn from AdSense + affiliate → TripLoop lets them own the funnel.

**Travel newsletters** (like Kilometer, Substack travel) — same angle.

**Wanderlust / Nomadic Matt / travel bloggers** — SEO powerhouse who could crush TripLoop's 130+ URL sitemap.

---

## X/Twitter DM Template

```
Hey [name],

Vi que [ship SaaS / build travel content / invest in AI travel]. Rápido:

Vendo TripLoop — AI road-trip planner, 71 sprints shipping (117 commits, 27.8K LOC). Multi-provider AI + Stripe + PWA + 4 locales nativos EN/ES/PT/DE + 231 POIs curados en 24 regiones.

Live: triploop-six.vercel.app
Repo público: github.com/carlosfevernova/triploop
Sale prospectus: triploop-sale.vercel.app

Asking $35K firm. Buy-it-now $45K con 8h consulting.

Contexto: Layla (AI travel similar) acquired by Expedia Jul 2026. Sector validado.

Interesado? Loom demo listo. Zero pushback si no aplica.

Carlos
```

## LinkedIn message template

```
Hi [Name],

Following your work in [travel tech / AI travel / OTA space].

I'm selling TripLoop — a full-stack AI road-trip planner SaaS. 27,897 LOC across 71 sprints. Production-grade: multi-provider AI (6 fallback), Stripe subscriptions wired, 4 native locales (EN/ES/PT-BR/DE-DE), 231 hand-curated POIs across 24 regions, PWA with offline queue, WhatsApp bot.

Asking $35K firm — comparable to what Layla-adjacent teams pay to skip 6-9 months of dev + content curation.

Full pitch: https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md

Loom demo available on request. Zero pressure — happy to walk you through and answer questions even if it's not a fit.

Best,
Carlos
```

---

## Reddit `r/SideProject` "For Sale" post template

**Title:** `[FOR SALE] TripLoop — AI road-trip planner SaaS, 27.8K LOC, Next 15 + Supabase + Stripe + 4 locales. $35K.`

**Body:** *See CONTENT_PACK.md section 3 for full copy.*

Post in the weekly "for sale" thread (usually pinned Monday).

---

## Common negotiation ranges

Based on comparables research (Layla exit, Wanderlog benchmarks, SideProjectors public listings):

- **Fire sale (24-48h close):** Accept $18-22K (floor $18K)
- **Realistic 30-day listing:** $25-35K
- **With screenshots + Loom + admin reports polish:** $30-45K
- **Bundle with FiestaMap:** $40-55K
- **With 1 pilot pagando + PR ejecutado:** $50-80K
- **Acquihire (adjacent SaaS team wants me too):** $60-120K + retention

### Objection handling

| Buyer says | Response |
|---|---|
| "$35K is high for pre-revenue" | "Replacement cost line-item is $35,250 at $75/hr senior rate. Asking already discounts for pre-revenue. See FOR_SALE.md valuation table." |
| "Layla comp is unfair — they had traction" | "Fair. Adjust down 30% for zero-traction discount → $24.5K. Still fair given 231 POI moat + 4-locale native that a fresh team can't replicate in <6 months." |
| "How do I know AI actually works?" | "OpenRouter free tier provider chain. Live demo shows streaming SSE first stop in 500ms. I'll generate a trip live on video call." |
| "What if Vercel/Supabase/Stripe changes API?" | "Stack pinned to versions in package.json. Deploy config battle-tested. Not using any deprecated APIs. Payment webhook idempotency = fix for the one common breakage." |
| "Why only $35K? Should be $50K+" | "Fair point — I priced for a fast close. Willing to hold at $35K firm for the 30-day active listing period; will re-price to $45K if no offers by then." |
| "Can you finish X feature?" | "Yes at $75/hr. Optimize My Day = 8h. Event detection = 12h. Financial tracker = 10h. Payment on delivery." |
| "Payment terms?" | "50% on signed agreement, 50% on repo + Vercel transfer complete. Wise, Stripe, or PayPal buyer picks. Escrow via Escrow.com if buyer prefers (~$50 fee, buyer pays)." |
| "How long is post-sale support?" | "2h included in asking. 8h included in Buy-It-Now. Additional at $75/hr, no long-term commitment." |

---

## Post-listing followups

Day 1: Post to SideProjectors + Reddit + X thread + LinkedIn.
Day 3: DM 5 Tier-1 outreach targets.
Day 7: Post on Indie Hackers + Hacker News "Show HN".
Day 10: If no serious offer, list on Flippa as auction.
Day 14: Post follow-up on Reddit with "1 week in — no offer yet, dropping to fire sale?" hook.
Day 30: If no offer, re-price and refresh listing.
Day 60: Consider bundle with FiestaMap or pivot to 6-12 month productization sprint.
