import { renderSocialCard, socialCardSize } from '@/lib/og';
export const alt = 'الأدعية من الكتاب والسنة — أنا مسلم'; export const size = socialCardSize; export const contentType = 'image/png';
export default function Image() { return renderSocialCard('الأدعية', 'دعوات من القرآن الكريم والسنة النبوية', 'باب الدعاء مفتوح'); }
