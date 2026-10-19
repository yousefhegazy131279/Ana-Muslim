import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const socialCardSize = { width: 1200, height: 630 };
// الخط العربي مضمّن احتياطيًا لضمان بقاء صورة المشاركة قابلة للتوليد عند انقطاع Google Fonts.
let fontPromise: Promise<ArrayBuffer> | undefined;
async function cairoFont() {
  fontPromise ??= (async () => {
    try {
      const stylesheet = await fetch('https://fonts.googleapis.com/css2?family=Cairo:wght@700', { signal: AbortSignal.timeout(4000), headers: { 'user-agent': 'Mozilla/5.0' } }).then(r => { if (!r.ok) throw new Error('Google Fonts unavailable'); return r.text(); });
      const fontUrl = stylesheet.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/)?.[1];
      if (!fontUrl) throw new Error('Cairo font URL unavailable');
      const response = await fetch(fontUrl, { signal: AbortSignal.timeout(5000) }); if (!response.ok) throw new Error('Cairo font unavailable');
      return response.arrayBuffer();
    } catch { const buffer = await readFile(join(process.cwd(), 'public/fonts/Cairo-OG-700.ttf')); return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer; }
  })();
  return fontPromise;
}
export async function renderSocialCard(title: string, subtitle: string, label = 'دليل كل مسلم') {
  return new ImageResponse(<div dir="rtl" style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'linear-gradient(125deg,#023B20 0%,#03552c 52%,#046A38 100%)', fontFamily: 'Cairo', padding: 72 }}>
    <div style={{ position: 'absolute', width: 540, height: 540, borderRadius: 270, border: '2px solid #d4af3744', top: -290, right: -80, display: 'flex' }} />
    <div style={{ position: 'absolute', width: 370, height: 370, borderRadius: 185, border: '2px solid #d4af372e', bottom: -265, left: -55, display: 'flex' }} />
    <div style={{ position: 'absolute', left: 72, top: 68, width: 68, height: 68, border: '2px solid #D4AF37', borderRadius: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 2 24.5 15.5 38 20 24.5 24.5 20 38 15.5 24.5 2 20 15.5 15.5Z" fill="#F0D589" /></svg></div>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 17 }}>
      <div style={{ color: '#F0D589', fontSize: 25, fontWeight: 700 }}>{label}</div>
      <div style={{ color: 'white', fontSize: title.length > 32 ? 62 : 76, lineHeight: 1.35, fontWeight: 700, maxWidth: 1040 }}>{title}</div>
      <div style={{ width: 105, height: 5, borderRadius: 8, background: '#D4AF37', display: 'flex', marginTop: 2 }} />
      <div style={{ color: '#E8F5E9', fontSize: 30, lineHeight: 1.65, maxWidth: 1000 }}>{subtitle}</div>
    </div>
    <div dir="ltr" style={{ position: 'absolute', bottom: 40, left: 72, color: '#ffffffb5', fontSize: 20, display: 'flex' }}>anamuslim-hgz.vercel.app</div>
  </div>, { ...socialCardSize, fonts: [{ name: 'Cairo', data: await cairoFont(), weight: 700, style: 'normal' }], headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } });
}
