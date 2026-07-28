import { create } from "zustand";
import { tokenStorage } from "../lib/tokenStorage";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: tokenStorage.get(),
  setToken: (token) => {
    tokenStorage.set(token);
    set({ token });
  },
  clearToken: () => {
    tokenStorage.clear();
    set({ token: null });
  },
}));