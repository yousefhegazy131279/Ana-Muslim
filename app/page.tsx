import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Sun, HandHeart, ScrollText, ArrowLeft, Sprout, Sparkles, Check, ArrowUpLeft, Clock } from 'lucide-react';
import { SectionTitle } from '@/components/ui';
import { Daily } from '@/components/daily';
import { Counter } from '@/components/counter';
import { Reveal } from '@/components/reveal';

const sections = [
  { icon: BookOpen, title: 'القرآن الكريم', desc: 'تلاوة تُنير قلبك، ومعانٍ تتدبّرها.', meta: '١١٤ سورة بين يديك', href: '/quran/' },
  { icon: Sun, title: 'الأذكار اليومية', desc: 'حصّن يومك بذكر الله واطمئن.', meta: 'من الصباح إلى المساء', href: '/athkar/' },
  { icon: HandHeart, title: 'الأدعية', desc: 'ارفع يديك، فباب الدعاء لا يُغلق.', meta: 'من الكتاب والسنة', href: '/duas/' },
  { icon: ScrollText, title: 'الأحاديث النبوية', desc: 'من هدي النبي ﷺ إلى تفاصيل حياتك.', meta: 'أحاديث ومعانٍ وشروح', href: '/hadith/' },
];

export default function Home() {
  return (
    <>
      {/* ============ قسم البطل ============ */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-grid-lines" />
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
          <div className="hero-pattern" />
        </div>

        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker hero-anim" style={{ animationDelay: '0.1s' }}>
              <span className="kicker-dot" />
              مساحة لقلبك، ورفيق ليومك
            </span>

            <h1 className="hero-anim" style={{ animationDelay: '0.2s' }}>
              مرحبًا بك في<br />
              <span className="hero-title-main">
                أنا مسلم
                <span className="title-star">✧</span>
              </span>
            </h1>

            <p className="hero-anim" style={{ animationDelay: '0.35s' }}>
              هنا تبدأ لحظات السكينة.<br />
              قرآن تتدبّره، وذكرٌ يطمئن به قلبك، وهديٌ ينير دربك.
            </p>

            <div className="hero-actions hero-anim" style={{ animationDelay: '0.5s' }}>
              <Link href="/quran/" className="button gold-button">
                <BookOpen size={20} />
                تصفّح القرآن
                <ArrowLeft size={19} />
              </Link>
              <Link href="/about/" className="button hero-secondary">
                تعرّف علينا
                <ArrowUpLeft size={18} />
              </Link>
            </div>

            <div className="hero-trust hero-anim" style={{ animationDelay: '0.65s' }}>
              <span><Check size={15} />محتوى موثّق المصادر</span>
              <span><Check size={15} />تجربة عربية متكاملة</span>
            </div>
          </div>

          <div className="hero-visual hero-anim" style={{ animationDelay: '0.4s' }}>
            <div className="arch-frame">
              <Image
                src="/images/mosque.jpg"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 480px"
                alt="قبة مسجد ومئذنته في ضوء النهار"
                className="mosque-image"
              />
              <div className="image-tint" />
              <div className="image-caption">
                <span>﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾</span>
                <small>سورة الرعد · الآية ٢٨</small>
              </div>
            </div>

            <div className="floating-seal">
              <Sprout size={24} />
              <span>
                لحظاتٌ من الذكر<br />
                <strong>أثرٌ من السكينة</strong>
              </span>
            </div>

            <span className="visual-star">✧</span>
            <span className="visual-star-2">✦</span>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="container">
            <span>اقرأ. تدبّر. اذكر.</span>
            <span>رحلتك مع الإيمان، كل يوم <Sparkles size={15} /></span>
          </div>
        </div>
      </section>

      {/* ============ قسم أبواب الخير ============ */}
      <section className="section container feature-section" id="sections">
        <div className="feature-bg" aria-hidden="true">
          <div className="feature-orb feature-orb-1" />
          <div className="feature-orb feature-orb-2" />
          <div className="feature-dots" />
        </div>

        <Reveal className="feature-header" animation="fade-up">
          <SectionTitle label="أبواب الخير" title="كل ما يقرّبك، في مكان واحد" />
        </Reveal>

        <div className="feature-grid">
          {sections.map((s, i) => (
            <Reveal
              key={s.title}
              animation="fade-up"
              delay={i * 100}
              duration={700}
            >
              <Link href={s.href} className="feature-card">
                <span className="feature-glow" aria-hidden="true" />
                <div className="feature-top">
                  <span className="feature-icon">
                    <s.icon size={28} strokeWidth={1.5} />
                  </span>
                  <span className="feature-arrow">
                    <ArrowUpLeft size={20} />
                  </span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="feature-bottom">
                  <span className="feature-meta">{s.meta}</span>
                  <span className="feature-cta"><ArrowLeft size={17} /></span>
                </div>
                <span className="feature-number" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ قسم وقفة مع المعنى ============ */}
      <section className="daily-section">
        <div className="daily-bg" aria-hidden="true">
          <div className="daily-glow daily-glow-1" />
          <div className="daily-glow daily-glow-2" />
          <div className="daily-ornament" />
        </div>

        <div className="container daily-container">
          <Reveal className="daily-header" animation="fade-up">
            <SectionTitle label="وقفة مع المعنى" title="نورٌ يتجدّد كل يوم" />
          </Reveal>

          <Reveal animation="fade-up" delay={100}>
            <Daily />
          </Reveal>
        </div>
      </section>

   {/* ============ قسم القصص ============ */}
<section className="section container stories-section">
  <div className="stories-bg" aria-hidden="true">
    <div className="stories-glow stories-glow-1" />
    <div className="stories-glow stories-glow-2" />
    <div className="stories-ornament" />
  </div>

  <Reveal className="stories-header" animation="fade-up">
    <SectionTitle
      label="في قصصهم عِبرة"
      title="قصصٌ تهدي، ودروسٌ تبقى"
      href="/stories/"
      link="جميع القصص"
    />
  </Reveal>

  <div className="home-stories">
    {[
      { name: 'يوسف عليه السلام', desc: 'من ظلمة الجبّ إلى نور التمكين؛ رحلة في الصبر وحُسن الظن بالله.', slug: 'yusuf', label: 'الصبر واليقين', num: '١٢', readTime: '٨ دقائق' },
      { name: 'موسى عليه السلام', desc: 'ثقةٌ بوعد الله، وثباتٌ أمام الطغيان، ونجاةٌ بفضل الرحمن.', slug: 'musa', label: 'الثقة والتوكّل', num: '٢٠', readTime: '١٠ دقائق' },
      { name: 'إبراهيم عليه السلام', desc: 'قلبٌ منيب، ودعوةٌ إلى التوحيد، وتسليمٌ لأمر الله.', slug: 'ibrahim', label: 'الإيمان والتسليم', num: '١٤', readTime: '٩ دقائق' },
    ].map((s, i) => (
      <Reveal key={s.slug} animation="fade-up" delay={i * 120} duration={700}>
        <Link className="story-preview" href={'/stories/' + s.slug + '/'}>
          <span className="story-glow" aria-hidden="true" />
          <span className="story-number" aria-hidden="true">{s.num}</span>

          {/* ============ منطقة الصورة ============ */}
          <div className="story-symbol story-symbol-image">
            {/* الزخرفة الداخلية */}
            <span className="story-symbol-ornament" aria-hidden="true" />

            {/* طبقة تعتيم */}
            <span className="story-image-tint" aria-hidden="true" />

            {/* الصورة */}
            <Image
              src={`/images/prophets/${s.slug}.png`}
              alt={`قصة ${s.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="story-image"
            />

            {/* التسمية */}
            <span className="story-symbol-label story-symbol-label-overlay">
              {s.label}
            </span>
          </div>

          <div className="story-body">
            <div className="story-meta">
              <span className="story-badge"><Sparkles size={11} />قصة قرآنية</span>
              <span className="story-time"><Clock size={11} />{s.readTime}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className="story-cta">اقرأ القصة <ArrowLeft size={17} /></span>
          </div>
        </Link>
      </Reveal>
    ))}
  </div>
</section>

      {/* ============ قسم الإحصائيات ============ */}
      <section className="stats-band">
        <div className="stats-bg" aria-hidden="true">
          <div className="stats-glow stats-glow-1" />
          <div className="stats-glow stats-glow-2" />
          <div className="stats-pattern" />
        </div>

        <div className="container stats">
          <Reveal className="stat-item" animation="fade-up" delay={0}>
            <div className="stat-icon"><BookOpen size={24} strokeWidth={1.5} /></div>
            <strong className="stat-number"><Counter to={114} duration={1800} /></strong>
            <span className="stat-label">سورة من القرآن الكريم</span>
          </Reveal>

          <Reveal className="stat-item" animation="fade-up" delay={100}>
            <div className="stat-icon"><ScrollText size={24} strokeWidth={1.5} /></div>
            <strong className="stat-number"><Counter to={6236} duration={2200} /></strong>
            <span className="stat-label">آية نتلوها ونتدبّرها</span>
          </Reveal>

          <Reveal className="stat-item" animation="fade-up" delay={200}>
            <div className="stat-icon"><Sparkles size={24} strokeWidth={1.5} /></div>
            <strong className="stat-number"><Counter to={135} duration={2400} /></strong>
            <span className="stat-label">ذكرًا وأذكارًا يومية</span>
          </Reveal>

          <Reveal className="stat-item" animation="fade-up" delay={300}>
            <div className="stat-icon"><HandHeart size={24} strokeWidth={1.5} /></div>
            <strong className="stat-number"><Counter to={365} duration={2600} /></strong>
            <span className="stat-label">يومًا من الاقتراب والذكر</span>
          </Reveal>
        </div>
      </section>

      {/* ============ قسم CTA ============ */}
      <section className="cta-section">
        <div className="container">
          <Reveal className="cta-card" animation="zoom-in" duration={800}>
            <div className="cta-bg" aria-hidden="true">
              <div className="cta-glow cta-glow-1" />
              <div className="cta-glow cta-glow-2" />
              <div className="cta-pattern" />
            </div>

            <div className="cta-content">
              <span className="cta-eyebrow">
                <span className="cta-dot" />
                خير الأعمال أدومها
              </span>

              <h2 className="cta-title">
                ابدأ رحلتك الروحانية <span className="cta-title-accent">اليوم</span>
              </h2>

              <p className="cta-text">
                آية تقرؤها، وذكرٌ تردّده… خطوات صغيرة يبارك الله أثرها.
              </p>

              <div className="cta-actions">
                <Link href="#sections" className="button cta-primary">
                  <Sparkles size={18} />
                  تصفّح الأقسام
                  <ArrowLeft size={19} />
                </Link>
                <Link href="/quran/" className="button cta-secondary">
                  <BookOpen size={18} />
                  ابدأ بالقرآن
                </Link>
              </div>
            </div>

            <span className="cta-star cta-star-1" aria-hidden="true">✧</span>
            <span className="cta-star cta-star-2" aria-hidden="true">✦</span>
            <span className="cta-star cta-star-3" aria-hidden="true">✧</span>
          </Reveal>
        </div>
      </section>
    </>
  );
}