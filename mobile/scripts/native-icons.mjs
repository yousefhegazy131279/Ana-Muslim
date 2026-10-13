import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const mobile=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const res=path.join(mobile,'android/app/src/main/res');
const logo=path.join(mobile,'../public/logo.png');
for(const [density,scale] of [['mdpi',1],['hdpi',1.5],['xhdpi',2],['xxhdpi',3],['xxxhdpi',4]]){
 const folder=path.join(res,'mipmap-'+density);await fs.mkdir(folder,{recursive:true});
 for(const name of ['ic_launcher','ic_launcher_round'])await sharp(logo).resize(Math.round(48*scale),Math.round(48*scale)).png().toFile(path.join(folder,name+'.png'));
 const size=Math.round(108*scale),inner=Math.round(66*scale),pad=Math.floor((size-inner)/2);
 await sharp(logo).resize(inner,inner).extend({top:pad,bottom:size-inner-pad,left:pad,right:size-inner-pad,background:'#f7faf5'}).png().toFile(path.join(folder,'ic_launcher_foreground.png'));
}
console.log('Android launcher icons generated');
