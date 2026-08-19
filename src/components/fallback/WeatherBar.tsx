export const WeatherBar = () => {
  return (
    <div
      className="min-w-65 bg-black/60
border-white/15 h-32 rounded-2xl border space-y-5 p-5"
    >
      <div className="w-full h-2 bg-gray-700 rounded-full animate-pulse duration-100"></div>
      <div className="w-2/3 h-2 bg-gray-700 rounded-full animate-pulse duration-100"></div>
      <div className="w-1/3 h-2 bg-gray-700 rounded-full animate-pulse duration-100"></div>
    </div>
  );
};
