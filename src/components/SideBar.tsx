import { AiOutlineBell, AiOutlineFire } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import {
  IoBookmarkOutline,
  IoChatbubblesOutline,
  IoHomeOutline,
} from "react-icons/io5";
import { PiGearSixLight } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const SideBar = () => {
  const { pathname } = useLocation();
    const token = useAuthStore((s) => s.token);

  return (
    <div className="min-w-65 bg-black/60 h-fit pt-0 rounded-2xl border border-white/15">
      <Link
        to={""}
        className={`relative flex gap-3 ${pathname == "/" ? "bg-green-400/40 text-green-400" : "text-gray-400"} rounded-t-2xl items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <IoHomeOutline size={"19"} />
        Dashboard
      </Link>
      <Link
        to={"/tranding"}
        className={`relative flex gap-3 ${pathname == "/tranding" ? "bg-green-400/40 text-green-400" : "text-gray-400"} items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/tranding" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <AiOutlineFire size={"19"} />
        Tranding
      </Link>
      <Link
        to={"/saved"}
        className={`relative flex gap-3 ${pathname == "/saved" ? "bg-green-400/40 text-green-400" : "text-gray-400"} items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/saved" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <IoBookmarkOutline size={"19"} />
        Saved
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
            <AiOutlineBell size={"19"} />
            Notification
          </Link>
          <Link
            to={"/chat"}
            className={`relative flex gap-3 ${pathname == "/chat" ? "bg-green-400/40 text-green-400" : "text-gray-400"} items-center p-3 pl-5 font-semibold`}
          >
            {pathname == "/chat" && (
              <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
            )}
            <IoChatbubblesOutline size={"19"} />
            Chat
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
        Search
      </Link>
      <Link
        to={"/settings"}
        className={`relative flex gap-3 ${pathname == "/settings" ? "bg-green-400/40 text-green-400" : "text-gray-400"} rounded-b-2xl items-center p-3 pl-5 font-semibold`}
      >
        {pathname == "/settings" && (
          <div className="h-7 rounded-full bottom-1/2 translate-y-1/2 w-1 left-0 absolute bg-green-500"></div>
        )}
        <PiGearSixLight size={"19"} />
        Settings
      </Link>
    </div>
  );
};
