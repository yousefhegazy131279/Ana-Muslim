import { Suspense } from 'react';
import { PageHead } from '@/components/ui';
import { QiblaCompass } from '@/components/qibla-compass';
import { ToolLoading } from '@/components/tool-loading';
import { PageData } from '@/components/structured-data';
import { pageMetadata } from '@/lib/seo';
const description = 'احسب اتجاه القبلة من موقعك أو مدينتك، واعرض الزاوية نسبةً إلى الشمال مع بوصلة حية على الأجهزة المدعومة.';
export const metadata = pageMetadata('اتجاه القبلة', description, '/qibla', '/opengraph-image', ['القبلة', 'اتجاه الكعبة', 'بوصلة']);
export default function Page() { return <><PageHead label="وحيثما كنتم فولّوا وجوهكم شطره" title="اتجاه القبلة" description="وجهة واحدة تجمع قلوبنا، من كل مكان." /><PageData title="اتجاه القبلة" path="/qibla" description={description} /><section className="container content-section"><Suspense fallback={<ToolLoading />}><QiblaCompass /></Suspense></section></>; }
