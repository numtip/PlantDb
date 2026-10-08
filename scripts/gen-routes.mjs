#!/usr/bin/env node
/**
 * Route generator — the bilingual route tree is mechanical, so it is generated
 * instead of hand-duplicated 16 times (and stays identical between locales).
 * Run: node scripts/gen-routes.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const LOCALES = ['th', 'en'];
const KINDS = [
  { kind: 'plant', seg: 'plants' },
  { kind: 'animal', seg: 'animals' },
  { kind: 'research', seg: 'research' },
];

const write = (rel, body) => {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, body.trimStart(), 'utf8');
  console.log('  wrote', rel);
};

const layoutImport = () => '@/layouts/BaseLayout.astro';
const viewImport = (_locale, name) => `@/views/${name}.astro`;
const dataImport = (_locale, name) => `@/data/${name}`;

const home = (locale) => `---
import BaseLayout from '${layoutImport(locale)}';
import HomeView from '${viewImport(locale, 'HomeView')}';
import { useTranslations } from '@/i18n/ui';

const locale = '${locale}';
const t = useTranslations(locale);
---

<BaseLayout locale={locale} title={t.seo.homeTitle} description={t.seo.homeDesc} path="">
  <HomeView locale={locale} />
</BaseLayout>
`;

const catalogue = (locale, kind, seg) => `---
import BaseLayout from '${layoutImport(locale)}';
import CatalogueView from '${viewImport(locale, 'CatalogueView')}';
import { useTranslations } from '@/i18n/ui';

const locale = '${locale}';
const t = useTranslations(locale);
---

<BaseLayout
  locale={locale}
  title={t.seo.${kind === 'plant' ? 'plantsTitle' : kind === 'animal' ? 'animalsTitle' : 'researchTitle'}}
  description={t.seo.${kind === 'plant' ? 'plantsDesc' : kind === 'animal' ? 'animalsDesc' : 'researchDesc'}}
  path="${seg}/"
>
  <CatalogueView locale={locale} kind="${kind}" />
</BaseLayout>
`;

const categoryPage = (locale, kind, seg) => `---
import BaseLayout from '@/layouts/BaseLayout.astro';
import CatalogueView from '@/views/CatalogueView.astro';
import { categories } from '@/data/catalog';
import { resolveLocalized } from '@/i18n/localized-content';
import { useTranslations } from '@/i18n/ui';

export function getStaticPaths() {
  return categories.filter((c) => c.kind === '${kind}').map((c) => ({ params: { slug: c.slug }, props: { category: c } }));
}

const locale = '${locale}';
const { category } = Astro.props;
const t = useTranslations(locale);
const name = resolveLocalized(category.name, locale)?.text ?? category.slug;
---

<BaseLayout locale={locale} title={\`\${name} — PlantDb\`} description={t.collections.${kind === 'plant' ? 'plants' : kind === 'animal' ? 'animals' : 'research'}.lead} path={\`${seg}/category/\${category.slug}/\`}>
  <CatalogueView locale={locale} kind="${kind}" categorySlug={category.slug} />
</BaseLayout>
`;

const detailPage = (locale, kind, seg) => `---
import BaseLayout from '${layoutImport(locale)}';
import DetailView from '${viewImport(locale, 'DetailView')}';
import { publishedItems } from '${dataImport(locale, 'catalog')}';
import { resolveLocalized } from '@/i18n/localized-content';
import { useTranslations } from '@/i18n/ui';

export function getStaticPaths() {
  return publishedItems.filter((i) => i.kind === '${kind}').map((i) => ({ params: { slug: i.slug }, props: { item: i } }));
}

const locale = '${locale}';
const { item } = Astro.props;
const t = useTranslations(locale);
const name = resolveLocalized(item.name, locale)?.text ?? item.slug;
const summary = resolveLocalized(item.summary, locale)?.text ?? t.hero.lead;
---

<BaseLayout locale={locale} title={\`\${name} — PlantDb\`} description={summary} path={\`${seg}/\${item.slug}/\`}>
  <DetailView locale={locale} item={item} />
</BaseLayout>
`;

const searchPage = (locale) => `---
import BaseLayout from '${layoutImport(locale)}';
import SearchView from '${viewImport(locale, 'SearchView')}';
import { useTranslations } from '@/i18n/ui';

const locale = '${locale}';
const t = useTranslations(locale);
---

<BaseLayout locale={locale} title={t.seo.searchTitle} description={t.seo.searchDesc} path="search/">
  <SearchView locale={locale} />
</BaseLayout>
`;

const aboutPage = (locale) => `---
import BaseLayout from '${layoutImport(locale)}';
import AboutView from '${viewImport(locale, 'AboutView')}';
import { useTranslations } from '@/i18n/ui';

const locale = '${locale}';
const t = useTranslations(locale);
---

<BaseLayout locale={locale} title={t.seo.aboutTitle} description={t.seo.aboutDesc} path="about/">
  <AboutView locale={locale} />
</BaseLayout>
`;

const notFound = (locale) => `---
import BaseLayout from '${layoutImport(locale)}';
import States from '@/components/States.astro';
import { useTranslations } from '@/i18n/ui';

const locale = '${locale}';
const t = useTranslations(locale);
---

<BaseLayout locale={locale} title={\`\${t.states.notFoundTitle} — PlantDb\`} description={t.states.notFoundBody} noindex>
  <section class="section">
    <div class="shell shell--wide">
      <States locale={locale} kind="notfound" as="h1" />
    </div>
  </section>
</BaseLayout>
`;

console.log('generating route tree…');
for (const locale of LOCALES) {
  const base = locale === 'th' ? 'src/pages' : 'src/pages/en';
  write(`${base}/index.astro`, home(locale));
  write(`${base}/search.astro`, searchPage(locale));
  write(`${base}/about.astro`, aboutPage(locale));
  write(`${base}/404.astro`, notFound(locale));
  for (const { kind, seg } of KINDS) {
    write(`${base}/${seg}/index.astro`, catalogue(locale, kind, seg));
    write(`${base}/${seg}/[slug].astro`, detailPage(locale, kind, seg));
    if (kind !== 'research') write(`${base}/${seg}/category/[slug].astro`, categoryPage(locale, kind, seg));
  }
}
console.log('done.');
