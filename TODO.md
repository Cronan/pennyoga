# Pennyoga: outstanding work

The single list of what is left to do on the site, grouped by who it waits on. Last reviewed 11 October 2026 (evening).

This file is internal. `_config.yml` excludes it from the published site, along with `CLAUDE.md` and `SEO-NOTES.md`. `SEO-NOTES.md` holds the background and reasoning for the SEO items; this file holds the to-do list.

When something is done, move it to **Done** with the date and commit. When something is dropped, delete it and say why in the commit message.

---

## Waiting on Penny

- **Tell us when Thursday fills**, or when another class needs students. Penny confirmed on 12 October that Thursday has spaces and the other classes are "ask Penny". See "Availability notices" in `CLAUDE.md` for how to update the site.
- **Google review.** The Business Profile has one review. Ask two or three long-standing students to leave one; Google reviews are allowed, only self-hosted review markup is not.
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

- **Delete merged branches.** Claude sessions cannot delete them, so do it from GitHub:
  - `claude/design-website-enhancement-prompt-wtKxw`
  - `claude/seo-notes-review-7xKzh`
  - `claude/seo-website-review-XFXdu`
  - `claude/fix-housekeeping-workflows`
- **Check the first real link check.** Monday's run will be the first in six months that actually checks the external links. Make sure it is green, or read the issue it opens.
- **Google Business Profile: tune it.** The profile "Gentle Yoga with Penny" exists, is verified and managed (category Yoga instructor, 5.0 from one review, website and phone correct, 15 interactions). It is the main way into Google's AI Overviews, AI Mode and Gemini for local queries, so the remaining gaps are worth an hour:
  - **Hours.** Set to "Open with no main hours" on 15 October (the edit was pending Google review). The site's `openingHoursSpecification` was removed to match; class times live in the Event schedules.
  - **Service areas.** Berkhamsted, Hemel Hempstead, Leverstock Green, Tring, Kings Langley, Bovingdon. Keep the address hidden.
  - **Description and services.** A short "from the business" paragraph in Penny's words naming the four classes, venues, times and prices. Add each class as a Service with its price.
  - **Photos.** The current photos are foliage. Add Penny's portrait as the profile photo, plus each venue (the three card photos on the site are already licensed for this) and, if students agree, a class in progress.
  - **Updates.** Post one now: "Spaces available on Thursday afternoons, 2pm, Carey Baptist Church, £10 trial", linking to `/classes/hemel-hempstead/`. Repeat each term or whenever availability changes; Updates expire from view after a while.
  - **Link it from the site.** Paste the profile's Maps share link into a session and Claude will add it to `sameAs` in the schema, which is how the site and the profile are tied together for Google and for assistants.
  - **Name.** The profile says "with", the site says "With". Harmless, but pick one; the site is easier to change.
- **Bing Places for Business.** Claim or create the listing with the same details as Google. ChatGPT's web answers are grounded in Bing's index, so this is the ChatGPT equivalent of the Google profile. Also add the site to Bing Webmaster Tools (import from Search Console) and confirm the IndexNow key is being verified (Webmaster Tools → IndexNow).
- **Apple Business Connect.** Same details again, for Apple Maps, Siri and Spotlight. Free, ten minutes.
- **Third-party mentions.** Assistants recommend what other sites mention, not what a site says about itself. Cheap, legitimate places for Penny's classes to be listed with the correct day, time and venue: the Carey Baptist Church and Leverstock Green Village Hall "what's on" pages, the BWY "find a teacher" directory (get the profile URL for `sameAs`), Dacorum Borough Council and Berkhamsted Town Council community listings, Berkhamsted Living / Dacorum Life, Nextdoor, a Facebook page, and Hertfordshire-wide class directories (e.g. Herts Sports Partnership). One accurate listing beats five vague ones.
- **Search Console.** The AI Overviews / AI Mode impressions view is rolling out under Performance (UK sites first). Check whether it has appeared; it is the only first-party measure of AI visibility Google offers.
- **Google Search Console:**
  - confirm `sitemap.xml` is submitted
  - request indexing for the four venue pages and the two topical pages
  - check the April duplicate/canonical warning. Paste a couple of example URLs into a session; it is most likely `/x/` and `/x/index.html` and harmless.

## Claude can do without input

- **Watch the first IndexNow run.** The workflow should print `IndexNow 200` (or `202` while Bing verifies the key). Anything else means the key file is not being served at the root.

- **Branded 1200×630 OG image** with the wordmark. Pages currently share `canal.jpg`, a venue card or `penny.jpg`.
- **Bump workflow actions to their current major versions.** `checkout`, `setup-python`, `setup-node` and `create-issue-from-file` all target Node 20, which GitHub is retiring. They still run for now.
- **Proposal: a visible closure notice.** A one-line "No classes 21 December to 3 January" near the schedule, driven by the same `closures.txt` data. Needs a yes before building.

---

## Done

- **11 Oct 2026.** LLM-search and SEO pass: `/daytime-yoga-hemel-hempstead/` intent page; Thursday "spaces available" notices on the home, Hemel and topical pages with `FAQPage` JSON-LD; plain-text timetable on the home page; site-wide footer links to every class page; `Event` schema given `@id`, `duration`, `audience`, `inLanguage`; `WebSite` node; `robots.txt` names the AI search crawlers; `llms.txt`; IndexNow workflow and key. Reasoning in `SEO-NOTES.md`.

- **11 Oct 2026.** Link checker repaired after six months of silent failure, and its 25 empty issues closed. Venue-page Event dates rotate again. `.github/closures.txt` added. Sitemap `lastmod` reset and no longer bumped by the bot. (`14ab0a7`)
- **11 Oct 2026.** "Next class" badge skips closures and shows the date after a break. (`2ee9fcf`)
- **11 Oct 2026.** Internal Markdown notes excluded from the published site via `_config.yml`. (`ca49d79`)
- **11 Oct 2026.** `claude/fix-housekeeping-workflows` merged into `main` (fast-forward to `ca49d79`).
- **11 Oct 2026.** Confirmed on the live site: `/SEO-NOTES.html`, `/SEO-NOTES.md`, `/CLAUDE.html` and `/CLAUDE.md` all return 404, and none of them appear in Google.
