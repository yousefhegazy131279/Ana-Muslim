'use client';

import { useRouter, usePathname } from 'next/navigation';

const RANGES = [
  { days: 1, label: 'اليوم' },
  { days: 7, label: '٧ أيام' },
  { days: 30, label: '٣٠ يومًا' },
  { days: 90, label: '٩٠ يومًا' },
  { days: 365, label: 'سنة' },
];

export function StatsRangeSelector({ current }: { current: number }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="stats-range">
      <span className="stats-range-label">الفترة:</span>
      <div className="stats-range-buttons">
        {RANGES.map((r) => (
          <button
            key={r.days}
            className={
              'stats-range-btn' + (current === r.days ? ' is-active' : '')
            }
            onClick={() => router.push(`${pathname}?range=${r.days}`)}
            type="button"
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}