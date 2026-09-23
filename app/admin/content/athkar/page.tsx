import { redirect } from 'next/navigation';
import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { AdminSearchTable } from '@/components/admin-search-table';

export const metadata = { title: 'إدارة الأذكار' };

async function getAthkar() {
  try {
    const content = await fs.readFile(
      path.join(process.cwd(), 'data/content-athkar.json'),
      'utf8'
    );
    return JSON.parse(content);
  } catch {
    return { athkar: [], athkar_categories: [] };
  }
}

export default async function AdminAthkarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const { athkar, athkar_categories } = await getAthkar();

  const categoriesMap = new Map(
    athkar_categories.map((c: any) => [c.id, c.name])
  );

  const rows = athkar.slice(0, 500).map((a: any) => ({
    id: a.id,
    cells: [
      { type: 'number', value: a.id },
      {
        type: 'text',
        value:
          categoriesMap.get(a.category_id) ?? 'غير مصنّف',
        bold: true,
      },
      {
        type: 'text',
        value: a.text?.slice(0, 100) + (a.text?.length > 100 ? '…' : ''),
      },
      {
        type: 'badge',
        value: `${a.repeat_count ?? 1} مرة`,
        color: 'green',
      },
      {
        type: 'text',
        value: a.reference ?? '—',
      },
    ],
  }));

  return (
    <>
      <PageHead
        label="إدارة المحتوى"
        title="الأذكار"
        description={`${arabic(athkar.length)} ذكر في ${arabic(
          athkar_categories.length
        )} صنف`}
      />

      <section className="container content-section admin-content-page">
        <Link href="/admin/content" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى إدارة المحتوى
        </Link>

        <AdminSearchTable
          title="قائمة الأذكار"
          icon={<Sparkles size={18} />}
          columns={[
            { key: 'id', label: '#' },
            { key: 'category', label: 'التصنيف' },
            { key: 'text', label: 'الذكر' },
            { key: 'repeat', label: 'التكرار' },
            { key: 'ref', label: 'المرجع' },
          ]}
          rows={rows}
          searchKeys={[1, 2, 4]}
          emptyText="لا توجد أذكار"
          maxHeight={600}
        />
      </section>
    </>
  );
}