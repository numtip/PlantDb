# C5 — Premium Botanical Digital Experience (TH/EN): report

**Phase:** C5 (design + implementation preview) · **Status:** COMPLETE, awaiting owner review
**Branch/PR:** `feat/c5-bilingual-site` → https://github.com/numtip/PlantDb/pull/1 — **not merged, GitHub Pages NOT activated**
**Executor:** Hermes Agent on VPS 10.1.254.237 · **Decision partner:** Jev (TypeSafe System One)
**Production:** untouched (no access, no writes, no deployment)

---

## 1. Deliverables

| Required | Delivered |
| --- | --- |
| Working Astro + TypeScript website | 62 pages (31 TH + 31 EN), `astro build` clean, `astro check` 0 errors |
| Design system + component library | `src/styles/tokens.css`, `src/styles/base.css`, `docs/DESIGN-SYSTEM.md`; 9 components (Header, Footer, BotanicalPlate, ItemCard, CategoryCard, Breadcrumbs, Explorer, States, BaseLayout) |
| Premium homepage | Cinematic hero with prominent search, editorial asymmetry, three collection bands, research band |
| Catalogue + detail pages | Plant / animal / research catalogues, 11 category pages, 13 detail pages — each in TH and EN |
| Public-safe demo content | 13 synthetic records in `src/data/catalog.ts` (no production values, no credentials, no media) |
| Screenshot evidence | 23 captures at 1440 / 834 / 390 px, both locales (`docs/screenshots/` = curated 8; full set kept locally) |
| Automated QA + independent review | `scripts/qa-site.mjs`, `scripts/test-i18n.mjs`, `scripts/test-search.mjs`, CI workflow, independent subagent review |
| `C5-REPORT.md` with design QA verdict | this document |
| GitHub PR for owner review | PR #1 (open, mergeable, CI attached) |
| TH/EN bilingual (mandatory directive) | typed dictionaries, locale routing `/PlantDb/` + `/PlantDb/en/`, switcher with query preservation, hreflang + sitemap, localized content contract |
| `i18n test report` | `docs/i18n-test-report.md` |
| `Localized content contract` | `docs/LOCALIZED-CONTENT-CONTRACT.md` |

## 2. Design direction

"Botanical Editorial × Modern Research Museum": owner-locked palette (forest `#173d32`,
ivory `#f6f3e9`, sage `#b9c99a`, bronze `#c58d55`), editorial serif display with Thai-first
body stacks, spacious asymmetric grids, large generated botanical plates, subtle organic
hero shapes. **No webfont downloads, no CSS framework, no animation library** — the entire
runtime dependency set is Astro itself.

Motion: hover/press transitions plus one `IntersectionObserver` scroll reveal; everything
collapses to 1 ms under `prefers-reduced-motion: reduce`. Placeholder artwork is generated
inline SVG seeded per record, so no image can be broken or unlicensed.

## 3. Functional QA — PASS (machine-checked, reproducible)

`node scripts/qa-site.mjs` against the built site:

| Check | Result |
| --- | --- |
| Pages | 62 (31 th + 31 en); 60 indexable, 2 `noindex` error pages |
| Internal links | **2274 resolved, 0 broken** |
| Asset references | **188 resolved, 0 missing** |
| `lang` attribute per locale | 62/62 correct |
| `canonical` (locale-correct) | 60/60 |
| `hreflang` th/en/x-default, self-referencing, targets exist | **180 links asserted, 0 failures** |
| Route parity TH ↔ EN | identical sets, no TH-only / EN-only routes |
| Untranslated UI (raw dictionary keys, `undefined`, unresolved `{}` placeholders) | 0 |
| Exactly one `<h1>` per page | 62/62 |
| Fallback policy exercised in both directions | asserted (see §5) |
| `sitemap.xml` | 30 URLs × 3 alternates, every `<loc>` resolves |

Other gates:

| Gate | Result | Command |
| --- | --- | --- |
| Types/templates | 0 errors, 0 warnings | `npx astro check` |
| TH/EN dictionary parity | 119 / 119 keys | `npm run test:i18n` |
| Search, real browser, both locales | **9/9 cases PASS** (Thai/English/scientific names, cross-locale, empty state) | `npm run test:search` |
| Build | 62 pages, no errors | `npm run build` |

## 4. Design QA — visual review by the executor

Reviewed at 1440 / 834 / 390 px in both locales. Verdict: **PASS**.

- Homepage reads as a botanical editorial/museum experience, not a dashboard: full-bleed
  forest hero, serif display type, generated plates, ivory editorial bands.
- Hierarchy is consistent across pages; catalogue and detail pages share one visual language
  while animals/research keep distinct accents.
- Thai display typography: headings now break **only between phrases** — the first build broke
  Thai mid-word (`พันธุ์|พืช`, `มุม|มอง`) because browsers apply no Thai word rules. Fixed by
  rendering each dictionary phrase as a non-breaking span plus a Thai-specific size clamp;
  re-verified on desktop and mobile screenshots.
- No horizontal overflow, no clipping, no unstyled elements, no broken image anywhere.
- Search, filters, sorting and the language switcher work in both locales (proven by
  `test-search.mjs`, which drives the real page in a browser, not just the source).

Defects found during review and fixed: (a) a stray "items" chip on detail pages, (b) the Thai
mid-word headline breaks, (c) a Thai query returning 0 results on an English page, (d) below-the-fold
panels captured faded because the scroll reveal had not fired (screenshot harness now forces
reduced motion), (e) 404 pages had no `<h1>`.

## 5. Independent review (separate subagent, adversarial)

An independent subagent re-derived everything from `dist/` and `src/` with its own scripts,
trusting neither this report nor the QA script, and mutation-tested the gate on a throw-away
copy (breaking a route, a canonical, an hreflang target, a link and a sitemap alternate — all
five caused non-zero exits).

**Verdict: `PASS_WITH_FLAGS`.** Findings and their disposition:

| Finding | Verified by me | Action |
| --- | --- | --- |
| 404 pages contained 0 `<h1>` (States rendered `<h2>`) | confirmed | **fixed** — `States` accepts a heading level; 404 renders `<h1>`; gate now asserts one `<h1>` per page |
| `package.json` scripts `qa` / `shots` pointed at files that do not exist | confirmed | **fixed** — now `scripts/qa-site.mjs` / `scripts/shots.sh`, plus `test:i18n`, `test:search`, `routes` |
| Claim that the demo shipped an English-only record was unsupported (only a Thai-only record existed) | confirmed — the reverse fallback was never exercised | **fixed** — added `research/cover-crop-trial` (English-only) and a gate assertion that **both** fallback directions render the source-language badge |
| Screenshots captured below-the-fold panels faded (scroll reveal not yet fired) | confirmed | **fixed** — capture harness now forces reduced motion (also proves that path works) |
| Thai example word in the English search placeholder could look untranslated | confirmed intentional | **documented** in `docs/i18n-test-report.md §8` |

The reviewer's own scratch checks produced two false positives first (a stylesheet filename
`about.DGGykndp.css` read as a leaked dictionary key, and hreflang targets checked without
stripping the base path); it corrected both itself and the corrected checks agree with the
shipped gate.

## 6. Jev decision gates

| Gate | Question | Choice | Confidence | Probabilities |
| --- | --- | --- | --- | --- |
| C5 architecture / implementation risk (pre-PR) | send to owner as a PR for review vs fix first vs reject | `approve_for_pr` | 0.52 | approve 0.68 · hold 0.32 · reject 0.00 |
| Repo bootstrap | the target repo was empty (no base branch ⇒ no PR possible) | `bootstrap_empty_main_then_open_pr` | 0.46 | bootstrap 0.64 · ask owner first 0.24 · branch-only 0.12 |

Both confidences are **below the 0.60 threshold**, so per project rules Jev's advice is recorded
as *not decisive*: I treated the low-risk, content-free action (creating an empty `main` so a PR
can exist) as acceptable, and did **not** merge anything or change Pages settings. Evidence for
each gate is in the vault under `40-Decisions/` (`2026-10-09-jev-ask-plantdb-c5-*`).

Owner still to decide: accept the design, merge the PR, enable GitHub Pages (and whether to
switch the repository default branch from `feat/c5-bilingual-site` back to `main`).

## 7. Bilingual directive compliance

All seven acceptance points pass and are machine-asserted — see `docs/i18n-test-report.md`:
all public routes exist in TH and EN; no untranslated UI labels; no broken locale links; correct
canonical/hreflang pairs; search works with Thai, English and scientific names; missing
translations handled transparently (both directions, badge, record never hidden); no fabricated
botanical translations; both locales pass functional and visual QA.

## 8. Safety and data rules

- No production access of any kind; no database, no SSH to the legacy host, no deployment.
- No production records, credentials, secrets or unapproved media in the repo (scanned).
- G2/C3/C4 frozen evidence was used only as a private reference; no raw snapshot data was copied.
- All four owner decisions from C4 remain untouched (they concern the future data layer, which C5 does not implement).
- Public-safe demo fixtures only: 13 synthetic records using widely known species names, all text written for design review and flagged `demo-placeholder` in the UI.

## 9. Known limits (stated, not hidden)

1. **Lighthouse not measured** locally and not wired into CI — the ≥90 targets are therefore **not yet evidenced**. Recommended next step: add Lighthouse CI on the gated preview build.
2. Client-side search over an embedded index: fine for the demo set and the ~166-record migrated catalogue, unproven at much larger scale.
3. No pixel/visual-regression automation; visual QA is by screenshot review.
4. Without JavaScript the catalogue degrades to an unfiltered list (all records still visible, no filtering).
5. The demo catalogue is 13 records, so relevance ranking and facet behaviour are illustrative only.
6. The stack (Astro + PostgreSQL Schema A) was approved by the owner in the C5 directive, but the C4-era Jev confidence for that stack was only 0.49 — if that is revisited, only the data layer is affected, not this front end.

## 10. Recommended next step

Owner review of PR #1 → design acceptance → then (a) wire Lighthouse CI against the gated
preview, (b) integrate the real migrated dataset behind the localized content contract,
(c) activate Pages only after explicit approval.
