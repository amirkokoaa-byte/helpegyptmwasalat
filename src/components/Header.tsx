import React from 'react';
import { Settings, Train, ShieldCheck, Compass, MapPin } from 'lucide-react';
import { useTransit } from '../context/TransitContext';

interface HeaderProps {
  activeTab: 'planner' | 'explorer' | 'fares';
  setActiveTab: (tab: 'planner' | 'explorer' | 'fares') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { setIsAdminModalOpen, isAdminAuthenticated, setIsAdminDashboardOpen } = useTransit();

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand Zone */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 shrink-0">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <a href="#" className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-blue-200 transition-colors block">
                مواصلات مصر الحديثة
              </a>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
                الدليل الذكي لتذاكر ومحطات المترو والقطار والمونوريل
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'planner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              حاسبة الرحلات والتذاكر
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'explorer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              استكشاف المحطات والخطوط
            </button>
            <button
              onClick={() => setActiveTab('fares')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'fares'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              دليل أسعار الشرائح
            </button>
          </nav>

          {/* Zone 3: Actions & Hidden Admin Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdminAuthenticated && (
              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>لوحة الإدارة مفعلة</span>
              </button>
            )}

            {/* Hidden admin gear icon with low opacity */}
            <button
              onClick={handleAdminClick}
              aria-label="إعدادات النظام"
              title="لوحة الإدارة"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center opacity-25 hover:opacity-100 focus:opacity-100 transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 transition-transform hover:rotate-45" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-1.5 px-2 rounded text-center whitespace-nowrap font-medium transition-colors ${
              activeTab === 'planner'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            حاسبة التذاكر
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex-1 py-1.5 px-2 rounded text-center whitespace-nowrap font-medium transition-colors ${
              activeTab === 'explorer'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            استكشاف المحطات
          </button>
          <button
            onClick={() => setActiveTab('fares')}
            className={`flex-1 py-1.5 px-2 rounded text-center whitespace-nowrap font-medium transition-colors ${
              activeTab === 'fares'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            دليل الشرائح
          </button>
        </div>
      </div>
    </header>
  );
};
