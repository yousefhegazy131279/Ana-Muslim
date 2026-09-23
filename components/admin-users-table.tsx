'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  User as UserIcon,
  Mail,
  Calendar,
  Filter,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import { arabic } from './ui';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
};

interface Props {
  profiles: Profile[];
  currentUserId: string;
}

export function AdminUsersTable({ profiles, currentUserId }: Props) {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  // ===== الفلترة =====
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchQuery =
        !q ||
        p.email?.toLowerCase().includes(q) ||
        p.full_name?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      const matchRole = roleFilter === 'all' || p.role === roleFilter;
      const matchStatus =
        statusFilter === 'all' || p.status === statusFilter;

      return matchQuery && matchRole && matchStatus;
    });
  }, [profiles, query, roleFilter, statusFilter]);

  // ===== إحصائيات =====
  const stats = useMemo(() => {
    return {
      total: profiles.length,
      admins: profiles.filter((p) => p.role === 'admin').length,
      active: profiles.filter((p) => p.status === 'active').length,
      suspended: profiles.filter((p) => p.status === 'suspended').length,
    };
  }, [profiles]);

  // ===== تنسيق التاريخ =====
  function formatDate(date: string | null): string {
    if (!date) return '—';
    try {
      const d = new Date(date);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return '—';
    }
  }

  function formatDateFull(date: string | null): string {
    if (!date) return '—';
    try {
      const d = new Date(date);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return '—';
    }
  }

  const roleLabels: Record<string, string> = {
    admin: 'مشرف',
    moderator: 'مراقب',
    user: 'مستخدم',
  };

  const statusLabels: Record<string, string> = {
    active: 'نشط',
    suspended: 'موقوف',
    banned: 'محظور',
  };

  return (
    <>
      {/* ===== إحصائيات سريعة ===== */}
      <div className="users-stats">
        <div className="users-stat">
          <span className="users-stat-icon users-stat-icon-green">
            <UserIcon size={18} />
          </span>
          <div>
            <strong>{arabic(stats.total)}</strong>
            <span>إجمالي</span>
          </div>
        </div>
        <div className="users-stat">
          <span className="users-stat-icon users-stat-icon-gold">
            <Shield size={18} />
          </span>
          <div>
            <strong>{arabic(stats.admins)}</strong>
            <span>مشرفون</span>
          </div>
        </div>
        <div className="users-stat">
          <span className="users-stat-icon users-stat-icon-green">
            <ShieldCheck size={18} />
          </span>
          <div>
            <strong>{arabic(stats.active)}</strong>
            <span>نشطون</span>
          </div>
        </div>
        <div className="users-stat">
          <span className="users-stat-icon users-stat-icon-red">
            <ShieldX size={18} />
          </span>
          <div>
            <strong>{arabic(stats.suspended)}</strong>
            <span>موقوفون</span>
          </div>
        </div>
      </div>

      {/* ===== شريط الأدوات ===== */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="ابحث بالبريد أو الاسم أو المعرّف..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* فلتر الدور */}
        <div className="users-filter">
          <button
            className="users-filter-btn"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            type="button"
          >
            <Filter size={14} />
            <span>
              {roleFilter === 'all'
                ? 'كل الأدوار'
                : roleLabels[roleFilter] || roleFilter}
            </span>
            <ChevronDown
              size={14}
              className={roleMenuOpen ? 'is-open' : ''}
            />
          </button>
          {roleMenuOpen && (
            <div className="users-filter-menu">
              {[
                { value: 'all', label: 'كل الأدوار' },
                { value: 'admin', label: 'مشرف' },
                { value: 'moderator', label: 'مراقب' },
                { value: 'user', label: 'مستخدم' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={
                    'users-filter-item' +
                    (roleFilter === opt.value ? ' is-active' : '')
                  }
                  onClick={() => {
                    setRoleFilter(opt.value);
                    setRoleMenuOpen(false);
                  }}
                  type="button"
                >
                  {opt.label}
                  {roleFilter === opt.value && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* فلتر الحالة */}
        <div className="users-filter">
          <button
            className="users-filter-btn"
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            type="button"
          >
            <Filter size={14} />
            <span>
              {statusFilter === 'all'
                ? 'كل الحالات'
                : statusLabels[statusFilter] || statusFilter}
            </span>
            <ChevronDown
              size={14}
              className={statusMenuOpen ? 'is-open' : ''}
            />
          </button>
          {statusMenuOpen && (
            <div className="users-filter-menu">
              {[
                { value: 'all', label: 'كل الحالات' },
                { value: 'active', label: 'نشط' },
                { value: 'suspended', label: 'موقوف' },
                { value: 'banned', label: 'محظور' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={
                    'users-filter-item' +
                    (statusFilter === opt.value ? ' is-active' : '')
                  }
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setStatusMenuOpen(false);
                  }}
                  type="button"
                >
                  {opt.label}
                  {statusFilter === opt.value && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* مسح الفلاتر */}
        {(query || roleFilter !== 'all' || statusFilter !== 'all') && (
          <button
            className="users-clear-btn"
            onClick={() => {
              setQuery('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            type="button"
          >
            <X size={14} />
            مسح الفلاتر
          </button>
        )}

        <span className="users-count">
          {arabic(filtered.length)} من {arabic(profiles.length)}
        </span>
      </div>

      {/* ===== الجدول ===== */}
      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>الحالة</th>
              <th>تاريخ التسجيل</th>
              <th>آخر ظهور</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const isMe = p.id === currentUserId;
              const initial = (p.full_name || p.email || '؟')
                .charAt(0)
                .toUpperCase();

              return (
                <tr key={p.id} className={isMe ? 'is-me' : ''}>
                  <td>
                    <div className="users-cell-user">
                      <span className="users-avatar">
                        {p.avatar_url ? (
                          <Image
                            src={p.avatar_url}
                            alt={p.full_name || 'مستخدم'}
                            width={38}
                            height={38}
                            className="users-avatar-img"
                            unoptimized
                          />
                        ) : (
                          <span className="users-avatar-initial">
                            {initial}
                          </span>
                        )}
                      </span>
                      <div className="users-cell-info">
                        <strong>
                          {p.full_name || 'بدون اسم'}
                          {isMe && (
                            <span className="users-you-badge">أنت</span>
                          )}
                        </strong>
                        <small>
                          #{p.id.slice(0, 8)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="users-email">
                      <Mail size={13} />
                      {p.email || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`users-role-badge users-role-${p.role}`}>
                      {p.role === 'admin' && <Shield size={11} />}
                      {roleLabels[p.role] || p.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`users-status-badge users-status-${p.status}`}
                    >
                      {statusLabels[p.status] || p.status}
                    </span>
                  </td>
                  <td>
                    <span className="users-date">
                      <Calendar size={12} />
                      {formatDate(p.created_at)}
                    </span>
                  </td>
                  <td>
                    <span className="users-date">
                      {formatDateFull(p.last_seen_at)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="users-empty">
            <Search size={32} strokeWidth={1.4} />
            <h3>لا توجد نتائج</h3>
            <p>جرّب تغيير الفلاتر أو مسحها</p>
          </div>
        )}
      </div>
    </>
  );
}