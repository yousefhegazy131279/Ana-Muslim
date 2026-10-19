'use client';
import { useEffect, useRef, useState } from 'react';
import { Clock, MapPin, RefreshCw, Sunrise } from 'lucide-react';
import { countdown, fetchPrayerSchedule, prayerLabels, prayerNames, upcomingPrayer } from '@/lib/prayer-api';
import { dateInZone, loadPrayerCache, loadPrayerSettings, saveLocation, savePrayerCache, savePrayerSettings, type PrayerCache, type PrayerLocation, type PrayerSettings } from '@/lib/prayer-storage';

const defaultSettings: PrayerSettings = { location: { city: 'القاهرة', country: 'مصر' }, method: 5, school: 0 };
export function PrayerTimes() {
  const [settings, setSettings] = useState<PrayerSettings>(defaultSettings);
  const [city, setCity] = useState('القاهرة'); const [country, setCountry] = useState('مصر');
  const [data, setData] = useState<PrayerCache | null>(null); const [now, setNow] = useState(0);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('اختر مدينتك أو استخدم موقعك لعرض المواقيت.'); const [error, setError] = useState('');
  const [storageWarning, setStorageWarning] = useState(false);
  const active = useRef<AbortController | null>(null); const requestId = useRef(0); const rollover = useRef('');
  async function load(next: PrayerSettings, force = false) {
    active.current?.abort(); const controller = new AbortController(); active.current = controller; const id = ++requestId.current;
    setSettings(next); setBusy(true); setError(''); setData(null);
    // احفظ اختيار المدينة وطريقة الحساب فورًا كيلا يعود المتصفح إلى الجدول السابق إذا أُعيد فتحه أثناء الجلب.
    savePrayerSettings(next);
    try {
      const cached = !force && loadPrayerCache(next);
      const result = cached || await fetchPrayerSchedule(next, controller.signal);
      if (controller.signal.aborted || id !== requestId.current) return;
      setData(result); setNow(Date.now()); rollover.current = result.today.date;
      const storedSettings = savePrayerSettings(next); const storedCache = savePrayerCache(result); const storedLocation = result.today.coordinates ? saveLocation(result.today.coordinates) : true;
      setStorageWarning(!storedSettings || !storedCache || !storedLocation);
      setMessage(cached ? 'المواقيت من النسخة المحفوظة على جهازك.' : 'تم تحديث المواقيت من Aladhan وحفظها لمدة تصل إلى ٢٤ ساعة.');
    } catch (e) {
      if (!controller.signal.aborted && id === requestId.current) setError(e instanceof Error && e.name !== 'TimeoutError' && e.name !== 'TypeError' ? e.message : 'تعذّر تحميل المواقيت. تحقق من الإنترنت ثم أعد المحاولة.');
    } finally { if (id === requestId.current) setBusy(false); }
  }
  useEffect(() => {
    const saved = loadPrayerSettings();
    if (saved) { if ('city' in saved.location) { setCity(saved.location.city); setCountry(saved.location.country); } void load(saved); }
    setNow(Date.now()); const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { window.clearInterval(interval); active.current?.abort(); requestId.current++; };
  }, []);
  useEffect(() => {
    if (!data || !now) return;
    const current = dateInZone(now, data.today.timezone);
    if (current !== data.today.date && rollover.current !== current) { rollover.current = current; void load(settings); }
  }, [now, data, settings]);
  function locate() {
    if (!navigator.geolocation) { setError('هذا المتصفح لا يدعم تحديد الموقع. أدخل المدينة والدولة.'); return; }
    setBusy(true); setError('');
    navigator.geolocation.getCurrentPosition(position => {
      const location: PrayerLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude, label: 'موقعي الحالي' };
      void load({ ...settings, location });
    }, () => { setBusy(false); setError('تعذّر تحديد الموقع أو لم يُمنح الإذن. يمكنك إدخال المدينة والدولة.'); }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
  }
  const next = data && upcomingPrayer(data, now);
  const stale = data && data.today.date !== dateInZone(now || Date.now(), data.today.timezone);
  return <div className="daily-tool prayer-tool">
    <div className="tool-panel">
      <div className="tool-panel-heading"><MapPin aria-hidden="true" /><div><h2>مواقيت مدينتك</h2><p>اختر المكان وطريقة الحساب المناسبة لك.</p></div></div>
      <form className="tool-form" onSubmit={e => { e.preventDefault(); if (city.trim() && country.trim()) void load({ ...settings, location: { city: city.trim(), country: country.trim() } }); }}>
        <label>المدينة<input aria-label="المدينة" value={city} maxLength={100} required onChange={e => setCity(e.target.value)} autoComplete="address-level2" /></label>
        <label>الدولة<input aria-label="الدولة" value={country} maxLength={100} required onChange={e => setCountry(e.target.value)} autoComplete="country-name" /></label>
        <label>طريقة الحساب<select aria-label="طريقة الحساب" disabled={busy} value={settings.method} onChange={e => { const nextSettings = { ...settings, method: Number(e.target.value) as 3 | 4 | 5 }; setSettings(nextSettings); if (data || busy) void load(nextSettings); }}><option value="5">الهيئة المصرية للمساحة</option><option value="4">جامعة أم القرى</option><option value="3">رابطة العالم الإسلامي</option></select></label>
        <label>حساب العصر<select aria-label="حساب العصر" disabled={busy} value={settings.school} onChange={e => { const nextSettings = { ...settings, school: Number(e.target.value) as 0 | 1 }; setSettings(nextSettings); if (data || busy) void load(nextSettings); }}><option value="0">الجمهور (الشافعي)</option><option value="1">الحنفي</option></select></label>
        <div className="tool-actions"><button className="button primary" disabled={busy} type="submit">عرض المواقيت</button><button className="button tool-secondary" type="button" onClick={locate} disabled={busy}><MapPin size={18} />استخدم موقعي</button><button className="button tool-secondary" type="button" onClick={() => void load(settings, true)} disabled={busy} aria-label="تحديث المواقيت"><RefreshCw size={18} />تحديث</button></div>
      </form>
      <p className="tool-hint">لا يُطلب الموقع إلا باختيارك. تُرسل المدينة أو الإحداثيات إلى Aladhan فقط لحساب المواقيت.</p>
    </div>
    <p role="status" className="tool-status">{busy ? 'جارٍ تحميل المواقيت…' : message}</p>
    {error && <p role="alert" className="tool-error">{error}</p>}
    {storageWarning && <p className="tool-hint">التخزين المحلي غير متاح؛ ستحتاج إلى تحديث المواقيت عند فتح الصفحة مجددًا.</p>}
    {data && !stale && <>
      <div className="prayer-summary"><div><span className="eyebrow">{data.today.locationLabel}</span><h2>{data.today.hijri}</h2><p>{new Intl.DateTimeFormat('ar-EG', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${data.today.date}T12:00:00Z`))}</p><small>التوقيت: <bdi>{data.today.timezone}</bdi></small></div>{next && <div className="next-prayer"><Clock size={22} aria-hidden="true" /><span>الصلاة القادمة · {prayerLabels[next.name]}{next.date !== data.today.date ? ' غدًا' : ''}</span><strong dir="ltr" aria-label={`متبقي ${countdown(next.time - now)}`}>{countdown(next.time - now)}</strong></div>}</div>
      <div className="prayer-grid">{prayerNames.map(name => <article className={`prayer-card ${next?.name === name && next.date === data.today.date ? 'is-next' : ''}`} key={name} aria-label={`${prayerLabels[name]}${next?.name === name && next.date === data.today.date ? '، الصلاة القادمة' : ''}`}>
        {name === 'Sunrise' ? <Sunrise size={23} aria-hidden="true" /> : <Clock size={23} aria-hidden="true" />}<h3>{prayerLabels[name]}</h3><time dateTime={data.today.timings[name]}>{new Intl.DateTimeFormat('ar-EG', { hour: 'numeric', minute: '2-digit', timeZone: data.today.timezone }).format(new Date(data.today.timings[name]))}</time>
      </article>)}</div>
      <p className="tool-hint">المصدر: <a href="https://aladhan.com/calculation-methods" target="_blank" rel="noreferrer">Aladhan</a>. قد تختلف المواقيت بحسب طريقة الحساب وضبط الجهة المحلية؛ اتبع تقويم مسجدك المعتمد. الشروق ليس صلاة مفروضة.</p>
    </>}
  </div>;
}
