import { PageHead } from '@/components/ui';
import { QuranList } from '@/components/quran-list';
import { pageMetadata } from '@/lib/seo';
import { PageData } from '@/components/structured-data';

const description = 'تصفح السور الـ١١٤ وابحث عن سورة بالاسم أو الرقم واقرأ آياتها مع التفسير الميسر والتلاوة.';
export const metadata = pageMetadata('القرآن الكريم', description, '/quran', '/opengraph-image', ['قراءة القرآن الكريم', 'التفسير الميسر']);

export default function Quran() {
  return (
    <>
      <PageData title="القرآن الكريم" path="/quran" description={description} type="CollectionPage" />
      <PageHead
        label="كلام الله، نور القلوب"
        title="القرآن الكريم"
        description="اقرأ بتأنٍّ، واستمع بخشوع، وتوقّف مع معاني الآيات."
      />
      <QuranList />
    </>
  );
}
