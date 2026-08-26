# Roadmap

Public roadmap for TripLoop. Updated after each shipping sprint. See [CHANGELOG.md](./CHANGELOG.md) for detailed sprint history.

**Repo status:** 140+ commits · 89/89 tests · 4 native locales · [Live](https://triploop-six.vercel.app) · MIT public · [For Sale $55K](./FOR_SALE.md)

---

## ✅ Shipped (last 30 days)

Recent sprints, most recent first:

- **Tier B** (2026-08-26): Booking.com Rapid API + GH Actions CI + Trip Stats
- **Tier A** (2026-08-26): AI Concierge chat widget + Auto-templates gen script + Trip ICS/Wallet export + Structured logger + Sentry docs
- **4x Sprint** (2026-08-26): AI Costs sidebar link + Feature Flags infra + Admin CHANGELOG viewer + Vitest 32 tests + coverage v8
- **Value-Up-Plus** (2026-08-26): LICENSE + CHANGELOG + CONTRIBUTING + README 10 badges
- **Audit-Fix** (2026-08-26): `/api/health` endpoint + AUDIT.md refresh S40→S71n + `.env.example` 8→33 vars
- **Sale-Push** (2026-08-26): 5 outreach messages + Submit-ready kit for 5 marketplaces + dynamic OG image
- **Value-Up** (2026-08-26): Repo GitHub public + FOR_SALE.md + LISTINGS.md + CONTENT_PACK.md + BUNDLE.md
- **S71n** (2026-08-10): 4-locale migration pass 6 — trip flow (7 components, ~180 PT+DE strings)
- **S71m** (2026-08-10): 4-locale migration pass 5 — itinerary flow
- **S71l** (2026-08-10): 4-locale migration pass 4 — static pages
- **S71k** (2026-08-10): 4-locale migration pass 3 — region pages + shared UI (8 components)
- **S71i** (2026-08-10): RegionsGrid full 4-locale — closes landing i18n
- **S71h** (2026-08-10): 4-locale migration pass 2 — Comparison + FAQ + FeaturesShowcase
- **S71g** (2026-08-10): 4-locale migration pass 1 — 6 landing components + L() helper
- **S70** (2026-08-10): 4-locale expansion (en/es/pt/de) begin

---

## 🟡 In progress (this sprint)

None currently. All Tier A + Tier B features are shipped.

If you're the future owner and want a running start, prioritize the P1 items below.

---

## 🎯 P1 — Conversion + core UX (next 2-4 weeks)

Ranked by revenue impact / development effort:

1. **Loom demo video (5 min)** — script exists in `CONTENT_PACK.md` §5. Grabar y hospedar. Reduces buyer eval time from 45min → 5min.
2. **Optimize My Day button** — Google Route Optimization API + heuristic fallback. Highly demoable. ~8h.
3. **Financial tracker in Budget** — booked/actual/remaining per category. Highly demoable. ~10h.
4. **Trip voting (LIKE/MAYBE/NO)** — for shared trips. Uses existing Supabase Realtime. ~6h.
5. **Web Vitals RUM instrumentation** — `WebVitalsReporter` exists but doesn't ship data anywhere. Wire to Vercel Analytics or Sentry Sessions. ~2h.
6. **Empty states + retry UX** — better fallback when AI fallback chain exhausts. ~4h.
7. **Booking.com Rapid API subscription** — currently mock-mode. Buyer wires paid subscription for real hotel data. Requires ~$50-200/mo. ~2h wire-up.
8. **Google Wallet pass integration** — cross-platform mobile parity. `docs/apple-wallet.md` has the pattern. ~4h.

---

## 🔵 P2 — Differentiation (Q4)

1. **TripLoop Live event detection** — flight API + weather API for automatic reshuffle on delay. ~12h.
2. **WhatsApp bot context-aware** — bot knows current user trip, can add stops via chat. ~10h.
3. **Advanced constraint engine** — opening hours via Google Places + weather via API. ~15h.
4. **Data flywheel** — aggregate anonymous accept/reject signals to improve curated matching. ~20h.
5. **Marketplace of templates** — creators publish, revenue share. Requires Stripe Connect. ~40h.
6. **Native iOS + Android apps** — React Native wrapper OR PWA install push. ~40-80h.

---

## 🟢 P3 — Nice-to-have (backlog)

- CHANGELOG in admin dashboard ✅ shipped
- Public roadmap ✅ (this file)
- ARIA / a11y polish audit round 3
- SEO structured data (JSON-LD) for regions
- Search semantic (pre-computed embeddings)
- Trip trailer video generation via Runway/Veo
- White-label API for OTAs
- Enterprise features (SSO, per-org admin, per-seat billing)

---

## ⏸️ Deferred / Not Doing

- **Native iOS + Android apps** built from scratch — cost/benefit not favorable for asset sale window. Buyer decides.
- **Full internationalization beyond 4 locales** — adding a 5th locale = ~40h. Marginal ROI unless clear market signal.
- **Voice interface** — Gemini audio ready but requires more UX than dev time. Deferred pending user research.
- **AR trip preview** — impressive demo but no clear monetization path. Deferred.

---

## Owner rotation

**Maintainer 2026-05 to 2026-08:** [Carlos Fernandez Vernova](https://github.com/carlosfevernova) — GDL, MX

**Post-acquisition maintainer:** TBD (see [FOR_SALE.md](./FOR_SALE.md) if you\'re the future owner).

---

## Contributing to this roadmap

- **File a discussion:** https://github.com/carlosfevernova/triploop/discussions
- **Open an issue:** tag with `roadmap` label
- **Email:** `hola@nano-almacen.mx` for private inquiries

---

*Last updated 2026-08-26 · Roadmap is aspirational — no commitments unless in the "In progress" section above.*
