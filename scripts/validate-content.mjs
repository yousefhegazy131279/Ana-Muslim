import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const manifest=read('data/source-integrity.json');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const fields=['id','title','hadith_text','explanation','word_meanings','benefits','grade','takhrij','link'];
const original=h=>Object.fromEntries(fields.map(k=>[k,h[k]]));
const verses=new Map();
for(let s=1;s<=114;s++){
 const rows=read(`data/quran/${s}.json`);
 rows.forEach((v,i)=>{assert.equal(v.surah_id,s);assert.equal(v.ayah_number,i+1);assert.ok(v.text_arabic&&v.tafsir_text);verses.set(`${s}:${i+1}`,v)});
 assert.equal(hash(rows),manifest.quran[s],`Quran/tafsir file changed: ${s}`);
}
assert.equal(verses.size,6236);
const index=read('public/data/hadith/index.json'),meta=read('data/hadith-meta.json');
assert.equal(index.length,3582);assert.equal(meta.count,index.length);
assert.equal(new Set(index.map(h=>h.id)).size,index.length);
const hadiths=new Map(),chunks=new Map();
for(const entry of index){
 if(!chunks.has(entry.chunk))chunks.set(entry.chunk,read(`public/data/hadith/explained-${entry.chunk}.json`));
 const h=chunks.get(entry.chunk)[entry.id];assert.ok(h?.hadith_text&&h?.explanation);
 assert.equal(hash(original(h)),manifest.hadith[h.id],`Original source fields changed: ${h.id}`);
 assert.equal(entry.title,h.title);assert.equal(entry.grade,h.grade);hadiths.set(h.id,h);
}
const prophets=read('data/prophets.json');assert.equal(prophets.length,25);
let chapters=0,ayahReferences=0,hadithReferences=0;
for(const p of prophets){
 const story=read(`data/stories/${p.slug}.json`);assert.equal(story.chapters.length,p.chapters);
 for(const chapter of story.chapters){chapters++;
  for(const passage of chapter.passages){assert.equal(passage.verses.length,passage.end-passage.start+1);
   for(const v of passage.verses){assert.deepEqual(v,verses.get(`${v.surah_id}:${v.ayah_number}`));ayahReferences++}}
  for(const h of chapter.hadiths){assert.deepEqual(original(h),original(hadiths.get(h.id)));hadithReferences++}
 }
}
console.log(JSON.stringify({quran:verses.size,hadiths:hadiths.size,prophets:prophets.length,chapters,ayahReferences,hadithReferences,sourceIntegrity:'passed'},null,2));
console.log('This verifies transfer integrity and references, not independent scholarly authentication or completeness.');
