import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  HeartHandshake,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Shield,
  Train,
} from 'lucide-react';
import { TransportModeId } from '../types/transit';
import { SUBSCRIPTIONS_DATA } from '../utils/pricing';

interface SubscriptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModeId: TransportModeId;
}

export const SubscriptionsModal: React.FC<SubscriptionsModalProps> = ({
  isOpen,
  onClose,
  initialModeId,
}) => {
  const [selectedMode, setSelectedMode] = useState<TransportModeId>(initialModeId);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'student' | 'special' | 'regular' | 'wallet'>('student');

  useEffect(() => {
    setSelectedMode(initialModeId);
    // If selected mode doesn't have student passes (like Monorail), default to regular or special
    const modeData = SUBSCRIPTIONS_DATA[initialModeId];
    if (!modeData?.studentPasses && modeData?.regularPasses) {
      setActiveCategoryTab('regular');
    } else if (modeData?.studentPasses) {
      setActiveCategoryTab('student');
    } else {
      setActiveCategoryTab('special');
    }
  }, [initialModeId, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentData = SUBSCRIPTIONS_DATA[selectedMode];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] bg-[#090e18] rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.4)] border border-[#00f0ff] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#070c16] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#00f0ff]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#091526] border border-[#00f0ff] text-[#00f0ff] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)] shrink-0">
              <Sparkles className="w-5 h-5 text-[#00f0ff] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg neon-text-blue">
                  دليل الاشتراكات والفئات الخاصة الرسمية
                </h3>
                <span className="text-[11px] bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/40 px-2 py-0.5 rounded font-mono font-medium">
                  {currentData.badge}
                </span>
              </div>
              <p className="text-xs text-[#7dd3fc]/80 font-mono">
                تسعيرة الاشتراكات المعتمدة، خصومات الطلبة، كبار السن، وذوي الاحتياجات الخاصة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#00f0ff] hover:bg-[#0f1b2f] border border-transparent hover:border-[#00f0ff]/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Selector Bar (Quick Switch) */}
        <div className="bg-[#09101d] border-b border-[#00f0ff]/20 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[#00f0ff] font-mono font-bold shrink-0">PROJECT // المشروع:</span>
          {(['metro', 'monorail', 'brt', 'lrt_train'] as TransportModeId[]).map((modeKey) => {
            const data = SUBSCRIPTIONS_DATA[modeKey];
            const isSelected = selectedMode === modeKey;
            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => {
                  setSelectedMode(modeKey);
                  if (modeKey === 'monorail') {
                    setActiveCategoryTab('regular');
                  } else if (data.studentPasses) {
                    setActiveCategoryTab('student');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_12px_rgba(0,240,255,0.7)] font-black'
                    : 'bg-[#080d18] text-slate-300 hover:text-[#00f0ff] hover:bg-[#0c1626] border border-[#00f0ff]/30'
                }`}
              >
                {data.title}
              </button>
            );
          })}
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-[#00f0ff]/20 bg-[#070b14] px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          {currentData.studentPasses && (
            <button
              type="button"
              onClick={() => setActiveCategoryTab('student')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap font-mono ${
                activeCategoryTab === 'student'
                  ? 'border-[#00f0ff] text-[#00f0ff] font-bold shadow-[0_1px_8px_rgba(0,240,255,0.4)]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#00f0ff]" />
              <span>اشتراكات الطلاب ({currentData.studentPasses.length})</span>
            </button>
          )}

          {currentData.regularPasses && (
            <button
              type="button"
              onClick={() => setActiveCategoryTab('regular')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap font-mono ${
                activeCategoryTab === 'regular'
                  ? 'border-[#00f0ff] text-[#00f0ff] font-bold shadow-[0_1px_8px_rgba(0,240,255,0.4)]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#00f0ff]" />
              <span>الاشتراكات العادية (أسبوعي/شهري)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveCategoryTab('special')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap font-mono ${
              activeCategoryTab === 'special'
                ? 'border-[#00f0ff] text-[#00f0ff] font-bold shadow-[0_1px_8px_rgba(0,240,255,0.4)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#00f0ff]" />
            <span>الفئات الخاصة والتخفيضات</span>
          </button>

          {currentData.cashWalletInfo && (
            <button
              type="button"
              onClick={() => setActiveCategoryTab('wallet')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap font-mono ${
                activeCategoryTab === 'wallet'
                  ? 'border-[#00f0ff] text-[#00f0ff] font-bold shadow-[0_1px_8px_rgba(0,240,255,0.4)]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#00f0ff]" />
              <span>المحفظة النقدية والمزايا</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#090e18] text-slate-200">
          {/* TAB 1: Student Passes */}
          {activeCategoryTab === 'student' && currentData.studentPasses && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  اشتراكات الطلاب مدعومة حكومياً بنسبة تصل إلى <strong>95%</strong>. يتم استخراجها بموجب استمارة معتمدة من المدرسة أو الجامعة أو المعهد مع صورتين شخصيتين وبطاقة الرقم القومي.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">نوع الاشتراك</th>
                      <th className="p-3">المدة / عدد الرحلات</th>
                      <th className="p-3">نطاق التغطية</th>
                      <th className="p-3 text-left">قيمة الاشتراك</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentData.studentPasses.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-slate-900">
                          {item.type}
                          {item.notes && <p className="text-[11px] text-slate-400 font-normal">{item.notes}</p>}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{item.durationOrRides}</td>
                        <td className="p-3 text-slate-700">{item.coverage}</td>
                        <td className="p-3 text-left">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-extrabold font-mono text-xs tabular-nums">
                            {item.price}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Regular Passes (Monthly / Weekly / Quarterly) */}
          {activeCategoryTab === 'regular' && currentData.regularPasses && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  الاشتراكات العادية توفر حتى <strong>50%</strong> من تكلفة التذاكر اليومية للموظفين ورواد الأعمال المنتظمين عبر خطوط المترو والمونوريل.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">فئة الاشتراك</th>
                      <th className="p-3">الصلاحية</th>
                      <th className="p-3">نطاق المحطات</th>
                      <th className="p-3 text-left">السعر الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentData.regularPasses.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-slate-900">
                          {item.type}
                          {item.notes && <p className="text-[11px] text-slate-400 font-normal">{item.notes}</p>}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{item.durationOrRides}</td>
                        <td className="p-3 text-slate-700">{item.coverage}</td>
                        <td className="p-3 text-left">
                          <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-extrabold font-mono text-xs tabular-nums">
                            {item.price}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Special Categories */}
          {activeCategoryTab === 'special' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentData.specialCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-900">{cat.category}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {cat.discountRate}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-semibold text-blue-900 border border-slate-100 mb-2">
                        {cat.fare}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <strong>المستند المطلوب:</strong> {cat.requiredDocument}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 text-xs flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong>ملاحظة هامة لكبار السن (فوق 70 عاماً):</strong> السفر مجاني بالكامل بجميع خطوط المترو والوسائل الحكومية بموجب بطاقة الرقم القومي الشخصية.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Cash Wallet / Smart Card */}
          {activeCategoryTab === 'wallet' && currentData.cashWalletInfo && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-l from-slate-900 to-slate-800 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span>الكارت الذكي والمحفظة النقدية الإلكترونية</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold">
                    كارت المحفظة النقدية لـ {currentData.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    {currentData.cashWalletInfo.benefits}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-right shrink-0">
                  <span className="text-[11px] text-slate-300 block">سعر الكارت لأول مرة</span>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
                    {currentData.cashWalletInfo.cardPrice} جنيه
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">قيمة الشحن المتاحة:</span>
                  <p className="text-slate-600 font-medium">{currentData.cashWalletInfo.rechargeRange}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    يمكن إعادة شحن الرصيد من ماكينات TVM الذكية أو شبابيك المحطات في أي وقت.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">صلاحية الرصيد:</span>
                  <p className="text-slate-600 font-medium">رصيد ممتد غير منتهي الصلاحية</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    الرصيد يظل محفوظاً في شريحة الكارت ولا ينتهي بمرور الشهور طالما الكارت سليم.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>التعريفة الرسمية المعتمدة لوزارة النقل والهيئة القومية للأنفاق</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors shadow-2xs"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
