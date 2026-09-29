import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../services/auth.service";

const PublicRoute = () => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/landing" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;