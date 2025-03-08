import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ token }) => {
  let auth = { token: token };
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
