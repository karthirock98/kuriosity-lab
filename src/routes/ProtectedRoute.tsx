import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "@/services/auth.service";

const ProtectedRoute = () => {
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        <Navigate
            to='/login'
            replace
            state={{ from: location }}
        />
    }

    return <Outlet />
}

export default ProtectedRoute;