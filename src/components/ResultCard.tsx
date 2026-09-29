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
  CreditCard,
  Zap,
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { SubscriptionsModal } from './SubscriptionsModal';
import { CyberpunkTrainGraphic } from './CyberpunkTrainGraphic';

export const ResultCard: React.FC = () => {
  const { routeResult, lines, startStationId, endStationId, selectedModeId, modes } = useTransit();
  const [copied, setCopied] = useState(false);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] = useState(false);

  const currentMode = modes.find((m) => m.id === selectedModeId) || modes[0];

  // If no stations are selected yet, display high-tech cyberpunk preview card
  if (!startStationId || !endStationId) {
    return (
      <div className="bg-[#0b101b] rounded-2xl border border-[#00f0ff]/40 p-6 sm:p-7 text-center relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        {/* Subtle HUD background element */}
        <div className="absolute top-2 left-2 text-[9px] font-mono text-[#00f0ff]/50">STATUS: STANDBY</div>
        
        {/* Modern Train framed by glowing neon border (Directly requested) */}
        <CyberpunkTrainGraphic modeName={currentMode.name} />

        <div className="w-12 h-12 rounded-full bg-[#081525] border border-[#00f0ff] flex items-center justify-center mx-auto mb-3 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          <Ticket className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="font-extrabold text-white text-base sm:text-lg mb-1 neon-text-blue">
          حدد محطتي الركوب والنزول
        </h3>
        <p className="text-xs text-[#7dd3fc]/80 max-w-sm mx-auto mb-4 font-mono leading-relaxed">
          اختر محطة البداية والنهاية من القوائم لعرض المسار التفاعلي، عدد المحطات، وسعر التذكرة العادية.
        </p>

        {/* Central button also accessible here */}
        <button
          type="button"
          onClick={() => setIsSubscriptionsModalOpen(true)}
          className="btn-neon-solid w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>عرض الاشتراكات والفئات الخاصة</span>
        </button>

        <SubscriptionsModal
          isOpen={isSubscriptionsModalOpen}
          onClose={() => setIsSubscriptionsModalOpen(false)}
          initialModeId={selectedModeId}
        />
      </div>
    );
  }

  if (!routeResult) {
    return (
      <div className="bg-[#140b12] rounded-2xl border border-rose-500/60 p-6 text-center text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-400 animate-pulse" />
        <h3 className="font-bold text-base mb-1 text-white">تعذر العثور على مسار مباشر</h3>
        <p className="text-xs text-rose-300 font-mono">
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

    const text = `رحلة مواصلات مصر الحديثة:\nمن: ${startStation.name} إلى: ${endStation.name}\nعدد المحطات: ${totalStations}\nسعر التذكرة العادية: ${fare} جنيهاً\nالوقت المتوقع: حوالي ${estimatedMinutes} دقيقة${transferText}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineById = (lineId: string) => {
    return lines.find((l) => l.id === lineId);
  };

  return (
    <div className="bg-[#0b101b] rounded-2xl border border-[#00f0ff]/50 shadow-[0_0_25px_rgba(0,240,255,0.25)] overflow-hidden transition-all">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-l from-[#09111e] via-[#0e192c] to-[#070c16] text-white p-5 sm:p-6 border-b border-[#00f0ff]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#00f0ff] font-mono mb-1.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]"></span>
                ROUTE TELEMETRY
              </span>
              <span>·</span>
              <span className="text-[#38bdf8]">تسعيرة رسمية معتمدة 2026</span>
            </div>
            <div className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-white">
              <span className="neon-text-subtle">{startStation.name}</span>
              <span className="text-[#00f0ff] animate-pulse">➔</span>
              <span className="neon-text-subtle">{endStation.name}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#091526] hover:bg-[#00f0ff] hover:text-[#060911] text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-mono transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)]"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ المسار'}</span>
          </button>
        </div>

        {/* Inside the dynamic result card: The modern train framed by a glowing neon border */}
        <CyberpunkTrainGraphic modeName={currentMode.name} />

        {/* Side-by-Side: Total Stations ('عدد المحطات') & Standard Ticket Price ('سعر التذكرة العادية') with neon blue glow */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#00f0ff]/30 shadow-[0_1px_10px_rgba(0,240,255,0.15)]">
          {/* Box 1: عدد المحطات */}
          <div className="bg-[#070d17] p-3.5 rounded-xl border border-[#00f0ff]/50 shadow-[inset_0_0_12px_rgba(0,240,255,0.15)] flex flex-col justify-between">
            <span className="text-xs text-[#7dd3fc] font-bold tracking-wide block neon-text-subtle">
              عدد المحطات
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#00f0ff] font-mono tabular-nums neon-text-blue">
                {totalStations}
              </span>
              <span className="text-xs text-[#38bdf8] font-bold font-mono">محطة</span>
            </div>
          </div>

          {/* Box 2: سعر التذكرة العادية */}
          <div className="bg-[#070d17] p-3.5 rounded-xl border border-[#00f0ff]/50 shadow-[inset_0_0_12px_rgba(0,240,255,0.15)] flex flex-col justify-between">
            <span className="text-xs text-[#7dd3fc] font-bold tracking-wide block neon-text-subtle">
              سعر التذكرة العادية
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#00f0ff] font-mono tabular-nums neon-text-blue">
                {fare}
              </span>
              <span className="text-xs text-[#38bdf8] font-bold">جنيهاً</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Central Button: عرض الاشتراكات والفئات الخاصة (Solid Glowing Neon Blue Button) */}
      <div className="p-4 sm:p-5 bg-[#060a12] border-b border-[#00f0ff]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <div className="text-xs text-slate-300">
          <span className="font-bold block text-sm mb-0.5 text-white neon-text-subtle">
            اشتراكات الطلاب والفئات الخاصة متوفرة
          </span>
          <p className="text-[#38bdf8] text-[11px] font-mono">
            وفر حتى 85% عبر الاشتراكات الربع سنوية والسنوية المعتمدة.
          </p>
        </div>

        {/* Central glowing solid neon blue button */}
        <button
          type="button"
          onClick={() => setIsSubscriptionsModalOpen(true)}
          className="btn-neon-solid px-5 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>عرض الاشتراكات والفئات الخاصة</span>
        </button>
      </div>

      {/* Metrics Row: Time & Transfers with glowing dividers and badges */}
      <div className="grid grid-cols-2 divide-x divide-x-reverse divide-[#00f0ff]/20 border-b border-[#00f0ff]/20 bg-[#080d17] p-3 sm:p-4 text-center">
        {/* Metric: Estimated Time */}
        <div className="px-2">
          <span className="text-[11px] font-mono text-[#7dd3fc] block mb-0.5">الوقت المتوقع للرحلة</span>
          <div className="text-base sm:text-lg font-extrabold text-white tabular-nums flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-[#00f0ff] inline" />
            <span className="text-[#00f0ff] font-mono">{estimatedMinutes}</span>
            <span className="text-xs font-normal text-slate-400">دقيقة تقريباً</span>
          </div>
        </div>

        {/* Metric: Transfers Count */}
        <div className="px-2">
          <span className="text-[11px] font-mono text-[#7dd3fc] block mb-0.5">التبديلات بين الخطوط</span>
          <div className="text-base sm:text-lg font-extrabold tabular-nums">
            {transfers.length === 0 ? (
              <span className="text-[#00f0ff] text-xs sm:text-sm font-bold bg-[#061521] px-2.5 py-0.5 rounded border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                ✓ مسار مباشر (بدون تبديل)
              </span>
            ) : (
              <span className="text-amber-300 text-xs sm:text-sm font-bold bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                {transfers.length} تبديل خطوط
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5 bg-[#090e18]">
        {/* Applied Fare Bracket Pill & Disclaimers with glowing line and badge */}
        {appliedBracket && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#060a13] border border-[#00f0ff]/30 text-xs shadow-[inset_0_0_8px_rgba(0,240,255,0.1)]">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]"></span>
              <span className="text-[#7dd3fc]">الشريحة المطبقة:</span>
              <span className="text-white font-bold">{appliedBracket.label}</span>
              <span className="text-[#00f0ff] font-mono font-black tabular-nums">({appliedBracket.price} ج.م)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSubscriptionsModalOpen(true)}
              className="text-[#00f0ff] hover:text-white text-[11px] font-bold underline font-mono cursor-pointer"
            >
              DETAILS // تفاصيل الخصومات ➔
            </button>
          </div>
        )}

        {/* Section divider as glowing neon blue line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent shadow-[0_0_8px_#00f0ff]"></div>

        {/* Prominent Transfer Notice (محطة التبديل التبادلية بشكل بارز) */}
        {transfers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <GitBranch className="w-4 h-4 text-[#00f0ff]" />
              محطات التبديل المطلوبة في المسار ({transfers.length}):
            </h4>

            {transfers.map((tr, idx) => {
              const fromLine = getLineById(tr.fromLineId);
              const toLine = getLineById(tr.toLineId);

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#070f1e] border-2 border-[#00f0ff]/60 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00f0ff] text-[#060911] flex items-center justify-center font-black text-sm shrink-0 mt-0.5 shadow-[0_0_10px_#00f0ff]">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#7dd3fc] font-mono">محطة تبادلية:</span>
                        <span className="text-base font-black text-white bg-[#091b30] px-2.5 py-0.5 rounded-md border border-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                          محطة {tr.stationName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        انزل في محطة <strong className="font-bold text-[#00f0ff] underline">{tr.stationName}</strong>، ثم انتقل إلى رصيف{' '}
                        <strong className="font-bold text-white">{toLine?.name || tr.direction}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold self-end sm:self-auto bg-[#060a13] px-2.5 py-1.5 rounded-lg border border-[#00f0ff]/40 text-[#7dd3fc]">
                    <span>{fromLine?.name.split('(')[0] || 'الخط الحالي'}</span>
                    <span className="text-[#00f0ff]">➔</span>
                    <span className="text-white font-bold">{toLine?.name.split('(')[0] || 'الخط الجديد'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section divider as glowing neon blue line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent shadow-[0_0_8px_#00f0ff]"></div>

        {/* Interactive Station Point Indicators (Timeline Path) */}
        <div>
          <button
            type="button"
            onClick={() => setShowFullTimeline(!showFullTimeline)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#7dd3fc] hover:text-[#00f0ff] p-2.5 rounded-lg bg-[#060a13] border border-[#00f0ff]/30 transition-all font-mono"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
              STATION TIMELINE // مسار المحطات المقطوعة ({path.length} محطة)
            </span>
            {showFullTimeline ? (
              <ChevronUp className="w-4 h-4 text-[#00f0ff]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#00f0ff]" />
            )}
          </button>

          {showFullTimeline && (
            <div className="mt-3 p-4 bg-[#050811] rounded-xl border border-[#00f0ff]/30 max-h-72 overflow-y-auto space-y-3 font-mono">
              {path.map((step, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === path.length - 1;
                const isTransfer = step.station.isInterchange;

                return (
                  <div key={step.station.id} className="flex items-start gap-3 relative group">
                    {/* Vertical connecting line indicator */}
                    {!isLast && (
                      <div className="absolute right-[11px] top-6 w-0.5 h-6 bg-[#00f0ff]/40 group-hover:bg-[#00f0ff] transition-colors shadow-[0_0_4px_#00f0ff]"></div>
                    )}

                    {/* Station point node indicator with neon glow */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold z-10 transition-all ${
                        isFirst
                          ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_10px_#00f0ff]'
                          : isLast
                          ? 'bg-[#38bdf8] text-[#060911] shadow-[0_0_10px_#38bdf8]'
                          : isTransfer
                          ? 'bg-[#a855f7] text-white shadow-[0_0_8px_#a855f7]'
                          : 'bg-[#091524] border border-[#00f0ff]/50 text-[#7dd3fc]'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span
                          className={`text-xs font-bold ${
                            isFirst || isLast
                              ? 'text-white neon-text-subtle'
                              : isTransfer
                              ? 'text-purple-300'
                              : 'text-slate-300'
                          }`}
                        >
                          {step.station.name}
                        </span>
                        {isFirst && (
                          <span className="mr-2 text-[10px] text-[#00f0ff] bg-[#071322] px-1.5 py-0.5 rounded border border-[#00f0ff]/30">
                            محطة الركوب
                          </span>
                        )}
                        {isLast && (
                          <span className="mr-2 text-[10px] text-[#38bdf8] bg-[#071322] px-1.5 py-0.5 rounded border border-[#38bdf8]/30">
                            محطة الوصول
                          </span>
                        )}
                        {isTransfer && !isFirst && !isLast && (
                          <span className="mr-2 text-[10px] text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/40">
                            محطة تبادلية
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Subscriptions Modal */}
      <SubscriptionsModal
        isOpen={isSubscriptionsModalOpen}
        onClose={() => setIsSubscriptionsModalOpen(false)}
        initialModeId={selectedModeId}
      />
    </div>
  );
};
