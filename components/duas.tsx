'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Copy, ExternalLink, HandHeart, Search, ArrowRight, RefreshCw,
  BookOpen, Sparkles, Heart, Shield, Users, Moon, Sun,
  Cloud, Home, Utensils, Plane, Baby, HeartPulse, Coins,
  Star, Check, Share2,
} from 'lucide-react';
import duasContent from '@/data/content-duas.json';
import { normalize, arabic } from './ui';
import { useContent } from '@/lib/use-content';
import { FavoriteButton } from './favorite-button';

// ============================================================
// خريطة الأيقونات
// ============================================================
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('قرآن')) return BookOpen;
  if (n.includes('نبو') || n.includes('نبوي')) return Sparkles;
  if (n.includes('استغفار') || n.includes('توبة')) return RefreshCw;
  if (n.includes('هم') || n.includes('حزن') || n.includes('كرب')) return HeartPulse;
  if (n.includes('مريض') || n.includes('شفاء')) return Heart;
  if (n.includes('سفر')) return Plane;
  if (n.includes('طعام') || n.includes('أكل') || n.includes('شراب')) return Utensils;
  if (n.includes('منزل') || n.includes('بيت')) return Home;
  if (n.includes('مجالس') || n.includes('اجتماع')) return Users;
  if (n.includes('صباح')) return Sun;
  if (n.includes('مساء') || n.includes('ليل') || n.includes('نوم')) return Moon;
  if (n.includes('مطر') || n.includes('جو')) return Cloud;
  if (n.includes('رقية') || n.includes('حماية') || n.includes('حصن')) return Shield;
  if (n.includes('مال') || n.includes('رزق') || n.includes('دين')) return Coins;
  if (n.includes('مولود') || n.includes('ذرية') || n.includes('أولاد')) return Baby;
  if (n.includes('مناسبات') || n.includes('زواج')) return Heart;
  if (n.includes('عام') || n.includes('متنوع')) return Star;
  return HandHeart;
};

// ============================================================
// دالة تحويل vocabulary إلى نص
// ============================================================
function renderVocabulary(vocab: any): string {
  if (typeof vocab === 'string') return vocab;
  if (Array.isArray(vocab)) {
    return vocab
      .map((v: any) => {
        if (typeof v === 'string') return `• ${v}`;
        if (v?.text && v?.meaning) return `• ${v.text}: ${v.meaning}`;
        if (v?.text) return `• ${v.text}`;
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }
  if (typeof vocab === 'object' && vocab !== null) {
    if (vocab.text && vocab.meaning) return `• ${vocab.text}: ${vocab.meaning}`;
    if (vocab.text) return `• ${vocab.text}`;
  }
  return '';
}

// ============================================================
// المكوّن الرئيسي
// ============================================================
export function Duas() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, warning } = useContent('duas', duasContent.duas);
  const { data: categories } = useContent(
    'dua_categories',
    duasContent.dua_categories
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  function showToast(msg: string) {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2800);
  }

  async function copy(dua: any) {
    const text = `${dua.title}\n\n${dua.text}\n\n${dua.reference}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(dua.id);
      showToast('تم نسخ الدعاء');
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast('تعذّر النسخ تلقائيًا');
    }
  }

  async function share(dua: any) {
    const text = `${dua.title}\n\n${dua.text}\n\n${dua.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dua.title, text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast('تم نسخ الدعاء للمشاركة');
      } catch {
        showToast('تعذّر النسخ');
      }
    }
  }

  // ===== إحصاءات كل تصنيف =====
  const categoryStats = useMemo(() => {
    const map: Record<number, number> = {};
    categories.forEach((c: any) => {
      map[c.id] = data.filter((d: any) => d.category_id === c.id).length;
    });
    return map;
  }, [categories, data]);

  // ===== البحث =====
  const searching = query.trim().length > 0;
  const searchResults = useMemo(() => {
    if (!searching) return [];
    const q = normalize(query.trim());
    return data.filter((d: any) =>
      normalize(d.text + ' ' + d.title + ' ' + d.reference).includes(q)
    );
  }, [data, query, searching]);

  // ===== التصنيف المفتوح =====
  const currentCategory =
    selectedCategory !== null
      ? categories.find((c: any) => c.id === selectedCategory) ?? null
      : null;

  const categoryDuas =
    selectedCategory !== null
      ? data.filter((d: any) => d.category_id === selectedCategory)
      : [];

  // ============================================================
  // واجهة 1: شبكة التصنيفات
  // ============================================================
  if (selectedCategory === null && !searching) {
    return (
      <section className="container content-section">
        <div className="athkar-search-wrapper">
          <Search size={18} className="athkar-search-icon" />
          <input
            type="search"
            className="athkar-search"
            placeholder="ابحث في الأدعية... (مثال: السفر، الشفاء، الاستغفار)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {warning && <p className="notice">{warning}</p>}

        <div className="dua-categories-grid">
          {categories.map((c: any) => {
            const Icon = getCategoryIcon(c.name);
            const count = categoryStats[c.id] || 0;
            return (
              <button
                key={c.id}
                className="dua-category-card"
                onClick={() => {
                  setSelectedCategory(c.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="dua-cat-icon">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <h3>{c.name}</h3>
                <div className="dua-cat-meta">
                  <span>{arabic(count)} دعاء</span>
                  <ArrowRight size={14} className="arrow" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // ============================================================
  // واجهة 2: نتائج البحث
  // ============================================================
  if (searching) {
    return (
      <section className="container content-section">
        <div className="athkar-search-wrapper">
          <Search size={18} className="athkar-search-icon" />
          <input
            type="search"
            className="athkar-search"
            placeholder="ابحث في الأدعية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="dua-search-header">
          <span>نتائج البحث · {arabic(searchResults.length)} دعاء</span>
          <button className="reset-button" onClick={() => setQuery('')}>
            <RefreshCw size={14} />
            مسح البحث
          </button>
        </div>

        <div className="reading-width">
          {searchResults.length > 0 ? (
            searchResults.map((d: any) => (
              <DuaCard
                key={d.id}
                dua={d}
                categoryName={
                  categories.find((c: any) => c.id === d.category_id)?.name
                }
                onCopy={copy}
                onShare={share}
                isCopied={copiedId === d.id}
              />
            ))
          ) : (
            <div className="empty">
              <HandHeart />
              <h3>لا توجد أدعية مطابقة</h3>
              <p>جرّب كلمة أخرى.</p>
            </div>
          )}
        </div>

        {toast && <div className="toast" role="status">{toast}</div>}
      </section>
    );
  }

  // ============================================================
  // واجهة 3: أدعية التصنيف
  // ============================================================
  const HeaderIcon = currentCategory
    ? getCategoryIcon(currentCategory.name)
    : HandHeart;

  return (
    <section className="container content-section">
      <button
        className="athkar-back"
        onClick={() => {
          setSelectedCategory(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ArrowRight size={18} />
        رجوع إلى التصنيفات
      </button>

      <div className="athkar-header">
        <span className="icon-wrapper">
          <HeaderIcon size={26} strokeWidth={1.5} />
        </span>
        <div>
          <h2>{currentCategory?.name}</h2>
          <p>{arabic(categoryDuas.length)} دعاء في هذا التصنيف</p>
        </div>
      </div>

      {warning && <p className="notice">{warning}</p>}

      <div className="reading-width">
        {categoryDuas.map((d: any) => (
          <DuaCard
            key={d.id}
            dua={d}
            onCopy={copy}
            onShare={share}
            isCopied={copiedId === d.id}
          />
        ))}
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}

// ============================================================
// بطاقة الدعاء
// ============================================================
function DuaCard({
  dua,
  categoryName,
  onCopy,
  onShare,
  isCopied,
}: {
  dua: any;
  categoryName?: string;
  onCopy: (d: any) => void;
  onShare: (d: any) => void;
  isCopied: boolean;
}) {
  const typeBadge = (() => {
    if (dua.source_type === 'quran') {
      return { label: 'قرآني', className: 'type-quran' };
    }
    if (dua.source_type === 'hadith') {
      return { label: 'نبوي', className: 'type-hadith' };
    }
    return null;
  })();

  const vocabularyText = dua.vocabulary ? renderVocabulary(dua.vocabulary) : '';

  return (
    <article className="dua-card" style={{ position: 'relative' }}>

      {/* ============ زر المفضلة — موضع مطلق في الزاوية ============ */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 50,
          display: 'block',
          visibility: 'visible',
          opacity: 1,
        }}
      >
        <FavoriteButton
          itemType="dua"
          itemId={dua.id}
          itemLabel={dua.title}
          itemPreview={dua.text?.slice(0, 120)}
          itemMeta={{
            reference: dua.reference,
            source_type: dua.source_type,
            category_id: dua.category_id,
          }}
          size="md"
          variant="button"
          showLabel={true}
        />
      </div>

      {/* ============ رأس البطاقة ============ */}
      <div className="dua-card-header">
        <h3>{dua.title}</h3>
        <div className="dua-badges">
          {typeBadge && (
            <span className={`dua-type-badge ${typeBadge.className}`}>
              {typeBadge.label}
            </span>
          )}
          {categoryName && (
            <span className="dua-cat-badge">{categoryName}</span>
          )}
        </div>
      </div>

      {/* ============ نص الدعاء ============ */}
      <p className="sacred">{dua.text}</p>

      {/* ============ شرح المفردات ============ */}
      {vocabularyText && (
        <details className="dua-vocabulary">
          <summary>شرح المفردات</summary>
          <pre>{vocabularyText}</pre>
        </details>
      )}

      {/* ============ التذييل ============ */}
      <div className="dua-card-footer">
        <a
          className="source-line"
          href={dua.source_url}
          target="_blank"
          rel="noreferrer"
        >
          {dua.reference}
          <ExternalLink size={12} />
        </a>

        <div className="dua-actions">
          <button
            className={'dua-action ' + (isCopied ? 'is-done' : '')}
            onClick={() => onCopy(dua)}
            aria-label="نسخ الدعاء"
          >
            {isCopied ? <Check size={15} /> : <Copy size={15} />}
            {isCopied ? 'تم النسخ' : 'نسخ'}
          </button>
          <button
            className="dua-action"
            onClick={() => onShare(dua)}
            aria-label="مشاركة الدعاء"
          >
            <Share2 size={15} />
            مشاركة
          </button>
        </div>
      </div>
    </article>
  );
}