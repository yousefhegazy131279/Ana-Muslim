'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  LogOut,
  Settings,
  BookMarked,
  BarChart3,
  ChevronDown,
  LogIn,
  Shield,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// ============================================================
// التحقق من وجود متغيرات البيئة
// ============================================================
const SUPABASE_READY = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
);

// ============================================================
// 🔍 تشخيص: بريدك كـ fallback (احذفه بعد التأكد)
// ============================================================
const ADMIN_EMAIL_FALLBACK = 'YOUR_EMAIL@example.com';

// ============================================================
// دالة التحقق من admin (متعددة المستويات)
// ============================================================
function checkIsAdmin(user: SupabaseUser | null): boolean {
  if (!user) return false;

  // 1. app_metadata (الطريقة الرسمية والآمنة)
  if (user.app_metadata?.role === 'admin') return true;

  // 2. user_metadata (احتياطي)
  if (user.user_metadata?.role === 'admin') return true;

  // 3. البريد الإلكتروني (اختبار فقط — احذفه لاحقًا)
  if (user.email === ADMIN_EMAIL_FALLBACK) return true;

  return false;
}

// ============================================================
// المكوّن الرئيسي
// ============================================================
export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(SUPABASE_READY);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ============================================================
  // جلب المستخدم الحالي
  // ============================================================
  useEffect(() => {
    if (!SUPABASE_READY) {
      setLoading(false);
      return;
    }

    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const { data } = await supabase.auth.getUser();

        // ============================================================
        // 🔍 التشخيص: طباعة بيانات الجلسة
        // ============================================================
        if (data.user) {
          console.group('🔍 [AuthButton] بيانات المستخدم');
          console.log('📧 Email:', data.user.email);
          console.log('🆔 ID:', data.user.id);
          console.log(
            '🔑 app_metadata:',
            JSON.stringify(data.user.app_metadata, null, 2)
          );
          console.log(
            '👤 user_metadata:',
            JSON.stringify(data.user.user_metadata, null, 2)
          );
          console.log(
            '🛡️  isAdmin (app_metadata):',
            data.user.app_metadata?.role === 'admin'
          );
          console.log(
            '🛡️  isAdmin (user_metadata):',
            data.user.user_metadata?.role === 'admin'
          );
          console.log(
            '🛡️  isAdmin (fallback email):',
            data.user.email === ADMIN_EMAIL_FALLBACK
          );
          console.log(
            '✅ النتيجة النهائية:',
            checkIsAdmin(data.user)
          );
          console.groupEnd();
        } else {
          console.log('🚪 لا يوجد مستخدم مسجّل');
        }

        if (mounted) {
          setUser(data.user);
          setLoading(false);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('🔄 Auth state changed:', event);
          if (mounted) setUser(session?.user ?? null);
        });

        unsubscribe = () => subscription.unsubscribe();
      } catch (err) {
        console.warn('Supabase not ready:', err);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  // ============================================================
  // إغلاق القائمة عند النقر خارجها
  // ============================================================
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================
  // إغلاق القائمة بمفتاح Escape
  // ============================================================
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ============================================================
  // تسجيل الخروج
  // ============================================================
  async function handleSignOut() {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
      setOpen(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  }

  // ============================================================
  // 🔄 إعادة تحميل بيانات المستخدم (لتحديث app_metadata)
  // ============================================================
  async function refreshUser() {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.auth.refreshSession();
      if (data.user) {
        setUser(data.user);
        console.log('🔄 User refreshed:', data.user.app_metadata);
      }
    } catch (err) {
      console.warn('Refresh error:', err);
    }
  }

  // ============================================================
  // حالة التحميل
  // ============================================================
  if (loading) {
    return (
      <div className="auth-button-loading" aria-hidden="true">
        <div className="skeleton-circle" />
      </div>
    );
  }

  // ============================================================
  // غير مسجّل — زر "تسجيل الدخول"
  // ============================================================
  if (!user) {
    return (
      <div className="auth-guest">
        <Link href="/login" className="auth-login-btn">
          <LogIn size={15} />
          <span>تسجيل الدخول</span>
        </Link>
      </div>
    );
  }

  // ============================================================
  // مسجّل — صورة الحساب + القائمة المنسدلة
  // ============================================================
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'مستخدم';

  const firstName = fullName.split(' ')[0];
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initial = firstName.charAt(0).toUpperCase();
  const isAdmin = checkIsAdmin(user);

  return (
    <div className="auth-user" ref={dropdownRef}>
      {/* زر الصورة */}
      <button
        className="auth-user-trigger"
        onClick={() => setOpen(!open)}
        aria-label="قائمة الحساب"
        aria-expanded={open}
        aria-haspopup="menu"
        type="button"
      >
        <span className="auth-avatar">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={firstName}
              width={36}
              height={36}
              className="auth-avatar-img"
              unoptimized
            />
          ) : (
            <span className="auth-avatar-initial">{initial}</span>
          )}
          {isAdmin && <span className="auth-avatar-admin-dot" />}
          <span className="auth-avatar-status" />
        </span>
        <ChevronDown
          size={14}
          className={'auth-chevron' + (open ? ' is-open' : '')}
        />
      </button>

      {/* القائمة المنسدلة */}
      {open && (
        <div className="auth-dropdown" role="menu">
          {/* رأس القائمة */}
          <div className="auth-dropdown-header">
            <span className="auth-avatar auth-avatar-lg">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={firstName}
                  width={48}
                  height={48}
                  className="auth-avatar-img"
                  unoptimized
                />
              ) : (
                <span className="auth-avatar-initial">{initial}</span>
              )}
            </span>
            <div className="auth-user-info">
              <strong>{fullName}</strong>
              <small>{user.email}</small>
              {isAdmin && (
                <span className="auth-user-role">
                  <Shield size={10} />
                  مشرف
                </span>
              )}
            </div>
          </div>

          <div className="auth-dropdown-divider" />

          {/* رابط Admin */}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="auth-dropdown-item auth-dropdown-item-admin"
                onClick={() => setOpen(false)}
                role="menuitem"
              >
                <Shield size={15} />
                لوحة التحكم
              </Link>
              <div className="auth-dropdown-divider" />
            </>
          )}

          {/* رابط الحساب */}
          <Link
            href="/account"
            className="auth-dropdown-item"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <User size={15} />
            حسابي
          </Link>

          {/* المفضلة */}
          <Link
            href="/account/favorites"
            className="auth-dropdown-item"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <BookMarked size={15} />
            المفضلة
          </Link>

          {/* الإحصائيات */}
          <Link
            href="/account/stats"
            className="auth-dropdown-item"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <BarChart3 size={15} />
            إحصائياتي
          </Link>

          {/* الإعدادات */}
          <Link
            href="/account/settings"
            className="auth-dropdown-item"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <Settings size={15} />
            الإعدادات
          </Link>

          <div className="auth-dropdown-divider" />

          {/* 🔄 زر تحديث الجلسة (تشخيصي) */}
          <button
            className="auth-dropdown-item"
            onClick={async () => {
              await refreshUser();
            }}
            type="button"
            role="menuitem"
            style={{ color: '#8a6d0f' }}
          >
            <Shield size={15} />
            تحديث الصلاحيات
          </button>

          <div className="auth-dropdown-divider" />

          {/* تسجيل الخروج */}
          <button
            className="auth-dropdown-item auth-dropdown-item-danger"
            onClick={handleSignOut}
            type="button"
            role="menuitem"
          >
            <LogOut size={15} />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}