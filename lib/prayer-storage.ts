export type Coordinates = { latitude: number; longitude: number; label: string };
export type PrayerLocation = Coordinates | { city: string; country: string };
export type PrayerSettings = { location: PrayerLocation; method: 3 | 4 | 5; school: 0 | 1 };
export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type PrayerDay = { date: string; timezone: string; hijri: string; timings: Record<PrayerName, string>; locationLabel: string; coordinates?: Coordinates };
export type PrayerCache = { version: 1; savedAt: number; settings: PrayerSettings; today: PrayerDay; tomorrow: PrayerDay };
const CACHE = 'am-prayer-cache-v1';
const SETTINGS = 'am-prayer-settings-v1';
const LOCATION = 'am-last-location-v1';
export function validCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== 'object') return false;
  const p = value as Partial<Coordinates>;
  return typeof p.latitude === 'number' && Number.isFinite(p.latitude) && Math.abs(p.latitude) <= 90 && typeof p.longitude === 'number' && Number.isFinite(p.longitude) && Math.abs(p.longitude) <= 180 && typeof p.label === 'string';
}
export function validSettings(value: unknown): value is PrayerSettings {
  if (!value || typeof value !== 'object') return false;
  const p = value as Partial<PrayerSettings>;
  return [3, 4, 5].includes(Number(p.method)) && [0, 1].includes(Number(p.school)) && !!p.location && (validCoordinates(p.location) || ('city' in p.location && typeof p.location.city === 'string' && p.location.city.length > 0 && p.location.city.length <= 100 && typeof p.location.country === 'string' && p.location.country.length > 0 && p.location.country.length <= 100));
}
function read(key: string): unknown { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
export function writeLocal(key: string, value: unknown): boolean { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
export function loadLocation(): Coordinates | null { const p = read(LOCATION); return validCoordinates(p) ? p : null; }
export function saveLocation(value: Coordinates) { return writeLocal(LOCATION, value); }
export function loadPrayerSettings(): PrayerSettings | null { const p = read(SETTINGS); return validSettings(p) ? p : null; }
export function savePrayerSettings(value: PrayerSettings) { return writeLocal(SETTINGS, value); }
export function dateInZone(now: number, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function nextDate(date: string) { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); }
export function validPrayerDay(value: unknown): value is PrayerDay {
  try {
    if (!value || typeof value !== 'object') return false;
    const p = value as PrayerDay;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date) || typeof p.timezone !== 'string' || typeof p.hijri !== 'string' || typeof p.locationLabel !== 'string' || !p.locationLabel || (p.coordinates !== undefined && !validCoordinates(p.coordinates))) return false;
    dateInZone(Date.now(), p.timezone);
    return ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].every(key => {
      const timing = p.timings?.[key as PrayerName];
      return typeof timing === 'string' && /^\d{4}-\d{2}-\d{2}T.*[+-]\d{2}:\d{2}$/.test(timing) && Number.isFinite(Date.parse(timing)) && dateInZone(Date.parse(timing), p.timezone) === p.date;
    });
  } catch { return false; }
}
export function loadPrayerCache(settings: PrayerSettings, now = Date.now()): PrayerCache | null {
  try {
    const p = read(CACHE) as PrayerCache | null;
    if (!p || p.version !== 1 || !Number.isFinite(p.savedAt) || now < p.savedAt || now - p.savedAt >= 86400000 || JSON.stringify(p.settings) !== JSON.stringify(settings) || !validPrayerDay(p.today) || !validPrayerDay(p.tomorrow)) return null;
    if (p.today.date !== dateInZone(now, p.today.timezone) || p.tomorrow.date !== nextDate(p.today.date) || p.tomorrow.timezone !== p.today.timezone) return null;
    return p;
  } catch { return null; }
}
export function savePrayerCache(value: PrayerCache) { return writeLocal(CACHE, value); }
