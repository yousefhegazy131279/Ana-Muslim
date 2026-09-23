'use client';

import { useEffect } from 'react';

export default function AOSProvider() {
  useEffect(() => {
    let aosInstance: any = null; // ← استخدم any هنا

    const initAOS = async () => {
      // أضف as any لتجاوز فحص النوع
      const AOS = (await import('aos')).default as any; 
      aosInstance = AOS;
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 120,
      });
    };

    initAOS();

    return () => {
      if (aosInstance) {
        aosInstance.refreshHard();
      }
    };
  }, []);

  return null;
}