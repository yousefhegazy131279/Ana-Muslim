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
  } from 'lucide-react';
  import { PageHead, SectionTitle } from '@/components/ui';
  import { Reveal } from '@/components/reveal';
  
  export const metadata = { title: 'من نحن ومصادر المحتوى' };
  
  export default function Page() {
    return (
      <>
        <PageHead
          label="إيمانٌ يرافق يومك"
          title="من نحن"
          description="نقرّب إليك أبواب الخير، في تجربة عربية ميسّرة."
        />
  
        <section className="container content-section">
  
          {/* ============ قصتي ============ */}
          <section className="story-of-us" id="story">
            {/* خلفية متحركة */}
            <div className="story-of-us-bg" aria-hidden="true">
              <div className="story-of-us-glow story-of-us-glow-1" />
              <div className="story-of-us-glow story-of-us-glow-2" />
              <div className="story-of-us-ornament" />
            </div>
  
            <Reveal className="story-of-us-header" animation="fade-up">
              <span className="story-of-us-eyebrow">
                <Feather size={14} />
                لماذا أنشأت هذا الموقع
              </span>
              <h2 className="story-of-us-title">قصتي مع هذا الموقع</h2>
            </Reveal>
  
            <div className="story-of-us-body">
              <Reveal animation="fade-right" delay={100}>
                <div className="story-of-us-card story-of-us-intro">
                  <Quote size={36} className="story-of-us-quote-icon" />
                  <p>
                    في عالمٍ مليء بالمشاغل والضّوضاء، قررت أن أنتبه لنفسي قليلًا،
                    وإلى ديني، وسبيل نجاتي في الدنيا والآخرة — أن أجعله جزءًا لا
                    يتجزّأ من يومي.
                  </p>
                </div>
              </Reveal>
  
              <Reveal animation="fade-up" delay={200}>
                <p className="story-of-us-text">
                  نعم، جميعنا نُهمل أحيانًا في أشياء عديدة في حياتنا، سواء بقصد
                  أو بغير قصد. لكنّ <strong>الدين هو الشيء الوحيد الذي لا يجوز
                  إهماله</strong> لأي سبب.
                </p>
              </Reveal>
  
              <Reveal animation="fade-up" delay={300}>
                <p className="story-of-us-text">
                  لذلك أنشأت هذا الموقع، ليس فقط لنفسي، بل لأفيد الجميع بما
                  استطعت جمعه — من <strong>القرآن والأذكار والأدعية والأحاديث
                  وقصص الأنبياء</strong>، كلّها في مكان واحد.
                </p>
              </Reveal>
  
              <Reveal animation="fade-up" delay={400}>
                <div className="story-of-us-highlight">
                  <span className="story-of-us-highlight-icon">
                    <Star size={20} strokeWidth={1.5} />
                  </span>
                  <p>
                    وأتمنى أن تكون تجربة ممتعة وروحانية، والأهم: <strong>مفيدة</strong>.
                  </p>
                </div>
              </Reveal>
  
              <Reveal animation="fade-up" delay={500}>
                <div className="story-of-us-dua">
                  <p className="story-of-us-dua-text">
                    ولا تنسونا من صالح دعائكم
                  </p>
                  <p className="story-of-us-dua-jaza">
                    جزاكم الله خيرًا
                  </p>
                  <span className="story-of-us-dua-decoration">﷽</span>
                </div>
              </Reveal>
            </div>
  
            {/* زخارف جانبية */}
            <span className="story-of-us-star story-of-us-star-1" aria-hidden="true">✧</span>
            <span className="story-of-us-star story-of-us-star-2" aria-hidden="true">✦</span>
          </section>
  
          {/* ============ الرؤية والرسالة ============ */}
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
                تقديم محتوى إسلامي واضح المصادر، مع أدوات بسيطة للقراءة والتدبر
                والذكر، تراعي جمال العربية وسهولة استخدامها على مختلف الأجهزة.
              </p>
            </Reveal>
          </div>
  
          {/* ============ القيم ============ */}
          <div className="section">
            <Reveal animation="fade-up">
              <SectionTitle label="ما نعتني به" title="قيمٌ تقود التجربة" />
            </Reveal>
  
            <div className="values">
              {[
                {
                  icon: Heart,
                  title: 'الإخلاص',
                  text: 'نرجو أن يكون في هذا العمل نفع وخير.',
                },
                {
                  icon: ShieldCheck,
                  title: 'الدقة',
                  text: 'نعرض المصادر ونميّز النص المنقول من الملخّص.',
                },
                {
                  icon: Sparkles,
                  title: 'السهولة',
                  text: 'قراءة واضحة وأدوات قليلة تخدم غايتك.',
                },
                {
                  icon: BookOpen,
                  title: 'التنوّع',
                  text: 'أبواب من القرآن والذكر والسنة والقصص.',
                },
              ].map((v, i) => (
                <Reveal
                  className="value"
                  key={v.title}
                  animation="fade-up"
                  delay={i * 100}
                >
                  <v.icon size={24} />
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
  
          {/* ============ المصادر ============ */}
          <Reveal className="prose reading-width" animation="fade-up" id="sources">
            <h2>مصادر المحتوى</h2>
            <p>
              نص القرآن بالرسم العثماني والتفسير الميسر من بيانات{' '}
              <a href="https://alquran.cloud/api" target="_blank" rel="noreferrer">
                Al Quran Cloud
              </a>
              . التفسير الميسر من مجمع الملك فهد لطباعة المصحف الشريف. تضم النسخة
              المضمّنة ١١٤ سورة و٦٬٢٣٦ آية، وقد تم جلبها في ٢٢ سبتمبر ٢٠٢٦.
            </p>
            <p>
              التلاوة بصوت مشاري راشد العفاسي عبر شبكة Islamic Network. تعتمد
              التلاوة على الاتصال بالإنترنت وتوفّر المصدر الخارجي.
            </p>
            <p>
              الأذكار والأدعية مختارات مع مراجعها. مكتبة الأحاديث تضم جميع مواد
              ملف HadeethEnc العربي، الإصدار v1.7.0 المؤرخ في ١٢ نوفمبر ٢٠٢٥:
              ٣٥٨٢ مادة بالنص والشرح والحكم والتخريج كما وردت في المصدر. هذا ليس
              استيعابًا لكل روايات البخاري ومسلم؛ وقد تحتوي بعض المواد على آثار
              أو أحكام مركبة، تظهر بتفصيلها. قصص الأنبياء ٢٥ ملفًا في ٩٢ فصلًا مع
              المقاطع القرآنية وتفسيرها والأحاديث وشروحها. السرد التمهيدي صياغة
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
  
        </section>
      </>
    );
  }