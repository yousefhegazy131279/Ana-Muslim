import type { Metadata } from 'next';

// نستبعد المسارات والاستعلامات من عنوان النشر كي تبقى الروابط الأساسية متسقة.
export const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://anamuslim-hgz.vercel.app').origin;
export const siteDescription = 'دليل كل مسلم — القرآن الكريم والتفسير، والأذكار والأدعية والأحاديث المشروحة وقصص الأنبياء وأدوات يومية ميسّرة.';
export const author = { name: 'يوسف حجازي', url: 'https://hogz.vercel.app' };
export function siteUrl(path = '/') { return `${baseUrl}${path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`}`; }

export function pageMetadata(title: string, description: string, path: string, image = '/opengraph-image', keywords: string[] = []): Metadata {
  const images = [{ url: image, width: 1200, height: 630, alt: title }];
  return {
    title, description, keywords: ['أنا مسلم', 'إسلام', ...keywords], authors: [author],
    alternates: { canonical: siteUrl(path) }, robots: { index: true, follow: true },
    openGraph: { type: 'website', locale: 'ar_SA', siteName: 'أنا مسلم', title, description, url: siteUrl(path), images },
    twitter: { card: 'summary_large_image', creator: '@Yousefhegazy00', title, description, images },
  };
}
