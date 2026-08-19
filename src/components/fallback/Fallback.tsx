import { Header } from "../Header";
import { DashBoard } from "./Dashboard";
import { SideBar } from "./Sidebar";
import { WeatherBar } from "./WeatherBar";

export const Fallback = () => {
  return (
    <div className="bg-gray-950 h-screen w-screen overflow-hidden">
      <Header />
      <div className="w-350 pt-5 mx-auto">
        <div className="flex gap-5">
          <SideBar />
          <DashBoard />
          <WeatherBar />
        </div>
      </div>
    </div>
  );
};
