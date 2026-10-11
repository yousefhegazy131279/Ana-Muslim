import { PageHead } from '@/components/ui';
import { ProphetsTree } from '@/components/prophets-tree';

export const metadata = {
  title: 'قصص الأنبياء بالأدلة والتفسير',
  description:
    'شجرة الأنبياء الخمسة والعشرين المذكورين في القرآن، من آدم إلى محمد ﷺ، مع الآيات والتفسير والأحاديث وشروحها.',
};

export default function Page() {
  return (
    <>
      <PageHead
        label="لقد كان في قصصهم عبرة"
        title="قصص الأنبياء"
        description="قصص الأنبياء المذكورين في القرآن، مع نصوص الأدلة وتفسيرها."
      />
      <ProphetsTree />
    </>
  );
}