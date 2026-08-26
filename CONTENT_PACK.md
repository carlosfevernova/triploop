# TripLoop — Content Pack (Marketing)

Copy-paste ready content for launch/sale marketing. Each block is self-contained.

---

## 1. X (Twitter) thread — 12 tweets

**Tweet 1 (hook):**
> 71 sprints. 117 commits. 27,897 LOC.
> 
> Just shipped TripLoop — a full-stack AI road-trip planner SaaS. Multi-provider AI, Stripe subs, PWA, WhatsApp bot, 4 native locales.
> 
> Selling it for $55K.
> 
> Thread on what's inside and why 👇

**Tweet 2:**
> The AI orchestration is what took the longest.
> 
> 6-provider fallback chain: OpenRouter → Cloudflare → Fireworks → Groq → Anthropic → Vertex.
> 
> Prompt cache LRU 100 entries, 1h TTL. Cache hits = 10ms, 0 tokens. Curated matches = <200ms, 0 tokens.

**Tweet 3:**
> Streaming SSE endpoint: `phase → region_hint → meta → stop (1×1) → complete`
> 
> User sees the first stop in 500ms (curated) or 2-5s (fresh AI).
> 
> Feels instant even on slow connections. This alone took ~30h to get right.

**Tweet 4:**
> The moat isn't the AI. It's **231 hand-verified POIs across 24 regions in 7 continents**.
> 
> Each POI: name, category, hours, price band, why_visit, coords, confidence_score.
> 
> That's ~360h of research nobody wants to redo.

**Tweet 5:**
> 24 regions × index + detail = 48 pages. Then × 4 locales = 192 localized routes.
> 
> Plus 130+ sitemap URLs, hreflang tags, per-locale metadata.
> 
> Not machine-translated. Every string authored by hand across S71g-n sprints.

**Tweet 6:**
> The 4-locale migration was ~1,300 strings PT + DE authored across 6 sprint passes:
> 
> - S71g: 6 landing components
> - S71h: Comparison + FAQ + FeaturesShowcase
> - S71i: RegionsGrid
> - S71k: region pages + shared UI (8 comps)
> - S71l: static pages (about, terms, privacy, changelog)
> - S71n: trip flow (7 components)

**Tweet 7:**
> Stripe wired end-to-end: Checkout, Billing Portal, Webhook with HMAC + idempotency table.
> 
> Because at-least-once delivery WILL retry your webhook, and if you don't guard against double-processing you'll double-charge or double-cancel users. Migration 017 = fix.

**Tweet 8:**
> Admin dashboard has per-provider AI cost tracker.
> 
> Input tokens / output tokens / latency / estimated cost per request, aggregated per provider.
> 
> Gross margin visible. Blog CMS with 4-locale editor. Technical + investor reports auto-synced.

**Tweet 9:**
> PWA with offline queue via IndexedDB (idb). User adds stops offline → syncs on reconnect.
> 
> MapLibre tile pre-caching so trip page works in airplane mode.
> 
> WhatsApp bot on Twilio with HMAC signature verify + conversation state per user.

**Tweet 10:**
> Playwright E2E: 44/44 passing. Covers auth, Stripe checkout, itinerary create/reorder, region browsing, admin.
> 
> Supabase RLS on 12 tables. `service_role` isolated to Node routes. Rate limiting LRU. CSP via middleware. Zero hardcoded secrets.

**Tweet 11:**
> Comparable: **Layla acquired by Expedia in July 2026** — AI travel planner, pre-revenue, undisclosed 8-figure.
> 
> TripLoop is 6-9 months ahead of any team starting today. Multi-provider AI + curated moat + 4-locale native = you don't rebuild.

**Tweet 12 (CTA):**
> Full pitch: https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md
> 
> Live: https://triploop-six.vercel.app
> Repo (public MIT): https://github.com/carlosfevernova/triploop
> 
> DM if interested. $55K firm / $65K Buy-It-Now with 60-day handoff + 8h consulting.

---

## 2. Hacker News "Show HN" post

**Title:** `Show HN: TripLoop – AI road-trip planner, multi-provider fallback + curated moat`

**Body:**

Hi HN,

I built TripLoop over 71 sprints (117 commits, 27,897 LOC) — an AI-first road-trip planner focused on international leisure travelers visiting the USA.

Key design decisions:

**1. Multi-provider AI fallback chain.** OpenRouter (free tier) is primary, with 5 fallbacks. If a provider rate-limits or 5xx's, the request routes to the next. Free tiers first, paid Anthropic last. Result: near-zero AI-caused downtime.

**2. Curated-first template matching.** Before hitting AI, the request goes through 231 hand-verified POIs across 24 regions. If match score ≥45%, we serve from cache in <200ms with 0 tokens. Only novel prompts hit AI.

**3. Streaming SSE.** The `/api/ai/generate-trip/stream` endpoint emits `phase → region_hint → meta → stop (1×1) → complete` events. User sees first stop in 500ms (curated) or 2-5s (fresh AI). Perceived latency is near-instant.

**4. 4 native locales.** EN, ES, PT-BR, DE-DE — every user-facing string hand-authored, not machine-translated at runtime. ~1,300 PT+DE strings across S71g-n migration sprints.

**5. Full Stripe wiring.** Checkout + Billing Portal + Webhook with HMAC + idempotency table (Stripe delivers at-least-once; without idempotency you'll double-process retries).

Stack: Next.js 15.1, Supabase Postgres, Vercel Fluid Compute (Node.js, not Edge — Edge has too many compat issues), Stripe, MapLibre GL, Serwist PWA, next-intl, Twilio WhatsApp, Resend.

Everything MIT-licensed. Currently pre-revenue with Stripe wired for launch. I'm selling it because I'm shipping multiple products in parallel and TripLoop needs a full-time operator for partnerships + affiliate deals.

Repo: https://github.com/carlosfevernova/triploop
Live: https://triploop-six.vercel.app
FOR_SALE.md: https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md

Curious what you'd change if you took it over. Also happy to answer technical questions in the thread.

---

## 3. Reddit r/SideProject "For Sale" post

**Title:** `[FOR SALE] TripLoop — AI road-trip planner SaaS, 27.8K LOC, Next 15 + Supabase + Stripe + 4 locales. $55K firm.`

**Body:**

TL;DR: 71-sprint AI road-trip planner. Production-grade patterns end-to-end (multi-provider AI, Stripe wired, PWA, WhatsApp bot, 4 native locales, 231 curated POIs across 24 regions). Selling because I'm shipping multiple products in parallel and TripLoop needs a full-time operator for partnerships.

**What's built (all verified):**

- ✅ 27,897 LOC TypeScript across 266 files
- ✅ 51 API endpoints
- ✅ 25 Supabase migrations (idempotent, apply cleanly to fresh project)
- ✅ 117 git commits
- ✅ 80+ page routes
- ✅ 44/44 Playwright E2E tests passing
- ✅ 4 native locales (EN · ES · PT-BR · DE-DE) — 100% hand-translated, not runtime MT
- ✅ 231 curated POIs across 24 regions in 7 continents
- ✅ Stripe Checkout + Portal + Webhook with HMAC + idempotency
- ✅ Multi-provider AI fallback (6 providers)
- ✅ Streaming SSE (first stop in 500ms)
- ✅ PWA with offline queue (Serwist + IndexedDB)
- ✅ WhatsApp bot on Twilio with HMAC signature verify
- ✅ Admin dashboard with AI cost tracker per provider
- ✅ Blog CMS with 4-locale editor

**Comparable:** Layla acquired by Expedia July 2026 (AI travel planner, pre-revenue, undisclosed 8-figure).

**Stack:** Next.js 15.1 · Supabase · Vercel Fluid Compute · Stripe SDK v22 · MapLibre GL · Serwist PWA · next-intl · Twilio · Resend

**Asking:** $55,000 USD firm. Buy-It-Now $65,000 with 60-day handoff + 8h post-sale consulting.

**What's included:** Full MIT-licensed source · 25 Supabase migrations · 231 POIs seed data · 60 templates seed · AUDIT.md · admin reports · Vercel deploy config · PWA config · 4 locale message catalogs · Playwright E2E · 2h post-sale support (8h with BIN)

**What's NOT:** Supabase project · API keys · custom domain · MRR · trademark

**Live:** https://triploop-six.vercel.app  
**Repo (public MIT):** https://github.com/carlosfevernova/triploop  
**FOR_SALE.md:** https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md  
**Prospectus:** https://triploop-sale.vercel.app

DM me. Zero pushback if not a fit.

---

## 4. LinkedIn post

**Post body:**

After 71 shipping sprints (117 commits, 27,897 LOC), I'm putting TripLoop up for sale.

It's a full-stack AI road-trip planner SaaS with production-grade patterns end to end:

→ Multi-provider AI fallback chain (6 providers)  
→ Streaming SSE generation (first stop in 500ms)  
→ 231 hand-curated POIs across 24 regions in 7 continents  
→ 4 native locales (EN · ES · PT-BR · DE-DE) — 100% hand-authored  
→ Stripe Checkout + Portal + Webhook with idempotency  
→ PWA with offline queue (IndexedDB)  
→ WhatsApp bot (Twilio) with HMAC signature verify  
→ Admin dashboard with per-provider AI cost tracker

**Why now:** Layla (AI travel planner) was acquired by Expedia in July 2026 — the AI-travel sector is being validated by strategic acquirers. TripLoop is 6-9 months ahead of any team starting today. But it needs a full-time operator for partnerships + affiliate deals + content SEO push, and I'm juggling multiple products.

**Asking:** $55,000 USD firm. Buy-It-Now $65,000 with 60-day handoff + 8h consulting.

Full pitch and repo (public MIT-licensed):
🔗 https://github.com/carlosfevernova/triploop  
🔗 https://triploop-six.vercel.app (live)

DM if interested. Zero pushback if not a fit — happy to walk you through even out of curiosity.

**Ideal buyer:** solo founder w/ travel or AI background · agency building AI-travel white-label · investor pre-seed looking for AI-travel asset · adjacent SaaS team (Wanderlog / Roadtrippers / Mindtrip / GuideGeek) for acquihire · travel content publisher wanting owned SaaS.

#SaaS #IndieHackers #AI #Travel #Acquihire #ForSale

---

## 5. Medium case study — "Building an AI travel SaaS in 71 sprints: What worked, what didn't"

**Working title options:**
- "27,897 lines of code in 71 sprints: Anatomy of an AI travel SaaS"
- "Shipping 71 sprints in 3 months — the TripLoop retrospective"
- "How I built a multi-provider AI fallback chain for a travel SaaS"

**Outline (article ~2,500 words):**

**1. Intro (200 words)**
- What TripLoop is (AI road-trip planner)
- Why I built it (Layla-adjacent thesis, gap in AI planning vs chat)
- Why I'm writing this (about to sell, want the learnings public)

**2. The design decision that mattered most: multi-provider AI (450 words)**
- Problem: free tier providers 5xx or rate-limit unpredictably
- Solution: 6-provider fallback chain (OpenRouter → Cloudflare → Fireworks → Groq → Anthropic → Vertex)
- Result: near-zero AI-caused downtime, $0 AI cost on 60%+ of requests
- Code snippet: the fallback wrapper

**3. Curated-first vs AI-only (400 words)**
- Why AI-only is a bad UX (halluciantions, slow, expensive)
- 231 hand-verified POIs across 24 regions = content moat
- Template matcher scores curated POIs into the AI context
- <200ms hits with 0 tokens on 60%+ of requests

**4. Streaming SSE was harder than I thought (350 words)**
- Naive approach: hold whole response, then return
- Better: emit events `phase → region_hint → meta → stop → complete`
- First stop in 500ms (curated) or 2-5s (fresh AI)
- UI feels instant

**5. The 4-locale migration (400 words)**
- Started EN + ES only, added PT-BR + DE-DE in S71g-n
- ~1,300 strings hand-authored across 6 sprint passes
- Not machine-translated at runtime — every string authored
- Per-locale sitemap, hreflang, metadata
- Trade-off: content moat vs shipping speed

**6. Stripe idempotency: the P0 bug you'll ship without knowing (300 words)**
- At-least-once delivery WILL retry your webhook
- Without idempotency table → double-processing → double-charge users
- Migration 017: `processed_webhook_events` with `stripe_event_id` UNIQUE
- Insert → conflict → skip = safe

**7. What I'd do differently (300 words)**
- Would ship pricing at v1, not v0.8
- Would instrument Web Vitals RUM from S1 not "later"
- Would start with Playwright E2E from S1 not S30
- Would skip WhatsApp bot until validated demand

**8. Why I'm selling (150 words)**
- Focus. Multiple products in parallel.
- Needs dedicated operator for partnerships + affiliate + SEO push
- Rather transfer to someone who can go full time

**9. Closing (100 words)**
- Live URL, repo, FOR_SALE.md link
- DM for interest

**Publication targets:**
- Medium personal
- Cross-post to Hashnode + Dev.to
- Submit to newsletter: Indie Hackers weekly, TLDR AI, Product Hunt Ship, TravelTech Journal

---

## 6. Product Hunt launch (optional)

If TripLoop still hasn't sold in 60 days, launch on Product Hunt as "AI Road-Trip Planner" (not "for sale") to generate traction, then re-list for higher price:

**Tagline:** `AI road-trip planner with 231 curated POIs in 24 regions`

**Description:**
> Multi-provider AI (never blocked), streaming SSE (first stop in 500ms), 4 native locales, PWA with offline queue. Free to start, subscription for unlimited trips.

**Assets needed:**
- 3 screenshots (landing, trip generation, itinerary editor)
- 1 GIF (streaming generation happening)
- Loom demo (2 min)
- Maker comment with technical story

---

## 7. TikTok / short-form video hook (if going wide)

Script (60 seconds):

**Hook (0-3s):** "I built an AI road-trip planner in 3 months and I'm selling it for $55K."

**Setup (3-15s):** "It has 27,897 lines of code, 6 AI providers with automatic fallback, streaming responses, 4 native languages, and 231 hand-curated places across 24 regions."

**Demo (15-45s):** [Screen recording of streaming generation → itinerary editor → offline mode → language switcher]

**Payoff (45-60s):** "Full MIT license, public repo. Layla just got acquired by Expedia for 8 figures — this is 6 months ahead of anyone starting today. Link in bio."

---

## 8. Follow-up email sequence (if buyer replies)

**Email 1 — immediate response (within 4h of DM/reply):**

Subject: `Re: TripLoop — quick reply + Loom demo`

Hi [Name],

Thanks for reaching out on TripLoop. Here's what I can share right now:

- **Loom demo (5 min):** [link when recorded]
- **Live URL access:** https://triploop-six.vercel.app (SSO temporarily disabled for eval — active 48h)
- **Repo (public MIT):** https://github.com/carlosfevernova/triploop
- **Full pitch:** https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md

If you want a video call to walk through code + Q&A, I have 45-min slots available [propose 3 times].

Zero pressure — happy to answer async in email too.

Carlos

---

**Email 2 — after video call (within 24h):**

Subject: `TripLoop — recap + next steps`

Hi [Name],

Great chat. Here's a recap of what we covered + what's next.

**What you asked about:**
1. [Question 1] → [Short answer + link to code]
2. [Question 2] → [Short answer + link to code]
3. [Question 3] → [Short answer + link to code]

**Purchase terms confirmed:**
- $55,000 USD firm (or $65K Buy-It-Now if you want 60-day handoff + 8h consulting)
- 50% on signed agreement, 50% on repo + Vercel transfer complete
- Payment method: [Wise / Stripe / PayPal / Escrow.com]

**Next steps:**
1. I'll send the 2-page asset purchase agreement by [date]
2. You review + sign or return with edits
3. Wire 50% initial deposit
4. Transfer sequence: GitHub repo → Vercel project → env vars walkthrough → 2h post-sale support (or 8h)
5. Wire remaining 50% on completion

Any last questions before I send the agreement?

Carlos

---

**Email 3 — post-transfer thank you (day after close):**

Subject: `TripLoop transfer complete — 2h support scheduled`

Hi [Name],

Transfer done. Repo is yours, Vercel project is yours, env vars are in the walkthrough doc.

**Your 2h post-sale support:**
- Book here: [Calendly link]
- Or async via [preferred channel — email/Slack/GH issues]
- Suggested topics: first-week setup, adding your Stripe prices, tuning AI providers for your traffic, migrating PWA to your domain

Congrats on the acquisition. If you want to share what you're building publicly, I'd love to reshare on X.

Best,
Carlos

---

## 9. Post-listing telemetry to track

For each channel, track:

| Channel | Metric | Success threshold |
|---|---|---|
| SideProjectors | Views + saves + messages | 10+ views/day, 1+ message/week |
| Flippa | Views + watchers + bids | 50+ views/week, 3+ watchers |
| Reddit r/SideProject | Upvotes + comments + DMs | 15+ upvotes, 5+ comments, 1+ DM |
| Hacker News Show HN | Points + comments | 20+ points, 10+ comments |
| Twitter thread | Impressions + likes + retweets + replies + DMs | 5k+ impressions, 3+ DMs |
| LinkedIn | Impressions + engagements + DMs | 2k+ impressions, 2+ DMs |
| Medium article | Reads + claps + responses | 500+ reads, 1+ inbound |

**Kill criteria:** If 30 days pass without a single serious buyer conversation, pivot to bundle strategy (TripLoop + FiestaMap) or defer to 6-12 month productization sprint.
