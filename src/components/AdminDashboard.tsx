import React, { useState } from 'react';
import {
  Shield,
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Layers,
  DollarSign,
  MapPin,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Train,
  Sliders,
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { TransportModeId, Station, FareBracket } from '../types/transit';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    logoutAdmin,
    modes,
    lines,
    stations,
    fareBrackets,
    addStation,
    updateStation,
    deleteStation,
    addFareBracket,
    updateFareBracket,
    deleteFareBracket,
    resetToDefaults,
    isDataCustomized,
  } = useTransit();

  const [activeTab, setActiveTab] = useState<'stations' | 'fares'>('fares');
  const [selectedModeFilter, setSelectedModeFilter] = useState<TransportModeId>('metro');
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('all');
  const [stationSearch, setStationSearch] = useState('');

  // Station Form State
  const [isStationFormOpen, setIsStationFormOpen] = useState(false);
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [stationFormData, setStationFormData] = useState({
    name: '',
    modeId: 'metro' as TransportModeId,
    lineId: 'metro_line_1',
    order: 1,
    isInterchange: false,
    notes: '',
  });

  // Fare Bracket Form State
  const [isFareFormOpen, setIsFareFormOpen] = useState(false);
  const [editingFareId, setEditingFareId] = useState<string | null>(null);
  const [fareFormData, setFareFormData] = useState({
    modeId: 'metro' as TransportModeId,
    minStations: 1,
    maxStations: 9,
    price: 8,
    label: 'من 1 إلى 9 محطات',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isAdminDashboardOpen) return null;

  // Filter stations
  const filteredStations = stations.filter((st) => {
    if (st.modeId !== selectedModeFilter) return false;
    if (selectedLineFilter !== 'all' && st.lineId !== selectedLineFilter) return false;
    if (stationSearch.trim() && !st.name.toLowerCase().includes(stationSearch.trim().toLowerCase())) return false;
    return true;
  });

  // Filter fare brackets
  const filteredBrackets = fareBrackets
    .filter((fb) => fb.modeId === selectedModeFilter)
    .sort((a, b) => a.minStations - b.minStations);

  // Available lines for current mode
  const currentModeLines = lines.filter((l) => l.modeId === selectedModeFilter);

  // Open station form for adding
  const handleOpenAddStation = () => {
    const defaultLine = currentModeLines[0]?.id || 'metro_line_1';
    const maxOrder = stations
      .filter((s) => s.lineId === defaultLine)
      .reduce((max, s) => Math.max(max, s.order), 0);

    setStationFormData({
      name: '',
      modeId: selectedModeFilter,
      lineId: defaultLine,
      order: maxOrder + 1,
      isInterchange: false,
      notes: '',
    });
    setEditingStationId(null);
    setIsStationFormOpen(true);
  };

  // Open station form for editing
  const handleOpenEditStation = (st: Station) => {
    setStationFormData({
      name: st.name,
      modeId: st.modeId,
      lineId: st.lineId,
      order: st.order,
      isInterchange: Boolean(st.isInterchange),
      notes: st.notes || '',
    });
    setEditingStationId(st.id);
    setIsStationFormOpen(true);
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationFormData.name.trim()) return;

    if (editingStationId) {
      updateStation(editingStationId, stationFormData);
      showToast(`تم تحديث محطة "${stationFormData.name}" بنجاح`);
    } else {
      addStation(stationFormData);
      showToast(`تمت إضافة محطة "${stationFormData.name}" بنجاح`);
    }
    setIsStationFormOpen(false);
    setEditingStationId(null);
  };

  // Open fare form for adding
  const handleOpenAddFare = () => {
    setFareFormData({
      modeId: selectedModeFilter,
      minStations: 1,
      maxStations: 10,
      price: 10,
      label: 'شريحة تسعير جديدة',
    });
    setEditingFareId(null);
    setIsFareFormOpen(true);
  };

  // Open fare form for editing
  const handleOpenEditFare = (fb: FareBracket) => {
    setFareFormData({
      modeId: fb.modeId,
      minStations: fb.minStations,
      maxStations: fb.maxStations,
      price: fb.price,
      label: fb.label,
    });
    setEditingFareId(fb.id);
    setIsFareFormOpen(true);
  };

  const handleSaveFare = (e: React.FormEvent) => {
    e.preventDefault();
    const label =
      fareFormData.maxStations >= 900
        ? `أكثر من ${fareFormData.minStations - 1} محطة`
        : `من ${fareFormData.minStations} إلى ${fareFormData.maxStations} محطة`;

    const dataToSave = {
      ...fareFormData,
      label: fareFormData.label || label,
    };

    if (editingFareId) {
      updateFareBracket(editingFareId, dataToSave);
      showToast('تم تحديث شريحة التسعير بنجاح');
    } else {
      addFareBracket(dataToSave);
      showToast('تمت إضافة شريحة التسعير بنجاح');
    }
    setIsFareFormOpen(false);
    setEditingFareId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-5xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top Navbar of Admin */}
        <div className="bg-slate-900 text-white px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-lg font-bold truncate">لوحة تحكم الإدارة</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono hidden sm:inline-block">
                  ADMIN AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate">
                إدارة محطات النقل والتحكم في شرائح التذاكر تنعكس فورياً في الحاسبة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {isDataCustomized && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل تريد بالتأكيد استعادة الإعدادات والأسعار الافتراضية؟')) {
                    resetToDefaults();
                    showToast('تمت استعادة البيانات الافتراضية');
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                title="استعادة البيانات الأصلية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الافتراضي</span>
              </button>
            )}

            <button
              type="button"
              onClick={logoutAdmin}
              className="p-1.5 sm:p-2 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="تسجيل الخروج من الإدارة"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsAdminDashboardOpen(false)}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="إغلاق اللوحة والعودة للموقع"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 animate-in slide-in-from-top">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dashboard Body: Sidebar + Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Admin Sidebar */}
          <aside className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 p-3 sm:p-4 shrink-0 flex flex-col justify-between max-h-44 md:max-h-none overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 sm:mb-2">
                  أقسام التحكم
                </span>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('fares')}
                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeTab === 'fares'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2 truncate">
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>أسعار التذاكر</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-80 shrink-0">
                      {fareBrackets.filter((b) => b.modeId === selectedModeFilter).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('stations')}
                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeTab === 'stations'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>المحطات والخطوط</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-80 shrink-0">
                      {stations.filter((s) => s.modeId === selectedModeFilter).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mode Switcher inside Admin */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  المشروع المستهدف
                </span>
                <div className="space-y-1">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setSelectedModeFilter(mode.id);
                        setSelectedLineFilter('all');
                      }}
                      className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedModeFilter === mode.id
                          ? 'bg-white text-blue-900 border border-blue-200 shadow-2xs font-bold'
                          : 'text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick stats & storage badge */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              <div className="flex items-center justify-between mb-1">
                <span>المحطات المحفوظة:</span>
                <span className="font-bold tabular-nums text-slate-700">{stations.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span>الشرائح السعرية:</span>
                <span className="font-bold tabular-nums text-slate-700">{fareBrackets.length}</span>
              </div>
              <div className="text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-200 text-center font-medium">
                ✓ التعديلات مرتبطة تلقائياً بالذاكرة المحلية (Local Storage)
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* TAB 1: FARE BRACKETS MANAGEMENT */}
            {activeTab === 'fares' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      تعديل شرائح أسعار التذاكر: {modes.find((m) => m.id === selectedModeFilter)?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      حدد سعر التذكرة بناءً على عدد المحطات (مثلاً: من 1 إلى 9 محطات = 8 جنيه)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddFare}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة شريحة تسعير</span>
                  </button>
                </div>

                {/* Brackets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredBrackets.map((bracket) => (
                    <div
                      key={bracket.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">
                            {bracket.label}
                          </span>
                          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 tabular-nums">
                            {bracket.price} ج.م
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 space-y-1 mb-4">
                          <div className="flex justify-between">
                            <span>الحد الأدنى للمحطات:</span>
                            <span className="font-semibold text-slate-700 tabular-nums">{bracket.minStations}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>الحد الأقصى للمحطات:</span>
                            <span className="font-semibold text-slate-700 tabular-nums">
                              {bracket.maxStations >= 900 ? 'مفتوح (أكثر)' : bracket.maxStations}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFare(bracket)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل تريد حذف هذه الشريحة السعرية؟')) {
                              deleteFareBracket(bracket.id);
                              showToast('تم حذف شريحة التسعير');
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredBrackets.length === 0 && (
                  <div className="text-center p-8 bg-slate-50 rounded-xl text-slate-400 text-xs">
                    لا توجد شرائح تسعير محددة لهذا المشروع حالياً. أضف شريحة جديدة.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: STATIONS MANAGEMENT */}
            {activeTab === 'stations' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      إدارة محطات: {modes.find((m) => m.id === selectedModeFilter)?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      إضافة، تعديل مسميات، تحديد المحطات التبادلية أو حذف المحطات
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddStation}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة محطة جديدة</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={stationSearch}
                    onChange={(e) => setStationSearch(e.target.value)}
                    placeholder="ابحث عن محطة..."
                    className="h-9 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                  />

                  <select
                    value={selectedLineFilter}
                    onChange={(e) => setSelectedLineFilter(e.target.value)}
                    className="h-9 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">كل خطوط هذا المشروع</option>
                    {currentModeLines.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.name}
                      </option>
                    ))}
                  </select>

                  <span className="text-xs text-slate-400 mr-auto">
                    إجمالي النتائج: {filteredStations.length} محطة
                  </span>
                </div>

                {/* Stations Table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto max-h-[50vh]">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0 z-10">
                        <tr>
                          <th className="p-3">الترتيب</th>
                          <th className="p-3">اسم المحطة</th>
                          <th className="p-3">الخط التابع</th>
                          <th className="p-3">النوع / التبادل</th>
                          <th className="p-3 text-left">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStations.map((st) => {
                          const line = lines.find((l) => l.id === st.lineId);
                          return (
                            <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-3 font-mono font-bold text-slate-500 tabular-nums">
                                #{st.order}
                              </td>
                              <td className="p-3 font-bold text-slate-800">
                                {st.name}
                              </td>
                              <td className="p-3 text-slate-600">
                                <span className="inline-flex items-center gap-1.5">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: line?.color || '#94a3b8' }}
                                  />
                                  <span>{line?.name.split('(')[0] || st.lineId}</span>
                                </span>
                              </td>
                              <td className="p-3">
                                {st.isInterchange ? (
                                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                    ⚡ محطة تبادلية
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">محطة عادية</span>
                                )}
                              </td>
                              <td className="p-3 text-left">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditStation(st)}
                                    className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                    title="تعديل"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`هل أنت متأكد من حذف محطة "${st.name}"؟`)) {
                                        deleteStation(st.id);
                                        showToast(`تم حذف محطة ${st.name}`);
                                      }
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* POPUP MODAL: Add/Edit Station */}
      {isStationFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-sm text-slate-900">
                {editingStationId ? 'تعديل بيانات المحطة' : 'إضافة محطة جديدة'}
              </h4>
              <button
                type="button"
                onClick={() => setIsStationFormOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStation} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">اسم المحطة</label>
                <input
                  type="text"
                  required
                  value={stationFormData.name}
                  onChange={(e) => setStationFormData({ ...stationFormData, name: e.target.value })}
                  placeholder="مثال: محطة الأوبرا"
                  className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">الخط التابع</label>
                <select
                  value={stationFormData.lineId}
                  onChange={(e) => setStationFormData({ ...stationFormData, lineId: e.target.value })}
                  className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  {lines.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ترتيب المحطة على المسار</label>
                <input
                  type="number"
                  min={1}
                  value={stationFormData.order}
                  onChange={(e) => setStationFormData({ ...stationFormData, order: parseInt(e.target.value) || 1 })}
                  className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isInterchangeCheck"
                  checked={stationFormData.isInterchange}
                  onChange={(e) => setStationFormData({ ...stationFormData, isInterchange: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isInterchangeCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  محطة تبادلية (Interchange) تسمح بالانتقال لخط آخر
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStationFormOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm"
                >
                  حفظ المحطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add/Edit Fare Bracket */}
      {isFareFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-sm text-slate-900">
                {editingFareId ? 'تعديل شريحة تسعير' : 'إضافة شريحة تسعير جديدة'}
              </h4>
              <button
                type="button"
                onClick={() => setIsFareFormOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFare} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">من محطة (الحد الأدنى)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={fareFormData.minStations}
                    onChange={(e) => setFareFormData({ ...fareFormData, minStations: parseInt(e.target.value) || 1 })}
                    className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">إلى محطة (الحد الأقصى)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={fareFormData.maxStations}
                    onChange={(e) => setFareFormData({ ...fareFormData, maxStations: parseInt(e.target.value) || 1 })}
                    className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">سعر التذكرة (بالجنيه المصري)</label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  required
                  value={fareFormData.price}
                  onChange={(e) => setFareFormData({ ...fareFormData, price: parseFloat(e.target.value) || 1 })}
                  className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono text-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">اسم / وصف الشريحة</label>
                <input
                  type="text"
                  value={fareFormData.label}
                  onChange={(e) => setFareFormData({ ...fareFormData, label: e.target.value })}
                  placeholder="مثال: من 1 إلى 9 محطات"
                  className="w-full h-10 px-3 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFareFormOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm"
                >
                  حفظ الشريحة السعرية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
