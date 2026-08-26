# Flippa — Submit Ready (copy-paste each field)

**URL to submit:** https://flippa.com/sell  
**Cost:** $29 listing fee + 10% commission at close (~$3,500 on $35K sale)  
**Time to submit:** ~20 min (more fields than SideProjectors)

---

## Field-by-field

### Category
```
Businesses
```

### Sub-category
```
SaaS
```

### Business Type
```
Starter (Pre-Revenue MVP)
```

### Site / Business Name
```
TripLoop
```

### Tagline (max 100 chars)
```
AI road-trip planner SaaS · 27.8K LOC · Multi-provider AI · Stripe wired · 4 native locales · PWA · $35K
```

### Description (paste full block)

Use the same long description from `sideprojectors.md` above. Flippa has no strict char limit but bullet-heavy structure works best.

---

### Monetization

```
Subscription
```

Note under monetization:
```
Stripe SDK v22 fully wired end-to-end: Checkout Sessions, Billing Portal, Webhooks with HMAC signature verification and idempotency table (migration 017 prevents at-least-once double-processing). Trial-ending cron warning implemented. Tier gating in middleware. Pre-revenue MVP with subscription infrastructure production-ready — buyer flips a switch at Stripe dashboard to enable prices.
```

### Traffic

- **Monthly Visitors:** 0 (pre-launch, waitlist active)
- **Monthly Pageviews:** 0
- **Traffic Sources:** N/A (pre-launch)
- **Waitlist signups:** {fetch current count from Supabase before submitting}
- **Sitemap URLs indexable:** 130+

### Financials

- **Monthly Revenue (last 12 months average):** $0 USD
- **Monthly Expenses (average):** ~$0 USD (all free tiers: Vercel Hobby, Supabase free, OpenRouter free tier, Gemini free tier, MapLibre self-hosted tiles)
- **Monthly Profit:** $0
- **Trailing 12-Month Revenue:** $0
- **Estimated Time to Build:** 471 hours (@ $75/hr = $35,325 replacement cost, defended line-item in FOR_SALE.md)

### Asking Price
```
35000
```

### Currency
```
USD
```

### Business Model
```
Subscription SaaS (Stripe wired, pre-launch)
```

### Included In Sale (bullet list)

- Full MIT-licensed source code
- 25 Supabase migrations (idempotent, apply to fresh project)
- 231 hand-verified POIs across 24 regions (seed scripts)
- 60 trip templates (seed scripts)
- 4 locale message catalogs (EN · ES · PT-BR · DE-DE)
- AUDIT.md technical audit (schema, security, performance)
- Admin reports (technical + investor + features index)
- Vercel deploy config (vercel.json, next.config.ts)
- PWA config (Serwist SW, manifest, icons)
- Playwright E2E test suite (44/44 passing)
- Public GitHub repo (carlosfevernova/triploop)
- 2 hours post-sale support via video call
- Optional Vercel project alias transfer (triploop.vercel.app)

### Not Included

- Supabase project (buyer creates their own)
- API keys (Google Maps, Stripe, Anthropic, Twilio, Resend, OpenRouter)
- Custom domain (buyer registers ~$12/year for .com)
- Meta Business account for WhatsApp bot
- Users / MRR (pre-revenue MVP)
- Trademark (name transfer negotiable)

### Reserve Price
```
25000
```

Rationale: allows negotiation window from $35K asking down to $25K floor for realistic sale within 30 days.

### Buy-It-Now Price
```
45000
```

Includes 60-day handoff + 8 hours post-sale consulting.

### Auction Duration
```
30 days
```

### Verification Documents

Upload:
1. **6 screenshots** of prospectus + repo + AUDIT.md + file tree (see sideprojectors.md screenshots section)
2. **Live URL access** (triploop-sale.vercel.app HTTP 200; product URL restored on buyer request)
3. **Public repo link** — https://github.com/carlosfevernova/triploop
4. **Loom demo video** (5 min walkthrough — record ASAP)
5. **FOR_SALE.md PDF** — export from repo, upload as document
6. **AUDIT.md PDF** — export from repo, upload as document
7. **`git log --oneline | wc -l`** output showing 117 commits (screenshot terminal)
8. **`find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1`** output showing 27,897 LOC (screenshot terminal)

### Additional Info section

```
This is a production-grade SaaS scaffold with 71 sprints of shipping work behind it. The code, migrations, curated content, and 4-locale i18n represent ~470 hours of senior full-stack developer time. Asking $35K reflects a substantial discount for pre-revenue status while defending replacement cost.

Comparable: Layla acquired by Expedia in July 2026 (AI travel planner, pre-revenue) — direct sector validation. TripLoop is 6-9 months ahead of any team starting today; multi-provider AI + curated moat + 4-locale native can't be rebuilt in <6 months.

Full pitch: https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md
Bundle option: TripLoop + FiestaMap = $40K (see BUNDLE.md in repo).

Serious inquiries only. Fire sale floor $18K for 7-day close.
```

---

## Post-submission tasks

1. **Watch Flippa "Newest Listings" feed** — Flippa promotes new listings to top of category for 24-48h
2. **Add 3-5 tags** in Tags field when prompted (`saas` `next.js` `supabase` `ai` `travel`)
3. **Respond to first 3-5 questions publicly** on the listing Q&A section — signals liveness to browsers
4. **Track watcher count daily** — >5 watchers in first week = strong signal; <2 = adjust price or improve screenshots

**Fees at close:** $29 upfront + 10% of sale = $3,529 total. Net to you at $35K sale: ~$31,470.
