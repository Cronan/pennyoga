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

## LLM search visibility (October 2026 review)

The question was how to get the site in front of people who ask Google (AI Overviews / AI Mode), ChatGPT or Claude for a gentle or local yoga class, and what the state of the art is for steering them to a particular class. Research was web-only; the live site could not be fetched from the session, so nothing below was measured against live rankings.

### What the engines actually use

- **Google AI Overviews and AI Mode** draw on the ordinary Search index plus the Google Business Profile and Maps data for local queries. Google's own guidance (Search Central, "AI features and your website") says there is no AI-specific optimisation: a page must be indexed and eligible for a snippet, and the normal SEO fundamentals apply. Structured data is not required for AI features and `llms.txt` is explicitly neither needed nor rewarded. The only measurement Google offers is the AI Overviews / AI Mode impressions view in Search Console, launched June 2026 and still rolling out (UK sites first). For a local business the Business Profile is the single largest input, which is why it heads the TODO list.
- **ChatGPT** grounds local answers in Bing's index and third-party listings and review sites. Several informal tests found it citing directories rather than the business's own site. The crawler that governs appearance in ChatGPT search is `OAI-SearchBot` (GPTBot is training only). Bing Places, Bing Webmaster Tools and IndexNow are the ChatGPT-side equivalents of the Google Business Profile and Search Console.
- **Claude** uses `Claude-SearchBot` for search grounding and `Claude-User` for user-requested fetches; `ClaudeBot` is training only. Anthropic recommends `llms.txt` in its agent guidance but there is no evidence it changes citation.
- **Perplexity and Gemini** behave more like Google: Gemini surfaces many more unique local businesses than ChatGPT because it reads Maps data directly.
- **Common thread.** Across vendor studies (Yext, SOCi, Uberall, BrightLocal; none independent, all directionally consistent), first-party sites and listings are cited in roughly equal measure, and assistants prefer pages that state facts plainly: who, where, when, how much, who it suits, and whether there is room. Marketing copy is skipped; a sentence that answers a question is quoted.

### What changed on the site

- **Plain facts, quotable.** A text timetable on the home page (day, time, venue, price, spaces), an "At a glance" summary in `llms.txt`, and FAQ answers that give the day, time, venue and price in a single sentence. The same answers are mirrored in `FAQPage` JSON-LD on the home, Hemel and daytime pages. Google no longer shows FAQ rich results for sites like this one, so the markup is for parsers, not for stars.
- **Availability stated outright.** "Spaces available" is the highest-intent phrase a prospective student can type, and nothing on the site said it. It now appears wherever Thursday is mentioned, tagged `data-availability` so it can be found and changed in one pass. See `CLAUDE.md` for the rule.
- **Schema tidy-up.** Each `Event` has a stable `@id` (`/classes/<venue>/#event`), `duration`, `inLanguage`, `isAccessibleForFree: false` and an `audience` that says the classes suit beginners and people in their 60s to 80s. A `WebSite` node ties pages together, `areaServed` names the villages people search from, and the contact page's entity points at the same `@id` as the home page. None of this is required for AI features; it removes ambiguity for anything that does parse it.
- **Crawlers.** `robots.txt` already allowed everything; it now names each AI search crawler so a future edit cannot block one by accident. `llms.txt` is cheap and harmless; expect nothing from it.
- **IndexNow.** A workflow pings Bing and friends with changed URLs on each content push. Google ignores it. The key file at the root is public by design.
- **Internal links.** Every page footer links to every class page. Until now the venue and topical pages were reachable only from cards on the home page, which weakened both crawl depth and the entity graph.

### Filling a particular class: the honest state of the art

There is no mechanism to "suggest a day" to an assistant. What works is making the class's page the clearest answer to the question that person would ask, and making sure the places assistants read agree with it:

1. One page per class, already in place. A second page for the same class is a near-duplicate and competes with the first; it was not built.
2. A page for the *intent* that matches the class. The Thursday class is a daytime class in central Hemel Hempstead, so `/daytime-yoga-hemel-hempstead/` answers "daytime / afternoon yoga Hemel Hempstead" and leads with Thursday. When Thursday fills, re-point the emphasis rather than deleting the page.
3. Say "spaces available" in words, on the home page, the class page, the intent page and in the FAQ schema. Keep it true.
4. Mirror it off-site: a Business Profile "Update" post, the venue's own what's-on page, a Nextdoor or Facebook post, each with the same day, time and venue. Assistants weigh agreement between sources.
5. Measure with Search Console (the AI impressions view when it appears) and by asking the assistants the questions a student would ask: "gentle yoga class Hemel Hempstead Thursday afternoon", "yoga for over 60s near Berkhamsted", "yoga classes with spaces in Hemel Hempstead". Repeat monthly; note which sources each one cites and go and fix those.

### Sources consulted

Google Search Central, "AI features and your website"; OpenAI developer docs on GPTBot / OAI-SearchBot / ChatGPT-User; Anthropic help centre article 8896518 on ClaudeBot, Claude-SearchBot and Claude-User; IndexNow documentation (indexnow.org, Yandex reference); schema.org `Schedule` / `eventSchedule`; Google Business Profile help on service-area businesses; vendor analyses from Whitespark, Yext, SOCi, Uberall, BrightLocal, SE Ranking (llms.txt adoption) and several agency write-ups on Search Console's AI performance report. Vendor numbers were treated as directional only.

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
