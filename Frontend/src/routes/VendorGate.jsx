import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routePaths";

const VendorGate = ({ children, requireApproval = false }) => {
    const { user } = useAuth();

    if (user?.role === "vendor" && user?.approvalStatus === "rejected") {
        return (
            <div className="rounded-sm border border-red-200 bg-red-50 p-6 text-center">
                <h2 className="text-lg font-semibold text-red-700">Seller application rejected</h2>
                <p className="mt-2 text-sm text-red-600">Please contact support or update your business details in Profile.</p>
            </div>
        );
    }

    if (requireApproval && user?.approvalStatus !== "approved") {
        return <Navigate to={ROUTES.vendor.profile} replace />;
    }

    return children;
};

export default VendorGate;
