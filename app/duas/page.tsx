import { PageHead } from '@/components/ui';
import { Duas } from '@/components/duas';
import { pageMetadata } from '@/lib/seo';
import { PageData } from '@/components/structured-data';

const description = 'أدعية من القرآن الكريم والسنة النبوية، مع البحث والتصنيفات ونسخ الدعاء.';
export const metadata = pageMetadata('الأدعية', description, '/duas', '/duas/opengraph-image', ['أدعية القرآن', 'أدعية السنة']);

export default function Page() {
  return (
    <>
      <PageData title="الأدعية" path="/duas" description={description} type="CollectionPage" />
      <PageHead
        label="وقال ربكم ادعوني أستجب لكم"
        title="الأدعية"
        description="دعواتٌ من الكتاب والسنة، لكل ما يحمله قلبك."
      />
      <Duas />
    </>
  );
}
