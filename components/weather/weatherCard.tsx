import React from "react";
import { CloudRain, Droplets, Wind, MapPin } from "lucide-react";

interface WeatherCardProps {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  icon: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  temperature,
  feelsLike,
  condition,
  description,
  humidity,
  windSpeed,
  rainChance,
}) => {
  return (
    <div className="w-full rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-[0_10px_30px_rgba(4,120,87,0.08)] dark:from-emerald-950 dark:to-teal-950 dark:border-emerald-900">
      <div className="p-5 pb-1">
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
          <MapPin className="h-5 w-5 flex-shrink-0" />
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">{location}</h2>
        </div>
      </div>
      <div className="p-5 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-50 sm:text-5xl">
                {Math.round(temperature)}
              </span>
              <span className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 sm:text-2xl">°C</span>
            </div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 capitalize mt-1">
              {condition} • {description}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Feels like {Math.round(feelsLike)}°C
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5">
            <Droplets className="h-5 w-5 text-teal-600 dark:text-teal-400 mb-1" />
            <span className="text-xs text-muted-foreground">Humidity</span>
            <span className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{humidity}%</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5">
            <Wind className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="text-xs text-muted-foreground">Wind</span>
            <span className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{windSpeed} km/h</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5">
            <CloudRain className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-1" />
            <span className="text-xs text-muted-foreground">Rain Chance</span>
            <span className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{rainChance}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};