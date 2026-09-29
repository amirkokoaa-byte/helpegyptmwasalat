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
    <footer className="bg-[#050810] border-t border-[#00f0ff]/30 text-slate-400 text-xs py-8 mt-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#091526] text-[#00f0ff] border border-[#00f0ff]/40 flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              <Train className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <div>
              <p className="font-bold text-white neon-text-subtle">
                عالم المواصلات في مصر الحديثة | Egypt Modern Transportation World © {new Date().getFullYear()}
              </p>
              <p className="text-[11px] text-[#7dd3fc]/80 font-mono">
                CYBERNETIC TRANSIT HUB // METRO · HIGH-SPEED TRAIN · MONORAIL · BRT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400 font-mono">
              OFFICIAL FARES 2026 // جميع الأسعار مطابقة لآخر تسعيرة
            </span>

            {/* Hidden admin trigger gear icon at the bottom of the screen */}
            <button
              type="button"
              onClick={handleAdminTrigger}
              className="p-2 rounded-lg text-[#00f0ff] opacity-35 hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none bg-[#0a1220] border border-[#00f0ff]/30 shadow-[0_0_6px_rgba(0,240,255,0.2)]"
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
