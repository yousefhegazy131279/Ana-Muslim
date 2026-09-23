const fs = require('fs');
const path = require('path');

// ============================================================
// تخزين مؤقت للتصنيفات
// ============================================================
const categoryMap = new Map(); // name -> id
let nextCategoryId = 1;

function getCategoryId(name) {
  const clean = name.trim();
  if (categoryMap.has(clean)) return categoryMap.get(clean);
  const id = nextCategoryId++;
  categoryMap.set(clean, id);
  return id;
}

// ============================================================
// تخزين مؤقت للنصوص لمنع التكرار
// ============================================================
const seenTexts = new Set();
function isDuplicate(text) {
  // نظّف النص للمقارنة (إزالة التشكيل والمسافات الزائدة)
  const clean = text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (seenTexts.has(clean)) return true;
  seenTexts.add(clean);
  return false;
}

// ============================================================
// مصفوفة النتائج
// ============================================================
const allDuas = [];
let idCounter = 1;

function addDua({ categoryName, title, text, reference, sourceUrl, sourceType, vocabulary }) {
  if (!text || text.trim().length < 5) return; // تجاهل النصوص القصيرة جدًا
  if (isDuplicate(text)) return;

  allDuas.push({
    id: idCounter++,
    category_id: getCategoryId(categoryName || 'أدعية متنوعة'),
    title: title || text.substring(0, 60).trim() + (text.length > 60 ? '…' : ''),
    text: text.trim(),
    reference: reference || 'المصدر الأصلي',
    source_url: sourceUrl || '',
    source_type: sourceType || 'general',
    vocabulary: vocabulary || null,
  });
}

// ============================================================
// المصدر 1: 100 دعاء من الكتاب والسنة
// ============================================================
function load100Duaa() {
  const filePath = path.join(__dirname, '../data/source-100duaa.json');
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️  ملف source-100duaa.json غير موجود، تخطّيه.');
    return;
  }
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let count = 0;

  raw.forEach((item) => {
    const categoryName = item.category || 'أدعية متنوعة';
    (item.duaa || []).forEach((d) => {
      const ref = d.source?.references?.[0];
      let reference = 'من الكتاب والسنة';
      let sourceUrl = 'https://github.com/AhmedElTabarani/100-duaa-from-the-book-and-authentic-sunnah';

      if (ref) {
        if (d.source.type === 'quran' && ref.surah) {
          reference = `سورة ${ref.surah.name} · الآية ${ref.ayah?.from ?? ''}`;
          sourceUrl = `https://quran.com/${ref.surah.number}/${ref.ayah?.from ?? ''}`;
        } else if (ref.mohdith && ref.book) {
          reference = `رواه ${ref.mohdith} في ${ref.book}`;
          if (ref.numberOrPage) reference += ` (${ref.numberOrPage})`;
        }
      }

      addDua({
        categoryName,
        title: null, // سيُولَّد تلقائيًا
        text: d.text,
        reference,
        sourceUrl,
        sourceType: d.source?.type || 'hadith',
        vocabulary: d.vocabulary,
      });
      count++;
    });
  });

  console.log(`✅ 100-دعاء: ${count} دعاء`);
}

// ============================================================
// المصدر 2: حصن المسلم (rn0x/Adhkar-json أو osamayy/azkar-db)
// ============================================================
function loadHisn() {
  // جرّب عدة مسارات محتملة
  const candidates = [
    path.join(__dirname, '../data/source-hisn.json'),
    path.join(__dirname, '../data/azkar-raw.json'),
  ];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    console.warn('⚠️  لا يوجد ملف حصن المسلم، تخطّيه.');
    return;
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let count = 0;

  // الحالة 1: بنية rn0x/Adhkar-json (مصفوفة من الفئات)
  if (Array.isArray(raw) && raw[0]?.category && Array.isArray(raw[0]?.array)) {
    raw.forEach((cat) => {
      (cat.array || []).forEach((item) => {
        addDua({
          categoryName: cat.category,
          title: null,
          text: item.text,
          reference: 'حصن المسلم',
          sourceUrl: 'https://github.com/rn0x/Adhkar-json',
          sourceType: 'dhikr',
        });
        count++;
      });
    });
  }
  // الحالة 2: بنية osamayy/azkar-db (rows: [[category, text, ...]])
  else if (Array.isArray(raw.rows)) {
    raw.rows.forEach((row) => {
      addDua({
        categoryName: row[0],
        title: null,
        text: row[1],
        reference: row[4] || 'حصن المسلم',
        sourceUrl: 'https://github.com/osamayy/azkar-db',
        sourceType: 'dhikr',
      });
      count++;
    });
  } else {
    console.warn('⚠️  بنية ملف حصن المسلم غير معروفة.');
    return;
  }

  console.log(`✅ حصن المسلم: ${count} دعاء/ذكر`);
}

// ============================================================
// تنفيذ الدمج
// ============================================================
console.log('🔄 بدء دمج الأدعية...\n');
load100Duaa();
loadHisn();

console.log(`\n📊 الإجمالي بعد إزالة التكرار: ${allDuas.length} دعاء`);

// ============================================================
// ترتيب التصنيفات أبجديًا وإعادة ترقيمها
// ============================================================
const sortedCategories = [...categoryMap.entries()]
  .map(([name, oldId]) => ({ name, oldId }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

const idRemap = new Map();
const finalCategories = sortedCategories.map((cat, i) => {
  const newId = i + 1;
  idRemap.set(cat.oldId, newId);
  return { id: newId, name: cat.name };
});

// ============================================================
// إعادة ترقيم category_id في الأدعية
// ============================================================
allDuas.forEach((d) => {
  d.category_id = idRemap.get(d.category_id) || 1;
});

// ============================================================
// كتابة الملف النهائي
// ============================================================
const output = {
  dua_categories: finalCategories,
  duas: allDuas,
};

const outputPath = path.join(__dirname, '../data/content-duas.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log(`\n✅ تم إنشاء: ${outputPath}`);
console.log(`📂 التصنيفات: ${finalCategories.length}`);
console.log(`📖 الأدعية: ${allDuas.length}`);
console.log('\n📋 التصنيفات النهائية:');
finalCategories.forEach((c) =>
  console.log(`  [${c.id}] ${c.name} (${allDuas.filter((d) => d.category_id === c.id).length})`)
);