import { NextRequest, NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const CURRENT_WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast";

export async function GET(req: NextRequest) {
  try {
    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "OpenWeather API key is not configured.",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Latitude and longitude are required.",
        },
        { status: 400 }
      );
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`,
        {
          cache: "no-store",
        }
      ),
      fetch(
        `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`,
        {
          cache: "no-store",
        }
      ),
    ]);

    if (!currentRes.ok) {
      const error = await currentRes.json().catch(() => null);

      return NextResponse.json(
        {
          success: false,
          data: null,
          error: error?.message || "Failed to fetch current weather.",
        },
        { status: currentRes.status }
      );
    }

    if (!forecastRes.ok) {
      const error = await forecastRes.json().catch(() => null);

      return NextResponse.json(
        {
          success: false,
          data: null,
          error: error?.message || "Failed to fetch forecast.",
        },
        { status: forecastRes.status }
      );
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // Current Weather
    const current = {
      location: currentData.name ?? "Unknown",

      temperature: Math.round(currentData.main?.temp ?? 0),

      feelsLike: Math.round(currentData.main?.feels_like ?? 0),

      humidity: currentData.main?.humidity ?? 0,

      // OpenWeather returns wind speed in m/s
      windSpeed: Math.round((currentData.wind?.speed ?? 0) * 3.6),

      // Free API doesn't provide rain probability
      rainChance: currentData.rain?.["1h"] ?? 0,

      condition: currentData.weather?.[0]?.main ?? "Clear",

      description: currentData.weather?.[0]?.description ?? "",

      icon: currentData.weather?.[0]?.icon ?? "01d",
    };

    // Forecast
    const dailyMap = new Map<
      string,
      {
        temps: number[];
        icon: string;
        condition: string;
      }
    >();

    for (const item of forecastData.list) {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          temps: [],
          icon: item.weather?.[0]?.icon ?? "01d",
          condition: item.weather?.[0]?.main ?? "Clear",
        });
      }

      dailyMap.get(date)?.temps.push(item.main?.temp ?? 0);
    }

    const forecast = Array.from(dailyMap.entries())
      .slice(0, 5)
      .map(([date, info]) => ({
        date,
        high: Math.round(Math.max(...info.temps)),
        low: Math.round(Math.min(...info.temps)),
        condition: info.condition,
        icon: info.icon,
      }));

    return NextResponse.json({
      success: true,
      data: {
        current,
        forecast,
      },
      error: null,
    });
  } catch (error) {
    console.error("Weather API Error:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}