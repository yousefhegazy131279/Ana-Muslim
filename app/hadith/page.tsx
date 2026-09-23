import { PageHead } from '@/components/ui';
import { Hadith } from '@/components/hadith';

export const metadata = {
  title: 'الأحاديث النبوية وشروحها',
  description:
    '٣٥٨٢ مادة من موسوعة الأحاديث النبوية مع النصوص والشروح والتخريج وأحكام المصدر، والبحث حسب الموضوع والكتاب.',
};

export default function Page() {
  return (
    <>
      <PageHead
        label="من هدي رسول الله ﷺ"
        title="الأحاديث النبوية"
        description="هديٌ نقتدي به، وكلماتٌ نعمل بمعانيها."
      />
      <Hadith />
    </>
  );
}