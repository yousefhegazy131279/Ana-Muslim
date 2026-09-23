import { redirect } from 'next/navigation';
import {
  Eye,
  BookOpen,
  ScrollText,
  Users,
  HandHeart,
  Sparkles,
  Calendar,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { Reveal } from '@/components/reveal';

export const metadata = { title: 'إحصائياتي' };

// ============================================================
// جلب إحصائيات المستخدم
// ============================================================
async function getUserStats(userId: string) {
  const supabase = await createClient();

  const [totalViews, sectionCounts, recentDays, favoritesCount] =
    await Promise.all([
      // إجمالي الزيارات
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),

      // عدد الزيارات لكل قسم
      supabase.rpc('get_user_section_counts', { p_user_id: userId }),

      // آخر 30 يومًا
      supabase
        .from('page_views')
        .select('created_at')
        .eq('user_id', userId)
        .gte(
          'created_at',
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        ),

      // عدد المفضلة
      supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

  // عدد الأيام النشطة
  const daysSet = new Set(
    (recentDays.data ?? []).map((v: any) =>
      new Date(v.created_at).toDateString()
    )
  );

  return {
    totalViews: totalViews.count ?? 0,
    favoritesCount: favoritesCount.count ?? 0,
    sections: (sectionCounts.data ?? []) as { section: string; views: number }[],
    activeDays: daysSet.size,
  };
}

// ============================================================
// الصفحة
// ============================================================
export default async function UserStatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/account/stats');

  const stats = await getUserStats(user.id);

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

  const sectionIcons: Record<string, any> = {
    quran: BookOpen,
    hadith: ScrollText,
    stories: Users,
    athkar: Sparkles,
    duas: HandHeart,
  };

  const topSection = stats.sections[0];
  const maxViews = topSection ? Number(topSection.views) : 1;

  return (
    <>
      <PageHead
        label="حسابي"
        title="إحصائياتي"
        description="تتبّع نشاطك واستخدامك للموقع"
      />

      <section className="container content-section user-stats-page">
        {/* ============ البطاقات الرئيسية ============ */}
        <div className="user-stats-overview">
          <Reveal className="user-stat user-stat-green" animation="fade-up">
            <span className="user-stat-icon">
              <Eye size={22} />
            </span>
            <div>
              <strong>{arabic(stats.totalViews)}</strong>
              <span>إجمالي الزيارات</span>
            </div>
          </Reveal>

          <Reveal className="user-stat user-stat-gold" animation="fade-up" delay={80}>
            <span className="user-stat-icon">
              <Award size={22} />
            </span>
            <div>
              <strong>{arabic(stats.favoritesCount)}</strong>
              <span>عنصر في المفضلة</span>
            </div>
          </Reveal>

          <Reveal className="user-stat user-stat-green" animation="fade-up" delay={160}>
            <span className="user-stat-icon">
              <Calendar size={22} />
            </span>
            <div>
              <strong>{arabic(stats.activeDays)}</strong>
              <span>يومًا نشطًا</span>
            </div>
          </Reveal>

          <Reveal className="user-stat user-stat-gold" animation="fade-up" delay={240}>
            <span className="user-stat-icon">
              <Activity size={22} />
            </span>
            <div>
              <strong>{arabic(stats.sections.length)}</strong>
              <span>قسمًا زرته</span>
            </div>
          </Reveal>
        </div>

        {/* ============ توزيع الأقسام ============ */}
        <Reveal className="user-stats-section" animation="fade-up">
          <h2 className="user-stats-title">
            <TrendingUp size={18} />
            توزيع زياراتك
          </h2>

          {stats.sections.length === 0 ? (
            <div className="user-stats-empty">
              <TrendingUp size={32} strokeWidth={1.4} />
              <h3>لا توجد بيانات بعد</h3>
              <p>تصفّح الموقع لتظهر إحصائياتك</p>
            </div>
          ) : (
            <div className="user-stats-bars">
              {stats.sections.map((s) => {
                const percent = maxViews > 0 ? (Number(s.views) / maxViews) * 100 : 0;
                const Icon = sectionIcons[s.section] ?? Activity;
                return (
                  <div key={s.section} className="user-stats-bar">
                    <span className="user-stats-bar-icon">
                      <Icon size={14} />
                    </span>
                    <div className="user-stats-bar-body">
                      <div className="user-stats-bar-label">
                        <strong>{sectionLabels[s.section] || s.section}</strong>
                        <span>{arabic(Number(s.views))} زيارة</span>
                      </div>
                      <div className="user-stats-bar-track">
                        <div
                          className="user-stats-bar-fill"
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

        {/* ============ رسالة تحفيزية ============ */}
        <Reveal className="user-stats-motivation" animation="fade-up">
          <span className="user-stats-motivation-icon">
            <Award size={20} />
          </span>
          <div>
            <strong>استمر على هذا النهج</strong>
            <p>
              ﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾ — كل زيارة تقرّبك أكثر.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}