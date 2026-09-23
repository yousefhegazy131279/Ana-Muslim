'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  BookOpen,
  ScrollText,
  HandHeart,
  Sparkles,
  Users,
  Search,
  X,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useFavorites, type FavoriteType } from '@/lib/use-favorites';
import { arabic } from './ui';

// ============================================================
// إعدادات الأنواع
// ============================================================
const TYPES: {
  key: FavoriteType;
  label: string;
  icon: any;
  color: 'green' | 'gold';
}[] = [
  { key: 'ayah', label: 'آيات', icon: BookOpen, color: 'green' },
  { key: 'hadith', label: 'أحاديث', icon: ScrollText, color: 'gold' },
  { key: 'dua', label: 'أدعية', icon: HandHeart, color: 'green' },
  { key: 'dhikr', label: 'أذكار', icon: Sparkles, color: 'gold' },
  { key: 'story', label: 'قصص', icon: Users, color: 'green' },
  { key: 'surah', label: 'سور', icon: BookOpen, color: 'gold' },
];

export function FavoritesList() {
  const { favorites, loading, toggle } = useFavorites();
  const [activeType, setActiveType] = useState<FavoriteType | 'all'>('all');
  const [query, setQuery] = useState('');

  // ===== إحصاء كل نوع =====
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: favorites.length };
    TYPES.forEach((t) => {
      map[t.key] = favorites.filter((f) => f.item_type === t.key).length;
    });
    return map;
  }, [favorites]);

  // ===== الفلترة =====
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return favorites.filter((f) => {
      const matchType = activeType === 'all' || f.item_type === activeType;
      const matchQuery =
        !q ||
        f.item_label?.toLowerCase().includes(q) ||
        f.item_preview?.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [favorites, activeType, query]);

  // ===== رابط العنصر =====
  function getLink(fav: any): string {
    switch (fav.item_type) {
      case 'ayah':
      case 'surah':
        return `/quran/${fav.item_id}/`;
      case 'hadith':
        return `/hadith/?id=${fav.item_id}`;
      case 'story':
        return `/stories/${fav.item_id}/`;
      case 'dua':
        return `/duas/`;
      case 'dhikr':
        return `/athkar/`;
      default:
        return '#';
    }
  }

  // ===== حالة التحميل =====
  if (loading) {
    return (
      <div className="favorites-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="favorites-skeleton" />
        ))}
      </div>
    );
  }

  // ===== حالة فارغة =====
  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="favorites-empty-icon">
          <Heart size={40} strokeWidth={1.4} />
        </div>
        <h2>لا توجد عناصر محفوظة</h2>
        <p>
          ابدأ بحفظ الآيات والأحاديث والأدعية التي تحب الرجوع إليها،
          وستجدها هنا في أي وقت.
        </p>
        <Link href="/quran/" className="button primary">
          <BookOpen size={16} />
          تصفّح القرآن
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ===== الفلاتر ===== */}
      <div className="favorites-filters">
        <button
          className={'favorites-filter' + (activeType === 'all' ? ' is-active' : '')}
          onClick={() => setActiveType('all')}
          type="button"
        >
          <Heart size={14} />
          الكل
          <span className="favorites-filter-count">{arabic(counts.all)}</span>
        </button>

        {TYPES.map((t) => {
          if (counts[t.key] === 0) return null;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={'favorites-filter' + (activeType === t.key ? ' is-active' : '')}
              onClick={() => setActiveType(t.key)}
              type="button"
            >
              <Icon size={14} />
              {t.label}
              <span className="favorites-filter-count">{arabic(counts[t.key])}</span>
            </button>
          );
        })}
      </div>

      {/* ===== البحث ===== */}
      <div className="favorites-search">
        <Search size={16} />
        <input
          type="search"
          placeholder="ابحث في المفضلة..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="favorites-search-clear"
            onClick={() => setQuery('')}
            aria-label="مسح البحث"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ===== النتائج ===== */}
      {filtered.length === 0 ? (
        <div className="favorites-no-results">
          <Search size={28} strokeWidth={1.4} />
          <p>لا توجد نتائج للبحث</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {filtered.map((fav) => {
            const typeConfig = TYPES.find((t) => t.key === fav.item_type);
            const Icon = typeConfig?.icon ?? Heart;
            return (
              <article
                key={fav.id}
                className={`favorites-card favorites-card-${typeConfig?.color ?? 'green'}`}
              >
                <div className="favorites-card-header">
                  <span className="favorites-card-type">
                    <Icon size={13} />
                    {typeConfig?.label ?? fav.item_type}
                  </span>
                  <button
                    className="favorites-card-remove"
                    onClick={() =>
                      toggle({
                        item_type: fav.item_type as FavoriteType,
                        item_id: fav.item_id,
                      })
                    }
                    aria-label="إزالة من المفضلة"
                    type="button"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {fav.item_label && (
                  <h3 className="favorites-card-title">{fav.item_label}</h3>
                )}

                {fav.item_preview && (
                  <p className="favorites-card-preview">{fav.item_preview}</p>
                )}

                <div className="favorites-card-footer">
                  <Link href={getLink(fav)} className="favorites-card-link">
                    اقرأ
                    <ExternalLink size={12} />
                  </Link>
                  <span className="favorites-card-date">
                    {new Intl.DateTimeFormat('ar-EG', {
                      day: 'numeric',
                      month: 'short',
                    }).format(new Date(fav.created_at))}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}