import { AiOutlineBell } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import {
  IoBookmarkOutline,
  IoChatbubblesOutline,
  IoHomeOutline,
} from "react-icons/io5";
// import { PiGearSixLight } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import type { IArrayData } from "../types/api";
import type { INotification } from "../types/notification";
import { apiClient } from "../api/client";

export const SideBar = ({ mobile = false }: { mobile?: boolean }) => {
  const { pathname } = useLocation();
  const token = useAuthStore((s) => s.token);
  const { data } = useQuery<IArrayData<INotification>>({
    queryKey: ["requests", "me"],
    queryFn: () => apiClient.get("/communities/invites/me"),
  });

  return (
    <div
      className={`min-w-65 ${!mobile && "bg-black/60 border rounded-2xl"} h-fit pt-0  border-white/15`}
    >
      <Link
        to={""}
        className={`relative flex gap-3 ${pathname == "/" ? "bg-green-400/40 text-green-400" : "text-gray-400"} ${!mobile && "rounded-t-2xl"} items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <IoHomeOutline size={"19"} />
        Pocetna
      </Link>
      <Link
        to={"/saved"}
        className={`relative flex gap-3 ${pathname == "/saved" ? "bg-green-400/40 text-green-400" : "text-gray-400"} items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/saved" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <IoBookmarkOutline size={"19"} />
        Sacuvano
      </Link>
      {token && (
        <>
          <Link
            to={"/notification"}
            className={`relative flex gap-3 ${pathname == "/notification" ? "bg-green-400/40 text-green-400" : "text-gray-400"} items-center p-3 pl-5 font-semibold`}
          >
            {pathname == "/notification" && (
              <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
            )}
            {data && data.data.length > 0 && (
              <div className="absolute px-2 -scale-75 top-1 rotate-180 left-7 rounded-full text-red-500 bg-red-800">
                {data.data.length}
              </div>
            )}
            <AiOutlineBell size={"19"} />
            Obavestenja
          </Link>
          <Link
            to={"/chat"}
            className={`relative flex gap-3 ${pathname == "/chat" ? "bg-green-400/40 text-green-400" : "text-gray-400"} items-center p-3 pl-5 font-semibold`}
          >
            {pathname == "/chat" && (
              <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
            )}
            <IoChatbubblesOutline size={"19"} />
            Razgovori
          </Link>
        </>
      )}
      <Link
        to={"/search"}
        className={`relative flex gap-3 ${pathname == "/search" ? "bg-green-400/40 text-green-400" : "text-gray-400"} items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/search" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <IoIosSearch size={"19"} />
        Pretraga
      </Link>
      {/* <Link
        to={"/settings"}
        className={`relative flex gap-3 ${pathname == "/settings" ? "bg-green-400/40 text-green-400" : "text-gray-400"} ${!mobile && "rounded-b-2xl"} items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/settings" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <PiGearSixLight size={"19"} />
        Podesavanja
      </Link> */}
    </div>
  );
};
