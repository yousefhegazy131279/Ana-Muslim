import { notFound } from 'next/navigation';
import fs from 'node:fs/promises';
import path from 'node:path';
import surahs from '@/data/surahs.json';
import { Reader, type Ayah } from '@/components/reader';
import { PageHead, arabic } from '@/components/ui';
export const dynamicParams=false;
export function generateStaticParams(){return surahs.map(s=>({id:String(s.id)}))}
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const s=surahs.find(s=>String(s.id)===id);return {title:s?'سورة '+s.name_arabic:'السورة غير موجودة',description:s?`قراءة سورة ${s.name_arabic}، ${s.total_ayahs} آية، مع التفسير الميسر وتلاوة مشاري العفاسي.`:''}}
export default async function Surah({params}:{params:Promise<{id:string}>}){const {id}=await params;const s=surahs.find(s=>String(s.id)===id);if(!s)notFound();const ayahs:Ayah[]=JSON.parse(await fs.readFile(path.join(process.cwd(),'data/quran',s.id+'.json'),'utf8'));return <><PageHead label="القرآن الكريم" title={'سورة '+s.name_arabic} description={`${s.type} · ${arabic(s.total_ayahs)} آية · ترتيبها في المصحف ${arabic(s.id)}`}/><Reader surah={s.id} initial={ayahs}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:'سورة '+s.name_arabic,inLanguage:'ar',description:'القرآن الكريم مع التفسير الميسر',isAccessibleForFree:true}).replace(/</g,'\\u003c')}}/></>}
