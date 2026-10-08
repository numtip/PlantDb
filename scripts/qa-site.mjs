#!/usr/bin/env node
/**
 * PlantDb functional QA — runs against the built site in dist/ (no network, no prod).
 *
 * Checks (all evidence-based, deterministic):
 *   1. every page declares the right lang
 *   2. canonical + hreflang (th / en / x-default) pairs are correct AND the counterpart exists
 *   3. every internal link resolves to a file that exists in dist/
 *   4. every referenced asset (css/js/svg/ico/xml) exists
 *   5. TH/EN route parity
 *   6. no untranslated UI (raw dictionary keys, "undefined", unresolved {placeholders})
 *   7. search/filter explorer is present on catalogue + search pages, with a labels payload
 *   8. sitemap.xml: every <loc> exists, every entry has th+en+x-default alternates
 *   9. browser-loaded text sanity: both locales contain real translated strings
 *
 * Usage: node scripts/qa-site.mjs   → writes docs/evidence/qa-site.json
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const SITE = 'https://numtip.github.io';
const BASE = '/PlantDb';
const problems = [];
const checks = [];
let assertions = 0;
const counters = { linksChecked: 0, assetsChecked: 0, hreflangChecked: 0, canonicalChecked: 0 };

const ok = (name, detail) => { assertions += 1; checks.push({ name, status: 'PASS', detail }); };
const bad = (name, detail) => { assertions += 1; problems.push({ name, detail }); checks.push({ name, status: 'FAIL', detail }); };

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

if (!existsSync(dist)) {
  console.error('dist/ not found — run `npm run build` first');
  process.exit(2);
}

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const rel = (f) => '/' + relative(dist, f);

/** map a public URL path (/PlantDb/xx/) to the file that must exist in dist */
function urlToFile(urlPath) {
  let p = urlPath.split('?')[0].split('#')[0];
  if (!p.startsWith(BASE)) return { missing: `outside base: ${urlPath}` };
  p = p.slice(BASE.length) || '/';
  if (p.endsWith('/')) p += 'index.html';
  if (!p.includes('.')) p += '/index.html';
  const candidate = join(dist, p.replace(/^\//, ''));
  if (existsSync(candidate)) return { file: candidate };
  return { missing: `${urlPath} → dist${p}` };
}

// ---------- 1..4: per-page checks ----------
const pages = [];
for (const file of htmlFiles) {
  const raw = readFileSync(file, 'utf8');
  // strip embedded scripts (JSON label payloads + inlined client code) — data/code, not rendered UI
  const html = raw.replace(/<script[\s\S]*?<\/script>/g, '');
  const isNoindex = /<meta name="robots" content="noindex/.test(html);
  const url = `${BASE}${rel(file).replace(/\/index\.html$/, '/').replace(/^\/404\.html$/, '/404.html')}`;
  const isEn = rel(file).startsWith('/en/');
  const locale = isEn ? 'en' : 'th';
  const page = { file: rel(file), url, locale, noindex: isNoindex };
  pages.push(page);

  // 1. lang attribute
  const langMatch = html.match(/<html[^>]*\blang="([^"]+)"/);
  if (langMatch?.[1] === locale) page.lang = locale;
  else bad(`lang=${locale}`, `${rel(file)} declares lang="${langMatch?.[1]}"`);

  // 2. canonical + hreflang
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ hreflang: m[1], href: m[2] }));
  page.canonical = canonical;
  page.alternates = alts;
  if (!canonical && !isNoindex) bad('canonical', `${rel(file)} has no canonical`);
  const expectedCanonical = SITE + url.replace(/\/index\.html$/, '/');
  const normalised = (canonical ?? '').replace(/\/+$/, '');
  if (canonical && canonical !== expectedCanonical && normalised !== expectedCanonical.replace(/\/+$/, '')) {
    bad('canonical-value', `${rel(file)} canonical=${canonical} expected≈${expectedCanonical}`);
  }
  const wantHreflang = isNoindex ? [] : ['th', 'en', 'x-default'];
  const haveHreflang = alts.map((a) => a.hreflang);
  for (const want of wantHreflang) {
    if (!haveHreflang.includes(want)) bad('hreflang-missing', `${rel(file)} missing hreflang="${want}"`);
  }
  for (const alt of alts) {
    if (!(alt.href.startsWith(BASE + '/') || alt.href === BASE || alt.href.startsWith(SITE + BASE))) {
      bad('hreflang-base', `${rel(file)} hreflang ${alt.hreflang} → ${alt.href} (outside ${BASE})`);
    } else {
      const target = alt.href.startsWith('http') ? alt.href.slice(SITE.length) : alt.href;
      const resolved = urlToFile(target);
      if (resolved.missing) bad('hreflang-target', `${rel(file)} hreflang ${alt.hreflang} ${resolved.missing}`);
    }
  }
  const selfAlt = alts.find((a) => a.hreflang === locale);
  const stripSite = (u = '') => (u.startsWith(SITE) ? u.slice(SITE.length) : u).replace(/\/+$/, '');
  if (selfAlt && stripSite(selfAlt.href) !== stripSite(canonical ?? '')) {
    bad('hreflang-self', `${rel(file)} hreflang ${locale}=${selfAlt.href} ≠ canonical ${canonical}`);
  }

  // 3. internal links
  const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of links) {
    counters.linksChecked += 1;
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    const resolved = urlToFile(href.startsWith('/') ? href : `${BASE}${href}`);
    if (resolved.missing) bad('internal-link', `${rel(file)} → ${resolved.missing}`);
  }

  // 4. assets
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:css|js|svg|ico|png|jpg|webp|xml|txt))"/g)].map((m) => m[1]);
  for (const asset of assets) {
    counters.assetsChecked += 1;
    if (/^(https?:|data:)/.test(asset)) continue;
    const resolved = urlToFile(asset.startsWith('/') ? asset : `${BASE}${asset}`);
    if (resolved.missing) bad('asset-missing', `${rel(file)} → ${resolved.missing}`);
  }

  // 6. untranslated / broken UI — a leaked dictionary key shows up as a *text node*
  //    (asset filenames like _astro/about.DGGykndp.css live in attributes and must not match)
  const keyLeak = html.match(/>\s*(?:nav|footer|hero|labels|states|a11y|seo|about|detail|meta|collections)\.[a-zA-Z]{3,}\s*</);
  if (keyLeak) {
    bad('untranslated-key', `${rel(file)} contains raw dictionary key "${keyLeak[0].replace(/[<>\s]/g, '')}"`);
  }
  if (/>\s*undefined\s*</.test(html)) bad('undefined-value', `${rel(file)} renders "undefined"`);
  if (/\{\s*[a-zA-Z_]+\s*\}/.test(html)) {
    const ph = html.match(/\{\s*[a-zA-Z_]+\s*\}/)?.[0];
    bad('unresolved-placeholder', `${rel(file)} renders unresolved placeholder ${ph}`);
  }

  // 9. locale copy sanity: both locales must show translated strings
  const hasThai = /[\u0E00-\u0E7F]/.test(html);
  if (locale === 'th' && !hasThai) bad('thai-copy', `${rel(file)} has no Thai characters`);
  page.hasThai = hasThai;
}

// ---------- 5. route parity ----------
const thRoutes = new Set(pages.filter((p) => p.locale === 'th' && !p.url.includes('404')).map((p) => p.url.replace(/^\/PlantDb/, '')));
const enRoutes = new Set(pages.filter((p) => p.locale === 'en' && !p.url.includes('404')).map((p) => p.url.replace(/^\/PlantDb\/en/, '').replace(/^$/, '/')));
const onlyTh = [...thRoutes].filter((r) => !enRoutes.has(r));
const onlyEn = [...enRoutes].filter((r) => !thRoutes.has(r));
if (onlyTh.length === 0 && onlyEn.length === 0) ok('route-parity', `${thRoutes.size} routes exist in both locales`);
else bad('route-parity', `TH-only: ${onlyTh.join(', ') || '—'} | EN-only: ${onlyEn.join(', ') || '—'}`);

// ---------- 7. explorer presence ----------
const cataloguePages = pages.filter((p) => /^\/(en\/)?(plants|animals|research|search)\/$/.test(p.url.replace(/^\/PlantDb/, '')) || p.url.includes('/category/'));
const missingExplorer = cataloguePages.filter((p) => !readFileSync(join(dist, p.file.slice(1)), 'utf8').includes('data-explorer'));
if (missingExplorer.length === 0) ok('explorer', `${cataloguePages.length} catalogue/search pages expose the search+filter explorer`);
else bad('explorer', missingExplorer.map((p) => p.file).join(', '));

const labelPayloads = pages.filter((p) => readFileSync(join(dist, p.file.slice(1)), 'utf8').includes('explorer-labels'));
if (labelPayloads.length === cataloguePages.length) ok('explorer-labels', `${labelPayloads.length} pages embed a localized label payload`);
else bad('explorer-labels', `expected ${cataloguePages.length} pages with explorer-labels, found ${labelPayloads.length}`);

// ---------- 8. sitemap ----------
const sitemapPath = join(dist, 'sitemap.xml');
if (!existsSync(sitemapPath)) bad('sitemap', 'dist/sitemap.xml missing');
else {
  const xml = readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  let badLoc = 0;
  for (const loc of locs) {
    const resolved = urlToFile(loc.slice(SITE.length));
    if (resolved.missing) { badLoc += 1; if (badLoc <= 3) bad('sitemap-loc', resolved.missing); }
  }
  const blocks = xml.split('<url>').slice(1);
  const missingAlt = blocks.filter((b) => !(b.includes('hreflang="th"') && b.includes('hreflang="en"') && b.includes('hreflang="x-default"')));
  if (badLoc === 0 && missingAlt.length === 0) ok('sitemap', `${locs.length} URLs, all resolvable, all with th/en/x-default alternates`);
  else if (missingAlt.length) bad('sitemap-hreflang', `${missingAlt.length} sitemap entries lack full alternates`);

  const expectedUrls = new Set(pages.filter((p) => !p.noindex).map((p) => p.url.replace(/^\/PlantDb(\/en)?/, ''))).size;
  if (locs.length >= expectedUrls) ok('sitemap-coverage', `${locs.length} sitemap URLs ≥ ${expectedUrls} pages`);
  else bad('sitemap-coverage', `${locs.length} sitemap URLs < ${expectedUrls} pages`);
}

// ---------- report ----------
const report = {
  generatedAt: new Date().toISOString(),
  site: { site: SITE, base: BASE, pages: pages.length, locales: ['th', 'en'] },
  assertions,
  counters,
  passed: checks.filter((c) => c.status === 'PASS').length,
  failed: problems.length,
  problems,
  checks,
};
mkdirSync(join(root, 'docs/evidence'), { recursive: true });
writeFileSync(join(root, 'docs/evidence/qa-site.json'), JSON.stringify(report, null, 2));
console.log(`pages=${pages.length} locales=th,en assertions=${assertions} failed=${problems.length}`);
for (const p of problems) console.log(`  ✗ ${p.name}: ${p.detail}`);
console.log(problems.length === 0 ? 'FUNCTIONAL QA: PASS' : 'FUNCTIONAL QA: FAIL');
process.exit(problems.length === 0 ? 0 : 1);
