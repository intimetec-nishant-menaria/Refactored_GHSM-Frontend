import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useGetUserDetailsQuery } from "@/app/Api's/auth";
import { useEffect } from "react";
import { removeuser, setUser } from "@/app/slices/auth";
interface AuthGuardProps {
  allowedRoles?: string[];
  isPublicOnly?: boolean;
}

const AuthGuard = ({ allowedRoles, isPublicOnly }: AuthGuardProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const hasToken = document.cookie.includes("jwtToken"); 

  const { data, isFetching, isSuccess, isError } = useGetUserDetailsQuery(undefined, {
    skip: !hasToken, 
  });

  useEffect(() => {
    if (!isFetching) {
      if (isSuccess && data) {
        dispatch(setUser(data));
      } else if (isError) {
        dispatch(removeuser());
      }
    }
  }, [data, isFetching, isSuccess, isError, dispatch]);

  if (hasToken && (isFetching || !user)) {
    if (!isError) return <div>Loading...</div>;
  }

  if (!hasToken && !isPublicOnly) {
    return <Navigate to="/login" replace />;
  }

  if (user && isPublicOnly) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
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