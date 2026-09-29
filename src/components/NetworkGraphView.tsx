import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitMerge,
  ArrowRight,
  Info,
  CheckCircle,
  Train,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { TransportModeId } from '../types/transit';

interface HubNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'super_hub' | 'major_interchange' | 'terminal';
  lines: string[];
  description: string;
  transferTimeMin: number;
}

interface GraphLink {
  from: string;
  to: string;
  lineId: string;
  color: string;
  name: string;
  label?: string;
  dashed?: boolean;
}

export const NetworkGraphView: React.FC = () => {
  const { lines, setStartStationId, setEndStationId, stations, setSelectedModeId } = useTransit();
  const [zoom, setZoom] = useState(1);
  const [selectedHub, setSelectedHub] = useState<HubNode | null>(null);
  const [activeLineFilter, setActiveLineFilter] = useState<string | null>(null);

  // Key Interchange Nodes / Hubs across the Egyptian transit system
  const hubs: HubNode[] = [
    {
      id: 'adly_mansour',
      name: 'محطة عدلي منصور المركزية',
      x: 780,
      y: 220,
      type: 'super_hub',
      lines: ['metro_line_3', 'lrt_line_1', 'brt_ring_road'],
      description: 'أكبر محطة تبادلية في الشرق الأوسط (تجمع الخط الثالث للمترو، القطار الخفيف LRT، والأتوبيس الترددي BRT)',
      transferTimeMin: 4,
    },
    {
      id: 'shohadaa',
      name: 'محطة الشهداء (رمسيس)',
      x: 480,
      y: 260,
      type: 'major_interchange',
      lines: ['metro_line_1', 'metro_line_2'],
      description: 'قلب القاهرة ومحطة التبادل الرئيسية بين الخط الأول والخط الثاني ومحطة مصر للقطارات',
      transferTimeMin: 3,
    },
    {
      id: 'attaba',
      name: 'محطة العتبة',
      x: 520,
      y: 330,
      type: 'major_interchange',
      lines: ['metro_line_2', 'metro_line_3'],
      description: 'نقطة التبادل الحيوية في وسط البلد بين الخط الثاني والخط الثالث',
      transferTimeMin: 3,
    },
    {
      id: 'sadat',
      name: 'محطة السادات (التحرير)',
      x: 450,
      y: 380,
      type: 'major_interchange',
      lines: ['metro_line_1', 'metro_line_2'],
      description: 'محطة ميدان التحرير التبادلية الكبرى بين الخط الأول والخط الثاني',
      transferTimeMin: 3,
    },
    {
      id: 'nasser',
      name: 'محطة جمال عبد الناصر',
      x: 470,
      y: 310,
      type: 'major_interchange',
      lines: ['metro_line_1', 'metro_line_3'],
      description: 'محطة تبادل شارع 26 يوليو بين الخط الأول والخط الثالث',
      transferTimeMin: 3,
    },
    {
      id: 'cairo_univ',
      name: 'محطة جامعة القاهرة',
      x: 350,
      y: 470,
      type: 'major_interchange',
      lines: ['metro_line_2', 'metro_line_3'],
      description: 'محطة التبادل بين الخط الثاني وتفريعة الخط الثالث الجنوبية في الجيزة',
      transferTimeMin: 3,
    },
    {
      id: 'stadium',
      name: 'محطة الاستاد (مدينة نصر)',
      x: 650,
      y: 280,
      type: 'major_interchange',
      lines: ['metro_line_3', 'monorail_east'],
      description: 'عقدة انطلاق مونوريل شرق النيل نحو العاصمة الإدارية التبادلية مع الخط الثالث',
      transferTimeMin: 4,
    },
    {
      id: 'arts_culture',
      name: 'محطة مدينة الفنون والثقافة',
      x: 940,
      y: 340,
      type: 'major_interchange',
      lines: ['lrt_line_1', 'monorail_east'],
      description: 'محطة التبادل الكبرى في قلب العاصمة الإدارية بين مونوريل العاصمة والقطار الكهربائي الخفيف (LRT)',
      transferTimeMin: 4,
    },
    {
      id: 'wadi_nile',
      name: 'محطة وادي النيل (المهندسين)',
      x: 320,
      y: 320,
      type: 'major_interchange',
      lines: ['metro_line_3', 'monorail_west'],
      description: 'عقدة ربط تفريعة الخط الثالث بمونوريل غرب النيل المتجه إلى مدينة 6 أكتوبر',
      transferTimeMin: 4,
    },
    {
      id: 'moneeb',
      name: 'محطة المنيب',
      x: 360,
      y: 560,
      type: 'major_interchange',
      lines: ['metro_line_2', 'brt_ring_road'],
      description: 'محطة جنوب الجيزة التبادلية بين نهاية الخط الثاني ومسار الأتوبيس الترددي BRT',
      transferTimeMin: 3,
    },
    {
      id: 'helwan',
      name: 'حلوان (طرف الخط الأول جنوباً)',
      x: 520,
      y: 630,
      type: 'terminal',
      lines: ['metro_line_1'],
      description: 'المحطة النهائية للخط الأول جنوب القاهرة الكبرى',
      transferTimeMin: 0,
    },
    {
      id: 'marg',
      name: 'المرج الجديدة (طرف الخط الأول شمالاً)',
      x: 580,
      y: 110,
      type: 'terminal',
      lines: ['metro_line_1'],
      description: 'المحطة النهائية للخط الأول شمال شرق القاهرة',
      transferTimeMin: 0,
    },
    {
      id: 'shoubra',
      name: 'شبرا الخيمة (طرف الخط الثاني شمالاً)',
      x: 430,
      y: 150,
      type: 'terminal',
      lines: ['metro_line_2'],
      description: 'المحطة النهائية للخط الثاني بمحافظة القليوبية',
      transferTimeMin: 0,
    },
    {
      id: 'rod_farag_axis',
      name: 'محور روض الفرج (تفريعة الخط الثالث شمالاً)',
      x: 240,
      y: 200,
      type: 'terminal',
      lines: ['metro_line_3'],
      description: 'نهاية تفريعة الخط الثالث الشمالية بإمبابة وروض الفرج',
      transferTimeMin: 0,
    },
    {
      id: 'october_ind',
      name: 'المنطقة الصناعية (6 أكتوبر)',
      x: 120,
      y: 430,
      type: 'terminal',
      lines: ['monorail_west'],
      description: 'محطة وصول مونوريل غرب النيل داخل المنطقة الصناعية بمدينة السادس من أكتوبر',
      transferTimeMin: 0,
    },
    {
      id: 'capital_justice',
      name: 'مدينة العدالة (العاصمة الإدارية)',
      x: 990,
      y: 410,
      type: 'terminal',
      lines: ['monorail_east'],
      description: 'نهاية مسار مونوريل شرق النيل في الحي الحكومي ومدينة العدالة',
      transferTimeMin: 0,
    },
  ];

  // Visual Links / Edges between nodes
  const links: GraphLink[] = [
    // Line 1: Red (حلوان -> السادات -> ناصر -> الشهداء -> المرج)
    { from: 'helwan', to: 'sadat', lineId: 'metro_line_1', color: '#dc2626', name: 'الخط الأول (حلوان - السادات)' },
    { from: 'sadat', to: 'nasser', lineId: 'metro_line_1', color: '#dc2626', name: 'الخط الأول (السادات - ناصر)' },
    { from: 'nasser', to: 'shohadaa', lineId: 'metro_line_1', color: '#dc2626', name: 'الخط الأول (ناصر - الشهداء)' },
    { from: 'shohadaa', to: 'marg', lineId: 'metro_line_1', color: '#dc2626', name: 'الخط الأول (الشهداء - المرج)' },

    // Line 2: Orange (شبرا -> الشهداء -> العتبة -> السادات -> جامعة القاهرة -> المنيب)
    { from: 'shoubra', to: 'shohadaa', lineId: 'metro_line_2', color: '#ea580c', name: 'الخط الثاني (شبرا - الشهداء)' },
    { from: 'shohadaa', to: 'attaba', lineId: 'metro_line_2', color: '#ea580c', name: 'الخط الثاني (الشهداء - العتبة)' },
    { from: 'attaba', to: 'sadat', lineId: 'metro_line_2', color: '#ea580c', name: 'الخط الثاني (العتبة - السادات)' },
    { from: 'sadat', to: 'cairo_univ', lineId: 'metro_line_2', color: '#ea580c', name: 'الخط الثاني (السادات - جامعة القاهرة)' },
    { from: 'cairo_univ', to: 'moneeb', lineId: 'metro_line_2', color: '#ea580c', name: 'الخط الثاني (جامعة القاهرة - المنيب)' },

    // Line 3: Emerald (عدلي منصور -> الاستاد -> العتبة -> ناصر -> وادي النيل & محور روض الفرج & جامعة القاهرة)
    { from: 'adly_mansour', to: 'stadium', lineId: 'metro_line_3', color: '#059669', name: 'الخط الثالث (عدلي منصور - الاستاد)' },
    { from: 'stadium', to: 'attaba', lineId: 'metro_line_3', color: '#059669', name: 'الخط الثالث (الاستاد - العتبة)' },
    { from: 'attaba', to: 'nasser', lineId: 'metro_line_3', color: '#059669', name: 'الخط الثالث (العتبة - ناصر)' },
    { from: 'nasser', to: 'rod_farag_axis', lineId: 'metro_line_3', color: '#059669', name: 'الخط الثالث (تفريعة روض الفرج)' },
    { from: 'nasser', to: 'wadi_nile', lineId: 'metro_line_3', color: '#059669', name: 'الخط الثالث (ناصر - وادي النيل)' },
    { from: 'wadi_nile', to: 'cairo_univ', lineId: 'metro_line_3', color: '#059669', name: 'الخط الثالث (وادي النيل - جامعة القاهرة)' },

    // LRT: Cyan / Blue (عدلي منصور -> مدينة الفنون والثقافة بالعاصمة)
    { from: 'adly_mansour', to: 'arts_culture', lineId: 'lrt_line_1', color: '#0284c7', name: 'القطار الكهربائي الخفيف (LRT)' },

    // Monorail East: Purple (الاستاد -> مدينة الفنون -> مدينة العدالة)
    { from: 'stadium', to: 'arts_culture', lineId: 'monorail_east', color: '#7c3aed', name: 'مونوريل شرق النيل' },
    { from: 'arts_culture', to: 'capital_justice', lineId: 'monorail_east', color: '#7c3aed', name: 'مونوريل العاصمة' },

    // Monorail West: Purple (وادي النيل -> 6 أكتوبر)
    { from: 'wadi_nile', to: 'october_ind', lineId: 'monorail_west', color: '#9333ea', name: 'مونوريل غرب النيل (6 أكتوبر)' },

    // BRT Ring Road: Amber (عدلي منصور -> المنيب)
    { from: 'adly_mansour', to: 'moneeb', lineId: 'brt_ring_road', color: '#d97706', name: 'مسار الأتوبيس الترددي BRT (الدائري)', dashed: true },
  ];

  const getLineDetails = (lineId: string) => lines.find((l) => l.id === lineId);

  const handleUseStationInPlanner = (hub: HubNode, asStart: boolean) => {
    // Find matching station in context
    const matchingStation = stations.find((s) => s.name.includes(hub.name.split('(')[0].trim()));
    if (matchingStation) {
      setSelectedModeId(matchingStation.modeId);
      if (asStart) {
        setStartStationId(matchingStation.id);
      } else {
        setEndStationId(matchingStation.id);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Control Header */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitMerge className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base sm:text-lg">مخطط شبكة المواصلات وعقد التبادل التفاعلية</h3>
          </div>
          <p className="text-xs text-slate-400">
            مخطط بصري انسيابي يوضح خطوط المترو، LRT، المونوريل، وعقد التقاطع والتبديل الاستراتيجية.
          </p>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(prev + 0.15, 1.8))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.7))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setSelectedHub(null);
              setActiveLineFilter(null);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            إعادة ضبط
          </button>
        </div>
      </div>

      {/* Interactive Line Filters */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-2.5 px-4 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-slate-600 shrink-0">تصفية الخطوط:</span>
        <button
          type="button"
          onClick={() => setActiveLineFilter(null)}
          className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 ${
            activeLineFilter === null ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          كافة الشبكة
        </button>
        {lines.map((line) => {
          const isActive = activeLineFilter === line.id;
          return (
            <button
              key={line.id}
              type="button"
              onClick={() => setActiveLineFilter(isActive ? null : line.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white ring-2 ring-blue-500'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              <span>{line.name.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas Area */}
      <div className="relative bg-slate-950 overflow-hidden min-h-[460px] sm:min-h-[520px] select-none flex items-center justify-center p-4">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg viewBox="80 80 940 580" className="w-full max-w-5xl h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Draw Links / Lines */}
            {links.map((link, idx) => {
              const fromNode = hubs.find((h) => h.id === link.from);
              const toNode = hubs.find((h) => h.id === link.to);
              if (!fromNode || !toNode) return null;

              const isHighlighted = activeLineFilter === null || activeLineFilter === link.lineId;
              const strokeOpacity = isHighlighted ? 0.9 : 0.15;
              const strokeWidth = isHighlighted ? (link.dashed ? 4 : 6) : 3;

              // Calculate midpoint for path
              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={`link_${idx}`} className="transition-all duration-300">
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={link.color}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    strokeDasharray={link.dashed ? '6,6' : undefined}
                    strokeLinecap="round"
                  />

                  {/* Flow animation pulse on highlighted lines */}
                  {isHighlighted && !link.dashed && (
                    <circle r="4" fill="#ffffff" opacity="0.9">
                      <animateMotion
                        path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                        dur={`${3 + (idx % 3)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Draw Hub Nodes */}
            {hubs.map((hub) => {
              const isSelected = selectedHub?.id === hub.id;
              const isSuperHub = hub.type === 'super_hub';
              const isInterchange = hub.type === 'major_interchange';
              const isRelevant =
                activeLineFilter === null || hub.lines.includes(activeLineFilter);

              return (
                <g
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className="cursor-pointer group"
                  transform={`translate(${hub.x}, ${hub.y})`}
                  opacity={isRelevant ? 1 : 0.3}
                >
                  {/* Outer pulse for interchange hubs */}
                  {(isSuperHub || isInterchange) && (
                    <circle
                      r={isSuperHub ? 26 : 20}
                      fill={isSuperHub ? '#0284c7' : '#9333ea'}
                      opacity={isSelected ? 0.4 : 0.18}
                      className="transition-all duration-300 group-hover:scale-125"
                    />
                  )}

                  {/* Node base circle */}
                  <circle
                    r={isSuperHub ? 18 : isInterchange ? 14 : 9}
                    fill={isSelected ? '#3b82f6' : isSuperHub ? '#0284c7' : isInterchange ? '#ffffff' : '#64748b'}
                    stroke={isSelected ? '#ffffff' : isSuperHub ? '#38bdf8' : isInterchange ? '#9333ea' : '#cbd5e1'}
                    strokeWidth={isSelected ? 4 : isSuperHub ? 3 : 2.5}
                    className="transition-all duration-200 drop-shadow-md"
                  />

                  {/* Interchange inner symbol */}
                  {isInterchange && !isSuperHub && (
                    <circle r="6" fill={isSelected ? '#ffffff' : '#9333ea'} />
                  )}

                  {isSuperHub && (
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ★
                    </text>
                  )}

                  {/* Station Label */}
                  <text
                    y={isSuperHub ? -26 : -18}
                    textAnchor="middle"
                    fill={isSelected ? '#60a5fa' : isSuperHub ? '#38bdf8' : '#f1f5f9'}
                    fontSize={isSuperHub ? 13 : 11}
                    fontWeight={isSuperHub || isInterchange ? 'bold' : 'normal'}
                    className="transition-colors pointer-events-none drop-shadow-sm font-sans"
                  >
                    {hub.name.split('(')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Click hint */}
        <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-xs flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>اضغط على أي عقدة تبادل لعرض تفاصيل التوصيلات والخطوط</span>
        </div>
      </div>

      {/* Selected Hub Details Panel */}
      {selectedHub ? (
        <div className="p-4 sm:p-5 bg-blue-50/80 border-t border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></span>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {selectedHub.name}
              </h4>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                {selectedHub.type === 'super_hub' ? 'محطة مركزية عظمى' : 'محطة تبادلية'}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              {selectedHub.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">الخطوط المتصلة بالمحطة:</span>
              {selectedHub.lines.map((lineId) => {
                const line = getLineDetails(lineId);
                return (
                  <span
                    key={lineId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white border border-slate-200 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line?.color || '#3b82f6' }} />
                    <span>{line?.name.split('(')[0] || lineId}</span>
                  </span>
                );
              })}
              {selectedHub.transferTimeMin > 0 && (
                <span className="text-slate-500 text-[11px]">
                  · متوسط زمن التبديل المريح: {selectedHub.transferTimeMin} دقائق
                </span>
              )}
            </div>
          </div>

          {/* Quick Action to Trip Planner */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => handleUseStationInPlanner(selectedHub, true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              انطلق من هنا (حاسبة الرحلة)
            </button>
            <button
              type="button"
              onClick={() => handleUseStationInPlanner(selectedHub, false)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold transition-colors"
            >
              الوصول إلى هنا
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>
            عقد التبادل الرئيسية تمكّن الركاب من الانتقال بسلاسة بين خطوط المترو الثلاثة والمونوريل والقطار الخفيف بتذكرة واحدة.
          </span>
        </div>
      )}
    </div>
  );
};
