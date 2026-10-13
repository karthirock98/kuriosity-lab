import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "@/services/auth.service";
import NavigationMenuComp from "@/components/ui/NavigationMenu";

const ProtectedRoute = () => {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="landing-container">
      <header className="absolute top-0 right-0 z-50">
        <NavigationMenuComp />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
