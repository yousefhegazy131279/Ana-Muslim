'use client';

import { AuthButton } from './auth-button';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BookOpen,
  Menu,
  X,
  ArrowUp,
  Heart,
  ArrowUpLeft,
  Sparkles,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ThemeToggle } from './theme-toggle';

const links: [string, string][] = [
  ['/', 'الرئيسية'],
  ['/about/', 'من نحن'],
  ['/quran/', 'القرآن الكريم'],
  ['/athkar/', 'الأذكار'],
  ['/duas/', 'الأدعية'],
  ['/hadith/', 'الأحاديث'],
  ['/stories/', 'قصص الأنبياء'],
];

// ============================================================
// الشعار
// ============================================================
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="أنا مسلم، الرئيسية">
      <Image
        src="/logo.png"
        alt="أنا مسلم — دليل كل مسلم"
        width={200}
        height={64}
        priority
        className="logo-image"
      />
    </Link>
  );
}

// ============================================================
// المكوّن الرئيسي
// ============================================================
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out',
      offset: 45,
      once: true,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
    const scroll = () => setScrolled(window.scrollY > 70);
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    AOS.refresh();
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (url: string) =>
    url === '/' ? path === '/' : path.startsWith(url);

  return (
    <>
      <a className="skip-link" href="#main">
        انتقل إلى المحتوى
      </a>

      {/* ============ الهيدر ============ */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-wrap">
          <Logo />

          <nav
            aria-label="التنقل الرئيسي"
            className={`nav-links ${open ? 'open' : ''}`}
          >
            {links.map(([url, label]) => (
              <Link
                key={url}
                href={url}
                className={`nav-link ${isActive(url) ? 'active' : ''}`}
                aria-current={isActive(url) ? 'page' : undefined}
              >
                <span>{label}</span>
                <i className="nav-link-underline" aria-hidden="true" />
              </Link>
            ))}

            <Link href="/quran/" className="nav-cta-mobile">
              وردك من القرآن
              <BookOpen size={17} />
            </Link>

            <div className="mobile-theme-row">
              <span>المظهر</span>
              <ThemeToggle />
            </div>
          </nav>

          <ThemeToggle />

          <Link href="/quran/" className="nav-cta">
            <span className="nav-cta-icon">
              <BookOpen size={17} />
            </span>
            <span>وردك من القرآن</span>
            <Sparkles size={14} className="nav-cta-sparkle" />
          </Link>

          {/* ← زر التسجيل: أقصى شمال الناف */}
          <AuthButton />

          <button
            className={`icon-button mobile-menu ${open ? 'is-open' : ''}`}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ============ المحتوى ============ */}
      <main id="main" key={path}>
        {children}
      </main>

      {/* ============ الفوتر ============ */}
      <footer className="site-footer">
        {/* آية زخرفية */}
        <div className="footer-verse">
          <div className="container">
            <p>﴿ إِنَّ هَـٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾</p>
            <small>سورة الإسراء · الآية ٩</small>
          </div>
        </div>

        <div className="container footer-grid">
          {/* العمود الأول: العلامة */}
          <div className="footer-brand">
            <Logo />

            <h4 className="footer-tagline">دليل كل مسلم</h4>

            <p className="footer-slogan">اجعل دينك جزءًا من يومك</p>

            <p className="footer-about">
              منصة إسلامية شاملة تجمع لك القرآن الكريم بتفسيره، والأذكار
              والأدعية، والأحاديث النبوية بشروحها، وقصص الأنبياء — في
              تجربة عربية أنيقة، تُرافقك في كل لحظة.
            </p>
          </div>

          <div className="footer-col">
            <h3>روابط سريعة</h3>
            <Link href="/">الرئيسية</Link>
            <Link href="/about/">من نحن</Link>
            <Link href="/about/#sources">مصادر المحتوى</Link>
            <Link href="/privacy/">الخصوصية</Link>
          </div>

          <div className="footer-col">
            <h3>تصفّح وتعلّم</h3>
            <Link href="/quran/">القرآن الكريم</Link>
            <Link href="/athkar/">الأذكار اليومية</Link>
            <Link href="/duas/">الأدعية</Link>
            <Link href="/hadith/">الأحاديث النبوية</Link>
          </div>

          <div className="footer-col footer-col-last">
            <h3>من هدي النبوّة</h3>
            <Link href="/stories/">
              قصص الأنبياء <ArrowUpLeft size={14} />
            </Link>
            <p className="footer-note">﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</p>
          </div>
        </div>

        <div className="footer-bottom-wrap">
          <div className="container footer-bottom">
            <span className="footer-copy">
              © 2026 أنا مسلم. جميع الحقوق محفوظة.
            </span>

            <span className="footer-made">
              صُنع بكل <Heart size={13} /> من HGZ
            </span>

            <div className="footer-legal">
              <Link href="/privacy/">الخصوصية</Link>
              <span className="divider">·</span>
              <Link href="/terms/">شروط الاستخدام</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ============ زر العودة للأعلى ============ */}
      {scrolled && (
        <button
          className="back-top icon-button"
          aria-label="العودة إلى الأعلى"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={19} />
        </button>
      )}
    </>
  );
}