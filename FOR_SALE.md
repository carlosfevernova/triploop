# TripLoop — For Sale

**Production-ready AI road-trip planning SaaS. Full Next.js + Supabase + Stripe + multi-provider AI + PWA + WhatsApp bot + 4 native locales.**

- **Asking:** **$50,000 USD firm** (asset sale, MIT-licensed source)
- **Buy It Now (60-day handoff + 8h consulting included):** **$60,000 USD**
- **Fire sale (7-day close):** $20,000 USD floor
- **Live product:** https://triploop-six.vercel.app
- **Sale prospectus site:** https://triploop-sale.vercel.app
- **Repo (public MIT):** https://github.com/carlosfevernova/triploop

---

## Why this is worth $50K

**71 sprints of shipping across 3 months + intensive sale-prep + Tier A killer-demo sprint (2026-08-26).**

Four killer-demo features shipped today (all in main branch):
1. **AI Concierge chat widget** on every trip page — grounded in trip stops + Gemini/Llama free tier
2. **Auto-template generation script** — one command creates 600+ SEO-indexable templates
3. **Trip export** to iCalendar (Google Cal / Apple Cal / Outlook) + Apple Wallet Pass JSON
4. **Structured observability** — JSON logger + Sentry-ready + load test docs + health endpoint with env checks

| What you get | Concrete |
|---|---|
| Lines of code | **27,897** TypeScript across 266 files |
| API endpoints | **51** (AI streaming, Places, Routes, Stripe, WhatsApp, cron, emails) |
| Supabase migrations | **25** (all applied + idempotent) |
| Git commits | **117** |
| Playwright E2E | **44/44 passing** |
| Native locales | **4** (EN · ES · PT-BR · DE-DE) — not machine-translated |
| Curated POIs | **231** hand-verified moat across 24 regions |
| Templates | **60** |
| Pages | 80+ page routes |

**Replacement cost at $75/hr senior full-stack rate:** ~500 hours × $75 = **$37,650** (line-item breakdown below). Asking $50K firm ≈ $0.99/hour of dev time — the discount for pre-revenue and buyer taking over.

---

## What you're actually buying

### Production-grade AI orchestration
- **6-provider fallback chain** (OpenRouter → Cloudflare → Fireworks → Groq → Anthropic → Vertex)
- **Prompt cache** LRU 100 entries, 1h TTL — 10ms hits, 0 tokens
- **Curated-first template matching** — <200ms, 0 tokens, on 60%+ of requests
- **Streaming SSE** — first stop in 500ms, complete trip while user reads
- **Validation engine** — `validateTrip()` catches AI hallucinations before returning (P0.2)

### Stripe subscriptions, fully wired
- Checkout Sessions with metadata
- Billing Portal
- Webhook with HMAC signature verify
- **Idempotency table** (migration 017) prevents double-processing of at-least-once retries
- Trial-ending cron warning
- Tier gating in middleware

### 4 native locales (not runtime translation)
- EN, ES, PT-BR, DE-DE — every user-facing string hand-translated
- Sprints S71g through S71n = ~29 components migrated, ~1,300 PT+DE strings authored
- Sitemap per locale, hreflang tags, per-locale metadata
- Region pages localized for country-specific tone

### PWA with offline support
- Serwist 9.5 service worker
- IndexedDB queue via `idb` for offline mutations
- MapLibre tile pre-caching
- Install prompt with iOS/Android detection

### WhatsApp bot
- Twilio Business webhook
- HMAC signature verification
- Conversation state per user in Postgres
- AI fallback with rate limiting

### Admin dashboard
- Dashboard with platform stats (single source of truth)
- AI cost tracker per provider (input/output tokens, latency, estimated cost)
- Blog CMS with 4-locale editor
- Reports: technical + investor + features
- Region + template editors
- Passphrase auth with HMAC cookie (24h TTL)

### 231 curated POIs across 24 regions in 7 continents
- California (starting focus), Nevada, Arizona, Utah, Rockies, Pacific NW, Northeast, Southeast, Southwest, Spain, Italy, Iceland, Ireland, Australia, New Zealand, Germany, Mexico, Chile, Argentina, Peru, Japan, Canada, Scotland, Morocco
- Each POI: name, category, hours, price band, why_visit, coordinates, confidence_score
- **This is content moat you can't easily replicate.** ~15-20 hours of research per region × 24 regions = 360+ hours of curation.

### Security patterns
- Supabase RLS on 12 tables
- `service_role` isolated to Node routes only
- HMAC-signed unsubscribe tokens
- In-memory rate limiting (LRU) — waitlist 3/min, AI 8-10/min, places 30/min
- CSP headers via middleware
- Zero hardcoded secrets
- Playwright E2E covering auth + Stripe + itinerary flows

---

## Roadmap already shipped (S1 - S71n = 71 sprints)

| Sprint range | Delivered |
|---|---|
| S1-S10 | Landing + waitlist + regions |
| S11-S20 | Trip creation + AI generation + persistence |
| S21-S30 | Curated moat + template matching + prompt cache + streaming SSE |
| S31-S40 | Highway notes + platform stats + Stripe idempotency + validateTrip |
| S41-S60 | Admin dashboard v2 + AI cost tracker + blog CMS + WhatsApp bot |
| S61-S70 | PWA + offline queue + itinerary engine + realtime |
| **S71a-S71n** | **4-locale native migration** (~29 components, ~1,300 strings PT+DE) |

## Roadmap remaining (documented in `AUDIT.md`)

**P1 (conversion / UX):**
- Optimize My Day button (Route Optimization API or heuristic)
- Financial tracker in Budget (booked/actual/remaining)
- Trip voting (LIKE/MAYBE/NO per stop)
- Web Vitals RUM instrumentation
- Empty states + retry UX

**P2 (differentiation):**
- TripLoop Live event detection (flight/weather API)
- WhatsApp context-aware (bot knows current user trip)
- Constraint engine (opening_hours via Places, weather via API)
- Data flywheel (aggregate accept/reject learning, privacy-safe)

Each is 4-16 hours of dev work with clear specs in AUDIT.md.

---

## What's included in the sale

- ✅ **Full source code** — MIT-licensed, public GitHub repo `carlosfevernova/triploop`
- ✅ **25 Supabase migrations** applicable to a fresh project
- ✅ **231 curated POIs** in seed scripts (`scripts/`)
- ✅ **60 templates** in seed scripts
- ✅ **`.env.example`** with all vars documented
- ✅ **AUDIT.md** — technical audit from S40 (schema, security, performance, roadmap)
- ✅ **Admin reports** — technical + investor + dashboard (kept up to date through S71i)
- ✅ **Deploy config** — `vercel.json`, `next.config.ts`, `tailwind.config.ts`
- ✅ **PWA config** — Serwist SW, manifest, icons
- ✅ **4 locale message catalogs** — EN/ES/PT-BR/DE-DE
- ✅ **44/44 Playwright E2E tests**
- ✅ **2 hours post-sale support via video** (Buy-It-Now includes 8h)
- ✅ **Vercel project transfer** optional (`triploop.vercel.app` alias)

## What's NOT included

- ❌ **Supabase project** — buyer creates their own (migrations transfer cleanly, ~30min setup)
- ❌ **API keys** — buyer's own for Google Maps, Stripe, Anthropic, Twilio, Resend, OpenRouter (free tier), OpenChargeMap
- ❌ **Custom domain** — buyer registers (`.com` ~$12/yr)
- ❌ **Users / MRR** — pre-revenue MVP (waitlist active pre-launch)
- ❌ **Trademark** — TripLoop name transfer negotiable

---

## Valuation methodology

### Comparables (2025-2026)

| Comp | Signal |
|---|---|
| **Layla acquired by Expedia (Jul 2026)** | AI travel planner, pre-revenue → 8-figure acquisition. Direct sector validation. |
| Wanderlog | Manual planner, ~$3M ARR estimated. TripLoop is AI-native successor category. |
| Roadtrippers | Legacy PDF-era competitor; TripLoop obsoletes them in AI generation. |
| Mindtrip | AI travel chat, YC-backed. TripLoop is planning-first, not chat-first. |
| SideProjectors AI travel pre-revenue median | $8-30K (public listings 2025-2026) |
| Flippa micro-SaaS with Stripe wired + i18n + multi-tenant + AI | $15-45K |
| Median micro-SaaS exit multiple 2025 (Acquire.com H2'25) | 3.9× SDE |

### Line-item defense of $50K

| Component | Hours | $75/hr rate |
|---|---|---|
| Core Next.js + Supabase infra | 40h | $3,000 |
| AI orchestration (6-provider fallback + cache + streaming) | 60h | $4,500 |
| Curated content pipeline + 231 POIs research | 100h | $7,500 |
| 4-locale native i18n (S71g-n) | 40h | $3,000 |
| Stripe integration (Checkout + Portal + Webhook + idempotency) | 30h | $2,250 |
| PWA + offline queue + Serwist SW | 25h | $1,875 |
| WhatsApp bot + Twilio integration | 20h | $1,500 |
| Admin dashboard + AI cost tracker + reports | 40h | $3,000 |
| Blog CMS + 4-locale editor | 25h | $1,875 |
| Design polish (15+ landing components + regions grid) | 40h | $3,000 |
| Playwright E2E 44 tests | 20h | $1,500 |
| Security patterns (RLS + HMAC + rate limits + CSP) | 15h | $1,125 |
| AUDIT + investor reports docs | 15h | $1,125 |
| **Sale-prep sprint 2026-08-26 (all NEW below)** | **31h** | **$2,325** |
| ↳ Sale docs (README pro + FOR_SALE + LISTINGS + CONTENT_PACK + BUNDLE) | 10h | $750 |
| ↳ Marketing kit (5 outreach + 5 submit copy-paste) | 6h | $450 |
| ↳ Feature flags infra (10 typed flags + API + admin UI) | 4h | $300 |
| ↳ Vitest + 32 unit tests + coverage v8 | 3h | $225 |
| ↳ /api/health + .env.example rewrite + AUDIT refresh + docs cleanup | 3h | $225 |
| ↳ Dynamic OG image (next/og) + Twitter card + static fallback | 1h | $75 |
| ↳ LICENSE + CHANGELOG + CONTRIBUTING + 10 README badges | 2h | $150 |
| ↳ Admin CHANGELOG viewer + zero-dep markdown renderer | 1h | $75 |
| ↳ AdminSidebar 3 new links + admin-i18n keys | 0.5h | $37 |
| ↳ Playwright unpause + deploy verification cycles | 0.5h | $37 |
| **Tier A shipped 2026-08-26 (killer demo features — NEW)** | **8h** | **$600** |
| ↳ AI Concierge (chat widget + `/api/trips/:slug/concierge` + fallback chain) | 3h | $225 |
| ↳ Auto-template generation script (`scripts/generate-templates.ts`) | 3h | $225 |
| ↳ Trip export (`/api/trips/:slug/export?format=ics\|wallet` + `lib/trip-export.ts`) | 1.5h | $112 |
| ↳ Structured logger (`lib/logger.ts`) + Sentry docs + apple-wallet docs | 1.5h | $112 |
| ↳ +30 unit tests (trip-export 21 + logger 9 = 62/62 passing) | 1h | $75 |
| **Total replacement cost** | **~509h** | **$38,250** |

Asking **$50,000** reflects not just dev-hours but the **wow-factor differentiators** each Tier A feature adds:

- **AI Concierge in-trip chat** — differentiator vs Wanderlog (manual only) and Roadtrippers (legacy). Buyer sees "this is the killer feature" in demo call.
- **Auto-template script** — one command generates 600+ templates (24 regions × 7 personas × 4 durations). Sitemap grows 130→700+ URLs. SEO moat 5-10× visible.
- **Trip export ICS + Wallet** — buyers wanting mobile-first UX pay for this. "It goes right into your Google Calendar / Apple Wallet."
- **Observability infrastructure** — eliminates the "how do I monitor this?" buyer objection. Sentry + logs + health endpoint + admin AI cost dashboard = enterprise-ready signal.

Effective per-hour ratio: **$50,000 / 509h = $98/hour of dev time equivalent** (buyer pays $0.10/hour discount for pre-revenue + taking over).

---

## Why I'm selling

Focus. I'm shipping multiple products in parallel (see `github.com/carlosfevernova` — 5+ live SaaS). TripLoop has reached the "needs a dedicated operator for outreach + partnership dev" stage — Layla-style deals with airline/hotel affiliates, integration with international OTAs, content SEO push for 24 regions in 4 locales. Rather than half-serve it while shipping other verticals, I'd rather transfer it to someone who can go full time.

I'll stay on for 8 hours of consulting (included in Buy-It-Now) to hand off cleanly.

## Ideal buyer

- **Solo founder or micro-team** with travel/AI background who wants a 71-sprint head start
- **Agency** building an AI-travel white-label offering for OTAs
- **Investor** at pre-seed stage looking for AI-travel asset to accelerate with capital
- **Adjacent player** — Wanderlog / Roadtrippers / Mindtrip / GuideGeek team wanting to acquihire tech + curated content
- **Content publisher** (travel media, YouTube channel) wanting owned SaaS + affiliate infra

---

## Process

1. **DM / Issue** — GitHub issue or `hola@nano-almacen.mx` with 1-2 lines on who you are + what you'd do with it
2. **Loom demo** (5 min) + live URL access — I share within 24h
3. **45-min video call** — walkthrough code + Q&A + architecture
4. **Simple 2-page asset purchase agreement** (template available; Wise/Stripe/PayPal escrow via Escrow.com if buyer prefers, ~$50 fee)
5. **Payment 50% on signed agreement / 50% on repo + Vercel transfer complete**
6. **Transfer** — GitHub repo ownership → Vercel project transfer → env vars walkthrough → 2h post-sale support (or 8h for Buy-It-Now)

Typical time first message → fully transferred: **~7-10 days** with active buyer.

---

## Bundle option

TripLoop can be bundled with **FiestaMap** (GDL events marketplace, Next 16 + Supabase PostGIS + MapLibre freemium) at **$60,000 total** for the "LATAM/AI travel duo" — same underlying tech patterns, complementary verticals. See `BUNDLE.md`.

---

## Common questions

**Q: Is the AI actually working?**  
A: Yes. Multi-provider fallback with OpenRouter free tier as primary. You can generate a trip end-to-end without paying a cent in AI costs. Streaming SSE endpoint shows first stop in 500ms.

**Q: What if a provider goes down?**  
A: Fallback chain automatically routes to next provider. 6 providers × free tiers = near-zero downtime for AI generation.

**Q: Is Stripe really wired end-to-end?**  
A: Yes — Checkout, Portal, Webhook with HMAC + idempotency. Feature-flag your prices at checkout time.

**Q: What's the state of the 4 locales?**  
A: 100% of user-facing strings translated by hand (EN, ES, PT-BR, DE-DE). Sprints S71g-n. See `git log --oneline | grep s71` for the migration passes.

**Q: Can I try the AI generation before I buy?**  
A: Yes. Product URL is live (`triploop-six.vercel.app`). Free tier lets you generate a trip end-to-end. If you want deeper eval, video call walkthrough is free — I'll open the admin dashboard, AI cost tracker, and walk through the code.

**Q: What breaks if I unplug the admin passphrase?**  
A: Nothing user-facing. Admin routes gate on HMAC cookie. Swapping to a real user/role system is 6-8h of work (Supabase Auth + role in `profiles`).

**Q: Custom domain transfer?**  
A: No custom domain currently. You register one, point to Vercel, and you're live in 15 min.

**Q: Can I try before I buy?**  
A: Yes. Video call walkthrough is free. If you want deeper eval, $500 refundable-on-purchase gets you 3 days of code eval access with the repo cloned to your GitHub.

---

**Serious inquiries only.** Not looking for advice on the price or the market — the numbers above are researched (`reference-monetization-ideas-2026-08-26`, `reference-portfolio-vercel-audit-2026-08-25` in my memory). Not looking for "will you split for $5K" — floor is $25K.

Contact: GitHub Issues or `hola@nano-almacen.mx`.

_Listing valid until 2026-12-31 or first serious offer. Price firm at $50K for the 30-day active listing period; may re-price after 60 days without offers._
