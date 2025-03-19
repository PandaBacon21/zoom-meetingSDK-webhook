import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function PrivateRoutes({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
