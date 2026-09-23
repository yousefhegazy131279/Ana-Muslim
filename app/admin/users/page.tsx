import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHead } from '@/components/ui';
import { AdminUsersTable } from '@/components/admin-users-table';

export const metadata = { title: 'المستخدمون' };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login');
  }

  // جلب كل المستخدمين من profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
  }

  return (
    <>
      <PageHead
        label="منطقة الإدارة"
        title="المستخدمون"
        description={`إجمالي ${profiles?.length ?? 0} مستخدم`}
      />

      <section className="container content-section admin-users-page">
        <Link href="/admin" className="admin-back-link">
          <ArrowRight size={16} />
          العودة إلى لوحة التحكم
        </Link>

        {!profiles || profiles.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <Users size={32} strokeWidth={1.4} />
            </div>
            <h3>لا يوجد مستخدمون بعد</h3>
            <p>سيظهر المستخدمون هنا بمجرد تسجيلهم</p>
          </div>
        ) : (
          <AdminUsersTable profiles={profiles} currentUserId={user.id} />
        )}
      </section>
    </>
  );
}