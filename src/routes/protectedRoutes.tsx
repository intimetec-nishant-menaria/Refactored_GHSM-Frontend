import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate, Outlet} from "react-router-dom";


function ProtectedRoutes(){
    const  {user ,loading} = useAppSelector(state=>state.auth);

    if(loading) return <div>Loading...</div>
    if(!user){
        return <Navigate to="/" replace />
    }

    return(
        <Outlet/>
    )
}

export default ProtectedRoutes;