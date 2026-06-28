import React from "react";
import { Cloud, CloudRain, Sun, CloudLightning, CloudSnow, SunDim } from "lucide-react";

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain") || cond.includes("drizzle")) return <CloudRain className="h-5 w-5 text-blue-500" />;
    if (cond.includes("thunderstorm")) return <CloudLightning className="h-5 w-5 text-amber-600" />;
    if (cond.includes("snow")) return <CloudSnow className="h-5 w-5 text-sky-400" />;
    if (cond.includes("clear") || cond.includes("sun")) return <Sun className="h-5 w-5 text-amber-500" />;
    if (cond.includes("clouds")) return <Cloud className="h-5 w-5 text-slate-400" />;
    return <SunDim className="h-5 w-5 text-emerald-500" />;
  };

  const formatDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="w-full rounded-2xl border border-emerald-100 bg-white shadow-[0_10px_30px_rgba(4,120,87,0.06)] dark:bg-zinc-950 dark:border-emerald-900">
      <div className="p-4">
        <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-3 uppercase tracking-wider">
          5-Day Agricultural Forecast
        </h3>

        {/* Compact one-row layout — replaces the tall vertical list, cuts scroll height a lot */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {forecast.map((day, index) => (
            <div
              key={index}
              title={day.condition}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-emerald-100/80 bg-emerald-50/50 px-1.5 py-3 text-center transition-colors duration-200 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
            >
              <p className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-300 sm:text-xs">
                {formatDayName(day.date)}
              </p>
              <div className="flex h-6 items-center justify-center">{getWeatherIcon(day.condition)}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-emerald-950 dark:text-emerald-50">
                  {Math.round(day.high)}°
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {Math.round(day.low)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};