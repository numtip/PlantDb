// Astro config — GitHub Pages project site (owner requirement: path /PlantDb/).
// i18n uses Astro's built-in routing (default locale "th" served at the base path, "en" at /en/).
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://numtip.github.io',
  base: '/PlantDb',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  devToolbar: { enabled: false },
});
