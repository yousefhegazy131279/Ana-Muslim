import surahs from '@/data/surahs.json';
import { renderSocialCard, socialCardSize } from '@/lib/og';
export const size = socialCardSize; export const contentType = 'image/png';
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const surah = surahs.find(s => String(s.id) === id);
  if (!surah) return renderSocialCard('القرآن الكريم', 'اقرأ القرآن الكريم مع التفسير الميسر', 'أنا مسلم');
  return renderSocialCard(`سورة ${surah.name_arabic}`, `${surah.total_ayahs.toLocaleString('ar-EG')} آيات · ${surah.type}`, 'من القرآن الكريم');
}
