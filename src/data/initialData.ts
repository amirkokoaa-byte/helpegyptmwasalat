import { TransportMode, TransitLine, Station, FareBracket } from '../types/transit';

/**
 * قاعدة البيانات الرسمية لوسائل المواصلات الحديثة في مصر
 * مطابقة تماماً للمحطات والترتيب الحقيقي المعتمد
 */
export const transportationData = {
  highSpeedTrain: {
    id: "high_speed_train",
    name: "القطار الكهربائي السريع",
    stations: [
      "العين السخنة", "العاصمة الإدارية الجديدة", "15 مايو", "محمد نجيب", 
      "جنوب الجيزة", "حدائق أكتوبر", "6 أكتوبر", "مدينة السادات", 
      "وادي النطرون", "النوبارية", "برج العرب", "الإسكندرية", 
      "العامرية", "الحمام", "العلمين"
    ]
  },
  monorail: {
    id: "monorail_east",
    name: "مونوريل شرق النيل",
    stations: [
      "الإستاد", "هشام بركات", "نوري خطاب", "الحي السابع", "ذاكر حسين", 
      "جيهان السادات", "المشير طنطاوي", "وان ناينتي", "مستشفى الجوي", 
      "النرجس", "المستثمرين", "الأندلس", "النافورة", "بيت الوطن", 
      "مسجد الفتاح العليم", "R1", "R2", "R3", "مدينة الفنون والثقافة", 
      "حي الوزارات", "مسجد مصر", "مدينة العدالة"
    ]
  },
  metro: {
    id: "cairo_metro",
    name: "مترو القاهرة",
    lines: {
      line1: {
        name: "الخط الأول (المرج - حلوان)",
        stations: [
          "المرج الجديدة", "المرج", "عزبة النخل", "عين شمس", "المطرية", 
          "حلمية الزيتون", "حدائق الزيتون", "سراي القبة", "حمامات القبة", 
          "كوبري القبة", "منشية الصدر", "الدمرداش", "غمرة", "الشهداء", 
          "عرابي", "ناصر", "السادات", "سعد زغلول", "السيدة زينب", 
          "الملك الصالح", "مار جرجس", "الزهراء", "دار السلام", "حدائق المعادي", 
          "المعادي", "ثكنات المعادي", "طرة البلد", "كوتسيكا", "طرة الأسمنت", 
          "المعصرة", "حدائق حلوان", "وادي حوف", "جامعة حلوان", "عين حلوان", "حلوان"
        ]
      },
      line2: {
        name: "الخط الثاني (شبرا الخيمة - المنيب)",
        stations: [
          "شبرا الخيمة", "كلية الزراعة", "المظلات", "الخلفاوي", "سانت تريزا", 
          "روض الفرج", "مسرة", "الشهداء", "العتبة", "محمد نجيب", "السادات", 
          "الأوبرا", "البحوث", "الدقي", "جامعة القاهرة", "فيصل", "الجيزة", 
          "أم المصريين", "ساقية مكي", "المنيب"
        ]
      },
      line3: {
        name: "الخط الثالث (عدلي منصور - الكيت كات / تفرعات)",
        stations: [
          "عدلي منصور", "الهايكستب", "عمر بن الخطاب", "قباء", "هشام بركات", 
          "النزهة", "نادي الشمس", "ألف مسكن", "هليوبوليس", "هارون", "الأهرام", 
          "كلية البنات", "الاستاد", "المعرض", "العباسية", "عبده باشا", "الجيش", 
          "باب الشعرية", "العتبة", "ناصر", "ماسبيرو", "صفاء حجازي", "الكيت كات",
          "السودان", "إمبابة", "البوهي", "القومية", "الدائري", "محور روض الفرج",
          "التوفيقية", "وادي النيل", "جامعة الدول", "بولاق الدكرور", "جامعة القاهرة"
        ]
      }
    }
  },
  brt: {
    id: "brt_bus",
    name: "الأتوبيس الترددي (BRT)",
    stations: [
      "إسكندرية الزراعي", "العقيد أحمد عبدالرحيم (الشرقاوية)", "شبرا بنها", "بهتيم", 
      "مسطرد", "الخصوص", "المرج", "القلج", "مؤسسة الزكاة", "الفريق إبراهيم عرابي", 
      "السلام", "عدلي منصور", "طريق السويس", "أكاديمية الشرطة", "المشير طنطاوي", 
      "الجولف", "طريق السخنة", "النساجون الشرقيون", "كارفور المعادي", "المقطم", 
      "الأوتوستراد", "شارع الجزائر", "الإمامين", "الزهراء", "البحر الأعظم", 
      "العمرانية", "الطالبية", "المريوطية", "المنصورية", "صن كابيتال (تقاطع الفيوم)", 
      "مدخل أكتوبر", "إسكندرية الصحراوي (المتحف المصري الكبير)", "ترسا", "الهرم", 
      "الملك فيصل", "مسجد المدينة", "منشية البكاري", "صفط اللبن", "زنين", 
      "المعتمدية", "محور 26 يوليو", "البراجيل", "أرض اللواء", "محور أحمد عرابي", 
      "إمبابة", "تحيا مصر", "الوراق", "باسوس"
    ]
  }
};

export const INITIAL_TRANSPORT_MODES: TransportMode[] = [
  {
    id: 'metro',
    name: 'مترو أنفاق القاهرة',
    subtitle: 'الخط الأول والثاني والثالث',
    badge: 'الشبكة الأوسع',
    color: '#0284c7',
    accentBg: 'bg-sky-50 text-sky-800 border-sky-200',
    iconName: 'Train',
    description: 'شريان العاصمة الذي ينقل ملايين الركاب يومياً عبر 3 خطوط رئيسية ومحطات تبادلية استراتيجية.',
  },
  {
    id: 'lrt_train',
    name: 'القطار الكهربائي السريع',
    subtitle: 'العين السخنة - العاصمة - الإسكندرية - العلمين',
    badge: 'فائق السرعة',
    color: '#10b981',
    accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconName: 'Zap',
    description: 'شبكة القطار الكهربائي السريع لربط البحر الأحمر بالبحر المتوسط من السخنة إلى العلمين ومطروح.',
  },
  {
    id: 'monorail',
    name: 'مونوريل شرق النيل',
    subtitle: 'الإستاد - القاهرة الجديدة - العاصمة الإدارية',
    badge: 'معلق فائق الحداثة',
    color: '#8b5cf6',
    accentBg: 'bg-purple-50 text-purple-800 border-purple-200',
    iconName: 'Compass',
    description: 'مونوريل شرق النيل فائق التطور يربط مدينة نصر بالقاهرة الجديدة ومحطات العاصمة الإدارية الجديدة.',
  },
  {
    id: 'brt',
    name: 'الأتوبيس الترددي (BRT)',
    subtitle: 'شبكة الطريق الدائري حول القاهرة الكبرى (48 محطة)',
    badge: 'مسار مخصص سريع',
    color: '#f59e0b',
    accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
    iconName: 'Bus',
    description: 'حافلات سريعة ذات مسار معزول تسير على الطريق الدائري لربط محافظات القاهرة الكبرى والجيزة والقليوبية.',
  },
];

export const INITIAL_TRANSIT_LINES: TransitLine[] = [
  // Metro Lines
  {
    id: 'metro_line_1',
    modeId: 'metro',
    name: 'الخط الأول (المرج - حلوان)',
    color: '#dc2626', // Red
    textColor: '#ffffff',
    terminalA: 'المرج الجديدة',
    terminalB: 'حلوان',
  },
  {
    id: 'metro_line_2',
    modeId: 'metro',
    name: 'الخط الثاني (شبرا الخيمة - المنيب)',
    color: '#ea580c', // Orange
    textColor: '#ffffff',
    terminalA: 'شبرا الخيمة',
    terminalB: 'المنيب',
  },
  {
    id: 'metro_line_3',
    modeId: 'metro',
    name: 'الخط الثالث (عدلي منصور - الكيت كات / تفرعات)',
    color: '#059669', // Emerald
    textColor: '#ffffff',
    terminalA: 'عدلي منصور',
    terminalB: 'محور روض الفرج',
  },
  // High Speed Train Line
  {
    id: 'hst_line',
    modeId: 'lrt_train',
    name: 'القطار الكهربائي السريع (العين السخنة - العلمين)',
    color: '#16a34a',
    textColor: '#ffffff',
    terminalA: 'العين السخنة',
    terminalB: 'العلمين',
  },
  // Monorail Line
  {
    id: 'monorail_east',
    modeId: 'monorail',
    name: 'مونوريل شرق النيل (الإستاد - مدينة العدالة)',
    color: '#7c3aed',
    textColor: '#ffffff',
    terminalA: 'الإستاد',
    terminalB: 'مدينة العدالة',
  },
  // BRT Line
  {
    id: 'brt_ring_road',
    modeId: 'brt',
    name: 'الأتوبيس الترددي (مسار الطريق الدائري)',
    color: '#d97706',
    textColor: '#ffffff',
    terminalA: 'إسكندرية الزراعي',
    terminalB: 'باسوس',
  },
];

// Helper to determine interchanges
const checkIsInterchange = (stationName: string, lineId: string): { isInterchange: boolean; interchangeLines?: string[]; notes?: string } => {
  const norm = stationName.replace(/[إأآا]/g, 'ا').trim();

  if (norm === 'الشهداء') {
    return { isInterchange: true, interchangeLines: lineId === 'metro_line_1' ? ['metro_line_2'] : ['metro_line_1'], notes: 'محطة رمسيس التبادلية بين الخطين الأول والثاني ومحطة قطارات مصر' };
  }
  if (norm === 'السادات') {
    return { isInterchange: true, interchangeLines: lineId === 'metro_line_1' ? ['metro_line_2'] : ['metro_line_1'], notes: 'محطة ميدان التحرير التبادلية بين الخطين الأول والثاني' };
  }
  if (norm === 'العتبة') {
    return { isInterchange: true, interchangeLines: lineId === 'metro_line_2' ? ['metro_line_3'] : ['metro_line_2'], notes: 'محطة العتبة التبادلية بين الخطين الثاني والثالث' };
  }
  if (norm === 'ناصر') {
    return { isInterchange: true, interchangeLines: lineId === 'metro_line_1' ? ['metro_line_3'] : ['metro_line_1'], notes: 'محطة ناصر التبادلية بين الخطين الأول والثالث' };
  }
  if (norm === 'جامعة القاهرة') {
    return { isInterchange: true, interchangeLines: lineId === 'metro_line_2' ? ['metro_line_3'] : ['metro_line_2'], notes: 'محطة جامعة القاهرة التبادلية بين الخطين الثاني والثالث' };
  }
  if (norm === 'عدلي منصور') {
    return { isInterchange: true, interchangeLines: lineId === 'metro_line_3' ? ['brt_ring_road'] : ['metro_line_3'], notes: 'المحطة المركزية التبادلية الكبرى (مترو، قطار، BRT)' };
  }
  if (norm === 'الاستاد') {
    return { isInterchange: true, interchangeLines: ['monorail_east'], notes: 'محطة تبادلية مع مونوريل شرق النيل' };
  }
  if (norm === 'مدينة الفنون والثقافة') {
    return { isInterchange: true, interchangeLines: ['hst_line'], notes: 'محطة تبادلية بالعاصمة الإدارية الجديدة' };
  }
  if (norm === 'المنيب') {
    return { isInterchange: true, interchangeLines: ['brt_ring_road'], notes: 'محطة تبادلية جنوب الجيزة' };
  }
  if (norm === 'محمد نجيب') {
    return { isInterchange: false, notes: 'محطة وسط البلد' };
  }

  return { isInterchange: false };
};

// Generate INITIAL_STATIONS from the exact arrays in transportationData
export const INITIAL_STATIONS: Station[] = [
  // --- الخط الأول للمترو (المرج الجديدة - حلوان) 35 محطة ---
  ...transportationData.metro.lines.line1.stations.map((name, index) => {
    const order = index + 1;
    const { isInterchange, interchangeLines, notes } = checkIsInterchange(name, 'metro_line_1');
    return {
      id: `m1_${String(order).padStart(2, '0')}`,
      name,
      modeId: 'metro' as const,
      lineId: 'metro_line_1',
      order,
      isInterchange,
      interchangeLines,
      notes,
    };
  }),

  // --- الخط الثاني للمترو (شبرا الخيمة - المنيب) 20 محطة ---
  ...transportationData.metro.lines.line2.stations.map((name, index) => {
    const order = index + 1;
    const { isInterchange, interchangeLines, notes } = checkIsInterchange(name, 'metro_line_2');
    return {
      id: `m2_${String(order).padStart(2, '0')}`,
      name,
      modeId: 'metro' as const,
      lineId: 'metro_line_2',
      order,
      isInterchange,
      interchangeLines,
      notes,
    };
  }),

  // --- الخط الثالث للمترو (عدلي منصور - تفرعات روض الفرج وجامعة القاهرة) 34 محطة ---
  ...transportationData.metro.lines.line3.stations.map((name, index) => {
    const order = index + 1;
    const { isInterchange, interchangeLines, notes } = checkIsInterchange(name, 'metro_line_3');
    return {
      id: `m3_${String(order).padStart(2, '0')}`,
      name,
      modeId: 'metro' as const,
      lineId: 'metro_line_3',
      order,
      isInterchange,
      interchangeLines,
      notes,
    };
  }),

  // --- القطار الكهربائي السريع (العين السخنة - العلمين) 15 محطة ---
  ...transportationData.highSpeedTrain.stations.map((name, index) => {
    const order = index + 1;
    const { isInterchange, interchangeLines, notes } = checkIsInterchange(name, 'hst_line');
    return {
      id: `hst_${String(order).padStart(2, '0')}`,
      name,
      modeId: 'lrt_train' as const,
      lineId: 'hst_line',
      order,
      isInterchange,
      interchangeLines,
      notes,
    };
  }),

  // --- مونوريل شرق النيل (الإستاد - مدينة العدالة) 22 محطة ---
  ...transportationData.monorail.stations.map((name, index) => {
    const order = index + 1;
    const { isInterchange, interchangeLines, notes } = checkIsInterchange(name, 'monorail_east');
    return {
      id: `mono_e_${String(order).padStart(2, '0')}`,
      name,
      modeId: 'monorail' as const,
      lineId: 'monorail_east',
      order,
      isInterchange,
      interchangeLines,
      notes,
    };
  }),

  // --- الأتوبيس الترددي BRT (مسار الطريق الدائري) 48 محطة ---
  ...transportationData.brt.stations.map((name, index) => {
    const order = index + 1;
    const { isInterchange, interchangeLines, notes } = checkIsInterchange(name, 'brt_ring_road');
    return {
      id: `brt_${String(order).padStart(2, '0')}`,
      name,
      modeId: 'brt' as const,
      lineId: 'brt_ring_road',
      order,
      isInterchange,
      interchangeLines,
      notes,
    };
  }),
];

export const INITIAL_FARE_BRACKETS: FareBracket[] = [
  // 1. مترو القاهرة (Cairo Metro)
  {
    id: 'metro_tier_1',
    modeId: 'metro',
    minStations: 1,
    maxStations: 9,
    price: 10,
    label: 'حتى 9 محطات',
  },
  {
    id: 'metro_tier_2',
    modeId: 'metro',
    minStations: 10,
    maxStations: 16,
    price: 12,
    label: 'من 10 إلى 16 محطة',
  },
  {
    id: 'metro_tier_3',
    modeId: 'metro',
    minStations: 17,
    maxStations: 23,
    price: 15,
    label: 'من 17 إلى 23 محطة',
  },
  {
    id: 'metro_tier_4',
    modeId: 'metro',
    minStations: 24,
    maxStations: 999,
    price: 20,
    label: 'أكثر من 23 محطة (حتى 39 محطة)',
  },

  // 2. المونوريل (Monorail)
  {
    id: 'monorail_tier_1',
    modeId: 'monorail',
    minStations: 1,
    maxStations: 5,
    price: 20,
    label: 'حتى 5 محطات (منطقة واحدة)',
  },
  {
    id: 'monorail_tier_2',
    modeId: 'monorail',
    minStations: 6,
    maxStations: 10,
    price: 40,
    label: 'حتى 10 محطات (منطقتان)',
  },
  {
    id: 'monorail_tier_3',
    modeId: 'monorail',
    minStations: 11,
    maxStations: 15,
    price: 55,
    label: 'حتى 15 محطة (3 مناطق)',
  },
  {
    id: 'monorail_tier_4',
    modeId: 'monorail',
    minStations: 16,
    maxStations: 999,
    price: 80,
    label: 'أكثر من 15 محطة / الخط بالكامل (4 مناطق)',
  },

  // 3. الأتوبيس الترددي BRT (مسار الطريق الدائري)
  {
    id: 'brt_tier_1',
    modeId: 'brt',
    minStations: 1,
    maxStations: 4,
    price: 5,
    label: 'حتى 4 محطات',
  },
  {
    id: 'brt_tier_2',
    modeId: 'brt',
    minStations: 5,
    maxStations: 10,
    price: 10,
    label: 'حتى 10 محطات',
  },
  {
    id: 'brt_tier_3',
    modeId: 'brt',
    minStations: 11,
    maxStations: 14,
    price: 15,
    label: 'حتى 14 محطة',
  },
  {
    id: 'brt_tier_4',
    modeId: 'brt',
    minStations: 15,
    maxStations: 18,
    price: 20,
    label: 'حتى 18 محطة',
  },
  {
    id: 'brt_tier_5',
    modeId: 'brt',
    minStations: 19,
    maxStations: 22,
    price: 25,
    label: 'حتى 22 محطة',
  },
  {
    id: 'brt_tier_6',
    modeId: 'brt',
    minStations: 23,
    maxStations: 26,
    price: 30,
    label: 'حتى 26 محطة',
  },
  {
    id: 'brt_tier_7',
    modeId: 'brt',
    minStations: 27,
    maxStations: 999,
    price: 35,
    label: 'حتى 30 محطة فما فوق (الرحلة الكاملة)',
  },

  // 4. القطار الكهربائي السريع (High Speed Train)
  {
    id: 'hst_tier_1',
    modeId: 'lrt_train',
    minStations: 1,
    maxStations: 3,
    price: 25,
    label: 'من 1 إلى 3 محطات',
  },
  {
    id: 'hst_tier_2',
    modeId: 'lrt_train',
    minStations: 4,
    maxStations: 7,
    price: 50,
    label: 'من 4 إلى 7 محطات',
  },
  {
    id: 'hst_tier_3',
    modeId: 'lrt_train',
    minStations: 8,
    maxStations: 11,
    price: 75,
    label: 'من 8 إلى 11 محطة',
  },
  {
    id: 'hst_tier_4',
    modeId: 'lrt_train',
    minStations: 12,
    maxStations: 999,
    price: 100,
    label: 'أكثر من 11 محطة',
  },
];
