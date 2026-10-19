'use client';
import { useEffect, useRef, useState } from 'react';
import { Compass, MapPin, Navigation } from 'lucide-react';
import { qiblaBearing } from '@/lib/qibla';
import { headingFromEvent, requestCompassPermission, watchCompass } from '@/lib/device-orientation';
import { loadLocation, saveLocation, type Coordinates } from '@/lib/prayer-storage';

const cities: Coordinates[] = [
  { label: 'القاهرة', latitude: 30.0444, longitude: 31.2357 }, { label: 'الإسكندرية', latitude: 31.2001, longitude: 29.9187 },
  { label: 'الرياض', latitude: 24.7136, longitude: 46.6753 }, { label: 'المدينة المنورة', latitude: 24.4672, longitude: 39.6024 },
  { label: 'دبي', latitude: 25.2048, longitude: 55.2708 }, { label: 'القدس', latitude: 31.7683, longitude: 35.2137 },
  { label: 'الدار البيضاء', latitude: 33.5731, longitude: -7.5898 }, { label: 'لندن', latitude: 51.5074, longitude: -0.1278 },
];
export function QiblaCompass() {
  const [location, setLocation] = useState<Coordinates | null>(null); const [bearing, setBearing] = useState<number | null>(null);
  const [latitude, setLatitude] = useState(''); const [longitude, setLongitude] = useState(''); const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState(''); const [sensorMessage, setSensorMessage] = useState('البوصلة غير مفعّلة.'); const [busy, setBusy] = useState(false); const [enabling, setEnabling] = useState(false);
  const cleanup = useRef<(() => void) | null>(null); const timeout = useRef<ReturnType<typeof setTimeout> | null>(null); const mounted = useRef(true);
  function choose(value: Coordinates) {
    try { const angle = qiblaBearing(value.latitude, value.longitude); setLocation(value); setBearing(angle); setLatitude(String(value.latitude)); setLongitude(String(value.longitude)); setError(saveLocation(value) ? '' : 'تعذّر حفظ الموقع على جهازك؛ يمكنك استخدام الاتجاه في هذه الجلسة.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'تعذّر حساب اتجاه القبلة.'); }
  }
  useEffect(() => { mounted.current = true; const saved = loadLocation(); if (saved) choose(saved); return () => { mounted.current = false; cleanup.current?.(); if (timeout.current) clearTimeout(timeout.current); }; }, []);
  async function enable() {
    setEnabling(true);
    try {
      await requestCompassPermission(); if (!mounted.current) return;
      cleanup.current?.(); if (timeout.current) clearTimeout(timeout.current); setHeading(null);
      setSensorMessage('بانتظار اتجاه الشمال… ضع الهاتف أفقيًا وبعيدًا عن المعادن.');
      const expire = () => { setHeading(null); setSensorMessage('لم تصل قراءة موثوقة للشمال. الاتجاه المعروض ثابت نسبةً إلى الشمال.'); };
      timeout.current = setTimeout(expire, 8000);
      cleanup.current = watchCompass(value => { setHeading(value); setSensorMessage('البوصلة الحية مفعّلة؛ وجّه الهاتف حتى تصبح علامة الكعبة في الأعلى.'); if (timeout.current) clearTimeout(timeout.current); timeout.current = setTimeout(expire, 5000); });
    } catch (e) { setSensorMessage(e instanceof Error ? e.message : 'تعذّر تفعيل مستشعر البوصلة. استخدم الزاوية نسبةً إلى الشمال.'); }
    finally { if (mounted.current) setEnabling(false); }
  }
  function locate() {
    if (!navigator.geolocation) { setError('تحديد الموقع غير متاح. اختر مدينة أو أدخل إحداثياتك.'); return; }
    setBusy(true); setError(''); navigator.geolocation.getCurrentPosition(p => { if (mounted.current) { choose({ latitude: p.coords.latitude, longitude: p.coords.longitude, label: 'موقعي الحالي' }); setBusy(false); } }, () => { if (mounted.current) { setError('تعذّر تحديد موقعك أو رُفض الإذن. اختر المدينة أو أدخل الإحداثيات.'); setBusy(false); } }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 });
  }
  // الحفاظ على الاستيراد محدودًا بالمستشعرات؛ لا توجد خدمة تحديد اتجاه خارجية.
  void headingFromEvent;
  return <div className="daily-tool qibla-tool">
    <div className="tool-panel"><div className="tool-panel-heading"><MapPin aria-hidden="true" /><div><h2>من أين تتجه إلى القبلة؟</h2><p>الحساب يتم على جهازك، ولا يرسل موقعك إلى خادم.</p></div></div>
      <div className="tool-actions"><button className="button primary" onClick={locate} disabled={busy} aria-label="تحديد موقعي لحساب القبلة"><MapPin size={18} />{busy ? 'جارٍ تحديد الموقع…' : 'استخدم موقعي'}</button><label className="qibla-city">أو اختر مدينة<select aria-label="مدينة حساب القبلة" defaultValue="" onChange={e => { const city = cities[Number(e.target.value)]; if (city) choose(city); }}><option value="" disabled>اختر مدينة</option>{cities.map((p, i) => <option value={i} key={p.label}>{p.label}</option>)}</select></label></div>
      <details className="tool-details"><summary>إدخال الإحداثيات يدويًا</summary><form className="tool-form" onSubmit={e => { e.preventDefault(); if (latitude.trim() && longitude.trim()) choose({ latitude: Number(latitude), longitude: Number(longitude), label: 'موقع أدخلته يدويًا' }); }}><label>خط العرض<input aria-label="خط العرض" type="number" step="any" min="-90" max="90" required value={latitude} onChange={e => setLatitude(e.target.value)} dir="ltr" /></label><label>خط الطول<input aria-label="خط الطول" type="number" step="any" min="-180" max="180" required value={longitude} onChange={e => setLongitude(e.target.value)} dir="ltr" /></label><button className="button primary" type="submit">حساب الاتجاه</button></form></details>
      {error && <p role="alert" className="tool-error">{error}</p>}
    </div>
    <div className="compass-panel tool-panel"><span className="eyebrow"><Compass size={18} aria-hidden="true" />{location?.label || 'اختر موقعك للبدء'}</span>
      <div className="qibla-compass" role="img" aria-label={bearing === null ? 'بوصلة تنتظر تحديد الموقع' : `اتجاه القبلة ${bearing.toFixed(1)} درجة من الشمال${heading === null ? '، اتجاه ثابت' : '، بوصلة حية'}`}>
        <span className="compass-top" aria-hidden="true">▾</span>
        <div className="compass-dial" style={{ transform: `rotate(${-1 * (heading ?? 0)}deg)` }} aria-hidden="true"><span className="compass-north">شمال<br />N</span><span className="compass-south">جنوب</span><span className="compass-east">شرق</span><span className="compass-west">غرب</span>
          {bearing !== null && <div className="qibla-pointer" style={{ transform: `rotate(${bearing}deg)` }}><span className="kaaba-marker">▣</span><Navigation size={44} fill="currentColor" style={{ transform: 'rotate(-45deg)' }} /></div>}
        </div><span className="compass-center" aria-hidden="true" />
      </div>
      <h2 className="qibla-bearing">{bearing === null ? 'اتجاه القبلة' : <><bdi>{bearing.toFixed(1)}°</bdi> من الشمال</>}</h2>
      <p className="tool-status" role="status">{sensorMessage}</p>
      <button className="button primary" onClick={() => void enable()} disabled={enabling} aria-label="تمكين البوصلة">{enabling ? 'جارٍ التمكين…' : 'تمكين البوصلة'}</button>
      <p className="tool-hint">{heading === null ? 'السهم ثابت بالنسبة إلى الشمال الجغرافي، ولا يتبع دوران الهاتف. حدّد الشمال ببوصلة أخرى ثم اتجه إلى الزاوية المعروضة.' : 'ضع الهاتف أفقيًا وعاير البوصلة بتحريكه برفق. دقة المستشعر قد تتأثر بالمغناطيس والمعادن؛ تحقّق من اتجاه مسجد قريب عند الحاجة.'}</p>
    </div>
  </div>;
}
