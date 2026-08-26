# TripLoop — Submit Ready Kit

**Copy-paste ready fields for every marketplace + platform. Zero blank-page problem.**

## Files in this directory

| File | Platform | Cost | Time to submit | ETA first response |
|---|---|---|---|---|
| `sideprojectors.md` | SideProjectors | Free | ~8 min | 3-7 days |
| `flippa.md` | Flippa | $29 + 10% commission | ~20 min | 24-48h (algo boost) |
| `reddit-sideproject.md` | Reddit r/SideProject | Free | ~5 min | 1-2 days |
| `hacker-news.md` | Hacker News Show HN | Free | ~3 min | 1-6h (if front page) |
| `product-hunt.md` | Product Hunt | Free | ~15 min setup | Launch day |

---

## Recommended submission order

### Phase 1 — Day 0 (paid channels first)

1. **Flippa** (`flippa.md`) — 20 min. Auction gets algorithmic boost first 24-48h. Paid $29 so they promote it.
2. **SideProjectors** (`sideprojectors.md`) — 8 min. Free, but takes days to surface organically.

### Phase 2 — Day 1 (community channels)

3. **Reddit r/SideProject** (`reddit-sideproject.md`) — 5 min. Post Monday 9-11am EST for weekly for-sale thread.
4. **Hacker News Show HN** (`hacker-news.md`) — 3 min. Post weekday 8-10am EST. Prepare to defend the AI orchestration story.

### Phase 3 — Day 30+ (only if not sold)

5. **Product Hunt** (`product-hunt.md`) — 15 min. Position as active product, not for-sale (removes pricing pressure).

---

## Assets you need before submitting

Prepare these once, use across all platforms:

### 1. Loom demo video (5 min)

Script in `CONTENT_PACK.md` section 5. Record via loom.com/record.
- Not needed for SideProjectors submission itself
- Required for Flippa verification (upload as document)
- Optional but boosts Reddit/HN response rate
- Required for Product Hunt gallery

### 2. Screenshots (6 total)

Take these once via Windows Snip Tool (`Win+Shift+S`) or Playwright headless:

1. **Prospectus hero** — screenshot of triploop-sale.vercel.app top
2. **README GitHub** — screenshot of repo README verified metrics table
3. **AUDIT.md** — screenshot of architecture + security tables
4. **File tree** — screenshot of repo directory listing (src/, supabase/, marketing/)
5. **Streaming SSE** — screenshot of trip generation happening (needs live product)
6. **Multi-locale toggle** — screenshot showing PT-BR or DE-DE version of landing

Store in `marketing/screenshots/` (add `screenshots/` to gitignore if you don't want them in the public repo).

### 3. OG image PNG (1200×630)

Once product URL is unpaused, download from:
```
https://triploop-six.vercel.app/en/opengraph-image
```

Save as `og-image.png`. Upload to:
- GitHub Settings → Social Preview
- Flippa listing "featured image"
- Reddit post (attach as image)
- LinkedIn/X posts (auto-detects from URL, but manual attach as backup)

### 4. `git log` + `wc -l` output screenshots

For Flippa verification:
```bash
# Screenshot A: commits proof
git log --oneline | wc -l

# Screenshot B: LOC proof
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1
```

Take terminal screenshots. Store in `marketing/screenshots/proof/`.

---

## Escalation timeline

| Days | Action |
|---|---|
| **Day 0** | Flippa + SideProjectors submitted |
| **Day 1** | Reddit r/SideProject + HN Show HN posted |
| **Day 2-3** | Send 5 outreach messages (`marketing/outreach/`) |
| **Day 7** | Check: any DMs? views? watchers? |
| **Day 14** | If no serious eval → follow-up outreach + bump Reddit post |
| **Day 21** | If no serious offer → drop price to $30K or offer bundle |
| **Day 30** | Reassess: sell at floor $18K, hold and launch on PH, or pivot to product mode |
| **Day 60** | If still no sale → consider bundle with FiestaMap for $40K or defer sale 6-12 months |

---

## Track responses centrally

Create a single sheet (Google Sheets / Notion / Airtable):

| Platform | URL | Date submitted | Views | Comments/DMs | Serious buyer? | Outcome |
|---|---|---|---|---|---|---|
| Flippa | | | | | | |
| SideProjectors | | | | | | |
| Reddit | | | | | | |
| HN | | | | | | |
| PH (later) | | | | | | |
| Wanderlog outreach | | | | | | |
| Mindtrip outreach | | | | | | |
| Roadtrippers outreach | | | | | | |
| Marc Lou outreach | | | | | | |
| Levelsio outreach | | | | | | |

**Rule:** Update this sheet within 24h of any activity. Don't rely on memory.

---

## Common mistakes to avoid across all platforms

1. **Don't post the same copy verbatim across all platforms in the same day.** Reddit/HN/PH crowd overlaps and detects spam patterns.
2. **Don't reply defensively to price questions.** Say "$35K reflects replacement cost + curated content moat; happy to explain the line-item math" and link to FOR_SALE.md.
3. **Don't chase every DM.** Filter for signal: tire-kickers ask "how much?" without reading FOR_SALE.md. Serious buyers ask specific tech questions.
4. **Don't oversell the AI.** Multi-provider fallback is impressive to devs, boring to non-tech buyers. Adjust pitch per audience.
5. **Don't hide the pre-revenue status.** Anyone who buys expecting MRR will unwind the deal. Transparent upfront = fewer wasted calls.
6. **Don't skip the Loom demo.** Time-to-close halves when buyers can watch a 5-min demo before video call.

---

## Post-sale process (when someone commits)

Follow the process in `FOR_SALE.md` (section: Process):

1. Signed asset purchase agreement (2-page template)
2. 50% deposit via Wise/Stripe/PayPal/Escrow.com
3. Transfer: GitHub repo → Vercel project → env vars walkthrough
4. 2h post-sale support (or 8h with BIN)
5. Remaining 50% wired
6. Delete listings from all marketplaces within 24h of close

**Time estimate:** 7-10 days from first message to fully transferred with an active buyer.
