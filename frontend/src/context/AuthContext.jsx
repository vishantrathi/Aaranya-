import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const cached = localStorage.getItem("pcf_auth");
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem("pcf_auth");
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("pcf_auth")));

  const saveAuth = (payload) => {
    setAuth(payload);
    localStorage.setItem("pcf_auth", JSON.stringify(payload));
  };

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const cached = localStorage.getItem("pcf_auth");
      if (!cached) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(cached);
        if (!parsed?.token) {
          throw new Error("Missing token");
        }

        const { data } = await api.get("/auth/me");
        if (!isMounted) return;

        const normalized = {
          ...parsed,
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          address: data.address,
        };

        saveAuth(normalized);
      } catch {
        if (!isMounted) return;
        setAuth(null);
        localStorage.removeItem("pcf_auth");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signup = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    saveAuth(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveAuth(data);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("pcf_auth");
  };

  const value = useMemo(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.token),
      isAdmin: auth?.role === "admin",
      loading,
      signup,
      login,
      logout,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
