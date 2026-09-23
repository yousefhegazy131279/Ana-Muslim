'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createClient } from './supabase/client';

// ============================================================
// الأنواع
// ============================================================
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

interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  isFavorite: (type: FavoriteType, id: string | number) => boolean;
  toggle: (params: {
    item_type: FavoriteType;
    item_id: string | number;
    item_label?: string;
    item_preview?: string;
    item_meta?: any;
  }) => Promise<boolean>;
  reload: () => Promise<void>;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

// ============================================================
// Provider
// ============================================================
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== تحميل المفضلة =====
  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

    // استمع لتغييرات Auth
    (async () => {
      const supabase = createClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        load();
      });

      return () => subscription.unsubscribe();
    })();
  }, [load]);

  // ===== هل العنصر مفضّل؟ =====
  const isFavorite = useCallback(
    (type: FavoriteType, id: string | number) => {
      return favorites.some(
        (f) => f.item_type === type && f.item_id === String(id)
      );
    },
    [favorites]
  );

  // ===== إضافة / إزالة =====
  const toggle = useCallback(
    async (params: {
      item_type: FavoriteType;
      item_id: string | number;
      item_label?: string;
      item_preview?: string;
      item_meta?: any;
    }): Promise<boolean> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // إذا لم يكن مسجّلًا → انتقل لصفحة الدخول
      if (!user) {
        if (typeof window !== 'undefined') {
          const next = window.location.pathname + window.location.search;
          window.location.href = `/login?next=${encodeURIComponent(next)}`;
        }
        return false;
      }

      const itemIdStr = String(params.item_id);
      const exists = isFavorite(params.item_type, itemIdStr);

      // ===== إزالة =====
      if (exists) {
        // تحديث متفائل
        setFavorites((prev) =>
          prev.filter(
            (f) =>
              !(f.item_type === params.item_type && f.item_id === itemIdStr)
          )
        );

        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('item_type', params.item_type)
          .eq('item_id', itemIdStr);

        if (error) {
          // تراجع
          await load();
          return true;
        }
        return false;
      }

      // ===== إضافة =====
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          item_type: params.item_type,
          item_id: itemIdStr,
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
    },
    [isFavorite, load]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggle,
        reload: load,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
}