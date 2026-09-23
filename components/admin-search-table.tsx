'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Search, X, FileText, ExternalLink } from 'lucide-react';
import { arabic } from './ui';
import type { Cell, Row } from './admin-table-types';

// ============================================================
// Props
// ============================================================
interface Props {
  title: string;
  icon?: ReactNode;
  columns: { key: string; label: string }[];
  rows: Row[];
  searchKeys?: number[];
  emptyText?: string;
  maxHeight?: number;
}

// ============================================================
// المكوّن
// ============================================================
export function AdminSearchTable({
  title,
  icon,
  columns,
  rows,
  searchKeys = [],
  emptyText = 'لا توجد بيانات',
  maxHeight,
}: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((row) => {
      const keys =
        searchKeys.length > 0
          ? searchKeys
          : row.cells.map((_, i) => i);

      return keys.some((i) => {
        const cell = row.cells[i];
        if (!cell) return false;

        if (
          cell.type === 'text' ||
          cell.type === 'badge' ||
          cell.type === 'link'
        ) {
          return String(cell.value).toLowerCase().includes(q);
        }
        if (cell.type === 'number') {
          return String(cell.value).includes(q);
        }
        return false;
      });
    });
  }, [rows, query, searchKeys]);

  function renderCell(cell: Cell) {
    switch (cell.type) {
      case 'text':
        return (
          <span className={cell.bold ? 'cell-bold' : ''}>
            {cell.value}
          </span>
        );

      case 'number':
        return <span className="cell-number">{arabic(cell.value)}</span>;

      case 'badge':
        return (
          <span
            className={`cell-badge cell-badge-${cell.color ?? 'gray'}`}
          >
            {cell.value}
          </span>
        );

      case 'link':
        return (
          <Link
            href={cell.value}
            className="cell-link"
            target="_blank"
            rel="noreferrer"
          >
            {cell.label}
            <ExternalLink size={12} />
          </Link>
        );

      default:
        return null;
    }
  }

  return (
    <div className="search-table">
      {/* رأس الجدول */}
      <div className="search-table-header">
        <div className="search-table-title">
          {icon}
          <h3>{title}</h3>
          <span className="search-table-count">
            {arabic(filtered.length)}
            {query && ` / ${arabic(rows.length)}`}
          </span>
        </div>

        <div className="search-table-search">
          <Search size={15} />
          <input
            type="search"
            placeholder="بحث..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="search-table-clear"
              onClick={() => setQuery('')}
              aria-label="مسح البحث"
              type="button"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* الجدول */}
      <div
        className="search-table-body"
        style={
          maxHeight ? { maxHeight, overflowY: 'auto' } : undefined
        }
      >
        {filtered.length === 0 ? (
          <div className="search-table-empty">
            <FileText size={32} strokeWidth={1.4} />
            <p>{query ? 'لا توجد نتائج للبحث' : emptyText}</p>
          </div>
        ) : (
          <table className="search-table-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  {row.cells.map((cell, i) => (
                    <td key={i}>{renderCell(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}