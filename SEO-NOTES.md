# SEO follow-ups

Notes for a future SEO pass. This file is the canonical hand-off for the next session — if you're picking this up cold, read it then check the most recent commits on `main` for current state.

## Context

The April 2026 SEO pass (branch `claude/seo-website-review-XFXdu`) added six new pages and a tighter schema:

- Per-venue pages: `/classes/berkhamsted/`, `/classes/leverstock-green/`, `/classes/hemel-hempstead/`, `/classes/online/`
- Topical landing pages: `/yoga-for-over-60s/`, `/yoga-for-stiff-backs/`
- LocalBusiness JSON-LD with address, geo, openingHours, sameAs
- Three GitHub Actions: `rotate-events.yml`, `image-variants.yml`, `link-check.yml`
- Internal linking from `index.html` and `about.html` into the new pages

The session-end claim verification pass corrected most venue facts (parking, transport, accessibility) against web sources.

A follow-up pass on branch `claude/seo-notes-review-7xKzh` closed the health-claim audit on both topical pages and added a light premium-positioning polish ("small, unhurried") to the home schedule subheading and the three face-to-face venue-page intros. See **Done since last hand-off** below.

---

## Open work

### Demographic angle for the wealthy older catchment (PRIORITY)

The Berkhamsted/Tring/Hemel corridor has a high concentration of affluent retired and semi-retired professionals. Median Berkhamsted house price is ~£700k+; surrounding rural-fringe villages (Potten End, Bourne End, Felden, Northchurch, parts of Tring and Bovingdon) skew similarly. Penny's existing demographic likely already reflects this. A light premium-positioning polish has landed ("small, unhurried"); the bigger levers below still need Penny's input.

Possible content angles still to explore:

- **Private 1:1 sessions** as a dedicated page if Penny offers them (or would consider). Higher-margin, high-intent search ("private yoga teacher Berkhamsted").
- **Small-group / corporate / wellness bookings** — possible new income stream. A dedicated page could rank for "corporate yoga Hertfordshire" / "office yoga Berkhamsted".
- **Specific neighbourhood call-outs** in venue pages once Penny confirms her catchment. Examples: "popular with students from Northchurch, Potten End, Felden". Hyper-local mentions help the long tail.
- **A `/teaching/` or `/about/teaching-philosophy/` page** that signals depth and care — strengthens E-E-A-T and appeals to discerning clients comparing options. Penny should shape the voice before a draft goes live.

Verify with Penny before any private, corporate or neighbourhood-specific copy goes live.

### Smaller items still pending

- **Testimonials.** Section is commented out on `index.html`. Penny is collecting student quotes; populate when received. **No `Review` / `AggregateRating` JSON-LD** — Google disallows self-served reviews and risks a manual action (rule recorded in `CLAUDE.md`).
- **Carey Baptist front car park.** Currently noted as "subject to availability" — confirm with Penny whether students can actually use it.
- **BWY portal entry.** Penny needs to log in and refresh class entry 619; check whether she has a teacher-level profile worth linking from `sameAs`.
- **Floor surface and chair availability** at Leverstock Green Village Hall and Carey Baptist Church. Currently unspecified on both venue pages; can be added when Penny confirms.
- **Branded 1200×630 OG image.** All pages currently reuse `images/canal.jpg` or venue cards as the social-share image. A dedicated branded image with the wordmark would lift social CTR.
- **Google Business Profile.** Single biggest off-site lever. Verify the service-area business, list all three venues plus online classes, gather reviews there (where they're allowed by Google).
- **Google Search Console.** Submit `sitemap.xml` and request indexing for the six new URLs once the branch is on `main`.

---

## Done since last hand-off

- **Health-claim audit** on `/yoga-for-over-60s/` and `/yoga-for-stiff-backs/` — rewritten to describe what gentle yoga *is* rather than what it *does*, with the "see a GP first" caveat retained (commits `48a287a`, `01ebd02`).
- **Light premium-positioning pass.** No budget framing (`cheap` / `affordable` / `value`) existed to strip. Added "small" to each of the three face-to-face venue-page intros and "small, unhurried" to the home schedule subheading. Heavier positioning work (private 1:1, corporate, neighbourhood call-outs, teaching-philosophy page) still needs Penny's input and remains in Open work.

---

## How the GitHub Actions interact with the site

If you're editing content, be aware:

- `rotate-events.yml` (daily 03:15 UTC) rewrites Event `startDate`/`endDate` in JSON-LD to the next occurrence of each weekday and bumps `sitemap.xml` `lastmod` if anything changed. Targeted regex; small diffs only. New venue pages with their own Event blocks are picked up automatically (the script walks `index.html` plus everything matching `classes/*.html`).
- `image-variants.yml` (on push to `main` when `images/**` changes) generates `.avif` and `.webp` siblings via `sharp`. Don't manually maintain variants.
- `link-check.yml` (weekly Monday 06:00 UTC) runs `lychee` against all local HTML and opens an issue on broken links. Excludes `mailto:` and `tel:`.

Repo Settings → Actions → General must have "Workflow permissions = Read and write" for the bot to push.
