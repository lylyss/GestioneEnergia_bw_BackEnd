import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user: {username, email, role, ...}

  const login = (userData) => {
    setUser(userData);
    // localStorage.setItem("user", JSON.stringify(userData)); // opzionale
  };

  const logout = () => {
    setUser(null);
    // localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
