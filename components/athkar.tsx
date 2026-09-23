'use client';

import { FavoriteButton } from './favorite-button';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check, RotateCcw, ExternalLink, ArrowRight, Search,
  Sun, Moon, Bed, Sunrise, Sparkles, Clock,
  Droplets, Home, DoorOpen, Volume2, Shirt,
  Utensils, Plane, HeartPulse, CloudRain, Users, Baby,
  BookOpen, Shield, Star, HandHeart,
  Cloud, Wind, MapPin, ShoppingBag, Eye,
  AlertCircle, Heart, Coins, Skull, Dog,
  Sparkle, HelpingHand, Flame, RefreshCw,
} from 'lucide-react';
import athkarContent from '@/data/content-athkar.json';
import { arabic } from './ui';
import { useContent } from '@/lib/use-content';
import { dayKey, loadCounts, saveCounts } from '@/lib/storage';

// ============================================================
// خريطة الأيقونات حسب اسم التصنيف
// ============================================================
const iconMap: Record<string, any> = {
  'أذكار الصباح': Sun,
  'أذكار المساء': Moon,
  'أذكار النوم': Bed,
  'أذكار الاستيقاظ من النوم': Sunrise,
  'الأذكار بعد السلام من الصلاة': Sparkles,
  'الذكر قبل الوضوء': Droplets,
  'الذكر بعد الفراغ من الوضوء': Droplets,
  'الذكر عند دخول المنزل': Home,
  'الذكر عند الخروج من المنزل': Home,
  'دعاء دخول المسجد': DoorOpen,
  'دعاء الخروج من المسجد': DoorOpen,
  'دعاء دخول الخلاء': DoorOpen,
  'دعاء الخروج من الخلاء': DoorOpen,
  'أذكار الآذان': Volume2,
  'دعاء لبس الثوب': Shirt,
  'دعاء لبس الثوب الجديد': Shirt,
  'ما يقول إذا وضع الثوب': Shirt,
  'الدعاء قبل الطعام': Utensils,
  'الدعاء عند الفراغ من الطعام': Utensils,
  'الدعاء إذا أفطر عند أهل بيت': Utensils,
  'دعاء الصائم إذا حضر الطعام ولم يفطر': Utensils,
  'دعاء الضيف لصاحب الطعام': Utensils,
  'دعاء السفر': Plane,
  'دعاء الركوب': Plane,
  'الدعاء إذا تعس المركوب': Plane,
  'دعاء المسافر إذا أسحر': Plane,
  'دعاء المسافر للمقيم': Plane,
  'دعاء المقيم للمسافر': Plane,
  'ذكر الرجوع من السفر': Plane,
  'التكبير و التسبيح في سير السفر': Plane,
  'الدعاء إذا نزل مترلا في سفر أو غيره': Plane,
  'دعاء دخول القرية أو البلدة': MapPin,
  'دعاء دخول السوق': ShoppingBag,
  'دعاء الهم والحزن': HeartPulse,
  'دعاء الكرب': HeartPulse,
  'الدعاء حينما يقع ما لا يرضاه أو غلب على أمره': HeartPulse,
  'دعاء من أصيب بمصيبة': HeartPulse,
  'دعاء من استصعب عليه أمر': HeartPulse,
  'الدعاء للمريض في عيادته': HeartPulse,
  'دعاء المريض الذي يئس من حياته': HeartPulse,
  'فضل عيادة المريض': HeartPulse,
  'ما يقول من أحس وجعا في جسده': HeartPulse,
  'الدعاء إذا نزل المطر': CloudRain,
  'الذكر بعد نزول المطر': CloudRain,
  'دعاء الرعد': Cloud,
  'دعاء الريح': Wind,
  'من أدعية الاستسقاء': CloudRain,
  'من أدعية الاستصحاء': Sun,
  'دعاء رؤية الهلال': Moon,
  'الدعاء عند رؤية باكورة الثمر': Sparkle,
  'كفارة اﻟﻤﺠلس': Users,
  'ما يقال في اﻟﻤﺠلس': Users,
  'إفشاء السلام': Users,
  'دعاء العطاس': Users,
  'ما يقال للكافر إذا عطس فحمد الله': Users,
  'كيف يرد السلام على الكافر إذا سلم': Users,
  'الرقية الشرعية من السنة النبوية': Shield,
  'الرقية الشرعية من القرآن الكريم': Shield,
  'ما يعصم الله به من الدجال': Shield,
  'ما يعوذ به الأولاد': Shield,
  'دعاء الخوف من الشرك': Shield,
  'دعاء طرد الشيطان و وساوسه': Shield,
  'ما يقول لرد كيد مردة الشياطين': Shield,
  'دعاء من أصابه وسوسة في الإيمان': Shield,
  'دعاء الوسوسة في الصلاة و القراءة': Shield,
  'دعاء من خشي أن يصيب شيئا بعينه': Eye,
  'دعاء كراهية الطيرة': AlertCircle,
  'ما يقول من خاف قوما': Shield,
  'دعاء لقاء العدو و ذي السلطان': Shield,
  'الدعاء على العدو': Shield,
  'دعاء الغضب': Flame,
  'دعاء الفزع في النوم و من بلي بالوحشة': Moon,
  'ما يقال عند الفزع': AlertCircle,
  'دعاء نباح الكلب بالليل': Dog,
  'الدعاء عند سماع صياح الديك ونهيق الحمار': Volume2,
  'الدعاء إذا تقلب في الليل': Bed,
  'من تعار من الليل': Bed,
  'ما يفعل من رأى الرؤيا أو الحلم في النوم': Bed,
  'دعاء الاستفتاح': Sparkles,
  'دعاء الركوع': Sparkles,
  'دعاء الرفع من الركوع': Sparkles,
  'دعاء السجود': Sparkles,
  'دعاء سجود التلاوة': Sparkles,
  'دعاء الجلسة بين السجدتين': Sparkles,
  'التشهد': Star,
  'الصلاة على النبي بعد التشهد': Star,
  'الدعاء بعد التشهد الأخير قبل السلام': Star,
  'فضل الصلاة على النبي صلى الله عليه و سلم': Star,
  'الذكر عقب السلام من الوتر': Star,
  'دعاء قنوت الوتر': Star,
  'دعاء صلاة الاستخارة': Star,
  'كيف كان النبي يسبح؟': Sparkles,
  'التسبيح، التحميد، التهليل، التكبير': Sparkles,
  'الدعاء للمتزوج': Heart,
  'الدعاء قبل إتيان الزوجة': Heart,
  'دعاء المتزوج و شراء الدابة': Heart,
  'ﺗﻬنئة المولود له وجوابه': Baby,
  'الدعاء لمن صنع إليك معروفا': HelpingHand,
  'الدعاء لمن قال إني أحبك في الله': Heart,
  'الدعاء لمن قال بارك الله فيك': Heart,
  'الدعاء لمن قال غفر الله لك': Heart,
  'الدعاء لمن سببته': Heart,
  'الدعاء لمن عرض عليك ماله': Coins,
  'الدعاء لمن أقرض عند القضاء': Coins,
  'دعاء قضاء الدين': Coins,
  'ما يقول المسلم إذا زكي': Heart,
  'ما يقول المسلم إذا مدح المسلم': Heart,
  'دعاء التعجب والأمر السار': Sparkle,
  'ما يفعل من أتاه أمر يسره': Sparkle,
  'ما يقول من أتاه أمر يسره أو يكرهه': Sparkle,
  'التعريض بالدعاء لطلب الطعام أو الشراب': Utensils,
  'الدعاء يوم عرفة': Star,
  'الدعاء للميت في الصلاة عليه': Skull,
  'الدعاء للفرط في الصلاة عليه': Skull,
  'الدعاء عند إدخال الميت القبر': Skull,
  'الدعاء بعد دفن الميت': Skull,
  'الدعاء عند إغماض الميت': Skull,
  'تلقين المحتضر': Skull,
  'دعاء زيارة القبور': Skull,
  'دعاء التعزية': Heart,
  'دعاء الوقوف على الصفا والمروة': MapPin,
  'الدعاء بين الركن اليماني والحجر الأسود': MapPin,
  'التكبير إذا أتى الركن الأسود': MapPin,
  'التكبير عند رمي الجمار مع كل حصاة': MapPin,
  'الذكر عند المشعر الحرام': MapPin,
  'كيف يلبي المحرم في الحج أو العمرة ؟': MapPin,
  'الاستغفار و التوبة': Heart,
  'ما يقول ويفعل من أذنب ذنبا': Heart,
  'أماكن وأوقات إجابة الدعاء ': Star,
  'من أنواع الخير والآداب الجامعة': Sparkle,
  'دعاء من رأى مبتلى': Eye,
  'ما يقول عند الذبح أو النحر': Flame,
};

const getIcon = (name: string) => iconMap[name] || Sparkles;

// ============================================================
// مجموعات التصنيفات
// ============================================================
const CATEGORY_GROUPS: { title: string; icon: any; names: string[] }[] = [
  {
    title: 'أذكار اليوم والليلة',
    icon: Clock,
    names: [
      'أذكار الصباح',
      'أذكار المساء',
      'أذكار النوم',
      'أذكار الاستيقاظ من النوم',
      'دعاء رؤية الهلال',
      'الدعاء إذا تقلب في الليل',
      'من تعار من الليل',
      'ما يفعل من رأى الرؤيا أو الحلم في النوم',
      'دعاء الفزع في النوم و من بلي بالوحشة',
      'ما يقال عند الفزع',
    ],
  },
  {
    title: 'الصلاة والعبادة',
    icon: Sparkles,
    names: [
      'الأذكار بعد السلام من الصلاة',
      'الذكر قبل الوضوء',
      'الذكر بعد الفراغ من الوضوء',
      'دعاء الاستفتاح',
      'دعاء الركوع',
      'دعاء الرفع من الركوع',
      'دعاء السجود',
      'دعاء سجود التلاوة',
      'دعاء الجلسة بين السجدتين',
      'التشهد',
      'الصلاة على النبي بعد التشهد',
      'الدعاء بعد التشهد الأخير قبل السلام',
      'فضل الصلاة على النبي صلى الله عليه و سلم',
      'الذكر عقب السلام من الوتر',
      'دعاء قنوت الوتر',
      'دعاء صلاة الاستخارة',
      'كيف كان النبي يسبح؟',
      'التسبيح، التحميد، التهليل، التكبير',
    ],
  },
  {
    title: 'الطعام واللباس',
    icon: Utensils,
    names: [
      'الدعاء قبل الطعام',
      'الدعاء عند الفراغ من الطعام',
      'الدعاء إذا أفطر عند أهل بيت',
      'الدعاء عند إفطار الصائم',
      'دعاء الصائم إذا حضر الطعام ولم يفطر',
      'دعاء الضيف لصاحب الطعام',
      'التعريض بالدعاء لطلب الطعام أو الشراب',
      'دعاء لبس الثوب',
      'دعاء لبس الثوب الجديد',
      'ما يقول إذا وضع الثوب',
    ],
  },
  {
    title: 'السفر والتنقل',
    icon: Plane,
    names: [
      'دعاء السفر',
      'دعاء الركوب',
      'الدعاء إذا تعس المركوب',
      'دعاء المسافر إذا أسحر',
      'دعاء المسافر للمقيم',
      'دعاء المقيم للمسافر',
      'ذكر الرجوع من السفر',
      'التكبير و التسبيح في سير السفر',
      'الدعاء إذا نزل مترلا في سفر أو غيره',
      'دعاء دخول القرية أو البلدة',
      'دعاء دخول السوق',
    ],
  },
  {
    title: 'المنزل والمسجد',
    icon: Home,
    names: [
      'الذكر عند دخول المنزل',
      'الذكر عند الخروج من المنزل',
      'دعاء دخول المسجد',
      'دعاء الخروج من المسجد',
      'دعاء الذهاب إلى المسجد',
      'دعاء دخول الخلاء',
      'دعاء الخروج من الخلاء',
      'أذكار الآذان',
    ],
  },
  {
    title: 'الهم والحزن والشفاء',
    icon: HeartPulse,
    names: [
      'دعاء الهم والحزن',
      'دعاء الكرب',
      'الدعاء حينما يقع ما لا يرضاه أو غلب على أمره',
      'دعاء من أصيب بمصيبة',
      'دعاء من استصعب عليه أمر',
      'الدعاء للمريض في عيادته',
      'دعاء المريض الذي يئس من حياته',
      'فضل عيادة المريض',
      'ما يقول من أحس وجعا في جسده',
      'دعاء قضاء الدين',
    ],
  },
  {
    title: 'الرقية والحماية',
    icon: Shield,
    names: [
      'الرقية الشرعية من السنة النبوية',
      'الرقية الشرعية من القرآن الكريم',
      'ما يعصم الله به من الدجال',
      'ما يعوذ به الأولاد',
      'دعاء الخوف من الشرك',
      'دعاء طرد الشيطان و وساوسه',
      'ما يقول لرد كيد مردة الشياطين',
      'دعاء من أصابه وسوسة في الإيمان',
      'دعاء الوسوسة في الصلاة و القراءة',
      'دعاء من خشي أن يصيب شيئا بعينه',
      'دعاء كراهية الطيرة',
      'ما يقول من خاف قوما',
      'دعاء لقاء العدو و ذي السلطان',
      'الدعاء على العدو',
      'دعاء الغضب',
      'دعاء نباح الكلب بالليل',
      'الدعاء عند سماع صياح الديك ونهيق الحمار',
    ],
  },
  {
    title: 'الطبيعة والجو',
    icon: CloudRain,
    names: [
      'الدعاء إذا نزل المطر',
      'الذكر بعد نزول المطر',
      'دعاء الرعد',
      'دعاء الريح',
      'من أدعية الاستسقاء',
      'من أدعية الاستصحاء',
      'الدعاء عند رؤية باكورة الثمر',
    ],
  },
  {
    title: 'المجالس والسلام',
    icon: Users,
    names: [
      'كفارة اﻟﻤﺠلس',
      'ما يقال في اﻟﻤﺠلس',
      'إفشاء السلام',
      'دعاء العطاس',
      'ما يقال للكافر إذا عطس فحمد الله',
      'كيف يرد السلام على الكافر إذا سلم',
      'ما يقول الصائم إذا سابه أحد',
    ],
  },
  {
    title: 'المناسبات والتهاني',
    icon: Heart,
    names: [
      'الدعاء للمتزوج',
      'الدعاء قبل إتيان الزوجة',
      'دعاء المتزوج و شراء الدابة',
      'ﺗﻬنئة المولود له وجوابه',
      'الدعاء لمن صنع إليك معروفا',
      'الدعاء لمن قال إني أحبك في الله',
      'الدعاء لمن قال بارك الله فيك',
      'الدعاء لمن قال غفر الله لك',
      'الدعاء لمن سببته',
      'الدعاء لمن عرض عليك ماله',
      'الدعاء لمن أقرض عند القضاء',
      'ما يقول المسلم إذا زكي',
      'ما يقول المسلم إذا مدح المسلم',
      'دعاء التعجب والأمر السار',
      'ما يفعل من أتاه أمر يسره',
      'ما يقول من أتاه أمر يسره أو يكرهه',
      'الدعاء يوم عرفة',
    ],
  },
  {
    title: 'الجنائز',
    icon: Skull,
    names: [
      'الدعاء للميت في الصلاة عليه',
      'الدعاء للفرط في الصلاة عليه',
      'الدعاء عند إدخال الميت القبر',
      'الدعاء بعد دفن الميت',
      'الدعاء عند إغماض الميت',
      'تلقين المحتضر',
      'دعاء زيارة القبور',
      'دعاء التعزية',
    ],
  },
  {
    title: 'الحج والعمرة',
    icon: MapPin,
    names: [
      'دعاء الوقوف على الصفا والمروة',
      'الدعاء بين الركن اليماني والحجر الأسود',
      'التكبير إذا أتى الركن الأسود',
      'التكبير عند رمي الجمار مع كل حصاة',
      'الذكر عند المشعر الحرام',
      'كيف يلبي المحرم في الحج أو العمرة ؟',
    ],
  },
  {
    title: 'التوبة والاستغفار',
    icon: RefreshCw,
    names: ['الاستغفار و التوبة', 'ما يقول ويفعل من أذنب ذنبا'],
  },
  {
    title: 'أذكار متنوعة',
    icon: Sparkle,
    names: [
      'أماكن وأوقات إجابة الدعاء ',
      'من أنواع الخير والآداب الجامعة',
      'دعاء من رأى مبتلى',
      'ما يقول عند الذبح أو النحر',
    ],
  },
];

// خريطة سريعة: اسم التصنيف → عنوان المجموعة
const categoryToGroupTitle = new Map<string, string>();
CATEGORY_GROUPS.forEach((g) =>
  g.names.forEach((n) => categoryToGroupTitle.set(n, g.title))
);

// ============================================================
// نوع الأداة
// ============================================================
type ToolContext = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => Promise<object>;
    },
    options: { signal: AbortSignal }
  ) => void | Promise<void>;
};

// ============================================================
// المكوّن
// ============================================================
export function Athkar() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const countsRef = useRef(counts);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const keyRef = useRef('');

  const { data, warning } = useContent('athkar', athkarContent.athkar);
  const { data: categories } = useContent(
    'athkar_categories',
    athkarContent.athkar_categories
  );

  // ===== تحميل العدادات =====
  useEffect(() => {
    const load = () => {
      const k = 'am-athkar-' + dayKey();
      if (k !== keyRef.current) {
        keyRef.current = k;
        const c = loadCounts(k);
        countsRef.current = c;
        setCounts(c);
      }
    };
    load();
    setReady(true);
    const id = setInterval(load, 30000);
    const sync = (e: StorageEvent) => {
      if (e.key === keyRef.current) {
        const c = loadCounts(keyRef.current);
        countsRef.current = c;
        setCounts(c);
      }
    };
    window.addEventListener('storage', sync);
    return () => {
      clearInterval(id);
      window.removeEventListener('storage', sync);
    };
  }, []);

  function commit(next: Record<string, number>) {
    countsRef.current = next;
    setCounts(next);
    if (!saveCounts(keyRef.current, next)) setStorageError(true);
  }

  function increment(id: number) {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    const k = 'am-athkar-' + dayKey();
    if (k !== keyRef.current) {
      keyRef.current = k;
      countsRef.current = loadCounts(k);
    }
    const previous = countsRef.current;
    const count = Math.min((previous[id] || 0) + 1, item.repeat_count);
    commit({ ...previous, [id]: count });
    return count;
  }

  // ===== إحصاءات كل تصنيف =====
  const categoryStats = useMemo(() => {
    const map: Record<number, { total: number; complete: number }> = {};
    categories.forEach((c) => {
      const catItems = data.filter((d) => d.category_id === c.id);
      const done = catItems.filter(
        (d) => (counts[d.id] || 0) >= d.repeat_count
      ).length;
      map[c.id] = { total: catItems.length, complete: done };
    });
    return map;
  }, [categories, data, counts]);

  // ===== تجميع التصنيفات =====
  const groupedCategories = useMemo(() => {
    const q = search.trim();
    const filteredCats = q
      ? categories.filter((c) => c.name.includes(q))
      : categories;

    // ضع كل تصنيف في مجموعته
    const buckets = new Map<string, typeof categories>();
    filteredCats.forEach((c) => {
      const title = categoryToGroupTitle.get(c.name) || 'أذكار متنوعة';
      if (!buckets.has(title)) buckets.set(title, []);
      buckets.get(title)!.push(c);
    });

    // أعِد الترتيب حسب ترتيب CATEGORY_GROUPS
    return CATEGORY_GROUPS.filter((g) => buckets.has(g.title)).map((g) => ({
      title: g.title,
      icon: g.icon,
      categories: buckets.get(g.title)!,
    }));
  }, [categories, search]);

  // ===== التصنيف المفتوح =====
  const currentCategory =
    selectedCategory !== null
      ? categories.find((c) => c.id === selectedCategory) ?? null
      : null;

  const items =
    selectedCategory !== null
      ? data.filter((d) => d.category_id === selectedCategory)
      : [];
  const complete = items.filter(
    (d) => (counts[d.id] || 0) >= d.repeat_count
  ).length;

  // ===== تسجيل الأداة =====
  useEffect(() => {
    const context = (document as Document & { modelContext?: ToolContext })
      .modelContext;
    if (!context?.registerTool || !ready) return;
    const lifetime = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'increment_dhikr',
            title: 'تسجيل تكرار ذكر',
            description:
              'يسجّل تكرارًا واحدًا لذكر قرأه المستخدم، ويحدّث عداده المرئي وتقدّم اليوم على الجهاز.',
            inputSchema: {
              type: 'object',
              properties: { id: { type: 'integer' } },
              required: ['id'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute: async (input: unknown) => {
              if (
                !input ||
                typeof input !== 'object' ||
                !('id' in input) ||
                typeof (input as any).id !== 'number' ||
                !Number.isInteger((input as any).id) ||
                !data.some((d) => d.id === (input as any).id)
              ) {
                throw Error('معرّف الذكر غير صالح');
              }
              const item = data.find((d) => d.id === (input as any).id)!;
              setSelectedCategory(item.category_id);
              const count = increment(item.id);
              await new Promise<void>((resolve) =>
                requestAnimationFrame(() => resolve())
              );
              return { id: item.id, count, total: item.repeat_count };
            },
          },
          { signal: lifetime.signal }
        )
      ).catch(() => {});
    } catch {}
    return () => lifetime.abort();
  }, [ready, data]);

  // ============================================================
  // واجهة 1: الأصناف
  // ============================================================
  if (selectedCategory === null) {
    return (
      <section className="container content-section">
        <div className="athkar-search-wrapper">
          <Search size={18} className="athkar-search-icon" />
          <input
            type="search"
            className="athkar-search"
            placeholder="ابحث عن صنف... (مثال: الصباح، النوم، السفر)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {groupedCategories.length === 0 ? (
          <p className="notice">لا توجد أصناف تطابق بحثك.</p>
        ) : (
          groupedCategories.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div className="athkar-group" key={group.title}>
                <div className="group-header">
                  <span className="group-icon">
                    <GroupIcon size={18} strokeWidth={1.8} />
                  </span>
                  <h3>{group.title}</h3>
                  <span className="group-count">
                    {arabic(group.categories.length)}
                  </span>
                </div>

                <div className="athkar-categories-grid">
                  {group.categories.map((c) => {
                    const Icon = getIcon(c.name);
                    const stats = categoryStats[c.id] || {
                      total: 0,
                      complete: 0,
                    };
                    const percent =
                      stats.total > 0
                        ? Math.round((stats.complete / stats.total) * 100)
                        : 0;
                    const isComplete =
                      stats.total > 0 && stats.complete === stats.total;

                    return (
                      <button
                        key={c.id}
                        className={
                          'athkar-category-card' +
                          (isComplete ? ' is-complete' : '')
                        }
                        onClick={() => {
                          setSelectedCategory(c.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <span className="icon-wrapper">
                          <Icon size={22} strokeWidth={1.7} />
                        </span>
                        <h3>{c.name}</h3>
                        <div className="cat-meta">
                          <span>{arabic(stats.total)} أذكار</span>
                          <span className={isComplete ? 'done' : ''}>
                            {arabic(stats.complete)} / {arabic(stats.total)}
                          </span>
                        </div>
                        <div className="mini-progress">
                          <div style={{ width: percent + '%' }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </section>
    );
  }

  // ============================================================
  // واجهة 2: أذكار التصنيف
  // ============================================================
  const HeaderIcon = currentCategory
    ? getIcon(currentCategory.name)
    : Sparkles;

  return (
    <section className="container content-section">
      <button
        className="athkar-back"
        onClick={() => {
          setSelectedCategory(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ArrowRight size={18} />
        رجوع إلى الأصناف
      </button>

      <div className="athkar-header">
        <span className="icon-wrapper">
          <HeaderIcon size={26} strokeWidth={1.5} />
        </span>
        <div>
          <h2>{currentCategory?.name}</h2>
          <p>
            {arabic(complete)} من {arabic(items.length)} أذكار مكتملة اليوم
          </p>
        </div>
      </div>

      <div className="reading-width">
        <div className="progress-label">
          <span>تقدّمك اليوم</span>
          <button
            className="reset-button"
            suppressHydrationWarning
            onClick={() => {
              const next = { ...countsRef.current };
              items.forEach((d) => delete next[d.id]);
              commit(next);
            }}
          >
            <RotateCcw size={14} />
            بدء جولة جديدة
          </button>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="تقدم الأذكار"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={complete}
        >
          <div
            style={{
              width:
                (items.length ? (complete / items.length) * 100 : 0) + '%',
            }}
          />
        </div>

        <p className="source-line" style={{ marginBottom: 25 }}>
          اضغط العداد بعد كل تكرار. يُحفظ تقدّمك على هذا الجهاز ويتجدّد مع بداية
          اليوم.
        </p>

        {warning && <p className="notice">{warning}</p>}
        {storageError && (
          <p className="notice error-notice" role="status">
            التخزين غير متاح في متصفحك؛ سيبقى تقدّمك لهذه الجلسة فقط.
          </p>
        )}
        {complete === items.length && items.length > 0 && (
          <p className="notice" role="status">
            أتممت أذكار هذا القسم. تقبّل الله منك.
          </p>
        )}

        {items.map((d, i) => {
          const n = Math.min(counts[d.id] || 0, d.repeat_count);
          const done = n >= d.repeat_count;
          return (
            <article
              key={d.id}
              className={'content-card ' + (done ? 'dhikr-done' : '')}
            >
              {/* ============ رأس البطاقة ============ */}
              <div className="card-top">
                <span>الذكر {arabic(i + 1)}</span>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <span className="badge">
                    {done
                      ? 'اكتمل'
                      : arabic(d.repeat_count) +
                        ' ' +
                        (d.repeat_count === 1 ? 'مرة' : 'مرات')}
                  </span>
                  <FavoriteButton
                    itemType="dhikr"
                    itemId={d.id}
                    itemLabel={`ذكر من ${currentCategory?.name ?? 'الأذكار'}`}
                    itemPreview={d.text?.slice(0, 100)}
                    itemMeta={{
                      repeat_count: d.repeat_count,
                      category_id: d.category_id,
                      reference: d.reference,
                    }}
                    size="sm"
                    variant="icon"
                  />
                </div>
              </div>

              {/* ============ نص الذكر ============ */}
              <p className="sacred">{d.text}</p>

              {/* ============ المصدر ============ */}
              <a
                className="source-line"
                href={d.source_url}
                target="_blank"
                rel="noreferrer"
              >
                {d.reference}
                <ExternalLink size={12} />
              </a>

              {/* ============ الأزرار ============ */}
              <div className="card-actions">
                <button
                  className={
                    'button count-button ' +
                    (done ? 'secondary' : 'primary')
                  }
                  onClick={() => increment(d.id)}
                  disabled={done}
                  suppressHydrationWarning
                  aria-label={
                    done
                      ? 'اكتمل هذا الذكر'
                      : 'تسجيل تكرار للذكر ' + arabic(i + 1)
                  }
                >
                  {done ? <Check size={18} /> : <span>اضغط للتسبيح</span>}
                  <strong>
                    {arabic(n)} / {arabic(d.repeat_count)}
                  </strong>
                </button>

                {n > 0 && (
                  <button
                    className="reset-button"
                    onClick={() =>
                      commit({ ...countsRef.current, [d.id]: 0 })
                    }
                  >
                    <RotateCcw size={14} />
                    إعادة
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}