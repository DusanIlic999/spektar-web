import { CiMenuBurger } from "react-icons/ci";
import { CreateYourCommunity } from "./CreateYourCommunity";
import { MyCommunity } from "./MyCommunity";
import { SideBar } from "./SideBar";

export const MobileSideBar = ({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) => {
  return (
    <div
      className={`w-screen bg-transparent backdrop-blur-xs absolute z-90 left-0 bottom-0 h-screen overflow-hidden overflow-y-auto ${open ? "block" : "hidden"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggle();
      }}
    >
      <div className="max-w-75 bg-black">
        <div className="flex py-3 px-2 items-center justify-between">
          <CiMenuBurger className="ml-5" onClick={toggle} />
          <h3 className="text-2xl p-2 px-3 font-semibold">Spektra</h3>
        </div>
        <div className="relative flex-col gap-3 flex">
          <SideBar mobile={true} />
          <MyCommunity mobile={true} />
          <CreateYourCommunity mobile={true} />
        </div>
      </div>
    </div>
  );
};
