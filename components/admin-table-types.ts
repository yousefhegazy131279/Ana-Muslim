// ============================================================
// أنواع ودوال مساعدة لجداول الإدارة
// (بدون 'use client' — تعمل في الخادم والمتصفح)
// ============================================================

// ============================================================
// الأنواع
// ============================================================
export type Cell =
  | { type: 'text'; value: string; bold?: boolean }
  | { type: 'number'; value: number }
  | {
      type: 'badge';
      value: string;
      color?: 'green' | 'gold' | 'red' | 'gray';
    }
  | { type: 'link'; value: string; label: string };

export type Row = {
  id: string | number;
  cells: Cell[];
};

// ============================================================
// دوال مساعدة لإنشاء الخلايا
// ============================================================
export const cellText = (value: string, bold = false): Cell => ({
  type: 'text',
  value,
  bold,
});

export const cellNumber = (value: number): Cell => ({
  type: 'number',
  value,
});

export const cellBadge = (
  value: string,
  color: 'green' | 'gold' | 'red' | 'gray' = 'gray'
): Cell => ({
  type: 'badge',
  value,
  color,
});

export const cellLink = (value: string, label: string): Cell => ({
  type: 'link',
  value,
  label,
});