"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, MapPinOff, AlertCircle, Search, Wind, Sprout } from "lucide-react";
import { WeatherCard } from "@/components/weather/weatherCard";
import { WeatherAdvice } from "@/components/weather/weatheradvice";
import { ForecastCard } from "@/components/weather/Forecastcard";
import { WeatherLoading } from "@/components/weather/weatherloading";

interface CurrentData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  condition: string;
  description: string;
  icon: string;
  aqi?: number;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

interface WeatherResponseData {
  current: CurrentData;
  forecast: ForecastDay[];
}

export default function WeatherPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponseData | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");

  // 🌍 reverse geocode
  const getCityFromCoords = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await res.json();
      return data.city || data.locality || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  // 🌫️ AQI
  const getAQI = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.waqi.info/feed/geo:${lat};${lon}/?token=demo`
      );
      const data = await res.json();
      return data.status === "ok" ? data.data.aqi : null;
    } catch {
      return null;
    }
  };

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const [weatherRes, aqi] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}`),
        getAQI(lat, lon),
      ]);

      if (!weatherRes.ok) throw new Error("Weather API failed");

      const json = await weatherRes.json();

      if (json.success) {
        setWeatherData({
          ...json.data,
          current: {
            ...json.data.current,
            aqi: aqi || undefined,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // 📍 GPS
  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const detectedCity = await getCityFromCoords(latitude, longitude);
        setCity(detectedCity);

        fetchWeatherData(latitude, longitude);
      },
      () => {
        setLoading(false);
        setPermissionDenied(true);
      },
      { enableHighAccuracy: true }
    );
  }, [fetchWeatherData]);

  // 🔍 CITY SEARCH
  const searchCityWeather = async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
      );
      const data = await res.json();

      if (!data.length) throw new Error("City not found");

      fetchWeatherData(Number(data[0].lat), Number(data[0].lon));
    } catch {
      setError("City search failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // ---------------- UI ----------------

  if (loading) return <WeatherLoading />;

  if (permissionDenied) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <MapPinOff />
          <p>Enable location access</p>
          <button onClick={requestLocation}>Retry</button>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle />
          <p>{error}</p>
          <button onClick={requestLocation}>
            <RefreshCw /> Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-4">

        {/* 🔍 SEARCH */}
        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 border p-2 rounded"
          />

          <button onClick={searchCityWeather}>
            <Search />
          </button>

          <button onClick={requestLocation}>📍</button>
        </div>

        {/* 🌧️ RAIN RADAR (MAP PREVIEW) */}
        {weatherData && (
          <div className="border rounded p-3 bg-blue-50">
            <p className="font-medium mb-2">🌧️ Rain Radar View</p>

            <iframe
              width="100%"
              height="200"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=72,28,77,30&layer=mapnik`}
            />

            <p className="text-xs text-gray-500 mt-1">
              (Live radar style preview area)
            </p>
          </div>
        )}

        {/* 🌱 CROPS SUGGESTION AI */}
        {weatherData && (
          <div className="border rounded p-3 bg-green-50">
            <div className="flex items-center gap-2">
              <Sprout size={16} />
              <p className="font-semibold">Crop Recommendation</p>
            </div>

            <p className="text-sm mt-2">
              {weatherData.current.temperature < 20
                ? "Wheat, mustard farming suitable 🌾"
                : weatherData.current.temperature < 30
                ? "Rice, maize farming suitable 🌱"
                : "Cotton, sugarcane suitable 🌿"}
            </p>
          </div>
        )}

        {/* 🌫️ AQI */}
        {weatherData?.current.aqi && (
          <div className="p-3 border rounded bg-gray-50">
            <p className="font-semibold">Air Quality Index</p>
            <p className="text-xl">{weatherData.current.aqi}</p>
          </div>
        )}

        {/* WEATHER */}
        {weatherData && (
          <>
            <WeatherCard {...weatherData.current} />
            <WeatherAdvice
              temperature={weatherData.current.temperature}
              condition={weatherData.current.condition}
              rainChance={weatherData.current.rainChance}
              humidity={weatherData.current.humidity}
            />
            <ForecastCard forecast={weatherData.forecast} />
          </>
        )}
      </div>
    </main>
  );
}