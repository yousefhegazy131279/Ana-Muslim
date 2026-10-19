import { PageHead } from '@/components/ui';
import { Hadith } from '@/components/hadith';
import { pageMetadata } from '@/lib/seo';
import { NamedStructuredData } from '@/components/structured-data';
import { siteUrl } from '@/lib/seo';

const description = '٣٥٨٢ مادة من موسوعة الأحاديث النبوية مع النصوص والشروح والتخريج وأحكام المصدر، والبحث حسب الموضوع والكتاب.';
export const metadata = pageMetadata('الأحاديث النبوية وشروحها', description, '/hadith', '/hadith/opengraph-image', ['شرح الحديث النبوي', 'تخريج الحديث']);

export default function Page() {
  return (
    <>
      <NamedStructuredData data={{ '@type': 'CollectionPage', name: 'موسوعة الأحاديث النبوية', description, url: siteUrl('/hadith'), numberOfItems: 3582, inLanguage: 'ar', isAccessibleForFree: true }} />
      <PageHead
        label="من هدي رسول الله ﷺ"
        title="الأحاديث النبوية"
        description="هديٌ نقتدي به، وكلماتٌ نعمل بمعانيها."
      />
      <Hadith />
    </>
  );
}
