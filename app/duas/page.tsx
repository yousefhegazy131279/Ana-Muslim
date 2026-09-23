import { PageHead } from '@/components/ui';
import { Duas } from '@/components/duas';

export const metadata = {
  title: 'الأدعية',
  description:
    'أدعية من القرآن الكريم والسنة النبوية، مع البحث والتصنيفات ونسخ الدعاء.',
};

export default function Page() {
  return (
    <>
      <PageHead
        label="وقال ربكم ادعوني أستجب لكم"
        title="الأدعية"
        description="دعواتٌ من الكتاب والسنة، لكل ما يحمله قلبك."
      />
      <Duas />
    </>
  );
}