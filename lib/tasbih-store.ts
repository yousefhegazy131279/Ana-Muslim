export const tasbihPresets = [
  { id: 'subhan', text: 'سبحان الله', goal: 33 }, { id: 'hamd', text: 'الحمد لله', goal: 33 }, { id: 'takbir', text: 'الله أكبر', goal: 34 },
  { id: 'tahleel', text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير', goal: 100 },
  { id: 'hawqala', text: 'لا حول ولا قوة إلا بالله', goal: 100 }, { id: 'istighfar', text: 'أستغفر الله', goal: 100 }, { id: 'la-ilaha', text: 'لا إله إلا الله', goal: 100 },
] as const;
export type TasbihDay = { date: string; total: number; sessions: number; dhikrs: Record<string, number> };
export type TasbihState = { version: 1; preset: string; text: string; goal: number; count: number; nextGoal: number; pending: boolean; vibration: boolean; sound: boolean; autoReset: boolean; history: TasbihDay[] };
export const TASBIH_KEY = 'am-tasbih-v1';
export function localDate(now = new Date()): string { return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
export function sevenDates(now = new Date()) { return Array.from({ length: 7 }, (_, i) => { const day = new Date(now); day.setDate(day.getDate() - (6 - i)); return localDate(day); }); }
export function defaultTasbih(): TasbihState { return { version: 1, preset: 'subhan', text: 'سبحان الله', goal: 33, count: 0, nextGoal: 33, pending: false, vibration: true, sound: false, autoReset: false, history: [] }; }
function safeInteger(n: unknown, max = 1000000000): n is number { return typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 && n <= max; }
export function parseTasbih(raw: string | null, now = new Date()): TasbihState {
  const fallback = defaultTasbih(); if (!raw) return fallback;
  try {
    const p: unknown = JSON.parse(raw); if (!p || typeof p !== 'object') return fallback;
    const s = p as Partial<TasbihState>;
    if (s.version !== 1 || typeof s.preset !== 'string' || typeof s.text !== 'string' || !s.text.trim() || s.text.length > 500 || !safeInteger(s.goal, 100000) || s.goal < 1 || !safeInteger(s.count) || !safeInteger(s.nextGoal) || s.nextGoal < s.goal || s.count > s.nextGoal || s.nextGoal % s.goal !== 0 || typeof s.pending !== 'boolean' || s.pending !== (s.count === s.nextGoal) || !Array.isArray(s.history)) return fallback;
    const dates = sevenDates(now);
    const history = s.history.filter((d): d is TasbihDay => !!d && typeof d === 'object' && dates.includes(d.date) && safeInteger(d.total) && safeInteger(d.sessions) && !!d.dhikrs && typeof d.dhikrs === 'object' && !Array.isArray(d.dhikrs) && Object.entries(d.dhikrs).every(([name, count]) => name.length > 0 && name.length <= 500 && safeInteger(count)));
    if (new Set(history.map(d => d.date)).size !== history.length) return fallback;
    return { ...fallback, preset: s.preset, text: s.text, goal: s.goal, count: s.count, nextGoal: s.nextGoal, pending: s.pending, vibration: typeof s.vibration === 'boolean' ? s.vibration : true, sound: s.sound === true, autoReset: s.autoReset === true, history };
  } catch { return fallback; }
}
export function loadTasbih(now = new Date()) { try { return parseTasbih(localStorage.getItem(TASBIH_KEY), now); } catch { return defaultTasbih(); } }
export function saveTasbih(state: TasbihState): boolean { try { localStorage.setItem(TASBIH_KEY, JSON.stringify(state)); return true; } catch { return false; } }
export function incrementTasbih(state: TasbihState, now = new Date()): { state: TasbihState; completed: boolean } {
  if (state.pending || state.count >= 1000000000) return { state, completed: false };
  const date = localDate(now); const dates = sevenDates(now); const count = state.count + 1; const completed = count === state.nextGoal;
  const day = state.history.find(d => d.date === date) ?? { date, total: 0, sessions: 0, dhikrs: {} };
  const previous = typeof day.dhikrs[state.text] === 'number' ? day.dhikrs[state.text] : 0;
  const updated: TasbihDay = { date, total: day.total + 1, sessions: day.sessions + Number(completed), dhikrs: { ...day.dhikrs, [state.text]: previous + 1 } };
  return { completed, state: { ...state, count: completed && state.autoReset ? 0 : count, nextGoal: completed && state.autoReset ? state.goal : state.nextGoal, pending: completed && !state.autoReset, history: [...state.history.filter(d => d.date !== date && dates.includes(d.date)), updated].sort((a, b) => a.date.localeCompare(b.date)) } };
}
export function selectDhikr(state: TasbihState, preset: string, text: string, goal: number): TasbihState {
  if (!text.trim() || text.trim().length > 500 || !Number.isSafeInteger(goal) || goal < 1 || goal > 100000) return state;
  return { ...state, preset, text: text.trim(), goal, count: 0, nextGoal: goal, pending: false };
}
