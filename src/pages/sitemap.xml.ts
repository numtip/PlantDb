/**
 * Locale-aware sitemap with hreflang alternates (owner directive §5).
 * Generated from the same data the pages use, so it cannot drift.
 */
import type { APIRoute } from 'astro';
import { categories, publishedItems } from '../data/catalog';
import { locales, localeTags } from '../i18n/ui';
import { localePath } from '../i18n/urls';

export const GET: APIRoute = ({ site }) => {
  const siteBase = (site?.toString() ?? 'https://numtip.github.io').replace(/\/+$/, '');

  const paths: string[] = ['', 'plants/', 'animals/', 'research/', 'search/', 'about/'];
  for (const seg of ['plants', 'animals'] as const) {
    for (const c of categories.filter((x) => (seg === 'plants' ? x.kind === 'plant' : x.kind === 'animal'))) {
      paths.push(`${seg}/category/${c.slug}/`);
    }
  }
  for (const item of publishedItems) {
    const seg = item.kind === 'plant' ? 'plants' : item.kind === 'animal' ? 'animals' : 'research';
    paths.push(`${seg}/${item.slug}/`);
  }

  const url = (locale: (typeof locales)[number], path: string) => siteBase + localePath(locale, path);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths
  .map(
    (path) => `  <url>
    <loc>${url('th', path)}</loc>
${locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${localeTags[l]}" href="${url(l, path)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url('th', path)}"/>
    <changefreq>monthly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
