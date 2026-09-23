import { PageHead } from '@/components/ui';
import { Athkar } from '@/components/athkar';

export const metadata = {
  title: 'الأذكار اليومية',
  description:
    'أذكار الصباح والمساء والنوم وما بعد الصلاة، مع عداد تفاعلي لحفظ تقدمك على جهازك.',
};

export default function Page() {
  return (
    <>
      <PageHead
        label="ألا بذكر الله تطمئن القلوب"
        title="الأذكار اليومية"
        description="وقفةٌ تذكر فيها ربّك، وسكينةٌ تصحب يومك."
      />
      <Athkar />
    </>
  );
}