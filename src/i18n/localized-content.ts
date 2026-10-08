/**
 * PlantDb — localized content contract.
 *
 * Every localized value on this site is wrapped in a `LocalizedRecord` so the UI can
 * always tell (a) which locale it is looking at, (b) whether a human reviewed it, and
 * (c) what the original language was. This is what stops an unreviewed string from
 * being presented as an approved translation.
 *
 * Fallback policy (owner directive §3):
 *   1. If the requested locale exists and is reviewed  -> show it, no badge.
 *   2. If the requested locale exists but is unreviewed -> show it, badge "demo content".
 *   3. If the requested locale is absent                -> show the source language value,
 *      badge "no translation yet — showing the original". The record is NEVER hidden.
 *   4. If nothing exists at all                          -> the UI renders an explicit
 *      empty state; we never fabricate text.
 */
import type { Locale } from './ui';

export type ReviewStatus =
  | 'approved'          // human-reviewed translation (owner/Design Director approved)
  | 'source'            // original language as captured from the source record
  | 'demo-placeholder'; // synthetic text written for the design preview

export type LocalizedRecord = {
  readonly value: string;
  readonly locale: Locale;
  readonly reviewStatus: ReviewStatus;
  /** Where this text came from, e.g. "demo-fixture" or "legacy:item:214:th". */
  readonly provenance: string;
};

export type LocalizedText = Partial<Record<Locale, LocalizedRecord>>;

export type ResolvedText = {
  text: string;
  /** true when the shown text is not in the requested locale */
  isFallback: boolean;
  /** true when the shown text has not been human-reviewed */
  isUnreviewed: boolean;
  shownLocale: Locale;
};

export const SOURCE_LOCALE: Locale = 'th';

export function makeLocalized(
  value: string,
  locale: Locale,
  provenance: string,
  reviewStatus: ReviewStatus = 'demo-placeholder',
): LocalizedRecord {
  return { value, locale, provenance, reviewStatus };
}

export function resolveLocalized(
  text: LocalizedText | undefined,
  requested: Locale,
): ResolvedText | null {
  if (!text) return null;
  const exact = text[requested];
  if (exact) {
    return {
      text: exact.value,
      isFallback: false,
      isUnreviewed: exact.reviewStatus !== 'approved',
      shownLocale: requested,
    };
  }
  // the source-locale copy, then any locale that actually has text (a null placeholder
  // for a missing locale must not shadow a locale that does have a value)
  const source = text[SOURCE_LOCALE];
  if (source) {
    return {
      text: source.value,
      isFallback: source.locale !== requested,
      isUnreviewed: source.reviewStatus !== 'approved',
      shownLocale: source.locale,
    };
  }
  for (const key of Object.keys(text) as Locale[]) {
    const candidate = text[key];
    if (!candidate) continue;
    return {
      text: candidate.value,
      isFallback: candidate.locale !== requested,
      isUnreviewed: candidate.reviewStatus !== 'approved',
      shownLocale: candidate.locale,
    };
  }
  return null;
}
