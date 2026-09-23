import { redirect } from 'next/navigation';
import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ArrowRight, HandHeart } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { AdminSearchTable } from '@/components/admin-search-table';

export const metadata = { title: 'إدارة الأدعية' };

async function getDuas() {
  try {
    const content = await fs.readFile(
      path.join(process.cwd(), 'data/content-duas.json'),
      'utf8'
    );
    return JSON.parse(content);
  } catch {
    return { duas: [], dua_categories: [] };
  }
}

export default async function AdminDuasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const { duas, dua_categories } = await getDuas();

  const categoriesMap = new Map(
    dua_categories.map((c: any) => [c.id, c.name])
  );

  const rows = duas.slice(0, 500).map((d: any) => ({
    id: d.id,
    cells: [
      { type: 'number', value: d.id },
      {
        type: 'text',
        value: d.title ?? 'بدون عنوان',
        bold: true,
      },
      {
        type: 'text',
        value: categoriesMap.get(d.category_id) ?? 'غير مصنّف',
      },
      {
        type: 'text',
        value: d.text?.slice(0, 100) + (d.text?.length > 100 ? '…' : ''),
      },
      {
        type: 'badge',
        value: d.source_type === 'quran' ? 'قرآني' : 'نبوي',
        color: d.source_type === 'quran' ? 'green' : 'gold',
      },
      {
        type: 'text',
        value: d.reference ?? '—',
      },
    ],
  }));

  return (
    <>
      <PageHead
        label="إدارة المحتوى"
        title="الأدعية"
        description={`${arabic(duas.length)} دعاء في ${arabic(
          dua_categories.length
        )} تصنيف`}
      />

      <section className="container content-section admin-content-page">
        <Link href="/admin/content" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى إدارة المحتوى
        </Link>

        <AdminSearchTable
          title="قائمة الأدعية"
          icon={<HandHeart size={18} />}
          columns={[
            { key: 'id', label: '#' },
            { key: 'title', label: 'العنوان' },
            { key: 'category', label: 'التصنيف' },
            { key: 'text', label: 'النص' },
            { key: 'type', label: 'النوع' },
            { key: 'ref', label: 'المرجع' },
          ]}
          rows={rows}
          searchKeys={[1, 2, 3, 5]}
          emptyText="لا توجد أدعية"
          maxHeight={600}
        />
      </section>
    </>
  );
}