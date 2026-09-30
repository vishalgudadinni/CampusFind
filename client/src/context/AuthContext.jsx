import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem("campusFindToken");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error.response?.data?.message || error.message
        );

        localStorage.removeItem("campusFindToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("campusFindToken", token);

    setUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("campusFindToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}