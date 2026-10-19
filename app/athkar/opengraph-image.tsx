import { renderSocialCard, socialCardSize } from '@/lib/og';
export const alt = 'الأذكار اليومية — أنا مسلم'; export const size = socialCardSize; export const contentType = 'image/png';
export default function Image() { return renderSocialCard('الأذكار اليومية', 'أذكار الصباح والمساء والنوم وما بعد الصلاة', 'طمأنينةٌ مع كل ذكر'); }
