import { PageHead } from '@/components/ui';
import { QuranList } from '@/components/quran-list';

export const metadata = {
  title: 'القرآن الكريم',
  description:
    'تصفح السور الـ١١٤ وابحث عن سورة بالاسم أو الرقم واقرأ آياتها مع التفسير الميسر والتلاوة.',
};

export default function Quran() {
  return (
    <>
      <PageHead
        label="كلام الله، نور القلوب"
        title="القرآن الكريم"
        description="اقرأ بتأنٍّ، واستمع بخشوع، وتوقّف مع معاني الآيات."
      />
      <QuranList />
    </>
  );
}