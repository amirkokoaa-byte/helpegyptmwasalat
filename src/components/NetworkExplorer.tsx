import React, { useState } from 'react';
import { Search, Train, Zap, Compass, Bus, MapPin, CheckCircle2, GitMerge, ListFilter } from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { TransportModeId } from '../types/transit';
import { NetworkGraphView } from './NetworkGraphView';

export const NetworkExplorer: React.FC = () => {
  const { modes, lines, stations, setStartStationId, setEndStationId, setSelectedModeId } = useTransit();
  const [viewMode, setViewMode] = useState<'graph' | 'directory'>('graph');
  const [selectedMode, setSelectedMode] = useState<TransportModeId>('metro');
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentLines = lines.filter((l) => l.modeId === selectedMode);

  const filteredStations = stations.filter((st) => {
    if (st.modeId !== selectedMode) return false;
    if (selectedLine !== 'all' && st.lineId !== selectedLine) return false;
    if (searchQuery.trim() && !st.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  const getLine = (lineId: string) => lines.find((l) => l.id === lineId);

  return (
    <div className="space-y-6">
      {/* Top Navigation & View Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              استكشاف شبكة المواصلات وعقد التبادل
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              تصفح خريطة الشبكة ومسارات الربط التفاعلية بين المترو، LRT، والمونوريل.
            </p>
          </div>

          {/* Segmented View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'graph'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>مخطط الشبكة (Flowchart Graph)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('directory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'directory'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>دليل وبحث المحطات</span>
            </button>
          </div>
        </div>

        {/* Filters shown in directory mode */}
        {viewMode === 'directory' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Mode selector */}
            <div className="flex flex-wrap gap-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSelectedMode(mode.id);
                    setSelectedLine('all');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    selectedMode === mode.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{mode.name}</span>
                </button>
              ))}
            </div>

            {/* Search & line filter */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن أي محطة بالاسم..."
                  className="w-full h-10 pr-9 pl-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">كافة الخطوط والمسارات</option>
                {currentLines.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: Visual Network Graph & Flowchart */}
      {viewMode === 'graph' && <NetworkGraphView />}

      {/* VIEW 2: Stations Directory Grid */}
      {viewMode === 'directory' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStations.map((st) => {
            const line = getLine(st.lineId);
            return (
              <div
                key={st.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: line?.color || '#3b82f6' }}
                      />
                      <h3 className="font-bold text-sm text-slate-900">{st.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">#{st.order}</span>
                  </div>

                  <div className="text-xs text-slate-500 mb-3 space-y-1">
                    <p className="line-clamp-1">{line?.name}</p>
                    {st.isInterchange && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        ⚡ محطة تبادلية كبرى
                      </div>
                    )}
                    {st.notes && <p className="text-[11px] text-slate-400">{st.notes}</p>}
                  </div>
                </div>

                {/* Quick Actions to Planner */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">استخدم في الحاسبة:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModeId(st.modeId);
                        setStartStationId(st.id);
                      }}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium text-[11px] transition-colors"
                    >
                      انطلاق من هنا
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModeId(st.modeId);
                        setEndStationId(st.id);
                      }}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-medium text-[11px] transition-colors"
                    >
                      وصول إلى هنا
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'directory' && filteredStations.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
          لا توجد محطات مطابقة للبحث المحدد. جرب استخدام كلمات بحث أخرى.
        </div>
      )}
    </div>
  );
};

