import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { ROUTES } from "./routePaths";



const ProtectedRoute = ({ allowedRoles = [] }) => {

    const location = useLocation();

    const { isAuthenticated, user } = useAuth();

    const role = user?.role;

    const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.includes(role);



    if (!isAuthenticated) {
        const loginPath = allowedRoles.includes("vendor")
            ? `${ROUTES.public.home}?login=1&vendor=1`
            : `${ROUTES.public.home}?login=1`;

        return (
            <Navigate
                to={loginPath}
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

