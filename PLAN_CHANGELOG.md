# Plan Implementation Changelog

- Added opt-in start panel for location with two buttons: use geolocation or enter city manually.
- Removed automatic geolocation call on app start.
- Added modal close on backdrop click for both modals.
- Added Escape key support to close open modals.
- Added focus handling: focus moves into modal on open and returns to trigger on close.
- Moved verdict section above forecast section in the main layout.
- Adjusted spacing so verdict is primary and forecast is supporting content below.
- Added `aria-label` to header icon buttons.
- Added dynamic `aria-label` update for theme toggle.
- Added dialog accessibility attributes to both modals (`role`, `aria-modal`, `aria-labelledby`).
- Added `aria-live="polite"` to main dynamic content container.
- Added verdict icon next to verdict text for color-blind-friendly feedback.
- Added verdict icon state switching (check icon for wash, x icon for no-wash).
- Kept no-reload language switching with cached weather data.
- Removed misleading hover transform from verdict text.
- Replaced forecast card hover lift with subtle non-click-like hover feedback.
- Replaced `background-attachment: fixed` with iOS-safe fixed gradient via `body::before`.
- Added search button loading state and disabled behavior during city lookup.
- Added visible About button in header and wired it to the About modal.
- Updated mobile forecast grid to 4 columns at small screens.
- Added tablet breakpoint at `max-width: 820px`.
- Marked first three forecast cards as affecting the decision algorithm.
- Added visual label for cards that affect the decision.
- Added inline SVG favicon in `index.html`.
- Added standard meta description tag in `index.html`.
- Fixed startup runtime issue caused by early accessibility-label initialization order.
- Adjusted temperature display in forecast cards to have consistent font sizes for max and min temperatures, with max being bold.
- Corrected casing for all-caps sentences in `app.js` translations (e.g., "NIE MYĆ!" to "Nie myć!").
- Removed `text-transform: uppercase` from `.subtitle`, `.verdict-text`, and `.fc-algorithm-badge` classes in `style.css` to ensure proper casing.
- Switched main font from Outfit to Open Sans (Google Fonts) in `index.html` and `style.css`.

## Visual redesign and UI refinements

- Refactored `style.css` to a card-based design: design tokens (`--space-*`, `--radius-*`, colors), soft neutral background, subtle box-shadows, 16–24px rounded corners, improved typography hierarchy (large verdict, clear labels/values).
- Increased spacing scale and section gaps (e.g. app-container and main-content use `gap: var(--space-xl)`), more padding in verdict and forecast cards for clearer vertical rhythm.
- Removed all-caps styling: no `text-transform: uppercase` on verdict subtitle or algorithm badge; copy displays in normal case from translations.
- Set verdict reason text (`#verdict-reason`) to same size as subtitle (`0.875rem`) so it reads as secondary to the main verdict.
- Location header: reduced rounded corners from pill (`999px`) to `var(--radius-md)` (16px).
- Removed blue top border from forecast cards that affect the algorithm (`.forecast-card.in-algorithm`); kept subtle gradient background for distinction.

## Verdict, palette, and loader UX (final)

- **Verdict:** Emoji-only verdict display: 🧼 Myć / 🙅🏻‍♂️ Nie myć (PL), 🧼 Wash / 🙅🏻‍♂️ Don't wash (EN). Removed the separate Bootstrap verdict icon; only emoji + copy shown. Verdict subtitle: normal case, `line-height: 1.5`, color aligned with forecast subtitle (`--text-main`). Forecast section subtitle matches verdict subtitle size (0.875rem) and weight (600).
- **Color palette:** Green `#1dbd88`, red `#dc4a41`, main blue `#2F6FFC` with variations (`--blue-light`, `--blue-lighter`, alpha tokens). Light mode accent `#2560e0`. Wash/no-wash glows use the new green/red.
- **Forecast cards:** “Wpływa na wynik” replaced by eye-fill icon in top-right with tooltip; 8px gap between cards; hover/transition removed (static, non-interactive).
- **Loader:** Divider “lub” / “or”: normal case, 0.75rem, bold. “Use my location” button: blue gradient (main → light), 8px taller, normal font weight; hover = solid main blue, no movement; `transition: none` to avoid blink.