import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "./routePaths";

const LegacyProfileRedirect = () => {
    const location = useLocation();

    if (location.hash === "#saved-cards") {
        return <Navigate to={ROUTES.customer.savedCards} replace />;
    }

    if (location.hash === "#saved-addresses") {
        return <Navigate to={ROUTES.customer.addresses} replace />;
    }

    if (location.hash === "#change-password") {
        return <Navigate to={ROUTES.customer.changePassword} replace />;
    }

    return <Navigate to={ROUTES.customer.orders} replace />;
};

export default LegacyProfileRedirect;
