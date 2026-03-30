import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

interface AuthGuardProps {
  allowedRoles?: string[]; 
  isPublicOnly?: boolean;  
}

const AuthGuard = ({ allowedRoles, isPublicOnly }: AuthGuardProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  if (isPublicOnly && user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }
  if (!isPublicOnly && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return <Outlet />;
};
const getHomePathByRole = (role: string | undefined): string => {
  switch (role) {
    case "Admin":
    case "Ops":
      return "/admin/dashboard";
    case "HR":
      return "/hr/availability";
    case "Guard":
      return "/guard/bookings";
    default:
      return "/login";
  }
};

export default AuthGuard;