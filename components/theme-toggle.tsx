'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // منع Hydration Mismatch
  useEffect(() => setMounted(true), []);

  // أثناء التحميل اعرض زر وهمي بنفس الحجم
  if (!mounted) {
    return <span className="icon-button theme-toggle" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      className="icon-button theme-toggle"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
      title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
    >
      <span className="theme-toggle-icon">
        {isDark ? <Sun size={19} /> : <Moon size={19} />}
      </span>
    </button>
  );
}