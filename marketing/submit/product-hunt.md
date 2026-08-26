# Product Hunt Launch — Ready (defer if not sold in 30 days)

**URL to submit:** https://www.producthunt.com/posts/new  
**Best time to launch:** Tuesday 12:01am PST (24h maker feed)  
**Cost:** Free  
**Karma:** New accounts can post, but existing engagement (5+ upvotes/comments in last 30d) helps launch discovery

---

## When to use

**Skip if:** TripLoop sells within 30 days via SideProjectors / Flippa / Reddit / HN / direct outreach.

**Use if:** No serious buyers after 30 days AND you want to:
- (a) Generate traffic + waitlist growth as leverage for higher price
- (b) Pivot to launching as "for use" product (not "for sale") to build ARR
- (c) Position for acqui-hire by making TripLoop visibly used

If launching for (b) or (c), remove "$35K for sale" mentions from the pitch — position as active product.

---

## Product Hunt fields

### Name
```
TripLoop
```

### Tagline (max 60 chars — REQUIRED)
```
AI road-trip planner with 231 curated POIs in 24 regions
```

**Char count:** 55

### Alt tagline (if first flagged):
```
Streaming AI road-trip generation with curated content moat
```

### Description (max 260 chars)
```
Multi-provider AI (6-provider fallback, never blocked) · streaming SSE (first stop in 500ms) · 4 native locales · PWA with offline queue · WhatsApp bot · 231 hand-curated POIs across 24 regions. Free to start, subscription for unlimited trips.
```

### Category (choose primary + up to 3 secondary)

Primary: `Travel`  
Secondary: `Artificial Intelligence`, `Productivity`, `Marketing`

### Gallery Assets (upload in order)

1. **1st image (hero):** Screenshot of landing page hero — headline + CTA visible
2. **2nd image:** Streaming SSE generation happening (screenshot with visible progress indicators)
3. **3rd image:** Itinerary editor with map + drag-drop stops
4. **4th image:** Multi-language toggle showing PT-BR or DE-DE version
5. **5th image (optional):** WhatsApp bot conversation screenshot

### Media (video)

Loom demo 2-min version (shorter than the 5-min sale demo):
- **0:00-0:20** — Hero + type a trip prompt ("7-day CA coast, mid-range hotels, EV chargers along route")
- **0:20-0:50** — Streaming SSE generation — show first stop appearing at 500ms
- **0:50-1:20** — Itinerary editor — drag-drop reorder, add stop, open POI card
- **1:20-1:50** — Language switch → PT-BR shows fully-native strings
- **1:50-2:00** — CTA "Sign up for free"

### Maker Comment (post at launch time)

```markdown
Hi PH! Maker here 👋

I built TripLoop over 71 sprints because I got frustrated with existing road-trip planners — either manual-only (Wanderlog) or chat-first-then-what (Mindtrip). I wanted the AI to actually plan a trip end-to-end, streaming stops one-by-one so you see progress.

Three technical decisions I'd love your feedback on:

**1. Multi-provider AI fallback** — OpenRouter → Cloudflare → Fireworks → Groq → Anthropic → Vertex. If one rate-limits, request routes to next. Result: zero AI-caused downtime, 60%+ of requests hit curated cache (0 tokens).

**2. Curated content moat** — 231 hand-verified POIs across 24 regions took ~360h to research. AI treats these as ground truth to avoid hallucinations.

**3. 4 native locales** — EN/ES/PT-BR/DE-DE with every string hand-authored (not runtime MT). Copy tone varies per market.

Stack: Next.js 15, Supabase, Stripe, MapLibre, Serwist PWA, Twilio WhatsApp.

Free tier: generate unlimited trips with basic features. Pro tier ($8/mo): unlimited stops per trip, offline mode, itinerary export, priority AI.

Public MIT repo: https://github.com/carlosfevernova/triploop  
Live prospectus: https://triploop-sale.vercel.app

Would love PH's take — what's missing, what's confusing, what feels magical vs janky?
```

### Topics / Tags (up to 5)

- `AI`
- `Travel`
- `Multilingual`
- `PWA`
- `Startup`

---

## Launch day playbook

**T-24h:**
- Confirm all assets uploaded and visible in preview
- Draft "T-2h" tweet linking to PH launch URL (use `producthunt.com/posts/triploop` placeholder)
- Draft 3-4 follow-up tweets to fire throughout day

**Launch day (T=0):**
- **12:01am PST** — post goes live
- **12:05am PST** — post maker comment (above template)
- **6am PST** — Fire first tweet: "Just launched TripLoop on @ProductHunt — [link]. Would love your support 🚀"
- **8am PST** — DM 20 friends with PH link asking for upvote + comment
- **12pm PST** — Second tweet with new angle: technical thread or asset gallery
- **3pm PST** — Reply to every PH comment within 30 min
- **6pm PST** — Third tweet: "6 hours left today on PH — currently at #X in Travel category 🎯"
- **11:59pm PST** — Final push tweet + comment thanking supporters

**T+24h:**
- Post launch retrospective on X thread
- Cross-post to Indie Hackers "Launched Today"
- Follow up with anyone who commented "interested in enterprise" or "can I try this at work"

---

## Success metrics

- **1000+ upvotes** → Top 5 of the day → featured in PH weekly digest → 5K+ organic visits
- **500-1000 upvotes** → Top 20 → 2K organic visits, some PR pickup
- **<500 upvotes** → fizzled, treat as "we tested and validated"; don't relaunch same product

If launch generates 100+ waitlist signups, use that traction as leverage for sale price bump ($35K → $40-50K).

---

## Post-launch pivot decision

**Scenario A: Launch bombs (<300 upvotes, <30 waitlist)**  
→ Sell asset ASAP at $28-32K. Product isn't finding organic PMF; buyer needs to bring distribution.

**Scenario B: Launch modest (500-800 upvotes, 100-300 waitlist)**  
→ Hold sale at $35K for 60 more days. Traction adds narrative value.

**Scenario C: Launch strong (1000+ upvotes, 500+ waitlist)**  
→ Reprice sale to $60-80K. You now have a demoable growth story, not just an asset.

**Scenario D: Launch viral (5000+ upvotes)**  
→ Don't sell. Convert waitlist, hit MRR, sell later at 4-5x SDE.
