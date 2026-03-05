---
name: UX improvements plan
overview: "Implement all identified UX recommendations across 5 phases: critical fixes, accessibility, interaction quality, responsive polish, and meta tags. All changes are confined to the three existing files: index.html, app.js, and style.css."
todos:
  - id: p1-geolocation
    content: "Phase 1.1: Replace auto-trigger geolocation with an explicit opt-in landing panel in initApp() - UPDATED: Input field first, then Geolocation button"
    status: completed
  - id: p1-modals
    content: "Phase 1.2: Add backdrop-click dismiss and Escape key handler to both modals, with focus management"
    status: completed
  - id: p1-layout
    content: "Phase 1.3: Move verdict section above forecast section in index.html; fix spacing in style.css"
    status: completed
  - id: p2-aria-buttons
    content: "Phase 2.1: Add aria-label to all icon-only header buttons; update dynamically on theme toggle"
    status: completed
  - id: p2-aria-modals
    content: "Phase 2.2: Add role=dialog, aria-modal, aria-labelledby to both modal-content divs"
    status: completed
  - id: p2-live-region
    content: "Phase 2.3: Add aria-live=polite to #main-content"
    status: completed
  - id: p2-colorblind
    content: "Phase 2.4: Add icon next to verdict text; set check/x icon in renderVerdict(); style in CSS"
    status: completed
  - id: p3-lang-reload
    content: "Phase 3.1: Cache weather data; re-render on language change without location.reload()"
    status: completed
  - id: p3-hover
    content: "Phase 3.2: Remove misleading hover transforms on verdict text and forecast cards"
    status: completed
  - id: p3-ios-bg
    content: "Phase 3.3: Replace background-attachment:fixed with body::before pseudo-element fix"
    status: completed
  - id: p3-modal-spinner
    content: "Phase 3.4: Add loading spinner inside location modal search button during fetch"
    status: completed
  - id: p3-about-btn
    content: "Phase 3.5: Add a visible info button in the header to trigger the About modal"
    status: completed
  - id: p4-grid-mobile
    content: "Phase 4.1: Change mobile forecast grid to repeat(4,1fr) to fix orphaned 7th card"
    status: completed
  - id: p4-tablet
    content: "Phase 4.2: Add @media (max-width: 820px) tablet breakpoint"
    status: completed
  - id: p4-algorithm-indicator
    content: "Phase 4.3: Mark first 3 forecast cards with in-algorithm class and a visual label"
    status: completed
  - id: p5-meta
    content: "Phase 5: Add inline SVG favicon and meta/OG tags to index.html"
    status: completed
isProject: false
---

# UX Improvements — MyćCzyNieMyć

All changes are confined to three files: `[index.html](index.html)`, `[app.js](app.js)`, `[style.css](style.css)`.

## Phase 1 — Critical Fixes

**1.1 Geolocation permission antipattern**

- Replace the immediate `getCurrentPosition()` call in `initApp()` with a landing panel (using the existing `#loader` element)
- Show two CTAs: "Use my location" (triggers geolocation) and "Enter city manually" (opens location modal)
- Geolocation only fires when the user explicitly clicks the button

**1.2 Modal UX — backdrop dismiss + Escape key**

- Add a `click` listener on `.modal-overlay` itself; close if `event.target === overlay`
- Add a `keydown` listener on `document` for `Escape` to close whichever modal is currently open
- On modal open: move focus to the first focusable element inside; on close: return focus to the trigger

**1.3 Invert layout order (verdict first)**

- In `index.html`: move `.verdict-section` above `.forecast-section`
- In `style.css`: remove `margin-top: 50px` from `.verdict-section`; re-tune spacing so forecast feels like supporting detail below the verdict

## Phase 2 — Accessibility

**2.1 Icon-only button labels**

- Add `aria-label` to `#change-location-btn`, `#lang-toggle-btn`, `#theme-toggle-btn`
- Update `aria-label` dynamically on theme toggle in `app.js` when state changes

**2.2 Modal ARIA attributes**

- Add `role="dialog"` and `aria-modal="true"` to both `.modal-content` divs in `index.html`
- Add matching `aria-labelledby` pointing to the modal's `<h2>`

**2.3 Live region for dynamic content**

- Add `aria-live="polite"` to `#main-content` in `index.html` so screen readers announce the verdict

**2.4 Color-blind safe verdict**

- Add an icon element next to `#main-verdict` in `index.html`
- In `renderVerdict()` in `app.js`: set `bi-check-circle-fill` for wash, `bi-x-circle-fill` for no-wash
- Style the icon to scale proportionally with the verdict text in `style.css`

## Phase 3 — Interaction Quality

**3.1 Eliminate page reload on language toggle**

- In `app.js`: cache `lat`, `lon`, and the `daily` API response in module-level variables after first fetch
- On language change: call `translateUI()`, then re-call `renderVerdict()` and `renderForecastCards()` with cached data — remove `location.reload()`

**3.2 Remove misleading hover states**

- `style.css`: remove `transform: scale(1.05)` from `.verdict-text:hover`
- `style.css`: replace `.forecast-card:hover` lift (`translateY(-8px)`) with a subtle border/glow that does not imply clickability

**3.3 Fix iOS Safari background**

- `style.css`: remove `background-attachment: fixed` from `body`
- Add a `body::before` pseudo-element with `position: fixed; inset: 0; z-index: -1` carrying the same gradient

**3.4 Loading state inside location modal**

- In `searchCity()` in `app.js`: disable the search button and show a CSS spinner while the fetch is pending; re-enable on completion
- Add a small `.spinner` animation to `style.css`

**3.5 Expose the About trigger clearly**

- `index.html`: add an `ⓘ` icon button in the header alongside the existing controls
- `app.js`: attach the `infoModal` open logic to this new button; keep the footer author link as a plain GitHub external link

## Phase 4 — Responsive & Visual Polish

**4.1 Fix mobile forecast grid orphan**

- `style.css` at `max-width: 600px`: change `repeat(3, 1fr)` to `repeat(4, 1fr)` → gives a clean 4+3 layout

**4.2 Add tablet breakpoint**

- `style.css`: add `@media (max-width: 820px)` reducing `.verdict-text` to `5rem` and tightening grid gaps

**4.3 Forecast algorithm boundary indicator**

- `app.js` in `renderForecastCards()`: add class `in-algorithm` to the first 3 cards
- `style.css`: style `in-algorithm` with a distinct top border or label ("Wpływa na wynik" / "Affects result") to visually explain the 3-day decision window

## Phase 5 — Meta & SEO

**5.1 Favicon**

- `index.html`: add `<link rel="icon" href="data:image/svg+xml,...">` using an inline SVG (car + droplet) — no new file needed

**5.2 Meta and Open Graph tags**

- `index.html`: add `<meta name="description">`, `og:title`, `og:description`, `og:url` tags

