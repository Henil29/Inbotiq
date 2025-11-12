"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/axiosClient";
import { TOKEN_KEY, ROLES } from "@/utils/constants";
import { handleError } from "@/utils/handleError";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  initializing: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "admin" | "user") => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Load token and fetch current user
  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) {
      setToken(t);
      refreshUser().finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me", { withCredentials: true });
      setUser(data?.user || data); // support {user} or user directly
    } catch (err) {
      console.error("/auth/me failed:", handleError(err).message);
      setUser(null);
      // don't drop token immediately on 401 so login redirect logic can run
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password }, { withCredentials: true });
    const t = (data?.token as string) || (data?.accessToken as string);
    if (t) {
      if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
    }
    // always fetch user after login to normalize
    await refreshUser();
  };

  const register = async (name: string, email: string, password: string, role?: "admin" | "user") => {
    const payload: Record<string, unknown> = { name, email, password };
    if (role) payload.role = role;
    const { data } = await api.post("/auth/register", payload, { withCredentials: true });
    const t = (data?.token as string) || (data?.accessToken as string);
    if (t) {
      if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      await refreshUser();
    }
  };

  const logout = async () => {
    try {
      // Force cookie/session invalidation if backend uses them
      await api.post("/auth/logout", {}, { withCredentials: true }).catch(() => {});
    } catch (_) {
      // ignore
    }
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
    // Small delay to ensure interceptors don't reuse stale state
    await new Promise((r) => setTimeout(r, 50));
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    initializing,
    isAdmin: !!user && user.role === ROLES.ADMIN,
    login,
    register,
    logout,
    refreshUser,
  }), [user, token, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
