"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type User = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  isHydrated: boolean;
  initials: string;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const readStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const isHydrated = typeof window !== "undefined";

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const initials = useMemo(() => {
    if (!user?.name) return "";
    const parts = user.name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isHydrated, initials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
