import { useQuery } from "@tanstack/react-query";
import { IoCloudOutline } from "react-icons/io5";

const WEATHER: Record<number, { label: string; icon: string }> = {
  0: { label: "Sunčano", icon: "☀️" },
  1: { label: "Pretežno sunčano", icon: "🌤️" },
  2: { label: "Delimično oblačno", icon: "⛅" },
  3: { label: "Oblačno", icon: "☁️" },
  45: { label: "Magla", icon: "🌫️" },
  48: { label: "Magla", icon: "🌫️" },
  51: { label: "Rosulja", icon: "🌦️" },
  61: { label: "Slaba kiša", icon: "🌧️" },
  63: { label: "Kiša", icon: "🌧️" },
  65: { label: "Jaka kiša", icon: "🌧️" },
  71: { label: "Sneg", icon: "🌨️" },
  80: { label: "Pljuskovi", icon: "🌦️" },
  95: { label: "Grmljavina", icon: "⛈️" },
};
type WeatherResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    uv_index: number;
  };
};

const BELGRADE = { lat: 44.7866, lon: 20.4489 };

function useWeather() {
  return useQuery({
    queryKey: ["weather", BELGRADE],
    queryFn: async () => {
      const params = new URLSearchParams({
        latitude: String(BELGRADE.lat),
        longitude: String(BELGRADE.lon),
        current:
          "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index",
        timezone: "Europe/Belgrade",
      });
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`,
      );
      if (!res.ok) throw new Error("Weather fetch failed");
      return (await res.json()) as WeatherResponse;
    },
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export const WeatherBar = () => {
  const { data, isLoading, isError } = useWeather();

  if (isLoading) {
    return (
      <div className="min-w-65 bg-black/60 h-45 rounded-2xl border border-white/15 p-5 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="flex items-center gap-4 mt-6">
          <div className="w-12 h-12 bg-white/10 rounded-full" />
          <div className="h-10 w-20 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-w-65 bg-black/60 h-45 rounded-2xl border border-white/15 p-5 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Vreme trenutno nedostupno</span>
      </div>
    );
  }

  const c = data.current;
  const w = WEATHER[c.weather_code] ?? { label: "Nepoznato", icon: "🌡️" };

  return (
    <div className="min-w-65 bg-black/60 h-32 rounded-2xl border border-white/15 p-3 flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <IoCloudOutline className="text-green-500 shrink-0" size={20} />
        <span className="text-white font-bold">Danas u Beogradu</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none select-none">{w.icon}</span>
          <div className="flex flex-col">
            <span className="text-white text-4xl font-bold leading-none">
              {Math.round(c.temperature_2m)}°
            </span>
            <span className="text-gray-500 text-sm mt-1">{w.label}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-right shrink-0">
          <span className="text-gray-400">
            Vlažnost{" "}
            <span className="text-white font-semibold">
              {Math.round(c.relative_humidity_2m)}%
            </span>
          </span>
          <span className="text-gray-400">
            Vetar{" "}
            <span className="text-white font-semibold">
              {Math.round(c.wind_speed_10m)} km/h
            </span>
          </span>
          <span className="text-gray-400">
            UV{" "}
            <span className="text-white font-semibold">
              {Math.round(c.uv_index)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
