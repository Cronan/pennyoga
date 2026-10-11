# Pennyoga: outstanding work

The single list of what is left to do on the site, grouped by who it waits on. Last reviewed 11 October 2026.

This file is internal. `_config.yml` excludes it from the published site, along with `CLAUDE.md` and `SEO-NOTES.md`. `SEO-NOTES.md` holds the background and reasoning for the SEO items; this file holds the to-do list.

When something is done, move it to **Done** with the date and commit. When something is dropped, delete it and say why in the commit message.

---

## Waiting on Penny

- **Closure dates (needed before December).** Christmas 2026, half-terms and any venue closures, added to `.github/closures.txt`. Until then the structured data and the "Next class" badge will advertise classes over Christmas.
- **Prices and times.** Confirm they are still right for this term: Monday £12, Tuesday £10, Thursday £10, Wednesday online £9.
- **Testimonials.** Real student quotes, with permission. The commented-out section in `index.html` contains invented placeholder quotes: replace them, never just uncomment. No `Review` or `AggregateRating` JSON-LD.
- **Carey Baptist front car park.** Can students use it? The site currently says "subject to availability".
- **Floor surface and chair availability** at Leverstock Green Village Hall and Carey Baptist Church.
- **BWY portal entry 619.** Refresh it. Also check whether she has a teacher profile worth adding to `sameAs`.
- **Does she want new kinds of work?** Ask before drafting anything:
  - private 1:1 sessions
  - corporate or small-group bookings
  - neighbourhood call-outs on the venue pages (Northchurch, Potten End, Felden)
  - a teaching-philosophy page in her own voice

  See `SEO-NOTES.md` for the reasoning.

## Waiting on Ivan

- **Merge `claude/fix-housekeeping-workflows` into `main`.** It holds the link-check repair, the venue-page date fix, closures, the closure-aware badge, the sitemap reset and the `_config.yml` exclude. Merge before Monday 06:00 UTC, or the old link check will file one more empty issue.
- **Delete merged branches.** Claude sessions cannot delete them, so do it from GitHub:
  - `claude/design-website-enhancement-prompt-wtKxw`
  - `claude/seo-notes-review-7xKzh`
  - `claude/seo-website-review-XFXdu`
  - `claude/fix-housekeeping-workflows`, once merged
- **Check the notes are off the live site.** After the merge deploys, check that `pennyoga.co.uk/SEO-NOTES.html`, `/SEO-NOTES.md`, `/CLAUDE.html` and `/CLAUDE.md` all return 404. If Google has indexed any of them, use Search Console → Removals.
- **Check the first real link check.** Monday's run will be the first in six months that actually checks the external links. Make sure it is green, or read the issue it opens.
- **Google Business Profile.** This is the biggest single off-site lever. Verify it as a service-area business, list the three venues plus online, and gather reviews there.
- **Google Search Console:**
  - confirm `sitemap.xml` is submitted
  - request indexing for the four venue pages and the two topical pages
  - check the April duplicate/canonical warning. Paste a couple of example URLs into a session; it is most likely `/x/` and `/x/index.html` and harmless.

## Claude can do without input

- **Branded 1200×630 OG image** with the wordmark. Pages currently share `canal.jpg`, a venue card or `penny.jpg`.
- **Bump workflow actions to their current major versions.** `checkout`, `setup-python`, `setup-node` and `create-issue-from-file` all target Node 20, which GitHub is retiring. They still run for now.
- **Proposal: a visible closure notice.** A one-line "No classes 21 December to 3 January" near the schedule, driven by the same `closures.txt` data. Needs a yes before building.

---

## Done

- **11 Oct 2026.** Link checker repaired after six months of silent failure, and its 25 empty issues closed. Venue-page Event dates rotate again. `.github/closures.txt` added. Sitemap `lastmod` reset and no longer bumped by the bot. (`14ab0a7`)
- **11 Oct 2026.** "Next class" badge skips closures and shows the date after a break. (`2ee9fcf`)
- **11 Oct 2026.** Internal Markdown notes excluded from the published site via `_config.yml`.
