import React from 'react';
import { Settings, Train, Shield } from 'lucide-react';
import { useTransit } from '../context/TransitContext';

export const Footer: React.FC = () => {
  const { setIsAdminModalOpen, isAdminAuthenticated, setIsAdminDashboardOpen } = useTransit();

  const handleAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                عالم المواصلات في مصر الحديثة © {new Date().getFullYear()}
              </p>
              <p className="text-[11px] text-slate-400">
                منصة رقمية لحساب أسعار التذاكر وخطوط السير (مترو · قطار كهربائي · مونوريل · BRT)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">
              جميع الأسعار استرشادية طبقاً للتعريفة الرسمية
            </span>

            {/* Hidden admin trigger gear icon at the bottom of the screen */}
            <button
              type="button"
              onClick={handleAdminTrigger}
              className="p-2 rounded-lg text-slate-500 opacity-20 hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
              title="لوحة الإدارة (كلمة المرور: 0000)"
              aria-label="لوحة تحكم المشرف"
            >
              <Settings className="w-4 h-4 hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
