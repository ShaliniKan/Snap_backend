import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routePaths";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const role = user?.role;
    const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.includes(role);

    if (!isAuthenticated) {
        return (
            <Navigate
                to={`${ROUTES.public.home}?login=1`}
                replace
                state={{ from: location }}
            />
        );
    }

    if (!hasAllowedRole) {
        return <Navigate to={ROUTES.public.home} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
