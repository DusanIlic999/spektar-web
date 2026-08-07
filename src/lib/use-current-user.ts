// hooks/use-current-user.ts
import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/authStore";

interface JwtPayload {
  sub: string;
  username?: string;
}

export interface CurrentUser {
  id: string;
  username: string;
}

export function useCurrentUser(): CurrentUser | null {
  const token = useAuthStore((s) => s.token);

  return useMemo(() => {
    if (!token) return null;
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return { id: payload.sub, username: payload.username ?? "" };
    } catch {
      return null;
    }
  }, [token]);
}
