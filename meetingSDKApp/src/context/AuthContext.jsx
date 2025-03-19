import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useZoomAuth } from "./ZoomContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { updateZoomAuthState } = useZoomAuth();

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
    updateZoomAuthState(false);
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
