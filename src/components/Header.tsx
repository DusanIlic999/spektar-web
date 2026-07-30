import { IoPersonOutline } from "react-icons/io5";
import { useModal } from "../context/moda.context.use";
import { toast } from "../lib/toast";
import { useAuthStore } from "../store/authStore";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const clearToken = useAuthStore((s) => s.clearToken);

  const handleSignout = () => {
    clearToken();
    toast.success("Usepsno ste se odjavili");
  };

  const handleOpenModal = (registration: boolean) => {
    return openModal(
      <div className="space-y-5">
        <div className="flex justify-between">
          <h2 className="text-2xl text-green-400">
            {registration ? "Registracija" : "Prijava"}
          </h2>
          <button
            onClick={closeModal}
            className="text-red-500 cursor-pointer text-xl font-bold"
          >
            X
          </button>
        </div>
        <div>
          {registration ? (
            <RegisterForm close={closeModal} />
          ) : (
            <LoginForm close={closeModal} />
          )}
        </div>
      </div>,
    );
  };

  return (
    <div className="w-screen h-18 bg-gray-950 border-b border-white/15 flex items-center justify-between text-white text-xl px-20">
      <div className="flex items-center">
        <img
          src="/public/icons.png"
          className="h-8 w-20 object-cover select-none"
        />
        <div className="flex items-end gap-1 -ml-1 select-none">
          <div className="font-extrabold">Spektra</div>
          <div className="text-sm font-semibold text-gray-400">Srbija</div>
        </div>
      </div>
      <div></div>
      <div className="text-sm flex gap-5 items-center">
        {token ? (
          <>
            <button
              className="px-3 py-2 bg-gray-800 rounded-xl cursor-pointer select-none"
              onClick={handleSignout}
            >
              Odjavi se
            </button>
            <button className="px-4 py-2 bg-green-600 rounded-xl font-semibold flex items-center gap-2 cursor-pointer select-none" onClick={()=> navigate('/profile')}>
              <IoPersonOutline size={17} />
              Profile
            </button>
          </>
        ) : (
          <>
            <button
              className="px-3 py-2 bg-gray-800 rounded-xl cursor-pointer select-none"
              onClick={() => handleOpenModal(false)}
            >
              Prijavi se
            </button>
            <button
              className="px-3 py-2 bg-green-800/80 rounded-xl cursor-pointer select-none"
              onClick={() => handleOpenModal(true)}
            >
              Registruj se
            </button>
          </>
        )}
      </div>
    </div>
  );
};
