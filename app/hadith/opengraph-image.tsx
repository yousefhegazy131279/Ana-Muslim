import { renderSocialCard, socialCardSize } from '@/lib/og';
export const alt = 'موسوعة الأحاديث النبوية — ٣٥٨٢ مادة مع الشروح والتخريج'; export const size = socialCardSize; export const contentType = 'image/png';
export default function Image() { return renderSocialCard('موسوعة الأحاديث النبوية', '٣٬٥٨٢ مادة حديثية مع الشروح والتخريج والأحكام', 'من هدي النبي الكريم'); }
