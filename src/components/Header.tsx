import React, { useState } from 'react';
import { Settings, Train, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useTransit } from '../context/TransitContext';

interface HeaderProps {
  activeTab: 'planner' | 'explorer' | 'fares';
  setActiveTab: (tab: 'planner' | 'explorer' | 'fares') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { setIsAdminModalOpen, isAdminAuthenticated, setIsAdminDashboardOpen } = useTransit();
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>('ar');

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#070b13]/95 backdrop-blur-md border-b border-[#00f0ff]/30 text-white shadow-[0_4px_25px_rgba(0,0,0,0.8),0_1px_10px_rgba(0,240,255,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand Zone with glowing title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#09121f] border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.6)] shrink-0">
              <Train className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <a
                href="#"
                className="text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-white hover:text-[#00f0ff] transition-colors block neon-text-blue"
              >
                عالم المواصلات في مصر الحديثة | Egypt Modern Transportation World
              </a>
              <p className="text-[10px] sm:text-xs text-[#7dd3fc] opacity-80 hidden sm:block font-mono">
                SMART TRANSIT NETWORK // METRO · HIGH-SPEED TRAIN · MONORAIL · BRT
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2 bg-[#0a101d] p-1 rounded-xl border border-[#00f0ff]/40 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]">
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'planner'
                  ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_15px_rgba(0,240,255,0.7)]'
                  : 'text-slate-300 hover:text-[#00f0ff] hover:bg-[#0f1b2f]'
              }`}
            >
              حاسبة الرحلات والتذاكر
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'explorer'
                  ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_15px_rgba(0,240,255,0.7)]'
                  : 'text-slate-300 hover:text-[#00f0ff] hover:bg-[#0f1b2f]'
              }`}
            >
              استكشاف المحطات والخطوط
            </button>
            <button
              onClick={() => setActiveTab('fares')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'fares'
                  ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_15px_rgba(0,240,255,0.7)]'
                  : 'text-slate-300 hover:text-[#00f0ff] hover:bg-[#0f1b2f]'
              }`}
            >
              دليل أسعار الشرائح
            </button>
          </nav>

          {/* Zone 3: Language Links & Subtle Admin Gear */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selection Links: عربي | English (subtly glowing) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b1323] border border-[#00f0ff]/30 text-xs shadow-[0_0_8px_rgba(0,240,255,0.2)]">
              <Globe className="w-3.5 h-3.5 text-[#00f0ff]" />
              <button
                type="button"
                onClick={() => setCurrentLang('ar')}
                className={`transition-all font-bold ${
                  currentLang === 'ar'
                    ? 'text-[#00f0ff] neon-text-subtle underline underline-offset-4 decoration-[#00f0ff]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                عربي
              </button>
              <span className="text-[#00f0ff]/40">|</span>
              <button
                type="button"
                onClick={() => setCurrentLang('en')}
                className={`transition-all font-medium ${
                  currentLang === 'en'
                    ? 'text-[#00f0ff] neon-text-subtle underline underline-offset-4 decoration-[#00f0ff]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
            </div>

            {isAdminAuthenticated && (
              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 text-xs font-mono shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ADMIN ACTIVE</span>
              </button>
            )}

            {/* Hidden admin gear icon: present, subtle and slightly glowing */}
            <button
              onClick={handleAdminClick}
              aria-label="إعدادات النظام المشرف"
              title="لوحة الإدارة (0000)"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center opacity-40 hover:opacity-100 focus:opacity-100 transition-all text-[#00f0ff] hover:text-white bg-[#0b1424] border border-[#00f0ff]/30 shadow-[0_0_8px_rgba(0,240,255,0.25)] hover:shadow-[0_0_16px_rgba(0,240,255,0.6)] focus:outline-none"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 transition-transform hover:rotate-90 duration-500" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden border-t border-[#00f0ff]/20 py-2 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center whitespace-nowrap font-bold transition-all ${
              activeTab === 'planner'
                ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'text-slate-300 hover:bg-[#0c1626]'
            }`}
          >
            حاسبة التذاكر
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center whitespace-nowrap font-bold transition-all ${
              activeTab === 'explorer'
                ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'text-slate-300 hover:bg-[#0c1626]'
            }`}
          >
            استكشاف المحطات
          </button>
          <button
            onClick={() => setActiveTab('fares')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center whitespace-nowrap font-bold transition-all ${
              activeTab === 'fares'
                ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'text-slate-300 hover:bg-[#0c1626]'
            }`}
          >
            دليل الشرائح
          </button>
        </div>
      </div>
    </header>
  );
};
