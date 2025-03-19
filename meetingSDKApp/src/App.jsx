import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./pages/components/PrivateRoutes";
import ZoomRedirect from "./pages/ZoomRedirect";

export default function App() {
  const [zoomAuth, setZoomAuth] = useState(false);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login setZoomAuth={setZoomAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard zoomAuth={zoomAuth} setZoomAuth={setZoomAuth} />
            }
          />
          <Route path="/dashboard/zoom-redirect" element={<ZoomRedirect />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
