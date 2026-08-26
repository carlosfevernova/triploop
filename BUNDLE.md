# TripLoop + FiestaMap — LATAM Travel/Events Duo Bundle

**Optional bundle for buyers who want both: TripLoop (AI road-trip planner, 24 regions global) + FiestaMap (GDL events marketplace, single-city freemium).**

- **Bundle asking:** **$40,000 USD** (individual sum $47,500 — bundle discount ~16%)
- **Buy It Now bundle:** **$52,000 USD** (60-day handoff + 12h total consulting)
- **Fire sale bundle (7-day close):** $28,000 USD floor

---

## Why this bundle

Two production-grade LATAM-relevant SaaS with **complementary tech patterns** and **adjacent verticals**:

1. **TripLoop** covers international leisure travel (multi-day trips, 24 regions global)
2. **FiestaMap** covers local nightlife/events discovery (single city, GDL-first)

Both share the same underlying tech stack, so **one dev can operate both**:
- Next.js 15/16 App Router + Turbopack
- Supabase Postgres with RLS
- MapLibre GL for maps
- Vercel Fluid Compute
- Stripe subscriptions (TripLoop shipped; FiestaMap scaffolded)
- Multi-tenant patterns

**Cross-learning opportunities:**
- FiestaMap can borrow TripLoop's curated-first template matching for event recommendations
- TripLoop can borrow FiestaMap's PostGIS radius search for "things near you" during a trip
- Both can share the same admin dashboard shell
- Both can share the same locale message catalog structure

---

## Individual product summary

### 1. TripLoop ($35,000 individual)

**AI road-trip planner for international tourists visiting the USA.**

- 27,897 LOC TypeScript across 266 files
- 51 API endpoints
- 25 Supabase migrations
- 117 git commits
- 231 hand-verified POIs across 24 regions in 7 continents
- 60 trip templates
- 4 native locales (EN · ES · PT-BR · DE-DE)
- Stripe Checkout + Portal + Webhook with HMAC + idempotency
- Multi-provider AI fallback chain (6 providers)
- Streaming SSE (first stop in 500ms)
- PWA with offline queue (Serwist)
- WhatsApp bot (Twilio) with HMAC signature verify
- Admin dashboard with per-provider AI cost tracker
- Playwright E2E 44/44 passing

Live: https://triploop-six.vercel.app  
Repo: https://github.com/carlosfevernova/triploop  
FOR_SALE: [FOR_SALE.md](./FOR_SALE.md)

### 2. FiestaMap ($12,500 individual)

**Geo-first events marketplace for Guadalajara. Freemium single-city.**

- Next.js 16 App Router + Turbopack
- Supabase Postgres + PostGIS (radius search)
- MapLibre GL with cluster markers
- Freemium tier (3 events/month free, unlimited paid)
- Vendor onboarding + event submission flow
- Public event discovery + map + list view
- Real-time updated attendee counts
- Stripe subscriptions scaffolded (not shipped)

Live: https://fiestamap.vercel.app  
Repo: https://github.com/carlosfevernova/fiestamap (public MIT)

---

## Bundle math

| | Individual | Bundle |
|---|---|---|
| TripLoop asking | $35,000 | $30,000 (discount) |
| FiestaMap asking | $12,500 | $10,000 (discount) |
| **Total** | **$47,500** | **$40,000** |
| **Discount** | | **~16%** |

**Bundle buyer saves $7,500** and gets a coherent LATAM travel/events portfolio ready to launch as a combined operator.

---

## Ideal bundle buyer

- **Solo founder LATAM** wanting a travel/events double-vertical portfolio ready to launch
- **Agency** building AI-travel white-label + local events marketplace for LATAM cities
- **Ecosystem player** (Rappi Ventures alumni, Airbnb LATAM alumni, Despegar product alumni) with distribution + relationships in travel/events verticals
- **Investor early-stage** wanting a diversified acqui-portfolio to accelerate with capital
- **Content publisher** (travel + nightlife content) wanting owned SaaS + affiliate infra + city-first vertical to expand

---

## What's included (bundle)

**Both products, full transfer:**

- ✅ 2 MIT-licensed GitHub repos (public)
- ✅ 27 Supabase migrations total (25 TripLoop + 2 FiestaMap)
- ✅ 231 curated POIs (TripLoop) + FiestaMap event seed data
- ✅ 60 TripLoop templates + FiestaMap venue types seed
- ✅ 4 locale message catalogs (TripLoop) + ES-MX (FiestaMap)
- ✅ 2 Vercel projects (transfer optional)
- ✅ Cross-project architecture doc (this file)
- ✅ Individual FOR_SALE + LISTINGS + CONTENT_PACK per product
- ✅ AUDIT.md (TripLoop) + roadmap FiestaMap
- ✅ **12 hours total post-sale support via video** (8h TripLoop + 4h FiestaMap)

## What's NOT included

- ❌ Supabase projects (buyer creates their own)
- ❌ API keys (Google Maps, Stripe, Anthropic, Twilio, Resend, MapTiler for FiestaMap)
- ❌ Custom domains (buyer registers `.com` + `.mx`)
- ❌ Meta Business account (WhatsApp bot in TripLoop)
- ❌ Users / MRR (both pre-revenue)
- ❌ Trademarks (name transfers negotiable per product)

---

## Process

1. Message via GitHub issue in TripLoop repo, or email `hola@nano-almacen.mx`
2. **Combined Loom demo (~10 min)** showing both products
3. **Video call 60 min** — walking through both architectures + Q&A
4. **Simple asset purchase agreement** (2-page template, covers both products)
5. **Payment 50% inicial + 50% at transfer complete** (Wise/Stripe/PayPal/Escrow.com)
6. **Transfer sequence:** TripLoop first (larger, more setup) → FiestaMap
7. **12 hours support distributed at buyer's discretion**

Total time first message → complete transfer: **~10-14 days** with active buyer.

---

## FAQ Bundle

**Q: Can I buy only 1 product?**  
A: Yes. TripLoop $35K individual, FiestaMap $12.5K individual. Bundle is a discount for buying both together.

**Q: Are the products integrated?**  
A: Independent currently. Bundle strategy is portfolio (2 complementary verticals sharing tech patterns), not integrated product. Cross-learning opportunities documented above.

**Q: Why bundle if I only care about TripLoop?**  
A: You probably shouldn't. FiestaMap is single-city (GDL) with more work to expand to other cities. If you don't have LATAM events distribution, buy TripLoop only.

**Q: Why bundle if I want to expand FiestaMap to more cities?**  
A: TripLoop's regions architecture (24 regions × index+detail scaling to 4 locales) is exactly the pattern you'd want for expanding FiestaMap to more cities. Buying both means you get the ref implementation.

**Q: What's the state of Stripe on FiestaMap?**  
A: Scaffolded but not shipped. TripLoop's Stripe integration (Checkout + Portal + Webhook + idempotency + trial-ending cron) is fully wired and can be ported to FiestaMap in ~6-8h.

**Q: Post-sale support — how are the 12h split?**  
A: Default 8h TripLoop + 4h FiestaMap. Flexible at buyer discretion. First 2h usually goes to Supabase migration setup.

---

**Ready to bundle?** DM in GitHub issues or email `hola@nano-almacen.mx`.

_Bundle offer available until 2026-12-31 or first bundle sale. Individual pricing continues per product FOR_SALE.md indefinitely._
