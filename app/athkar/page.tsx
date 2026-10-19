import { PageHead } from '@/components/ui';
import { Athkar } from '@/components/athkar';
import { pageMetadata } from '@/lib/seo';
import { PageData } from '@/components/structured-data';

const description = 'أذكار الصباح والمساء والنوم وما بعد الصلاة، مع عداد تفاعلي لحفظ تقدمك على جهازك.';
export const metadata = pageMetadata('الأذكار اليومية', description, '/athkar', '/athkar/opengraph-image', ['أذكار الصباح', 'أذكار المساء']);

export default function Page() {
  return (
    <>
      <PageData title="الأذكار اليومية" path="/athkar" description={description} type="CollectionPage" />
      <PageHead
        label="ألا بذكر الله تطمئن القلوب"
        title="الأذكار اليومية"
        description="وقفةٌ تذكر فيها ربّك، وسكينةٌ تصحب يومك."
      />
      <Athkar />
    </>
  );
}
