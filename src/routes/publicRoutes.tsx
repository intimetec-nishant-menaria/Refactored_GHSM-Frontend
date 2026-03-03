import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PublicRoutes() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  const authRoutes = ["/login"];

  if (user && authRoutes.includes(location.pathname)) {
    console.log(location.pathname)
    if (user.role === 1) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  return <Outlet />;
}

export default PublicRoutes;