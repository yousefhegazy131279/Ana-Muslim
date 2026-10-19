import { Suspense } from 'react';
import { PageHead } from '@/components/ui';
import { Tasbih } from '@/components/tasbih';
import { ToolLoading } from '@/components/tool-loading';
import { PageData } from '@/components/structured-data';
import { pageMetadata } from '@/lib/seo';
const description = 'سبحة إلكترونية بأذكار وأهداف مخصصة، وعدّاد محفوظ محليًا وإحصاءات اليوم وسجل سبعة أيام وصوت واهتزاز اختياريين.';
export const metadata = pageMetadata('التسبيح والذكر', description, '/tasbih', '/opengraph-image', ['سبحة إلكترونية', 'تسبيح', 'ذكر الله']);
export default function Page() { return <><PageHead label="ألا بذكر الله تطمئن القلوب" title="التسبيح والذكر" description="لحظات هادئة، وأثر يبقى في قلبك." /><PageData title="التسبيح والذكر" path="/tasbih" description={description} /><section className="container content-section"><Suspense fallback={<ToolLoading />}><Tasbih /></Suspense></section></>; }
