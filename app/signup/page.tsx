'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        setError('هذا البريد مسجّل مسبقًا. جرّب تسجيل الدخول.');
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push('/account');
      router.refresh();
      return;
    }

    setMessage('تم إنشاء حسابك! تحقق من بريدك الإلكتروني لتأكيد الحساب.');
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <section className="auth-page">
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-glow auth-glow-1" />
        <div className="auth-glow auth-glow-2" />
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h1>إنشاء حساب جديد</h1>
          <p>انضم إلينا لحفظ تقدمك ومزامنته بين أجهزتك</p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {message && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle2 size={16} />
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <label className="auth-field">
            <span>الاسم الكامل</span>
            <div className="auth-input-wrap">
              <User size={16} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="محمد أحمد"
                required
                autoComplete="name"
              />
            </div>
          </label>

          <label className="auth-field">
            <span>البريد الإلكتروني</span>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </label>

          <label className="auth-field">
            <span>كلمة المرور</span>
            <div className="auth-input-wrap">
              <Lock size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
                required
                autoComplete="new-password"
              />
            </div>
          </label>

          <button
            type="submit"
            className="button primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" />
                جارٍ الإنشاء...
              </>
            ) : (
              'إنشاء الحساب'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>أو</span>
        </div>

        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogle}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          المتابعة باستخدام Google
        </button>

        <p className="auth-footer-text">
          لديك حساب بالفعل؟{' '}
          <Link href="/login">تسجيل الدخول</Link>
        </p>
      </div>
    </section>
  );
}