import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate, Outlet } from "react-router-dom";

function AdminOnlyRoutes(){
    const {user} = useAppSelector(state=>state.auth);

    return (user?.role === "Admin" || user?.role==="Ops") ? <Outlet/> : <Navigate to="/" replace/>;
}

export default AdminOnlyRoutes;