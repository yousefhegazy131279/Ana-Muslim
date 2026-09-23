import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  ScrollText,
  HandHeart,
  BarChart3,
  Shield,
  Database,
  ArrowLeft,
  Activity,
  Sparkles,
  Crown,
  TrendingUp,
  Mail,
  Clock,
  Hash,
  ChevronLeft,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead, arabic } from '@/components/ui';
import { Reveal } from '@/components/reveal';

export const metadata = { title: 'لوحة التحكم' };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: adminsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');

  const stats = [
    {
      icon: Users,
      label: 'المستخدمون',
      value: usersCount ?? 0,
      color: 'green' as const,
      href: '/admin/users',
      sub: `${adminsCount ?? 0} مشرف`,
      trend: 'نشط',
    },
    {
      icon: BookOpen,
      label: 'السور',
      value: 114,
      color: 'gold' as const,
      href: '/quran',
      sub: '٦٢٣٦ آية',
      trend: 'كامل',
    },
    {
      icon: ScrollText,
      label: 'الأحاديث',
      value: 3582,
      color: 'green' as const,
      href: '/hadith',
      sub: 'مع الشرح',
      trend: 'محدّث',
    },
    {
      icon: HandHeart,
      label: 'الأذكار',
      value: 135,
      color: 'gold' as const,
      href: '/athkar',
      sub: 'جميع الأصناف',
      trend: 'كامل',
    },
  ];

  const sections = [
    {
      icon: Users,
      title: 'إدارة المستخدمين',
      desc: 'عرض المستخدمين، الأدوار، والحالات',
      href: '/admin/users',
      color: 'green' as const,
      badge: `${usersCount ?? 0} مستخدم`,
    },
    {
      icon: Database,
      title: 'إدارة المحتوى',
      desc: 'القرآن والأذكار والأحاديث والقصص',
      href: '/admin/content',
      color: 'gold' as const,
      badge: '٥ أقسام',
    },
    {
      icon: BarChart3,
      title: 'الإحصائيات',
      desc: 'تقارير الزوار والنشاط والتفاعل',
      href: '/admin/stats',
      color: 'green' as const,
      badge: 'مباشر',
    },
  ];

  const fullName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'أدمن';

  const firstName = fullName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '—';
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(date));
    } catch {
      return '—';
    }
  };

  return (
    <>
      <PageHead
        label="منطقة مخصصة"
        title="لوحة التحكم"
        description="إدارة المحتوى والمستخدمين والإحصائيات"
      />

      <section className="container content-section admin-dashboard">
        {/* ============ ترحيب فاخر ============ */}
        <Reveal className="dashboard-hero" animation="zoom-in">
          <div className="dashboard-hero-bg" aria-hidden="true">
            <div className="dashboard-hero-glow dashboard-hero-glow-1" />
            <div className="dashboard-hero-glow dashboard-hero-glow-2" />
            <div className="dashboard-hero-pattern" />
          </div>

          <div className="dashboard-hero-content">
            <div className="dashboard-hero-avatar">
              <span className="dashboard-hero-initial">{initial}</span>
              <span className="dashboard-hero-status" />
            </div>

            <div className="dashboard-hero-text">
              <span className="dashboard-hero-greeting">مرحبًا بك</span>
              <h2>{firstName} 👋</h2>
              <p>لديك صلاحيات إدارية كاملة على الموقع</p>
            </div>

            <div className="dashboard-hero-badge">
              <Crown size={14} />
              <span>Admin</span>
            </div>
          </div>

          <span className="dashboard-hero-star dashboard-hero-star-1" aria-hidden="true">✦</span>
          <span className="dashboard-hero-star dashboard-hero-star-2" aria-hidden="true">✧</span>
          <span className="dashboard-hero-star dashboard-hero-star-3" aria-hidden="true">۞</span>
        </Reveal>

        {/* ============ الإحصائيات ============ */}
        <Reveal className="dashboard-section-header" animation="fade-up">
          <div className="dashboard-section-title">
            <span className="dashboard-section-icon">
              <TrendingUp size={18} />
            </span>
            <div>
              <h2>نظرة سريعة</h2>
              <p>ملخص شامل لأهم الأرقام</p>
            </div>
          </div>
        </Reveal>

        <div className="dashboard-stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} animation="fade-up" delay={i * 80}>
              <Link
                href={s.href}
                className={`dashboard-stat dashboard-stat-${s.color}`}
              >
                <span className="dashboard-stat-bg" aria-hidden="true" />
                <span className="dashboard-stat-icon">
                  <s.icon size={24} strokeWidth={1.6} />
                </span>

                <div className="dashboard-stat-body">
                  <div className="dashboard-stat-value">
                    <strong>{arabic(s.value)}</strong>
                    <span className="dashboard-stat-trend">{s.trend}</span>
                  </div>
                  <span className="dashboard-stat-label">{s.label}</span>
                  <span className="dashboard-stat-sub">{s.sub}</span>
                </div>

                <span className="dashboard-stat-arrow">
                  <ArrowLeft size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ============ الأقسام ============ */}
        <Reveal className="dashboard-section-header" animation="fade-up">
          <div className="dashboard-section-title">
            <span className="dashboard-section-icon">
              <Sparkles size={18} />
            </span>
            <div>
              <h2>الأقسام</h2>
              <p>اختر قسمًا لبدء الإدارة</p>
            </div>
          </div>
        </Reveal>

        <div className="dashboard-sections">
          {sections.map((s, i) => (
            <Reveal key={s.title} animation="fade-up" delay={i * 100}>
              <Link
                href={s.href}
                className={`dashboard-section dashboard-section-${s.color}`}
              >
                <span className="dashboard-section-bg" aria-hidden="true" />

                <div className="dashboard-section-top">
                  <span className="dashboard-section-icon-lg">
                    <s.icon size={28} strokeWidth={1.6} />
                  </span>
                  <span className="dashboard-section-badge">{s.badge}</span>
                </div>

                <h3>{s.title}</h3>
                <p>{s.desc}</p>

                <span className="dashboard-section-cta">
                  <span>دخول</span>
                  <ChevronLeft size={15} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ============ معلومات الجلسة ============ */}
        <Reveal className="dashboard-session" animation="fade-up" delay={200}>
          <div className="dashboard-session-header">
            <span className="dashboard-session-header-icon">
              <Shield size={18} />
            </span>
            <div>
              <h3>معلومات الجلسة</h3>
              <p>بيانات حسابك الحالي</p>
            </div>
          </div>

          <div className="dashboard-session-grid">
            <div className="dashboard-session-item">
              <span className="dashboard-session-item-icon">
                <Mail size={15} />
              </span>
              <div>
                <small>البريد الإلكتروني</small>
                <strong dir="ltr">{user.email}</strong>
              </div>
            </div>

            <div className="dashboard-session-item">
              <span className="dashboard-session-item-icon">
                <Crown size={15} />
              </span>
              <div>
                <small>الدور</small>
                <strong>مشرف عام</strong>
              </div>
            </div>

            <div className="dashboard-session-item">
              <span className="dashboard-session-item-icon">
                <Hash size={15} />
              </span>
              <div>
                <small>معرّف المستخدم</small>
                <strong className="dashboard-uuid">
                  #{user.id.slice(0, 12)}
                </strong>
              </div>
            </div>

            <div className="dashboard-session-item">
              <span className="dashboard-session-item-icon">
                <Clock size={15} />
              </span>
              <div>
                <small>آخر دخول</small>
                <strong>{formatDate(user.last_sign_in_at)}</strong>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}