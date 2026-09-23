const fs = require('fs');
const path = require('path');

// 1. اقرأ ملف azkar-raw.json
const rawPath = path.join(__dirname, '../data/azkar-raw.json');
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

// 2. استخرج التصنيفات الفريدة تلقائيًا
const uniqueCategories = [...new Set(raw.rows.map(row => row[0]))];

// 3. رتّبها أبجديًا (أو اتركها بترتيب الظهور)
uniqueCategories.sort();

// 4. أعطِ كل تصنيف رقمًا فريدًا يبدأ من 1
const categoryMap = {};
uniqueCategories.forEach((name, index) => {
  categoryMap[name] = index + 1;
});

// 5. أنشئ قائمة التصنيفات
const categories = uniqueCategories.map(name => ({
  id: categoryMap[name],
  name: name,
}));

// 6. حوّل الأذكار
const athkar = raw.rows.map((row, index) => ({
  id: index + 1,
  category_id: categoryMap[row[0]],   // ← رقم فريد مضمون
  text: row[1] || '',
  repeat_count: parseInt(row[3]) || 1,
  reference: row[4] || 'حصن المسلم',
  source_url: 'https://github.com/osamayy/azkar-db',
  description: row[2] || '',
}));

// 7. اكتب النتيجة
const output = {
  athkar_categories: categories,
  athkar: athkar,
};

const outputPath = path.join(__dirname, '../data/content-athkar.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

// 8. تقرير
console.log('✅ تم التحويل بنجاح!');
console.log(`📊 إجمالي الأذكار: ${athkar.length}`);
console.log(`📂 عدد التصنيفات: ${categories.length}`);
console.log('');
console.log('التصنيفات:');
categories.forEach(c => console.log(`  - [${c.id}] ${c.name}`));
console.log('');
console.log(`📁 الملف الناتج: ${outputPath}`);