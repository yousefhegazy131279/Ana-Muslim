import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  ScrollText,
  Users2,
  HandHeart,
  Sparkles,
  Calendar,
  Eye,
  UserCheck,
  Activity,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { Reveal } from '@/components/reveal';
import { StatsRangeSelector } from '@/components/stats-range-selector';

export const metadata = { title: 'الإحصائيات' };

// ============================================================
// جلب جميع الإحصائيات
// ============================================================
async function getAllStats(days: number) {
  const supabase = await createClient();

  const [overview, topSections, topQuran, topHadith, topStories, topUsers] =
    await Promise.all([
      supabase.rpc('get_stats_overview', { days }),
      supabase.rpc('get_top_sections', { days }),
      supabase.rpc('get_top_items', { section_filter: 'quran', days }),
      supabase.rpc('get_top_items', { section_filter: 'hadith', days }),
      supabase.rpc('get_top_items', { section_filter: 'stories', days }),
      supabase.rpc('get_top_users', { days }),
    ]);

  return {
    overview: overview.data?.[0] ?? {
      total_views: 0,
      unique_visitors: 0,
      registered_views: 0,
      today_views: 0,
    },
    sections: topSections.data ?? [],
    quran: topQuran.data ?? [],
    hadith: topHadith.data ?? [],
    stories: topStories.data ?? [],
    users: topUsers.data ?? [],
  };
}

// ============================================================
// الصفحة
// ============================================================
export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const params = await searchParams;
  const days = Math.max(1, Math.min(365, Number(params.range) || 30));

  const stats = await getAllStats(days);

  // أسماء الأقسام
  const sectionLabels: Record<string, string> = {
    home: 'الرئيسية',
    quran: 'القرآن الكريم',
    hadith: 'الأحاديث',
    stories: 'قصص الأنبياء',
    athkar: 'الأذكار',
    duas: 'الأدعية',
    about: 'من نحن',
    other: 'أخرى',
  };

  return (
    <>
      <PageHead
        label="منطقة الإدارة"
        title="الإحصائيات"
        description={`تقارير آخر ${arabic(days)} يومًا`}
      />

      <section className="container content-section admin-stats-page">
        <Link href="/admin" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى لوحة التحكم
        </Link>

        {/* ============ محدد الفترة ============ */}
        <StatsRangeSelector current={days} />

        {/* ============ النظرة العامة ============ */}
        <div className="stats-overview">
          <Reveal className="stats-overview-card stats-overview-green" animation="fade-up">
            <span className="stats-overview-icon">
              <Eye size={22} />
            </span>
            <div>
              <strong>{arabic(Number(stats.overview.total_views))}</strong>
              <span>إجمالي الزيارات</span>
            </div>
          </Reveal>

          <Reveal className="stats-overview-card stats-overview-gold" animation="fade-up" delay={80}>
            <span className="stats-overview-icon">
              <Users size={22} />
            </span>
            <div>
              <strong>{arabic(Number(stats.overview.unique_visitors))}</strong>
              <span>زوار فريدون</span>
            </div>
          </Reveal>

          <Reveal className="stats-overview-card stats-overview-green" animation="fade-up" delay={160}>
            <span className="stats-overview-icon">
              <UserCheck size={22} />
            </span>
            <div>
              <strong>{arabic(Number(stats.overview.registered_views))}</strong>
              <span>زيارات من مسجّلين</span>
            </div>
          </Reveal>

          <Reveal className="stats-overview-card stats-overview-gold" animation="fade-up" delay={240}>
            <span className="stats-overview-icon">
              <Activity size={22} />
            </span>
            <div>
              <strong>{arabic(Number(stats.overview.today_views))}</strong>
              <span>زيارات اليوم</span>
            </div>
          </Reveal>
        </div>

        {/* ============ أكثر الأقسام زيارة ============ */}
        <Reveal className="stats-section" animation="fade-up">
          <h2 className="stats-section-title">
            <BarChart3 size={20} />
            أكثر الأقسام زيارة
          </h2>
          {stats.sections.length === 0 ? (
            <StatsEmpty text="لا توجد بيانات بعد" />
          ) : (
            <div className="stats-bar-list">
              {stats.sections.map((s: any, i: number) => {
                const max = Number(stats.sections[0].views);
                const percent = max > 0 ? (Number(s.views) / max) * 100 : 0;
                return (
                  <div key={s.section} className="stats-bar-item">
                    <span className="stats-bar-rank">
                      {arabic(i + 1)}
                    </span>
                    <div className="stats-bar-content">
                      <div className="stats-bar-label">
                        <strong>
                          {sectionLabels[s.section] || s.section}
                        </strong>
                        <span>{arabic(Number(s.views))} زيارة</span>
                      </div>
                      <div className="stats-bar-track">
                        <div
                          className="stats-bar-fill"
                          style={{ width: percent + '%' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Reveal>

        {/* ============ الصفوف الثلاثة ============ */}
        <div className="stats-grid">
          {/* القرآن */}
          <Reveal className="stats-section stats-section-card" animation="fade-up">
            <h2 className="stats-section-title">
              <BookOpen size={18} />
              أكثر السور قراءة
            </h2>
            {stats.quran.length === 0 ? (
              <StatsEmpty text="لا توجد بيانات" small />
            ) : (
              <ol className="stats-list">
                {stats.quran.slice(0, 10).map((item: any, i: number) => (
                  <li key={item.item_id}>
                    <span className="stats-list-rank">
                      {arabic(i + 1)}
                    </span>
                    <span className="stats-list-label">
                      سورة {item.item_label || item.item_id}
                    </span>
                    <span className="stats-list-value">
                      {arabic(Number(item.views))}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Reveal>

          {/* الأحاديث */}
          <Reveal className="stats-section stats-section-card" animation="fade-up" delay={80}>
            <h2 className="stats-section-title">
              <ScrollText size={18} />
              أكثر الأحاديث عرضًا
            </h2>
            {stats.hadith.length === 0 ? (
              <StatsEmpty text="لا توجد بيانات" small />
            ) : (
              <ol className="stats-list">
                {stats.hadith.slice(0, 10).map((item: any, i: number) => (
                  <li key={item.item_id}>
                    <span className="stats-list-rank">
                      {arabic(i + 1)}
                    </span>
                    <span className="stats-list-label">
                      حديث #{item.item_id}
                    </span>
                    <span className="stats-list-value">
                      {arabic(Number(item.views))}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Reveal>

          {/* القصص */}
          <Reveal className="stats-section stats-section-card" animation="fade-up" delay={160}>
            <h2 className="stats-section-title">
              <Users2 size={18} />
              أكثر القصص قراءة
            </h2>
            {stats.stories.length === 0 ? (
              <StatsEmpty text="لا توجد بيانات" small />
            ) : (
              <ol className="stats-list">
                {stats.stories.slice(0, 10).map((item: any, i: number) => (
                  <li key={item.item_id}>
                    <span className="stats-list-rank">
                      {arabic(i + 1)}
                    </span>
                    <span className="stats-list-label">
                      {item.item_label || item.item_id}
                    </span>
                    <span className="stats-list-value">
                      {arabic(Number(item.views))}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Reveal>
        </div>

        {/* ============ أكثر المستخدمين تفاعلًا ============ */}
        <Reveal className="stats-section" animation="fade-up">
          <h2 className="stats-section-title">
            <TrendingUp size={20} />
            أكثر المستخدمين تفاعلًا
          </h2>
          {stats.users.length === 0 ? (
            <StatsEmpty text="لا يوجد مستخدمون مسجّلون بعد" />
          ) : (
            <div className="stats-users-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>المستخدم</th>
                    <th>البريد</th>
                    <th>الزيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.users.map((u: any, i: number) => (
                    <tr key={u.user_id}>
                      <td>
                        <span className="stats-list-rank">
                          {arabic(i + 1)}
                        </span>
                      </td>
                      <td>
                        <strong>{u.full_name || 'بدون اسم'}</strong>
                      </td>
                      <td>
                        <span dir="ltr">{u.email || '—'}</span>
                      </td>
                      <td>
                        <span className="stats-list-value">
                          {arabic(Number(u.views))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Reveal>

        {/* ============ ملاحظة ============ */}
        <Reveal className="stats-note" animation="fade-up">
          <strong>ملاحظة:</strong> البيانات تُجمع تلقائيًا من زيارات
          الزوار. لا يتم تسجيل IP أو بيانات شخصية.
        </Reveal>
      </section>
    </>
  );
}

// ============================================================
// حالة فارغة
// ============================================================
function StatsEmpty({ text, small }: { text: string; small?: boolean }) {
  return (
    <div className={`stats-empty ${small ? 'stats-empty-sm' : ''}`}>
      <BarChart3 size={small ? 24 : 32} strokeWidth={1.4} />
      <p>{text}</p>
    </div>
  );
}