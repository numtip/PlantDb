#!/usr/bin/env node
/**
 * Functional test of the shipped search/filter behaviour.
 *
 * Runs the real page in headless Chromium, lets the client script execute, then reads the
 * resulting DOM — so it tests what a visitor actually gets, in both locales and across
 * Thai names, English names and scientific names. Requires a static server on PORT serving
 * dist/ under /PlantDb/ (see scripts/shots.sh for the same setup).
 *
 * Usage: node scripts/test-search.mjs [port]
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PORT = process.argv[2] ?? '8099';

const chromeDir = join(homedir(), '.cache/ms-playwright');
const chrome = readdirSync(chromeDir)
  .filter((d) => d.startsWith('chromium-'))
  .sort()
  .map((d) => join(chromeDir, d, 'chrome-linux64/chrome'))
  .filter((p) => existsSync(p))
  .pop();
if (!chrome) {
  console.error('chromium not found — install playwright chromium or skip this test');
  process.exit(2);
}

const cases = [
  { label: "th  'ข้าว' (Thai name)", path: '/search/', q: 'ข้าว', expectMin: 1 },
  { label: "th  'Oryza sativa' (scientific)", path: '/search/', q: 'Oryza sativa', expectMin: 1 },
  { label: "th  'สุกร' (animal, Thai)", path: '/search/', q: 'สุกร', expectMin: 1 },
  { label: "en  'rice' (English)", path: '/en/search/', q: 'rice', expectMin: 1 },
  { label: "en  'ข้าว' (Thai query on EN page)", path: '/en/search/', q: 'ข้าว', expectMin: 1 },
  { label: "en  'tilapia' (English)", path: '/en/search/', q: 'tilapia', expectMin: 1 },
  { label: "th  'tilapia' (English query on TH page)", path: '/search/', q: 'tilapia', expectMin: 1 },
  { label: "en  'zzzz' (no match → empty state)", path: '/en/search/', q: 'zzzz', expectMin: 0, expectMax: 0 },
  { label: 'th  (empty query → everything)', path: '/search/', q: '', expectMin: 1 },
];

let failures = 0;
for (const c of cases) {
  const url = `http://127.0.0.1:${PORT}/PlantDb${c.path}?q=${encodeURIComponent(c.q)}`;
  const dom = execFileSync(
    chrome,
    ['--headless=new', '--no-sandbox', '--disable-gpu', '--virtual-time-budget=4000', '--dump-dom', url],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  );

  const slots = [...dom.matchAll(/<div class="explorer__slot"[^>]*data-name="([^"]*)"([^>]*)>/g)];
  const visible = slots.filter((m) => !m[2].includes('hidden')).map((m) => m[1]);
  const countText = dom.match(/data-explorer-count[^>]*>([^<]*)</)?.[1] ?? '(none)';
  const emptyHidden = /<div class="explorer__empty"[^>]*hidden/.test(dom);

  const ok = visible.length >= (c.expectMin ?? 0) && (c.expectMax === undefined || visible.length === c.expectMax);
  const emptyOk = c.expectMax === 0 ? !emptyHidden : emptyHidden;
  if (!ok || !emptyOk) failures += 1;

  console.log(
    `${ok && emptyOk ? '✓' : '✗'} ${c.label.padEnd(34)} visible=${String(visible.length).padStart(2)} said="${countText.trim()}" emptyState=${emptyHidden ? 'hidden' : 'shown'} ${visible.slice(0, 3).join(', ')}`,
  );
}

console.log(failures === 0 ? 'SEARCH FUNCTIONAL TEST: PASS' : `SEARCH FUNCTIONAL TEST: FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
