import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tree=JSON.parse(await fs.readFile(path.join(root,'data/prophets-tree.json'),'utf8'));
const output=path.join(root,'public/images/prophets/optimized');
await fs.mkdir(output,{recursive:true});
const manifest={};let originalBytes=0,optimizedBytes=0;
for(const p of tree.prophets){
 const original=await fs.readFile(path.join(root,`public/images/prophets/${p.slug==='zakariya'?'zakariyya':p.slug}.png`));
 const optimized=await sharp(original).resize({width:440,withoutEnlargement:true}).webp({quality:82,effort:5}).toBuffer();
 const filename=`${p.slug}-${createHash('sha256').update(optimized).digest('hex').slice(0,12)}.webp`;
 await fs.writeFile(path.join(output,filename),optimized);
 const blur=await sharp(original).resize(16).webp({quality:40}).toBuffer();
 manifest[p.slug]={src:`/images/prophets/optimized/${filename}`,blurDataURL:`data:image/webp;base64,${blur.toString('base64')}`};
 originalBytes+=original.length;optimizedBytes+=optimized.length;
}
await fs.writeFile(path.join(root,'data/story-images.json'),JSON.stringify(manifest,null,2)+'\n');
await sharp(path.join(root,'public/logo.png')).resize(192,192).webp({quality:88}).toFile(path.join(root,'public/logo-small.webp'));
console.log(JSON.stringify({images:tree.prophets.length,originalBytes,optimizedBytes,reductionPercent:Math.round((1-optimizedBytes/originalBytes)*100)},null,2));
