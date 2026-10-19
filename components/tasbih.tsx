'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, CircleDot, RotateCcw } from 'lucide-react';
import { defaultTasbih, incrementTasbih, loadTasbih, localDate, parseTasbih, saveTasbih, selectDhikr, sevenDates, TASBIH_KEY, tasbihPresets, type TasbihState } from '@/lib/tasbih-store';

export function Tasbih() {
  const [state, setState] = useState<TasbihState>(defaultTasbih); const current = useRef(state);
  const [ready, setReady] = useState(false); const [today, setToday] = useState(''); const [storageError, setStorageError] = useState(false);
  const [customText, setCustomText] = useState(''); const [customGoal, setCustomGoal] = useState('100'); const [notice, setNotice] = useState('');
  const audio = useRef<AudioContext | null>(null);
  function update(next: TasbihState) { current.current = next; setState(next); setStorageError(!saveTasbih(next)); }
  useEffect(() => {
    const saved = loadTasbih(); current.current = saved; setState(saved); setToday(localDate()); setReady(true);
    const interval = setInterval(() => setToday(localDate()), 1000);
    const sync = (e: StorageEvent) => { if (e.key === TASBIH_KEY) { const latest = parseTasbih(e.newValue); current.current = latest; setState(latest); } };
    window.addEventListener('storage', sync);
    return () => { clearInterval(interval); window.removeEventListener('storage', sync); void audio.current?.close(); audio.current = null; };
  }, []);
  function clickSound() {
    try {
      const ctx = audio.current ?? new AudioContext(); audio.current = ctx; if (ctx.state === 'suspended') void ctx.resume();
      const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.frequency.value = 650; gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045); oscillator.connect(gain); gain.connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + 0.05);
    } catch { setNotice('الصوت غير متاح في هذا المتصفح؛ يستمر العدّاد بصورة طبيعية.'); }
  }
  function add() {
    const result = incrementTasbih(current.current); if (result.state === current.current) return;
    update(result.state); setToday(localDate());
    if (result.completed) setNotice('أحسنت، أتممت هدفك. تقبّل الله منك.'); else setNotice('');
    if (result.state.vibration && typeof navigator.vibrate === 'function') { try { navigator.vibrate(result.completed ? [100, 60, 100] : 50); } catch { /* الاهتزاز اختياري */ } }
    if (result.state.sound) clickSound();
  }
  const day = state.history.find(d => d.date === today);
  const most = Object.entries(day?.dhikrs ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'ابدأ وردك';
  const progress = Math.min(1, Math.max(0, (state.count - (state.nextGoal - state.goal)) / state.goal));
  return <div className="daily-tool tasbih-tool" aria-busy={!ready}>
    <div className="tool-panel"><div className="tool-panel-heading"><CircleDot aria-hidden="true" /><div><h2>اختر وردك</h2><p>أهداف العدّاد لتنظيم وردك؛ العدد المخصص لا يعني فضيلة شرعية خاصة.</p></div></div>
      <label className="tool-select-label">الذكر<select aria-label="اختيار الذكر" value={state.preset} disabled={!ready} onChange={e => { const preset = tasbihPresets.find(p => p.id === e.target.value); if (preset) { update(selectDhikr(current.current, preset.id, preset.text, preset.goal)); setNotice(''); } else { update(selectDhikr(current.current, 'custom', customText.trim() || 'ذكري المخصص', Number(customGoal) || 100)); setNotice(''); } }}>{tasbihPresets.map(p => <option key={p.id} value={p.id}>{p.text} ({p.goal})</option>)}<option value="custom">ذكر مخصص</option></select></label>
      {state.preset === 'custom' && <form className="tool-form" onSubmit={e => { e.preventDefault(); update(selectDhikr(current.current, 'custom', customText, Number(customGoal))); setNotice('بدأ وردك المخصص.'); }}><label>نص الذكر<input aria-label="نص الذكر المخصص" required maxLength={500} value={customText} onChange={e => setCustomText(e.target.value)} /></label><label>الهدف<input aria-label="هدف الذكر المخصص" type="number" min="1" max="100000" required value={customGoal} onChange={e => setCustomGoal(e.target.value)} /></label><button className="button primary" type="submit">ابدأ الورد</button></form>}
      <div className="tasbih-options">{(['vibration', 'sound', 'autoReset'] as const).map(key => <label key={key}><input type="checkbox" aria-label={{ vibration: 'الاهتزاز', sound: 'صوت النقرة', autoReset: 'تصفير تلقائي عند الهدف' }[key]} checked={state[key]} disabled={!ready} onChange={e => update({ ...current.current, [key]: e.target.checked })} />{{ vibration: 'الاهتزاز', sound: 'صوت النقرة', autoReset: 'تصفير تلقائي عند الهدف' }[key]}</label>)}</div>
      <p className="tool-hint">الاهتزاز متاح على الأجهزة التي تدعمه. كل بيانات الورد محفوظة على جهازك فقط.</p>
    </div>
    <div className="tool-panel tasbih-counter-panel"><p className="tasbih-text">{state.text}</p>
      <div className="tasbih-ring"><svg viewBox="0 0 240 240" aria-hidden="true"><circle className="ring-track" cx="120" cy="120" r="106" /><circle className="ring-progress" cx="120" cy="120" r="106" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress * 100} /></svg><div className="tasbih-number"><output aria-label="العدد الحالي" aria-live="off">{state.count.toLocaleString('ar-EG')}</output><span>الهدف {state.nextGoal.toLocaleString('ar-EG')}</span></div></div>
      <button className="tasbih-add" onClick={add} disabled={!ready || state.pending} aria-label="إضافة تسبيحة"><span aria-hidden="true">+</span><span>سبّح</span></button>
      <p className="tasbih-notice" role="status">{state.pending || notice ? <><Check size={18} aria-hidden="true" />{notice || 'أتممت هدفك، تقبّل الله منك.'}</> : 'اضغط الزر، أو انتقل إليه بلوحة المفاتيح واضغط مسافة.'}</p>
      {state.pending && <div className="tool-actions centered"><button className="button primary" onClick={() => { update({ ...current.current, nextGoal: current.current.nextGoal + current.current.goal, pending: false }); setNotice('بدأ هدف جديد؛ الإجمالي مستمر.'); }} aria-label="استمر إلى هدف جديد">استمر</button><button className="button tool-secondary" onClick={() => { update(selectDhikr(current.current, state.preset, state.text, state.goal)); document.querySelector<HTMLSelectElement>('[aria-label="اختيار الذكر"]')?.focus(); setNotice('اختر ذكرًا جديدًا أو تابع الورد نفسه.'); }}>ابدأ ذكرًا جديدًا</button></div>}
      <button className="tasbih-reset" disabled={!ready} onClick={() => { update({ ...current.current, count: 0, nextGoal: current.current.goal, pending: false }); setNotice('صُفّر العدّاد؛ بقيت إحصاءاتك محفوظة.'); }} aria-label="تصفير العدّاد مع الاحتفاظ بإحصاءات اليوم"><RotateCcw size={16} />تصفير العدّاد</button>
      {storageError && <p role="alert" className="tool-error">تعذّر الحفظ على جهازك. يبقى العدّاد فعالًا حتى إغلاق الصفحة.</p>}
    </div>
    <section className="tool-panel tasbih-statistics" aria-labelledby="tasbih-stats"><h2 id="tasbih-stats">وردك اليوم</h2><div className="tasbih-stats"><div><strong>{(day?.total ?? 0).toLocaleString('ar-EG')}</strong><span>تسبيحات اليوم</span></div><div><strong>{(day?.sessions ?? 0).toLocaleString('ar-EG')}</strong><span>جلسات مكتملة</span></div><div><strong className="most-dhikr">{most}</strong><span>الذكر الأكثر</span></div></div><h3>آخر ٧ أيام</h3><div className="tasbih-history">{(today ? sevenDates(new Date(`${today}T12:00:00`)) : []).map(date => { const count = state.history.find(d => d.date === date)?.total ?? 0; return <div className={date === today ? 'is-today' : ''} key={date}><time dateTime={date}>{new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))}</time><strong>{count.toLocaleString('ar-EG')}</strong></div>; })}</div><p className="tool-hint">تتجدد إحصاءات اليوم عند منتصف الليل بحسب توقيت جهازك. الجلسة المكتملة هي بلوغ هدف، وتصفير العدّاد لا يمحو السجل.</p></section>
  </div>;
}
