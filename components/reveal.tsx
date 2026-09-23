'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** نوع الحركة */
  animation?: 'fade-up' | 'fade-down' | 'fade-right' | 'fade-left' | 'zoom-in' | 'flip-up';
  /** تأخير الظهور بالمللي ثانية */
  delay?: number;
  /** مدة الحركة */
  duration?: number;
  /** كلاس إضافي */
  className?: string;
  /** العنصر HTML */
  as?: React.ElementType;
  /** نسبة الظهور لتفعيل الحركة */
  threshold?: number;
}

export function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  as: Tag = 'div',
  threshold = 0.15,
  ...rest
}: RevealProps & Record<string, any>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // احترام تفضيل المستخدم
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  const classes = [
    'reveal',
    `reveal-${animation}`,
    visible && 'reveal-visible',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Component = Tag as any;

  return (
    <Component ref={ref} className={classes} style={style} {...rest}>
      {children}
    </Component>
  );
}