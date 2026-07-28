export const Filters = () => {
  return (
    <div className="w-full p-2 rounded-xl bg-black/60 border border-white/15 flex justify-between px-5 items-center">
      <div className="flex gap-5 items-center">
        <div className="px-5 py-1 bg-green-400/40 rounded-lg cursor-pointer select-none">
          Svi
        </div>
        <div className="cursor-pointer select-none text-gray-400">
          Diskusije
        </div>
        <div className="cursor-pointer select-none text-gray-400">Pitanja</div>
        <div className="cursor-pointer select-none text-gray-400">
          Dogadjaji
        </div>
        <div className="cursor-pointer select-none text-gray-400">
          Preporuke
        </div>
        <div className="cursor-pointer select-none text-gray-400">
          Obavestenja
        </div>
      </div>
      <div>
        <select name="" id="" className="dd">
          <option value="">Najnovije</option>
          <option value="">Trending</option>
          <option value="">Najstarije</option>
        </select>
      </div>
    </div>
  );
};
