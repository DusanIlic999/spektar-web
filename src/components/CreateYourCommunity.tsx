import { useNavigate } from "react-router-dom";

export const CreateYourCommunity = () => {
  const navigate = useNavigate();
  return (
    <div className="text-white space-y-4 min-w-65 bg-gradient-to-br from-green-500 to-green-900 h-fit p-5 rounded-2xl border border-white/15 text-sm">
      <h3 className="text-xl font-semibold">
        Kreiraj svoju <span className="text-green-300 italic">zajednicu</span>
      </h3>
      <p className="text-xs text-gray-300">
        Poveži ljude iz svog kraja na jednom mestu.
      </p>
      <button
        className="w-full bg-green-600 py-2 rounded-2xl cursor-pointer"
        onClick={() => navigate("/create-community")}
      >
        Pocni
      </button>
    </div>
  );
};
