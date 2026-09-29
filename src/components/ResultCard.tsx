import React, { useState } from 'react';
import {
  Clock,
  Ticket,
  MapPin,
  ArrowLeftRight,
  GitBranch,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';

export const ResultCard: React.FC = () => {
  const { routeResult, lines, startStationId, endStationId } = useTransit();
  const [copied, setCopied] = useState(false);
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  if (!startStationId || !endStationId) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Ticket className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-700 text-base mb-1">حدد محطتي الركوب والنزول</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          اختر محطة البداية والنهاية من القوائم أعلاه لعرض مسار الرحلة، عدد المحطات، والتعريفة بدقة.
        </p>
      </div>
    );
  }

  if (!routeResult) {
    return (
      <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6 text-center text-rose-700">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <h3 className="font-semibold text-base mb-1">تعذر العثور على مسار مباشر</h3>
        <p className="text-xs text-rose-600">
          يرجى التحقق من اتصال المحطتين أو مراجعة شبكة الخطوط المحددة.
        </p>
      </div>
    );
  }

  const {
    startStation,
    endStation,
    totalStations,
    estimatedMinutes,
    fare,
    path,
    transfers,
    appliedBracket,
  } = routeResult;

  // Copy route summary to clipboard
  const handleCopy = () => {
    const transferText =
      transfers.length > 0
        ? `\nالتبديلات: ${transfers.map((t) => `${t.stationName} (${t.direction})`).join('، ')}`
        : '\nمسار مباشر دون تبديل خطوط';

    const text = `رحلة مواصلات مصر:\nمن: ${startStation.name} إلى: ${endStation.name}\nعدد المحطات: ${totalStations}\nسعر التذكرة: ${fare} جنيه\nالوقت التقديري: حوالي ${estimatedMinutes} دقيقة${transferText}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineById = (lineId: string) => {
    return lines.find((l) => l.id === lineId);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-l from-slate-900 to-slate-800 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-300 font-medium mb-1">
              <span>تفاصيل مسار الرحلة</span>
              <span>·</span>
              <span>تسعيرة رسمية</span>
            </div>
            <div className="flex items-center gap-2 text-lg sm:text-xl font-bold">
              <span>{startStation.name}</span>
              <span className="text-blue-400">←</span>
              <span>{endStation.name}</span>
            </div>
          </div>

          {/* Fare Spotlight */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[11px] text-slate-300 block font-medium">سعر التذكرة الإجمالي</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
                  {fare}
                </span>
                <span className="text-xs text-slate-200 font-medium">جنيه مصري</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 border-b border-slate-100 bg-slate-50/70 p-3 sm:p-4 text-center">
        {/* Metric 1: Total Stations */}
        <div className="px-2">
          <span className="text-[11px] font-medium text-slate-500 block mb-0.5">عدد المحطات</span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
            {totalStations} <span className="text-xs font-normal text-slate-500">محطة</span>
          </div>
        </div>

        {/* Metric 2: Estimated Time */}
        <div className="px-2">
          <span className="text-[11px] font-medium text-slate-500 block mb-0.5">الوقت المتوقع</span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-blue-600 inline" />
            <span>{estimatedMinutes}</span>
            <span className="text-xs font-normal text-slate-500">دقيقة</span>
          </div>
        </div>

        {/* Metric 3: Transfers Count */}
        <div className="px-2">
          <span className="text-[11px] font-medium text-slate-500 block mb-0.5">التبديلات</span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
            {transfers.length === 0 ? (
              <span className="text-emerald-600 text-sm font-semibold">مباشر (0)</span>
            ) : (
              <span className="text-amber-600">
                {transfers.length} <span className="text-xs font-normal text-slate-500">تبديل</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Applied Fare Bracket Pill & Disclaimers */}
        {appliedBracket && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
            <div className="flex items-center gap-2 text-blue-900">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="font-semibold">الشريحة المطبقة:</span>
              <span>{appliedBracket.label}</span>
              <span className="text-blue-700 font-bold tabular-nums">({appliedBracket.price} ج.م)</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              * خصم 50% لكبار السن · ذوي الهمم 50 قرش
            </div>
          </div>
        )}

        {/* Prominent Transfer Notice (محطة التبديل التبادلية بشكل بارز) */}
        {transfers.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-purple-600" />
              محطات التبديل المطلوبة في المسار ({transfers.length}):
            </h4>

            {transfers.map((tr, idx) => {
              const fromLine = getLineById(tr.fromLineId);
              const toLine = getLineById(tr.toLineId);

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-purple-50/80 border-2 border-purple-200 text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-700 font-semibold">محطة تبادلية:</span>
                        <span className="text-base font-extrabold text-purple-900 bg-white px-2.5 py-0.5 rounded-md border border-purple-300 shadow-2xs">
                          محطة {tr.stationName}
                        </span>
                      </div>
                      <p className="text-xs text-purple-800 mt-1 font-medium">
                        انزل في محطة <strong className="font-bold underline">{tr.stationName}</strong>، ثم انتقل إلى رصيف{' '}
                        <strong className="font-bold">{toLine?.name || tr.direction}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold self-end sm:self-auto bg-white/80 px-2.5 py-1.5 rounded-lg border border-purple-200 text-purple-800">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: fromLine?.color || '#9333ea' }}
                    ></span>
                    <span>{fromLine?.name.split('(')[0] || 'الخط الحالي'}</span>
                    <span className="text-purple-400">➔</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: toLine?.color || '#0284c7' }}
                    ></span>
                    <span>{toLine?.name.split('(')[0] || 'الخط الجديد'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              رحلة مباشرة على نفس الخط دون الحاجة لتبديل قطارات.
            </span>
          </div>
        )}

        {/* Visual Step-by-Step Route Timeline */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              تسلسل مسار المحطات ({path.length} محطة):
            </h4>
            {path.length > 5 && (
              <button
                type="button"
                onClick={() => setShowFullTimeline(!showFullTimeline)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                {showFullTimeline ? (
                  <>
                    <span>إخفاء المحطات الوسيطة</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>عرض كافة المحطات بالكامل</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="relative pl-2 pr-2 py-2">
            {/* Timeline stations */}
            <div className="space-y-2">
              {path.map((step, idx) => {
                const line = getLineById(step.lineId);
                const isFirst = idx === 0;
                const isLast = idx === path.length - 1;
                const isTransfer = step.isTransfer;

                // If not showing full timeline and we have many stations, collapse middle ones
                if (!showFullTimeline && path.length > 7) {
                  if (idx > 2 && idx < path.length - 3 && !isTransfer) {
                    if (idx === 3) {
                      return (
                        <div
                          key={`collapsed_${idx}`}
                          onClick={() => setShowFullTimeline(true)}
                          className="py-2 px-3 my-1 rounded-lg bg-slate-100/80 border border-dashed border-slate-300 text-slate-500 text-xs text-center cursor-pointer hover:bg-slate-200/70 transition-colors"
                        >
                          ... يمر بـ {path.length - 6} محطة وسيطة أخرى (اضغط للعرض الكامل) ...
                        </div>
                      );
                    }
                    return null;
                  }
                }

                return (
                  <div
                    key={`${step.station.id}_${idx}`}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      isFirst
                        ? 'bg-emerald-50/70 border border-emerald-200'
                        : isLast
                        ? 'bg-rose-50/70 border border-rose-200'
                        : isTransfer
                        ? 'bg-purple-50/90 border border-purple-200'
                        : 'bg-white border border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Node Dot / Indicator */}
                    <div className="relative flex flex-col items-center shrink-0 mt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isFirst
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : isLast
                            ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                            : isTransfer
                            ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>

                    {/* Station Name & Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isFirst || isLast || isTransfer ? 'text-slate-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {step.station.name}
                        </span>

                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-medium shrink-0"
                          style={{
                            backgroundColor: `${line?.color}15` || '#f1f5f9',
                            color: line?.color || '#475569',
                          }}
                        >
                          {line?.name.split('(')[0] || 'الخط'}
                        </span>
                      </div>

                      {/* Direction hint or transfer badge */}
                      {isFirst && step.direction && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          اركب القطار {step.direction}
                        </p>
                      )}

                      {isTransfer && (
                        <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                          ⚡ محطة تبادل الخطوط
                        </p>
                      )}

                      {isLast && (
                        <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                          🏁 محطة الوصول والنزول النهائية
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action bar: Copy & Share */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">تم نسخ تفاصيل الرحلة!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>نسخ ملخص الرحلة</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-400">
            تحديث تسعيرة الهيئة القومية للأنفاق 2026
          </span>
        </div>
      </div>
    </div>
  );
};
