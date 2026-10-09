// i18n parity test — both locales must expose exactly the same key tree.
// run: node --experimental-strip-types scripts/test-i18n.mjs
const { dictionaries } = await import(new URL('../src/i18n/ui.ts', import.meta.url).href);
const paths = (o, p = '') => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === 'object' ? paths(v, `${p}${k}.`) : [`${p}${k}`]);
const th = new Set(paths(dictionaries.th));
const en = new Set(paths(dictionaries.en));
const onlyTh = [...th].filter((k) => !en.has(k));
const onlyEn = [...en].filter((k) => !th.has(k));
console.log('th keys', th.size, 'en keys', en.size);
console.log('only in th:', onlyTh);
console.log('only in en:', onlyEn);
if (onlyTh.length || onlyEn.length || th.size === 0) {
  console.error('I18N PARITY: FAIL');
  process.exit(1);
}
console.log('I18N PARITY: PASS');
