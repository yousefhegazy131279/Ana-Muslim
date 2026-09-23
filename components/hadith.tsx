'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Copy,
  Link2,
  Check,
  X,
  Filter,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import meta from '@/data/hadith-meta.json';
import initial from '@/data/hadith-initial.json';
import { SearchInput, normalize, arabic } from './ui';
import { HadithDialog } from './hadith-dialog';
import { Reveal } from './reveal';
import { FavoriteButton } from './favorite-button';

export type HadithIndex = typeof initial[number];

export type HadithRecord = {
  id: number;
  title: string;
  hadith_text: string;
  explanation: string;
  word_meanings: string | null;
  benefits: string | null;
  grade: string;
  takhrij: string;
  link: string;
  categories: string[];
  books: string[];
};

const PER_PAGE = 12;

// ============================================================
// شارة الحكم
// ============================================================
function gradeClass(grade: string): string {
  if (grade === 'صحيح') return 'grade-sahih';
  if (grade === 'حسن') return 'grade-hasan';
  return 'grade-detail';
}

// ============================================================
// المكوّن الرئيسي
// ============================================================
export function Hadith() {
  const [data, setData] = useState<HadithIndex[]>(initial);
  const [loaded, setLoaded] = useState(false);
  const [failure, setFailure] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [book, setBook] = useState('');
  const [category, setCategory] = useState('');
  const [grade, setGrade] = useState('صحيح');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<HadithIndex | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const focus = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ===== تحميل البيانات =====
  async function load() {
    setFailure('');
    try {
      const r = await fetch('/data/hadith/index.json');
      if (!r.ok) throw Error();
      const rows: HadithIndex[] = await r.json();
      if (rows.length !== meta.count) throw Error();
      setData(rows);
      setLoaded(true);

      const id = Number(
        new URLSearchParams(window.location.search).get('id')
      );
      if (id) {
        const found = rows.find((h) => h.id === id);
        if (found) setSelected(found);
        else setFailure('لم نجد رقم المادة المطلوب.');
      }
    } catch {
      setFailure('تعذّر تحميل الفهرس الكامل. المعروض مجموعة أولية فقط.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // ===== استرجاع الفلاتر من URL =====
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const b = params.get('book');
    const c = params.get('cat');
    const g = params.get('grade');
    const p = params.get('page');
    if (q) {
      setQuery(q);
      setDebouncedQuery(q);
    }
    if (b) setBook(b);
    if (c) setCategory(c);
    if (g) setGrade(g);
    if (p) setPage(Number(p) || 1);
  }, []);

  // ===== Debounce =====
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // ===== تحديث URL =====
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (book) params.set('book', book);
    if (category) params.set('cat', category);
    if (grade && grade !== 'صحيح') params.set('grade', grade);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [debouncedQuery, book, category, grade, page]);

  // ===== الفلترة =====
  const results = useMemo(() => {
    const tokens = normalize(debouncedQuery.trim())
      .replace(/ـ/g, '')
      .split(/\s+/)
      .filter(Boolean);
    return data.filter(
      (h) =>
        (!book || h.books.includes(book)) &&
        (!category || h.categories.includes(category)) &&
        (!grade || h.grade_group === grade) &&
        tokens.every((t) => h.search.includes(t))
    );
  }, [data, debouncedQuery, book, category, grade]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const pageItems = results.slice(
    (current - 1) * PER_PAGE,
    current * PER_PAGE
  );

  // ===== الفلاتر النشطة =====
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (query) {
    activeFilters.push({
      label: `بحث: "${query}"`,
      onRemove: () => {
        setQuery('');
        setDebouncedQuery('');
        setPage(1);
      },
    });
  }
  if (book) {
    activeFilters.push({
      label: book,
      onRemove: () => {
        setBook('');
        setPage(1);
      },
    });
  }
  if (category) {
    activeFilters.push({
      label: category,
      onRemove: () => {
        setCategory('');
        setPage(1);
      },
    });
  }
  if (grade !== 'صحيح') {
    activeFilters.push({
      label: `الحكم: ${grade || 'الكل'}`,
      onRemove: () => {
        setGrade('صحيح');
        setPage(1);
      },
    });
  }

  function resetAll() {
    setQuery('');
    setDebouncedQuery('');
    setBook('');
    setCategory('');
    setGrade('صحيح');
    setPage(1);
  }

  function filter(set: (s: string) => void, v: string) {
    set(v);
    setPage(1);
  }

  // ===== Toast =====
  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }

  // ===== النسخ =====
  async function copyHadith(h: HadithIndex) {
    const text = `${h.title}\n\n${h.takhrij}\n\nhttps://hadeethenc.com/ar/browse/hadith/${h.id}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(h.id);
      showToast('تم نسخ الحديث');
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast('تعذّر النسخ');
    }
  }

  async function copyLink(h: HadithIndex) {
    const url = `${window.location.origin}/hadith/?id=${h.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('تم نسخ الرابط');
    } catch {
      showToast('تعذّر النسخ');
    }
  }

  // ===== فتح الحوار =====
  function open(h: HadithIndex) {
    focus.current = document.activeElement as HTMLElement;
    setSelected(h);
    const u = new URL(location.href);
    u.searchParams.set('id', String(h.id));
    history.replaceState(null, '', u);
  }

  function close() {
    setSelected(null);
    const u = new URL(location.href);
    u.searchParams.delete('id');
    history.replaceState(null, '', u);
    focus.current?.focus();
  }

  // ============================================================
  // العرض
  // ============================================================
  return (
    <section className="container content-section">
      {/* ============ ملخص المكتبة ============ */}
      <Reveal className="library-summary" animation="fade-up">
        <div className="library-summary-stat">
          <strong>{arabic(meta.count)}</strong>
          <span>مادة بالنص والشرح والتخريج</span>
        </div>
        <div className="library-summary-info">
          <p>
            من موسوعة الأحاديث النبوية{' '}
            <a href={meta.source} target="_blank" rel="noreferrer">
              HadeethEnc
            </a>{' '}
            · {meta.version}
          </p>
          <small>
            جميع مواد الإصدار المستورد، وليست جميع أحاديث الكتب الأصلية.
            الحكم والتخريج كما وردا في المصدر.
          </small>
        </div>
      </Reveal>

      {/* ============ شريط البحث ============ */}
      <div className="toolbar">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="ابحث في نص الحديث أو الراوي أو رقم المادة…"
        />
        <span className="result-count" aria-live="polite">
          {arabic(results.length)} نتيجة
          {!loaded ? ' · فهرس أولي' : ''}
        </span>
      </div>

      {/* ============ الفلاتر النشطة ============ */}
      {activeFilters.length > 0 && (
        <div className="active-filters">
          <span className="active-filters-label">
            <Filter size={14} />
            الفلاتر النشطة:
          </span>
          {activeFilters.map((f, i) => (
            <button
              key={i}
              className="filter-chip"
              onClick={f.onRemove}
              aria-label={`إزالة الفلتر: ${f.label}`}
            >
              <span>{f.label}</span>
              <X size={12} />
            </button>
          ))}
          <button className="filter-clear" onClick={resetAll}>
            مسح الكل
          </button>
        </div>
      )}

      {/* ============ الفلاتر ============ */}
      <div className="library-filters">
        <label>
          <span className="filter-label">
            <BookOpen size={13} />
            المصدر
          </span>
          <select
            value={book}
            onChange={(e) => filter(setBook, e.target.value)}
          >
            <option value="">جميع المصادر</option>
            {meta.books.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="filter-label">
            <SlidersHorizontal size={13} />
            الموضوع
          </span>
          <select
            value={category}
            onChange={(e) => filter(setCategory, e.target.value)}
          >
            <option value="">جميع الموضوعات</option>
            {[...meta.categories, 'غير مصنّف'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="filter-label">
            <Info size={13} />
            حكم المصدر
          </span>
          <select
            value={grade}
            onChange={(e) => filter(setGrade, e.target.value)}
          >
            <option value="صحيح">صحيح</option>
            <option value="حسن">حسن</option>
            <option value="تفصيل في الحكم">حكم مفصّل أو أثر</option>
            <option value="">جميع أحكام المصدر</option>
          </select>
        </label>
      </div>

      {/* ============ تنبيه الحكم ============ */}
      {grade !== 'صحيح' && (
        <p className="notice">
          قد تتضمن المادة روايات بدرجات مختلفة أو أثرًا موقوفًا. اقرأ الحكم
          كاملًا؛ وجود المادة في المكتبة لا يعني صحة كل ألفاظها.
        </p>
      )}

      {/* ============ التنبيهات ============ */}
      {failure && (
        <p className="notice error-notice" role="alert">
          {failure}
          <button className="button secondary" onClick={() => void load()}>
            إعادة المحاولة
          </button>
        </p>
      )}

      {!loaded && !failure && (
        <p className="source-line" role="status">
          جارٍ تحميل الفهرس الكامل…
        </p>
      )}

      {/* ============ النتائج ============ */}
      <div className="reading-width" id="hadith-results">
        {pageItems.map((h) => (
          <article className="content-card hadith-card-item" key={h.id}>
            <div className="card-top">
              <span className="hadith-meta">
                المادة {arabic(h.id)}
                {h.categories.length > 0 &&
                  ' · ' + h.categories.join(' / ')}
              </span>
              <span className={`badge ${gradeClass(h.grade_group)}`}>
                {h.grade_group}
              </span>
            </div>

            <h2 className="hadith-title">{h.title}</h2>

            <p className="source-line">{h.takhrij}</p>

            <div className="card-actions">
              <button
                className="button primary"
                onClick={() => open(h)}
              >
                <BookOpen size={16} />
                النص الكامل والشرح
              </button>

              {/* ← زر المفضلة */}
              <FavoriteButton
                itemType="hadith"
                itemId={h.id}
                itemLabel={h.title?.slice(0, 80)}
                itemPreview={h.takhrij?.slice(0, 100)}
                itemMeta={{
                  grade_group: h.grade_group,
                  categories: h.categories,
                }}
                size="md"
                variant="icon"
              />

              <button
                className={
                  'button secondary icon-text-btn' +
                  (copiedId === h.id ? ' is-copied' : '')
                }
                onClick={() => void copyHadith(h)}
                aria-label="نسخ الحديث"
              >
                {copiedId === h.id ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}
                {copiedId === h.id ? 'تم النسخ' : 'نسخ'}
              </button>

              <button
                className="button secondary icon-text-btn"
                onClick={() => void copyLink(h)}
                aria-label="نسخ الرابط"
              >
                <Link2 size={15} />
                رابط
              </button>

              <a
                className="text-link"
                href={`https://hadeethenc.com/ar/browse/hadith/${h.id}`}
                target="_blank"
                rel="noreferrer"
              >
                المصدر
                <ExternalLink size={13} />
              </a>
            </div>
          </article>
        ))}

        {/* ============ حالة فارغة ============ */}
        {!results.length && (
          <div className="empty">
            <div className="empty-icon">
              <BookOpen size={32} strokeWidth={1.4} />
            </div>
            <h3>لا توجد مواد تطابق اختياراتك</h3>
            <p>جرّب كلمات أقل أو وسّع تصفية المصدر والموضوع.</p>
            <button className="button secondary" onClick={resetAll}>
              إعادة ضبط البحث
            </button>
          </div>
        )}

        {/* ============ الترقيم ============ */}
        {results.length > 0 && pages > 1 && (
          <div className="pagination">
            <button
              className="button secondary"
              disabled={current === 1}
              onClick={() => {
                setPage(current - 1);
                document
                  .getElementById('hadith-results')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ArrowRight size={16} />
              السابق
            </button>

            <span className="pagination-info">
              صفحة {arabic(current)} من {arabic(pages)}
            </span>

            <button
              className="button secondary"
              disabled={current === pages}
              onClick={() => {
                setPage(current + 1);
                document
                  .getElementById('hadith-results')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              التالي
              <ArrowLeft size={16} />
            </button>
          </div>
        )}

        {/* ============ سياسة المصدر ============ */}
        <details className="source-policy">
          <summary>حدود التغطية والكتب الأصلية</summary>
          <p>
            تضم المكتبة جميع مواد ملف HadeethEnc العربي، الإصدار{' '}
            {meta.version} بتاريخ ١٢ نوفمبر ٢٠٢٥، وقد تزيد مواد المصدر
            الحي بعد ذلك. لم تُضَف شروح مولّدة إلى المحتوى المنقول. أرقام
            المواد ليست أرقام الأحاديث في الكتب الأصلية. لا ندّعي استيعاب
            كل روايات الصحيحين أو غيرهما.
          </p>
          <p>
            للتوسع:{' '}
            <a
              href="https://sunnah.com/bukhari"
              target="_blank"
              rel="noreferrer"
            >
              صحيح البخاري
            </a>{' '}
            ·{' '}
            <a
              href="https://sunnah.com/muslim"
              target="_blank"
              rel="noreferrer"
            >
              صحيح مسلم
            </a>{' '}
            ·{' '}
            <a
              href="https://dorar.net/hadith"
              target="_blank"
              rel="noreferrer"
            >
              الدرر السنية
            </a>
            .
          </p>
          <pre dir="ltr">{meta.version_info}</pre>
        </details>
      </div>

      {/* ============ Toast ============ */}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      {/* ============ الحوار ============ */}
      <HadithDialog selected={selected} onClose={close} />
    </section>
  );
}