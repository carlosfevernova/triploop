# Contributing to TripLoop

Thanks for the interest. TripLoop is currently in **asset-sale mode** (see [FOR_SALE.md](./FOR_SALE.md)) but external contributions are welcome and will transfer with the codebase to any future owner via the MIT license.

## Ways to contribute

### 1. Report a bug

Open an issue at https://github.com/carlosfevernova/triploop/issues with:

- **What happened** — 1-2 sentences
- **What you expected** — 1 sentence
- **Reproduce** — URL + steps (or code snippet)
- **Environment** — browser + OS, or Node version if local
- **Logs** — `console.log`, `/api/health` output if relevant

Priority tagging (maintainer applies): `P0` (data loss / security) → `P1` (broken feature) → `P2` (UX) → `P3` (nice-to-have).

### 2. Send a pull request

Small PRs (< 200 LOC changed) get reviewed within 3-7 days. Large refactors — open an issue first to discuss.

**PR checklist:**

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes (`tsc --noEmit`)
- [ ] `npm run build` passes locally
- [ ] Manual test in `/en` locale + at least 1 other (`/es`, `/pt`, `/de`)
- [ ] Mobile viewport tested (320px min)
- [ ] Screenshots or Loom demo if UI change
- [ ] Update `AUDIT.md` § 5-6 if adding/removing a feature
- [ ] Update `.env.example` if adding a new env var

### 3. Improve documentation

`README.md`, `AUDIT.md`, `FOR_SALE.md`, `CHANGELOG.md`, `CONTRIBUTING.md` (this file), and files under `marketing/` — all Markdown, all welcome edits.

## Development

```bash
git clone https://github.com/carlosfevernova/triploop.git
cd triploop
npm install
cp .env.example .env.local  # Fill in your keys — see .env.example for docs per key
npm run dev  # http://localhost:3000
```

**Minimum required env vars to run locally:**

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` + `SUPABASE_SECRET_KEY` — create a free Supabase project
- `OPENROUTER_API_KEY` — free tier at https://openrouter.ai/keys
- `GOOGLE_MAPS_API_KEY` — Google Cloud Console (enable Places New + Routes v2)

Everything else is optional per feature (see `.env.example` comments).

## Code style

- **TypeScript strict** — no `any`, no `@ts-ignore` unless documented why
- **Tailwind classes only** for styling (no CSS modules, no styled-components)
- **Server Components by default** — use `'use client'` only when needed (state, effects, browser APIs)
- **4-locale support required for user-facing strings** — see `src/lib/l4.ts` `L()` helper pattern

## Commit format

Conventional Commits with sprint tag:

```
feat(sN):    new user-facing feature
fix(sN):     bug fix
perf(sN):    performance improvement
polish(sN):  a11y, UX polish, small tweaks
docs(sN):    documentation update
chore(sN):   infra, deps, tooling
refactor(sN): code refactor without behavior change
```

Where `sN` is the current sprint number (see CHANGELOG.md). Not strict — if unsure, `feat` or `fix` are always safe.

## Asset sale context

TripLoop is currently listed for asset sale ([FOR_SALE.md](./FOR_SALE.md)) at $35,000 USD firm. Any accepted PR transfers ownership to whichever entity owns the repo at merge time. Contributor names are preserved in `git log` regardless of ownership transfer.

If TripLoop is acquired, the new owner may or may not continue accepting PRs — that's their call. Open PRs at time of acquisition will be reviewed by the new owner (or closed with a comment if they're not accepting external contributions).

## Contact

- GitHub Issues (preferred)
- `hola@nano-almacen.mx` (batch response, 3-5 day turnaround)

Thanks for reading this far.
