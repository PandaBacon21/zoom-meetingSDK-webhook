import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./pages/components/PrivateRoutes";
import ZoomRedirect from "./pages/ZoomRedirect";
import { ZoomProvider } from "./context/ZoomContext";

export default function App() {
  return (
    <ZoomProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/redirect" element={<ZoomRedirect />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ZoomProvider>
  );
}
