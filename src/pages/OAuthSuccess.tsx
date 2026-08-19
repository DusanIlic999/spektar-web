import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "../api/client";
import { userStorage } from "../lib/userStorage";
import { toast } from "../lib/toast";

interface ICurrentUser {
  username: string;
}

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { setToken, clearToken } = useAuthStore();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);
  const [hasError, setHasError] = useState(!token);

  const { mutate: loadCurrentUser } = useMutation({
    mutationFn: () => apiClient.get<ICurrentUser>("/users/me"),
    onSuccess: ({ data }) => {
      userStorage.set(data.username);
      queryClient.refetchQueries();
      toast.success(
        "Uspešna prijava",
        "Uspešno ste se prijavili preko Google-a.",
      );
      navigate("/", { replace: true });
    },
    onError: () => {
      // Token je stigao, ali nalog nije mogao da se učita (npr. istekao/nevažeći token)
      clearToken();
      setHasError(true);
      toast.error(
        "Greška pri prijavi",
        "Nismo uspeli da učitamo vaš nalog. Pokušajte ponovo.",
      );
      setTimeout(() => navigate("/", { replace: true }), 1500);
    },
  });

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      toast.error(
        "Greška pri prijavi",
        "Token nije pronađen u URL-u. Pokušajte ponovo.",
      );
      setTimeout(() => navigate("/", { replace: true }), 1500);
      return;
    }

    // Čuvamo token pre poziva ka /users/me kako bi apiClient mogao da ga
    // priloži u Authorization header
    setToken(token);
    loadCurrentUser();
  }, [token, navigate, setToken, loadCurrentUser]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black/80">
      {hasError ? (
        <>
          <div className="w-[40px] h-[40px] rounded-[50%] bg-red-500/20 flex items-center justify-center text-red-400 text-xl">
            !
          </div>
          <h2 className="text-white mt-[20px] ml-[5px]">
            Autorizacija nije uspela
          </h2>
          <p className="text-gray-400 m-0">Preusmeravamo vas nazad...</p>
        </>
      ) : (
        <>
          <div className="w-[40px] h-[40px] border-4 border-white/15 rounded-[50%] animate-spin"></div>
          <h2 className="text-white mt-[20px] ml-[5px]">
            Autorizacija uspešna...
          </h2>
          <p className="text-gray-700 m-0">Preusmeravamo vas na aplikaciju.</p>
        </>
      )}
    </div>
  );
}
