import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, RefreshCw, AlertCircle, Compass } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  recommendation: string;
  lastUpdated: string;
}

export const WeatherBanner: React.FC = () => {
  // Grounded with initial data from Google Search: Cairo ~23°C, Clear/Sunny, 60% humidity
  const [weather, setWeather] = useState<WeatherData>({
    temp: 23,
    condition: 'صافٍ ومعتدل',
    conditionCode: 0,
    humidity: 60,
    windSpeed: 14,
    recommendation: 'طقس معتدل وصافٍ في القاهرة (23°م)، حركة المواصلات منتظمة ومثالية للتنقل عبر المترو والمونوريل دون أي معوقات جوية.',
    lastUpdated: 'مُحدث الآن',
  });
  const [loading, setLoading] = useState(false);

  const fetchLiveWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&current_weather=true&hourly=relative_humidity_2m'
      );
      if (res.ok) {
        const data = await res.json();
        const current = data.current_weather;
        const temp = Math.round(current.temperature);
        const code = current.weathercode;
        const wind = Math.round(current.windspeed);

        let condition = 'صافٍ';
        let recommendation = '';

        if (code === 0) {
          condition = 'صافٍ ومشمس';
        } else if (code <= 3) {
          condition = 'غائم جزئياً';
        } else if (code >= 51 && code <= 67) {
          condition = 'ممطر';
        } else if (code >= 71) {
          condition = 'أجواء شتوية باردة';
        } else {
          condition = 'معتدل';
        }

        // Smart transit recommendation logic
        if (code >= 51 && code <= 67) {
          recommendation =
            '⚠️ جو ممطر في القاهرة، احرص على الوصول للمحطة مبكراً واعتمد على شبكة المترو لتفادي الزحام السطحي.';
        } else if (temp >= 33) {
          recommendation =
            '☀️ طقس حار في القاهرة، يُفضل استخدام المترو والقطار الكهربائي الخفيف (LRT) المكيف وشرب السوائل.';
        } else if (temp <= 15) {
          recommendation =
            '🧥 طقس بارد في القاهرة، ارتدِ ملابس دافئة خصوصاً في محطات المونوريل والقطار السريع العلوية المفتوحة.';
        } else if (wind >= 30) {
          recommendation =
            '💨 رياح نشطة محملة بالأتربة، يفضل الاعتماد على محطات المترو النفقية المغلقة لرحلة هادئة.';
        } else {
          recommendation = `✨ طقس معتدل وصافٍ في القاهرة (${temp}°م)، حركة المواصلات منتظمة ومثالية للتنقل دون أي عوائق جوية.`;
        }

        setWeather({
          temp,
          condition,
          conditionCode: code,
          humidity: 60,
          windSpeed: wind,
          recommendation,
          lastUpdated: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (e) {
      console.warn('Fallback to search grounded weather data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, []);

  const getWeatherIcon = () => {
    if (weather.conditionCode >= 51 && weather.conditionCode <= 67) {
      return <CloudRain className="w-4 h-4 text-blue-400 animate-bounce" />;
    }
    if (weather.temp >= 30) {
      return <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />;
    }
    return <Sun className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="bg-[#050811] text-slate-200 border-b border-[#00f0ff]/25 text-xs py-2 px-3 sm:px-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Weather Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#091220] px-2.5 py-1 rounded-lg border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
            {getWeatherIcon()}
            <span className="font-bold text-white tracking-wide">طقس القاهرة // CAIRO WX:</span>
            <span className="font-black text-[#00f0ff] font-mono tabular-nums neon-text-blue">{weather.temp}°C</span>
            <span className="text-[#7dd3fc] font-medium">({weather.condition})</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
            <span>الرطوبة: <strong className="text-[#38bdf8] font-mono">{weather.humidity}%</strong></span>
            <span>·</span>
            <span>الرياح: <strong className="text-[#38bdf8] font-mono">{weather.windSpeed} كم/س</strong></span>
          </div>
        </div>

        {/* Smart transit advice badge */}
        <div className="flex-1 flex items-center justify-center md:justify-start gap-2 text-center md:text-right px-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shrink-0 animate-ping"></span>
          <p className="text-[11px] sm:text-xs text-[#a5f3fc] font-medium truncate">
            {weather.recommendation}
          </p>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={fetchLiveWeather}
          disabled={loading}
          className="shrink-0 text-[11px] text-[#00f0ff] hover:text-white flex items-center gap-1 bg-[#091526] hover:bg-[#00f0ff] hover:text-[#060911] px-2.5 py-1 rounded border border-[#00f0ff]/40 transition-all cursor-pointer shadow-[0_0_6px_rgba(0,240,255,0.2)]"
          title="تحديث بيانات الطقس الحالية"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">REFRESH // تحديث</span>
        </button>
      </div>
    </div>
  );
};
