import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "health_web_admin";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem(TOKEN_KEY);
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setToken(parsed.token);
      setUser(parsed.user);
    }
    setLoading(false);
  }, []);

  const login = ({ token, user }) => {
    const authData = { token, user };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(authData));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
