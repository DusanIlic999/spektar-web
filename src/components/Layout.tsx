import { Outlet } from "react-router-dom";
import { Header } from "./Header.tsx";
import { SideBar } from "./SideBar.tsx";
import { WeatherBar } from "./WeatherBar.tsx";
import { MyCommunity } from "./MyCommunity.tsx";
import { CreateYourCommunity } from "./CreateYourCommunity.tsx";

export const Layout = () => {
  return (
    <div className="bg-gray-950 w-screen h-screen overflow-hidden overflow-y-auto">
      <Header />
      <div className="w-350 py-5 mx-auto flex gap-5">
        <div className="flex flex-col gap-3">
          <SideBar />
          <MyCommunity />
          <CreateYourCommunity />
        </div>
        <Outlet />
        <WeatherBar />
      </div>
    </div>
  );
};
