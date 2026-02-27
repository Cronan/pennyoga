# Pennyoga — Gentle Yoga With Penny

Website for Penny Cronyn's yoga classes in Berkhamsted and Hemel Hempstead. Live at pennyoga.co.uk.

## Tech stack

GitHub Pages. Plain HTML + CSS. No framework, no JavaScript (except minimal fetch for the contact form), no build step. Domain via CNAME.

## Repository structure

```
pennyoga/
├── index.html              # Home page (classes, schedule, pricing)
├── about.html              # About Penny, qualifications, BWY credentials
├── contact.html            # Contact form (Formspree) + details
├── privacy-policy.html     # UK GDPR compliant
├── CNAME                   # pennyoga.co.uk
├── css/
│   └── style.css           # Single stylesheet (cascade layers, dark mode)
└── images/                 # Photos, logos, placeholders
```

## Development workflow

Edit HTML directly. Push to `main`. GitHub Pages deploys automatically. Preview locally by opening `index.html` in a browser.

## CSS architecture

The stylesheet uses CSS Cascade Layers (`@layer reset, base, layout, components, utilities`). Design tokens are CSS custom properties defined in the base layer:
- Colours: sage (#7C9082), teal (#5B8A8A), cream (#F5F1EB), charcoal (#2D2D2D)
- Typography: system-ui font stack with fluid sizing via clamp()
- Spacing: xs-4xl scale

Modern features used: container queries, scroll-driven animations, color-mix(), view transitions. All have fallbacks.

## Conventions

- No package manager. No dependency files. Do not introduce package.json or similar.
- No JavaScript unless functionally necessary (the contact form fetch is the only exception).
- British English (en-GB lang attribute set).
- Mobile-first, responsive. Hamburger nav at 768px via CSS checkbox hack.
- Accessibility: skip links, ARIA labels, focus-visible outlines, reduced-motion support.
- Semantic HTML with proper heading hierarchy.
- Lazy loading for images below the fold.

## Content details

- Four weekly classes: Monday Berkhamsted, Tuesday Hemel (x2), Thursday Hemel, plus Wednesday online via Zoom.
- Contact form uses Formspree (endpoint in contact.html).
- Pablo memorial in footer (the family dog).

## What not to do

- Do not add analytics, cookies, or tracking. Privacy-first by design.
- Do not add a build step. The previous one was deliberately removed.
- Do not change the colour palette without checking contrast ratios.

## Git

- Default branch: `main`.
- All commits authored by Ivan Cronyn, not Claude.
