import { dateInZone, nextDate, validPrayerDay, type PrayerCache, type PrayerDay, type PrayerName, type PrayerSettings } from './prayer-storage';
export const prayerLabels: Record<PrayerName, string> = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
export const prayerNames = Object.keys(prayerLabels) as PrayerName[];
type ApiData = { timings: Record<PrayerName, string>; date: { gregorian: { date: string }; hijri: { day: string; month: { ar: string }; year: string } }; meta: { timezone: string; latitude: number; longitude: number } };
async function requestDay(settings: PrayerSettings, date: string, signal?: AbortSignal): Promise<PrayerDay> {
  const location = settings.location;
  const city = 'city' in location;
  const url = new URL(`https://api.aladhan.com/v1/${city ? 'timingsByCity' : 'timings'}/${date}`);
  url.searchParams.set('method', String(settings.method)); url.searchParams.set('school', String(settings.school)); url.searchParams.set('iso8601', 'true');
  if ('city' in location) { url.searchParams.set('city', location.city); url.searchParams.set('country', location.country); }
  else { url.searchParams.set('latitude', String(location.latitude)); url.searchParams.set('longitude', String(location.longitude)); }
  const response = await fetch(url, { signal: AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(15000)]), referrerPolicy: 'no-referrer' });
  if (!response.ok) throw new Error('تعذّر الاتصال بخدمة المواقيت. حاول مجددًا أو اختر مدينة أخرى.');
  const json: { code?: number; data?: ApiData } = await response.json();
  if (json.code !== 200 || !json.data) throw new Error('لم نجد مواقيت لهذا المكان. راجع اسم المدينة والدولة.');
  const data = json.data;
  const [day, month, year] = data.date.gregorian.date.split('-');
  const result: PrayerDay = { date: `${year}-${month}-${day}`, timezone: data.meta.timezone, hijri: `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year} هـ`, timings: data.timings, locationLabel: city ? `${(location as { city: string }).city}، ${(location as { country: string }).country}` : location.label, ...(city ? {} : { coordinates: { latitude: data.meta.latitude, longitude: data.meta.longitude, label: location.label } }) };
  if (!validPrayerDay(result)) throw new Error('وصلت بيانات مواقيت غير مكتملة. أعد المحاولة لاحقًا.');
  return result;
}
function apiDate(isoDate: string) { return isoDate.split('-').reverse().join('-'); }
export async function fetchPrayerSchedule(settings: PrayerSettings, signal?: AbortSignal, now = Date.now()): Promise<PrayerCache> {
  // الإزاحة الزمنية تأتي مع كل وقت من المصدر؛ لا نفترض أن الغد يساوي ٢٤ ساعة عند تغير التوقيت الصيفي.
  let today = await requestDay(settings, String(Math.floor(now / 1000)), signal);
  const currentDate = dateInZone(now, today.timezone);
  if (today.date !== currentDate) today = await requestDay(settings, apiDate(currentDate), signal);
  const tomorrow = await requestDay(settings, apiDate(nextDate(today.date)), signal);
  if (tomorrow.date !== nextDate(today.date) || tomorrow.timezone !== today.timezone) throw new Error('تعذّر التحقق من مواقيت الغد. أعد المحاولة.');
  return { version: 1, savedAt: now, settings, today, tomorrow };
}
export function upcomingPrayer(cache: PrayerCache, now: number) {
  return [cache.today, cache.tomorrow].flatMap(day => prayerNames.filter(name => name !== 'Sunrise').map(name => ({ name, time: Date.parse(day.timings[name]), date: day.date }))).find(p => p.time > now) ?? null;
}
export function countdown(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
}
