import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  Bell,
  Bookmark,
  Home,
  Moon,
  Sun,
  Search,
  ScrollText,
  HandHeart,
  Sprout,
  ArrowRight,
  Check,
  Settings,
  Download,
  WifiOff,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import {
  arabic,
  asset,
  normalize,
  useContent,
  type Verse,
  type Surah,
  type Hadith,
  type HadithIndex,
  type Prophet,
  type Story,
  type Category,
  type ShortText,
  type Info,
} from "./content";
import { read, save, bookmarks, toggleBookmark } from "./storage";
import { reminderTypes, reminderSettings, setReminders } from "./notifications";
import { setupOffline } from "./offline";

function useRoute() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  useEffect(() => {
    const listener = () => {
      setRoute(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", listener);
    return () => removeEventListener("hashchange", listener);
  }, []);
  return route;
}
const go = (route: string) => {
  location.hash = route;
};
function State({ error }: { error: string }) {
  return (
    <p
      className={error ? "notice error" : "notice"}
      role={error ? "alert" : "status"}
    >
      {error || "جارٍ فتح المحتوى المحفوظ…"}
    </p>
  );
}
function Title({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-title">
      <p className="eyebrow">إيمان يرافق يومك</p>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </section>
  );
}
function SearchBox({
  value,
  onChange,
  label = "ابحث في المحتوى",
}: {
  value: string;
  onChange: (s: string) => void;
  label?: string;
}) {
  return (
    <label className="search">
      <Search size={18} />
      <input
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Favorite({ route, title }: { route: string; title: string }) {
  const [, refresh] = useState(0);
  useEffect(() => {
    const listener = () => refresh((x) => x + 1);
    addEventListener("am-storage", listener);
    return () => removeEventListener("am-storage", listener);
  }, []);
  const selected = bookmarks().some((b) => b.route === route);
  return (
    <button
      className={"icon-button " + (selected ? "selected" : "")}
      aria-label={selected ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      aria-pressed={selected}
      onClick={() => toggleBookmark({ route, title })}
    >
      <Bookmark size={19} fill={selected ? "currentColor" : "none"} />
    </button>
  );
}
function Ayah({ verse }: { verse: Verse }) {
  return (
    <article className="paper verse">
      <div className="card-top">
        <span className="number">{arabic(verse.ayah_number)}</span>
        <Favorite
          route={`/quran/${verse.surah_id}?ayah=${verse.ayah_number}`}
          title={`الآية ${arabic(verse.ayah_number)} — سورة ${arabic(verse.surah_id)}`}
        />
      </div>
      <p className="sacred">{verse.text_arabic}</p>
      <details>
        <summary>التفسير الميسر</summary>
        <p className="explanation">{verse.tafsir_text}</p>
        <small className="source">{verse.source}</small>
      </details>
    </article>
  );
}
function HadithText({ hadith }: { hadith: Hadith }) {
  return (
    <article className="paper">
      <div className="card-top">
        <span className="badge">{hadith.grade}</span>
        <Favorite route={"/hadith/" + hadith.id} title={hadith.title} />
      </div>
      <p className="sacred">{hadith.hadith_text}</p>
      <p className="source">التخريج: {hadith.takhrij}</p>
      <h3>شرح الحديث</h3>
      <p className="explanation">{hadith.explanation}</p>
      {hadith.word_meanings && hadith.word_meanings !== "...." && (
        <details>
          <summary>معاني الكلمات</summary>
          <p className="explanation">{hadith.word_meanings}</p>
        </details>
      )}
      {hadith.benefits && (
        <details>
          <summary>الفوائد والأحكام</summary>
          <p className="explanation">{hadith.benefits}</p>
        </details>
      )}
      <p className="source">
        المصدر: موسوعة الأحاديث النبوية — الدرجة والتخريج كما في المصدر.
      </p>
      {hadith.link && (
        <a
          className="source"
          href={hadith.link}
          target="_blank"
          rel="noreferrer"
        >
          زيارة صفحة المصدر (تحتاج إنترنت)
        </a>
      )}
    </article>
  );
}
function Surahs() {
  const { data, error } = useContent<Surah[]>("surahs.json");
  const [q, setQ] = useState("");
  return (
    <>
      <Title
        title="القرآن الكريم"
        description="١١٤ سورة مع التفسير الميسر، محفوظة على جهازك."
      />
      <SearchBox value={q} onChange={setQ} label="ابحث باسم السورة أو رقمها" />
      {!data ? (
        <State error={error} />
      ) : (
        <div className="list">
          {data
            .filter((s) =>
              normalize(s.name_arabic + " " + s.id).includes(normalize(q)),
            )
            .map((s) => (
              <a
                href={"#/quran/" + s.id}
                className="paper list-item"
                key={s.id}
              >
                <span className="number">{arabic(s.id)}</span>
                <div>
                  <h2>سورة {s.name_arabic}</h2>
                  <small>
                    {s.type} · {arabic(s.total_ayahs)} آية
                  </small>
                </div>
                <BookOpen size={22} />
              </a>
            ))}
        </div>
      )}
    </>
  );
}
function Quran({ id, params }: { id: string; params: URLSearchParams }) {
  const { data, error } = useContent<Verse[]>(`quran/${id}.json`);
  const { data: surahs } = useContent<Surah[]>("surahs.json");
  const [q, setQ] = useState("");
  const surah = surahs?.find((s) => s.id === Number(id));
  useEffect(() => {
    if (data && params.get("ayah"))
      document.getElementById("ayah-" + params.get("ayah"))?.scrollIntoView();
  }, [data, params.get("ayah")]);
  return (
    <>
      <Title
        title={surah ? "سورة " + surah.name_arabic : "القرآن الكريم"}
        description={
          surah ? `${surah.type} · ${arabic(surah.total_ayahs)} آية` : undefined
        }
      />
      <SearchBox
        value={q}
        onChange={setQ}
        label="ابحث داخل السورة أو تفسيرها"
      />
      {!data ? (
        <State error={error} />
      ) : (
        <>
          {data
            .filter((v) =>
              normalize(
                v.text_arabic + " " + v.tafsir_text + " " + v.ayah_number,
              ).includes(normalize(q)),
            )
            .map((v) => (
              <div id={"ayah-" + v.ayah_number} key={v.id}>
                <Ayah verse={v} />
              </div>
            ))}
          <div className="pager">
            {Number(id) > 1 && (
              <a href={"#/quran/" + (Number(id) - 1)}>السورة السابقة</a>
            )}
            <a href="#/quran">فهرس السور</a>
            {Number(id) < 114 && (
              <a href={"#/quran/" + (Number(id) + 1)}>السورة التالية</a>
            )}
          </div>
        </>
      )}
    </>
  );
}
function Hadiths({ id }: { id?: string }) {
  const { data: index, error } = useContent<HadithIndex[]>("hadith/index.json");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [book, setBook] = useState("");
  const [page, setPage] = useState(0);
  const entry = index?.find((h) => String(h.id) === id);
  const filtered = useMemo(
    () =>
      index?.filter(
        (h) =>
          (!category || h.categories.includes(category)) &&
          (!book || h.books.includes(book)) &&
          normalize(h.search).includes(normalize(q)),
      ) ?? [],
    [index, q, category, book],
  );
  useEffect(() => setPage(0), [q, category, book]);
  return (
    <>
      {id ? (
        <>
          <Title title={entry?.title || "الحديث النبوي"} />
          {entry ? (
            <HadithDetail entry={entry} />
          ) : index ? (
            <State error="الحديث غير موجود" />
          ) : (
            <State error={error} />
          )}
          <a href="#/hadith" className="button">
            العودة لفهرس الأحاديث
          </a>
        </>
      ) : (
        <>
          <Title
            title="الأحاديث النبوية"
            description="النصوص والشروح والفوائد والتخريج وأحكام المصدر."
          />
          <SearchBox
            value={q}
            onChange={setQ}
            label="ابحث في الحديث أو برقم المادة"
          />
          <div className="filters">
            <select
              aria-label="موضوع الحديث"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">كل الموضوعات</option>
              {[...new Set(index?.flatMap((h) => h.categories))]
                .sort()
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
            <select
              aria-label="كتاب الحديث"
              value={book}
              onChange={(e) => setBook(e.target.value)}
            >
              <option value="">كل الكتب</option>
              {[...new Set(index?.flatMap((h) => h.books))].sort().map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          {!index ? (
            <State error={error} />
          ) : (
            <>
              <p className="source">
                {arabic(filtered.length)} مادة حديثية مشروحة
              </p>
              {filtered.slice(page * 30, page * 30 + 30).map((h) => (
                <a
                  href={"#/hadith/" + h.id}
                  className="paper result"
                  key={h.id}
                >
                  <span className="badge">{h.grade}</span>
                  <h2>{h.title}</h2>
                  <p className="source">
                    {h.takhrij} · {h.categories.join("، ")}
                  </p>
                </a>
              ))}
              {filtered.length === 0 && (
                <p className="notice">لا توجد نتائج. جرّب كلمة أخرى.</p>
              )}
              <div className="pager">
                <button
                  disabled={page === 0}
                  onClick={() => {
                    setPage((p) => p - 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  السابق
                </button>
                <span>
                  {arabic(page + 1)} /{" "}
                  {arabic(Math.max(1, Math.ceil(filtered.length / 30)))}
                </span>
                <button
                  disabled={(page + 1) * 30 >= filtered.length}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  التالي
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
function HadithDetail({ entry }: { entry: HadithIndex }) {
  const { data, error } = useContent<Record<string, Hadith>>(
    `hadith/explained-${entry.chunk}.json`,
  );
  return data?.[entry.id] ? (
    <HadithText hadith={data[entry.id]} />
  ) : (
    <State error={error} />
  );
}
function Stories() {
  const { data, error } = useContent<Prophet[]>("prophets.json");
  const { data: images } =
    useContent<Record<string, { src: string }>>("story-images.json");
  const [q, setQ] = useState("");
  return (
    <>
      <Title
        title="قصص الأنبياء"
        description="قصص الأنبياء المذكورين في القرآن، مع الأدلة والتفسير."
      />
      <SearchBox
        value={q}
        onChange={setQ}
        label="ابحث باسم النبي أو موضوع القصة"
      />
      {!data ? (
        <State error={error} />
      ) : (
        <div className="story-grid">
          {data
            .filter((p) =>
              normalize(p.name + " " + p.summary + " " + p.theme).includes(
                normalize(q),
              ),
            )
            .map((p) => (
              <a
                className="paper story-card"
                href={"#/stories/" + p.slug}
                key={p.slug}
              >
                {images?.[p.slug] && (
                  <img
                    src={asset(images[p.slug].src)}
                    alt={p.theme}
                    loading="lazy"
                  />
                )}
                <div>
                  <h2>{p.name}</h2>
                  <p>{p.summary}</p>
                  <span className="source">اقرأ القصة والأدلة ←</span>
                </div>
              </a>
            ))}
        </div>
      )}
    </>
  );
}
function ProphetStory({ slug }: { slug: string }) {
  const { data, error } = useContent<Story>(`stories/${slug}.json`);
  return !data ? (
    <State error={error} />
  ) : (
    <>
      <Title title={data.name} description={data.summary}>
        <Favorite route={"/stories/" + slug} title={data.name} />
      </Title>
      <p className="notice">{data.limits}</p>
      <nav className="paper chapters" aria-label="فصول القصة">
        {data.chapters.map((c) => (
          <button
            key={c.id}
            onClick={() =>
              document
                .getElementById("chapter-" + c.id)
                ?.scrollIntoView({
                  behavior:
                    document.documentElement.classList.contains(
                      "motion-reduced",
                    ) || matchMedia("(prefers-reduced-motion: reduce)").matches
                      ? "auto"
                      : "smooth",
                })
            }
          >
            {c.title}
          </button>
        ))}
      </nav>
      {data.chapters.map((c) => (
        <section className="chapter" id={"chapter-" + c.id} key={c.id}>
          <h2>{c.title}</h2>
          <p className="lead">{c.lead}</p>
          {c.passages.map((passage, i) => (
            <div key={i}>
              <h3 className="passage-label">
                سورة {passage.surah} · الآيات {arabic(passage.start)}–
                {arabic(passage.end)}
              </h3>
              {passage.verses.map((v) => (
                <Ayah verse={v} key={v.id} />
              ))}
            </div>
          ))}
          {c.hadiths.map((h) => (
            <HadithText hadith={h} key={h.id} />
          ))}
        </section>
      ))}
      <a href="#/stories" className="button">
        فهرس قصص الأنبياء
      </a>
    </>
  );
}
function ShortTexts({ kind, id }: { kind: "athkar" | "duas"; id?: string }) {
  const { data, error } = useContent<{
    athkar_categories?: Category[];
    dua_categories?: Category[];
    athkar?: ShortText[];
    duas?: ShortText[];
  }>(`content-${kind}.json`);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    read("counts", {}),
  );
  const items = data?.[kind] ?? [];
  const categories =
    data?.[kind === "athkar" ? "athkar_categories" : "dua_categories"] ?? [];
  const date = new Date().toLocaleDateString("en-CA");
  const filtered = items.filter(
    (item) =>
      (!id || String(item.id) === id) &&
      (!category || String(item.category_id) === category) &&
      normalize(
        item.text +
          " " +
          (item.title ?? "") +
          " " +
          categories.find((c) => c.id === item.category_id)?.name,
      ).includes(normalize(q)),
  );
  return (
    <>
      <Title
        title={kind === "athkar" ? "الأذكار اليومية" : "الأدعية"}
        description="النصوص والمراجع محفوظة للقراءة دون اتصال."
      />
      {!id && (
        <>
          <SearchBox value={q} onChange={setQ} />
          <select
            className="category-select"
            aria-label="التصنيف"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </>
      )}
      {!data ? (
        <State error={error} />
      ) : (
        filtered.map((item) => {
          const key = `${date}:${item.id}`;
          const count = counts[key] ?? 0;
          const total = item.repeat_count ?? 1;
          return (
            <article key={item.id} className="paper">
              <div className="card-top">
                <span className="badge">
                  {categories.find((c) => c.id === item.category_id)?.name}
                </span>
                <Favorite
                  route={`/${kind}/${item.id}`}
                  title={item.title ?? item.text.slice(0, 80)}
                />
              </div>
              <p className="sacred">{item.text}</p>
              {item.description && (
                <p className="explanation">{item.description}</p>
              )}
              <p className="source">{item.reference}</p>
              {item.vocabulary && (
                <p className="explanation">{item.vocabulary}</p>
              )}
              {kind === "athkar" && (
                <div className="counter">
                  <button
                    onClick={() => {
                      const next = {
                        ...counts,
                        [key]: Math.min(total, count + 1),
                      };
                      setCounts(next);
                      save("counts", next);
                    }}
                    disabled={count >= total}
                  >
                    <Check size={18} />{" "}
                    {count >= total
                      ? "اكتمل الذكر"
                      : `التكرار ${arabic(count)} / ${arabic(total)}`}
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      const next = { ...counts, [key]: 0 };
                      setCounts(next);
                      save("counts", next);
                    }}
                  >
                    إعادة العد
                  </button>
                </div>
              )}
            </article>
          );
        })
      )}
    </>
  );
}
function Favorites() {
  const [, refresh] = useState(0);
  useEffect(() => {
    const listener = () => refresh((x) => x + 1);
    addEventListener("am-storage", listener);
    return () => removeEventListener("am-storage", listener);
  }, []);
  const items = bookmarks();
  return (
    <>
      <Title
        title="مفضلتي"
        description="محفوظة على هذا الجهاز، دون تسجيل دخول."
      />
      {items.length ? (
        items.map((item) => (
          <div className="paper list-item" key={item.route}>
            <a href={"#" + item.route}>{item.title}</a>
            <Favorite {...item} />
          </div>
        ))
      ) : (
        <p className="notice">
          اضغط علامة المفضلة بجوار آية أو حديث أو قصة لحفظها هنا.
        </p>
      )}
    </>
  );
}
function Preferences({
  dark,
  onDark,
  font,
  onFont,
  status,
  reduceMotion,
  onMotion,
}: {
  dark: boolean;
  onDark: () => void;
  font: number;
  onFont: (n: number) => void;
  status: string;
  reduceMotion: boolean;
  onMotion: () => void;
}) {
  const [reminders, update] = useState(reminderSettings);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const native = Capacitor.isNativePlatform();
  return (
    <>
      <Title title="الإعدادات والتذكيرات" />
      <section className="paper">
        <h2>القراءة</h2>
        <button className="secondary" onClick={onDark}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}{" "}
          {dark ? "الوضع النهاري" : "الوضع الليلي"}
        </button>
        <label className="setting">
          حجم خط النصوص{" "}
          <input
            type="range"
            min="24"
            max="42"
            aria-label="حجم خط النصوص"
            value={font}
            onChange={(e) => onFont(Number(e.target.value))}
          />
        </label>
        <label className="setting">
          <span>
            <Sparkles size={17} /> تقليل الحركة
          </span>
          <input type="checkbox" checked={reduceMotion} onChange={onMotion} />
        </label>
      </section>
      <section className="paper">
        <h2>تذكيرات القراءة اليومية</h2>
        <p>
          {native
            ? "تذكيرات محلية تعمل دون إنترنت بعد منح صلاحية الإشعارات. قد يؤخرها الهاتف في وضع توفير البطارية."
            : "نسخة الشاشة الرئيسية تحفظ المحتوى دون إنترنت. التذكيرات اليومية في الخلفية دون اتصال متاحة في تطبيق أندرويد الأصلي."}
        </p>
        {native && (
          <>
            <label className="setting">
              <span>تفعيل التذكيرات</span>
              <input
                type="checkbox"
                checked={reminders.enabled}
                onChange={(e) =>
                  update((r) => ({ ...r, enabled: e.target.checked }))
                }
              />
            </label>
            {reminderTypes.map((r, i) => (
              <label className="setting" key={r.id}>
                <span>{r.title}</span>
                <input
                  type="time"
                  aria-label={r.title}
                  value={reminders.times[i]}
                  onChange={(e) =>
                    update((old) => ({
                      ...old,
                      times: old.times.map((time, index) =>
                        index === i ? e.target.value : time,
                      ),
                    }))
                  }
                />
              </label>
            ))}
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setMessage("");
                try {
                  await setReminders(reminders);
                  setMessage(
                    reminders.enabled
                      ? "تم حفظ التذكيرات على الهاتف."
                      : "تم إيقاف التذكيرات.",
                  );
                } catch (e) {
                  setMessage((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "جارٍ الحفظ…" : "حفظ التذكيرات"}
            </button>
          </>
        )}
        {message && (
          <p role="status" className="notice">
            {message}
          </p>
        )}
      </section>
      <section className="paper">
        <h2>المكتبة على الجهاز</h2>
        <p role="status">{status}</p>
        {!native && (
          <>
            <p>
              انتظر اكتمال حفظ المكتبة قبل قطع الإنترنت. احتفظ بمساحة متاحة؛ قد
              يحذف المتصفح البيانات إذا أزلت التطبيق أو مسحت بيانات المواقع.
            </p>
            <button onClick={() => void setupOffline(setMessage)}>
              إعادة فحص الحفظ
            </button>
            <p>
              على iPhone: افتح هذه الصفحة في Safari، ثم مشاركة ← إضافة إلى
              الشاشة الرئيسية.
            </p>
          </>
        )}
      </section>
    </>
  );
}
const sections = [
  {
    route: "/quran",
    title: "القرآن الكريم",
    subtitle: "القرآن كامل مع التفسير الميسر",
    icon: BookOpen,
  },
  {
    route: "/hadith",
    title: "الأحاديث النبوية",
    subtitle: "نصوص وشروح وفوائد ومصادر",
    icon: ScrollText,
  },
  {
    route: "/stories",
    title: "قصص الأنبياء",
    subtitle: "فصول كاملة مع الأدلة والتفسير",
    icon: Sprout,
  },
  {
    route: "/athkar",
    title: "الأذكار اليومية",
    subtitle: "ذكر وعدّاد يحفظ تقدمك",
    icon: Sun,
  },
  {
    route: "/duas",
    title: "الأدعية",
    subtitle: "دعوات من الكتاب والسنة",
    icon: HandHeart,
  },
  {
    route: "/favorites",
    title: "مفضلتي",
    subtitle: "ما تحب العودة إليه",
    icon: Bookmark,
  },
];
function WelcomeArt() {
  return (
    <svg
      className="welcome-art"
      viewBox="0 0 220 250"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M30 232V110C30 66 64 26 110 10c46 16 80 56 80 100v122M46 230V114c0-36 25-70 64-87 39 17 64 51 64 87v116"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M67 164c17-7 31-6 43 3 12-9 26-10 43-3v48c-17-7-31-6-43 3-12-9-26-10-43-3v-48Zm43 3v48M77 178c10-3 17-2 24 2m-24 10c10-3 17-2 24 2m18-12c7-4 14-5 24-2m-24 14c7-4 14-5 24-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m110 77 5 13 14 5-14 5-5 13-5-13-14-5 14-5 5-13ZM55 46l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6m116 79 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6"
        fill="currentColor"
      />
      <circle
        cx="110"
        cy="95"
        r="37"
        stroke="currentColor"
        strokeDasharray="2 7"
      />
    </svg>
  );
}
function Dashboard({ status }: { status: string }) {
  const { data: info } = useContent<Info>("info.json");
  const { data: verses } = useContent<Verse[]>("quran/13.json");
  const tranquility = verses?.find((v) => v.ayah_number === 28);
  const saved = status.includes("جاهزة") || status.includes("داخل التطبيق");
  const percent = status.match(/(\d+)٪/)?.[1];
  const last = read<{ route: string; title: string; scroll: number } | null>(
    "last",
    null,
  );
  return (
    <>
      <section className="welcome">
        <WelcomeArt />
        <span className="hero-orbit" aria-hidden="true" />
        <Sparkles className="hero-spark" size={20} aria-hidden="true" />
        <div className="welcome-content">
          <span className="welcome-kicker">
            <span /> مساحة لقلبك، ورفيق ليومك
          </span>
          <h1>أنا مسلم</h1>
          <p>
            لحظات من السكينة،
            <br />
            وهديٌ يرافقك أينما كنت.
          </p>
          <a className="button gold" href="#/quran">
            <BookOpen size={19} /> ابدأ وردك اليوم <ArrowLeft size={17} />
          </a>
          <span className="hero-footnote">كل رحلة عظيمة تبدأ بآية</span>
        </div>
      </section>
      <div
        className={"offline-badge cache-state " + (saved ? "ready" : "saving")}
        role="status"
      >
        {saved ? <CheckCircle2 size={17} /> : <WifiOff size={17} />}
        <span>{status}</span>
        {!saved && percent && (
          <span className="cache-track" aria-hidden="true">
            <span style={{ width: percent + "%" }} />
          </span>
        )}
      </div>
      {last && (
        <button
          className="paper resume"
          onClick={() => {
            save("resume-request", last);
            go(last.route);
          }}
        >
          <span className="resume-icon">
            <BookOpen size={22} />
          </span>
          <span>
            تابع القراءة<small>{last.title}</small>
          </span>
          <ArrowLeft size={18} />
        </button>
      )}
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">على مهل، وبقلب حاضر</span>
          <h2>أبواب الخير</h2>
        </div>
        <a href="#/favorites">
          <Bookmark size={15} /> مفضلتي
        </a>
      </div>
      <div className="section-grid">
        {sections.map((s) => (
          <a className="paper section-card" href={"#" + s.route} key={s.route}>
            <span className="section-icon">
              <s.icon size={25} />
            </span>
            <ArrowLeft className="section-arrow" size={17} aria-hidden="true" />
            <h2>{s.title}</h2>
            <p>{s.subtitle}</p>
          </a>
        ))}
      </div>
      {tranquility && (
        <section className="paper tranquility-card">
          <div className="tranquility-label">
            <Sparkles size={17} />
            <span>آية تطمئن القلب</span>
            <span className="verse-ornament" aria-hidden="true">
              ۞
            </span>
          </div>
          <p className="sacred">{tranquility.text_arabic}</p>
          <div className="tranquility-bottom">
            <span>سورة الرعد · الآية ٢٨</span>
            <a href="#/quran/13?ayah=28">
              اقرأ التفسير <ArrowLeft size={15} />
            </a>
          </div>
        </section>
      )}
      {info && (
        <div className="library-stats">
          <div>
            <strong>{arabic(info.surahs)}</strong>
            <span>سورة وتفسير</span>
          </div>
          <div>
            <strong>{arabic(info.hadiths)}</strong>
            <span>مادة حديثية</span>
          </div>
          <div>
            <strong>{arabic(info.stories)}</strong>
            <span>قصة نبي</span>
          </div>
        </div>
      )}
      <a href="#/settings" className="paper reminder-banner">
        <span className="reminder-icon">
          <Bell size={22} />
        </span>
        <span>
          اجعل للقراءة موعدًا <small>قليلٌ دائم، وأثرٌ يبقى</small>
        </span>
        <ArrowLeft size={18} />
      </a>
      <p className="source">
        هذا التطبيق يضم محتوى الموقع الحالي ومصادره، ولا يدّعي جمع جميع الأحاديث
        النبوية.
      </p>
    </>
  );
}
const navigation = [
  { route: "/", title: "الرئيسية", icon: Home },
  { route: "/quran", title: "القرآن", icon: BookOpen },
  { route: "/hadith", title: "الأحاديث", icon: ScrollText },
  { route: "/stories", title: "القصص", icon: Sprout },
  { route: "/settings", title: "تذكيرات", icon: Bell },
];
export function App() {
  const route = useRoute();
  const path = route.split("?")[0];
  const params = new URLSearchParams(route.split("?")[1]);
  const [section, id] = path.split("/").filter(Boolean);
  const activeTab = navigation.findIndex(
    (n) =>
      path === n.route || (n.route !== "/" && path.startsWith(n.route + "/")),
  );
  const { data: libraryInfo } = useContent<Info>("info.json");
  const [dark, setDark] = useState(() => read("dark", false));
  const [font, setFont] = useState(() => read("font", 30));
  const [reduceMotion, setReduceMotion] = useState(() =>
    read("reduce-motion", false),
  );
  const [status, setStatus] = useState("جارٍ فحص المكتبة المحفوظة…");
  useEffect(() => {
    void setupOffline(setStatus);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.setProperty("--sacred-size", font + "px");
    document.documentElement.classList.toggle("motion-reduced", reduceMotion);
  }, [dark, font, reduceMotion]);
  useEffect(() => {
    if (!id || !["quran", "hadith", "stories"].includes(section)) return;
    let timer: ReturnType<typeof setTimeout>;
    const listener = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () =>
          save("last", {
            route,
            title: document.querySelector("h1")?.textContent ?? "تابع القراءة",
            scroll: window.scrollY,
          }),
        250,
      );
    };
    addEventListener("scroll", listener, { passive: true });
    const resume = read<{ route: string; scroll: number } | null>(
      "resume-request",
      null,
    );
    if (resume?.route === route) {
      save("resume-request", null);
      setTimeout(() => window.scrollTo(0, resume.scroll), 400);
    }
    return () => {
      clearTimeout(timer);
      removeEventListener("scroll", listener);
    };
  }, [route, section, id]);
  let body: ReactNode;
  switch (section) {
    case "quran":
      body = id ? <Quran key={id} id={id} params={params} /> : <Surahs />;
      break;
    case "hadith":
      body = <Hadiths key={id ?? "index"} id={id} />;
      break;
    case "stories":
      body = id ? <ProphetStory slug={id} /> : <Stories />;
      break;
    case "athkar":
    case "duas":
      body = <ShortTexts key={section + (id ?? "")} kind={section} id={id} />;
      break;
    case "favorites":
      body = <Favorites />;
      break;
    case "settings":
      body = (
        <Preferences
          dark={dark}
          onDark={() => {
            setDark((d) => !d);
            save("dark", !dark);
          }}
          font={font}
          onFont={(n) => {
            setFont(n);
            save("font", n);
          }}
          status={status}
          reduceMotion={reduceMotion}
          onMotion={() => {
            setReduceMotion(!reduceMotion);
            save("reduce-motion", !reduceMotion);
          }}
        />
      );
      break;
    default:
      body = <Dashboard status={status} />;
  }
  return (
    <>
      <header className="app-header">
        <a href="#/" className="brand">
          <img
            src={asset("logo.webp")}
            width="48"
            height="48"
            alt="شعار أنا مسلم"
          />
          <span>
            أنا مسلم<small>إيمان يرافق يومك</small>
          </span>
        </a>
        <div>
          {section && (
            <button
              className="icon-button"
              aria-label="العودة"
              onClick={() => (history.length > 1 ? history.back() : go("/"))}
            >
              <ArrowRight size={20} />
            </button>
          )}
          <a href="#/settings" className="icon-button" aria-label="الإعدادات">
            <Settings size={21} />
          </a>
        </div>
      </header>
      <main className="app-main" id="main">
        <div className="route-scene" key={path}>
          {body}
        </div>
        <footer className="app-footer">
          صُنع بمحبة ·{" "}
          <a href="https://hogz.vercel.app" target="_blank" rel="noreferrer">
            HGZ
          </a>
          {libraryInfo && (
            <span className="app-version">الإصدار {libraryInfo.version}</span>
          )}
        </footer>
      </main>
      <nav className="bottom-nav" aria-label="التنقل الرئيسي">
        <span
          className="nav-indicator"
          aria-hidden="true"
          style={{
            insetInlineStart: `calc(${Math.max(activeTab, 0) * 20}% + 8px)`,
            opacity: activeTab < 0 ? 0 : 1,
          }}
        />
        {navigation.map((n) => (
          <a
            key={n.route}
            href={"#" + n.route}
            aria-current={
              path === n.route ||
              (n.route !== "/" && path.startsWith(n.route + "/"))
                ? "page"
                : undefined
            }
            className={
              path === n.route ||
              (n.route !== "/" && path.startsWith(n.route + "/"))
                ? "active"
                : ""
            }
          >
            <n.icon size={21} />
            <span>{n.title}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
