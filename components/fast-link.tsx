'use client';

import Link from 'next/link';
import { useState, type ComponentProps } from 'react';

/** Prefetch on intent so large background pages do not compete with navigation. */
export function FastLink({
  prefetch,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: ComponentProps<typeof Link>) {
  const [intended, setIntended] = useState(false);

  return (
    <Link
      {...props}
      prefetch={prefetch ?? intended}
      onMouseEnter={(event) => {
        setIntended(true);
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        setIntended(true);
        onFocus?.(event);
      }}
      onTouchStart={(event) => {
        setIntended(true);
        onTouchStart?.(event);
      }}
    />
  );
}
