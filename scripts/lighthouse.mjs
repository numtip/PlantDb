#!/usr/bin/env node
/**
 * Lighthouse gate — measures Performance / Accessibility / Best Practices / SEO for the
 * representative TH and EN URLs on desktop and mobile, stores the reports, and fails if any
 * category is below the threshold (default 90).
 *
 * Serves dist/ under the GitHub Pages base path (/PlantDb/) exactly like production, so the
 * measured page is the shipped one.
 *
 * Usage: node scripts/lighthouse.mjs [--threshold=90] [--port=8098] [--urls=core|full]
 * Evidence: docs/evidence/lighthouse/<run>.json (trimmed) + docs/evidence/lighthouse/summary.json
 * Raw full reports: lighthouse-raw/ (not committed)
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, symlinkSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const THRESHOLD = Number(args.threshold ?? 90);
const PORT = Number(args.port ?? 8098);
const SET = args.urls ?? 'core';

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

/** representative pages: the two locales' home, a catalogue and a detail page */
const URLS = {
  core: [
    { id: 'th-home', path: '/' },
    { id: 'en-home', path: '/en/' },
    { id: 'th-detail', path: '/plants/rice-oryza/' },
    { id: 'en-detail', path: '/en/plants/rice-oryza/' },
  ],
  full: [
    { id: 'th-home', path: '/' },
    { id: 'en-home', path: '/en/' },
    { id: 'th-catalogue', path: '/plants/' },
    { id: 'en-catalogue', path: '/en/plants/' },
    { id: 'th-detail', path: '/plants/rice-oryza/' },
    { id: 'en-detail', path: '/en/plants/rice-oryza/' },
    { id: 'th-search', path: '/search/' },
    { id: 'en-search', path: '/en/search/' },
  ],
}[SET];

if (!URLS) {
  console.error(`unknown --urls=${SET}`);
  process.exit(2);
}

const chrome = readdirSync(join(homedir(), '.cache/ms-playwright'))
  .filter((d) => d.startsWith('chromium-'))
  .sort()
  .map((d) => join(homedir(), '.cache/ms-playwright', d, 'chrome-linux64/chrome'))
  .filter(existsSync)
  .pop();
if (!chrome) {
  console.error('chromium not found (playwright chromium expected under ~/.cache/ms-playwright)');
  process.exit(2);
}

// ---- serve dist/ at /PlantDb/ (same shape as GitHub Pages) ----
const serveDir = `/tmp/c5-lh-serve`;
rmSync(serveDir, { recursive: true, force: true });
mkdirSync(serveDir, { recursive: true });
symlinkSync(join(root, 'dist'), join(serveDir, 'PlantDb'));
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', serveDir], {
  stdio: 'ignore',
  detached: true,
});
const waitReady = () => {
  for (let i = 0; i < 40; i += 1) {
    try {
      execFileSync('curl', ['-sf', '-o', '/dev/null', `http://127.0.0.1:${PORT}/PlantDb/`], { stdio: 'ignore' });
      return true;
    } catch {
      execFileSync('sleep', ['0.5']);
    }
  }
  return false;
};
if (!waitReady()) {
  console.error('static server did not start');
  process.exit(2);
}

const outDir = join(root, 'docs/evidence/lighthouse');
const rawDir = join(root, 'lighthouse-raw');
mkdirSync(outDir, { recursive: true });
mkdirSync(rawDir, { recursive: true });

const results = [];
for (const url of URLS) {
  for (const form of ['desktop', 'mobile']) {
    const id = `${url.id}-${form}`;
    const raw = join(rawDir, `${id}.json`);
    const target = `http://127.0.0.1:${PORT}/PlantDb${url.path}`;
    process.stdout.write(`→ ${id} … `);
    try {
      execFileSync(
        'npx',
        [
          'lighthouse',
          target,
          '--quiet',
          '--output=json',
          `--output-path=${raw}`,
          `--only-categories=${CATEGORIES.join(',')}`,
          ...(form === 'desktop' ? ['--preset=desktop'] : []),
          '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
        ],
        { env: { ...process.env, CHROME_PATH: chrome }, stdio: ['ignore', 'ignore', 'pipe'], cwd: root },
      );
    } catch (err) {
      console.log('FAILED');
      console.error(String(err.stderr ?? err).slice(0, 400));
      process.exit(1);
    }
    const report = JSON.parse(readFileSync(raw, 'utf8'));
    const scores = Object.fromEntries(
      CATEGORIES.map((c) => [c, Math.round((report.categories[c]?.score ?? 0) * 100)]),
    );
    const belowThreshold = CATEGORIES.filter((c) => scores[c] < THRESHOLD);
    console.log(CATEGORIES.map((c) => `${c.slice(0, 4)}=${scores[c]}`).join(' '));

    // trimmed evidence: scores, key metrics, and every audit that did not pass
    const trimmed = {
      id,
      url: target,
      formFactor: form,
      fetchedAt: report.fetchTime,
      lighthouseVersion: report.lighthouseVersion,
      threshold: THRESHOLD,
      scores,
      passed: belowThreshold.length === 0,
      categoriesBelowThreshold: belowThreshold,
      metrics: Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'total-blocking-time',
          'cumulative-layout-shift',
          'speed-index',
          'interactive',
        ]
          .map((k) => [k, report.audits[k]?.displayValue])
          .filter(([, v]) => v),
      ),
      failingAudits: Object.values(report.audits)
        .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable')
        .map((a) => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue ?? null })),
    };
    writeFileSync(join(outDir, `${id}.json`), JSON.stringify(trimmed, null, 2));
    results.push(trimmed);
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  threshold: THRESHOLD,
  set: SET,
  urlCount: URLS.length,
  runs: results.length,
  allPassed: results.every((r) => r.passed),
  table: results.map((r) => ({ id: r.id, form: r.formFactor, ...r.scores, passed: r.passed })),
};
writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));

console.log('\n| run | form | perf | a11y | best-practices | seo | pass |');
console.log('| --- | --- | --- | --- | --- | --- | --- |');
for (const r of summary.table) {
  console.log(`| ${r.id} | ${r.form} | ${r.performance} | ${r.accessibility} | ${r['best-practices']} | ${r.seo} | ${r.passed ? '✓' : '✗'} |`);
}

try {
  process.kill(-server.pid);
} catch {
  server.kill();
}

const failures = results.filter((r) => !r.passed);
if (failures.length) {
  console.log(`\nLIGHTHOUSE GATE: FAIL (${failures.map((f) => `${f.id}:${f.categoriesBelowThreshold.join('+')}`).join(', ')})`);
  process.exit(1);
}
console.log(`\nLIGHTHOUSE GATE: PASS (${results.length} runs, all categories ≥ ${THRESHOLD})`);
