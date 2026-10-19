import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'node:fs/promises';
import path from 'node:path';
import surahs from '@/data/surahs.json';
import { Reader, type Ayah } from '@/components/reader';
import { PageHead, arabic } from '@/components/ui';
import { BreadcrumbData, NamedStructuredData } from '@/components/structured-data';
import { pageMetadata } from '@/lib/seo';
export const dynamicParams = false;
export function generateStaticParams() { return surahs.map(s => ({ id: String(s.id) })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; const surah = surahs.find(s => String(s.id) === id);
  if (!surah) return { title: 'السورة غير موجودة', robots: { index: false, follow: false } };
  const title = `سورة ${surah.name_arabic}`;
  const description = `قراءة سورة ${surah.name_arabic}، ${surah.total_ayahs} آية، ${surah.type}، مع التفسير الميسر.`;
  return pageMetadata(title, description, `/quran/${id}`, `/quran/${id}/opengraph-image`, ['قراءة سورة ' + surah.name_arabic]);
}
export default async function Surah({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const surah = surahs.find(s => String(s.id) === id); if (!surah) notFound();
  const ayahs: Ayah[] = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data/quran', `${surah.id}.json`), 'utf8'));
  const title = `سورة ${surah.name_arabic}`; const description = `${surah.type} · ${arabic(surah.total_ayahs)} آية · ترتيبها في المصحف ${arabic(surah.id)}`;
  return <><BreadcrumbData items={[{ name: 'القرآن الكريم', path: '/quran' }, { name: title, path: `/quran/${id}` }]} /><NamedStructuredData data={{ '@type': 'Article', headline: title, description: `سورة ${surah.name_arabic}، ${surah.total_ayahs} آية، ${surah.type}.`, author: { '@type': 'Organization', name: 'أنا مسلم' }, inLanguage: 'ar', isAccessibleForFree: true }} /><PageHead label="القرآن الكريم" title={title} description={description} /><Reader surah={surah.id} initial={ayahs} /></>;
}
