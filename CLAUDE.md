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
├── classes/                # Per-venue landing pages
├── CNAME                   # pennyoga.co.uk
├── robots.txt
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
- `rotate-events.yml` — daily cron; rewrites Event `startDate`/`endDate` in `index.html` and per-venue pages so structured data always points at the next occurrence, and bumps `sitemap.xml` `lastmod` dates.
- `image-variants.yml` — on push to `main`; generates `.avif` and `.webp` siblings for any new/changed `.jpg` in `images/` using `sharp`.
- `link-check.yml` — weekly cron via `lychee`; opens an issue if external links break.

Workflows must never block local development or require contributors to install anything.

## CSS architecture

The stylesheet uses CSS Cascade Layers (`@layer reset, base, layout, components, utilities`). Design tokens are CSS custom properties defined in the base layer:
- Colours: sage (#7C9082), teal (#5B8A8A), cream (#F5F1EB), charcoal (#2D2D2D)
- Typography: system-ui font stack with fluid sizing via clamp()
- Spacing: xs-4xl scale

Modern features used: container queries, scroll-driven animations, color-mix(), view transitions. All have fallbacks.

## Conventions

- No runtime package manager for the site itself. Do not introduce npm/yarn dependencies the browser would need.
- Workflow scripts under `.github/` may use `npx`, `pip`, or shell tools — they run in CI only and never affect what's served.
- Keep `js/site.js` small and progressive-enhancement only. The site must work with JS disabled.
- British English (en-GB lang attribute set).
- Mobile-first, responsive. Hamburger nav at 768px via CSS checkbox hack.
- Accessibility: skip links, ARIA labels, focus-visible outlines, reduced-motion support.
- Semantic HTML with proper heading hierarchy.
- Lazy loading for images below the fold.

## Content details

- Four weekly classes: Monday Berkhamsted, Tuesday Hemel (x2), Thursday Hemel, plus Wednesday online via Zoom.
- Pablo memorial in footer (the family dog).

## What not to do

- Do not add analytics, cookies, or tracking. Privacy-first by design.
- Do not introduce a client-side framework (React/Vue/etc.) or a transpilation step for site code.
- Do not change the colour palette without checking contrast ratios.
- Do not add `Review` / `AggregateRating` JSON-LD for on-site testimonials — Google disallows self-served reviews and the site risks a manual action.

## Git

- Default branch: `main`.
- All commits authored by Ivan Cronyn, not Claude.
