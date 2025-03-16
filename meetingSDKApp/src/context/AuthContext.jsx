import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    setIsLoading(true);
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const updateAuthState = () => {
    checkAuth();
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        updateAuthState,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
