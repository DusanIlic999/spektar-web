import { useAuthStore } from "../../store/authStore";

export const SideBar = () => {
  const { token } = useAuthStore();

  return (
    <div className="space-y-3">
      <div
        className={`min-w-65 space-y-4 bg-black/60 border border-white/15 ${token ? "h-60.5" : "h-29.5"} rounded-2xl p-5 px-3`}
      >
        <div className="w-full h-7 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-full h-7 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-full h-7 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-full h-7 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-full h-7 bg-gray-700 rounded-full animate-pulse duration-100"></div>
      </div>
      <div
        className={`min-w-65 space-y-5 bg-black/60 border border-white/15 h-61.25 rounded-2xl p-5`}
      >
        <div className="w-full h-3 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-2/3 h-3 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-1/3 h-3 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-full h-3 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-2/3 h-3 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-1/3 h-3 bg-gray-700 rounded-full animate-pulse duration-100"></div>
      </div>
      <div
        className={`min-w-65 space-y-5 bg-black/60 border border-white/15 h-42.5 rounded-2xl p-5`}
      >
        <div className="w-full h-2 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-2/3 h-2 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-1/3 h-2 bg-gray-700 rounded-full animate-pulse duration-100"></div>
        <div className="w-full h-7 bg-gray-700 rounded-full animate-pulse duration-100"></div>
      </div>
    </div>
  );
};
