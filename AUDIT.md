# TripLoop — Audit técnico + roadmap priorizado

**Última actualización:** 2026-08-26 · post S71n · asset-sale-ready  
**Producto:** https://triploop-six.vercel.app (HTTP 200 verified)  
**Prospectus:** https://triploop-sale.vercel.app (HTTP 200)  
**Repo:** https://github.com/carlosfevernova/triploop (public MIT, 123+ commits)  
**Métricas base (S71n + post-audit 2026-08-26):** **27,897 LOC** TypeScript · 266 archivos · **51 APIs** · **25 Supabase migrations** · **80+ page routes** · 24 regiones × index+detail · 60 templates · 231 POIs curados · 7 continentes · **4 locales nativos** (EN·ES·PT-BR·DE-DE) · 130+ sitemap URLs · Playwright E2E 44/44 · **1 TODO real en 266 archivos** (falso positivo — comentario español)

## 0-B. Tier A killer-demo sprint shipped 2026-08-26 (asking $50K)

Four demoable features shipped to justify $37K→$50K asking bump:

| Feature | Files | Endpoint |
|---|---|---|
| **AI Concierge chat widget** | `src/components/trip/AiConciergeWidget.tsx` + wire in `[locale]/trip/[slug]/page.tsx` | `POST /api/trips/[slug]/concierge` |
| **Trip export ICS + Wallet** | `src/lib/trip-export.ts` (RFC 5545 compliant) | `GET /api/trips/[slug]/export?format=ics\|wallet` |
| **Auto-template generation** | `scripts/generate-templates.ts` (Node standalone) | run: `npx tsx scripts/... --region ca --personas family,foodie` |
| **Structured logger + Sentry** | `src/lib/logger.ts` + `docs/observability.md` + `docs/apple-wallet.md` | opt-in via `SENTRY_DSN` env |

Tests: 32 → **62/62 passing** (+30 for trip-export + logger).

## 0. Estado post-audit 2026-08-26 (asset sale)

✅ **Live health verified** (curl 2026-08-26):
- `/en`, `/es`, `/pt`, `/de` — HTTP 200 (los 4 locales sirven)
- `/en/pricing/upgrade`, `/en/trip/new`, `/en/blog`, `/en/about`, `/en/agenda`, `/en/whatsapp`, `/en/california`, `/en/mexico` — HTTP 200
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` — HTTP 200
- `/en/opengraph-image` — HTTP 200 image/png 194KB 1200×630 (dynamic OG via next/og)
- **`/api/health`** — new endpoint added post-audit para uptime monitoring (buyer serio hará curl)
- `tsc --noEmit` passes (zero TypeScript errors)

✅ **Métricas creación (Δ desde S40):**
- LOC: 19,380 → **27,897** (+44%, ~470h total)
- APIs: 34 → **51** (+50%)
- Migrations: 16 → **25** (+56%)
- Locales: 2 (EN·ES) → **4 nativos** (EN·ES·PT-BR·DE-DE, ~1,300 strings hand-authored en S71g-n)

✅ **Sale-ready assets (in-repo):**
- README.md · FOR_SALE.md · LISTINGS.md · CONTENT_PACK.md · BUNDLE.md
- marketing/outreach/ — 5 personalizados (Wanderlog · Mindtrip · Roadtrippers · Marc Lou · Levelsio)
- marketing/submit/ — 5 marketplaces copy-paste (SideProjectors · Flippa · Reddit · HN · PH)
- src/app/[locale]/opengraph-image.tsx + twitter-image.tsx — dynamic OG per locale
- public/og-image.png — static fallback (194 KB, 1200×630)

---

## 1. Arquitectura actual (verificada 2026-08-26)

**Stack (post-S71n):**
- Next.js 15.1 App Router + Turbopack + React 19
- Vercel Fluid Compute (Node.js runtime — no Edge, evita compat issues)
- Supabase Postgres (RLS 12 tablas + 25 migrations aplicadas) + Auth (JWT cookies) + Realtime + Storage
- Stripe SDK v22 (Checkout + Portal + Webhooks HMAC + idempotency table migration 017)
- Multi-provider AI: OpenRouter (5 free models) → Cloudflare → Fireworks → Groq → Anthropic → Vertex (6-provider chain)
- MapLibre GL 6.2 + Carto Voyager + Google Places (New) + Routes v2 + OpenChargeMap
- Serwist 9.5 PWA + IndexedDB (via `idb`) + tile pre-caching + install prompt
- next-intl 3.26 (**4 locales nativos: EN, ES, PT-BR, DE-DE** — 100% hand-authored, ~1,300 PT+DE strings)
- Twilio WhatsApp + Resend email + Vercel Cron (trial-ending + weekly-digest)
- Dynamic OG image via `next/og` ImageResponse (Edge runtime)

**Data flow crítico:**
```
User prompt → /api/ai/generate-trip
  → 1. promptCache LRU 100 entries TTL 1h (10ms)
  → 2. matchTemplate() curated-first ≥45 score (50-200ms)
  → 3. getCuratedPOIs() inject al AI context
  → 4. OpenRouter (gemma-4-26b 1.6s) → fallback chain
  → 5. validateTrip() constraint check
  → 6. Supabase insert trips
  → 7. Response con source: cache|curated|ai + validation.issues
```

**Streaming alt:** `/api/ai/generate-trip/stream` SSE con events phase → region_hint → meta → stop (1×1) → complete

---

## 2. Security audit

| Área | Estado | Notas |
|---|---|---|
| Supabase RLS | ✅ 11 tablas | trips, subscriptions, blog_posts, pois, affiliate_clicks, template_views, email_log, email_unsubscribes, whatsapp_conversations, waitlist, processed_webhook_events |
| service_role usage | ✅ Server-only | createAdminClient exclusivo en Edge/Node routes |
| Admin auth | ⚠️ **Cside passphrase HMAC 24h** | User requirement mantener así (feedback histórico). Real user+role system sería P1 |
| Stripe webhook | ✅ constructEvent HMAC + **P0.1 idempotency table** shipped S40 |
| Rate limiting | ✅ In-memory LRU: waitlist 3/min, ai 8-10/min, places 30/min |
| CSP headers | ✅ Server-set en middleware |
| Secrets | ✅ Zero hardcoded, todas en Vercel env vars |
| Unsub tokens | ✅ HMAC signed |
| Row ID tampering | ✅ RLS bloquea SELECT/UPDATE de trips ajenos |

**P0 abiertos:**
- 🔴 Admin sigue con passphrase compartida (arquitectura decisión del user, no bug)

---

## 3. Performance audit

| Métrica | Estado | Target |
|---|---|---|
| Bundle inicial | 105 kB shared JS | ✅ |
| Trip page | 200 kB con dynamic imports (MapLibre lazy) | ✅ |
| Homepage TTI | ~400ms (Hero Server Component) | ✅ |
| AI curated hit | <200ms · 0 tokens | ✅ post-S28 |
| AI cache hit | ~10ms · 0 tokens | ✅ post-S29 |
| AI fresh | 15-30s | ⚠️ dependiente de OpenRouter free tier variabilidad |
| SSE first stop | 500ms curated · 2-5s AI | ✅ post-S30 |
| Static generation | ISR revalidate + dynamicParams | ✅ |
| Sitemap URLs | 130+ indexables | ✅ |

**Gap:** No hay LCP/INP/CLS medidos vía Real User Metrics. Se recomienda instrumentar Vercel Analytics o Web Vitals API.

---

## 4. UX gaps identificados

| Gap | Severidad | Estado |
|---|---|---|
| Back buttons dispersos | Medio | ✅ Fix S26+S33 (7 rutas) |
| Highway_notes invisible en DB | Medio | ✅ Fix S32 UI badge amber |
| Templates sin season/difficulty | Bajo | ✅ Fix S36 badges chips |
| Regiones con 1 template solo | Medio | ✅ Fix S39 (+14 = 60 total) |
| Dead-ends CTAs | N/A | ✅ Audit S38: 35/35 200 pass |
| Empty state trip page mobile | Bajo | ⚠️ No auditado 320-430px |
| Hero density (35+ features) | Info | ⚠️ Contradice principio "simple UI" master prompt F9 |

---

## 5. Product features shipped vs master prompt

| Fase master | Shipped | Gap |
|---|---|---|
| F5 AI orchestration | 6 providers + fallback | health()/estimatedCost() per provider |
| F6 Planning Engine | **P0.2 validateTrip() shipped S40** | Full constraints (opening hours, weather, reservations) |
| F7 Route optimization | Routes v2 | Route Optimization API para "Optimize My Day" |
| F8 TripLoop Live | Flight-Delay Reshuffle | Event detection automática (flight_delayed, traffic_delay) |
| F13 Collaboration | Realtime + presence | Trip voting LIKE/MAYBE/NO |
| F14 Budget Engine | Calculator + tiers | Financial tracker (booked/actual/remaining) |
| F15 WhatsApp | Bot + AI fallback | Context-aware con trip actual |
| F17 Analytics | template_views + affiliate_clicks | Funnel completo eventos |
| F18 Admin dashboard | Dashboard v2 + reports | AI cost per provider dashboard |
| F23 Curated moat | 231 POIs | Pipeline actualización + confidence scoring |
| F24 Data flywheel | ❌ | Aggregate learning (privacy-safe) |
| F27 Testing | Playwright E2E 44/44 | Unit + integration + security tests |

---

## 6. Roadmap priorizado P0/P1/P2/P3

### 🔴 P0 (security / data integrity / production bugs)
- ✅ **S40 P0.1:** Stripe webhook idempotency (processed_webhook_events)
- ✅ **S40 P0.2:** validateTrip() constraint engine básico
- ✅ **S40 P0.3:** platformStats single source of truth
- ⏳ Migration 017 aplicar en Supabase (SQL en repo, needs manual apply)
- ⏳ Structured logging + Sentry setup

### 🟡 P1 (conversion / core UX / reliability)
1. **Reemplazar hardcoded stats** en Hero/SocialProof/Comparison/FAQ con `platformStats` de `lib/platform-stats.ts`
2. **AI cost tracking** por provider (log input_tokens, output_tokens, latency, estimatedCost)
3. **Financial tracker** en Budget (booked/actual/remaining por category)
4. **Trip voting** grupal (LIKE/MAYBE/NO por stop)
5. **Mobile audit** 320/375/390/430px
6. **Web Vitals instrumentation** (LCP/INP/CLS RUM)
7. **Empty states + Error UX** con retry + fallback curated
8. **admin/(app)/costs** dashboard con AI spend + Maps spend + gross margin

### 🟢 P2 (differentiation)
1. **Optimize My Day** botón (Route Optimization API o heurística)
2. **TripLoop Live event detection** (flight API, weather API)
3. **WhatsApp context-aware** (bot conoce trip actual del user)
4. **Constraint engine avanzado** (opening_hours vía Google Places, weather via API)
5. **Data flywheel** aceptación stop (private/anonymous aggregate)
6. **Feature flags** infra para experiments

### 🔵 P3 (experiments)
1. Testing suite unit + integration
2. Dependency audit vulnerabilities
3. Search semantic (embeddings pre-computed)
4. Pre-computed responses top-30 prompts populares
5. Real user role system (multi-admin)

---

## 7. Definición de éxito por fase

Cada fase termina cuando:
- ✅ Build passes
- ✅ TypeScript strict passes
- ✅ Tests pass (donde existen)
- ✅ Mobile checked 320-430px
- ✅ Desktop checked
- ✅ Auth checked
- ✅ RLS checked
- ✅ Error states checked
- ✅ Loading states checked
- ✅ Performance no regression
- ✅ Deploy prod + smoke test
- ✅ AUDIT.md updated

---

## 8. Riesgos remanentes (que NO se deben ignorar)

1. **Admin passphrase** — Cside compartida = si se filtra, acceso total. Mitigación aceptada por user; podría añadirse 2FA en futuro.
2. **OpenRouter free tier variabilidad** — latencia y disponibilidad no garantizada; mitigado por fallback chain 5 providers, pero podría requerir paid tier para SLA.
3. **Fireworks $0 credits** — modelos serverless block sin crédito. Ya se documentó en `project-triploop-ai-providers.md`.
4. **Migration 017 pendiente** — table processed_webhook_events sin aplicar; soft-fail en código pero idempotency ineffective hasta migration applied.
5. **Sin unit tests** — refactors pueden romper features silenciosamente.
6. **Curated content freshness** — 231 POIs verificados agosto 2026; opening hours cambian, precios cambian. Pipeline update no implementado.

---

## 9. Next steps ejecutables

**Esta sesión (S40):**
- ✅ P0.1-P0.3 code shipped
- ✅ AUDIT.md (este documento)
- ⏳ Deploy final + smoke

**Próxima sesión:**
- Aplicar migration 017 en Supabase prod
- Reemplazar hardcoded stats con `platformStats`
- Web Vitals instrumentation

**Sesión +2:**
- Financial tracker Budget
- AI cost dashboard admin
- Trip voting

---

*Documento vivo. Actualizar al final de cada sesión con Δ del audit.*
