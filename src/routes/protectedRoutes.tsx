import { Outlet , useNavigate} from "react-router-dom";

function isAuthenticated():boolean{
    return document.cookie!==null;
}

function ProtectedRoutes(){
    const navigate = useNavigate();
    if(!isAuthenticated()){
        navigate("/" , {replace : true});
    }

    return(
        <Outlet/>
    )
}

export default ProtectedRoutes;