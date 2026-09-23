import { redirect } from 'next/navigation';
import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ArrowRight, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { AdminSearchTable } from '@/components/admin-search-table';

export const metadata = { title: 'إدارة قصص الأنبياء' };

async function getProphets() {
  try {
    const content = await fs.readFile(
      path.join(process.cwd(), 'data/prophets.json'),
      'utf8'
    );
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export default async function AdminStoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const prophets = await getProphets();

  const rows = prophets.map((p: any, i: number) => ({
    id: p.slug ?? i,
    cells: [
      { type: 'number', value: i + 1 },
      {
        type: 'text',
        value: p.name ?? 'بدون اسم',
        bold: true,
      },
      {
        type: 'text',
        value: p.theme ?? '—',
      },
      {
        type: 'text',
        value:
          p.summary?.slice(0, 80) + (p.summary?.length > 80 ? '…' : ''),
      },
      {
        type: 'link',
        value: `/stories/${p.slug}/`,
        label: 'عرض',
      },
    ],
  }));

  return (
    <>
      <PageHead
        label="إدارة المحتوى"
        title="قصص الأنبياء"
        description={`${arabic(prophets.length)} نبيًّا`}
      />

      <section className="container content-section admin-content-page">
        <Link href="/admin/content" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى إدارة المحتوى
        </Link>

        <AdminSearchTable
          title="قائمة الأنبياء"
          icon={<Users size={18} />}
          columns={[
            { key: 'num', label: '#' },
            { key: 'name', label: 'النبي' },
            { key: 'theme', label: 'الموضوع' },
            { key: 'summary', label: 'الملخص' },
            { key: 'action', label: '' },
          ]}
          rows={rows}
          searchKeys={[1, 2, 3]}
          emptyText="لا توجد قصص"
          maxHeight={600}
        />
      </section>
    </>
  );
}