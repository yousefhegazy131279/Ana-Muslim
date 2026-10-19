import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  // المكتبة القابلة للعمل دون إنترنت موجودة بالفعل تحت /mobile/؛ لا نغيّر نطاق عامل خدمتها.
  return { id: '/mobile/', name: 'أنا مسلم — دليل كل مسلم', short_name: 'أنا مسلم', description: 'مكتبتك الإسلامية للقراءة دون إنترنت بعد اكتمال حفظها.', start_url: '/mobile/', scope: '/mobile/', display: 'standalone', lang: 'ar', dir: 'rtl', theme_color: '#046A38', background_color: '#023B20', icons: [
    { src: '/mobile/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/mobile/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
  ] };
}
