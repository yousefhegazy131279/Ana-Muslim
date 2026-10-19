import { PageHead } from '@/components/ui';
import { ProphetsTree } from '@/components/prophets-tree';
import { pageMetadata } from '@/lib/seo';
import { PageData } from '@/components/structured-data';

const description = 'قصص الأنبياء الخمسة والعشرين المذكورين في القرآن، من آدم إلى محمد ﷺ، مع الآيات والتفسير والأحاديث الصحيحة.';
export const metadata = pageMetadata('قصص الأنبياء بالأدلة والتفسير', description, '/stories', '/opengraph-image', ['قصص الأنبياء كاملة', 'قصة آدم']);

export default function Page() {
  return (
    <>
      <PageData title="قصص الأنبياء" path="/stories" description={description} type="CollectionPage" />
      <PageHead
        label="لقد كان في قصصهم عبرة"
        title="قصص الأنبياء"
        description="قصص الأنبياء المذكورين في القرآن، مع نصوص الأدلة وتفسيرها."
      />
      <ProphetsTree />
    </>
  );
}
