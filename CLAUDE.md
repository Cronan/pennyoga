# Pennyoga — Gentle Yoga With Penny

Website for Penny Cronyn's yoga classes in Berkhamsted and Hemel Hempstead. Live at pennyoga.co.uk.

## Tech stack

GitHub Pages. Plain HTML + CSS. No framework, minimal hand-written JavaScript (see `js/site.js`). Domain via CNAME. The site itself ships exactly as authored — no transpilation, no bundling. GitHub Actions may run housekeeping tasks (date rotation, image variants, link checks) but must not require local tooling to develop or preview the site.

## Repository structure

```
pennyoga/
├── index.html              # Home page (classes, schedule, pricing)
├── about.html              # About Penny, qualifications, BWY credentials
├── contact.html            # Contact details
├── privacy-policy.html     # UK GDPR compliant
├── 404.html                # Custom not-found page
├── classes/                # Per-venue landing pages (Berkhamsted, Leverstock Green, Hemel Hempstead, Online)
├── daytime-yoga-hemel-hempstead/  # Intent page: Tuesday + Thursday daytime classes; leads with whichever has spaces
├── yoga-for-over-60s/      # Topical landing page
├── yoga-for-stiff-backs/   # Topical landing page
├── TODO.md                 # The outstanding-work list (internal, not published)
├── SEO-NOTES.md            # Background and reasoning for SEO work (internal, not published)
├── _config.yml             # Jekyll exclude list that keeps internal .md files off the site
├── CNAME                   # pennyoga.co.uk
├── robots.txt              # Allows everything; names the AI search crawlers explicitly
├── llms.txt                # Plain-text summary of the business and page list for AI agents
├── <32 hex chars>.txt      # IndexNow key file (public by design; see indexnow.yml)
├── sitemap.xml
├── css/
│   └── style.css           # Single stylesheet (cascade layers, dark mode)
├── js/
│   └── site.js             # Back-to-top, map facade, next-class badge, sticky CTA
├── images/                 # Photos, logos, placeholders (JPG + AVIF + WebP)
└── .github/workflows/      # CI housekeeping (see below)
```

## Development workflow

Edit HTML directly. Push to `main`. GitHub Pages deploys automatically. Preview locally by opening `index.html` in a browser — no install step required.

## GitHub Actions

CI is allowed for housekeeping that would otherwise rot or be tedious. Current workflows:
- `rotate-events.yml` — daily cron (and on any push that edits `.github/closures.txt`); rewrites Event `startDate`/`endDate` in `index.html` and `classes/*/index.html` so structured data always points at the next class Penny is actually teaching. Dates listed in `.github/closures.txt` (holidays, term breaks) are skipped, and the same list is copied into the `#class-closures` block in `index.html` so the next-class badge in `js/site.js` skips them too. Edit `closures.txt`, never the block. It does not touch `sitemap.xml`: update a page's `lastmod` by hand when its content genuinely changes.
- `image-variants.yml` — on push to `main`; generates `.avif` and `.webp` siblings for any new/changed `.jpg` in `images/` using `sharp`.
- `link-check.yml` — weekly cron via `lychee`; keeps a single open issue updated while links are broken and closes it when they recover. If lychee itself fails to run, the job goes red rather than filing an issue.
- `indexnow.yml` — on push to `main` that changes HTML, `sitemap.xml` or `llms.txt`; POSTs the changed URLs to IndexNow (Bing, Yandex and friends; Google ignores it). Skips the bot's own commits. The key file at the repo root must keep its name equal to its contents.

Workflows must never block local development or require contributors to install anything.

## CSS architecture

The stylesheet uses CSS Cascade Layers (`@layer reset, base, layout, components, utilities`). Design tokens are CSS custom properties defined in the base layer:
- Colours: sage (#7C9082), teal (#5B8A8A), cream (#F5F1EB), charcoal (#2D2D2D)
- Typography: system-ui font stack with fluid sizing via clamp()
- Spacing: xs-4xl scale

Modern features used: container queries, scroll-driven animations, color-mix(), view transitions. All have fallbacks.

The reset zeroes all element margins, so body prose needs an opt-in wrapper for heading rhythm:
- `.page-intro` — flex-column with gap, wraps the eyebrow + H1 + lead paragraph on non-home pages.
- `.page-content` — applied to the main `.container` on non-home pages to restore `h2`/`h3`/`p`/`ul`/`ol`/`li` margins via direct-child selectors (so it doesn't touch `.page-intro` or `.cta-section` children).
- `.prose` — equivalent rhythm for the privacy-policy; also underlines anchors, so not suitable where CTA buttons appear.

## Conventions

- No runtime package manager for the site itself. Do not introduce npm/yarn dependencies the browser would need.
- Workflow scripts under `.github/` may use `npx`, `pip`, or shell tools — they run in CI only and never affect what's served.
- Keep `js/site.js` small and progressive-enhancement only. The site must work with JS disabled.
- British English (en-GB lang attribute set).
- Mobile-first, responsive. Hamburger nav at 768px via CSS checkbox hack.
- Accessibility: skip links, ARIA labels, focus-visible outlines, reduced-motion support.
- Semantic HTML with proper heading hierarchy.
- Lazy loading for images below the fold.
- GitHub Pages runs Jekyll, which publishes any Markdown file as a page. Internal notes (`CLAUDE.md`, `TODO.md`, `SEO-NOTES.md`) are listed under `exclude` in `_config.yml`; add any new non-site file there too. Outstanding work goes in `TODO.md`.

## Content details

- Four weekly classes: Monday Berkhamsted, Tuesday Hemel (x2), Thursday Hemel, plus Wednesday online via Zoom.
- Pablo memorial in footer (the family dog).
- Every page footer carries a "Classes" column linking the four venue pages, the daytime page and the two topical pages. Keep it identical across pages.

## Availability notices (which class is being filled)

The site says in plain words which class is taking new students, because that is what people ask search engines and assistants ("yoga class near me with spaces"). It is hand-maintained, not automated:

- Every notice carries `data-availability="<weekday>"`. `grep -rn 'data-availability' --include=*.html` lists all of them: the home-page strip, Thursday card badge and FAQ answer, the home and daytime timetables, the venue-page notice and FAQ, and the "Where and when" lists on the topical pages. The matching `FAQPage` JSON-LD answers and the Hemel meta description say the same thing in prose.
- When the class fills, or a different class needs students, update every notice in one commit (move the attribute, or delete the notices) and bump `lastmod` for the pages touched. Stale "spaces available" copy costs more trust than no notice at all.
- The daytime page (`/daytime-yoga-hemel-hempstead/`) is the intent page for "afternoon / daytime yoga in Hemel Hempstead". It leads with whichever daytime class has room. Do not create a second page for a class that already has a venue page; a near-duplicate competes with the original.

## What not to do

- Do not add analytics, cookies, or tracking. Privacy-first by design.
- Do not introduce a client-side framework (React/Vue/etc.) or a transpilation step for site code.
- Do not change the colour palette without checking contrast ratios.
- Do not add `Review` / `AggregateRating` JSON-LD for on-site testimonials — Google disallows self-served reviews and the site risks a manual action.
- Do not remove the `google-site-verification` meta tag from `index.html` — Google periodically re-verifies and will revoke access if the tag disappears.
- Do not make therapeutic, medical or health-benefit claims about Penny's classes (e.g. "improves bone density", "reduces falls risk", "eases back pain"). Penny does not make these claims herself; the site describes what a class **is**, not what it **does** for you. When writing about yoga for older students or anyone with a condition, steer readers to a GP or physiotherapist first.

## Git

- Default branch: `main`.
- All commits authored by Ivan Cronyn, not Claude.
