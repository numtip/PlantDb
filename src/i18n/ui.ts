/**
 * PlantDb i18n — typed, centralized UI dictionaries.
 *
 * Rules (C5 owner directive):
 *  - no scattered hardcoded UI strings anywhere in components
 *  - every key must exist in both locales; `en` is typed as `Dict` so a missing
 *    key is a TypeScript error, not a runtime surprise
 *  - Thai is the default locale and the source language for the UI
 */
export type Locale = 'th' | 'en';
export const locales: readonly Locale[] = ['th', 'en'] as const;
export const defaultLocale: Locale = 'th';

/** Short self-names for the language switcher (never translated). */
export const localeNames: Record<Locale, string> = { th: 'ไทย', en: 'English' };
/** BCP-47 language subtags used for <html lang>, hreflang, and the language switcher. */
export const localeTags: Record<Locale, string> = { th: 'th', en: 'en' };

/** og:locale wants language_TERRITORY. */
export const ogLocales: Record<Locale, string> = { th: 'th_TH', en: 'en_US' };

export const dictionaries = {
  th: {
    meta: {
      siteName: 'ฐานข้อมูลพันธุ์พืชและพันธุ์สัตว์ มหาวิทยาลัยแม่โจ้',
      siteShort: 'PlantDb',
      locale: 'th',
    },
    nav: {
      home: 'หน้าหลัก',
      plants: 'พันธุ์พืช',
      animals: 'พันธุ์สัตว์',
      research: 'งานวิจัย',
      about: 'เกี่ยวกับโครงการ',
      search: 'ค้นหา',
      menu: 'เมนูหลัก',
      languageSwitcher: 'เปลี่ยนภาษา',
      switchTo: 'ดูเวอร์ชันภาษาอังกฤษ',
    },
    footer: {
      title: 'PlantDb — ตัวอย่างเว็บไซต์เพื่อการรีวิว',
      note: 'หน้านี้เป็นตัวอย่างเพื่อการออกแบบ (design preview) เนื้อหาทั้งหมดเป็นข้อมูลตัวอย่างที่ปลอดภัยสำหรับการเผยแพร่สาธารณะ ยังไม่เปิดใช้งานจริง',
      sectionExplore: 'สำรวจ',
      sectionAbout: 'เกี่ยวกับ',
      sectionLegal: 'หมายเหตุ',
      provenance: 'ข้อมูลต้นทาง: สแนปช็อตภายใน (private) — ไม่ได้เผยแพร่ข้อมูลดิบ',
      rights: 'มหาวิทยาลัยแม่โจ้ · ตัวอย่างสำหรับการรีวิว',
    },
    hero: {
      eyebrow: 'คอลเลกชันพฤกษศาสตร์ มหาวิทยาลัยแม่โจ้',
      title: 'พันธุ์พืช พันธุ์สัตว์ และงานวิจัยปรับปรุงพันธุ์ ในมุมมองพิพิธภัณฑ์',
      lead: 'สำรวจพันธุ์พืช พันธุ์สัตว์ และโครงการปรับปรุงพันธุ์ของมหาวิทยาลัย ในประสบการณ์การอ่านแบบวารสารพฤกษศาสตร์ — ค้นหาได้ทั้งชื่อไทย ชื่อสามัญ และชื่อวิทยาศาสตร์',
      searchLabel: 'ค้นหาพันธุ์พืช พันธุ์สัตว์ งานวิจัย',
      searchPlaceholder: 'ลองพิมพ์ เช่น ข้าว, rice, Oryza sativa',
      cta: 'เริ่มสำรวจคอลเลกชัน',
      ctaSecondary: 'อ่านเกี่ยวกับโครงการ',
    },
    collections: {
      plants: { title: 'พันธุ์พืช', lead: 'ไม้ดอก ไม้ผล พืชผัก และพืชไร่ ที่รวบรวมและปรับปรุงพันธุ์โดยมหาวิทยาลัย' },
      animals: { title: 'พันธุ์สัตว์', lead: 'สุกร ปลา และแมลง ที่คัดเลือกและพัฒนาสายพันธุ์ในโครงการวิจัย' },
      research: { title: 'งานวิจัยปรับปรุงพันธุ์', lead: 'โครงการวิจัยที่อยู่เบื้องหลังพันธุ์พืชและพันธุ์สัตว์แต่ละรายการ' },
    },
    labels: {
      catalogue: 'แคตตาล็อก',
      results: 'รายการ',
      resultCount: 'พบ {count} รายการ',
      filters: 'ตัวกรอง',
      filterCategory: 'หมวด',
      filterAll: 'ทั้งหมด',
      filterClear: 'ล้างตัวกรอง',
      filterType: 'ประเภท',
      sort: 'เรียงตาม',
      sortName: 'ชื่อ (ก–ฮ)',
      sortScientific: 'ชื่อวิทยาศาสตร์',
      viewDetail: 'ดูรายละเอียด',
      backToCollection: 'กลับสู่คอลเลกชัน',
      exploreCollection: 'สำรวจคอลเลกชัน',
      exploreCategories: 'สำรวจตามหมวด',
      emptySearchHint: 'ลองใช้คำค้นที่สั้นลง หรือเลือกดูตามหมวดแทน',
      searchFor: 'ผลการค้นหา',
      searchResultsFor: 'ผลการค้นหาสำหรับ “{term}”',
      searching: 'กำลังค้นหา…',
      keyboardHint: 'กด Enter เพื่อค้นหา',
      noImage: 'ยังไม่มีรูปภาพสำหรับรายการนี้',
      demoContent: 'ข้อมูลตัวอย่างเพื่อการออกแบบ',
      originalLanguage: 'ยังไม่มีคำแปล — แสดงต้นฉบับ',
      aboutProject: 'เกี่ยวกับโครงการ',
      publishedState: 'สถานะการเผยแพร่',
      published: 'เผยแพร่',
      unpublished: 'ยังไม่เผยแพร่',
      provenance: 'ที่มา',
      itemCount: '{count} รายการ',
      relatedItems: 'รายการที่เกี่ยวข้อง',
      tags: 'แท็ก',
      category: 'หมวด',
      breadcrumbHome: 'หน้าหลัก',
    },
    detail: {
      overview: 'ภาพรวม',
      taxonomy: 'การจำแนก',
      characteristics: 'ลักษณะประจำพันธุ์',
      origin: 'ที่มาและประวัติ',
      people: 'ผู้พัฒนาและผู้รวบรวมพันธุ์',
      notes: 'ข้อจำกัดและความสำคัญ',
      media: 'ภาพประกอบ',
      sourceData: 'ข้อมูลต้นทาง',
      scientificName: 'ชื่อวิทยาศาสตร์',
      commonName: 'ชื่อสามัญ',
      thaiName: 'ชื่อพันธุ์ (ไทย)',
      family: 'วงศ์',
      agency: 'หน่วยงาน',
      breeder: 'ผู้ปรับปรุงพันธุ์',
      collector: 'ผู้รวบรวมพันธุ์',
      certYear: 'ปีที่รับรองพันธุ์',
      abstract: 'บทคัดย่อ',
      authors: 'คณะผู้วิจัย',
      researchField: 'สาขาการวิจัย',
    },
    about: {
      lead: 'หน้าดังกล่าวเป็นตัวอย่างการแสดงเนื้อหา CMS ที่แยกจากข้อมูลพันธุ์พืช โดยยังคงตัวตนของรายการต้นทางไว้',
      sectionProject: 'ที่มาของโครงการ',
      sectionData: 'ข้อมูลและการดูแล',
      sectionPublish: 'การเผยแพร่',
      bodyNote: 'เนื้อหาจริงจะถูกคัดลอกจากแหล่งที่ได้รับอนุมัติเท่านั้น หน้าตัวอย่างนี้ใช้ข้อความสำหรับการออกแบบ',
    },
    states: {
      emptyTitle: 'ยังไม่พบรายการที่ตรงกัน',
      emptyBody: 'ลองลดตัวกรอง หรือค้นหาด้วยชื่อวิทยาศาสตร์/ชื่อสามัญ',
      errorTitle: 'เกิดข้อผิดพลาดในการแสดงผล',
      errorBody: 'หน้านี้โหลดเนื้อหาไม่สำเร็จ กรุณาลองใหม่ หรือกลับไปที่หน้าหลัก',
      notFoundTitle: 'ไม่พบหน้าที่ต้องการ',
      notFoundBody: 'ลิงก์อาจเปลี่ยนไปแล้ว ลองค้นหาจากหน้าหลัก หรือสำรวจตามหมวด',
      loadingTitle: 'กำลังโหลดคอลเลกชัน',
      retry: 'ลองใหม่',
      backHome: 'กลับหน้าหลัก',
    },
    a11y: {
      skipToContent: 'ข้ามไปยังเนื้อหาหลัก',
      mainNav: 'เมนูหลัก',
      breadcrumbNav: 'เส้นทางนำทาง',
      searchForm: 'แบบฟอร์มค้นหา',
      resultsRegion: 'รายการผลลัพธ์',
      filtersRegion: 'ตัวกรอง',
      footerNav: 'เมนูส่วนท้าย',
      imageOf: 'ภาพประกอบของ {name}',
      decorative: 'ภาพประดับ',
    },
    seo: {
      homeTitle: 'PlantDb — คอลเลกชันพันธุ์พืชและพันธุ์สัตว์ มหาวิทยาลัยแม่โจ้',
      homeDesc: 'สำรวจพันธุ์พืช พันธุ์สัตว์ และงานวิจัยปรับปรุงพันธุ์ของมหาวิทยาลัยแม่โจ้ ผ่านประสบการณ์การอ่านแบบพิพิธภัณฑ์พฤกษศาสตร์',
      plantsTitle: 'พันธุ์พืช — PlantDb',
      plantsDesc: 'คอลเลกชันพันธุ์พืช ไม้ดอก ไม้ผล พืชผัก และพืชไร่',
      animalsTitle: 'พันธุ์สัตว์ — PlantDb',
      animalsDesc: 'คอลเลกชันพันธุ์สัตว์ สุกร ปลา และแมลง',
      researchTitle: 'งานวิจัยปรับปรุงพันธุ์ — PlantDb',
      researchDesc: 'โครงการวิจัยปรับปรุงพันธุ์พืชและพันธุ์สัตว์',
      aboutTitle: 'เกี่ยวกับโครงการ — PlantDb',
      aboutDesc: 'ที่มา หลักการ และการดูแลข้อมูลของโครงการ PlantDb',
      searchTitle: 'ค้นหา — PlantDb',
      searchDesc: 'ค้นหาพันธุ์พืช พันธุ์สัตว์ และงานวิจัย ด้วยชื่อไทย ชื่อสามัญ หรือชื่อวิทยาศาสตร์',
    },
  },

  en: {
    meta: {
      siteName: 'Plant and Animal Variety Database, Maejo University',
      siteShort: 'PlantDb',
      locale: 'en',
    },
    nav: {
      home: 'Home',
      plants: 'Plants',
      animals: 'Animals',
      research: 'Research',
      about: 'About',
      search: 'Search',
      menu: 'Main menu',
      languageSwitcher: 'Language',
      switchTo: 'ดูเวอร์ชันภาษาไทย',
    },
    footer: {
      title: 'PlantDb — design preview',
      note: 'This is a design preview. All content is public-safe demo material; the site is not live.',
      sectionExplore: 'Explore',
      sectionAbout: 'About',
      sectionLegal: 'Notes',
      provenance: 'Source data: private internal snapshot — no raw data is published.',
      rights: 'Maejo University · review preview',
    },
    hero: {
      eyebrow: 'Botanical collection, Maejo University',
      title: 'Plant and animal varieties, framed as a research museum',
      lead: 'Explore the university’s plant varieties, animal breeds and breeding research in a botanical-editorial reading experience — searchable by Thai name, common name and scientific name.',
      searchLabel: 'Search plants, animals and research',
      searchPlaceholder: 'Try: rice, ข้าว, Oryza sativa',
      cta: 'Start exploring',
      ctaSecondary: 'Read about the project',
    },
    collections: {
      plants: { title: 'Plants', lead: 'Ornamentals, fruit trees, vegetables and field crops collected and bred by the university.' },
      animals: { title: 'Animals', lead: 'Pigs, fish and insects selected and developed through research programmes.' },
      research: { title: 'Breeding research', lead: 'The research projects behind each plant variety and animal breed.' },
    },
    labels: {
      catalogue: 'Catalogue',
      results: 'Results',
      resultCount: '{count} items',
      filters: 'Filters',
      filterCategory: 'Category',
      filterAll: 'All',
      filterClear: 'Clear filters',
      filterType: 'Type',
      sort: 'Sort',
      sortName: 'Name (A–Z)',
      sortScientific: 'Scientific name',
      viewDetail: 'View details',
      backToCollection: 'Back to collection',
      exploreCollection: 'Explore the collection',
      exploreCategories: 'Browse by category',
      emptySearchHint: 'Try a shorter query, or browse by category instead.',
      searchFor: 'Search results',
      searchResultsFor: 'Results for “{term}”',
      searching: 'Searching…',
      keyboardHint: 'Press Enter to search',
      noImage: 'No image available for this item yet.',
      demoContent: 'Demo content for design review',
      originalLanguage: 'No translation yet — showing the original',
      aboutProject: 'About the project',
      publishedState: 'Publication state',
      published: 'Published',
      unpublished: 'Unpublished',
      provenance: 'Provenance',
      itemCount: '{count} items',
      relatedItems: 'Related items',
      tags: 'Tags',
      category: 'Category',
      breadcrumbHome: 'Home',
    },
    detail: {
      overview: 'Overview',
      taxonomy: 'Classification',
      characteristics: 'Variety characteristics',
      origin: 'Origin and history',
      people: 'Breeders and collectors',
      notes: 'Limitations and significance',
      media: 'Media',
      sourceData: 'Source data',
      scientificName: 'Scientific name',
      commonName: 'Common name',
      thaiName: 'Thai variety name',
      family: 'Family',
      agency: 'Agency',
      breeder: 'Breeder',
      collector: 'Collector',
      certYear: 'Certification year',
      abstract: 'Abstract',
      authors: 'Researchers',
      researchField: 'Research field',
    },
    about: {
      lead: 'This page demonstrates a CMS projection kept separate from the variety records, while the original record identity is preserved.',
      sectionProject: 'Where the project comes from',
      sectionData: 'Data and stewardship',
      sectionPublish: 'Publication',
      bodyNote: 'Real content will be copied only from approved sources; this preview uses design placeholder text.',
    },
    states: {
      emptyTitle: 'No matching items',
      emptyBody: 'Try removing a filter, or search by scientific or common name.',
      errorTitle: 'Something went wrong',
      errorBody: 'This page could not load its content. Try again, or return to the homepage.',
      notFoundTitle: 'Page not found',
      notFoundBody: 'The link may have changed. Search from the homepage, or browse by category.',
      loadingTitle: 'Loading the collection',
      retry: 'Try again',
      backHome: 'Back to homepage',
    },
    a11y: {
      skipToContent: 'Skip to main content',
      mainNav: 'Main navigation',
      breadcrumbNav: 'Breadcrumb',
      searchForm: 'Search form',
      resultsRegion: 'Search results',
      filtersRegion: 'Filters',
      footerNav: 'Footer navigation',
      imageOf: 'Illustration of {name}',
      decorative: 'Decorative artwork',
    },
    seo: {
      homeTitle: 'PlantDb — Plant and animal varieties, Maejo University',
      homeDesc: 'Explore plant varieties, animal breeds and breeding research from Maejo University in a botanical-museum reading experience.',
      plantsTitle: 'Plants — PlantDb',
      plantsDesc: 'The plant collection: ornamentals, fruit trees, vegetables and field crops.',
      animalsTitle: 'Animals — PlantDb',
      animalsDesc: 'The animal collection: pigs, fish and insects.',
      researchTitle: 'Breeding research — PlantDb',
      researchDesc: 'Research projects behind the plant varieties and animal breeds.',
      aboutTitle: 'About the project — PlantDb',
      aboutDesc: 'Origin, principles and data stewardship of the PlantDb project.',
      searchTitle: 'Search — PlantDb',
      searchDesc: 'Search plants, animals and research by Thai name, common name or scientific name.',
    },
  },
} as const;

export type Dict = typeof dictionaries.th;

/**
 * Compile-time proof that `en` implements every Thai key (and vice versa): the *shape*
 * of the key tree must match, while the string values are free to differ per locale.
 */
type ShapeOf<T> = { [K in keyof T]: T[K] extends string ? string : ShapeOf<T[K]> };
const _exhaustiveEn: ShapeOf<Dict> = dictionaries.en;
const _exhaustiveTh: ShapeOf<typeof dictionaries.en> = dictionaries.th;
void _exhaustiveEn;
void _exhaustiveTh;

export function useTranslations(locale: Locale): Dict {
  return locale === 'en' ? (dictionaries.en as unknown as Dict) : dictionaries.th;
}

/** Tiny placeholder interpolation: "{count} items" -> "12 items" */
export function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] === undefined ? `{${key}}` : String(params[key]));
}
