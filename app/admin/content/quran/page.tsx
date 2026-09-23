import { redirect } from 'next/navigation';
import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { AdminSearchTable } from '@/components/admin-search-table';

export const metadata = { title: 'إدارة القرآن' };

async function getSurahs() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    // جرّب ملفات مختلفة
    const candidates = [
      'quran-meta.json',
      'surahs.json',
      'quran/index.json',
    ];
    for (const file of candidates) {
      try {
        const content = await fs.readFile(
          path.join(dataDir, file),
          'utf8'
        );
        const parsed = JSON.parse(content);
        const surahs = Array.isArray(parsed)
          ? parsed
          : parsed.surahs || parsed.data || [];
        if (surahs.length > 0) return surahs;
      } catch {}
    }
    // إذا لم يوجد، ولّد قائمة افتراضية من 114 سورة
    return Array.from({ length: 114 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      name: `سورة ${i + 1}`,
      ayahCount: 0,
    }));
  } catch {
    return [];
  }
}

export default async function AdminQuranPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const surahs = await getSurahs();

  const rows = surahs.map((s: any, i: number) => ({
    id: s.id ?? s.number ?? i + 1,
    cells: [
      {
        type: 'number',
        value: s.number ?? s.id ?? i + 1,
      },
      {
        type: 'text',
        value: s.name ?? `سورة ${i + 1}`,
        bold: true,
      },
      {
        type: 'text',
        value: s.englishName ?? s.name_english ?? '—',
      },
      {
        type: 'badge',
        value: s.revelationType ?? s.type ?? '—',
        color: s.revelationType === 'Medinan' ? 'gold' : 'green',
      },
      {
        type: 'number',
        value: s.ayahCount ?? s.total_ayahs ?? 0,
      },
    ],
  }));

  return (
    <>
      <PageHead
        label="إدارة المحتوى"
        title="القرآن الكريم"
        description={`${arabic(surahs.length)} سورة`}
      />

      <section className="container content-section admin-content-page">
        <Link href="/admin/content" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى إدارة المحتوى
        </Link>

        <AdminSearchTable
          title="قائمة السور"
          icon={<BookOpen size={18} />}
          columns={[
            { key: 'number', label: '#' },
            { key: 'name', label: 'السورة' },
            { key: 'english', label: 'English' },
            { key: 'type', label: 'النوع' },
            { key: 'ayahs', label: 'الآيات' },
          ]}
          rows={rows}
          searchKeys={[1, 2]}
          emptyText="لا توجد سور"
        />
      </section>
    </>
  );
}