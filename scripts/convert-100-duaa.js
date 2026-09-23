const fs = require('fs');
const path = require('path');

// ============================================================
// 1. اقرأ ملف المصدر
// ============================================================
const sourcePath = path.join(__dirname, '../data/source-100duaa.json');
const raw = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// ============================================================
// 2. خريطة التصنيفات: استخرجها تلقائيًا من البيانات
// ============================================================
const uniqueCategories = [...new Set(raw.map((item) => item.category))];

// رتّب التصنيفات أبجديًا
uniqueCategories.sort((a, b) => a.localeCompare(b, 'ar'));

const categoryMap = {};
const categories = uniqueCategories.map((name, i) => {
  const id = i + 1;
  categoryMap[name] = id;
  return { id, name };
});

// ============================================================
// 3. حول كل دعاء
// ============================================================
let idCounter = 1;
const duas = [];

raw.forEach((item) => {
  const categoryId = categoryMap[item.category];

  item.duaa.forEach((duaItem, indexInCategory) => {
    const text = (duaItem.text || '').trim();
    if (!text || text.length < 5) return;

    // ===== بناء المرجع =====
    let reference = 'من الكتاب والسنة';
    let sourceUrl = '';
    const sourceType = duaItem.source?.type || 'general';
    const firstRef = duaItem.source?.references?.[0];

    if (firstRef) {
      // حالة القرآن
      if (sourceType === 'quran' && firstRef.surah) {
        const surahName = firstRef.surah.name;
        const surahNum = firstRef.surah.number;
        const ayahFrom = firstRef.ayah?.from ?? '';
        const ayahTo = firstRef.ayah?.to ?? ayahFrom;

        reference = `سورة ${surahName} · الآية ${ayahFrom}${
          ayahTo !== ayahFrom ? '-' + ayahTo : ''
        }`;

        sourceUrl = `https://quran.com/${surahNum}/${ayahFrom}`;
      }
      // حالة الحديث
      else if (sourceType === 'hadith') {
        const parts = [];
        if (firstRef.mohdith) parts.push(firstRef.mohdith);
        if (firstRef.book) parts.push(`في ${firstRef.book}`);
        if (firstRef.numberOrPage) parts.push(`(${firstRef.numberOrPage})`);
        reference = parts.length > 0 ? `رواه ${parts.join(' ')}` : 'من السنة النبوية';
        sourceUrl = 'https://sunnah.com';
      }
    }

    // ===== توليد عنوان من النص =====
    // نأخذ أول 50 حرفًا، ونقطع عند آخر كلمة كاملة
    let title = text.substring(0, 50);
    if (text.length > 50) {
      const lastSpace = title.lastIndexOf(' ');
      if (lastSpace > 30) title = title.substring(0, lastSpace);
      title = title.trim() + '…';
    }

    // ===== المعجم =====
    // حول vocabulary إلى نص مقروء
    let vocabularyText = null;
    if (Array.isArray(duaItem.vocabulary) && duaItem.vocabulary.length > 0) {
      vocabularyText = duaItem.vocabulary
        .map((v) => `• ${v.text}: ${v.meaning}`)
        .join('\n');
    }

    duas.push({
      id: idCounter++,
      category_id: categoryId,
      title,
      text,
      reference,
      source_url: sourceUrl,
      source_type: sourceType,
      vocabulary: vocabularyText,
    });
  });
});

// ============================================================
// 4. اكتب الملف النهائي
// ============================================================
const output = {
  dua_categories: categories,
  duas,
};

const outputPath = path.join(__dirname, '../data/content-duas.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

// ============================================================
// 5. تقرير
// ============================================================
console.log('✅ تم التحويل بنجاح!\n');
console.log(`📖 إجمالي الأدعية: ${duas.length}`);
console.log(`📂 عدد التصنيفات: ${categories.length}`);
console.log(`\n📋 التصنيفات:\n`);

categories.forEach((c) => {
  const count = duas.filter((d) => d.category_id === c.id).length;
  console.log(`  [${c.id}] ${c.name} (${count})`);
});

console.log(`\n📁 الملف الناتج: ${outputPath}`);