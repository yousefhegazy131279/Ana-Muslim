import {
  BookOpen,
  Heart,
  ShieldCheck,
  Sparkles,
  Target,
  Sprout,
  Quote,
  Compass,
  Star,
  Feather,
  ExternalLink,
  Award,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { PageHead, SectionTitle } from '@/components/ui';
import { Reveal } from '@/components/reveal';
import { ContactSection, portfolio } from '@/components/contact-links';

export const metadata = {
  title: 'من نحن ومصادر المحتوى | أنا مسلم',
  description:
    'تعرّف على قصة "أنا مسلم"، رؤيتنا ورسالتنا وقيمنا، ومصادر المحتوى الشرعي الموثوق.',
};

const portfolioUrl = 'https://hogz.vercel.app';

const values = [
  {
    icon: Heart,
    title: 'الإخلاص',
    text: 'نرجو أن يكون في هذا العمل نفعٌ وخير للمسلمين، وأن يُكتب في ميزان حسنات كل من ساهم فيه.',
  },
  {
    icon: ShieldCheck,
    title: 'الدقة',
    text: 'نعرض المصادر ونميّز النص المنقول من الملخّص، ونتحقق من كل معلومة شرعية قبل نشرها.',
  },
  {
    icon: Sparkles,
    title: 'السهولة',
    text: 'قراءة واضحة وأدوات قليلة تخدم غايتك، بعيدًا عن التعقيد والتشويش.',
  },
  {
    icon: BookOpen,
    title: 'التنوّع',
    text: 'أبواب من القرآن والذكر والسنة والقصص، ليجد كل مسلم ما يناسب وقته وحاجته.',
  },
];

const stats = [
  { number: '114', label: 'سورة', icon: BookOpen },
  { number: '6,236', label: 'آية', icon: Feather },
  { number: '3,582', label: 'حديث', icon: ShieldCheck },
  { number: '92', label: 'فصلًا', icon: Layers },
];

const sources = [
  {
    name: 'القرآن الكريم',
    source: 'Al Quran Cloud',
    detail: 'الرسم العثماني المعتمد + التفسير الميسّر',
    link: 'https://alquran.cloud/api',
  },
  {
    name: 'التفسير الميسّر',
    source: 'مجمع الملك فهد لطباعة المصحف الشريف',
    detail: 'تفسير معتمد لكل آية',
  },
  {
    name: 'الأحاديث النبوية',
    source: 'موسوعة HadeethEnc',
    detail: 'الإصدار v1.7.0 — 3,582 مادة مع الحكم والتخريج',
  },
  {
    name: 'الأذكار والأدعية',
    source: 'حصن المسلم',
    detail: 'مختارات مع مراجعها',
  },
  {
    name: 'قصص الأنبياء',
    source: 'من القرآن والسنة',
    detail: '25 نبيًا في 92 فصلًا مع الأدلة',
  },
];

export default function Page() {
  return (
    <>
      <PageHead
        label="إيمانٌ يرافق يومك"
        title="من نحن"
        description="نقرّب إليك أبواب الخير، في تجربة عربية ميسّرة."
      />

      <section className="container content-section">

        {/* ============================================================
            القصة
            ============================================================ */}
        <section className="story-of-us" id="story">
          <div className="story-of-us-bg" aria-hidden="true">
            <div className="story-of-us-glow story-of-us-glow-1" />
            <div className="story-of-us-glow story-of-us-glow-2" />
            <div className="story-of-us-ornament" />
          </div>

          <Reveal className="story-of-us-header" animation="fade-up">
            <span className="story-of-us-eyebrow">
              <Feather size={14} />
              لماذا أنشأتُ هذا الموقع
            </span>
            <h2 className="story-of-us-title">قصتي مع "أنا مسلم"</h2>
          </Reveal>

          <div className="story-of-us-body">
            <Reveal animation="fade-right" delay={100}>
              <div className="story-of-us-card story-of-us-intro">
                <Quote size={36} className="story-of-us-quote-icon" />
                <p>
                  في عالمٍ مليء بالمشاغل والضّوضاء، قررتُ أن أنتبه لنفسي
                  قليلًا، وإلى ديني، وسبيل نجاتي في الدنيا والآخرة — أن
                  أجعله جزءًا لا يتجزّأ من يومي.
                </p>
              </div>
            </Reveal>

            <Reveal animation="fade-up" delay={200}>
              <p className="story-of-us-text">
                نعم، جميعنا نُهمل أحيانًا في أشياء عديدة في حياتنا، سواء
                بقصد أو بغير قصد. لكنّ{' '}
                <strong>الدين هو الشيء الوحيد الذي لا يجوز إهماله</strong>{' '}
                لأي سبب.
              </p>
            </Reveal>

            <Reveal animation="fade-up" delay={300}>
              <p className="story-of-us-text">
                لذلك أنشأتُ هذا الموقع، ليس فقط لنفسي، بل لأفيد الجميع
                بما استطعت جمعه — من{' '}
                <strong>
                  القرآن والأذكار والأدعية والأحاديث وقصص الأنبياء
                </strong>
                ، كلّها في مكان واحد.
              </p>
            </Reveal>

            <Reveal animation="fade-up" delay={400}>
              <div className="story-of-us-highlight">
                <span className="story-of-us-highlight-icon">
                  <Star size={20} strokeWidth={1.5} />
                </span>
                <p>
                  وأتمنى أن تكون تجربة ممتعة وروحانية، والأهم:{' '}
                  <strong>مفيدة</strong>.
                </p>
              </div>
            </Reveal>

            <Reveal animation="fade-up" delay={500}>
              <div className="story-of-us-dua">
                <p className="story-of-us-dua-text">
                  ولا تنسوني من صالح دعائكم
                </p>
                <p className="story-of-us-dua-jaza">جزاكم الله خيرًا</p>
                <span className="story-of-us-dua-decoration">﷽</span>
              </div>
            </Reveal>

            <Reveal animation="fade-up" delay={600}>
              <p className="story-of-us-signature">
                — <strong>يوسف حجازي</strong>
                <span className="story-of-us-signature-sub">
                  مطوّر ومصمّم المنصة
                </span>
              </p>
            </Reveal>
          </div>

          <span className="story-of-us-star story-of-us-star-1" aria-hidden="true">
            ✧
          </span>
          <span className="story-of-us-star story-of-us-star-2" aria-hidden="true">
            ✦
          </span>
        </section>

        {/* ============================================================
            إحصائيات
            ============================================================ */}
        <div className="section">
          <Reveal animation="fade-up">
            <SectionTitle
              label="أرقام تعرّفنا"
              title="محتوى ثريّ في متناول يدك"
            />
          </Reveal>

          <div className="about-stats">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal
                  key={stat.label}
                  className="about-stat"
                  animation="fade-up"
                  delay={i * 100}
                >
                  <span className="about-stat-icon">
                    <Icon size={22} />
                  </span>
                  <span className="about-stat-number" dir="ltr">
                    {stat.number}
                  </span>
                  <span className="about-stat-label">{stat.label}</span>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            الرؤية والرسالة
            ============================================================ */}
        <div className="about-grid">
          <Reveal className="about-card" animation="fade-right">
            <Target size={29} />
            <h2>رؤيتنا</h2>
            <p>
              أن يصبح الوصول إلى القرآن الكريم والذكر وهدي النبي ﷺ جزءًا
              يسيرًا من يوم المسلم؛ علمٌ نافع، وعبادةٌ واعية، وقلبٌ أكثر
              طمأنينة.
            </p>
          </Reveal>

          <Reveal className="about-card" animation="fade-left" delay={150}>
            <Sprout size={29} />
            <h2>رسالتنا</h2>
            <p>
              تقديم محتوى إسلامي واضح المصادر، مع أدوات بسيطة للقراءة
              والتدبر والذكر، تراعي جمال العربية وسهولة استخدامها على
              مختلف الأجهزة.
            </p>
          </Reveal>
        </div>

        {/* ============================================================
            القيم
            ============================================================ */}
        <div className="section">
          <Reveal animation="fade-up">
            <SectionTitle label="ما نعتني به" title="قيمٌ تقود التجربة" />
          </Reveal>

          <div className="values">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal
                  className="value"
                  key={v.title}
                  animation="fade-up"
                  delay={i * 100}
                >
                  <Icon size={24} />
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            المصادر
            ============================================================ */}
        <div className="section" id="sources">
          <Reveal animation="fade-up">
            <SectionTitle
              label="الشفافية أولًا"
              title="مصادر المحتوى والتحقق الشرعي"
            />
          </Reveal>

          <div className="sources-grid">
            {sources.map((s, i) => (
              <Reveal
                key={s.name}
                className="source-item"
                animation="fade-up"
                delay={i * 80}
              >
                <div className="source-item-head">
                  <Compass size={18} />
                  <h3>{s.name}</h3>
                </div>
                <p className="source-item-source">
                  {s.link ? (
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noreferrer"
                      className="source-item-link"
                    >
                      {s.source}
                    </a>
                  ) : (
                    s.source
                  )}
                </p>
                <p className="source-item-detail">{s.detail}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="prose reading-width" animation="fade-up" delay={200}>
            <p>
              نص القرآن بالرسم العثماني والتفسير الميسّر من بيانات{' '}
              <a
                href="https://alquran.cloud/api"
                target="_blank"
                rel="noreferrer"
              >
                Al Quran Cloud
              </a>
              . التفسير الميسّر من مجمع الملك فهد لطباعة المصحف الشريف. تضم
              النسخة المضمّنة ١١٤ سورة و٦٬٢٣٦ آية، وقد تم جلبها في ٢٢
              سبتمبر ٢٠٢٦.
            </p>
            <p>
              التلاوة بصوت مشاري راشد العفاسي عبر شبكة Islamic Network.
              تعتمد التلاوة على الاتصال بالإنترنت وتوفّر المصدر الخارجي.
            </p>
            <p>
              الأذكار والأدعية مختارات مع مراجعها. مكتبة الأحاديث تضم جميع
              مواد ملف HadeethEnc العربي، الإصدار v1.7.0 المؤرخ في ١٢
              نوفمبر ٢٠٢٥: ٣٥٨٢ مادة بالنص والشرح والحكم والتخريج كما
              وردت في المصدر. هذا ليس استيعابًا لكل روايات البخاري
              ومسلم؛ وقد تحتوي بعض المواد على آثار أو أحكام مركبة، تظهر
              بتفصيلها. قصص الأنبياء ٢٥ ملفًا في ٩٢ فصلًا مع المقاطع
              القرآنية وتفسيرها والأحاديث وشروحها. السرد التمهيدي صياغة
              تحريرية، ولا يدّعي استيعاب كل الأخبار التاريخية.
            </p>
            <p>
              صورة المسجد:{' '}
              <a
                href="https://unsplash.com/photos/mosque-with-turquoise-dome-and-minaret-against-sky-UOR-A7mQKpk"
                target="_blank"
                rel="noreferrer"
              >
                Jasurbek Hasanov على Unsplash
              </a>
              ، بموجب{' '}
              <a
                href="https://unsplash.com/license"
                target="_blank"
                rel="noreferrer"
              >
                ترخيص Unsplash
              </a>
              .
            </p>
          </Reveal>
        </div>

        {/* ============================================================
            بورتفوليو المطوّر
            ============================================================ */}
        <Reveal animation="fade-up">
          <section className="about-portfolio" aria-labelledby="portfolio-title">
            <div className="about-portfolio-bg" aria-hidden="true" />

            <div className="about-portfolio-inner">
              <div className="about-portfolio-text">
                <span className="about-portfolio-kicker">
                  <Award size={14} />
                  المطوّر
                </span>
                <h3 id="portfolio-title">يوسف حجازي</h3>
                <p>
                  مطوّر ومصمّم المنصة. أؤمن بأن كل مشروع هو خطوة نحو
                  الأفضل، وأن التقنية وسيلة لخدمة ما ينفع الناس. يمكنكم
                  الاطلاع على أعمالي السابقة من خلال البورتفوليو الرسمي.
                </p>
                <Link
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  <ExternalLink size={18} />
                  <span>زيارة البورتفوليو</span>
                  <span className="portfolio-url" dir="ltr">
                    hogz.vercel.app
                  </span>
                </Link>
              </div>

              <div className="about-portfolio-mark" aria-hidden="true">
                <span className="hgz-glow" dir="ltr">
                  HGZ
                </span>
                <span className="about-portfolio-mark-sub">
                  تطوير وتصميم
                </span>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ============================================================
            دعوة ختامية
            ============================================================ */}
        <Reveal animation="fade-up">
          <section className="about-cta">
            <p className="about-cta-verse">﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</p>
            <p className="about-cta-sub">
              أسأل الله أن يجعل هذا العمل نافعًا، وأن يجعله في ميزان
              حسنات كل من ساهم فيه.
            </p>
            <Link href="/quran/" className="about-cta-btn">
              <BookOpen size={18} />
              ابدأ رحلتك من القرآن
            </Link>
          </section>
        </Reveal>

        {/* ============================================================
            قسم التواصل
            ============================================================ */}
        <ContactSection />
      </section>
    </>
  );
}