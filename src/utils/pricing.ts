import { FareBracket, TransportModeId } from '../types/transit';

export interface DynamicPriceResult {
  price: number;
  label: string;
  zone?: string;
  tierIndex: number;
}

/**
 * دالة حساب الأسعار الهندسية الديناميكية
 * تحسب سعر التذكرة العادية بناءً على المشروع وعدد المحطات بدقة
 */
export function calculateDynamicPrice(
  project: TransportModeId | string,
  stationsCount: number,
  customBrackets?: FareBracket[]
): DynamicPriceResult {
  const count = Math.max(1, stationsCount);

  // إذا تم تعديل الشرائح من قبل الإدمن في لوحة التحكم، نطبق الشرائح المعدلة
  if (customBrackets && customBrackets.length > 0) {
    const sorted = [...customBrackets].sort((a, b) => a.minStations - b.minStations);
    for (let i = 0; i < sorted.length; i++) {
      const b = sorted[i];
      if (count >= b.minStations && count <= b.maxStations) {
        return {
          price: b.price,
          label: b.label,
          tierIndex: i + 1,
        };
      }
    }
  }

  // 1. الأتوبيس الترددي (BRT)
  if (project === 'brt' || project === 'brt_bus') {
    if (count <= 4) {
      return { price: 5, label: 'حتى 4 محطات', tierIndex: 1 };
    } else if (count <= 10) {
      return { price: 10, label: 'حتى 10 محطات', tierIndex: 2 };
    } else if (count <= 14) {
      return { price: 15, label: 'حتى 14 محطة', tierIndex: 3 };
    } else if (count <= 18) {
      return { price: 20, label: 'حتى 18 محطة', tierIndex: 4 };
    } else if (count <= 22) {
      return { price: 25, label: 'حتى 22 محطة', tierIndex: 5 };
    } else if (count <= 26) {
      return { price: 30, label: 'حتى 26 محطة', tierIndex: 6 };
    } else {
      return { price: 35, label: 'حتى 30 محطة فما فوق (الرحلة الكاملة)', tierIndex: 7 };
    }
  }

  // 2. المونوريل (Monorail)
  if (project === 'monorail' || project === 'monorail_east') {
    if (count <= 5) {
      return { price: 20, label: 'حتى 5 محطات (منطقة واحدة)', zone: 'منطقة واحدة (1-5 محطات)', tierIndex: 1 };
    } else if (count <= 10) {
      return { price: 40, label: 'حتى 10 محطات (منطقتان)', zone: 'منطقتان (6-10 محطات)', tierIndex: 2 };
    } else if (count <= 15) {
      return { price: 55, label: 'حتى 15 محطة (3 مناطق)', zone: '3 مناطق (11-15 محطة)', tierIndex: 3 };
    } else {
      return { price: 80, label: 'أكثر من 15 محطة / الخط بالكامل (4 مناطق)', zone: '4 مناطق (الخط بالكامل)', tierIndex: 4 };
    }
  }

  // 3. مترو القاهرة (Cairo Metro)
  if (project === 'metro' || project === 'cairo_metro') {
    if (count <= 9) {
      return { price: 10, label: 'حتى 9 محطات', tierIndex: 1 };
    } else if (count <= 16) {
      return { price: 12, label: 'من 10 إلى 16 محطة', tierIndex: 2 };
    } else if (count <= 23) {
      return { price: 15, label: 'من 17 إلى 23 محطة', tierIndex: 3 };
    } else {
      return { price: 20, label: 'أكثر من 23 محطة (حتى 39 محطة)', tierIndex: 4 };
    }
  }

  // 4. القطار الكهربائي السريع (High Speed Train)
  if (count <= 3) {
    return { price: 25, label: 'من 1 إلى 3 محطات', tierIndex: 1 };
  } else if (count <= 7) {
    return { price: 50, label: 'من 4 إلى 7 محطات', tierIndex: 2 };
  } else if (count <= 11) {
    return { price: 75, label: 'من 8 إلى 11 محطة', tierIndex: 3 };
  } else {
    return { price: 100, label: 'أكثر من 11 محطة', tierIndex: 4 };
  }
}

/**
 * بيانات الاشتراكات والفئات الخاصة لكل مشروع
 */
export interface SubscriptionItem {
  type: string;
  durationOrRides: string;
  coverage: string;
  price: number | string;
  notes?: string;
}

export interface SpecialCategoryItem {
  category: string;
  discountRate: string;
  fare: string;
  requiredDocument: string;
}

export interface ProjectSubscriptionsData {
  title: string;
  badge: string;
  studentPasses?: SubscriptionItem[];
  regularPasses?: SubscriptionItem[];
  specialCategories: SpecialCategoryItem[];
  cashWalletInfo?: {
    cardPrice: number;
    rechargeRange: string;
    benefits: string;
  };
}

export const SUBSCRIPTIONS_DATA: Record<TransportModeId, ProjectSubscriptionsData> = {
  // 1. الأتوبيس الترددي BRT
  brt: {
    title: 'الأتوبيس الترددي (BRT)',
    badge: 'الطريق الدائري',
    studentPasses: [
      {
        type: 'اشتراك طلاب (حتى 4 محطات)',
        durationOrRides: '3 أشهر',
        coverage: 'بحد أقصى 4 محطات',
        price: '350 جنيهاً',
        notes: 'مخصص لطلبة المدارس والجامعات على مسار الدائري',
      },
      {
        type: 'اشتراك طلاب (حتى 4 محطات)',
        durationOrRides: '6 أشهر',
        coverage: 'بحد أقصى 4 محطات',
        price: '680 جنيهاً',
        notes: 'توفير واقتصادي لنصف السنة الدراسية',
      },
      {
        type: 'اشتراك طلاب (حتى 4 محطات)',
        durationOrRides: '9 أشهر',
        coverage: 'بحد أقصى 4 محطات',
        price: '1010 جنيهات',
        notes: 'شامل العام الدراسي بالكامل',
      },
      {
        type: 'اشتراك طلاب (حتى 10 محطات)',
        durationOrRides: '3 أشهر',
        coverage: 'بحد أقصى 10 محطات',
        price: '680 جنيهاً',
        notes: 'تغطية واسعة لـ 10 محطات على الدائري',
      },
      {
        type: 'اشتراك طلاب (حتى 10 محطات)',
        durationOrRides: '6 أشهر',
        coverage: 'بحد أقصى 10 محطات',
        price: '1340 جنيهاً',
        notes: 'رحلات غير محدودة لمدة 6 أشهر',
      },
      {
        type: 'اشتراك طلاب (حتى 10 محطات)',
        durationOrRides: '9 أشهر',
        coverage: 'بحد أقصى 10 محطات',
        price: '2000 جنيه',
        notes: 'الاشتراك الدراسي السنوي الأوسع نطاقاً',
      },
    ],
    specialCategories: [
      {
        category: 'ذوو الاحتياجات الخاصة (قادرون باختلاف)',
        discountRate: 'تخفيض مدعوم',
        fare: '5 جنيهات للرحلة',
        requiredDocument: 'بطاقة إثبات الإعاقة وكارنيه الخدمات المتكاملة',
      },
      {
        category: 'كبار السن (فوق 60 عاماً)',
        discountRate: '50% خصم',
        fare: 'نصف تذكرة حسب عدد المحطات',
        requiredDocument: 'بطاقة الرقم القومي المصرية سارية',
      },
      {
        category: 'كبار السن (فوق 70 عاماً)',
        discountRate: '100% مجاناً',
        fare: 'مجاناً بدون رسوم',
        requiredDocument: 'بطاقة الرقم القومي وصرف استمارة الركوب المجاني',
      },
    ],
    cashWalletInfo: {
      cardPrice: 50,
      rechargeRange: 'من 20 إلى 400 جنيه',
      benefits: 'كارت شحن إلكتروني ذكي للمرور السريع من البوابات دون الحاجة لشراء تذكرة ورقية في كل رحلة.',
    },
  },

  // 2. المونوريل
  monorail: {
    title: 'المونوريل (شرق وغرب النيل)',
    badge: 'النقل المعلق فائق التطور',
    regularPasses: [
      {
        type: 'اشتراك أسبوعي (14 رحلة)',
        durationOrRides: 'أسبوع (14 رحلة)',
        coverage: 'منطقة واحدة (1-5 محطات)',
        price: '140 جنيهاً',
        notes: 'معدل 10 جنيهات فقط للرحلة',
      },
      {
        type: 'اشتراك أسبوعي (14 رحلة)',
        durationOrRides: 'أسبوع (14 رحلة)',
        coverage: 'منطقتان (6-10 محطات)',
        price: '280 جنيهاً',
        notes: 'معدل 20 جنيهاً للرحلة',
      },
      {
        type: 'اشتراك أسبوعي (14 رحلة)',
        durationOrRides: 'أسبوع (14 رحلة)',
        coverage: '3 مناطق (11-15 محطة)',
        price: '420 جنيهاً',
        notes: 'معدل 30 جنيهاً للرحلة',
      },
      {
        type: 'اشتراك أسبوعي (14 رحلة)',
        durationOrRides: 'أسبوع (14 رحلة)',
        coverage: 'الخط بالكامل (4 مناطق)',
        price: '560 جنيهاً',
        notes: 'معدل 40 جنيهاً للرحلة',
      },
      {
        type: 'اشتراك شهري (60 رحلة)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'منطقة واحدة (1-5 محطات)',
        price: '600 جنيه',
        notes: 'وفر 50% مقارنة بالتذاكر العادية',
      },
      {
        type: 'اشتراك شهري (60 رحلة)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'منطقتان (6-10 محطات)',
        price: '1200 جنيه',
        notes: 'وفر 50% مقارنة بالتذاكر العادية',
      },
      {
        type: 'اشتراك شهري (60 رحلة)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: '3 مناطق (11-15 محطة)',
        price: '1800 جنيه',
        notes: 'توفير كبير للذهاب والعودة يومياً',
      },
      {
        type: 'اشتراك شهري (60 رحلة)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'الخط بالكامل (4 مناطق)',
        price: '2400 جنيه',
        notes: 'أقصى توفير للمتنقلين بين العاصمة والقاهرة',
      },
      {
        type: 'اشتراك ربع سنوي (180 رحلة)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: 'منطقة واحدة',
        price: '1800 جنيه',
        notes: 'صالح لمدة 90 يوماً متواصلة',
      },
      {
        type: 'اشتراك ربع سنوي (180 رحلة)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: 'منطقتان',
        price: '3600 جنيه',
        notes: 'صالح لمدة 90 يوماً متواصلة',
      },
      {
        type: 'اشتراك ربع سنوي (180 رحلة)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: '3 مناطق',
        price: '5400 جنيه',
        notes: 'صالح لمدة 90 يوماً متواصلة',
      },
      {
        type: 'اشتراك ربع سنوي (180 رحلة)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: 'الخط بالكامل (4 مناطق)',
        price: '7200 جنيه',
        notes: 'الاشتراك الأشمل لجميع محطات المونوريل',
      },
    ],
    specialCategories: [
      {
        category: 'كبار السن (فوق 60 عاماً) - نصف تذكرة',
        discountRate: '50% خصم',
        fare: 'منطقة (10 ج) · منطقتان (20 ج) · 3 مناطق (30 ج) · الخط بالكامل (40 ج)',
        requiredDocument: 'بطاقة الرقم القومي المصرية سارية',
      },
      {
        category: 'ذوو الاحتياجات الخاصة ومرافقوهم',
        discountRate: '50% خصم',
        fare: 'منطقة (10 ج) · منطقتان (20 ج) · 3 مناطق (30 ج) · الخط بالكامل (40 ج)',
        requiredDocument: 'كارنيه إثبات الإعاقة الصادر من وزارة التضامن الاجتماعي',
      },
      {
        category: 'كبار السن (فوق 70 عاماً)',
        discountRate: '100% مجاناً',
        fare: 'مجاناً بالكامل',
        requiredDocument: 'الرقم القومي مع استخراج تذكرة السفر المجانية من شباك التذاكر',
      },
    ],
  },

  // 3. مترو القاهرة
  metro: {
    title: 'مترو أنفاق القاهرة',
    badge: 'الخط الأول والثاني والثالث',
    regularPasses: [
      {
        type: 'اشتراك شهري عادي (للجمهور)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'منطقة واحدة (1-9 محطات)',
        price: '390 جنيهاً',
        notes: 'معدل 6.5 جنيهات فقط للرحلة',
      },
      {
        type: 'اشتراك شهري عادي (للجمهور)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'منطقتان (10-16 محطة)',
        price: '440 جنيهاً',
        notes: 'معدل 7.3 جنيهات للرحلة',
      },
      {
        type: 'اشتراك شهري عادي (للجمهور)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: '3 إلى 4 مناطق (17-23 محطة)',
        price: '510 جنيهات',
        notes: 'معدل 8.5 جنيهات للرحلة',
      },
      {
        type: 'اشتراك شهري عادي (للجمهور)',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'أكثر من 4 مناطق (الشبكة بالكامل)',
        price: '600 جنيه',
        notes: 'تنقل غير محدود عبر جميع خطوط المترو',
      },
    ],
    studentPasses: [
      {
        type: 'اشتراك طلاب وذوي همم (ربع سنوي)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: 'مرحلة واحدة (منطقة)',
        price: '150 جنيهاً',
        notes: 'دعم حكومي يفوق 95% لطلبة المدارس والجامعات',
      },
      {
        type: 'اشتراك طلاب وذوي همم (ربع سنوي)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: 'مرحلتان (منطقتان)',
        price: '200 جنيه',
        notes: 'معدل 1.1 جنيه فقط للرحلة الواحدة',
      },
      {
        type: 'اشتراك طلاب وذوي همم (ربع سنوي)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: '3 أو 4 مراحل',
        price: '250 جنيهاً',
        notes: 'تغطية واسعة لكافة خطوط المترو',
      },
      {
        type: 'اشتراك طلاب وذوي همم (ربع سنوي)',
        durationOrRides: '3 أشهر (180 رحلة)',
        coverage: 'أكثر من 4 مراحل (الشبكة بالكامل)',
        price: '300 جنيه',
        notes: 'اشتراك كامل لكافة محطات مترو القاهرة',
      },
    ],
    specialCategories: [
      {
        category: 'ذوو الهمم وقادرون باختلاف',
        discountRate: 'سعر مدعوم موحد',
        fare: 'تذكرة موحدة بقيمة 5 جنيهات لكافة المحطات والخطوط',
        requiredDocument: 'كارنيه الخدمات المتكاملة أو شهادة التأهيل المعتمدة',
      },
      {
        category: 'المحاربون القدماء وأسر الشهداء',
        discountRate: 'سعر مدعوم موحد',
        fare: 'تذكرة موحدة بقيمة 5 جنيهات لكافة المحطات',
        requiredDocument: 'كارنيه جمعية المحاربين القدماء أو إثبات رسمي',
      },
      {
        category: 'كبار السن (من 60 إلى 70 عاماً)',
        discountRate: '50% خصم',
        fare: 'نصف تذكرة (5 ج، 6 ج، 7.5 ج، 10 ج)',
        requiredDocument: 'بطاقة الرقم القومي سارية',
      },
      {
        category: 'كبار السن (فوق 70 عاماً)',
        discountRate: '100% مجاناً',
        fare: 'مجاناً بالكامل دون أي رسوم',
        requiredDocument: 'بطاقة الرقم القومي وصرف تذكرة الصفر من الشباك',
      },
    ],
    cashWalletInfo: {
      cardPrice: 80,
      rechargeRange: 'من 40 إلى 500 جنيه',
      benefits: 'كارت ذكي قابل لإعادة الشحن، غير مرتبط باسم مستخدم واحد ويمكن استخدامه لعدة مرافقين، مع خصم قيمة الرحلة فورياً عند البوابات وتوفير وقت الانتظار على شبابيك التذاكر.',
    },
  },

  // 4. القطار الكهربائي السريع
  lrt_train: {
    title: 'القطار الكهربائي السريع',
    badge: 'الخط الأخضر السريع',
    regularPasses: [
      {
        type: 'اشتراك شهري للموظفين والركاب المنتظمين',
        durationOrRides: 'شهر (40 إلى 60 رحلة)',
        coverage: 'حتى 3 محطات',
        price: '750 جنيهاً',
        notes: 'مخصص للمتنقلين يومياً بين المدن الجديدة',
      },
      {
        type: 'اشتراك شهري',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'من 4 إلى 7 محطات',
        price: '1400 جنيه',
        notes: 'خصم 45% عن شراء التذاكر الفردية',
      },
      {
        type: 'اشتراك شهري للخط كاملاً',
        durationOrRides: 'شهر (60 رحلة)',
        coverage: 'أكثر من 7 محطات',
        price: '2100 جنيه',
        notes: 'توفير استثنائي للتنقل اليومي بين المحافظات',
      },
    ],
    specialCategories: [
      {
        category: 'كبار السن (فوق 60 عاماً)',
        discountRate: '50% خصم',
        fare: 'نصف قيمة التذكرة المقررة للرحلة',
        requiredDocument: 'بطاقة الرقم القومي سارية',
      },
      {
        category: 'ذوو الهمم وقادرون باختلاف ومرافقوهم',
        discountRate: '50% خصم',
        fare: 'نصف قيمة التذكرة المقررة',
        requiredDocument: 'كارنيه الخدمات المتكاملة الصادر من وزارة التضامن',
      },
      {
        category: 'كبار السن (فوق 70 عاماً)',
        discountRate: '100% مجاناً',
        fare: 'مجاناً بالكامل',
        requiredDocument: 'بطاقة الرقم القومي الرسمية',
      },
    ],
    cashWalletInfo: {
      cardPrice: 60,
      rechargeRange: 'من 50 إلى 1000 جنيه',
      benefits: 'كارت مسبق الدفع يتيح الصعود للقطارات السريعة وخصم التعريفة تلقائياً بناءً على محطتي الصعود والنزول.',
    },
  },
};
