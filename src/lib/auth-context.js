"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const dummyUsers = [
  // { email: "admin@inditronics.com", password: "Admin@123", role: "admin" },
  // { email: "guest@inditronics.com", password: "Guest@123", role: "guest" },
  { email: "ankur.auti@inditronics.com", password: "Ankur@123", role: "user" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    const foundUser = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const userData = { email: foundUser.email, role: foundUser.role };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
