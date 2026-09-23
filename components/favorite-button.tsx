'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import {
  useFavorites,
  type FavoriteType,
} from '@/lib/favorites-context';

interface Props {
  itemType: FavoriteType;
  itemId: string | number;
  itemLabel?: string;
  itemPreview?: string;
  itemMeta?: any;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'overlay';
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({
  itemType,
  itemId,
  itemLabel,
  itemPreview,
  itemMeta,
  size = 'md',
  variant = 'icon',
  showLabel = false,
  className = '',
}: Props) {
  const { isFavorite, toggle } = useFavorites();
  const [loading, setLoading] = useState(false);
  const active = isFavorite(itemType, itemId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await toggle({
      item_type: itemType,
      item_id: itemId,
      item_label: itemLabel,
      item_preview: itemPreview,
      item_meta: itemMeta,
    });
    setLoading(false);
  }

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  const classes = [
    'fav-btn',
    `fav-btn-${size}`,
    `fav-btn-${variant}`,
    active && 'is-active',
    loading && 'is-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={loading}
      aria-label={active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      title={active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      type="button"
    >
      {loading ? (
        <Loader2 size={iconSize} className="spin" />
      ) : (
        <Heart
          size={iconSize}
          fill={active ? 'currentColor' : 'none'}
          strokeWidth={active ? 2 : 1.8}
        />
      )}
      {(showLabel || variant === 'button') && (
        <span>{active ? 'في المفضلة' : 'حفظ'}</span>
      )}
    </button>
  );
}