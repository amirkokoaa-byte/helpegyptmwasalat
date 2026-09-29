import React from 'react';
import { DollarSign, ShieldAlert, HeartHandshake, Award, Users, Train, Zap, Compass, Bus } from 'lucide-react';
import { useTransit } from '../context/TransitContext';

export const FareGuide: React.FC = () => {
  const { modes, fareBrackets, setIsAdminModalOpen, isAdminAuthenticated, setIsAdminDashboardOpen } = useTransit();

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              دليل أسعار وشرائح تذاكر منظومة النقل الحديثة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              جدول رسمي بشرائح أسعار التذاكر طبقاً لعدد المحطات وتحديثات وزارة النقل المصرية والهيئة القومية للأنفاق.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isAdminAuthenticated) {
                setIsAdminDashboardOpen(true);
              } else {
                setIsAdminModalOpen(true);
              }
            }}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            تعديل الأسعار (لوحة الإدارة)
          </button>
        </div>
      </div>

      {/* Grid of Fare Tables for each mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {modes.map((mode) => {
          const modeBrackets = fareBrackets
            .filter((b) => b.modeId === mode.id)
            .sort((a, b) => a.minStations - b.minStations);

          return (
            <div
              key={mode.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <h3 className="font-bold text-sm">{mode.name}</h3>
                  </div>
                  <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded text-slate-300 font-medium">
                    {mode.badge}
                  </span>
                </div>

                <div className="p-4">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="pb-2">الشريحة</th>
                        <th className="pb-2">نطاق المحطات</th>
                        <th className="pb-2 text-left">سعر التذكرة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modeBrackets.map((b, idx) => (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 font-medium text-slate-800">
                            الشريحة {idx + 1}
                          </td>
                          <td className="py-2.5 text-slate-600">
                            {b.maxStations >= 900
                              ? `أكثر من ${b.minStations - 1} محطة`
                              : `من ${b.minStations} إلى ${b.maxStations} محطة`}
                          </td>
                          <td className="py-2.5 text-left">
                            <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 tabular-nums">
                              {b.price} جنيه
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
                {mode.id === 'metro'
                  ? 'صالحة للركوب والانتقال بين الخطوط الثلاثة ضمن المسار المحسوب.'
                  : mode.id === 'lrt_train'
                  ? 'ربط مباشر وسريع بين محطة عدلي منصور المركزية ومدن شرق القاهرة.'
                  : mode.id === 'monorail'
                  ? 'نظام تذاكر ممغنط وبوابات إلكترونية ذكية على طول مسار المونوريل.'
                  : 'تذكرة فورية أو بكارت ذكي مدفوع مسبقاً داخل محطات الدائري.'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Social Support & Subsidized Fares */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-rose-500" />
          الفئات المعفاة والمخفضة والاشتراكات الحكومية
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              كبار السن (فوق 60 سنة)
            </div>
            <p className="text-slate-600 leading-relaxed">
              تخفيض بنسبة <strong>50%</strong> على جميع شرائح التذاكر بموجب بطاقة الرقم القومي، ومجاناً لمن هم فوق سن 70 عاماً.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
              ذوو الاحتياجات الخاصة (قادرون باختلاف)
            </div>
            <p className="text-slate-600 leading-relaxed">
              سعر رمزي موحد (<strong>50 قرشاً / 5 جنيهات</strong> حسب المشروع) بموجب كارنيه الخدمات المتكاملة.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              اشتراكات الطلبة والجامعات
            </div>
            <p className="text-slate-600 leading-relaxed">
              دعم حكومي يصل إلى <strong>98%</strong> على الاشتراكات الربع سنوية لطلبة المدارس والجامعات والمعاهد المعتمدة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
