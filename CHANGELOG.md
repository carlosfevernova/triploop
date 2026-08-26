# Changelog

Notable changes to TripLoop, organized by sprint. Version tags follow **S{sprint}{letter}** pattern.

**Repo stats:** 126 commits · 19 days shipping · **6.6 commits/day average velocity**  
**Live:** https://triploop-six.vercel.app · **Prospectus:** https://triploop-sale.vercel.app

---

## 2026-08-26 — Sale-Prep sprints

### Value-Up (docs + assets for asset sale)
- `docs(readme)` env vars section — reference `/api/health` for live config verification
- `docs(audit)` `.env.example` — complete 33 env vars vs previous 8 (buyer eval blocker)
- `feat(audit)` `/api/health` endpoint + AUDIT.md refresh S40→S71n
- `feat(sale)` product live post-unpause + OG image static fallback + docs cleanup
- `feat(sale)` submit-ready kit — 5 marketplaces × exact copy-paste fields
- `feat` sale-push kit — 5 outreach messages (Wanderlog/Mindtrip/Roadtrippers/MarcLou/Levelsio) + dynamic OG image
- `docs` reflect real state — prospectus is primary live artifact
- `chore` ignore local Cedar audit `receipts/`
- `docs` value-up pack for asset sale — README pro + FOR_SALE + LISTINGS + CONTENT_PACK + BUNDLE

### Infra shipped this batch
- `/api/health` endpoint with checks[6] of configured env vars (no value leak)
- Dynamic OG image via `next/og` ImageResponse (1200×630, per-locale)
- `.env.example` completo — 33 vars categorizadas en 8 grupos
- 5 in-repo docs (README pro + FOR_SALE + LISTINGS + CONTENT_PACK + BUNDLE)
- 11 marketing files (`marketing/outreach/` + `marketing/submit/`)

---

## 2026-08-10 — Sprint S70/S71 — 4-locale native i18n

The biggest architectural push of the project: expanded from 2 locales (EN·ES) to **4 native locales** (EN · ES · PT-BR · DE-DE) via 6 sequential migration passes. ~1,300 PT+DE strings hand-authored, not machine-translated.

### S71n — Trip flow (final pass)
- `feat(s71n)` 4-locale migration pass 6 — trip flow (7 components, ~180 PT+DE strings)

### S71m — Itinerary flow
- `feat(s71m)` 4-locale migration pass 5 — itinerary flow (TravelSegment + DayNavigator + time.ts)

### S71l — Static pages
- `feat(s71l)` 4-locale migration pass 4 — static pages (about, terms, privacy, changelog)

### S71k — Region pages + shared UI
- `feat(s71k)` 4-locale migration pass 3 — region pages + shared UI (8 components)

### S71j — Admin sync
- `docs(s71j)` admin sync — 3 reports reflect landing 100% multilingual native

### S71i — RegionsGrid
- `feat(s71i)` RegionsGrid full 4-locale — closes landing i18n migration

### S71h — Landing conversion components
- `feat(s71h)` 4-locale migration pass 2 — Comparison + FAQ + FeaturesShowcase native PT+DE

### S71g — Landing hero components
- `feat(s71g)` 4-locale migration pass 1 — 6 landing components + L() helper

### S71 — Polish + P0 fixes
- `polish(s71e)` LocaleSwitcher a11y — aria-label per language + role group
- `fix(s71d)` mobile drawer actually renders full-viewport — Portal + bg opaque
- `polish(s71c)` meta reflects 4 locales + `/favicon.ico` legacy rewrite
- `fix(s71b)` favicon actually works — metadata icons + middleware exclude
- `fix(s71)` P0 batch 2 — favicon + broken Unsplash IDs + sitemap timeout

### S70 — 4-locale expansion begin
- `feat(s70)` 4-locale expansion (en/es/pt/de) + mobile menu drawer fix

---

## 2026-08-09 — Sprint S65-S69 — Audits + performance

Audit-heavy sprints. 3-agent parallel audits (a11y + code + performance). Multiple P0 fixes shipped, image migration to `next/image`, cache-control fix for ISR, Itinerary Engine memoization.

- `fix(s69)` audit round 2 (a11y + code deep-dive) — 3 P0 CRITICAL fixes
- `docs(s68)` admin sync — S68 audit entry + falsos positivos audit S65
- `perf(s68)` audit continuo — blog imgs → next/image + falsos positivos documentados
- `perf(s67)` migrar imgs Unsplash raw → next/image (top offenders)
- `perf(s66)` Itinerary Engine memoization refactor — fix INP baseline
- `docs(s65)` admin sync — cache-control fix VERIFICADO en producción
- `fix(s65)` cache-control real fix — `setRequestLocale` en layout + 4 wrappers force-dynamic
- `fix(s65)` audit exhaustivo 3-agent parallel — 5 quick wins shipped

---

## 2026-08-08 — Sprint S54-S57 — Templates + Agenda + Optimize

- `chore(s57)` audit programático post-S56 — 100% functional, 0 broken links
- `fix(s56)` **CRITICAL** — seed 60 templates in production (18 regions were empty)
- `chore(s56)` seed-templates alt auth via admin cookie
- `feat(s55)` **Optimize route order** — nearest-neighbor TSP en trip classic view
- `feat(s54)` Agenda hora-por-hora + Add Day inline + Admin back-to-home

---

## 2026-08-07 — Sprint S40 baseline (per AUDIT.md)

Prior to sale-prep sprints, the following was already shipped (see AUDIT.md § 5-6):

- **AI orchestration** — 6-provider fallback chain + prompt cache LRU + streaming SSE
- **Curated moat** — 231 hand-verified POIs across 24 regions in 7 continents
- **Stripe integration** — Checkout + Portal + Webhook HMAC + idempotency table (migration 017)
- **Multi-tenant Supabase** — RLS on 12 tables + 25 migrations
- **Admin dashboard** — passphrase auth + AI cost tracker + blog CMS with 4-locale editor
- **PWA** — Serwist 9.5 SW + IndexedDB queue + tile pre-caching
- **WhatsApp bot** — Twilio Business + HMAC signature verify + conversation state
- **Email** — Resend + HMAC-signed unsubscribe tokens + trial-ending cron
- **Security** — service_role isolated + rate limiting LRU + CSP headers + zero hardcoded secrets
- **Playwright E2E** — 44/44 tests passing

---

## Format legend

- `feat(sN)` — new user-facing feature shipped in sprint N
- `fix(sN)` — bug fix
- `perf(sN)` — performance improvement
- `polish(sN)` — a11y, UX polish, small tweaks
- `docs(sN)` — documentation update
- `chore(sN)` — infra, deps, tooling
- `refactor(sN)` — code refactor without behavior change

Sprint letters (a, b, c, ...) indicate sub-passes within a sprint. Sequential and monotonic.

---

## Momentum signals for buyer

- **6.6 commits/day** average velocity across 19 shipping days
- Zero unshipped WIP branches
- Every commit deployed to production (test in prod)
- Public MIT repo — every merge visible + verifiable
- Sprint tags (`s54`, `s65`, `s71g`) make progress auditable

Ver AUDIT.md for the full technical audit, and FOR_SALE.md for pitch + valuation.
