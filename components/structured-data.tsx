import { author, baseUrl, siteDescription, siteUrl } from '@/lib/seo';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export function StructuredData({ data }: { data: { [key: string]: JsonValue } | { [key: string]: JsonValue }[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export function SiteStructuredData() {
  return <StructuredData data={{ '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': `${baseUrl}/#website`, name: 'أنا مسلم', alternateName: 'Ana Muslim', url: siteUrl(), inLanguage: 'ar', description: siteDescription,
      publisher: { '@type': 'Person', ...author }, potentialAction: { '@type': 'SearchAction', target: `${baseUrl}/hadith/?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
    { '@type': 'Organization', '@id': `${baseUrl}/#organization`, name: 'أنا مسلم', url: siteUrl(), logo: `${baseUrl}/icon.png`, founder: { '@type': 'Person', ...author } },
  ] }} />;
}
export function BreadcrumbData({ items }: { items: { name: string; path: string }[] }) {
  return <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ name: 'الرئيسية', path: '/' }, ...items].map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: siteUrl(item.path) })) }} />;
}
export function PageData({ title, path, type = 'WebPage', description }: { title: string; path: string; type?: string; description: string }) {
  return <StructuredData data={{ '@context': 'https://schema.org', '@type': type, name: title, description, url: siteUrl(path), inLanguage: 'ar' }} />;
}
export function NamedStructuredData({ data }: { data: { [key: string]: JsonValue } }) { return <StructuredData data={{ '@context': 'https://schema.org', ...data }} />; }
