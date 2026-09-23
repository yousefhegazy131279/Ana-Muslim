'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  to: number;
  duration?: number;
  suffix?: string;
}

/** تحويل الأرقام إلى عربية */
function toArabic(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .replace(/\d/g, (d) => arabicDigits[parseInt(d)])
    .replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
}

export function Counter({ to, duration = 2000, suffix = '' }: CounterProps) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(to * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setValue(to);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, to, duration]);

  return (
    <span ref={ref}>
      {toArabic(value)}
      {suffix}
    </span>
  );
}