# PlantDb design system — "Botanical Editorial × Modern Research Museum"

Everything visual is driven by `src/styles/tokens.css` + `src/styles/base.css`.
No CSS framework, no component library, no webfont download, no animation library.

## 1. Palette (owner-locked)

| Token | Value | Use |
| --- | --- | --- |
| `--forest` | `#173d32` | primary surfaces, headings, hero |
| `--forest-deep` | `#0f2a22` | hero depth shapes, dark bands |
| `--ivory` | `#f6f3e9` | page background |
| `--ivory-warm` | `#fbf9f2` | tinted bands, meta panels |
| `--sage` | `#b9c99a` | accents on dark, plate art |
| `--sage-soft` | `#d8e0c6` | plate gradients |
| `--bronze` | `#c58d55` | primary action, small accents |
| `--bronze-deep` | `#9c6a37` | bronze text on light surfaces |

Derived text/line tokens are contrast-checked against ivory: `--ink` 13.6:1,
`--ink-soft` 6.6:1 (both WCAG AA at body size). `--muted` is AA-large only and is
therefore restricted to uppercase meta labels. Bronze is never used for body copy
— only for buttons (forest text/ivory text on bronze fill) and large accents.

## 2. Typography

| Token | Stack | Use |
| --- | --- | --- |
| `--font-display` | Iowan Old Style → Palatino → Georgia → serif | Latin display headings, numerals |
| `--font-thai-display` | Noto Serif Thai → Sarabun → Leelawadee UI → `--font-display` | Thai display headings |
| `--font-body` | system-ui → Segoe UI → Noto Sans Thai → Sarabun → Tahoma | body, UI |

**No webfont is downloaded.** Consequences: zero FOIT/FOUT, no layout shift from font
swapping (CLS contribution 0), and no third-party request. Scientific names are set in the
italic serif display stack with `lang="la"`; Thai/English/scientific names always occupy
distinct lines in the detail header so hierarchy never depends on font tricks.

Fluid scale `--step--1 … --step-5` (clamp-based) carries every heading level; Thai headings
get `line-height: 1.35` + `word-break: keep-all` so long Thai compounds do not break
mid-word, and `text-wrap: balance` balances short headings where supported.

## 3. Space, shape, layout

- 4px-root spacing scale: `--space-3xs … --space-2xl`
- radii: `--radius-s 6px`, `--radius-m 14px`, `--radius-l 28px`, `--radius-pill`
- `--shell: 1240px` content width, fluid `--gutter`, `--grid-gap` for grids
- grids are `repeat(auto-fit, minmax(min(100%, Xrem), 1fr))` → no breakpoint bookkeeping for cards
- two-column editorial splits only at `min-width: 62rem`

## 4. Components

| Component | Responsibility |
| --- | --- |
| `Header` | sticky nav, active state, locale switcher (right side), mobile sheet, skip-link target |
| `LocaleSwitcher` (inside Header) | TH/EN switch, preserves query string, keyboard accessible, `hreflang`-consistent labels |
| `BotanicalPlate` | deterministic inline-SVG botanical artwork seeded by slug — no photo, no broken image, no unapproved media |
| `ItemCard` | catalogue card: plate, Thai/common/scientific names, badges (demo, source-language fallback), category |
| `CategoryCard` | category navigation tile with item count |
| `Breadcrumbs` | locale-aware trail; research has no category routes so its labels are not links |
| `Explorer` | search + category filter chips + sort, client-side over an embedded index, `aria-live` result count, degrades to a full list without JS |
| `States` | empty / error / 404 experiences (real copy, not browser defaults) |
| `BaseLayout` | `lang`, canonical, hreflang (th/en/x-default), og tags, reveals, skip link |

## 5. Motion

- hover/focus transitions use `--dur-fast`/`--dur-mid` with `--ease-organic`
- scroll reveals are one `IntersectionObserver` on `.reveal` (no library)
- under `prefers-reduced-motion: reduce` **all** durations collapse to 1 ms and reveals are
  applied immediately (cards are visible by default; JS only removes them from a "not yet seen" state)

## 6. Accessibility baseline

Skip link → `#main`; one `h1` per page; landmarks (`header`/`nav`/`main`/`footer`);
every icon-only control has an `aria-label` from the dictionary; filter chips are
`aria-pressed` buttons; the search input has a real `<label>`; result count is `aria-live="polite"`;
focus-visible outlines are never removed; decorative SVG carries `aria-hidden`, meaningful
plates carry `role="img"` + `aria-label` naming the record.
