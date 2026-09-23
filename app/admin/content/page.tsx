import { redirect } from 'next/navigation';
import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  HandHeart,
  ScrollText,
  Users,
  Database,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { Reveal } from '@/components/reveal';

export const metadata = { title: 'إدارة المحتوى' };

// ============================================================
// قراءة ملف JSON بأمان
// ============================================================
async function readJSON(filePath: string): Promise<any | null> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// ============================================================
// جلب إحصائيات المحتوى
// ============================================================
async function getContentStats() {
  const dataDir = path.join(process.cwd(), 'data');

  // ---------- القرآن ----------
  const quranCandidates = [
    'quran-meta.json',
    'surahs.json',
    'quran/index.json',
  ];
  let quranCount = 114;
  for (const file of quranCandidates) {
    const data = await readJSON(path.join(dataDir, file));
    if (data) {
      const arr = Array.isArray(data)
        ? data
        : data.surahs || data.data || [];
      if (arr.length > 0) {
        quranCount = arr.length;
        break;
      }
    }
  }

  // ---------- الأذكار ----------
  const athkar = await readJSON(
    path.join(dataDir, 'content-athkar.json')
  );
  const athkarItems = athkar?.athkar?.length ?? 0;
  const athkarCategories = athkar?.athkar_categories?.length ?? 0;

  // ---------- الأدعية ----------
  const duas = await readJSON(
    path.join(dataDir, 'content-duas.json')
  );
  const duasItems = duas?.duas?.length ?? 0;
  const duasCategories = duas?.dua_categories?.length ?? 0;

  // ---------- الأحاديث ----------
  const hadithMeta = await readJSON(
    path.join(dataDir, 'hadith-meta.json')
  );

  // ---------- القصص ----------
  const prophets = await readJSON(path.join(dataDir, 'prophets.json'));
  const prophetsCount = Array.isArray(prophets) ? prophets.length : 0;

  return {
    quran: { total: quranCount, ayahs: 6236 },
    athkar: { items: athkarItems, categories: athkarCategories },
    duas: { items: duasItems, categories: duasCategories },
    hadith: {
      total: hadithMeta?.count ?? 0,
      version: hadithMeta?.version ?? '—',
    },
    stories: { total: prophetsCount },
  };
}

// ============================================================
// الصفحة
// ============================================================
export default async function AdminContentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const stats = await getContentStats();

  const totalItems =
    stats.quran.total +
    stats.athkar.items +
    stats.duas.items +
    stats.hadith.total +
    stats.stories.total;

  const sections = [
    {
      icon: BookOpen,
      title: 'القرآن الكريم',
      desc: 'إدارة السور والآيات والتفسير',
      href: '/admin/content/quran',
      color: 'green',
      stats: [
        { label: 'سورة', value: stats.quran.total },
        { label: 'آية', value: stats.quran.ayahs },
      ],
    },
    {
      icon: Sparkles,
      title: 'الأذكار',
      desc: 'إدارة الأذكار والأصناف',
      href: '/admin/content/athkar',
      color: 'gold',
      stats: [
        { label: 'ذكر', value: stats.athkar.items },
        { label: 'صنف', value: stats.athkar.categories },
      ],
    },
    {
      icon: HandHeart,
      title: 'الأدعية',
      desc: 'إدارة الأدعية والتصنيفات',
      href: '/admin/content/duas',
      color: 'green',
      stats: [
        { label: 'دعاء', value: stats.duas.items },
        { label: 'تصنيف', value: stats.duas.categories },
      ],
    },
    {
      icon: ScrollText,
      title: 'الأحاديث النبوية',
      desc: 'إدارة الأحاديث والشروح',
      href: '/admin/content/hadith',
      color: 'gold',
      stats: [
        { label: 'مادة', value: stats.hadith.total },
        { label: 'إصدار', value: stats.hadith.version as any },
      ],
    },
    {
      icon: Users,
      title: 'قصص الأنبياء',
      desc: 'إدارة قصص الأنبياء والفصول',
      href: '/admin/content/stories',
      color: 'green',
      stats: [
        { label: 'نبي', value: stats.stories.total },
        { label: 'قصة', value: stats.stories.total },
      ],
    },
  ];

  return (
    <>
      <PageHead
        label="منطقة الإدارة"
        title="إدارة المحتوى"
        description="تحكم كامل بجميع أقسام الموقع"
      />

      <section className="container content-section admin-content-page">
        <Link href="/admin" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى لوحة التحكم
        </Link>

        {/* ============ نظرة عامة ============ */}
        <Reveal className="content-overview" animation="fade-up">
          <div className="content-overview-icon">
            <Database size={32} />
          </div>
          <div className="content-overview-text">
            <h2>مكتبة المحتوى</h2>
            <p>
              إجمالي {arabic(totalItems)} عنصر في 5 أقسام
            </p>
          </div>
          <span className="content-overview-badge">
            <TrendingUp size={12} />
            محدّث
          </span>
        </Reveal>

        {/* ============ الأقسام ============ */}
        <div className="content-sections">
          {sections.map((s, i) => (
            <Reveal key={s.title} animation="fade-up" delay={i * 80}>
              <Link
                href={s.href}
                className={`content-section-card content-section-${s.color}`}
              >
                {/* الرأس */}
                <div className="content-section-header">
                  <span className="content-section-icon">
                    <s.icon size={26} />
                  </span>
                  <ArrowLeft
                    size={18}
                    className="content-section-arrow"
                  />
                </div>

                {/* المحتوى */}
                <h3>{s.title}</h3>
                <p>{s.desc}</p>

                {/* الإحصائيات */}
                <div className="content-section-stats">
                  {s.stats.map((st) => (
                    <div
                      key={st.label}
                      className="content-section-stat"
                    >
                      <strong>
                        {typeof st.value === 'number'
                          ? arabic(st.value)
                          : st.value}
                      </strong>
                      <span>{st.label}</span>
                    </div>
                  ))}
                </div>

                {/* الفوتر */}
                <div className="content-section-footer">
                  <FileText size={14} />
                  <span>إدارة</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ============ ملاحظة ============ */}
        <Reveal
          className="content-note"
          animation="fade-up"
          delay={400}
        >
          <strong>ملاحظة هامة:</strong> المحتوى الحالي محفوظ في ملفات
          JSON. للتعديل المباشر، يمكن ربطه بـ Supabase. الصفحات
          الحالية تتيح استعراض المحتوى وإحصائياته.
        </Reveal>
      </section>
    </>
  );
}