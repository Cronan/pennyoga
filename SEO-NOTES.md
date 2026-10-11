# SEO follow-ups

Background and reasoning for SEO work. The to-do list itself lives in `TODO.md`; if you're picking this up cold, read that first, then this, then the most recent commits on `main`.

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

## Background: demographic angle for the older catchment

The Berkhamsted/Tring/Hemel corridor has a high concentration of affluent retired and semi-retired professionals. Median Berkhamsted house price is ~£700k+; surrounding rural-fringe villages (Potten End, Bourne End, Felden, Northchurch, parts of Tring and Bovingdon) skew similarly. Penny's existing demographic likely already reflects this. A light premium-positioning polish has landed ("small, unhurried").

Why each of the bigger levers in `TODO.md` might be worth it, if Penny wants the work:

- **Private 1:1 sessions.** Higher-margin, high-intent search ("private yoga teacher Berkhamsted").
- **Small-group / corporate / wellness bookings.** Could rank for "corporate yoga Hertfordshire" / "office yoga Berkhamsted".
- **Neighbourhood call-outs** on venue pages ("popular with students from Northchurch, Potten End, Felden"). Hyper-local mentions help the long tail.
- **A `/teaching/` or `/about/teaching-philosophy/` page.** Strengthens E-E-A-T and appeals to people comparing teachers. Penny should shape the voice before a draft goes live.

Verify with Penny before any private, corporate or neighbourhood-specific copy goes live. Never add `Review` / `AggregateRating` JSON-LD for testimonials (rule recorded in `CLAUDE.md`).

---

## Done since last hand-off

- **Health-claim audit** on `/yoga-for-over-60s/` and `/yoga-for-stiff-backs/` — rewritten to describe what gentle yoga *is* rather than what it *does*, with the "see a GP first" caveat retained (commits `48a287a`, `01ebd02`).
- **Light premium-positioning pass.** No budget framing (`cheap` / `affordable` / `value`) existed to strip. Added "small" to each of the three face-to-face venue-page intros and "small, unhurried" to the home schedule subheading. Heavier positioning work (private 1:1, corporate, neighbourhood call-outs, teaching-philosophy page) still needs Penny's input and remains in Open work.

---

## How the GitHub Actions interact with the site

If you're editing content, be aware:

- `rotate-events.yml` (daily 03:15 UTC, plus on any push to `.github/closures.txt`) rewrites Event `startDate`/`endDate` in JSON-LD to the next occurrence of each weekday, skipping dates listed in `.github/closures.txt`. Targeted regex; small diffs only. New venue pages with their own Event blocks are picked up automatically (the script walks `index.html` plus everything matching `classes/*/index.html`). Until October 2026 the glob was `classes/*.html`, which matched nothing, so venue-page dates sat at April 2026 for six months.
- `sitemap.xml` `lastmod` is maintained by hand. The rotation used to bump every URL on every run, which teaches Google to ignore the field; set a page's date only when its content changes.
- `image-variants.yml` (on push to `main` when `images/**` changes) generates `.avif` and `.webp` siblings via `sharp`. Don't manually maintain variants.
- `link-check.yml` (weekly Monday 06:00 UTC) runs `lychee` against all local HTML (root-relative links resolved against the checkout) and keeps one issue open and updated while links are broken, closing it when they pass. Excludes `mailto:` and `tel:`. Until October 2026 an obsolete `--exclude-mail` flag made lychee exit before checking anything, which produced 25 empty issues (#22, #31–#54); a missing report now fails the job instead.

Repo Settings → Actions → General must have "Workflow permissions = Read and write" for the bot to push.
