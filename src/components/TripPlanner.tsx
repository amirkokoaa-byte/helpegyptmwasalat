import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  Train,
  Zap,
  Compass,
  Bus,
  MapPin,
  ChevronDown,
  Search,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { TransportModeId } from '../types/transit';

export const TripPlanner: React.FC = () => {
  const {
    modes,
    lines,
    stations,
    selectedModeId,
    setSelectedModeId,
    startStationId,
    setStartStationId,
    endStationId,
    setEndStationId,
    swapStations,
    clearSelection,
  } = useTransit();

  const [startSearch, setStartSearch] = useState('');
  const [endSearch, setEndSearch] = useState('');

  // Current mode
  const currentMode = modes.find((m) => m.id === selectedModeId) || modes[0];

  // Available lines for current mode
  const modeLines = useMemo(() => {
    return lines.filter((l) => l.modeId === selectedModeId);
  }, [lines, selectedModeId]);

  // Stations for current mode grouped by line
  const groupedStations = useMemo(() => {
    const modeStations = stations.filter((s) => s.modeId === selectedModeId);
    const groups: { lineName: string; lineColor: string; stations: typeof stations }[] = [];

    modeLines.forEach((line) => {
      const lineSts = modeStations
        .filter((s) => s.lineId === line.id)
        .sort((a, b) => a.order - b.order);
      if (lineSts.length > 0) {
        groups.push({
          lineName: line.name,
          lineColor: line.color,
          stations: lineSts,
        });
      }
    });

    return groups;
  }, [stations, modeLines, selectedModeId]);

  // Flattened stations for simple lookup
  const currentModeStations = useMemo(() => {
    return stations.filter((s) => s.modeId === selectedModeId);
  }, [stations, selectedModeId]);

  const startStation = currentModeStations.find((s) => s.id === startStationId);
  const endStation = currentModeStations.find((s) => s.id === endStationId);

  // Popular quick-select stations for each mode
  const popularStationIds = useMemo(() => {
    let targetNames: string[] = [];
    if (selectedModeId === 'metro') {
      targetNames = ['السادات', 'الشهداء', 'العتبة', 'عدلي منصور', 'جامعة القاهرة'];
    } else if (selectedModeId === 'lrt_train') {
      targetNames = ['العين السخنة', 'العاصمة الإدارية الجديدة', 'الإسكندرية', 'العلمين'];
    } else if (selectedModeId === 'monorail') {
      targetNames = ['الإستاد', 'المشير طنطاوي', 'مدينة الفنون والثقافة', 'مدينة العدالة'];
    } else {
      targetNames = ['إسكندرية الزراعي', 'عدلي منصور', 'كارفور المعادي', 'الهرم'];
    }

    const matchedIds: string[] = [];
    targetNames.forEach((targetName) => {
      const found = currentModeStations.find((s) => s.name.trim() === targetName.trim());
      if (found) matchedIds.push(found.id);
    });
    return matchedIds;
  }, [selectedModeId, currentModeStations]);

  const getModeIcon = (id: TransportModeId) => {
    switch (id) {
      case 'metro':
        return <Train className="w-5 h-5 text-[#00f0ff]" />;
      case 'lrt_train':
        return <Zap className="w-5 h-5 text-[#00f0ff]" />;
      case 'monorail':
        return <Compass className="w-5 h-5 text-[#00f0ff]" />;
      case 'brt':
        return <Bus className="w-5 h-5 text-[#00f0ff]" />;
    }
  };

  return (
    <div className="bg-[#0b101b] rounded-2xl border border-[#00f0ff]/40 p-3.5 sm:p-6 lg:p-7 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative overflow-hidden">
      {/* Subtle corner tech accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(ellipse_at_top_right,rgba(0,240,255,0.15),transparent_70%)] pointer-events-none"></div>

      {/* Step 1: Project / Transport Mode Selector with glowing dropdown & buttons */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] inline-block animate-pulse"></span>
            <span className="neon-text-subtle tracking-wide">اختيار مشروع وسيلة المواصلات:</span>
          </label>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#00f0ff] bg-[#071322] px-2 sm:px-2.5 py-0.5 rounded border border-[#00f0ff]/40">
            {currentModeStations.length} STATIONS
          </span>
        </div>

        {/* Dynamic Project Selection Dropdown Menu (Available on all screen sizes with neon border and text) */}
        <div className="mb-3">
          <div className="relative">
            <select
              value={selectedModeId}
              onChange={(e) => setSelectedModeId(e.target.value as TransportModeId)}
              className="w-full h-11 sm:h-12 bg-[#080d18] text-[#00f0ff] font-extrabold text-xs sm:text-sm rounded-xl px-3.5 sm:px-4 py-2 border-2 border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.4)] focus:outline-none appearance-none cursor-pointer"
            >
              {modes.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0b1220] text-slate-100 font-bold py-1">
                  {m.name} ({m.badge}) - {m.subtitle}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#00f0ff] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Mode cards / glowing buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {modes.map((mode) => {
            const isSelected = selectedModeId === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedModeId(mode.id)}
                className={`flex flex-col text-right p-2.5 sm:p-3.5 rounded-xl transition-all relative ${
                  isSelected
                    ? 'border-2 border-[#00f0ff] bg-[#0d1728] shadow-[0_0_15px_rgba(0,240,255,0.5),inset_0_0_10px_rgba(0,240,255,0.2)]'
                    : 'border border-[#00f0ff]/25 hover:border-[#00f0ff]/60 bg-[#080c16]/80 hover:bg-[#0c1424]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#00f0ff] text-[#060911] shadow-[0_0_12px_#00f0ff]'
                        : 'bg-[#0b1322] border border-[#00f0ff]/40 text-[#00f0ff]'
                    }`}
                  >
                    {getModeIcon(mode.id)}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded font-bold ${
                      isSelected
                        ? 'bg-[#00f0ff] text-[#060911]'
                        : 'bg-[#0c182a] text-[#38bdf8] border border-[#00f0ff]/30'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>
                <span
                  className={`font-extrabold text-xs sm:text-sm leading-snug transition-colors line-clamp-1 ${
                    isSelected ? 'neon-text-blue' : 'text-slate-200'
                  }`}
                >
                  {mode.name}
                </span>
                <span className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 line-clamp-1 font-mono">
                  {mode.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Brief Info Bar with Glowing Neon Line */}
      <div className="mb-5 sm:mb-6 p-2.5 sm:p-3.5 rounded-xl bg-[#080e1b] border border-[#00f0ff]/30 flex items-start gap-2.5 text-xs text-slate-300 shadow-[inset_0_0_10px_rgba(0,240,255,0.08)]">
        <Info className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5 animate-pulse" />
        <div className="leading-relaxed text-[11px] sm:text-xs">
          <strong className="text-[#00f0ff] ml-1">{currentMode.name}:</strong>
          {currentMode.description}
        </div>
      </div>

      {/* Step 2: Station Selectors (Ride & Drop-off) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 sm:gap-3.5 items-end">
        {/* Ride Station (محطة الركوب) */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] inline-block shadow-[0_0_6px_#00f0ff]"></span>
              <span className="neon-text-subtle">محطة الركوب (البداية)</span>
            </label>
            {startStation && (
              <span className="text-[10px] sm:text-[11px] text-[#00f0ff] bg-[#071526] px-2 py-0.5 rounded font-medium border border-[#00f0ff]/40 shadow-[0_0_6px_rgba(0,240,255,0.2)] truncate max-w-[140px]">
                {lines.find((l) => l.id === startStation.lineId)?.name.split('(')[0] || 'خط المسار'}
              </span>
            )}
          </div>

          <div className="relative">
            <select
              value={startStationId}
              onChange={(e) => setStartStationId(e.target.value)}
              className="w-full h-11 sm:h-12 bg-[#060a13] border border-[#00f0ff]/60 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.25)] transition-all appearance-none cursor-pointer truncate"
            >
              <option value="" disabled className="bg-[#0b101b] text-slate-400">
                -- حدد محطة الركوب --
              </option>
              {groupedStations.map((group) => (
                <optgroup key={group.lineName} label={`📍 ${group.lineName}`} className="bg-[#0b1220] text-[#00f0ff] font-bold">
                  {group.stations.map((station) => (
                    <option key={station.id} value={station.id} className="bg-[#080d18] text-slate-200">
                      {station.name} {station.isInterchange ? '⚡ (تبادلية)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#00f0ff]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Swap Button: Full width tap target on mobile, compact square on desktop */}
        <div className="flex justify-center pb-0.5">
          <button
            type="button"
            onClick={swapStations}
            disabled={!startStationId || !endStationId}
            title="تبديل محطة الركوب والنزول"
            className="w-full md:w-11 h-11 md:h-11 rounded-xl bg-[#09121f] hover:bg-[#00f0ff] hover:text-[#060911] border border-[#00f0ff]/60 text-[#00f0ff] flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-[0_0_12px_rgba(0,240,255,0.35)] active:scale-95 cursor-pointer px-3 md:px-0"
          >
            <ArrowUpDown className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-180 duration-300 shrink-0" />
            <span className="md:hidden text-xs font-bold font-mono">تبديل محطة الركوب والنزول</span>
          </button>
        </div>

        {/* Drop-off Station (محطة النزول) */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] inline-block shadow-[0_0_6px_#38bdf8]"></span>
              <span className="neon-text-subtle">محطة النزول (الوصول)</span>
            </label>
            {endStation && (
              <span className="text-[10px] sm:text-[11px] text-[#38bdf8] bg-[#071526] px-2 py-0.5 rounded font-medium border border-[#38bdf8]/40 shadow-[0_0_6px_rgba(56,189,248,0.2)] truncate max-w-[140px]">
                {lines.find((l) => l.id === endStation.lineId)?.name.split('(')[0] || 'خط المسار'}
              </span>
            )}
          </div>

          <div className="relative">
            <select
              value={endStationId}
              onChange={(e) => setEndStationId(e.target.value)}
              className="w-full h-11 sm:h-12 bg-[#060a13] border border-[#00f0ff]/60 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.25)] transition-all appearance-none cursor-pointer truncate"
            >
              <option value="" disabled className="bg-[#0b101b] text-slate-400">
                -- حدد محطة النزول --
              </option>
              {groupedStations.map((group) => (
                <optgroup key={group.lineName} label={`📍 ${group.lineName}`} className="bg-[#0b1220] text-[#00f0ff] font-bold">
                  {group.stations.map((station) => (
                    <option key={station.id} value={station.id} className="bg-[#080d18] text-slate-200">
                      {station.name} {station.isInterchange ? '⚡ (تبادلية)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#00f0ff]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Select Popular Stations */}
      <div className="mt-5 pt-4 border-t border-[#00f0ff]/20 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#00f0ff] flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
          محطات مقترحة:
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {popularStationIds.map((id) => {
            const st = stations.find((s) => s.id === id);
            if (!st) return null;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  if (!startStationId) {
                    setStartStationId(st.id);
                  } else if (!endStationId) {
                    setEndStationId(st.id);
                  } else {
                    setEndStationId(st.id);
                  }
                }}
                className="min-h-[32px] sm:min-h-[36px] px-2.5 sm:px-3 py-1 text-xs rounded-lg bg-[#091422] hover:bg-[#00f0ff] hover:text-[#060911] text-[#7dd3fc] transition-all border border-[#00f0ff]/30 font-medium shadow-[0_0_6px_rgba(0,240,255,0.15)] active:scale-95 cursor-pointer"
              >
                {st.name}
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-auto sm:mr-auto mt-2 sm:mt-0 flex justify-end">
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-slate-400 hover:text-[#00f0ff] flex items-center gap-1 py-1.5 px-2 transition-colors font-mono cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            RESET // إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
};
