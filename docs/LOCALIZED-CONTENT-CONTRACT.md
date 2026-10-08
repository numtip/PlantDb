# Localized content contract (TH/EN)

Status: **design-stage contract**. It defines what the future data layer (C4 Schema A +
a localized layer keyed by legacy item id) must supply, and what the UI guarantees today.

## 1. Shape

```ts
type Locale = 'th' | 'en';
type ReviewStatus = 'demo-placeholder' | 'unreviewed' | 'in-review' | 'approved';

interface LocalizedValue {
  value: string;
  reviewStatus: ReviewStatus;
  provenance: string;   // where this string came from (source field, translator, or fixture)
}

type LocalizedText = Record<Locale, LocalizedValue | null>;
```

Implemented in `src/i18n/localized-content.ts`; every localized field in `src/data/catalog.ts`
is a `LocalizedText`, so missing content is *representable* rather than invisible.

## 2. Resolution + fallback policy

`resolveLocalized(record, locale)` returns `{ text, sourceLocale, isFallback, isUnreviewed, provenance }`:

1. exact locale value exists → use it (no badge, unless `isUnreviewed`)
2. missing → fall back to the **source language** value, flagged `isFallback: true`
3. if every locale is missing → `null`; the UI renders an explicit "no data" label, never a blank box
   and never machine-generated text

Guarantees:
- a record is **never hidden** because a translation is missing
- fallback text is **labelled** in the UI ("⚠︎ no translation yet — showing original language"),
  so it can never be mistaken for an approved translation
- text marked `demo-placeholder`/`unreviewed` carries the demo badge
- `reviewStatus` and `provenance` travel with the value, so a future translation workflow
  (locale + review status + source provenance, as required for the migrated dataset) plugs in
  without touching components

## 3. What the migrated dataset must provide

For each item, keyed by the stable legacy id:

| Field | Rule |
| --- | --- |
| `id` | legacy item id, never rewritten |
| `locale` | `th` or `en` |
| `field` | the C4 field name (JSONB key) |
| `value` | the localized string |
| `review_status` | `source` (original legacy text) \| `in-review` \| `approved` |
| `provenance` | `legacy:<table>.<column>` for source text, or translator/reviewer reference |
| `raw_hash` | hash of the original legacy value this translation was derived from |

Rules inherited from C4 owner decisions:
- the original JSONB fields, UUIDs, raw values, publication states, category relations and
  provenance are **preserved unchanged**; translations are an additional layer, never an overwrite
- unpublished items (legacy 101/111) stay unpublished in both locales
- item 198 keeps its ZOO identity *and* its CMS-projection page
- the 27 `category_id=0` relations keep their `is_orphan_reference` flag in both locales
- no translation is invented: the pipeline may only carry text that exists in the snapshot,
  or text produced and reviewed by a named human

## 4. UI states that must exist for every localized field

| State | Rendering |
| --- | --- |
| translated, approved | value, no badge |
| source-language only | source text + `⚠︎ original-language` badge |
| not translated at all | explicit "no data" label (form, not blank) |
| demo/placeholder content | value + demo badge |
| Thai and English both present | Thai shown as primary name, English/common as secondary line |

`src/data/catalog.ts` deliberately ships one Thai-only record (`mungbean-thai-only`) and one
English-only record (`cover-crop-trial`) so **both** fallback directions are visible in review
instead of being a theoretical promise; the QA gate asserts that both badges render.
