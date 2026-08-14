import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const CreateYourCommunity = ({
  mobile = false,
}: {
  mobile?: boolean;
}) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  return (
    <div
      className={`text-white space-y-4 min-w-65 ${!mobile && "rounded-2xl border"} bg-gradient-to-br from-green-500 to-green-900 h-fit p-5 border-white/15 text-sm`}
    >
      <h3 className="text-xl font-semibold">
        Kreiraj svoju <span className="text-green-300 italic">zajednicu</span>
      </h3>
      <p className="text-xs text-gray-300">
        Poveži ljude iz svog kraja ili mesta na jednom mestu.
      </p>
      {token && (
        <button
          className={`w-full bg-green-600 py-2 ${!mobile && "rounded-2xl"} cursor-pointer`}
          onClick={() => navigate("/create-community")}
        >
          Pocni
        </button>
      )}
    </div>
  );
};
