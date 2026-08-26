# Observability

TripLoop ships structured logging out of the box and is pre-wired for Sentry as an optional add-on.

## Structured logs

All server code emits JSON single-line log entries via `src/lib/logger.ts`:

```ts
import { logger, withLog } from '@/lib/logger';

// Discrete event
logger.info('trip.generated', { slug, provider: 'openrouter', latency_ms: 1234 });

// Wrap an async op — auto-logs latency + success/failure
const trip = await withLog('ai.generate', async () => generateTrip(prompt), { user_id: '...' });
```

Every entry has:

- `ts` — ISO 8601 timestamp
- `level` — `debug` | `info` | `warn` | `error` | `fatal`
- `event` — dotted lowercase event name (namespace.action)
- `msg` — optional freeform message
- `...ctx` — flat key-value context

**Log level:**
- Default `info` in production (`VERCEL_ENV=production`)
- Default `debug` in dev
- Override via `LOG_LEVEL=warn|error|debug`

## Vercel Log Drains

Vercel forwards all `console.log`/`console.error` output to configured log drains. Because entries are JSON, downstream tools (Datadog, Grafana Loki, Axiom, Better Stack) can parse and index them without additional transformation.

**To wire a drain:**

1. Go to Vercel Dashboard → Project → Settings → Log Drains
2. Add a drain — choose provider (or custom HTTPS endpoint)
3. Filter on `json.level:error` for errors only, or `json.event:trip.*` for domain events
4. Optional: sample rate for high-volume events (`json.event:concierge.answered` → 10%)

## Sentry (optional)

The logger auto-forwards `error` and `fatal` level entries to Sentry if:

1. `@sentry/nextjs` is installed:
   ```bash
   npm install @sentry/nextjs
   ```

2. Environment variable is set:
   ```bash
   SENTRY_DSN=https://...@o...ingest.sentry.io/...
   ```

3. Sentry init file is created (`sentry.server.config.ts` in project root):
   ```ts
   import * as Sentry from '@sentry/nextjs';
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 0.1,
     environment: process.env.VERCEL_ENV || 'development'
   });
   ```

With Sentry wired, any `logger.error()` or `logger.fatal()` call automatically:
- Captures the exception (if `ctx.error` is an `Error` instance)
- Or captures a message with the event name + msg
- Attaches all context fields as Sentry extras
- Groups by event name for meaningful dashboards

If Sentry isn't installed, the logger silently no-ops the forward. Zero-dep default.

## Load testing baseline (2026-08-26)

Simple synthetic run via `hey` (github.com/rakyll/hey):

```bash
# 200 concurrent users, 1000 requests total, GET /en
hey -c 200 -n 1000 https://triploop-six.vercel.app/en

# Landing page (RSC, ISR revalidate 300s)
# Result: 100% success, p50 ~180ms, p99 ~600ms, 0 errors

# AI generation endpoint (streaming SSE)
hey -c 10 -n 50 -m POST -T application/json \
  -d '{"prompt":"3 days California coast","locale":"en"}' \
  https://triploop-six.vercel.app/api/ai/generate-trip/stream
# Result: 100% success, p50 first-stop 800ms (curated cache hit rate 60%+)
```

**Not enforced in CI yet.** For buyer-grade rigor:
1. Add `hey`/`k6` load test as GitHub Action weekly cron
2. Fail if p99 > 2s on landing OR p50 > 3s on AI streaming
3. Chart via Datadog/Grafana

## Health endpoint

`GET /api/health` (also `HEAD`) returns:

```json
{
  "status": "ok",
  "service": "triploop",
  "version": "0.1.0",
  "commit": "abc1234",
  "region": "iad1",
  "environment": "production",
  "uptime_seconds": 1234,
  "timestamp": "2026-08-26T21:00:00.000Z",
  "checks": {
    "supabase_url_configured": true,
    "supabase_secret_configured": true,
    "stripe_configured": false,
    "openrouter_configured": true,
    "google_maps_configured": true,
    "resend_configured": false
  }
}
```

Wire this to an uptime monitor (UptimeRobot, Better Stack, Vercel Uptime) with `HEAD` requests every 60s. Alert on non-200 for 3 consecutive checks.

## AI cost tracking

Every AI call is logged to Supabase `ai_call_log` table via `src/lib/ai-cost-tracker.ts`. Query aggregations in `/admin/ai-costs` dashboard:

- Per provider: total calls, success rate, avg latency, cost USD, fallback count
- Per endpoint: calls + avg latency
- Daily 7-day chart with cost breakdown

Because AI-call metadata is in DB, no external observability tool is needed for cost tracking (unlike API-tier tools that log to their own dashboards).

## What's NOT wired yet

- **APM (application performance monitoring)** — Sentry Perf, New Relic, Datadog APM. Buyer can wire via `sentry.server.config.ts` if desired.
- **Real User Monitoring (RUM)** — `WebVitalsReporter` component exists but doesn't ship metrics anywhere by default. Buyer can point it at Vercel Analytics or Sentry Sessions.
- **Distributed tracing** — no OpenTelemetry wire-up. Overkill for a single-service Next.js app; consider only if breaking apart to microservices.
