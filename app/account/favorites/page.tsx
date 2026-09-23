import { redirect } from 'next/navigation';
import { PageHead } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { FavoritesList } from '@/components/favorites-list';

export const metadata = { title: 'المفضلة' };

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/account/favorites');

  return (
    <>
      <PageHead
        label="حسابي"
        title="المفضلة"
        description="كل ما حفظته من آيات وأحاديث وأدعية وأذكار وقصص"
      />
      <section className="container content-section favorites-page">
        <FavoritesList />
      </section>
    </>
  );
}