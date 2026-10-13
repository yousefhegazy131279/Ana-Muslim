import { redirect } from 'next/navigation';
import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ArrowRight, ScrollText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { AdminSearchTable } from '@/components/admin-search-table';
import {
  cellText,
  cellNumber,
  cellBadge,
  type Row,
} from '@/components/admin-table-types';

export const metadata = { title: 'إدارة الأحاديث' };

// ============================================================
// جلب بيانات الأحاديث (من الفهرس الكامل)
// ============================================================
async function getHadithData() {
    const dataDir = path.join(process.cwd(), 'data');
  
    // ===== 1. meta =====
    let meta: any = { count: 0, version: '-' };
    try {
      meta = JSON.parse(
        await fs.readFile(path.join(dataDir, 'hadith-meta.json'), 'utf8')
      );
    } catch {}
  
    // ===== 2. index الكامل =====
    let index: any[] = [];
  
    // جرّب المسارات المحتملة بالترتيب
    // Keep filesystem reads statically scoped so mobile assets and signing
    // material cannot be pulled into the server deployment trace.
    const readers = [
      () => fs.readFile(path.join(process.cwd(), 'public/data/hadith', 'index.json'), 'utf8'),
      () => fs.readFile(path.join(process.cwd(), 'data/hadith', 'index.json'), 'utf8'),
      () => fs.readFile(path.join(process.cwd(), 'data', 'hadith-initial.json'), 'utf8'),
    ];
  
    for (const readIndex of readers) {
      try {
        const content = await readIndex();
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          index = parsed;
          break;
        }
      } catch {
        // جرّب المسار التالي
      }
    }
  
    return { meta, index };
  }

export default async function AdminHadithPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const { meta, index } = await getHadithData();

  const rows: Row[] = index.slice(0, 500).map((h: any) => ({
    id: h.id,
    cells: [
      cellNumber(h.id),
      cellText(
        h.title?.slice(0, 80) + (h.title?.length > 80 ? '…' : ''),
        true
      ),
      cellBadge(
        h.grade_group ?? '—',
        h.grade_group === 'صحيح' ? 'green' : 'gold'
      ),
      cellText(
        (h.categories || []).slice(0, 2).join(' · ') || '—'
      ),
      cellText(
        h.takhrij?.slice(0, 60) + (h.takhrij?.length > 60 ? '…' : '')
      ),
    ],
  }));

  return (
    <>
      <PageHead
        label="إدارة المحتوى"
        title="الأحاديث النبوية"
        description={`${arabic(meta.count)} مادة · ${meta.version}`}
      />

      <section className="container content-section admin-content-page">
        <Link href="/admin/content" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى إدارة المحتوى
        </Link>

        <div className="content-info-box">
          <div>
            <strong>الإصدار:</strong> {meta.version}
          </div>
          <div>
            <strong>المصدر:</strong> موسوعة الأحاديث النبوية (HadeethEnc)
          </div>
        </div>

        <AdminSearchTable
          title="قائمة الأحاديث"
          icon={<ScrollText size={18} />}
          columns={[
            { key: 'id', label: '#' },
            { key: 'title', label: 'العنوان' },
            { key: 'grade', label: 'الحكم' },
            { key: 'categories', label: 'التصنيف' },
            { key: 'takhrij', label: 'التخريج' },
          ]}
          rows={rows}
          searchKeys={[1, 4]}
          emptyText="لا توجد أحاديث محمّلة"
          maxHeight={600}
        />
      </section>
    </>
  );
}
