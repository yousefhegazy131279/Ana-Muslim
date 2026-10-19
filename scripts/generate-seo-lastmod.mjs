import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// تُنشأ طوابع التاريخ عند إعداد الإصدار، لا عند كل طلب sitemap.
const git = args => { const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 }); return result.error || result.status !== 0 ? '' : result.stdout; };
const log = git(['log', '-n', '1000', '--format=@@@%cI', '--name-only', '--', 'app', 'data', 'public/data/hadith']);
const dates = new Map(); let stamp = '';
for (const line of log.split(/\r?\n/)) {
  if (line.startsWith('@@@')) { stamp = line.slice(3); continue; }
  if (line && stamp && !dates.has(line.replaceAll('\\', '/'))) dates.set(line.replaceAll('\\', '/'), stamp);
}
const dirty = new Set(git(['status', '--porcelain=v1', '--untracked-files=all']).split(/\r?\n/).filter(Boolean).map(row => row.slice(3).replaceAll('\\', '/')));
const generatedAt = new Date().toISOString();
const latest = (paths, fallback) => {
  const dirtyPaths = paths.filter(p => dirty.has(p) || [...dirty].some(d => d.startsWith(`${p}/`)));
  const candidates = dirtyPaths.length ? [generatedAt] : paths.map(p => dates.get(p)).filter(Boolean);
  return (candidates.sort().at(-1) ?? fallback).replace(/Z$/, '+00:00');
};
const trackedFallback = git(['log', '-1', '--format=%cI', '--', 'app/page.tsx']).trim() || generatedAt;
const results = {};
const fixed = {
  '/': ['app/page.tsx'], '/about': ['app/about/page.tsx'], '/quran': ['app/quran/page.tsx', 'data/surahs.json'],
  '/athkar': ['app/athkar/page.tsx', 'data/content-athkar.json'], '/duas': ['app/duas/page.tsx', 'data/content-duas.json'],
  '/hadith': ['app/hadith/page.tsx', 'public/data/hadith/index.json', 'data/hadith-meta.json'],
  '/stories': ['app/stories/page.tsx', 'data/prophets.json'], '/prayer-times': ['app/prayer-times/page.tsx'],
  '/qibla': ['app/qibla/page.tsx'], '/tasbih': ['app/tasbih/page.tsx'], '/download': ['app/download/page.tsx', 'data/mobile-release.json'],
  '/privacy': ['app/privacy/page.tsx'], '/terms': ['app/terms/page.tsx'],
};
for (const [route, paths] of Object.entries(fixed)) results[route] = latest(paths, trackedFallback);
for (let id = 1; id <= 114; id++) { const key = `/quran/${id}`; results[key] = latest([`app/quran/[id]/page.tsx`, `data/quran/${id}.json`], results['/quran']); }
const prophets = JSON.parse(await (await import('node:fs/promises')).readFile(resolve('data/prophets.json'), 'utf8'));
for (const prophet of prophets) { const key = `/stories/${prophet.slug}`; results[key] = latest(['app/stories/[slug]/page.tsx', `data/stories/${prophet.slug}.json`], results['/stories']); }
await writeFile(resolve('data/seo-lastmod.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
console.log(`Generated factual dates for ${Object.keys(results).length} URLs.`);
