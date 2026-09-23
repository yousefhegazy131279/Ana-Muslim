'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ============================================================
// session_id ثابت لكل مستخدم (في sessionStorage)
// ============================================================
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('am_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now();
    sessionStorage.setItem('am_session_id', sid);
  }
  return sid;
}

// ============================================================
// خريطة الأقسام
// ============================================================
function detectSection(path: string): {
  section: string | null;
  itemId: string | null;
  itemLabel: string | null;
} {
  // /quran/[id]
  let m = path.match(/^\/quran\/(\d+)/);
  if (m) return { section: 'quran', itemId: m[1], itemLabel: null };

  // /hadith/?id=N
  if (path.startsWith('/hadith')) {
    return { section: 'hadith', itemId: null, itemLabel: null };
  }

  // /stories/[slug]
  m = path.match(/^\/stories\/([^/]+)/);
  if (m) return { section: 'stories', itemId: m[1], itemLabel: null };

  // /athkar
  if (path.startsWith('/athkar')) {
    return { section: 'athkar', itemId: null, itemLabel: null };
  }

  // /duas
  if (path.startsWith('/duas')) {
    return { section: 'duas', itemId: null, itemLabel: null };
  }

  // صفحات عامة
  if (path === '/') return { section: 'home', itemId: null, itemLabel: null };
  if (path.startsWith('/about')) return { section: 'about', itemId: null, itemLabel: null };

  return { section: 'other', itemId: null, itemLabel: null };
}

// ============================================================
// المكوّن
// ============================================================
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/admin')) return; // لا نتتبع صفحات الأدمن
    if (pathname.startsWith('/_next')) return;

    let cancelled = false;

    (async () => {
      try {
        const supabase = createClient();
        const { section, itemId, itemLabel } = detectSection(pathname);

        const { data: { user } } = await supabase.auth.getUser();
        if (cancelled) return;

        await supabase.from('page_views').insert({
          user_id: user?.id ?? null,
          session_id: getSessionId(),
          path: pathname,
          section,
          item_id: itemId,
          item_label: itemLabel,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent.slice(0, 200),
        });
      } catch (err) {
        // تجاهل الأخطاء
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}