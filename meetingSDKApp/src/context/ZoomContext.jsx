import { createContext, useContext, useState } from "react";

const ZoomContext = createContext(null);

export function ZoomProvider({ children }) {
  const [zoomAuthenticated, setZoomAuthenticated] = useState(() =>
    JSON.parse(localStorage.getItem("zm-auth") || false)
  );

  const updateZoomAuthState = (isAuthenticated) => {
    if (isAuthenticated) {
      localStorage.setItem("zm-auth", isAuthenticated);
      setZoomAuthenticated(isAuthenticated);
    } else {
      localStorage.removeItem("zm-auth");
      setZoomAuthenticated(false);
    }
  };

  return (
    <ZoomContext.Provider value={{ zoomAuthenticated, updateZoomAuthState }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoomAuth() {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error("useZoomAuth must be used with a ZoomAuthProvider");
  }
  return context;
}
