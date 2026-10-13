import { useEffect, useState } from "react";
export type Verse = {
  id: number;
  surah_id: number;
  ayah_number: number;
  text_arabic: string;
  tafsir_text: string;
  source: string;
};
export type Surah = {
  id: number;
  name_arabic: string;
  type: string;
  total_ayahs: number;
};
export type Hadith = {
  id: number;
  title: string;
  hadith_text: string;
  explanation: string;
  word_meanings: string;
  benefits: string;
  grade: string;
  takhrij: string;
  link: string;
  categories: string[];
  books: string[];
};
export type HadithIndex = Pick<
  Hadith,
  "id" | "title" | "grade" | "takhrij" | "categories" | "books"
> & { chunk: number; search: string };
export type Prophet = {
  id: number;
  slug: string;
  name: string;
  theme: string;
  summary: string;
};
export type Story = Prophet & {
  limits: string;
  chapters: {
    id: number;
    title: string;
    lead: string;
    passages: { surah: string; start: number; end: number; verses: Verse[] }[];
    hadiths: Hadith[];
  }[];
};
export type Category = { id: number; name: string };
export type ShortText = {
  id: number;
  category_id: number;
  text: string;
  title?: string;
  repeat_count?: number;
  reference: string;
  source_url: string;
  description?: string;
  vocabulary?: string;
};
export type Info = {
  version: string;
  contentVersion: string;
  surahs: number;
  ayahs: number;
  hadiths: number;
  stories: number;
  athkar: number;
  duas: number;
  bytes: number;
};
const pending = new Map<string, Promise<unknown>>();
export function asset(file: string) {
  return new URL(file, document.baseURI).href;
}
export function content<T>(file: string): Promise<T> {
  if (!pending.has(file))
    pending.set(
      file,
      fetch(asset("content/" + file))
        .then((r) => {
          if (!r.ok)
            throw Error(
              "تعذر فتح الملف المحفوظ. أعد فتح التطبيق أو أكمل حفظ المحتوى أولًا.",
            );
          return r.json();
        })
        .catch((e) => {
          pending.delete(file);
          throw e;
        }),
    );
  return pending.get(file) as Promise<T>;
}
export function useContent<T>(file: string) {
  const [state, setState] = useState<{
    file: string;
    data: T | null;
    error: string;
  }>({ file, data: null, error: "" });
  useEffect(() => {
    let active = true;
    content<T>(file)
      .then((data) => {
        if (active) setState({ file, data, error: "" });
      })
      .catch((e) => {
        if (active) setState({ file, data: null, error: e.message });
      });
    return () => {
      active = false;
    };
  }, [file]);
  return state.file === file ? state : { file, data: null, error: "" };
}
export const normalize = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase();
export const arabic = (n: number) => n.toLocaleString("ar-EG");
