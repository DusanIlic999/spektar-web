import { IoPersonOutline } from "react-icons/io5";
import { useModal } from "../context/moda.context.use";
import { toast } from "../lib/toast";
import { useAuthStore } from "../store/authStore";
import { RegisterForm } from "./RegisterForm";
import { useNavigate } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { MobileSideBar } from "./MobileSideBar";
import { useState } from "react";
import { userStorage } from "../lib/userStorage";
import { LoginForm } from "./LoginForm";

export const Header = () => {
  const { openModal, closeModal } = useModal();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const clearToken = useAuthStore((s) => s.clearToken);

  const handleSignout = () => {
    clearToken();
    userStorage.clear();
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
    <div className="w-screen h-18 bg-gray-950 border-b border-white/15 flex items-center justify-center text-white text-xl px-2 2xl:px-20">
      <MobileSideBar
        open={isModalOpen}
        toggle={() => setIsModalOpen((prev) => !prev)}
      />
      <div className="w-full max-w-348 flex justify-between items-center">
        <div className="flex w-fit items-center">
          <CiMenuBurger
            className="ml-5 block lg:hidden"
            onClick={() => setIsModalOpen(true)}
          />
          <img
            src="/icons.png"
            className="h-8 w-20 object-cover select-none"
            onClick={()=> navigate('/')}
          />
          <div className="flex items-end gap-1 -ml-1 select-none">
            <div className="font-extrabold hidden 2xl:block">Spektra</div>
          </div>
        </div>
        <div></div>
        <div className="text-sm flex gap-2 2xl:gap-5 items-center pr-1">
          {token ? (
            <>
              <button
                className="px-3 py-2 bg-gray-800 rounded-xl cursor-pointer select-none"
                onClick={handleSignout}
              >
                Odjavi se
              </button>
              <button
                className="px-4 py-2 bg-green-600 rounded-xl font-semibold flex items-center gap-2 cursor-pointer select-none"
                onClick={() => navigate("/profile")}
              >
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
    </div>
  );
};
