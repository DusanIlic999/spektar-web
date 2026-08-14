import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header.tsx";
import { SideBar } from "./SideBar.tsx";
import { WeatherBar } from "./WeatherBar.tsx";
import { MyCommunity } from "./MyCommunity.tsx";
import { CreateYourCommunity } from "./CreateYourCommunity.tsx";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore.ts";

export const Layout = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className="bg-gray-950 w-screen h-screen overflow-hidden overflow-y-auto"
      ref={scrollRef}
    >
      <Header />
      <div className="w-full 2xl:w-350 py-5 mx-auto flex 2xl:gap-5 h-fit">
        <div className="flex-col gap-3 hidden lg:flex pl-5">
          {token && (
            <>
              <SideBar />
              <MyCommunity />
            </>
          )}
          <CreateYourCommunity />
        </div>
        <div className="w-full p-3 pt-0 h-fit">
          <Outlet />
        </div>
        <div className="hidden 2xl:block">
          <WeatherBar />
        </div>
      </div>
    </div>
  );
};
