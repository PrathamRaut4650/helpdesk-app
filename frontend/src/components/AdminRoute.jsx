import {Navigate, useNavigate} from "react-router-dom"
import { useSelector } from "react-redux"

function AdminRoute({children}){
    const token = useSelector((state)=>state.auth.token);
    const userRole = localStorage.getItem("role")

    if(!token){
        return <Navigate to="/login" replace />;
    }
    if(userRole !== "admin"){
        return <Navigate to="/dashboard" replace/>;
    }
    return children;
}
export default AdminRoute