import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import {
  ArrowRight, ArrowLeft, BookOpen, ScrollText, Sparkles,
  Clock, Eye, ChevronLeft, ChevronRight, Quote,
} from 'lucide-react';
import prophets from '@/data/prophets.json';
import { PageHead, arabic } from '@/components/ui';
import { Reveal } from '@/components/reveal';
import { ReadingProgress } from '@/components/reading-progress';
import type { Ayah } from '@/components/reader';
import type { HadithRecord } from '@/components/hadith';
import meta from '@/data/hadith-meta.json';

type Story = {
  id: number;
  slug: string;
  name: string;
  theme: string;
  summary: string;
  limits: string;
  ayahCount: number;
  hadithCount: number;
  chapters: {
    id: number;
    title: string;
    lead: string;
    passages: {
      surah_id: number;
      surah: string;
      start: number;
      end: number;
      verses: Ayah[];
    }[];
    hadiths: HadithRecord[];
  }[];
};

export const dynamicParams = false;

export function generateStaticParams() {
  return prophets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = prophets.find((p) => p.slug === slug);
  return {
    title: p ? `قصة ${p.name} بالأدلة والتفسير` : 'القصة غير موجودة',
    description: p?.summary,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = prophets.find((p) => p.slug === slug);
  if (!entry) notFound();

  const p: Story = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), 'data/stories', entry.slug + '.json'),
      'utf8'
    )
  );

  // ===== النبي السابق والتالي =====
  const currentIndex = prophets.findIndex((x) => x.slug === slug);
  const prevProphet = currentIndex > 0 ? prophets[currentIndex - 1] : null;
  const nextProphet =
    currentIndex < prophets.length - 1 ? prophets[currentIndex + 1] : null;

  return (
    <>
      <ReadingProgress />

      <PageHead
        label={`قصص الأنبياء · ${p.theme}`}
        title={p.name}
        description={p.summary}
      />

      <section className="container content-section story-page">

        {/* ============ شريط معلومات القصة ============ */}
        <Reveal className="story-stats-bar" animation="fade-up">
          <div className="story-stat">
            <BookOpen size={18} />
            <div>
              <strong>{arabic(p.chapters.length)}</strong>
              <span>فصول</span>
            </div>
          </div>
          <div className="story-stat">
            <Sparkles size={18} />
            <div>
              <strong>{arabic(p.ayahCount)}</strong>
              <span>آية مع تفسيرها</span>
            </div>
          </div>
          {p.hadithCount > 0 && (
            <div className="story-stat">
              <ScrollText size={18} />
              <div>
                <strong>{arabic(p.hadithCount)}</strong>
                <span>إحالات حديثية</span>
              </div>
            </div>
          )}
          <div className="story-stat">
            <Clock size={18} />
            <div>
              <strong>{arabic(Math.ceil(p.chapters.length * 3))}</strong>
              <span>دقيقة قراءة</span>
            </div>
          </div>
        </Reveal>

        {/* ============ التخطيط الرئيسي ============ */}
        <div className="story-layout">

          {/* ============ الفهرس الجانبي ============ */}
          <aside className="story-toc">
            <div className="toc-inner">
              <h3 className="toc-title">
                <BookOpen size={16} />
                فهرس القصة
              </h3>

              <nav className="toc-list">
                {p.chapters.map((c, i) => (
                  <a
                    key={c.id}
                    href={`#chapter-${c.id}`}
                    className="toc-link"
                  >
                    <span className="toc-number">{arabic(i + 1)}</span>
                    <span className="toc-text">{c.title}</span>
                  </a>
                ))}
              </nav>

              <div className="toc-footer">
                <a href="#story-sources" className="toc-link toc-link-sub">
                  <span className="toc-number">
                    <Quote size={12} />
                  </span>
                  <span className="toc-text">المصادر وحدود الروايات</span>
                </a>

                <Link href="/stories/" className="toc-back">
                  <ArrowRight size={14} />
                  جميع الأنبياء
                </Link>
              </div>
            </div>
          </aside>

          {/* ============ المحتوى ============ */}
          <article className="prose story-prose">

            {/* ============ تنبيه ============ */}
            <Reveal className="story-notice" animation="fade-up">
              <Quote size={20} className="story-notice-icon" />
              <p>
                السرد التمهيدي صياغة تحريرية. يلي كل فصل نصّ الأدلة، والتفسير
                الميسّر كاملًا للمقاطع المعروضة، وشروح الأحاديث من مصدرها.
                لا ندّعي استيعاب كل رواية تاريخية.
              </p>
            </Reveal>

            {/* ============ الفصول ============ */}
            {p.chapters.map((c, cIdx) => (
              <section
                key={c.id}
                id={`chapter-${c.id}`}
                className="story-chapter"
              >
                {/* رأس الفصل */}
                <Reveal className="chapter-header" animation="fade-up">
                  <span className="chapter-eyebrow">
                    <span className="chapter-number">
                      {arabic(c.id)}
                    </span>
                    الفصل {arabic(c.id)} من {arabic(p.chapters.length)}
                  </span>
                  <h2 className="chapter-title">{c.title}</h2>
                  <span className="chapter-divider" aria-hidden="true">
                    <span className="divider-line" />
                    <span className="divider-dot">✦</span>
                    <span className="divider-line" />
                  </span>
                </Reveal>

                {/* مقدمة الفصل */}
                <Reveal animation="fade-up" delay={100}>
                  <p className="chapter-lead">{c.lead}</p>
                </Reveal>

                {/* ============ المقاطع القرآنية ============ */}
                {c.passages.map((r, i) => (
                  <Reveal
                    className="scripture-evidence"
                    animation="fade-up"
                    delay={150 + i * 50}
                    key={i}
                  >
                    <div className="evidence-heading">
                      <strong>
                        <BookOpen size={14} />
                        سورة {r.surah} · {arabic(r.start)}
                        {r.end !== r.start ? '–' + arabic(r.end) : ''}
                      </strong>
                      <Link
                        href={`/quran/${r.surah_id}/#ayah-${r.start}`}
                        className="evidence-link"
                      >
                        اقرأ في السورة
                        <ChevronLeft size={13} />
                      </Link>
                    </div>

                    <div className="scripture-body">
                      <div className="sacred scripture-text">
                        {r.verses.map((a) => (
                          <span key={a.id}>
                            {a.text_arabic}{' '}
                            <span className="inline-ayah">
                              ﴿{arabic(a.ayah_number)}﴾
                            </span>{' '}
                          </span>
                        ))}
                      </div>
                    </div>

                    <details className="tafsir-details">
                      <summary>
                        <Eye size={14} />
                        اقرأ التفسير الميسّر كاملًا لهذا المقطع
                      </summary>

                      <div className="tafsir-body">
                        {r.verses.map((a) => (
                          <div key={a.id} className="tafsir-entry">
                            <span className="tafsir-badge">
                              الآية {arabic(a.ayah_number)}
                            </span>
                            <p>{a.tafsir_text}</p>
                          </div>
                        ))}

                        <p className="source">
                          التفسير الميسّر — مجمع الملك فهد لطباعة المصحف
                          الشريف، عبر Al Quran Cloud.
                        </p>

                        <a
                          className="source-line"
                          href={`https://quran.ksu.edu.sa/tafseer/katheer/sura${r.surah_id}-aya${r.start}.html`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          للمقارنة والزيادة: تفسير ابن كثير لأول آية في
                          المقطع، في مشروع المصحف بجامعة الملك سعود
                        </a>
                      </div>
                    </details>
                  </Reveal>
                ))}

                {/* ============ الأحاديث ============ */}
                {c.hadiths.map((h, hIdx) => (
                  <Reveal
                    className="story-hadith"
                    animation="fade-up"
                    delay={200 + hIdx * 60}
                    key={h.id}
                  >
                    <details>
                      <summary className="hadith-summary">
                        <span className="hadith-badge">
                          <ScrollText size={12} />
                          من السنة · {h.takhrij}
                        </span>
                        <strong className="hadith-headline">
                          {h.title}
                        </strong>
                        <span className="hadith-cta">
                          افتح النص والشرح والفوائد
                          <ChevronLeft size={13} />
                        </span>
                      </summary>

                      <div className="hadith-body">
                        <p className="sacred source-text">
                          {h.hadith_text}
                        </p>

                        <div className="source-judgment">
                          <strong>حكم المصدر:</strong> {h.grade}
                          <br />
                          <strong>التخريج:</strong> {h.takhrij}
                        </div>

                        <h3 className="hadith-section-title">
                          الشرح الكامل
                        </h3>
                        <p className="source-text">{h.explanation}</p>

                        {h.word_meanings && (
                          <>
                            <h3 className="hadith-section-title">
                              معاني الكلمات
                            </h3>
                            <p className="source-text">
                              {h.word_meanings}
                            </p>
                          </>
                        )}

                        {h.benefits && (
                          <>
                            <h3 className="hadith-section-title">الفوائد</h3>
                            <p className="source-text">{h.benefits}</p>
                          </>
                        )}

                        <a
                          href={h.link}
                          className="source-line"
                          target="_blank"
                          rel="noreferrer"
                        >
                          مصدر النص والشرح: موسوعة الأحاديث النبوية
                          HadeethEnc · {meta.version}
                        </a>
                      </div>
                    </details>
                  </Reveal>
                ))}

                {/* رابط للفصل التالي */}
                {cIdx < p.chapters.length - 1 && (
                  <Reveal
                    className="chapter-next"
                    animation="fade-up"
                    delay={250}
                  >
                    <a href={`#chapter-${p.chapters[cIdx + 1].id}`}>
                      <span>الفصل التالي</span>
                      <strong>{p.chapters[cIdx + 1].title}</strong>
                      <ChevronLeft size={16} />
                    </a>
                  </Reveal>
                )}
              </section>
            ))}

            {/* ============ المصادر ============ */}
            <section id="story-sources" className="story-sources">
              <Reveal className="sources-header" animation="fade-up">
                <h2>المصادر وحدود الروايات</h2>
              </Reveal>

              {p.limits && (
                <Reveal animation="fade-up" delay={100}>
                  <p>{p.limits}</p>
                </Reveal>
              )}

              <Reveal animation="fade-up" delay={150}>
                <p>
                  الآيات والتفسير الميسّر من{' '}
                  <a
                    href="https://alquran.cloud/api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Al Quran Cloud
                  </a>
                  . الأحاديث وشروحها محفوظة بألفاظ{' '}
                  <a
                    href="https://hadeethenc.com/ar/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    موسوعة الأحاديث النبوية
                  </a>{' '}
                  مع حكم المصدر وتخريجه. روابط تفسير ابن كثير للرجوع
                  والتوسع، ولا تعني تصحيح كل خبر تاريخي ينقله التفسير.
                </p>
              </Reveal>

              <Reveal animation="fade-up" delay={200}>
                <p>
                  الأخبار التاريخية وتعيين المواقع والقبور والتواريخ
                  الدقيقة تحتاج إلى دليل مستقل. لم تُعرض حكاية إسرائيلية
                  أو دعوى أثرية على أنها حقيقة ثابتة. تختلف كمية التفصيل
                  بحسب ما ورد في المصادر، ولا يُزاد حوار أو حدث لمجرد
                  إطالة السرد.
                </p>
              </Reveal>

              {p.hadithCount > 0 && (
                <details className="source-policy">
                  <summary>معلومات إصدار النصوص الحديثية</summary>
                  <pre dir="ltr">{meta.version_info}</pre>
                </details>
              )}
            </section>

            {/* ============ التنقل بين الأنبياء ============ */}
            <Reveal className="story-nav" animation="fade-up">
              {prevProphet ? (
                <Link
                  href={`/stories/${prevProphet.slug}/`}
                  className="story-nav-item story-nav-prev"
                >
                  <ArrowRight size={18} />
                  <div>
                    <span>النبي السابق</span>
                    <strong>{prevProphet.name}</strong>
                  </div>
                </Link>
              ) : (
                <span className="story-nav-item story-nav-empty" />
              )}

              <Link
                href="/stories/"
                className="story-nav-item story-nav-home"
              >
                <BookOpen size={18} />
                <div>
                  <span>العودة إلى</span>
                  <strong>شجرة الأنبياء</strong>
                </div>
              </Link>

              {nextProphet ? (
                <Link
                  href={`/stories/${nextProphet.slug}/`}
                  className="story-nav-item story-nav-next"
                >
                  <div>
                    <span>النبي التالي</span>
                    <strong>{nextProphet.name}</strong>
                  </div>
                  <ArrowLeft size={18} />
                </Link>
              ) : (
                <span className="story-nav-item story-nav-empty" />
              )}
            </Reveal>
          </article>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: p.name,
            description: p.summary,
            inLanguage: 'ar',
            isAccessibleForFree: true,
          }).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}