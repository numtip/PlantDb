# PlantDb C5 — Pre-Merge QA Matrix (PR #1)

**Verdict:** `READY_FOR_OWNER_MERGE_APPROVAL`
**Branch:** `feat/c5-bilingual-site` → **PR #1** https://github.com/numtip/PlantDb/pull/1
**Measured:** 2026-10-09, VPS 10.1.254.237, Astro 5 static build (62 pages: 31 th + 31 en)
**Touch nothing outside review:** production untouched · **no merge** · **no GitHub Pages** · **no default-branch change** · **no deploy**

Every row below was produced by a command in this repository. Where a number is a claim,
the command that regenerates it is named, and the raw evidence file is linked.

---

## 1. Matrix

| # | Gate | TH | EN | Desktop | Mobile | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Static build | ✓ | ✓ | — | — | **62 pages, 0 errors** | `npm run build` |
| 2 | Types / templates | ✓ | ✓ | — | — | **0 errors, 0 warnings** | `npx astro check` |
| 3 | UI dictionary parity | ✓ | ✓ | — | — | **119 = 119 keys, 0 orphans** | `npm run test:i18n` |
| 4 | Internal links | ✓ | ✓ | — | — | **2274 resolved, 0 broken** | `docs/evidence/qa-site.json` |
| 5 | Asset references | ✓ | ✓ | — | — | **188 resolved, 0 missing** | same |
| 6 | `lang` attribute | ✓ | ✓ | — | — | **62/62 correct** | same |
| 7 | Canonical URLs | ✓ | ✓ | — | — | **60/60 locale-correct** | same |
| 8 | hreflang (th / en / x-default) | ✓ | ✓ | — | — | **180 links, all absolute, all targets exist, self-referencing** | same |
| 9 | Route parity | ✓ | ✓ | — | — | **no TH-only / EN-only route** | same |
| 10 | Heading structure | ✓ | ✓ | — | — | **exactly one `<h1>`/page, no skipped levels** | same |
| 11 | Search / filter / sort | ✓ | ✓ | ✓ | ✓ | **9/9 cases in a real browser** | `npm run test:search` |
| 12 | Missing-translation policy | ✓ | ✓ | — | — | **both directions badge + record never hidden** | `docs/evidence/qa-site.json` → `fallback-directions` |
| 13 | Demo-data provenance | ✓ | ✓ | — | — | **26 detail pages show demo provenance; 0 migrated/legacy records** | same |
| 14 | Third-party URLs | ✓ | ✓ | — | — | **0 (own origin + 2 XML namespaces only)** | same → `no-third-party-urls` |
| 15 | Secrets | ✓ | ✓ | — | — | **0 in tree and in git history; GitHub secret-scanning alerts = []** | `gh api repos/numtip/PlantDb/secret-scanning/alerts` |
| 16 | Lighthouse Performance | ✓ | ✓ | ✓ | ✓ | **100 (min over 16 runs)** | `docs/evidence/lighthouse/summary.json` |
| 17 | Lighthouse Accessibility | ✓ | ✓ | ✓ | ✓ | **100 (min over 16 runs)** | same |
| 18 | Lighthouse Best Practices | ✓ | ✓ | ✓ | ✓ | **100 (min over 16 runs)** | same |
| 19 | Lighthouse SEO | ✓ | ✓ | ✓ | ✓ | **100 (min over 16 runs)** | same |
| 20 | Screenshot evidence | ✓ | ✓ | ✓ | ✓ | **23 captures at 1440 / 834 / 390 px** | `docs/screenshots/` (+ full set locally) |
| 21 | CI | ✓ | ✓ | — | — | **green: build+QA, search, Lighthouse jobs** | `gh pr checks 1` |
| 22 | Gate is load-bearing | — | — | — | — | **9/9 deliberate breakages detected, exit=1 each** | §4 mutation test |

## 2. Lighthouse detail (threshold 90, run 2026-10-09)

| run | form | perf | a11y | best-practices | seo |
| --- | --- | --- | --- | --- | --- |
| th-home | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| en-home | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| th-catalogue | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| en-catalogue | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| th-detail | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| en-detail | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| th-search | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| en-search | desktop / mobile | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |

Method: `node scripts/lighthouse.mjs --urls=full --threshold=90`. The script serves `dist/` under
the real Pages base path (`/PlantDb/`) so the measured page is the shipped page, runs Lighthouse
13.5 in headless Chromium, writes a trimmed report per run plus `summary.json` (committed) and the
full raw reports to `lighthouse-raw/` (kept locally, not committed), and exits non-zero if any
category in any run is below the threshold. The same gate runs in CI (`lighthouse` job).

## 3. Issues found by this gate and fixed

| # | Finding | Class | Fix |
| --- | --- | --- | --- |
| 1 | `--bronze-deep` `#9c6a37` on ivory = 4.18:1 — bronze button label, category counts, CTAs failed WCAG AA | accessibility | token darkened to `#8f5f2e` (4.92:1); one token fixed every bronze-on-light use |
| 2 | `--muted` `#66766c` = 4.33:1 — brand sub-label and meta labels failed | accessibility | darkened to `#5f6f65` (4.79:1) |
| 3 | badge text on the bronze badge tint = 4.3:1 | accessibility | new `--bronze-ink` `#7d5023` (5.44:1 on that tint) |
| 4 | footer eyebrow bronze on the dark forest band = 2.58:1 | accessibility | eyebrow on dark bands uses sage (6.79:1) |
| 5 | `label-content-name-mismatch`: brand link's accessible name did not contain its visible text | accessibility | accessible name now `PlantDb, Maejo University — <home>` |
| 6 | hreflang `href` values were root-relative — Lighthouse `hreflang` audit failed (SEO 91) | SEO | hreflang emitted as absolute URLs; SEO now 100 |
| 7 | heading order `h1 → h3` on catalogue/search pages (cards under the page title) | accessibility | `ItemCard` takes a heading level; grids use `h2` under the page `h1` |
| 8 | Gate blind spot: no assertion for heading order, third-party URLs, or demo provenance | process | three new assertions added to `scripts/qa-site.mjs` (mutation-tested) |

## 4. Gate verification (mutation test, project tree untouched)

Throw-away copy in `/tmp`, one deliberate breakage at a time:

| Injected defect | Gate result |
| --- | --- |
| broken internal link | exit=1 `internal-link` |
| wrong `lang` attribute | exit=1 `lang` |
| missing `hreflang="en"` | exit=1 `hreflang-missing` |
| canonical pointing elsewhere | exit=1 `canonical-value` |
| removed translation-fallback badge | exit=1 `fallback-badge` |
| `h1` renamed to `h2` | exit=1 `h1-count` |
| heading level jump `h1 → h4` | exit=1 `heading-order` |
| sitemap `<loc>` pointing nowhere | exit=1 `sitemap-loc` |
| missing asset (favicon) | exit=1 `internal-link` |
| broken locale-switch target | exit=1 `internal-link` |

Baseline (untouched copy): exit=0, 0 failures.

## 5. Remaining issues and known limits (nothing hidden)

1. **Lighthouse is measured on a locally served static build**, not on a CDN/Pages origin. Cold-cache mobile runs are the noisiest; the reported minimum is 100 across all 16 runs, but a future CI run on shared runners can legitimately report a point or two lower — the gate threshold is what protects merge decisions.
2. **No automated visual-regression (pixel) testing.** Visual QA is by screenshot review; a future design change must be re-reviewed by eye.
3. **No axe-core run beyond Lighthouse's accessibility category** (Lighthouse includes axe rules for its a11y audit set, but a standalone axe pass would cover more rules — upgrade path, not a blocker at these scores).
4. **Client-side search over an embedded index.** Fine for the 13 demo records and the ~166-record migrated catalogue; unproven at much larger scale.
5. **No JavaScript ⇒ unfiltered list.** All records remain visible and linked; only filtering/sorting is inactive.
6. **Demo catalogue is 13 synthetic records**, so search relevance ranking and facet usefulness are illustrative, not proven on real content.
7. **Repository housekeeping pending owner decision:** the repo was empty, so an empty `main` was created purely to allow a PR; the default branch is still `feat/c5-bilingual-site`.
8. **Real data not yet integrated.** This preview is static demo content; wiring the migrated dataset behind the localized content contract is the next phase and will require its own QA gate.

## 6. Reproduce everything

```bash
npm ci
node scripts/gen-routes.mjs
npx astro check                                  # 0 errors
npm run test:i18n                                # 119 = 119 keys
npm run build                                    # 62 pages
npm run qa                                       # 0 failures
npm run test:search                              # 9/9 (needs a static server, see scripts/shots.sh)
npm run lighthouse -- --urls=full --threshold=90 # 16 runs, all categories ≥ 90
npm run shots                                    # screenshot evidence
```

Independent verification (separate subagent, adversarial) and the Jev decision record are
appended in `docs/C5-REPORT.md` §5 and §6.
