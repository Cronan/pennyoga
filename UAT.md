# UAT checks — redesign branch

Things to verify after the branch is merged to `main`. Revert is always an option.

---

## Phase 1 — foundations (commit `65ad6c8`)

### Visual
- [ ] Fraunces loads and renders on headings (h1–h4) across all 4 pages (home, about, contact, privacy)
- [ ] Body copy still in system-ui, not accidentally serif
- [ ] H1 size, weight, and letter-spacing feel right alongside existing spacing
- [ ] Fluid type scale reads well at 320px, 768px, 1440px viewports
- [ ] Light mode palette unchanged at a glance
- [ ] Dark mode: warm "candlelit" charcoal rather than cool green-grey; sage text brighter and readable on dark bg
- [ ] No FOIT (invisible text) while Fraunces loads — should fall back to Georgia briefly, not a blank space

### Language queries
_(none)_

### Compatibility
- [ ] Fraunces `SOFT` axis honoured on modern Safari/Chrome/Firefox (harmless if ignored)
- [ ] `font-optical-sizing: auto` honoured; text at hero size shouldn't look over-thin

---

## Phase 2a — map facade (commit `355ea9a`)

### Visual
- [ ] All 4 class cards show the styled placeholder: sage radial gradient, earth pin icon, venue name, "Show map" pill
- [ ] Placeholder matches previous iframe height (180px) — no layout shift
- [ ] Focus ring visible when tabbing onto the "Show map" button
- [ ] Placeholder reads well in dark mode

### Interaction
- [ ] Clicking "Show map" replaces the placeholder with the Google Maps iframe in place
- [ ] Loaded iframe shows the correct venue
- [ ] Keyboard activation (Enter / Space) works on the facade button
- [ ] DevTools Network tab shows zero requests to `maps.google.com` or `gstatic.com` until click

### Language queries
_(none)_

---

## Phase 2b — hero + next-class + sticky CTA (commit `edd3629`)

### Visual — hero
- [ ] Eyebrow "BWY QUALIFIED · SINCE 2004" renders above H1 in teal, small caps
- [ ] H1 reads "Gentle Yoga in Berkhamsted & Hemel Hempstead" (note: "Classes" removed)
- [ ] Hero grid on desktop: text column wider than image column (3fr / 2fr)
- [ ] Canal image has `border-radius: var(--radius-xl)` and soft shadow
- [ ] Subtle radial tints on hero background (teal top-right, earth bottom-left) — visible but quiet
- [ ] Trust strip at the bottom of the hero content: 4 items with sage icons, hairline border above

### Visual — next-class badge
- [ ] Badge appears after JS runs (pill shape, pulsing sage dot, label + time + venue)
- [ ] At class time, label switches to "HAPPENING NOW"
- [ ] Pulse animation is subtle, not distracting
- [ ] Animation stops entirely when `prefers-reduced-motion: reduce` is set
- [ ] Correct day/time for the current Europe/London weekday (e.g. if viewed Sunday evening, should show Monday)

### Visual — sticky CTA
- [ ] On mobile (<768px), slides in from bottom after scrolling past the hero
- [ ] Retracts near the footer (no overlap with footer content)
- [ ] Back-to-top hides itself when sticky CTA is visible
- [ ] Hidden entirely on desktop (≥768px)
- [ ] `backdrop-filter: blur()` renders on Safari iOS and desktop
- [ ] Respects iPhone safe-area inset (no buttons under the home-bar)
- [ ] Two buttons read clearly in dark mode

### Interaction
- [ ] "Book a trial class" primary button opens email client with pre-filled subject AND body
- [ ] "Call 07958 616470" secondary button triggers dialer on mobile
- [ ] Sticky CTA "Book a trial" and "Call" work the same way on mobile
- [ ] Pulse dot animation stops with reduced motion

### Language queries for Penny
- [ ] **Primary CTA wording**: "Book a trial class" — OK, or prefer something softer (e.g. "Try a class", "Arrange a trial")?
- [ ] **Pre-filled email body**: "Hi Penny, I'd like to book a trial class. Could you let me know what's available? Thanks" — voice check
- [ ] **Eyebrow text**: "BWY QUALIFIED · SINCE 2004" — OK or prefer "Qualified BWY teacher since 2004" / similar?
- [ ] **H1 change**: dropped "Classes" from "Gentle Yoga Classes..." — does "Gentle Yoga in Berkhamsted & Hemel Hempstead" still feel right?
- [ ] **Trust strip wording**: "20+ years teaching" — or prefer "Teaching since 2004" / exact count?
- [ ] **Sticky CTA primary label**: "Book a trial" (shortened for mobile) — OK?

### Compatibility
- [ ] `:has()` selector for back-to-top hide — Safari 15.4+, Chrome 105+, FF 121+. Older browsers: both buttons may briefly overlap (minor)
- [ ] `backdrop-filter` fallback — Firefox <103 without `-webkit-` will show solid surface instead of blur (acceptable)
- [ ] `fetchpriority="high"` on hero image — Chrome 101+, FF 132+, Safari 17.2+. Ignored gracefully elsewhere
- [ ] `env(safe-area-inset-bottom)` respected on iPhone

---

## Phase 3 — class cards, "Your first class", FAQ disclosure

### Visual
- [ ] Wednesday online card now has the `pablo-on-mat.jpg` image (ties neatly to the "dogs and cats optional" line in the notes)
- [ ] All 4 class cards now have consistent image + content layout
- [ ] Class schedule subheading mentions trial availability
- [ ] "Your first class" section renders between the class grid and the FAQ
- [ ] Four reassurance items with sage circular icon + heading + short paragraph; 2-column grid on tablet+, single column on mobile
- [ ] Cream (alt) background on "Your first class" gives it a warm, reassuring feel — sits well between the plain class grid and the plain FAQ
- [ ] FAQ items now render as collapsed `<details>` cards (chevron visible on the right, hidden default triangle)
- [ ] Clicking a question expands it; chevron rotates 180deg
- [ ] Multiple questions can be open at once
- [ ] Open item shows a subtle shadow to indicate state
- [ ] Hover on the question shows a soft sage tint

### Interaction
- [ ] `<details>`/`<summary>` keyboard works (Tab + Enter/Space)
- [ ] Screen reader announces "expanded"/"collapsed" state
- [ ] JSON-LD `FAQPage` schema still serializes correctly (view-source check)

### Language queries for Penny
- [ ] **"Your first class" section copy**: voice check on the four reassurances
  - "Arrive a few minutes early — Settle in with your mat and meet the group at your own pace. No need to introduce yourself if you'd rather not."
  - "Wear whatever feels comfortable — No special yoga kit is needed. Loose, comfortable clothes you can move in are perfect. Bare feet or socks, whichever you prefer."
  - "Modifications for every movement — If a pose doesn't suit your body today, I'll offer an alternative. You'll always work within your own range of movement."
  - "We end with a proper rest — Every class finishes with a guided relaxation, usually ten to fifteen minutes. Bring a blanket if you have one — you'll want it."
- [ ] **Classes subheading**: "Weekly classes in Berkhamsted and Hemel Hempstead, plus a Wednesday evening session online. New here? You're welcome to start with a one-off trial before committing to a block booking." — OK or tighten?
- [ ] **Pablo-on-mat image** on the Wednesday online card — OK, or prefer something more generic/professional for online?

### Compatibility
- [ ] `<details>`/`<summary>` — universal support, no fallback needed
- [ ] `::marker` content override for Firefox — check triangle is hidden
- [ ] SVG mask chevron — Safari 14+, Chrome 84+, FF 53+; if unsupported the chevron simply won't show (content is still clickable via the entire summary)

## Testimonials — collection checklist for Penny

The testimonials block is designed and styled but still commented out in `index.html` (look for `TODO: Add real testimonials`). To activate it, Penny needs to collect real quotes.

For each testimonial, collect:
- [ ] First name only, or initial + location ("Sarah B, Berkhamsted" / "Long-term student, Hemel") — GDPR-safe
- [ ] One or two sentences, Penny's choice of phrasing-as-is or lightly tidied
- [ ] Approximate duration as a student ("since 2018" / "joined last year")
- [ ] **Explicit written consent** to use their words publicly on `pennyoga.co.uk`
- [ ] Mix of voices: at least one in-person, one online, one beginner/returner

Aim for 3 quotes minimum (the design assumes 3 in a row on desktop).
Once collected, uncomment the `<section>` in `index.html` and replace the placeholder quotes.

---

## Cross-phase
- [ ] Lighthouse mobile run: Performance target 95+, Accessibility 100, Best Practices 100, SEO 100
- [ ] WebPageTest or Chrome perf panel: LCP < 2.0s on throttled 4G
- [ ] DevTools console clean (no JS errors) across all 4 pages
- [ ] Keyboard-only walkthrough of the home page works end to end (skip link → nav → hero CTAs → next-class → trust → class cards → map facades → FAQ → footer)
- [ ] Screen reader (VoiceOver / NVDA) announces next-class badge sensibly
- [ ] Print stylesheet still sensible (or add one if needed)
