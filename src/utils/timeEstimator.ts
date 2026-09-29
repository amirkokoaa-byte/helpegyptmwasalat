/**
 * Official Transit Time Estimator based on Egyptian Ministry of Transport Technical Standards
 * المعايير الهندسية والتشغيلية الرسمية لوزارة النقل المصرية (2026)
 */

import { TransportModeId } from '../types/transit';

/**
 * متوسط الزمن بين كل محطتين (بالدقائق) بناءً على السرعات التشغيلية ومسافات التوقف:
 * - مترو القاهرة: سرعة 35-40 كم/س -> 2.5 دقيقة (دقيقتان سير + 30 ثانية توقف)
 * - المونوريل: سرعة 40 كم/س -> 3 دقائق
 * - الأتوبيس الترددي BRT: سرعة 50-70 كم/س -> 3.5 دقيقة (بناءً على 106 كم و49 محطة)
 * - القطار الكهربائي السريع: متوسط مسافات 30 كم -> 12 دقيقة (شامل التسارع والتباطؤ والتوقف)
 */
export const PROJECT_TIME_PER_STATION: Record<string, number> = {
  metro: 2.5,
  cairo_metro: 2.5,
  monorail: 3.0,
  monorail_east: 3.0,
  brt: 3.5,
  brt_ring_road: 3.5,
  lrt_train: 12.0,
  high_speed_train: 12.0,
  highSpeedTrain: 12.0,
};

// وقت التبديل في مترو القاهرة (5 دقائق للمشي بين الأرصفة وانتظار القطار القادم)
export const METRO_TRANSFER_TIME_MINUTES = 5;

/**
 * حساب الوقت المتوقع للرحلة بالدقائق بدقة بناءً على المعايير الرسمية لوزارة النقل
 * @param projectType نوع المشروع (مترو، مونوريل، أتوبيس ترددي، قطار سريع)
 * @param stationsCount إجمالي عدد المحطات المقطوعة (شامل محطتي البداية والنهاية)
 * @param hasTransfer هل يتطلب المسار تبديلاً بين الخطوط؟
 * @param transfersCount عدد مرات التبديل (الافتراضي: 1 عند وجود تبديل)
 * @returns إجمالي الوقت بالدقائق
 */
export function calculateEstimatedTime(
  projectType: string,
  stationsCount: number,
  hasTransfer: boolean = false,
  transfersCount: number = 1
): number {
  if (stationsCount <= 1) {
    return hasTransfer ? METRO_TRANSFER_TIME_MINUTES : 0;
  }

  // عدد القفزات بين المحطات = عدد المحطات - 1
  const hops = Math.max(0, stationsCount - 1);

  // استخراج متوسط الزمن لكل محطة بحسب نوع المشروع
  const normalizedType = projectType.toLowerCase();
  const timePerHop =
    PROJECT_TIME_PER_STATION[normalizedType] ??
    (normalizedType.includes('metro')
      ? 2.5
      : normalizedType.includes('monorail')
      ? 3.0
      : normalizedType.includes('brt')
      ? 3.5
      : normalizedType.includes('train') || normalizedType.includes('lrt') || normalizedType.includes('speed')
      ? 12.0
      : 2.5);

  // الزمن الصافي للحركة والتوقف في المحطات
  let totalMinutes = hops * timePerHop;

  // إذا كان المشروع مترو القاهرة وهناك تبديل، إضافة 5 دقائق لكل تبديل
  const isMetro = normalizedType === 'metro' || normalizedType === 'cairo_metro' || normalizedType.includes('metro');
  if (hasTransfer) {
    // إضافة 5 دقائق لكل تبديل (وقت المشي داخل المحطة التبادلية وانتظار القطار)
    const effectiveTransfers = Math.max(1, transfersCount);
    const transferPenalty = isMetro ? METRO_TRANSFER_TIME_MINUTES * effectiveTransfers : 5 * effectiveTransfers;
    totalMinutes += transferPenalty;
  }

  return Math.round(totalMinutes);
}

/**
 * تحويل إجمالي الدقائق إلى صيغة نصية مقروءة وواضحة للمستخدم باللغة العربية
 * أمثلة:
 * - 15  -> "15 دقيقة"
 * - 65  -> "ساعة و 5 دقائق"
 * - 120 -> "ساعتان"
 * - 125 -> "ساعتان و 5 دقائق"
 * - 180 -> "3 ساعات"
 * - 195 -> "3 ساعات و 15 دقيقة"
 */
export function formatTime(totalMinutes: number): string {
  if (totalMinutes <= 0) {
    return 'أقل من دقيقة';
  }

  if (totalMinutes === 1) {
    return 'دقيقة واحدة';
  }

  if (totalMinutes === 2) {
    return 'دقيقتان';
  }

  // أقل من ساعة (3 إلى 59 دقيقة)
  if (totalMinutes < 60) {
    if (totalMinutes >= 3 && totalMinutes <= 10) {
      return `${totalMinutes} دقائق`;
    }
    return `${totalMinutes} دقيقة`;
  }

  // ساعة واحدة أو أكثر
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // صياغة الساعات بالعربية الفصحى السليمة
  let hoursText = '';
  if (hours === 1) {
    hoursText = 'ساعة';
  } else if (hours === 2) {
    hoursText = 'ساعتان';
  } else if (hours >= 3 && hours <= 10) {
    hoursText = `${hours} ساعات`;
  } else {
    hoursText = `${hours} ساعة`;
  }

  // إذا كانت الدقائق المتبقية صفراً
  if (minutes === 0) {
    return hoursText;
  }

  // صياغة الدقائق المتبقية
  let minutesText = '';
  if (minutes === 1) {
    minutesText = 'دقيقة';
  } else if (minutes === 2) {
    minutesText = 'دقيقتان';
  } else if (minutes >= 3 && minutes <= 10) {
    minutesText = `${minutes} دقائق`;
  } else {
    minutesText = `${minutes} دقيقة`;
  }

  return `${hoursText} و ${minutesText}`;
}
