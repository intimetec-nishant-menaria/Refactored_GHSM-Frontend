import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const token = document.cookie;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;
