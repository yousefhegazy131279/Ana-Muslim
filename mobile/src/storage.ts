export function read<T>(key: string, fallback: T): T {
  try {
    return (
      JSON.parse(localStorage.getItem("am-mobile-" + key) ?? "null") ?? fallback
    );
  } catch {
    return fallback;
  }
}
export function save(key: string, value: unknown) {
  const name = "am-mobile-" + key,
    text = JSON.stringify(value);
  localStorage.setItem(name, text);
  if (Capacitor.isNativePlatform())
    void Preferences.set({ key: name, value: text });
  window.dispatchEvent(new Event("am-storage"));
}
export type Bookmark = { route: string; title: string };
export function bookmarks(): Bookmark[] {
  return read("bookmarks", []);
}
export function toggleBookmark(item: Bookmark) {
  const items = bookmarks();
  save(
    "bookmarks",
    items.some((b) => b.route === item.route)
      ? items.filter((b) => b.route !== item.route)
      : [item, ...items],
  );
}
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
export async function restoreNativeStorage() {
  if (!Capacitor.isNativePlatform()) return;
  const { keys } = await Preferences.keys();
  for (const key of keys.filter((k) => k.startsWith("am-mobile-"))) {
    const { value } = await Preferences.get({ key });
    if (value !== null) localStorage.setItem(key, value);
  }
}
