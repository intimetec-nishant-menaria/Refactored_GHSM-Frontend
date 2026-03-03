import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate, Outlet} from "react-router-dom";


function ProtectedRoutes(){
    const  {user ,loading} = useAppSelector(state=>state.auth);

    if(loading) return <div>Loading...</div>
    
    return user ? <Outlet/> : <Navigate to ="/login" replace/>
}

export default ProtectedRoutes;