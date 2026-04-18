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

## Cross-phase
- [ ] Lighthouse mobile run: Performance target 95+, Accessibility 100, Best Practices 100, SEO 100
- [ ] WebPageTest or Chrome perf panel: LCP < 2.0s on throttled 4G
- [ ] DevTools console clean (no JS errors) across all 4 pages
- [ ] Keyboard-only walkthrough of the home page works end to end (skip link → nav → hero CTAs → next-class → trust → class cards → map facades → FAQ → footer)
- [ ] Screen reader (VoiceOver / NVDA) announces next-class badge sensibly
- [ ] Print stylesheet still sensible (or add one if needed)
