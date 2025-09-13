import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, AuthUser } from "../types";
import { getProfile, loginRequest, logoutRequest, api } from "../api/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchUser = async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // Background silent refresh every 4 min if tab visible
  useEffect(() => {
    const interval = setInterval(async () => {
      const isVisible = document.visibilityState === "visible";
      if (!isVisible || !user) return;

      try {
        await api.post("/refresh");
      } catch {
        setUser(null);
        window.location.href = "/timeout";
      }
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async () => {
    await loginRequest();
    await fetchUser();
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
