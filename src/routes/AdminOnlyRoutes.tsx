import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate, Outlet } from "react-router-dom";

function AdminOnlyRoutes(){
    const {user} = useAppSelector(state=>state.auth);

    return user?.role !== "Admin" ? <Navigate to="/" replace/> : <Outlet/> ;
}

export default AdminOnlyRoutes;