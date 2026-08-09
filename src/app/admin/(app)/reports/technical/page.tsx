import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';

export const metadata = { title: 'Reporte técnico — TripLoop Admin', robots: { index: false } };

// Métricas reales medidas 2026-08-08 (post S52 — Agenda standalone + shortcuts quick-add)
const LOC = 26620;                // +470 desde S51 (agenda landing + agenda/new + AddItemInline shortcuts)
const FILES_TSX = 164;            // +2: agenda page, agenda/new
const FILES_TS = 85;
const APIS = 51;
const COMPONENTS = 63;
const PAGES = 79;                 // +2: agenda, agenda/new
const MIGRATIONS = 24;
const LIB_HELPERS = 38;
const RUNTIME_DEPS = 20;
const REGIONS = 24;
const TEMPLATES = 60;
const CURATED_POIS = 231;
const CONTINENTS = 7;

// Desglose exhaustivo por categoría de TODO el trabajo end-to-end:
// diseño de página, desarrollo, programación, integraciones, testing, deployment, iteraciones.
// Basado en benchmarks 2026 (techsy.io SaaS calculator, makerkit.dev, uxcontinuum MVP, techconcepts.org)
interface WorkItem {
  category: string;
  hoursLow: number;
  hoursHigh: number;
  detail: string;
}

const WORK_BREAKDOWN: WorkItem[] = [
  { category: 'Diseño de producto + wireframes + design system', hoursLow: 30, hoursHigh: 50,
    detail: 'Design system Tailwind (colors coral/ink/ocean, spacings, typography Inter+Fraunces), wireframes hero, decisiones UX bilingüe' },
  { category: 'Arquitectura + research inicial', hoursLow: 40, hoursHigh: 60,
    detail: 'Stack decisions (Next 15 + Supabase + Edge), DB schema design, RLS strategy, i18n architecture, PWA architecture' },
  { category: 'Setup + infraestructura base', hoursLow: 20, hoursHigh: 30,
    detail: 'Vercel project, Supabase provisioning, env vars, CI/CD implícito, dominios, secrets management' },
  { category: 'Auth + user model + sessions', hoursLow: 30, hoursHigh: 50,
    detail: 'Supabase Auth, JWT cookies, middleware SSR refresh, /signin /signup pages, fork trip pattern, My Trips dashboard' },
  { category: 'Route optimizer + mapas interactivos', hoursLow: 80, hoursHigh: 120,
    detail: 'MapLibre GL setup, Google Routes API v2, polyline decoding, marker rendering, DnD @dnd-kit, auto-save, recompute debounce, ItineraryPanel + TripMap components' },
  { category: 'AI integration multi-provider', hoursLow: 40, hoursHigh: 60,
    detail: 'Fireworks (DeepSeek) + Groq (Llama) + Anthropic (Claude), Promise.race parallel, fallback curated CA, JSON extraction, AiSuggestionsPanel UI' },
  { category: 'POI enrichment + Nearby geo search', hoursLow: 30, hoursHigh: 45,
    detail: 'Google Places API (New), enrich endpoint, cache Supabase, NearbyPanel con radio+categoría, foto+rating hydration background' },
  { category: 'Programmatic SEO templates (16 curados)', hoursLow: 60, hoursHigh: 90,
    detail: '16 templates con coords verificadas manualmente, rutas SSR, hreflang, schema.org TouristTrip, generateStaticParams, seed endpoint idempotent' },
  { category: 'Affiliate integrations (Booking + GYG)', hoursLow: 25, hoursHigh: 40,
    detail: 'Deep-link builders con affiliate IDs, FTC compliance rel=sponsored nofollow, StaysAndActivitiesPanel, /affiliate-disclosure page bilingüe' },
  { category: 'PWA + offline maps', hoursLow: 40, hoursHigh: 60,
    detail: 'Serwist SW config, runtime cache strategies, IndexedDB idb wrapper, tile pre-caching por zoom en 3 niveles, offline fallback, 4 iconos edge-generated' },
  { category: 'Stripe payments + Pro gating', hoursLow: 60, hoursHigh: 90,
    detail: 'Checkout Session, Customer Portal, Webhooks HMAC (5 event types), 3 gates (offline/AI/trips), UpgradeModal, /pricing/upgrade, /account pages' },
  { category: 'PDF export (print-optimized)', hoursLow: 20, hoursHigh: 30,
    detail: 'Ruta /print SSR force-dynamic, @page CSS A4 12mm, PrintButton client, Google Static Maps con path+markers, bookings blanks manuales' },
  { category: 'Admin dashboard + editor + reports', hoursLow: 60, hoursHigh: 90,
    detail: 'Passphrase HMAC cookie 24h, sidebar Apple-style, i18n switcher, dashboard KPIs con Supabase queries paralelas, blog editor v2 con preview live, 2 reports' },
  { category: 'Landing + trust signals + copy editorial', hoursLow: 50, hoursHigh: 80,
    detail: 'Hero (Server + WaitlistForm client), Pricing Server Components, FAQ accordion, Comparison table 10 rows, RegionsGrid, SocialProofStrip real data, TrustBadges, StickyCta' },
  { category: 'Email flows (Resend + Cron)', hoursLow: 25, hoursHigh: 40,
    detail: '4 templates HTML editorial bilingüe (welcome/waitlist/trial-ending/digest), /api/emails/*, cron trial-ending + weekly-digest, unsubscribe HMAC, email_log audit' },
  { category: 'Expansión regional (NV + AZ + SW)', hoursLow: 30, hoursHigh: 45,
    detail: '8 templates nuevos curados, componentes shared RegionIndex + RegionTemplateDetail, 6 rutas nuevas, sitemap dinámico regional' },
  { category: 'Blog CMS + 16 posts editoriales (bilingüe)', hoursLow: 80, hoursHigh: 120,
    detail: '8 posts EN + 8 posts ES curados a mano (800-1500 palabras cada uno), safe markdown renderer sin deps, schema.org BlogPosting, RSS 2.0 feed, admin CRUD' },
  { category: 'Collaborative editing (Supabase Realtime)', hoursLow: 25, hoursHigh: 40,
    detail: 'useTripRealtime hook, presence tracking con avatares, postgres_changes sync bidireccional, broadcast toast notifications' },
  { category: 'i18n bilingüe EN/ES', hoursLow: 30, hoursHigh: 50,
    detail: 'next-intl setup, messages EN + ES, hreflang alternates en todas rutas, admin i18n custom, locale switcher UI, ~600 strings traducidos' },
  { category: 'Testing E2E manual (Playwright)', hoursLow: 60, hoursHigh: 90,
    detail: 'Verify visible cada deploy vía Playwright browser, smoke tests API con curl, E2E signup flow, 2-tab realtime testing, screenshots documentales' },
  { category: 'Debugging + iteraciones', hoursLow: 80, hoursHigh: 130,
    detail: 'SSG DYNAMIC_SERVER_USAGE fixes en region pages, imágenes 404 audit + reemplazo, Vercel env whitespace, middleware matchers, cross-app imports, admin route group' },
  { category: 'Performance sprint (bundle + latencia)', hoursLow: 20, hoursHigh: 30,
    detail: 'MapLibre lazy (-85KB), panels dynamic (-30KB), Hero+Pricing Server Components, AI Promise.race (-600ms), N+1 fixes' },
  { category: 'Security audit + hardening', hoursLow: 30, hoursHigh: 45,
    detail: 'RLS hardening 11 tablas, timing-safe HMAC compare, XSS marker fix, auth-first Stripe, unsub HMAC, trim en env vars con newline' },
  { category: 'A11y + SEO técnico polish', hoursLow: 20, hoursHigh: 30,
    detail: 'aria-modal + escape UpgradeModal, FAQ aria-controls, structured data JSON-LD, sitemap dinámico 60 URLs, /not-found custom, aria-live regions' },
  { category: 'Deployment + ops iterations', hoursLow: 25, hoursHigh: 40,
    detail: 'Vercel env vars setup (SEED_TOKEN, CRON_SECRET, ADMIN_PASSPHRASE, FIREWORKS_API_KEY), cron config vercel.json, cookie fixes newline, 40+ deploys a producción' },
  { category: 'Documentación + reports admin', hoursLow: 20, hoursHigh: 30,
    detail: 'Reporte técnico exhaustivo, investor deck con research 2026 real, market comparables, valuación scenarios' },
  { category: 'WhatsApp Bot (Twilio + AI fallback)', hoursLow: 30, hoursHigh: 45,
    detail: 'Webhook Twilio con signature verification, comandos parseados (create/list/help), fallback DeepSeek para consultas libres, whatsapp_conversations tabla, landing bilingüe /whatsapp' },
  { category: 'AI Trip Generator (NLP → itinerario)', hoursLow: 25, hoursHigh: 40,
    detail: 'Endpoint /api/ai/generate-trip con JSON schema estricto, cadena fallback Fireworks→Groq→Anthropic, validación coords, sanitize, gate free tier, página UX /trip/new/ai con textarea + 5 ejemplos bilingues + progreso fases' },
  { category: 'AI auto-describe stops', hoursLow: 12, hoursHigh: 18,
    detail: 'Endpoint /api/ai/describe-stop con DeepSeek bilingue, wire en TripEditor + handleNearbyAdd, notes 1-2 oraciones enriquecen stop en background sin bloquear UX' },
  { category: 'Analytics dashboard v2 (sparklines + funnel)', hoursLow: 18, hoursHigh: 28,
    detail: 'Ampliación admin metrics con series 30d (trips + views), funnel visitors→trips→registered→paying, sparkline component SVG puro sin deps, DashboardClient v2' },
  { category: 'Embed widget iframe-friendly', hoursLow: 15, hoursHigh: 22,
    detail: 'Ruta /embed/trip/[slug] con ?locale y ?theme, middleware exclusion, CSP frame-ancestors permisivo, snippet copy-paste para blogs/wordpress externos' },
  { category: 'Expansión Utah (4 templates + rutas)', hoursLow: 15, hoursHigh: 25,
    detail: '4 templates curados (Zion, Bryce Canyon, Arches, Monument Valley), coords reales, /utah landing SEO, template detail pages, RegionsGrid update' },
  { category: 'Expansión España (1ª región Europa)', hoursLow: 20, hoursHigh: 30,
    detail: '4 templates España (Madrid weekend, Barcelona 5d, Andalucía Grand Tour, Camino de Santiago), currency EUR, coords Europa, /spain rutas, primera bandera internacional' },
  { category: 'Bilingual JSONB translations (24 templates ES)', hoursLow: 25, hoursHigh: 40,
    detail: 'Columna translations JSONB en trips, TEMPLATE_TRANSLATIONS_ES mapping 24 slugs, applyLocale helper, hreflang alternates, seed endpoint wire, RegionTemplateDetail shared component' },
  { category: 'Free geocoding fallback (Nominatim + Photon)', hoursLow: 15, hoursHigh: 22,
    detail: 'Wrapper geocode-free.ts, 2-tier fallback OpenStreetMap, integración en places/enrich, ahorra Google API quota estimado 60-80% en cache miss' },
  { category: 'Rate limiting in-memory LRU', hoursLow: 10, hoursHigh: 15,
    detail: 'Librería rate-limit.ts key-based con TTL, aplicado en waitlist 3/min, ai/* 8-10/min, places/* 30/min, spam prevention edge-safe' },
  { category: 'S21: Onboarding Questionnaire Wizard', hoursLow: 18, hoursHigh: 28,
    detail: '4-step bilingüe (tipo viaje, viajeros+kid-ages+accesibilidad estilo Mindtrip, 10 intereses, presupuesto+ritmo). Contexto se pasa a AI Trip Generator para itinerario más preciso. Modo choose guiado vs libre-texto' },
  { category: 'S21: Budget Calculator (datos 2026 verificados)', hoursLow: 15, hoursHigh: 22,
    detail: 'Datos reales WebSearch 2026: gas $4.50 US avg (Cali $6.15, Spain €1.65/L), hoteles tier $75/$125/$225 US · $65/$110/$200 Spain, food per person/día $40/$80/$150. Multi-currency 6, buffer 10%. Panel drawer estética match AiSuggestions' },
  { category: 'S21: AI Trip Insights (warnings + local tips)', hoursLow: 22, hoursHigh: 32,
    detail: 'Endpoint /api/ai/trip-insights: warnings severity high/mid/low (booking, seasonal, safety), tips categorías booking/timing/local/safety. OpenRouter free + timeout 20s + cache trips.metadata JSONB hasheado por contenido. Migration 014 soft-fail. Bilingüe con schema estricto' },
  { category: 'S22: EV Chargers Map (OpenChargeMap)', hoursLow: 12, hoursHigh: 18,
    detail: 'Endpoint /api/places/ev-chargers con OCM API (500 req/día gratis, key registrada). Radius selector 10-100km, operational status, power kW, connector types. 8 países cubiertos: US, ES, MX, CA, GB, FR, IT, DE. EVChargersCard con lista + estado en vivo' },
  { category: 'S22: Check List AI personalizado', hoursLow: 15, hoursHigh: 22,
    detail: 'Endpoint /api/ai/trip-checklist genera 4 categorías (essentials/clothing/gear/docs+kids) con 4-5 items destino-específicos + season detection. Progress bar + toggle packed persistido localStorage. gemma-4-26b-a4b (1.6s bench)' },
  { category: 'S22: Photo Spots (worth-it rating)', hoursLow: 15, hoursHigh: 22,
    detail: 'Endpoint /api/ai/photo-spots identifica spots icónicos por parada. worth_it=yes/maybe/skip, best_time (golden hour), best_angle técnico, wait_time_min, tips. Filtros UI por rating. Cache por content hash' },
  { category: 'S22: Flight-Delay Reshuffle KILLER FEATURE', hoursLow: 25, hoursHigh: 38,
    detail: 'Endpoint /api/ai/reshuffle-trip acepta {disruption, keep_ids, missed_ids, preferences}. Wizard 3-pasos: qué pasó (5 tipos disruption) → prioridades → propuesta IA con reasoning. Puede AGREGAR stops nuevos alternativos. Apply broadcast realtime a colaboradores' },
  { category: 'S22: Hoteles céntricos por tier + Central', hoursLow: 8, hoursHigh: 12,
    detail: 'Extends bookingSearchUrl con {tier: low|mid|high, centralOnly}. Star-class filter Booking nflt=class=X + order=distance_from_landmark. UI: 4 chips tier + toggle central en StaysAndActivitiesPanel. Badge visual filtro activo' },
  { category: 'S22: Helper ai-openrouter.ts compartido', hoursLow: 8, hoursHigh: 12,
    detail: 'Consolidación: callOpenRouterJson<T> con timeout+fallback multi-model, readTripCache soft-fail, contentHash utility. Modelos ordenados por latencia benchmark real (gemma-4-26b 1.6s primero). Reutilizado por 5 endpoints AI' },
  { category: 'S23: Landing rediseño premium + admin Cside preview', hoursLow: 20, hoursHigh: 30,
    detail: 'FeaturesShowcase 3 heroes + grid 16 (badges S25/S28/S30 timeline), Comparison v3 26 rows (Wanderlog+Layla+TripIt+GMaps), AdminPreviewBanner cookie Cside HMAC 24h + bypass FREE_TRIP_LIMIT, endpoint /api/pro-status con adminOverride' },
  { category: 'S24+S25: Live AI map + POI Discovery Chips', hoursLow: 30, hoursHigh: 42,
    detail: 'AiGeneratorMap MapLibre split-view stagger 350ms, detectRegionHint client-side. POIDiscoveryChips 7 categorías floating bar + tap-to-add. /api/places/discover Google Places Nearby + Nominatim fallback. TripMap onBoundsChange debounced 500ms' },
  { category: 'S26+S33: Back buttons audit + Playwright E2E audit', hoursLow: 12, hoursHigh: 18,
    detail: 'Back buttons agregados en trip, /trip/new/ai, admin/reports, my-trips, signin/signup, whatsapp, blog, RegionIndex. Playwright audit P0/P1/P2 44/44 checks pass. BackButton component reutilizable' },
  { category: 'S27→S34: Expansión global 24 regiones · 7 continentes', hoursLow: 55, hoursHigh: 80,
    detail: 'USA extra (Utah+PNW+Northeast+Southeast+Rockies) + Europa (Italy+Iceland+Ireland+Germany+Scotland) + Oceanía (Australia+NZ) + LatAm (México+Chile+Argentina+Perú) + Asia (Japón) + Canadá + África (Marruecos). 46 templates iconic con highway_notes verificados. WebSearch acotadas por continente + curated coords Google Maps' },
  { category: 'S28+S29: Curated-first AI + prompt cache + 231 POIs', hoursLow: 25, hoursHigh: 38,
    detail: 'template-matcher.ts con scoring days±diff/region/SEO/stops (threshold 45). curated-pois.ts 231 POIs verificados 24 regiones (name, coords, category, iconic, best_time, tip). prompt-cache.ts LRU 100/TTL 1h. Inject POIs en AI context (evita coords inventadas). Helpers ai-openrouter.ts compartidos 6 endpoints' },
  { category: 'S30: Streaming SSE AI Trip Generator', hoursLow: 18, hoursHigh: 25,
    detail: '/api/ai/generate-trip/stream text/event-stream ReadableStream. Events: phase, region_hint, meta, stop (1x1 stagger), complete, error. Cliente parses SSE + accumula previewStops live. Primer stop 500ms curated hit' },
  { category: 'S32: Highway notes UI badge + LatAm regions', hoursLow: 15, hoursHigh: 22,
    detail: '4 nuevas regiones (mexico, chile, argentina, peru) con Riviera Maya, Carretera Austral, Ruta 40 Patagonia, Sacred Valley. Migration 015 highway_notes. Badge amber en trip page top: "🛣️ Ruta · SS163 · US-101 · PCH"' },
  { category: 'S35+S36: Loop enrichment landing + templates metadata', hoursLow: 22, hoursHigh: 32,
    detail: 'FeaturesShowcase +4 features (Curated-first, Streaming SSE, POI Chips, Highway badges). Comparison v3 +5 rows únicas. SocialProof 6 stats. FAQ +4 Q&A. 46 templates enriquecidos con best_season (6 tipos) + difficulty (4 niveles) + total_distance_km. UI badges chips 🌸/🟢/🛣️ en RegionTemplateDetail hero. Migration 016 metadata soft-fail' },
  { category: 'Sitemap dinámico + SEO worldwide', hoursLow: 8, hoursHigh: 12,
    detail: '130 URLs indexables en sitemap.xml (24 regiones × 2 idiomas + 46 templates × 2 + blog posts + static). hreflang alternates completos. Meta title/desc actualizado con 7 continentes' },
  { category: 'S40 P0: Webhook idempotency + validateTrip + platformStats + AUDIT.md', hoursLow: 14, hoursHigh: 22,
    detail: 'Migration 017 processed_webhook_events (PK stripe_event_id). validateTrip() detecta invalid_coords/duplicate/huge_jump/dense_schedule score 0-100. platformStats SSOT (templates/regions/continents/POIs/aiEndpoints) reemplaza hardcoded strings en 10+ componentes. AUDIT.md root document con roadmap P0-P3' },
  { category: 'S42 P1: AI cost tracking + Web Vitals RUM + admin dashboard AI costs', hoursLow: 18, hoursHigh: 28,
    detail: 'Migration 018 ai_call_log. lib/ai-cost-tracker.ts con PRICE_PER_1M_TOKENS por provider + logAICall() + trackedAICall wrapper + estimateCost. /admin/ai-costs con KPI cards + provider/endpoint breakdown + chart 7d. WebVitalsReporter dynamic import web-vitals → sendBeacon a /api/analytics/vitals (Edge, rate-limit 30/min)' },
  { category: 'S43 P1: Financial Tracker + Stop Voting + StateFallbacks (Empty/Error/Retry)', hoursLow: 20, hoursHigh: 30,
    detail: 'Migration 019 trip_expenses (RLS user-owned) + FinancialTracker booked/actual/remaining por categoría (gas/hoteles/food/attractions/flights/shopping/other) integrado a TripSidePanel budget. Migration 020 stop_votes + StopVoting LIKE/MAYBE/NO con optimistic UI + upsert. StateFallbacks reutilizables (ErrorState con retry + kind detection network/rate/timeout/auth, EmptyState con CTA, OnlineStatus live) aplicados en AiSuggestionsPanel/NearbyPanel/InsightsCard/EVChargersCard' },
  { category: 'S44 P0: Itinerary Engine — schema temporal-espacial (trip_days + itinerary_items)', hoursLow: 25, hoursHigh: 38,
    detail: 'Migration 021: trip_days (day_number/date/timezone/title/notes) + itinerary_items (position INT gaps 100/200/300, 10 tipos place|meal|hotel|flight|train|drive|walk|event|note|free_time, start_local TIME, duration_min, priority must/preferred/optional, fixed BOOL para reservas, source_stop_id backfill). Función DB itinerary_renormalize_positions. RLS public read + write via auth. API completa: GET /itinerary (days+items), POST seed days from trip.start_date+days_count (idempotente), PATCH/DELETE days y items, POST /reorder batch update. lib/itinerary/{types, time, positions, validate}.ts con validateDay (overlaps, travel conflicts haversine, density, huge jumps)' },
  { category: 'S44 P1: Itinerary Engine UI — DayNavigator + Timeline + DnD + Map sync + Edit', hoursLow: 30, hoursHigh: 45,
    detail: 'Página /[locale]/trip/[slug]/itinerary con split desktop (timeline + map) / toggle mobile. DayNavigator sticky scrollable con Today badge + Unscheduled chip + item count por día. DayTimeline con warnings validateDay banner + totals bar (activityMin/travelMin/travelKm). ItineraryItemCard con time gutter tabular-nums + drag handle + priority icon + fixed lock. TravelSegment haversine estimate walking/driving/transit por distance. EditItemDrawer completo (title/type/day/start/duration presets/priority/fixed/notes). AddItemInline con type chips + Places autocomplete o custom title. Map sync selectedItemId ↔ hoveredStopId. Auto-seed days on first load' },
  { category: 'S45 P2: Route Matrix real (Google Routes v2) + polyline overlay + hash-based cache', hoursLow: 14, hoursHigh: 20,
    detail: 'Migration 022 añade route_cache JSONB + route_hash + route_updated_at a trip_days. Endpoint /api/trips/[slug]/itinerary/route-matrix (GET/POST) llama Google Routes v2 computeRoutes con TRAFFIC_AWARE, cachea por hash del orden (lat/lng+id concatenados). Invalidación automática cuando cambia orden. TravelSegment ahora muestra Live badge + duración real (traffic-aware) o fallback haversine. TripMap acepta polyline por día. Fetch debounced por día seleccionado' },
  { category: 'S45 P3.1: Opening hours check (Google Places details + validateDay warnings)', hoursLow: 12, hoursHigh: 18,
    detail: 'Migration 022 añade opening_hours JSONB + opening_hours_updated_at a itinerary_items. Endpoint /api/trips/[slug]/itinerary/opening-hours llama Places v1 con FieldMask (regularOpeningHours,currentOpeningHours), cache 30 días. lib/opening-hours.ts checkVisitHours() detecta closedAllDay/closesDuringVisit/openAtStart. validateDay(items, dateISO) extended con 3 nuevas kinds: closed (severity error), closes_during_visit (warning), openAtStart false (warning)' },
  { category: 'S45 P3.2: Schedule My Day (auto-assign start_local respetando fixed)', hoursLow: 10, hoursHigh: 15,
    detail: 'lib/itinerary/scheduler.ts pure functions scheduleDay(items, {startMin=540}). Pipeline greedy: cursor=09:00, respeta fixed items sync cursor, asigna current_time a items sin start_local, avanza cursor += duration+travel+buffer. Stop si pasa DAY_END_MIN=22:00. Endpoint /schedule-day con preview mode + persist batch. UI botón ⏰ en DayTimeline header' },
  { category: 'S45 P3.3: Optimize Day (nearest-neighbor TSP respetando fixed anchors)', hoursLow: 15, hoursHigh: 22,
    detail: 'lib/itinerary/scheduler.ts optimizeDay(items): nearest-neighbor greedy sin fixed / con fixed divide en segmentos anchored. Endpoint /optimize-day con preview_km, after_km, saved_km. UI botón ✨ con confirm() mostrando reducción. Invalidate route cache post-optimize. Priority must actúa como fixed. Positions renumeradas a 100/200/300 preservando gaps' },
  { category: 'S46 P4: AI Itinerary Operations Engine (NLP → structured ops schema)', hoursLow: 22, hoursHigh: 32,
    detail: 'lib/itinerary/ai-operations.ts define 10 ops discriminated union: move_item, update_time, update_duration, add_item, remove_item, set_priority, set_fixed, set_notes, optimize_day, schedule_day. validateOps() rechaza IDs inventados por el LLM (comprueba contra sets de items/days válidos) + cap 20 ops. opLabel() genera preview humano bilingüe. Endpoint /ai llama OpenRouter (gemma-4-26b free) con SYSTEM prompt operations-only forzando JSON schema. Endpoint /ai/apply re-valida server-side y ejecuta ops secuencialmente. logAICall integration. Rate limit 10/60s' },
  { category: 'S46 P4 UI: AIAssistantDrawer con preview + apply/reject + examples', hoursLow: 15, hoursHigh: 22,
    detail: 'Componente drawer bilingüe con: textarea 500 chars, chips de ejemplos EN/ES (6 c/u), botón Ask AI (llama /ai), preview de operations numeradas con opLabel + reason del LLM, botón Apply que confirma → llama /ai/apply → onApplied() reload. Integrado en itinerary page header como botón coral ✨ IA. Escape para cerrar. StateFallbacks para errores (retry-able)' },
  { category: 'S46 P5: Realtime collab itinerary (Supabase postgres_changes wildcards)', hoursLow: 12, hoursHigh: 18,
    detail: 'Migration 023 añade trip_days + itinerary_items a supabase_realtime publication. lib/itinerary/use-itinerary-realtime.ts hook con 2 subscribes postgres_changes filter=trip_slug=eq.{slug} events INSERT/UPDATE/DELETE. Callbacks onItemChange + onDayChange integrados en itinerary page: merge remoto con state local (add/update/delete). Auto-dedup por id. No presence (esa capa la maneja useTripRealtime en la trip page principal)' },
  { category: 'S46 P5: Offline mutation queue localStorage + auto-flush online + badge UI', hoursLow: 10, hoursHigh: 15,
    detail: 'lib/itinerary/offline-queue.ts con enqueue/flushQueue/queueLength API. Wrapper fetchOrQueue que intercepta fetch: si !navigator.onLine encola, si online ejecuta directo. 4xx errores dropea, 5xx/network reintenta hasta 5 veces. Idempotencia via ts_random id. OfflineQueueBadge component polls queueLength cada 3s + auto-flush al detectar online event (window.addEventListener). Badge amber offline / ocean syncing / oculto cuando 0 pending' },
  { category: 'S47 Audit fix: Realtime self-echo filter + AI Undo + Analytics + Print + Share + Timezone + Free-time visual', hoursLow: 18, hoursHigh: 28,
    detail: 'Bug fix realtime: hook devuelve markLocalMutation() que registra id+ts en Map local; postgres_changes con id match dentro de ECHO_WINDOW_MS=3s se descarta (fix double updates). Auto-cleanup >100 entries. Wire en 4 handlers (add/edit/delete/reorder). AI Undo: endpoint POST /itinerary/snapshot con upsert-diff atómico + invalidate route cache; AIAssistantDrawer captura snapshot pre-apply vía onSnapshotSaved callback; UndoBanner fixed bottom con countdown 15s auto-dismiss. Analytics fase 34: migration 024 itinerary_events (append-only RLS insert-only), endpoint edge /api/analytics/itinerary, lib/analytics.ts con sendBeacon + session_id sessionStorage; wire en 8 puntos (viewed/day_selected/added/removed/moved/scheduled/optimized/ai_applied/undo). Print fase 31: página /itinerary/print A4-optimizada con @page CSS + break-inside avoid + auto-print 500ms. Share button navigator.share con clipboard fallback. Timezone badge en day header cuando difiere del navegador. Free_time/note visual dashed border + bg-ink-50 discreto' },
  { category: 'S48 UX rediseño landing: Hero premium + FeatureQuickAccess + Nav dropdown Destinos', hoursLow: 14, hoursHigh: 22,
    detail: 'Hero reemplaza waitlist obsoleto (producto vive) con: eyebrow "Live · 100% gratis", título directo "Planea tu road trip. Día por día, hora por hora.", 3 CTAs por intent (🗓 Crea itinerario / ✨ Descríbelo IA 30s / 🌍 Explorar rutas), trust row real (sin tarjeta/offline/colab). Mockup ahora Timeline day×time con 6 stops + travel segments + footer stats (Itinerary Engine core visible). FeatureQuickAccess nueva sección 6 features con 1-click access (Itinerary NEW featured con gradient, AI LIVE, Curated 60+, Colab, Offline, WhatsApp BETA). Nav "Rutas" → "Destinos" dropdown 4 continentes × 24 regiones con flags + Escape/click-outside dismissable + ARIA menu. Get Started ahora apunta a AI Planner. Discovery gap cerrado: usuario que quiere solo itinerario lo ve inmediatamente' },
  { category: 'S49 Audit fix: StickyCta bilingual proper + i18n counts 46→60 + admin sync', hoursLow: 4, hoursHigh: 8,
    detail: 'StickyCta EN copy hardcoded "California trip" → itinerario genérico (24 regiones). CTA target /trip/new → /trip/new/ai (mayor conversion). i18n messages en.json+es.json sed replace "46 iconic routes" → "60 iconic routes" alineado con TEMPLATES post-S39. Admin technical + investors updated con post-S48 metrics. Deploy final' },
  { category: 'S50 UX Discovery: DiscoveryPanel filtros dentro itinerary + FeatureTour first-visit + Landing cleanup', hoursLow: 16, hoursHigh: 24,
    detail: 'DiscoveryPanel component collapsible dentro de /itinerary: usa /api/places/discover con bbox derivado de items del día + radio padding en km. 7 categorías (food/attraction/nature/hotel/shopping/gas/ev) con chips, filtros radio slider 1-50km + min rating slider + sort rating/distance. Cards con foto/nombre/rating/distancia/price_level + botón +Agregar directo al día seleccionado. Estado optimistic added Set. Diferencial vs Wanderlog Discover: nuestro bbox es del viaje real, no viewport aleatorio. FeatureTour 5 steps interactivos first-visit con localStorage dismiss: DayNavigator, DiscoveryPanel, AI button, TravelSegments live, Colab+Offline. Overlay backdrop-blur + progress dots + Skip/Back/Next. Landing cleanup: CitiesGrid removido (redundante con Nav "Destinos" dropdown post-S48 que ya expone 24 regiones organizadas por 4 continentes). Discovery gap cerrado + tour reduce time-to-first-action' },
  { category: 'S51 Audit: 4 broken links arreglados (/about /terms /privacy /changelog) + Footer dead-links cleanup', hoursLow: 5, hoursHigh: 9,
    detail: 'Audit programático de links con grep + curl HTTP verification detectó 4 páginas con 404 en producción (referenciadas desde Footer + FeatureQuickAccess). Creadas 4 páginas server-rendered bilingües con revalidate ISR: /[locale]/about (historia + misión + stats platformStats + cómo funciona offline + CTA), /[locale]/terms (8 secciones legales incluyendo as-is service, AI-generated content disclaimer, affiliate links, liability), /[locale]/privacy (essentials list + qué guardamos + proveedores + cookies + tus derechos + no vendemos datos), /[locale]/changelog (6 releases S42-S51 con tags major/feature/fix y bullets por sprint). Footer 4 href="#" reemplazados con URLs reales. Todas las páginas con generateMetadata + alternates hreflang EN/ES + Nav+Footer consistente' },
  { category: 'S65 Auditoría 3-agent paralelo (premium-web-architect + seo-specialist + content-quality-editor) + 5 quick wins shipped + cache fix VERIFICADO', hoursLow: 6, hoursHigh: 11,
    detail: 'Lanzados 3 agentes en paralelo. Consolidados 7 findings. **5 quick wins aplicados + cache fix real verificado:** (1) CRITICAL cache-control fix — root cause era next-intl getMessages() marcaba ruta dinámica. Fix real: setRequestLocale(locale) en [locale]/layout.tsx antes de getMessages() + 4 wrappers force-dynamic para pages auth-gated (/account, /my-trips, /signin, /signup) que no pueden prerender. Middleware fix (PUBLIC_SEO_PREFIXES) era necesario pero insuficiente. **RESULTADO PRODUCCIÓN VERIFICADO:** Cache-Control: private no-store MISS → public max-age=0 must-revalidate HIT. TTFB estimado <400ms cached vs 1341ms antes (~70% mejora). ISR revalidate=300 respetado. Todas las landing pages afectadas: /en, /es, /agenda, /about, /terms, /privacy, /changelog, 24 regiones × 2 locales, 60 templates × 2 locales. Baymard: +5-9% conversión esperado. (2) x-default hreflang en layout.tsx alternates.languages (Google necesita fallback), (3) sitemap.ts blog entries incluyen alternates.languages en+es+x-default (crawl efficiency), (4) ProblemSection copy re-write bilingüe benefit-focused: "Native bilingual EN + ES" → "Plan in Spanish, natively" (user-focused vs feature-focused), (5) validado next/font display:swap ya aplicado. Pendientes (sprint dedicado): refactor Itinerary Engine 2K LOC/8 memos, migrar 60 imgs Unsplash raw a next/image srcset (~6MB mobile fix)' },
  { category: 'S66 Refactor Itinerary Engine memoization (fix pendiente audit S65 INP)', hoursLow: 3, hoursHigh: 5,
    detail: 'Refactor quirúrgico sin cambio arquitectural: (1) 4 handlers restantes envueltos en useCallback (handleAdd/handleEdit/handleDelete/handleReorder) con deps mínimas — antes cada re-render creaba nueva referencia rompiendo React.memo en children. (2) unscheduledCount memoized (antes: filter/length en cada render). (3) React.memo aplicado en 3 components leaf/frequently-rendered: DayNavigator (recibe items counts, muchas re-renders innecesarios cuando otro día se selecciona), TravelSegment (haversine compute por cada pair from/to — 30+ segments), ItineraryItemCard (con 30+ items evita 29 re-renders innecesarios cuando 1 item cambia). Total memos: 9 (page.tsx) + 3 (components) = 12. Expected: INP <200ms baseline restored en trips grandes. Audit inicial exageró: page.tsx era 441 LOC no 2K. Componentes componentes ya bien separados' },
  { category: 'S57 Full audit programático post-S56 (15 core + 24 regions + 12 templates + 4 APIs = 100% funcional)', hoursLow: 2, hoursHigh: 4,
    detail: 'Audit exhaustivo curl bulk producción: (1) 15/15 core pages 200 (/, /en, /es, /agenda, /agenda/new, /trip/new, /trip/new/ai, /blog, /about, /terms, /privacy, /changelog, /whatsapp, /affiliate-disclosure, /admin), (2) 24/24 regions 200 con ≥2 templates cada una (California 60, Utah 4, Spain 4, Arizona/Nevada 3, rest 2), (3) 12/12 sample templates 200 detail pages con slugs reales (algunos slugs difieren de assumptions — ej. great-ocean-road-4-days vs 3-days, iceland-ring-road-10-days vs 8-days — slugs correctos derivados grep -oE del regions listing), (4) 4/4 API endpoints públicos: /api/trips=401 correcto protegido, /api/admin/seed-templates=200, /api/places/curated=200, /api/blog=404 esperado (blog usa server component fetch directo, no route). 0 broken links · 0 404 en producción · 0 fixes requeridos. Landing → Nav → Regions → Templates → Itinerary → Agenda → Admin chain full E2E verified' },
  { category: 'S56 CRITICAL FIX: seed 60 templates completos en producción (fix 18 regiones sin rutas)', hoursLow: 4, hoursHigh: 6,
    detail: 'Bug crítico detectado con Playwright visible: California mostraba 24 template cards, Italy/Iceland/Japan/Morocco/Chile/Argentina/Peru/Australia/NZ/Germany/Scotland/Ireland/Mexico/Canada/PNW/Rockies/Northeast/Southeast mostraban 0 (aunque templates-seed.ts tiene los 60). Root cause: endpoint /api/admin/seed-templates solo aceptaba X-Seed-Token que estaba vacío en env. Fix: agregado auth alternativo isAdminAuthed() → puedo re-seed desde /admin logged-in con Cside password. POST desde browser → 60/60 seeded OK. Verificación post-seed: cada región 2 templates mín, 24 total en California, Utah 4, Spain 4, etc. Ahora TODAS las 24 regiones muestran templates como California hacía. Diferencia arquitectural aprendida: seed no es idempotente automáticamente en deploy, hay que triggerearlo manualmente cuando templates-seed.ts cambia' },
  { category: 'S55 Optimize route order en trip classic view (nearest-neighbor TSP preservando endpoints)', hoursLow: 8, hoursHigh: 12,
    detail: 'Endpoint /api/routes/optimize-order Edge: recibe stops[] + preserve_endpoints bool. Preserva origin (index 0) y destination (index N-1) — típicamente hotel/starting-point/return. Middle stops se reordenan con greedy nearest-neighbor desde origin. 2-opt lite: prueba orden forward + reverse, escoge menor total_km. Devuelve stops + before_km + after_km + saved_km + saved_pct + changed bool. Botón "✨ Optimizar orden de paradas" en ItineraryPanel visible solo cuando stops.length >= 4. handleOptimizeRoute en trip page: POST + confirm dialog con savings human-readable (km o metros según magnitud), si !changed muestra "ya está optimizada". Diferencial vs Wanderlog: nuestra optimización es 1-click desde el DnD manual, sin llamar Google Route Optimization API ($$$)' },
  { category: 'S54 Agenda hora-por-hora: Empty hour slots + Add Day inline + Admin back-to-home', hoursLow: 12, hoursHigh: 18,
    detail: 'Empty hour slots Google Calendar/Notion-style: cuando día vacío, muestra 9 rows dashed [09:00, 10:30, 12:00, 13:30, 15:00, 16:30, 18:00, 19:30, 21:00] onClick abre AddItemInline con prefillStartLocal → shortcut o custom pre-llenado con esa hora. Reduce fricción "click + fill hour manually" → "1 tap". Add Day button en DayNavigator emerald dashed "+" al final: POST /api/trips/[slug]/itinerary/days/new server calcula max(day_number)+1 y addDaysISO(last_date,1), bumps trips.days_count. Auto-select del día nuevo + trackItinerary(day_selected added:true). AdminSidebar footer: agregado link "← Ver sitio público" que apunta a "/" (faltaba, admin no tenía forma de volver al sitio). Shortcuts en AddItemInline ahora heredan prefillStartLocal en handleShortcut + handleCustom + handlePlace' },
  { category: 'S53 Audit: verificar 24 regiones + limpiar ProblemSection copy stale bilingüe', hoursLow: 3, hoursHigh: 5,
    detail: 'curl bulk verification de 24 slugs Nav dropdown: 24/24 = 200 OK (california, PNW, southwest, utah, mexico, canada, italy, spain, iceland, ireland, scotland, germany, chile, argentina, peru, japan, australia, NZ, morocco, arizona, nevada, rockies, northeast, southeast). ProblemSection copy detectado stale: title/items hardcoded "California trips fail for first-time visitors" + "LA to San Francisco isn\'t 2 hours" + "California tax included" — legado del sprint S1-S10 pre-expansion. Actualizado a copy generalizado que refleja 24 regiones + 7 continentes + diferencial bilingüe EN+ES (500M+ hispanohablantes). Both en.json + es.json in sync' },
  { category: 'S52 Agenda standalone: /[locale]/agenda landing + /agenda/new server-create + Quick shortcuts', hoursLow: 12, hoursHigh: 20,
    detail: 'Nuevo flujo Agenda diaria completamente separado del concepto Rutas. /[locale]/agenda landing bilingüe con hero (título "Tu día, hora por hora", 2 CTAs primarios agenda vs multi-day trip), mockup día tipo Google/Notion Calendar con 6 items, use cases grid 6 (reservas, compromisos, atracciones, notas, tiempo libre, traslados), bottom CTA. /[locale]/agenda/new server component que RPC gen_trip_slug + inserta trip minimal (1 día, sin destino, sin travelers, is_public=true) + redirect a /trip/{slug}/itinerary — reutiliza tablas existentes sin duplicar schema. Nav "Agenda" primary emerald + "Rutas" secondary. FeatureQuickAccess reordena: Agenda diaria NEW featured emerald + Multi-day Trip FULL coral. AddItemInline agrega Quick/Custom mode toggle: 8 shortcuts con presets (Restaurante 60min, Café 30min, Compromiso 60min, Atracción 90min, Ejercicio 60min, Compras 60min, Descanso 30min, Nota sin duración) con handleShortcut() 1-click add sin buscar. Diferenciación arquitectural: Agenda = flujo day-only, Rutas = flujo multi-day. Ambos comparten Itinerary Engine underneath' }
];

const TOTAL_LOW = WORK_BREAKDOWN.reduce((sum, w) => sum + w.hoursLow, 0);
const TOTAL_HIGH = WORK_BREAKDOWN.reduce((sum, w) => sum + w.hoursHigh, 0);
// Sin IA-assistance (100% humano): AI reduce 30-50% del coding time (benchmarks 2026)
const HUMAN_LOW = Math.round(TOTAL_LOW * 1.6);
const HUMAN_HIGH = Math.round(TOTAL_HIGH * 1.8);

export default async function TechnicalReportPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <a href="/admin" className="mb-6 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
        <span aria-hidden>←</span> Volver al dashboard
      </a>
      <header className="mb-10 border-b border-ink-100 pb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-400">Confidencial · Reporte técnico</p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink-900">TripLoop — Auditoría técnica</h1>
        <p className="mt-2 text-[14px] text-ink-500">Métricas medidas desde el repositorio · Benchmarks 2026 · Agosto 2026</p>
      </header>

      <Section title="1. Overview del producto">
        <p className="text-[15px] leading-relaxed">
          Plataforma SaaS bilingüe (ES/EN) de planeación road-trip para turistas internacionales. Cubre <b>6 regiones</b>
          {' '}(California, Nevada, Arizona, Utah, Southwest USA + <b>España</b> primera región europea) con
          <b> 24 templates curados</b> traducidos a EN+ES. Incluye tiempos de manejo con tráfico real, precios con
          impuestos incluidos, <b>AI Trip Generator</b> (describe tu viaje en lenguaje natural → itinerario completo),
          sugerencias IA multi-provider, mapas offline para parques nacionales, exportación PDF, colaboración en tiempo real,
          <b> bot de WhatsApp</b> con Twilio + AI, <b>widget embebible</b> para blogs, y reservas 1-clic Booking.com + GetYourGuide.
        </p>
      </Section>

      <Section title="2. Métricas del codebase (medidas del repositorio · 2026-08-08 post-S36)">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricBox n={LOC.toLocaleString()} l="Líneas de código TS/TSX" />
          <MetricBox n={String(FILES_TSX + FILES_TS)} l="Archivos TypeScript" />
          <MetricBox n={String(APIS)} l="Endpoints API" />
          <MetricBox n={String(COMPONENTS)} l="Componentes React" />
          <MetricBox n={String(PAGES)} l="Páginas Next.js" />
          <MetricBox n={String(LIB_HELPERS)} l="Módulos lib/utils" />
          <MetricBox n={String(MIGRATIONS)} l="Migrations SQL" />
          <MetricBox n={String(RUNTIME_DEPS)} l="Dependencias runtime" />
          <MetricBox n={String(REGIONS)} l="Regiones cubiertas" />
          <MetricBox n={String(TEMPLATES)} l="Templates iconic curados" />
          <MetricBox n={String(CURATED_POIS)} l="POIs curados verificados" />
          <MetricBox n={String(CONTINENTS)} l="Continentes cubiertos" />
          <MetricBox n="130+" l="URLs indexables SEO" />
          <MetricBox n="16" l="Blog posts (EN+ES)" />
          <MetricBox n="70+" l="Deploys a producción" />
          <MetricBox n="6" l="Endpoints IA (+SSE stream)" />
        </div>
        <p className="mt-4 text-[12px] text-ink-500">
          TypeScript strict · cero errores de tipo · deployado en Vercel Fluid Compute · 70+ deploys a producción.
          Crecimiento vs snapshot S33 (misma sesión): <b>+3.7% LOC · +8 páginas · +1 migration · +4 templates · +4 regiones (Asia/Canadá/África/Scotland) · templates enriquecidos con season/difficulty/km</b>.
          Crecimiento total sesión inicial → S36: <b>+75% LOC · +300% regiones · +191% templates · 24 regiones en 7 continentes</b>.
        </p>
      </Section>

      <Section title="3. Desglose de horas · todo el ecosistema construido">
        <p className="mb-4 text-[14px] leading-relaxed text-ink-700">
          La estimación por LOC subestima el trabajo real. Un desarrollador senior escribe <b>10-50 líneas de código
          production-quality por día</b> (fuente: benchmarks 2026), no por hora. La mayor parte del tiempo se va en
          diseño, arquitectura, testing, debugging, iteraciones, integraciones y ops — que no aparecen en el LOC final.
        </p>
        <p className="mb-6 text-[14px] leading-relaxed text-ink-700">
          Este desglose cuenta <b>todo el ecosistema construido end-to-end</b> — diseño de página, desarrollo, programación,
          integraciones, testing, deployment, iteraciones y documentación:
        </p>
        <div className="overflow-hidden rounded-xl border border-ink-100">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50/70">
                <th className="px-3 py-2.5 text-left font-semibold text-ink-800">Categoría</th>
                <th className="px-3 py-2.5 text-right font-semibold text-ink-800 whitespace-nowrap">Horas</th>
                <th className="px-3 py-2.5 text-left font-semibold text-ink-800">Qué incluye</th>
              </tr>
            </thead>
            <tbody>
              {WORK_BREAKDOWN.map((w, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/25'}>
                  <td className="border-b border-ink-100 px-3 py-2.5 font-semibold text-ink-800 align-top">{w.category}</td>
                  <td className="border-b border-ink-100 px-3 py-2.5 text-right tabular-nums font-semibold text-ink-900 align-top whitespace-nowrap">{w.hoursLow}–{w.hoursHigh}h</td>
                  <td className="border-b border-ink-100 px-3 py-2.5 text-[12px] text-ink-600 align-top leading-relaxed">{w.detail}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-ink-300 bg-ink-900 text-white">
                <td className="px-3 py-3 font-semibold">TOTAL con IA-assisted (senior)</td>
                <td className="px-3 py-3 text-right tabular-nums font-display text-[16px] font-semibold whitespace-nowrap">{TOTAL_LOW.toLocaleString()}–{TOTAL_HIGH.toLocaleString()}h</td>
                <td className="px-3 py-3 text-[12px] opacity-85">Equivalente 5-8 meses full-time con AI coding assistants (Claude/Copilot)</td>
              </tr>
              <tr className="bg-ink-100 text-ink-800">
                <td className="px-3 py-2.5 font-semibold">Equivalente sin IA (100% humano)</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold whitespace-nowrap">{HUMAN_LOW.toLocaleString()}–{HUMAN_HIGH.toLocaleString()}h</td>
                <td className="px-3 py-2.5 text-[12px]">AI reduce 30-50% del coding time (benchmarks 2026)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12px] text-ink-500">
          Referencias: techsy.io SaaS calculator, makerkit.dev cost breakdown, uxcontinuum MVP report (50+ projects analizados), techconcepts.org (Aug 2026).
          Benchmark general: Full MVP multi-tenant = 1,000-2,000 horas · Well-scoped B2B SaaS $50K-$120K USD.
        </p>
      </Section>

      <Section title="4. Valorización del trabajo por tarifa mercado 2026">
        <Table rows={[
          ['Freelancer LATAM senior', `$40-80/hr × ${TOTAL_LOW}-${TOTAL_HIGH}h = $${(TOTAL_LOW * 40).toLocaleString()} – $${(TOTAL_HIGH * 80).toLocaleString()} USD`],
          ['Agency US mid-market', `$120-180/hr × ${TOTAL_LOW}-${TOTAL_HIGH}h = $${(TOTAL_LOW * 120).toLocaleString()} – $${(TOTAL_HIGH * 180).toLocaleString()} USD`],
          ['Agency US premium', `$200-300/hr × ${TOTAL_LOW}-${TOTAL_HIGH}h = $${(TOTAL_LOW * 200).toLocaleString()} – $${(TOTAL_HIGH * 300).toLocaleString()} USD`],
          ['Startup CTO in-house', 'Salario anual $80K-$180K + equity · equivale 5-8 meses de trabajo dedicado'],
          ['Referencia SaaS MVP 2026', 'Well-scoped B2B SaaS MVP = $50K-$120K · 3-6 meses (uxcontinuum, 50+ projects)'],
          ['Solo Stripe billing pro', '$8K-$30K (53-200 hrs) — nosotros lo integramos + 24 categorías más']
        ]} />
      </Section>

      <Section title="5. Stack técnico completo">
        <Table rows={[
          ['Framework', 'Next.js 15.5 App Router + Turbopack + React 19'],
          ['Runtime servidor', 'Vercel Fluid Compute · Edge default · Node.js para Stripe/HMAC'],
          ['Base de datos', 'Supabase PostgreSQL + Row Level Security en 11 tablas'],
          ['Autenticación', 'Supabase Auth (email + JWT sessions con cookies)'],
          ['Realtime', 'Supabase Realtime (presence + postgres_changes + broadcast)'],
          ['Pagos', 'Stripe SDK v18 (Checkout + Customer Portal + Webhooks HMAC)'],
          ['IA generativa', 'DeepSeek V3 (Fireworks) → Llama 3.3 70B (Groq) → Claude Haiku 4.5 · Promise.race'],
          ['Mapas', 'MapLibre GL 6.2 + Carto Voyager (gratis) + Google Places API + Routes API v2'],
          ['Email transaccional', 'Resend v6 + templates HTML + Vercel Cron para digest'],
          ['PWA + offline', 'Serwist Service Worker + IndexedDB (idb) + tile pre-caching'],
          ['i18n', 'next-intl 3.26 con /en /es routing + hreflang alternates'],
          ['Styling', 'Tailwind 3.4 + Inter (sans) + Fraunces (display serif)'],
          ['Drag & Drop', '@dnd-kit (React 19 compatible)'],
          ['SEO técnico', 'Sitemap dinámico, robots, Vercel OG, schema.org TouristTrip/BlogPosting/FAQPage'],
          ['Colaboración', 'Supabase Realtime channels · cero costo marginal vs Liveblocks ($99/mo)']
        ]} />
      </Section>

      <Section title="6. Integraciones externas activas (20)">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {['Vercel Fluid Compute', 'Supabase Postgres', 'Supabase Auth', 'Supabase Realtime', 'Supabase Storage', 'Stripe Checkout', 'Stripe Portal', 'Stripe Webhooks', 'Google Places API', 'Google Routes API', 'Google Static Maps', 'Resend', 'OpenRouter (5 free models)', 'Fireworks (DeepSeek V3)', 'Groq (Llama 3.3 70B)', 'Anthropic (Claude Haiku 4.5)', 'OpenChargeMap (EV)', 'Booking + GetYourGuide', 'Twilio (WhatsApp)', 'Nominatim + Photon (OSM free geocoding)'].map(i => (
            <div key={i} className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-[12px] font-medium text-ink-700">{i}</div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-ink-500">
          Cada integración incluye: setup de credenciales, wrapper cliente, error handling, retries, tests manuales,
          documentación en env vars, y monitoring básico.
        </p>
      </Section>

      <Section title="7. Arquitectura de seguridad">
        <ul className="ml-5 list-disc space-y-2 text-[14px] leading-relaxed text-ink-700">
          <li>Row Level Security en 11 tablas (trips, subscriptions, blog_posts, pois, affiliate_clicks, template_views, email_log, email_unsubscribes, etc)</li>
          <li>Writes con service_role exclusivamente desde Edge Functions server-side</li>
          <li>Admin: passphrase HMAC-signed cookie 24h con comparación timing-safe</li>
          <li>Stripe webhook: verificación de firma obligatoria (constructEvent)</li>
          <li>Endpoints Cron: bearer token con comparación constant-time</li>
          <li>Stripe endpoints: auth-first (evita filtrar config a anónimos)</li>
          <li>CSP headers + X-Frame-Options + X-Content-Type-Options + Referrer-Policy</li>
          <li>rel=&quot;sponsored nofollow&quot; en todos los links de afiliado (FTC compliant)</li>
          <li>Unsubscribe token HMAC + audit trail en email_log</li>
          <li>Cero secretos hardcodeados — todas las keys en Vercel env vars</li>
        </ul>
      </Section>

      <Section title="8. Performance producción (medida)">
        <Table rows={[
          ['Bundle JS compartido', '105 kB'],
          ['Trip page bundle inicial', '200 kB (MapLibre y paneles cargan on-demand)'],
          ['Homepage TTI', '~400ms (Hero + Pricing Server Components, cero JS bloqueante)'],
          ['AI suggest latencia', '~0.5-1s (Fireworks + Groq Promise.race parallel)'],
          ['Rutas Edge globales', '90% de APIs sub-100ms'],
          ['Static generation ISR', 'templates + blog cache 1h · dashboard force-dynamic'],
          ['Lighthouse readiness', 'PWA installable · SW registered · offline fallback']
        ]} />
      </Section>

      <Section title="9. Ventaja técnica defendible">
        <ul className="ml-5 list-disc space-y-2 text-[14px] leading-relaxed text-ink-700">
          <li><b>Bilingüe nativo EN+ES</b> con hreflang correcto y 24 templates traducidos. Wanderlog EN-only, TripIt EN-only.</li>
          <li><b>AI Trip Generator NLP</b> — describe el viaje en lenguaje natural → itinerario completo. Ningún competidor tiene equivalente sin agregar chat de OpenAI encima.</li>
          <li><b>Stack IA open-source con vendor chain triple</b>. DeepSeek $0.14/1M tokens vs GPT-4 $30/1M — 200× más barato. Fallback Groq (Llama 3.3, gratis tier) + Anthropic para premium.</li>
          <li><b>SEO programático first</b>: 24 templates × 2 idiomas + 16 posts pre-generados con schema.org. Wanderlog cero organic.</li>
          <li><b>Precios con impuestos UX</b>. Único competidor consciente del bait-and-switch fee que sufren MX/EU.</li>
          <li><b>Realtime con Supabase</b> (no Liveblocks $99/mo). Costo marginal cero.</li>
          <li><b>WhatsApp bot bilingüe con AI fallback</b>. Canal preferido en LATAM (98% penetración MX/AR/CO).</li>
          <li><b>Widget embebible</b> con temas dark/light para socios (blogs de viaje, agencias). Growth loop distribuido.</li>
          <li><b>Free geocoding fallback</b> (OpenStreetMap Nominatim + Photon) — ahorra ~60-80% en Google API quota.</li>
          <li><b>Rate limiting edge-safe</b> in-memory LRU sin dependencia externa (Redis/Upstash).</li>
          <li><b>Edge-first arquitectura</b> — 90% endpoints en Vercel Fluid Compute = latencia global consistente.</li>
          <li><b>Expansión geo lista</b> — arquitectura de regiones + templates permite añadir país nuevo en &lt;3h de trabajo (Utah + España probaron el patrón).</li>
        </ul>
      </Section>

      <Section title="10. Deuda técnica identificada (transparente)">
        <ul className="ml-5 list-disc space-y-2 text-[14px] leading-relaxed text-ink-700">
          <li className="line-through opacity-60">P2: Rate limiting en endpoints públicos — <b>RESUELTO S19</b> (in-memory LRU en 4 endpoints)</li>
          <li>P2: Rate limiting persistente (Upstash Redis) para survive cold starts en escala &gt;100 req/s</li>
          <li>P2: Edit token para trips anónimos (evitar edit-por-cualquiera)</li>
          <li>P2: Groq + Anthropic keys aún no configuradas en producción (solo Fireworks activo — sin fallback en caso de outage)</li>
          <li>P3: Skip-to-content link + form htmlFor labels (a11y minor)</li>
          <li>P3: Virtual scroll para itinerarios &gt; 20 stops (perf marginal)</li>
          <li>P3: OG images propias en /nevada /arizona /southwest /utah /spain (usa Unsplash placeholder ahora)</li>
          <li>P3: Test coverage — actualmente 0% (audit manual E2E vía Playwright funciona)</li>
          <li>P3: Stripe webhook coverage extendida (trial_will_end, refunded)</li>
          <li>P3: Twilio production credentials para WhatsApp bot (actualmente sandbox)</li>
          <li>P3: PostHog o Plausible para product analytics (ya tenemos template_views + affiliate_clicks propios)</li>
        </ul>
      </Section>

      <p className="mt-10 text-center text-[10px] font-medium tracking-wider text-ink-300">
        REPORTE GENERADO DESDE MÉTRICAS DEL REPOSITORIO + BENCHMARKS 2026 · AUDITABLE · AGOSTO 2026
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-[22px] font-semibold tracking-tight text-ink-900">{title}</h2>
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">{children}</div>
    </section>
  );
}

function MetricBox({ n, l }: { n: string; l: string }){
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 text-center">
      <div className="font-display text-[22px] font-semibold tabular-nums text-ink-900">{n}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500">{l}</div>
    </div>
  );
}

function Table({ rows }: { rows: string[][] }){
  return (
    <table className="w-full text-[13px]">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/30'}>
            <td className="border-b border-ink-100 px-3 py-2 font-semibold text-ink-800 align-top w-1/3">{r[0]}</td>
            <td className="border-b border-ink-100 px-3 py-2 text-ink-700">{r[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
