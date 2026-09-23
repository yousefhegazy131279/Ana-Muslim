'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import surahs from '@/data/surahs.json';
import { SearchInput, arabic, normalize } from './ui';
import { FavoriteButton } from './favorite-button';

export function QuranList() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('الكل');

  const results = surahs.filter(
    (s) =>
      (type === 'الكل' || s.type === type) &&
      (normalize(s.name_arabic).includes(normalize(query.trim())) ||
        String(s.id) === normalize(query.trim()) ||
        s.name_english.toLowerCase().includes(query.toLowerCase().trim()))
  );

  return (
    <section className="container content-section">
      {/* ============ شريط البحث ============ */}
      <div className="toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="ابحث باسم السورة أو رقمها…"
        />
        <span className="result-count" aria-live="polite">
          {arabic(results.length)} سورة
        </span>
      </div>

      {/* ============ التبويبات ============ */}
      <div className="tabs" aria-label="تصفية السور">
        {['الكل', 'مكية', 'مدنية'].map((t) => (
          <button
            key={t}
            className={'tab ' + (type === t ? 'active' : '')}
            aria-pressed={type === t}
            onClick={() => setType(t)}
          >
            {t === 'الكل' ? 'جميع السور' : t}
          </button>
        ))}
      </div>

      {/* ============ الشبكة ============ */}
      {results.length ? (
        <div className="cards-grid">
          {results.map((s) => (
            <div key={s.id} className="surah-card-wrap">
              <Link className="surah-card" href={'/quran/' + s.id + '/'}>
                <span className="surah-number">{arabic(s.id)}</span>
                <div>
                  <h3>سورة {s.name_arabic}</h3>
                  <p>
                    {s.type} · {arabic(s.total_ayahs)} آية
                  </p>
                </div>
              </Link>

              {/* ← زر المفضلة */}
              <FavoriteButton
                itemType="surah"
                itemId={s.id}
                itemLabel={`سورة ${s.name_arabic}`}
                itemPreview={`${s.type} · ${s.total_ayahs} آية`}
                itemMeta={{
                  number: s.id,
                  type: s.type,
                  ayah_count: s.total_ayahs,
                  name_english: s.name_english,
                }}
                size="sm"
                variant="overlay"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <BookOpen />
          <h3>لم نعثر على سورة بهذا البحث</h3>
          <p>جرّب الاسم دون تشكيل، أو اكتب رقم السورة.</p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery('');
              setType('الكل');
            }}
          >
            عرض جميع السور
          </button>
        </div>
      )}
    </section>
  );
}