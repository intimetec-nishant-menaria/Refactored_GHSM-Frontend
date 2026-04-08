import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useRefreshMutation } from "@/app/Api's/auth"; 
import { useEffect, useState } from "react";
import { logOut } from "@/app/slices/auth";

interface AuthGuardProps {
  allowedRoles?: string[];
  isPublicOnly?: boolean;
}

const AuthGuard = ({ allowedRoles, isPublicOnly }: AuthGuardProps) => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  
  const [isRefreshing, setIsRefreshing] = useState(!token);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        try {
          await refresh().unwrap();
        } catch (err) {
          dispatch(logOut());
        } finally {
          setIsRefreshing(false);
        }
      } else {
        setIsRefreshing(false);
      }
    };

    initializeAuth();
  }, [token, refresh, dispatch]);

  if (isRefreshing) {
    return <div>Loading session...</div>;
  }

  if (isPublicOnly) {
    if (user) {
      return <Navigate to={getHomePathByRole(user.role)} replace />;
    }
    return <Outlet />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
      return "/hr/dashboard";
    case "Guard":
      return "/guard/dashboard";
    default:
      return "/login";
  }
};

export default AuthGuard;