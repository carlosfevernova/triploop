# Security Posture

This document summarizes TripLoop's security controls, threat model, and reporting process for prospective buyers and contributors.

## Access Control

- **Row-Level Security (RLS):** enabled on 12 Supabase tables (`trips`, `subscriptions`, `blog_posts`, `pois`, `affiliate_clicks`, `template_views`, `email_log`, `email_unsubscribes`, `whatsapp_conversations`, `waitlist`, `processed_webhook_events`, `ai_call_log`)
- **Service role isolation:** the Supabase `service_role` key is used only in server-side code (`src/app/api/*`, Route Handlers). Never in client bundle.
- **Admin authentication:** passphrase-based with HMAC-signed cookie (24h TTL, `SHA-256`). Constant-time comparison via `crypto.timingSafeEqual`.
- **Cron authentication:** Bearer token via `CRON_SECRET` env var. Vercel Cron sends `Authorization: Bearer $CRON_SECRET` header — verified per request.

## Secrets Management

- **Zero hardcoded secrets** in source code (verified: `grep` of tracked files shows only env var *names*, not values).
- **All secrets in Vercel Environment Variables** (encrypted at rest).
- **`.env.local`** is gitignored. `.env.example` documents 33 vars without values.
- **HMAC-signed unsubscribe tokens** in emails: user cannot forge unsubscribe for another user's email.

## Rate Limiting

In-memory LRU per Vercel Fluid Compute instance:

| Endpoint | Rate limit |
|---|---|
| `/api/waitlist` | 3 requests / minute / IP |
| `/api/ai/generate-trip` | 8 requests / minute / IP |
| `/api/ai/generate-trip/stream` | 10 requests / minute / IP |
| `/api/ai/*` (other) | 30 requests / minute / IP |
| `/api/places/*` | 30 requests / minute / IP |
| `/api/trips/[slug]/concierge` | 20 requests / minute / IP |

**Not persisted cross-instance.** Buyer can swap for Upstash Redis rate limiter if higher precision needed.

## Webhook Security

- **Stripe webhook** (`/api/stripe/webhook`): HMAC signature verification via `stripe.webhooks.constructEvent()` + idempotency table `processed_webhook_events` (migration 017) prevents at-least-once double-processing.
- **Twilio WhatsApp webhook** (`/api/whatsapp/webhook`): Signature verification via `X-Twilio-Signature` header check.

## Content Security Policy

Set via middleware (`src/middleware.ts`). Includes:

```
default-src 'self'
script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.openrouter.ai
frame-src https://js.stripe.com https://hooks.stripe.com
```

Note: `unsafe-inline` for scripts is required by Next.js hydration. Not eliminable without significant refactoring.

## Dependency Security

- **Dependabot** configured (`.github/dependabot.yml`): weekly npm updates + monthly Actions updates, grouped minor+patch PRs, opens up to 5 PRs at once.
- **Framework pins:** `next`, `react`, `react-dom` do not auto-update major versions (manual bump per sprint to avoid breaking changes).
- **`npm audit` clean** as of 2026-08-26 for all direct dependencies with active advisories.

## Data Handling

- **Trip data:** persisted in Supabase Postgres with RLS. Anonymous trips (no `owner_id`) are public read-only (`is_public=true`).
- **Waitlist emails:** stored in `waitlist` table, exported only via admin dashboard.
- **AI call logs:** stored in `ai_call_log` (migration 018) for cost tracking. No user-generated content (only endpoint metadata + latency + provider). Retention: no auto-cleanup (Buyer can add cron for 90-day purge if desired).
- **Stripe webhook events:** `processed_webhook_events` stores `stripe_event_id` + `event_type` + `metadata` for idempotency. No PII.

## Reporting Vulnerabilities

**For security issues:** Please email `hola@nano-almacen.mx` with subject `[SECURITY] TripLoop <brief description>`.

**Do NOT** open a public GitHub Issue for exploitable vulnerabilities.

**Response SLA:**
- Critical (e.g., auth bypass, data leak): within 24 hours
- High (e.g., privilege escalation, DoS): within 3 days
- Medium/Low: within 14 days

## Known Limitations (Documented)

- **Admin passphrase is shared** — one passphrase for all admins. Buyer may want to upgrade to per-user role system via Supabase Auth (6-8h refactor).
- **In-memory rate limits** don't share state across Vercel instances. Fine for typical traffic; swap to Upstash Redis for high-scale precision.
- **CSP has `unsafe-inline` for scripts** — Next.js hydration requires it. Not eliminable without significant framework changes.
- **No 2FA on admin login** — passphrase-only. Buyer can add via WebAuthn (~4h) if desired.

## Compliance Notes

- **GDPR:** No cookie consent banner (only session cookies). Waitlist form is opt-in via email submission. Users can email `hola@triploop.app` for deletion.
- **CCPA:** Same posture as GDPR. Buyer should evaluate need for full compliance based on target markets.
- **PCI-DSS:** No card data touches the server — Stripe Checkout hosts the payment form entirely. `sk_*` keys never leak client-side.
- **SOC 2 / ISO 27001:** Not certified. Buyer can pursue based on enterprise sales strategy.

## Third-Party Trust Boundaries

- **Supabase** — database, auth, storage. TripLoop trusts Supabase's SOC 2 posture.
- **Vercel** — hosting, edge, cron. TripLoop trusts Vercel's SOC 2 posture.
- **Stripe** — payments. PCI-DSS Level 1 certified.
- **Twilio** — WhatsApp. SOC 2 + HIPAA available.
- **Resend** — email. SOC 2 Type II.
- **OpenRouter / Groq / Cloudflare / Anthropic** — AI providers. TripLoop does not send PII in AI prompts.
- **Google Places / Routes** — geocoding. Standard Google Cloud data handling.

---

*Last reviewed 2026-08-26 · CHANGELOG.md documents security-related changes with the tag `security:` prefix.*
