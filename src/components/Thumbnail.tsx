import { IoShareSocialOutline } from "react-icons/io5";

export const Thumbnail = () => {
  return (
    <div className="w-full relative max-h-60 rounded-2xl bg-gray-500">
      <img
        src="/public/thumbnail.jpg"
        className="object-cover h-60 w-full rounded-2xl select-none"
      />
      <div className="text-white z-20 absolute  rounded-2xl top-0 opacity-100 w-full h-full bg-gradient-to-b from-transparent to-black"></div>
      <div className="text-white z-20 absolute rounded-2xl bottom-0 p-5">
        <div className="text-2xl font-bold">Spektra Srbije</div>
        <div className="text-lg font-semibold">Dusan Ilic</div>
        <div className="text-gray-300 text-sm">
          Mesto za povezivanje, deljenje preporuka, događaja i priča iz našeg
          grada.
        </div>
      </div>
      <div className="text-white z-20 absolute rounded-2xl bottom-0 right-0 p-5">
        <button className="flex items-center gap-3 bg-slate-900/50 cursor-pointer px-5 py-2 border border-white/15 rounded-2xl">
          <IoShareSocialOutline size={"19"} />
          Share
        </button>
      </div>
    </div>
  );
};
