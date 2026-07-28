import { Link } from "react-router-dom";

export const MyCommunity = () => {
  return (
    <div className="text-white min-w-65 bg-black/60 h-fit p-5 rounded-2xl border border-white/15 text-sm">
      <div className="border-b border-white/10 pb-2.5 flex justify-between items-center">
        <div className="font-semibold tracking-wider">Moje zajednice</div>
        <Link
          to={"/create-community"}
          className="text-green-400 cursor-pointer select-none hover:bg-green-400 hover:text-white px-1 rounded-sm"
        >
          +
        </Link>
      </div>
      <Link
        to={"/communities"}
        className="relative top-1 text-green-500 cursor-pointer select-none"
      >
        Istrazi zajednice {`>`}
      </Link>
    </div>
  );
};
