import prophets from '@/data/prophets.json';
import { renderSocialCard, socialCardSize } from '@/lib/og';
import fs from 'node:fs/promises'; import path from 'node:path';
export const size = socialCardSize; export const contentType = 'image/png';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const prophet = prophets.find(p => p.slug === slug);
  if (!prophet) return renderSocialCard('قصص الأنبياء', 'من القرآن الكريم والسنة النبوية', 'في قصصهم عبرة');
  const story = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data/stories', `${slug}.json`), 'utf8')) as { chapters?: unknown[] };
  return renderSocialCard(`قصة ${prophet.name}`, `${(story.chapters?.length ?? 0).toLocaleString('ar-EG')} فصلًا بالأدلة والآيات والتفسير`, 'في قصص الأنبياء عبرة');
}
