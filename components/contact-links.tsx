'use client';

import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import {
  SiYoutube,
  SiTiktok,
  SiX,
  SiInstagram,
  SiFacebook,
  SiGithub,
  SiWhatsapp,
} from 'react-icons/si';

// ============================================================
// رابط البورتفوليو الرسمي
// ============================================================
export const portfolio = 'https://hogz.vercel.app';

// ============================================================
// أيقونة LinkedIn مخصصة (SVG) لأن react-icons أزالها
// ============================================================
function SiLinkedin({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ============================================================
// قائمة الروابط الاجتماعية
// ============================================================
const socialLinks = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/201117081077',
    icon: SiWhatsapp,
    label: 'واتساب',
    color: '#25D366',
  },
  {
    name: 'Email',
    href: 'mailto:yousef.hegazy.dev@gmail.com',
    icon: Mail,
    label: 'البريد الإلكتروني',
    color: '#EA4335',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@YousefHegazydev',
    icon: SiYoutube,
    label: 'يوتيوب',
    color: '#FF0000',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@yousefhegazydev?lang=en',
    icon: SiTiktok,
    label: 'تيك توك',
    color: '#000000',
  },
  {
    name: 'X',
    href: 'https://x.com/Yousefhegazy00',
    icon: SiX,
    label: 'إكس (تويتر)',
    color: '#000000',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/yousef.hegazy.dev/',
    icon: SiInstagram,
    label: 'إنستغرام',
    color: '#E4405F',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61594760347792',
    icon: SiFacebook,
    label: 'فيسبوك',
    color: '#1877F2',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/yousefhegazy131279',
    icon: SiGithub,
    label: 'جيت هب',
    color: '#181717',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yousef-hegazy-a0aa13333',
    icon: SiLinkedin,
    label: 'لينكد إن',
    color: '#0A66C2',
  },
];

// ============================================================
// مكوّن روابط التواصل الاجتماعي (للفوتر)
// ============================================================
export function SocialLinks() {
  return (
    <div className="social-links" aria-label="روابط التواصل الاجتماعي">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="social-link"
            title={link.label}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}

// ============================================================
// مكوّن قسم التواصل الكامل (لصفحة "من نحن" أو "اتصل بنا")
// ============================================================
export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <header className="contact-head">
        <span className="contact-kicker">
          <Send size={14} />
          تواصل معنا
        </span>
        <h2 className="contact-title">نسعد بتواصلك</h2>
        <p className="contact-subtitle">
          لأي سؤال أو اقتراح أو ملاحظة، يمكنك التواصل معنا عبر أي من
          القنوات التالية.
        </p>
      </header>

      <div className="contact-channels">
        {/* بطاقة البريد الإلكتروني */}
        <a
          href="mailto:yousef.hegazy.dev@gmail.com"
          className="contact-channel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-channel-icon">
            <Mail size={22} />
          </span>
          <span className="contact-channel-body">
            <span className="contact-channel-label">البريد الإلكتروني</span>
            <span className="contact-channel-value" dir="ltr">
              yousef.hegazy.dev@gmail.com
            </span>
          </span>
        </a>

        {/* بطاقة واتساب */}
        <a
          href="https://wa.me/201117081077"
          className="contact-channel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-channel-icon">
            <SiWhatsapp size={22} />
          </span>
          <span className="contact-channel-body">
            <span className="contact-channel-label">واتساب</span>
            <span className="contact-channel-value" dir="ltr">
              +20 111 708 1077
            </span>
          </span>
        </a>

        {/* بطاقة البورتفوليو */}
        <a
          href={portfolio}
          className="contact-channel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-channel-icon">
            <MapPin size={22} />
          </span>
          <span className="contact-channel-body">
            <span className="contact-channel-label">بورتفوليو الفريق</span>
            <span className="contact-channel-value" dir="ltr">
              hogz.vercel.app
            </span>
          </span>
        </a>
      </div>

      {/* شبكة أيقونات التواصل */}
      <div className="contact-social-wrap">
        <span className="contact-social-label">
          <MessageCircle size={16} />
          تابعنا على
        </span>
        <SocialLinks />
      </div>
    </section>
  );
}