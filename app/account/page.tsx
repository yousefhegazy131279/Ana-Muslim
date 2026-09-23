import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Heart,
  BookOpen,
  ScrollText,
  HandHeart,
  Sparkles,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  TrendingUp,
  Award,
  Clock,
  Eye,
  Activity,
  Star,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { Reveal } from '@/components/reveal';

export const metadata = { title: 'حسابي' };

// ============================================================
// جلب بيانات الحساب
// ============================================================
async function getAccountData(userId: string) {
  const supabase = await createClient();

  const [profileRes, favoritesRes, viewsRes, sectionsRes] =
    await Promise.all([
      // الملف الشخصي
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),

      // عدد المفضلة
      supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),

      // إجمالي الزيارات
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),

      // توزيع الأقسام
      supabase.rpc('get_user_section_counts', { p_user_id: userId }),
    ]);

  // آخر 5 عناصر مفضلة
  const { data: recentFavorites } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(4);

  // آخر 3 زيارات
  const { data: recentViews } = await supabase
    .from('page_views')
    .select('path, section, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  return {
    profile: profileRes.data,
    favoritesCount: favoritesRes.count ?? 0,
    viewsCount: viewsRes.count ?? 0,
    sections: (sectionsRes.data ?? []) as { section: string; views: number }[],
    recentFavorites: recentFavorites ?? [],
    recentViews: recentViews ?? [],
  };
}

// ============================================================
// الصفحة
// ============================================================
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const data = await getAccountData(user.id);

  const fullName =
    user.user_metadata?.full_name ||
    data.profile?.full_name ||
    user.email?.split('@')[0] ||
    'مستخدم';

  const firstName = fullName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;

  const isAdmin = user.app_metadata?.role === 'admin';

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

  const topSection = data.sections[0];
  const topSectionLabel = topSection
    ? sectionLabels[topSection.section] || topSection.section
    : '—';

  const formatDate = (date: string | null | undefined, style: 'short' | 'long' = 'short') => {
    if (!date) return '—';
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        dateStyle: style === 'long' ? 'long' : 'medium',
        ...(style === 'short' ? {} : { timeStyle: 'short' as const }),
      }).format(new Date(date));
    } catch {
      return '—';
    }
  };

  // ===== الروابط السريعة =====
  const quickLinks = [
    {
      href: '/account/favorites',
      icon: Heart,
      label: 'المفضلة',
      desc: `${arabic(data.favoritesCount)} عنصر`,
      color: 'red' as const,
    },
    {
      href: '/account/stats',
      icon: BarChart3,
      label: 'إحصائياتي',
      desc: `${arabic(data.viewsCount)} زيارة`,
      color: 'gold' as const,
    },
    {
      href: '/account/settings',
      icon: Settings,
      label: 'الإعدادات',
      desc: 'بياناتك والأمان',
      color: 'green' as const,
    },
    ...(isAdmin
      ? [
          {
            href: '/admin',
            icon: Shield,
            label: 'لوحة التحكم',
            desc: 'صلاحيات إدارية',
            color: 'gold' as const,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHead
        label="مرحبًا بك"
        title="حسابي"
        description="إدارة حسابك ومتابعة تقدمك"
      />

      <section className="container content-section account-dashboard">

        {/* ============ الترحيب ============ */}
        <Reveal className="account-hero" animation="zoom-in">
          <div className="account-hero-bg" aria-hidden="true">
            <div className="account-hero-glow account-hero-glow-1" />
            <div className="account-hero-glow account-hero-glow-2" />
          </div>

          <div className="account-hero-avatar">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={firstName}
                className="account-hero-avatar-img"
              />
            ) : (
              <span className="account-hero-initial">{initial}</span>
            )}
            <span className="account-hero-status" />
          </div>

          <div className="account-hero-text">
            <span className="account-hero-greeting">
              {isAdmin ? 'مشرف عام' : 'عضو مميز'}
            </span>
            <h2>{fullName} 👋</h2>
            <p className="account-hero-email">
              <Mail size={14} />
              {user.email}
            </p>
          </div>

          <div className="account-hero-badges">
            <span className="account-hero-badge account-hero-badge-green">
              <Calendar size={12} />
              عضو منذ {formatDate(user.created_at)}
            </span>
            {isAdmin && (
              <span className="account-hero-badge account-hero-badge-gold">
                <Shield size={12} />
                Admin
              </span>
            )}
          </div>

          <span className="account-hero-star account-hero-star-1" aria-hidden="true">✦</span>
          <span className="account-hero-star account-hero-star-2" aria-hidden="true">✧</span>
        </Reveal>

        {/* ============ الإحصائيات السريعة ============ */}
        <div className="account-stats-grid">
          <Reveal className="account-stat-card account-stat-green" animation="fade-up">
            <span className="account-stat-icon">
              <Eye size={22} />
            </span>
            <div>
              <strong>{arabic(data.viewsCount)}</strong>
              <span>زيارة</span>
            </div>
          </Reveal>

          <Reveal className="account-stat-card account-stat-red" animation="fade-up" delay={80}>
            <span className="account-stat-icon">
              <Heart size={22} />
            </span>
            <div>
              <strong>{arabic(data.favoritesCount)}</strong>
              <span>في المفضلة</span>
            </div>
          </Reveal>

          <Reveal className="account-stat-card account-stat-gold" animation="fade-up" delay={160}>
            <span className="account-stat-icon">
              <Activity size={22} />
            </span>
            <div>
              <strong>{arabic(data.sections.length)}</strong>
              <span>قسمًا زرته</span>
            </div>
          </Reveal>

          <Reveal className="account-stat-card account-stat-green" animation="fade-up" delay={240}>
            <span className="account-stat-icon">
              <Star size={22} />
            </span>
            <div>
              <strong>{topSectionLabel}</strong>
              <span>الأكثر زيارة</span>
            </div>
          </Reveal>
        </div>

        {/* ============ الروابط السريعة ============ */}
        <Reveal className="account-section-header" animation="fade-up">
          <div className="account-section-title">
            <span className="account-section-icon">
              <TrendingUp size={18} />
            </span>
            <div>
              <h2>الوصول السريع</h2>
              <p>كل ما تحتاجه بنقرة واحدة</p>
            </div>
          </div>
        </Reveal>

        <div className="account-quick-links">
          {quickLinks.map((link, i) => (
            <Reveal key={link.href} animation="fade-up" delay={i * 80}>
              <Link
                href={link.href}
                className={`account-quick-link account-quick-${link.color}`}
              >
                <span className="account-quick-icon">
                  <link.icon size={22} />
                </span>
                <div className="account-quick-body">
                  <strong>{link.label}</strong>
                  <span>{link.desc}</span>
                </div>
                <ChevronLeft size={16} className="account-quick-arrow" />
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ============ الشبكة السفلية ============ */}
        <div className="account-lower-grid">
          {/* آخر المفضلة */}
          <Reveal className="account-card-box" animation="fade-up">
            <div className="account-card-box-header">
              <span className="account-card-box-icon account-card-box-icon-red">
                <Heart size={18} />
              </span>
              <div>
                <h3>آخر المفضلة</h3>
                <p>
                  {data.favoritesCount > 0
                    ? `${arabic(data.favoritesCount)} عنصر محفوظ`
                    : 'لم تحفظ أي عنصر بعد'}
                </p>
              </div>
            </div>

            {data.recentFavorites.length === 0 ? (
              <div className="account-box-empty">
                <Heart size={28} strokeWidth={1.4} />
                <p>ابدأ بحفظ ما يعجبك</p>
                <Link href="/quran/" className="account-box-empty-btn">
                  تصفّح القرآن
                </Link>
              </div>
            ) : (
              <ul className="account-mini-list">
                {data.recentFavorites.map((fav: any) => (
                  <li key={fav.id}>
                    <span className="account-mini-icon">
                      {(() => {
                        const Icon = sectionIcons[fav.item_type] ?? Heart;
                        return <Icon size={13} />;
                      })()}
                    </span>
                    <div className="account-mini-body">
                      <strong>
                        {fav.item_label ||
                          `${fav.item_type} #${fav.item_id}`}
                      </strong>
                      <small>{formatDate(fav.created_at)}</small>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link href="/account/favorites" className="account-box-cta">
              عرض المفضلة
              <ChevronLeft size={14} />
            </Link>
          </Reveal>

          {/* آخر النشاط */}
          <Reveal className="account-card-box" animation="fade-up" delay={100}>
            <div className="account-card-box-header">
              <span className="account-card-box-icon account-card-box-icon-green">
                <Clock size={18} />
              </span>
              <div>
                <h3>آخر النشاط</h3>
                <p>أين كنت مؤخرًا؟</p>
              </div>
            </div>

            {data.recentViews.length === 0 ? (
              <div className="account-box-empty">
                <Activity size={28} strokeWidth={1.4} />
                <p>لا يوجد نشاط بعد</p>
                <Link href="/" className="account-box-empty-btn">
                  ابدأ التصفح
                </Link>
              </div>
            ) : (
              <ul className="account-mini-list">
                {data.recentViews.map((v: any, i: number) => {
                  const Icon = sectionIcons[v.section] ?? Eye;
                  return (
                    <li key={i}>
                      <span className="account-mini-icon">
                        <Icon size={13} />
                      </span>
                      <div className="account-mini-body">
                        <strong>
                          {sectionLabels[v.section] || v.section || 'زيارة'}
                        </strong>
                        <small>{formatDate(v.created_at, 'long')}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <Link href="/account/stats" className="account-box-cta">
              عرض الإحصائيات
              <ChevronLeft size={14} />
            </Link>
          </Reveal>
        </div>

        {/* ============ رسالة تحفيزية ============ */}
        <Reveal className="account-motivation" animation="fade-up">
          <span className="account-motivation-icon">
            <Award size={22} />
          </span>
          <div>
            <strong>واصل رحلتك مع الإيمان</strong>
            <p>﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾ — كل لحظة تقرّبك أكثر</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}