/**
 * PlantDb — PUBLIC-SAFE DEMO CATALOGUE (C5)
 *
 * ⚠️ Nothing in this file comes from the production database.
 *   - Species listed are widely known examples; the *text* is written for design review
 *     only and is explicitly flagged `demo-placeholder`.
 *   - No Maejo cultivar names, no breeder names, no production paths, no media files.
 *   - Two records intentionally ship with a single locale so the missing-translation
 *     policy (never hide, never fake) is exercised in the UI and in QA.
 *
 * The real dataset arrives later through the C4 migration pipeline (schema Option A);
 * this fixture mirrors that shape (stable legacy id + JSONB-ish fields + category
 * relations + provenance) so the UI code does not have to change.
 */
import { makeLocalized, type LocalizedText } from '../i18n/localized-content';
import type { Locale } from '../i18n/ui';

export type ItemKind = 'plant' | 'animal' | 'research';

export type Category = {
  id: number;
  slug: string;
  kind: ItemKind;
  parentSlug: string | null;
  name: LocalizedText;
};

export type DemoItem = {
  /** stable identity — mirrors legacy item id in the C4 schema */
  legacyId: number;
  slug: string;
  kind: ItemKind;
  categorySlug: string;
  /** scientific name is locale-independent (never translated) */
  scientificName: string;
  family: string;
  tags: string[];
  name: LocalizedText;
  commonName: LocalizedText;
  summary: LocalizedText;
  characteristics: LocalizedText;
  origin: LocalizedText;
  agency: LocalizedText;
  people: LocalizedText;
  notes: LocalizedText;
  /** media: intentionally empty — the UI renders botanical placeholders, no raw media */
  media: { legacyPath: string | null; published: false };
  publication: { state: 'published' | 'unpublished' };
  provenance: {
    source: 'demo-fixture';
    contentStatus: 'demo-placeholder';
    reviewed: false;
    note: string;
  };
};

const L = (th: string | null, en: string | null, provenance: string): LocalizedText => {
  const out: LocalizedText = {};
  if (th !== null) out.th = makeLocalized(th, 'th', provenance);
  if (en !== null) out.en = makeLocalized(en, 'en', provenance);
  return out;
};

export const categories: Category[] = [
  { id: 1, slug: 'horticulture', kind: 'plant', parentSlug: null, name: L('พันธุ์ไม้สวน', 'Horticulture', 'demo:category:1') },
  { id: 2, slug: 'flower', kind: 'plant', parentSlug: 'horticulture', name: L('ไม้ดอกไม้ประดับ', 'Ornamentals', 'demo:category:2') },
  { id: 3, slug: 'orchid', kind: 'plant', parentSlug: 'flower', name: L('กล้วยไม้', 'Orchids', 'demo:category:3') },
  { id: 4, slug: 'fruits', kind: 'plant', parentSlug: 'horticulture', name: L('ไม้ผล', 'Fruit trees', 'demo:category:4') },
  { id: 5, slug: 'vegetable', kind: 'plant', parentSlug: 'horticulture', name: L('พืชผัก', 'Vegetables', 'demo:category:5') },
  { id: 6, slug: 'crops', kind: 'plant', parentSlug: null, name: L('พืชไร่', 'Field crops', 'demo:category:6') },
  { id: 7, slug: 'rice', kind: 'plant', parentSlug: 'crops', name: L('ข้าว', 'Rice', 'demo:category:7') },
  { id: 8, slug: 'legumes', kind: 'plant', parentSlug: 'crops', name: L('ถั่ว', 'Legumes', 'demo:category:8') },
  { id: 9, slug: 'pigs', kind: 'animal', parentSlug: null, name: L('สุกร', 'Pigs', 'demo:category:9') },
  { id: 10, slug: 'fish', kind: 'animal', parentSlug: null, name: L('ปลา', 'Fish', 'demo:category:10') },
  { id: 11, slug: 'insects', kind: 'animal', parentSlug: null, name: L('แมลง', 'Insects', 'demo:category:11') },
  { id: 12, slug: 'breeding', kind: 'research', parentSlug: null, name: L('โครงการปรับปรุงพันธุ์', 'Breeding programmes', 'demo:category:12') },
];

export const items: DemoItem[] = [
  {
    legacyId: 901, slug: 'rice-oryza', kind: 'plant', categorySlug: 'rice',
    scientificName: 'Oryza sativa L.', family: 'Poaceae', tags: [' cereals', 'irrigated', 'staple'],
    name: L('ข้าวสาธิต (พันธุ์ทดลอง)', 'Demo rice (trial line)', 'demo:item:901'),
    commonName: L('ข้าว', 'Rice', 'demo:item:901'),
    summary: L('พันธุ์ทดลองสำหรับแสดงหน้าตาแคตตาล็อก จัดอยู่ในกลุ่มพืชไร่ที่มีการปรับปรุงพันธุ์อย่างต่อเนื่อง',
      'A trial line used to demonstrate the catalogue layout within the field-crop group.', 'demo:item:901'),
    characteristics: L('ต้นสูงปานกลาง ออกรวงสม่ำเสมอ เมล็ดเรียวยาว',
      'Medium-height plant, even panicle emergence, slender grain.', 'demo:item:901'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ ไม่ได้มาจากฐานข้อมูลจริง',
      'Placeholder text for design review; not sourced from the production database.', 'demo:item:901'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', 'Faculty of Agricultural Production (example)', 'demo:item:901'),
    people: L('ยังไม่มีข้อมูลทีมวิจัยในชุดตัวอย่างนี้', 'No research team data in this demo set.', 'demo:item:901'),
    notes: L('ตัวอย่างนี้ใช้ทดสอบการค้นหาด้วยชื่อวิทยาศาสตร์',
      'Used to test scientific-name search in both locales.', 'demo:item:901'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 902, slug: 'turmeric-curcuma', kind: 'plant', categorySlug: 'vegetable',
    scientificName: 'Curcuma longa L.', family: 'Zingiberaceae', tags: ['rhizome', 'medicinal'],
    name: L('ขมิ้นชัน (ตัวอย่าง)', 'Turmeric (demo)', 'demo:item:902'),
    commonName: L('ขมิ้น', 'Turmeric', 'demo:item:902'),
    summary: L('ตัวอย่างพืชผักสมุนไพร แสดงการจัดวางข้อมูลลักษณะประจำพันธุ์',
      'An herb/vegetable example showing the characteristics block.', 'demo:item:902'),
    characteristics: L('เหง้าใต้ดินสีเหลือง ใบเรียวยาว ดอกเป็นช่อ',
      'Yellow underground rhizome, narrow leaves, spike inflorescence.', 'demo:item:902'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:902'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', 'Faculty of Agricultural Production (example)', 'demo:item:902'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:902'),
    notes: L('ใช้ทดสอบตัวกรองหมวดพืชผัก', 'Used to test the vegetable category filter.', 'demo:item:902'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 903, slug: 'lady-slipper-orchid', kind: 'plant', categorySlug: 'orchid',
    scientificName: 'Paphiopedilum callosum (Rchb.f.) Stein', family: 'Orchidaceae', tags: ['orchid', 'conservation'],
    name: L('รองเท้านารี (ตัวอย่าง)', 'Lady’s slipper orchid (demo)', 'demo:item:903'),
    commonName: L('รองเท้านารี', 'Lady’s slipper', 'demo:item:903'),
    summary: L('ตัวอย่างไม้ดอกในกลุ่มกล้วยไม้ แสดงการใช้ชื่อวิทยาศาสตร์แบบยาวบนหน้าจอแคบ',
      'An orchid example used to test long scientific names on narrow screens.', 'demo:item:903'),
    characteristics: L('กลีบปากคล้ายรองเท้า ออกดอกเดี่ยว',
      'Pouch-like lip, single-flowered inflorescence.', 'demo:item:903'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:903'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', 'Faculty of Agricultural Production (example)', 'demo:item:903'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:903'),
    notes: L('ชื่อวิทยาศาสตร์ยาว — ใช้ทดสอบการตัดบรรทัด', 'Long scientific name — tests wrapping.', 'demo:item:903'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 904, slug: 'mango-mangifera', kind: 'plant', categorySlug: 'fruits',
    scientificName: 'Mangifera indica L.', family: 'Anacardiaceae', tags: ['fruit', 'perennial'],
    name: L('มะม่วง (ตัวอย่าง)', 'Mango (demo)', 'demo:item:904'),
    commonName: L('มะม่วง', 'Mango', 'demo:item:904'),
    summary: L('ตัวอย่างไม้ผลยืนต้น แสดงการ์ดภาพและรายละเอียดผล',
      'A perennial fruit-tree example showing the media card and fruit block.', 'demo:item:904'),
    characteristics: L('ทรงพุ่มกว้าง ผลรูปไข่ เปลือกเรียบ',
      'Broad canopy, ovoid fruit, smooth skin.', 'demo:item:904'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:904'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', 'Faculty of Agricultural Production (example)', 'demo:item:904'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:904'),
    notes: L('ใช้ทดสอบตัวกรองไม้ผล', 'Used to test the fruit-tree filter.', 'demo:item:904'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 905, slug: 'banana-musa', kind: 'plant', categorySlug: 'fruits',
    scientificName: 'Musa × paradisiaca L.', family: 'Musaceae', tags: ['fruit', 'clonal'],
    name: L('กล้วย (ตัวอย่าง)', 'Banana (demo)', 'demo:item:905'),
    commonName: L('กล้วย', 'Banana', 'demo:item:905'),
    summary: L('ตัวอย่างพืชขยายพันธุ์แบบโคลน แสดงจำนวนรายการหนาแน่นในหมวดเดียว',
      'A clonally propagated example, showing a dense category listing.', 'demo:item:905'),
    characteristics: L('ลำต้นเทียม ใบใหญ่ ผลเป็นหวี', 'Pseudostem, large leaves, hands of fruit.', 'demo:item:905'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:905'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', 'Faculty of Agricultural Production (example)', 'demo:item:905'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:905'),
    notes: L('ทดสอบการ์ดจำนวนมากในหน้าเดียว', 'Tests many cards on one page.', 'demo:item:905'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    /** single-locale record #1 — Thai only: the EN page must show the fallback badge */
    legacyId: 906, slug: 'mungbean-thai-only', kind: 'plant', categorySlug: 'legumes',
    scientificName: 'Vigna radiata (L.) R. Wilczek', family: 'Fabaceae', tags: ['legume', 'soil-nitrogen'],
    name: L('ถั่วเขียว (ตัวอย่าง — มีเฉพาะภาษาไทย)', null, 'demo:item:906'),
    commonName: L('ถั่วเขียว', null, 'demo:item:906'),
    summary: L('รายการนี้มีข้อความเฉพาะภาษาไทย เพื่อสาธิตนโยบาย “ไม่ซ่อนรายการเมื่อยังไม่มีคำแปล”',
      null, 'demo:item:906'),
    characteristics: L('พืชอายุสั้น เมล็ดเล็กสีเขียว', null, 'demo:item:906'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', null, 'demo:item:906'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', null, 'demo:item:906'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', null, 'demo:item:906'),
    notes: L('ใช้ทดสอบสถานะคำแปลขาด', null, 'demo:item:906'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'single-locale (th)' },
  },
  {
    legacyId: 907, slug: 'chili-capsicum', kind: 'plant', categorySlug: 'vegetable',
    scientificName: 'Capsicum annuum L.', family: 'Solanaceae', tags: ['vegetable', 'spice'],
    name: L('พริก (ตัวอย่าง)', 'Chilli (demo)', 'demo:item:907'),
    commonName: L('พริก', 'Chilli', 'demo:item:907'),
    summary: L('ตัวอย่างพืชผักสวนครัว แสดงการจัดวางข้อมูลสั้น',
      'A kitchen-garden example with short-form content.', 'demo:item:907'),
    characteristics: L('ผลรูปยาว ผิวเป็นมัน', 'Elongated glossy fruit.', 'demo:item:907'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:907'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', 'Faculty of Agricultural Production (example)', 'demo:item:907'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:907'),
    notes: L('ทดสอบความยาวข้อความต่างกันระหว่างสองภาษา', 'Tests differing text lengths across locales.', 'demo:item:907'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    /** unpublished example — mirrors owner decision #2 (state preserved, hidden from public) */
    legacyId: 908, slug: 'draft-plant-example', kind: 'plant', categorySlug: 'flower',
    scientificName: 'Demo species (draft record)', family: 'Demo family', tags: ['draft'],
    name: L('รายการฉบับร่าง (ยังไม่เผยแพร่)', 'Draft record (unpublished)', 'demo:item:908'),
    commonName: L('ตัวอย่างฉบับร่าง', 'Draft example', 'demo:item:908'),
    summary: L('รายการนี้ใช้สถานะ “ยังไม่เผยแพร่” เพื่อยืนยันว่ารายการร่างไม่แสดงบนหน้าสาธารณะ',
      'This record keeps an unpublished state to prove drafts never appear publicly.', 'demo:item:908'),
    characteristics: L('—', '—', 'demo:item:908'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:908'),
    agency: L('—', '—', 'demo:item:908'),
    people: L('—', '—', 'demo:item:908'),
    notes: L('ทดสอบด่านการมองเห็น (visibility gate)', 'Tests the visibility gate.', 'demo:item:908'),
    media: { legacyPath: null, published: false },
    publication: { state: 'unpublished' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'unpublished-state' },
  },
  {
    legacyId: 909, slug: 'pig-large-white', kind: 'animal', categorySlug: 'pigs',
    scientificName: 'Sus scrofa domesticus', family: 'Suidae', tags: ['pig', 'crossbreed-parent'],
    name: L('สุกรพันธุ์ทดลอง (ตัวอย่าง)', 'Demo pig breed line', 'demo:item:909'),
    commonName: L('สุกร', 'Pig', 'demo:item:909'),
    summary: L('ตัวอย่างพันธุ์สัตว์ แสดงรูปแบบหน้าเดียวกับพืชแต่ใช้จังหวะการจัดวางต่างกัน',
      'An animal example reusing the plant layout with a different rhythm.', 'demo:item:909'),
    characteristics: L('ลำตัวยาว สีขาว ใช้เป็นพ่อแม่พันธุ์ผสม', 'Long body, white coat, used as a parent line.', 'demo:item:909'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:909'),
    agency: L('คณะสัตวศาสตร์และเทคโนโลยี (ตัวอย่าง)', 'Faculty of Animal Science (example)', 'demo:item:909'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:909'),
    notes: L('ทดสอบคอลเลกชันพันธุ์สัตว์', 'Tests the animal collection.', 'demo:item:909'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 910, slug: 'tilapia-fish', kind: 'animal', categorySlug: 'fish',
    scientificName: 'Oreochromis niloticus (L.)', family: 'Cichlidae', tags: ['fish', 'aquaculture'],
    name: L('ปลานิล (ตัวอย่าง)', 'Nile tilapia (demo)', 'demo:item:910'),
    commonName: L('ปลานิล', 'Tilapia', 'demo:item:910'),
    summary: L('ตัวอย่างปลาในโครงการเพาะเลี้ยง แสดงการ์ดภาพในหมวดย่อย',
      'A cultured-fish example inside a sub-category.', 'demo:item:910'),
    characteristics: L('ลำตัวป้อม ครีบหางตัดตรง', 'Deep body, truncated caudal fin.', 'demo:item:910'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:910'),
    agency: L('คณะเทคโนโลยีการประมง (ตัวอย่าง)', 'Faculty of Fisheries Technology (example)', 'demo:item:910'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:910'),
    notes: L('ทดสอบการนำทางสองระดับ', 'Tests two-level navigation.', 'demo:item:910'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 911, slug: 'grasshopper-insect', kind: 'animal', categorySlug: 'insects',
    scientificName: 'Orthoptera sp. (demo)', family: 'Acrididae', tags: ['insect', 'edible-insect'],
    name: L('ตั๊กแตน (ตัวอย่าง)', 'Grasshopper (demo)', 'demo:item:911'),
    commonName: L('ตั๊กแตน', 'Grasshopper', 'demo:item:911'),
    summary: L('ตัวอย่างแมลงเศรษฐกิจ แสดงหมวดที่มีรายการเดียว',
      'An example of an economic insect in a single-item category.', 'demo:item:911'),
    characteristics: L('ปีกยาว ขาหลังแข็งแรง', 'Long wings, strong hind legs.', 'demo:item:911'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:911'),
    agency: L('คณะผลิตกรรมการเกษตร (ตัวอย่าง)', 'Faculty of Agricultural Production (example)', 'demo:item:911'),
    people: L('ยังไม่มีข้อมูลในชุดตัวอย่าง', 'No data in this demo set.', 'demo:item:911'),
    notes: L('ทดสอบสถานะหมวดว่าง/หมวดเดียว', 'Tests single-item categories.', 'demo:item:911'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 912, slug: 'breeding-programme-demo', kind: 'research', categorySlug: 'breeding',
    scientificName: '—', family: '—', tags: ['breeding', 'participatory'],
    name: L('โครงการปรับปรุงพันธุ์ (ตัวอย่าง)', 'Breeding programme (demo)', 'demo:item:912'),
    commonName: L('งานวิจัย', 'Research', 'demo:item:912'),
    summary: L('ตัวอย่างหน้าโครงการวิจัย แสดงบทคัดย่อสองภาษาและรายชื่อนักวิจัยตัวอย่าง',
      'A research page example with a bilingual abstract and placeholder researchers.', 'demo:item:912'),
    characteristics: L('ระยะเวลาโครงการ 3 ปี งบประมาณตัวอย่าง', 'Three-year programme, sample budget.', 'demo:item:912'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:912'),
    agency: L('สำนักวิจัยและส่งเสริมวิชาการการเกษตร (ตัวอย่าง)', 'Office of Agricultural Research and Extension (example)', 'demo:item:912'),
    people: L('นักวิจัยตัวอย่าง ก., นักวิจัยตัวอย่าง ข.', 'Researcher A (demo), Researcher B (demo).', 'demo:item:912'),
    notes: L('ทดสอบหน้าโครงการวิจัยและบทคัดย่อ', 'Tests the research detail page and abstract.', 'demo:item:912'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  {
    legacyId: 913, slug: 'soil-health-programme', kind: 'research', categorySlug: 'breeding',
    scientificName: '—', family: '—', tags: ['soil', 'regenerative'],
    name: L('โครงการสุขภาพดิน (ตัวอย่าง)', 'Soil-health programme (demo)', 'demo:item:913'),
    commonName: L('งานวิจัย', 'Research', 'demo:item:913'),
    summary: L('ตัวอย่างโครงการวิจัยเชิงพื้นที่ ใช้ทดสอบการแสดงผลหลายหมวด',
      'A field-research example, used to test multi-category display.', 'demo:item:913'),
    characteristics: L('แปลงทดลอง 5 แห่ง (ตัวอย่าง)', 'Five trial sites (sample).', 'demo:item:913'),
    origin: L('ข้อความตัวอย่างเพื่อการออกแบบ', 'Design placeholder text.', 'demo:item:913'),
    agency: L('สำนักวิจัยและส่งเสริมวิชาการการเกษตร (ตัวอย่าง)', 'Office of Agricultural Research and Extension (example)', 'demo:item:913'),
    people: L('นักวิจัยตัวอย่าง ค.', 'Researcher C (demo).', 'demo:item:913'),
    notes: L('ทดสอบหน้าค้นหาเมื่อมีหลายประเภท', 'Tests search across item kinds.', 'demo:item:913'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic' },
  },
  // English-only on purpose: exercises the *reverse* fallback direction, so the Thai page
  // must show the English source text with the "no translation yet" badge (never hide the record).
  {
    legacyId: 914, slug: 'cover-crop-trial', kind: 'research', categorySlug: 'breeding',
    scientificName: '—', family: '—', tags: ['cover crop', 'soil'],
    name: L(null, 'Cover-crop trial (demo)', 'demo:item:914'),
    commonName: L(null, 'Research', 'demo:item:914'),
    summary: L(null, 'An English-only record kept in the demo set so the Thai site can show the fallback state.', 'demo:item:914'),
    characteristics: L(null, 'Three replicated plots (sample).', 'demo:item:914'),
    origin: L(null, 'Design placeholder text.', 'demo:item:914'),
    agency: L(null, 'Office of Agricultural Research and Extension (example)', 'demo:item:914'),
    people: L(null, 'Researcher D (demo).', 'demo:item:914'),
    notes: L(null, 'English-only fixture — the Thai page shows the source-language badge.', 'demo:item:914'),
    media: { legacyPath: null, published: false },
    publication: { state: 'published' },
    provenance: { source: 'demo-fixture', contentStatus: 'demo-placeholder', reviewed: false, note: 'synthetic, english-only' },
  },
];

/* ---------------- derived helpers (single source of truth for the UI) ---------------- */

export const kinds: readonly ItemKind[] = ['plant', 'animal', 'research'] as const;

export const publishedItems = items.filter((i) => i.publication.state === 'published');
export const draftItems = items.filter((i) => i.publication.state !== 'published');

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoryPath(slug: string): string[] {
  const path: string[] = [];
  let current = categoryBySlug(slug);
  while (current) {
    path.unshift(current.slug);
    current = current.parentSlug ? categoryBySlug(current.parentSlug) : undefined;
  }
  return path;
}

export function childCategories(slug: string): Category[] {
  return categories.filter((c) => c.parentSlug === slug);
}

/** category + all descendants (mirrors the C4 subtree counting rule) */
export function categorySubtree(slug: string): string[] {
  const out = [slug];
  for (const child of childCategories(slug)) out.push(...categorySubtree(child.slug));
  return out;
}

export function itemsInCategoryTree(slug: string): DemoItem[] {
  const slugs = new Set(categorySubtree(slug));
  return publishedItems.filter((i) => slugs.has(i.categorySlug));
}

export function itemsOfKind(kind: ItemKind): DemoItem[] {
  return publishedItems.filter((i) => i.kind === kind);
}

export function rootCategories(kind: ItemKind): Category[] {
  const inKind = new Set(categories.filter((c) => c.kind === kind).map((c) => c.slug));
  return categories.filter((c) => c.parentSlug === null && inKind.has(c.slug));
}

export function relatedItems(item: DemoItem, limit = 3): DemoItem[] {
  return publishedItems
    .filter((i) => i.slug !== item.slug && (i.kind === item.kind || i.categorySlug === item.categorySlug))
    .slice(0, limit);
}

export function itemBySlug(slug: string): DemoItem | undefined {
  return publishedItems.find((i) => i.slug === slug);
}

/** section headline text used by collection pages */
export function collectionLabelKey(kind: ItemKind): 'plants' | 'animals' | 'research' {
  return kind === 'plant' ? 'plants' : kind === 'animal' ? 'animals' : 'research';
}

export const catalogueStats = {
  plants: itemsOfKind('plant').length,
  animals: itemsOfKind('animal').length,
  research: itemsOfKind('research').length,
  categories: categories.length,
  drafts: draftItems.length,
};
