'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from './supabase/client';

export type FavoriteType =
  | 'ayah'
  | 'hadith'
  | 'dua'
  | 'dhikr'
  | 'story'
  | 'surah';

export interface Favorite {
  id: number;
  user_id: string;
  item_type: FavoriteType;
  item_id: string;
  item_label: string | null;
  item_preview: string | null;
  item_meta: any;
  created_at: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data ?? []);
    } catch (err) {
      console.warn('Load favorites error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ===== هل العنصر مفضل؟ =====
  function isFavorite(itemType: FavoriteType, itemId: string): boolean {
    return favorites.some(
      (f) => f.item_type === itemType && f.item_id === String(itemId)
    );
  }

  // ===== إضافة / إزالة =====
  async function toggle(params: {
    item_type: FavoriteType;
    item_id: string;
    item_label?: string;
    item_preview?: string;
    item_meta?: any;
  }): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const exists = isFavorite(params.item_type, params.item_id);

    if (exists) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('item_type', params.item_type)
        .eq('item_id', String(params.item_id));

      if (!error) {
        setFavorites((prev) =>
          prev.filter(
            (f) =>
              !(f.item_type === params.item_type && f.item_id === String(params.item_id))
          )
        );
      }
      return false;
    } else {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          item_type: params.item_type,
          item_id: String(params.item_id),
          item_label: params.item_label ?? null,
          item_preview: params.item_preview ?? null,
          item_meta: params.item_meta ?? null,
        })
        .select()
        .single();

      if (!error && data) {
        setFavorites((prev) => [data, ...prev]);
        return true;
      }
      return false;
    }
  }

  return { favorites, loading, isFavorite, toggle, reload: load };
}