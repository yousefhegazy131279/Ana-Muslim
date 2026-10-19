import { renderSocialCard, socialCardSize } from '@/lib/og';
export const alt = 'أنا مسلم — دليل كل مسلم: قرآن وأذكار وأدعية وأحاديث وقصص';
export const size = socialCardSize;
export const contentType = 'image/png';
export default function Image() { return renderSocialCard('أنا مسلم', 'دليل كل مسلم — قرآن وأذكار وأدعية وأحاديث وقصص', 'أهلاً بك في'); }
