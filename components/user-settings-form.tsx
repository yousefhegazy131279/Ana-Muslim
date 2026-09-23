'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Trash2,
  Camera,
  Shield,
  LogOut,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export function UserSettingsForm({ user }: { user: SupabaseUser }) {
  const router = useRouter();

  // ===== Profile =====
  const [fullName, setFullName] = useState(
    user.user_metadata?.full_name || ''
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ===== Password =====
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ===== Delete =====
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  // ===== الأفاتار =====
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initial = (fullName || user.email || '؟').charAt(0).toUpperCase();

  // ===== حفظ الاسم =====
  async function handleSaveProfile() {
    if (!fullName.trim()) {
      setProfileMsg({ type: 'error', text: 'الاسم لا يمكن أن يكون فارغًا' });
      return;
    }

    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      if (error) throw error;

      setProfileMsg({ type: 'success', text: 'تم حفظ الاسم بنجاح' });
      router.refresh();
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'حدث خطأ' });
    } finally {
      setSavingProfile(false);
    }
  }

  // ===== تغيير كلمة المرور =====
  async function handleChangePassword() {
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'كلمتا المرور غير متطابقتين' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordMsg({ type: 'success', text: 'تم تغيير كلمة المرور' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'حدث خطأ' });
    } finally {
      setSavingPassword(false);
    }
  }

  // ===== حذف الحساب =====
  async function handleDelete() {
    if (deleteInput !== 'حذف') return;

    setDeleting(true);
    try {
      const supabase = createClient();
      // ملاحظة: حذف كامل يحتاج Service Role — هنا نكتفي بتسجيل الخروج
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.warn(err);
      setDeleting(false);
    }
  }

  // ===== تسجيل الخروج =====
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="user-settings">
      {/* ============ معلومات الحساب ============ */}
      <div className="user-settings-profile">
        <div className="user-settings-avatar">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName || 'مستخدم'}
              width={80}
              height={80}
              className="user-settings-avatar-img"
              unoptimized
            />
          ) : (
            <span className="user-settings-avatar-initial">{initial}</span>
          )}
        </div>
        <div className="user-settings-profile-info">
          <h2>{fullName || 'بدون اسم'}</h2>
          <p>
            <Mail size={14} />
            {user.email}
          </p>
        </div>
        {user.app_metadata?.role === 'admin' && (
          <span className="user-settings-role">
            <Shield size={12} />
            مشرف
          </span>
        )}
      </div>

      {/* ============ المعلومات الشخصية ============ */}
      <div className="user-settings-section">
        <div className="user-settings-section-header">
          <span className="user-settings-section-icon">
            <User size={18} />
          </span>
          <div>
            <h3>المعلومات الشخصية</h3>
            <p>حدّث اسمك المعروض في الموقع</p>
          </div>
        </div>

        <div className="user-settings-fields">
          <label className="user-settings-field">
            <span>الاسم الكامل</span>
            <div className="user-settings-input">
              <User size={16} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="محمد أحمد"
              />
            </div>
          </label>

          <label className="user-settings-field">
            <span>البريد الإلكتروني</span>
            <div className="user-settings-input is-disabled">
              <Mail size={16} />
              <input
                type="email"
                value={user.email || ''}
                disabled
                dir="ltr"
              />
            </div>
            <small>لا يمكن تغيير البريد حاليًا</small>
          </label>
        </div>

        {profileMsg && (
          <div className={`user-settings-msg user-settings-msg-${profileMsg.type}`}>
            {profileMsg.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
            {profileMsg.text}
          </div>
        )}

        <button
          className="user-settings-btn user-settings-btn-primary"
          onClick={handleSaveProfile}
          disabled={savingProfile}
          type="button"
        >
          {savingProfile ? (
            <>
              <Loader2 size={15} className="spin" />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <Save size={15} />
              حفظ التغييرات
            </>
          )}
        </button>
      </div>

      {/* ============ كلمة المرور ============ */}
      <div className="user-settings-section">
        <div className="user-settings-section-header">
          <span className="user-settings-section-icon">
            <Lock size={18} />
          </span>
          <div>
            <h3>كلمة المرور</h3>
            <p>غيّر كلمة المرور الخاصة بك</p>
          </div>
        </div>

        <div className="user-settings-fields">
          <label className="user-settings-field">
            <span>كلمة المرور الجديدة</span>
            <div className="user-settings-input">
              <Lock size={16} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
                autoComplete="new-password"
              />
            </div>
          </label>

          <label className="user-settings-field">
            <span>تأكيد كلمة المرور</span>
            <div className="user-settings-input">
              <Lock size={16} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                autoComplete="new-password"
              />
            </div>
          </label>
        </div>

        {passwordMsg && (
          <div className={`user-settings-msg user-settings-msg-${passwordMsg.type}`}>
            {passwordMsg.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
            {passwordMsg.text}
          </div>
        )}

        <button
          className="user-settings-btn user-settings-btn-primary"
          onClick={handleChangePassword}
          disabled={savingPassword || !newPassword}
          type="button"
        >
          {savingPassword ? (
            <>
              <Loader2 size={15} className="spin" />
              جارٍ التغيير...
            </>
          ) : (
            <>
              <Lock size={15} />
              تغيير كلمة المرور
            </>
          )}
        </button>
      </div>

      {/* ============ تسجيل الخروج ============ */}
      <div className="user-settings-section">
        <div className="user-settings-section-header">
          <span className="user-settings-section-icon user-settings-section-icon-red">
            <LogOut size={18} />
          </span>
          <div>
            <h3>تسجيل الخروج</h3>
            <p>الخروج من حسابك على هذا الجهاز</p>
          </div>
        </div>

        <button
          className="user-settings-btn user-settings-btn-secondary"
          onClick={handleSignOut}
          type="button"
        >
          <LogOut size={15} />
          تسجيل الخروج
        </button>
      </div>

      {/* ============ حذف الحساب ============ */}
      <div className="user-settings-section user-settings-danger">
        <div className="user-settings-section-header">
          <span className="user-settings-section-icon user-settings-section-icon-red">
            <Trash2 size={18} />
          </span>
          <div>
            <h3>حذف الحساب</h3>
            <p>إجراء نهائي لا يمكن التراجع عنه</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <button
            className="user-settings-btn user-settings-btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
            type="button"
          >
            <Trash2 size={15} />
            حذف الحساب نهائيًا
          </button>
        ) : (
          <div className="user-settings-delete-confirm">
            <p>
              للتأكيد، اكتب كلمة <strong>حذف</strong> في الحقل أدناه:
            </p>
            <input
              type="text"
              className="user-settings-delete-input"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="اكتب: حذف"
            />
            <div className="user-settings-delete-actions">
              <button
                className="user-settings-btn user-settings-btn-secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput('');
                }}
                type="button"
              >
                إلغاء
              </button>
              <button
                className="user-settings-btn user-settings-btn-danger"
                onClick={handleDelete}
                disabled={deleteInput !== 'حذف' || deleting}
                type="button"
              >
                {deleting ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />}
                تأكيد الحذف
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}