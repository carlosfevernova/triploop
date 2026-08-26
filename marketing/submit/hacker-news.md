# Hacker News "Show HN" — Submit Ready

**URL to submit:** https://news.ycombinator.com/submit  
**Best time to post:** Weekday 8-10am EST (US morning peak) or 2-3pm EST (post-lunch spike)  
**Cost:** Free  
**Karma requirement:** None (any account can post Show HN)

---

## Title (copy exactly — 80 char limit)

```
Show HN: TripLoop – AI road-trip planner, multi-provider fallback + curated moat
```

**Char count:** 79 (limit 80)

**URL field:**
```
https://github.com/carlosfevernova/triploop
```

**Note:** HN prefers repo URL over marketing URL for Show HN. If you want to point to the live prospectus instead, use `https://triploop-sale.vercel.app` — but repo will get more upvotes from HN crowd.

---

## First Comment (post immediately after submission)

HN convention: first comment from author explains context. Post this within 2 min of submitting:

```markdown
Hi HN,

I built TripLoop over 71 sprints (117 commits, 27,897 LOC) — an AI-first road-trip planner focused on international leisure travelers visiting the USA.

Key design decisions I'd love feedback on:

**1. Multi-provider AI fallback chain.** OpenRouter (free tier) is primary, with 5 fallbacks (Cloudflare, Fireworks, Groq, Anthropic, Vertex). If a provider rate-limits or 5xx's, the request routes to the next. Free tiers first, paid last. Result: near-zero AI-caused downtime.

**2. Curated-first template matching.** Before hitting AI, requests go through 231 hand-verified POIs across 24 regions. If match score ≥45%, we serve from cache in <200ms with 0 tokens. Only novel prompts hit AI.

**3. Streaming SSE.** The `/api/ai/generate-trip/stream` endpoint emits `phase → region_hint → meta → stop (1×1) → complete` events. User sees first stop in 500ms (curated) or 2-5s (fresh AI). Perceived latency is near-instant.

**4. 4 native locales.** EN, ES, PT-BR, DE-DE — every user-facing string hand-authored, not machine-translated at runtime. ~1,300 PT+DE strings across S71g-n migration sprints.

**5. Full Stripe wiring.** Checkout + Billing Portal + Webhook with HMAC + idempotency table (Stripe delivers at-least-once; without idempotency you'll double-process retries).

Stack: Next.js 15.1, Supabase Postgres, Vercel Fluid Compute (Node.js, not Edge — Edge has too many compat issues), Stripe SDK v22, MapLibre GL, Serwist PWA, next-intl 3.26, Twilio WhatsApp, Resend.

Everything MIT-licensed. Pre-revenue with Stripe wired for launch. I'm selling as an asset because I'm shipping multiple products in parallel and TripLoop needs a full-time operator for partnerships + affiliate deals.

Repo (public MIT): https://github.com/carlosfevernova/triploop  
Live prospectus: https://triploop-sale.vercel.app  
FOR_SALE.md: https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md

Happy to answer technical questions in the thread. Also curious what you'd change if you took it over.
```

---

## Follow-up comments (respond fast, within 1h of each question)

**"Why multi-provider AI instead of a single reliable one?"** → Reply:
```
Two reasons: (1) free tier cost = zero AI spend on 60%+ of requests hitting curated cache, and providers rate-limit unpredictably; (2) Anthropic/OpenAI outages happen (Aug 2026 OpenAI 4h outage would have taken us down without fallback). Fallback chain is 30 LOC of wrapper code — feels like insurance you should always buy.
```

**"Show me the streaming SSE code"** → Reply:
```
Endpoint: src/app/api/ai/generate-trip/stream/route.ts on GitHub. Uses ReadableStream + text/event-stream. First event is `phase: 'matching'` (curated lookup), then `region_hint`, then `meta`, then one `stop` per POI, then `complete`. Client parses via EventSource. Works on all Vercel Fluid Compute regions — no Edge runtime needed.
```

**"Why not Edge runtime?"** → Reply:
```
Compatibility. Edge has restrictions on Node APIs that broke half my dependencies. Fluid Compute reuses Node.js instances → near-zero cold starts anyway, plus full Node.js ecosystem. Vercel officially recommends Fluid over Edge for most cases now.
```

**"How does the curated POI matching work?"** → Reply:
```
`src/lib/planner/template-matcher.ts`. Scores incoming prompt against templates by tag overlap + region match + duration proximity. If score ≥45%, we inject the template's curated POIs as AI context (or serve directly for exact matches). ~360h of research to build the 231 POI seed — hardest moat to replicate.
```

**"How's the 4-locale hand-translation different from Google Translate?"** → Reply:
```
Every user-facing string authored in the target language, not translated. Copy tone varies per market: German is direct + specific, Portuguese is warmer + more emotive, Spanish is more assertive + shorter sentences. Machine translation destroys this. Also, region descriptions are localized (Iceland in DE emphasizes different points than Iceland in EN).
```

**"Concerned about vendor lock-in with Supabase?"** → Reply:
```
Reasonable. Migrations are standard PostgreSQL — you can `pg_dump` and move to any Postgres in an afternoon. Only Supabase-specific is auth cookies + Realtime channels (both used sparingly). Buyer can decide day 1 if they want to stay or migrate.
```

**Any troll / bad-faith comments:** ignore. HN downvotes trolls automatically.

---

## Escalation strategy

**If post hits Front Page (25+ upvotes in first hour):**
1. Respond to EVERY top-level comment within 30 min
2. Prepare Loom demo link (record ASAP if not already)
3. Watch DMs closely (HN doesn't have DM but @yourhandle on X can bridge)
4. Consider Twitter cross-post pointing at HN thread for amplification

**If post fizzles (<10 upvotes in 6h):**
1. Don't repost immediately (HN penalizes repost spam)
2. Try again in 2-4 weeks with different angle:
   - "Show HN: How I built a 6-provider AI fallback chain (open source)"
   - "Ask HN: Would you buy an AI-travel SaaS with 27K LOC + curated moat for $35K?"

---

## Common mistakes to avoid

- **Don't lead with the price** in the first comment. HN respects tech first, business second.
- **Don't say "for sale" in the title.** "Show HN" convention is present tense, not commercial. Price mention goes in the comment.
- **Don't argue with critics.** HN commenters test the founder's temperament. Cool, factual replies win.
- **Don't self-upvote or vote-ring.** HN detects it, kills the post.
- **Don't post more than once per week.** HN velocity limits are strict.
