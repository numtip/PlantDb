/**
 * Locale-aware URL helpers — GitHub Pages project site aware (base = /PlantDb/).
 *
 * TH:  /PlantDb/<path>          (default locale, no prefix)
 * EN:  /PlantDb/en/<path>
 * Every link in the site goes through these helpers so the base path and the locale
 * prefix can never drift apart.
 */
import { defaultLocale, locales, type Locale } from './ui';

export const BASE: string = import.meta.env.BASE_URL.replace(/\/+$/, ''); // '/PlantDb'
export const SITE: string = import.meta.env.SITE.replace(/\/+$/, ''); // 'https://numtip.github.io'

const clean = (path: string): string => path.replace(/^\/+/, '').replace(/\/+$/, '');

/** Path (relative to the site root of the project, NOT including base) for a locale. */
export function localePath(locale: Locale, path = ''): string {
  const parts = [BASE];
  if (locale !== defaultLocale) parts.push(locale);
  const rest = path.replace(/^\/+/, '');
  if (rest) parts.push(rest);
  const joined = parts.join('/').replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  // files (sitemap.xml, favicon.svg…) keep their name; routes get a trailing slash
  return /\.[a-z0-9]+$/i.test(joined) ? joined : `${joined}/`;
}

/** Absolute URL (canonical / og:url) */
export function absoluteUrl(locale: Locale, path = ''): string {
  return SITE + localePath(locale, path);
}

/** Strip base + locale prefix from a pathname so it can be re-prefixed for another locale. */
export function stripLocale(pathname: string): { locale: Locale; rest: string } {
  let rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  rest = clean(rest);
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (rest === locale || rest.startsWith(`${locale}/`)) {
      return { locale, rest: clean(rest.slice(locale.length)) };
    }
  }
  return { locale: defaultLocale, rest };
}

/** Link to the same page in the other locale (query string / hash preserved by the caller). */
export function switchLocaleHref(pathname: string, target: Locale): string {
  const { rest } = stripLocale(pathname);
  return localePath(target, rest);
}

/** hreflang pairs for the current page (used by <link rel="alternate"> and the sitemap). */
export function alternatePaths(pathname: string): Array<{ locale: Locale; href: string }> {
  const { rest } = stripLocale(pathname);
  return locales.map((locale) => ({ locale, href: localePath(locale, rest) }));
}

export function isActive(pathname: string, href: string): boolean {
  if (href === localePath('th')) return clean(pathname) === clean(localePath('th'));
  return pathname.startsWith(href);
}
