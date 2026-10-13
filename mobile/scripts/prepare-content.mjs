import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const mobile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(mobile, '..');
const pub = path.join(mobile, 'public');
await fs.mkdir(pub, { recursive: true });
for (const name of ['quran', 'stories']) await fs.cp(path.join(root, 'data', name), path.join(pub, 'content', name), { recursive: true });
for (const name of ['surahs', 'prophets', 'content-athkar', 'content-duas', 'source-integrity']) await fs.copyFile(path.join(root, 'data', name + '.json'), path.join(pub, 'content', name + '.json'));
await fs.cp(path.join(root, 'public/data/hadith'), path.join(pub, 'content/hadith'), { recursive: true });
await fs.cp(path.join(root, 'public/images/prophets/optimized'), path.join(pub, 'images'), { recursive: true });
await fs.cp(path.join(root, 'public/fonts'), path.join(pub, 'fonts'), { recursive: true });
const fonts = (await fs.readFile(path.join(root, 'app/fonts.css'), 'utf8')).replaceAll('/fonts/', './fonts/');
await fs.writeFile(path.join(pub, 'fonts.css'), fonts);
const manifest = JSON.parse(await fs.readFile(path.join(root, 'data/story-images.json')));
for (const image of Object.values(manifest)) image.src = './images/' + path.basename(image.src);
await fs.writeFile(path.join(pub, 'content/story-images.json'), JSON.stringify(manifest));
await fs.copyFile(path.join(root, 'public/logo-small.webp'), path.join(pub, 'logo.webp'));
for (const size of [192, 512]) await sharp(path.join(root, 'public/logo.png')).resize(size - 32, size - 32, { fit: 'contain', background: '#f7faf5' }).extend({ top: 16, bottom: 16, left: 16, right: 16, background: '#f7faf5' }).png().toFile(path.join(pub, `icon-${size}.png`));
const read = async file => JSON.parse(await fs.readFile(path.join(pub, file)));
const surahs = await read('content/surahs.json');
let ayahs = 0;
for (const s of surahs) { const verses = await read(`content/quran/${s.id}.json`); if (verses.length !== s.total_ayahs) throw Error(`Incomplete surah ${s.id}`); ayahs += verses.length; }
const hadiths = await read('content/hadith/index.json');
const chunks=new Map();
for (const h of hadiths) { if(!chunks.has(h.chunk))chunks.set(h.chunk,await read(`content/hadith/explained-${h.chunk}.json`)); const chunk=chunks.get(h.chunk); if (!chunk[h.id]?.explanation || !chunk[h.id]?.hadith_text) throw Error(`Missing hadith ${h.id}`); }
const stories = await read('content/prophets.json');
for (const s of stories) if (!(await read(`content/stories/${s.slug}.json`)).chapters?.length) throw Error(`Missing story ${s.slug}`);
const files = [];
async function walk(dir) { for (const entry of await fs.readdir(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) await walk(file); else files.push(path.relative(pub, file).replaceAll('\\', '/')); } }
await walk(path.join(pub, 'content'));
const hash = createHash('sha256');
let bytes = 0;
for (const file of files.filter(file=>file!=='content/info.json').sort()) { const data = await fs.readFile(path.join(pub, file)); bytes += data.length; hash.update(file).update(data); }
const athkar = await read('content/content-athkar.json'), duas = await read('content/content-duas.json');
const info = { version: '1.0.0', contentVersion: hash.digest('hex').slice(0, 16), surahs: surahs.length, ayahs, hadiths: hadiths.length, stories: stories.length, athkar: athkar.items?.length ?? athkar.athkar?.length ?? 0, duas: duas.items?.length ?? duas.duas?.length ?? 0, bytes };
await fs.writeFile(path.join(pub, 'content/info.json'), JSON.stringify(info));
await fs.writeFile(path.join(pub, 'manifest.webmanifest'), JSON.stringify({ id: './', name: 'أنا مسلم', short_name: 'أنا مسلم', lang: 'ar', dir: 'rtl', start_url: './', scope: './', display: 'standalone', background_color: '#f7faf5', theme_color: '#046a38', icons: [192, 512].map(size => ({ src: `./icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })) }));
console.log(info);
