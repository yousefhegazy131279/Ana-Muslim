import { Suspense } from 'react';
import { PageHead } from '@/components/ui';
import { PrayerTimes } from '@/components/prayer-times';
import { ToolLoading } from '@/components/tool-loading';
import { PageData } from '@/components/structured-data';
import { pageMetadata } from '@/lib/seo';
const description = 'مواقيت الصلاة والشروق بحسب مدينتك، مع طرق حساب متعددة وعدّاد للصلاة القادمة وحفظ المواقيت على جهازك.';
export const metadata = pageMetadata('مواقيت الصلاة', description, '/prayer-times', '/opengraph-image', ['مواقيت الصلاة', 'الفجر', 'صلاة العصر']);
export default function Page() { return <><PageHead label="صلاتك، سكينة يومك" title="مواقيت الصلاة" description="رتّب يومك حول الصلاة، أينما كنت." /><PageData title="مواقيت الصلاة" path="/prayer-times" description={description} /><section className="container content-section"><Suspense fallback={<ToolLoading />}><PrayerTimes /></Suspense></section></>; }
