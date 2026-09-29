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

  // Filtered station list for ride (start)
  const filteredStartStations = useMemo(() => {
    if (!startSearch.trim()) return currentModeStations;
    return currentModeStations.filter((s) =>
      s.name.toLowerCase().includes(startSearch.trim().toLowerCase())
    );
  }, [currentModeStations, startSearch]);

  // Filtered station list for drop-off (end)
  const filteredEndStations = useMemo(() => {
    if (!endSearch.trim()) return currentModeStations;
    return currentModeStations.filter((s) =>
      s.name.toLowerCase().includes(endSearch.trim().toLowerCase())
    );
  }, [currentModeStations, endSearch]);

  const startStation = currentModeStations.find((s) => s.id === startStationId);
  const endStation = currentModeStations.find((s) => s.id === endStationId);

  // Popular quick-select stations for Cairo Metro / LRT / Monorail
  const popularStationIds = useMemo(() => {
    if (selectedModeId === 'metro') {
      return ['m1_19', 'm2_08', 'm2_09', 'm3_01', 'm2_15']; // Sadat, Shohadaa, Attaba, Adly Mansour, Cairo Univ
    } else if (selectedModeId === 'lrt_train') {
      return ['lrt_01', 'lrt_04', 'lrt_06', 'lrt_10']; // Adly Mansour, El-Shorouk, Badr, Arts & Culture
    } else if (selectedModeId === 'monorail') {
      return ['mono_e_01', 'mono_e_13', 'mono_e_18', 'mono_w_01', 'mono_w_09']; // Stadium, AUC, Arts, Wadi El-Nile, Hosary
    } else {
      return ['brt_01', 'brt_14', 'brt_16', 'brt_12']; // Adly Mansour, El-Moneeb, Maadi, Haram
    }
  }, [selectedModeId]);

  const getModeIcon = (id: TransportModeId) => {
    switch (id) {
      case 'metro':
        return <Train className="w-5 h-5" />;
      case 'lrt_train':
        return <Zap className="w-5 h-5" />;
      case 'monorail':
        return <Compass className="w-5 h-5" />;
      case 'brt':
        return <Bus className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all">
      {/* Step 1: Project / Transport Mode Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
            اختر وسيلة أو مشروع المواصلات
          </label>
          <span className="text-xs text-slate-500 font-medium">
            {currentModeStations.length} محطة متاحة
          </span>
        </div>

        {/* Mode cards / segmented selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {modes.map((mode) => {
            const isSelected = selectedModeId === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedModeId(mode.id)}
                className={`flex flex-col text-right p-3.5 rounded-xl border transition-all relative text-slate-800 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {getModeIcon(mode.id)}
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>
                <span className="font-bold text-sm text-slate-900 leading-snug">
                  {mode.name}
                </span>
                <span className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {mode.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Brief Info Bar */}
      <div className="mb-6 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800 ml-1">{currentMode.name}:</strong>
          {currentMode.description}
        </div>
      </div>

      {/* Step 2: Station Selectors (Ride & Drop-off) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3.5 items-end">
        {/* Ride Station (محطة الركوب) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-100"></span>
              محطة الركوب (البداية)
            </label>
            {startStation && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                {lines.find((l) => l.id === startStation.lineId)?.name.split('(')[0] || 'خط المسار'}
              </span>
            )}
          </div>

          <div className="relative">
            <select
              value={startStationId}
              onChange={(e) => setStartStationId(e.target.value)}
              className="w-full h-12 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none cursor-pointer"
            >
              <option value="" disabled>
                -- حدد محطة الركوب --
              </option>
              {groupedStations.map((group) => (
                <optgroup key={group.lineName} label={`📍 ${group.lineName}`}>
                  {group.stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name} {station.isInterchange ? '⚡ (تبادلية)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pb-0.5">
          <button
            type="button"
            onClick={swapStations}
            disabled={!startStationId || !endStationId}
            title="تبديل محطة الركوب والنزول"
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed group shadow-sm active:scale-95"
          >
            <ArrowUpDown className="w-5 h-5 transition-transform group-hover:rotate-180 duration-300" />
          </button>
        </div>

        {/* Drop-off Station (محطة النزول) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ring-2 ring-rose-100"></span>
              محطة النزول (الوصول)
            </label>
            {endStation && (
              <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-medium border border-rose-200">
                {lines.find((l) => l.id === endStation.lineId)?.name.split('(')[0] || 'خط المسار'}
              </span>
            )}
          </div>

          <div className="relative">
            <select
              value={endStationId}
              onChange={(e) => setEndStationId(e.target.value)}
              className="w-full h-12 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none cursor-pointer"
            >
              <option value="" disabled>
                -- حدد محطة النزول --
              </option>
              {groupedStations.map((group) => (
                <optgroup key={group.lineName} label={`📍 ${group.lineName}`}>
                  {group.stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name} {station.isInterchange ? '⚡ (تبادلية)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Select Popular Stations */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          محطات سريعة:
        </span>
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
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/60 font-medium"
            >
              {st.name}
            </button>
          );
        })}

        <div className="mr-auto">
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 py-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
};
