import { redirect } from 'next/navigation';
import { PageHead } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { UserSettingsForm } from '@/components/user-settings-form';

export const metadata = { title: 'الإعدادات' };

export default async function UserSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/account/settings');

  return (
    <>
      <PageHead
        label="حسابي"
        title="الإعدادات"
        description="إدارة بياناتك الشخصية والأمان"
      />
      <section className="container content-section user-settings-page">
        <UserSettingsForm user={user} />
      </section>
    </>
  );
}