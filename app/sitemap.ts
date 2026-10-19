import type { MetadataRoute } from 'next';
import prophets from '@/data/prophets.json';
import surahs from '@/data/surahs.json';
import seoDates from '@/data/seo-lastmod.json';
import { baseUrl } from '@/lib/seo';

type SeoPath = keyof typeof seoDates;
function page(path: SeoPath, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number): MetadataRoute.Sitemap[number] {
  const stamp = seoDates[path];
  return { url: `${baseUrl}${path === '/' ? '/' : `${path.replace(/\/$/, '')}/`}`, lastModified: new Date(stamp), changeFrequency, priority };
}
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    page('/', 'daily', 1), page('/about', 'monthly', 0.6), page('/quran', 'weekly', 0.9), page('/athkar', 'weekly', 0.8), page('/duas', 'weekly', 0.8), page('/hadith', 'monthly', 0.8), page('/stories', 'monthly', 0.7),
    page('/prayer-times', 'daily', 0.8), page('/qibla', 'monthly', 0.7), page('/tasbih', 'monthly', 0.7), page('/download', 'monthly', 0.6), page('/privacy', 'yearly', 0.3), page('/terms', 'yearly', 0.3),
  ];
  pages.push(...surahs.map(s => page(`/quran/${s.id}` as SeoPath, 'monthly', 0.75)));
  pages.push(...prophets.map(p => page(`/stories/${p.slug}` as SeoPath, 'monthly', 0.65)));
  return pages;
}
