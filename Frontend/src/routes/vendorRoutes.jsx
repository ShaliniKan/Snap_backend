import { Navigate } from "react-router-dom";
import VendorLayout from "../components/layout/VendorLayout";
import ProtectedRoute from "./ProtectedRoute";
import VendorGate from "./VendorGate";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorProducts from "../pages/vendor/VendorProducts";
import VendorProductForm from "../pages/vendor/VendorProductForm";
import VendorOrders from "../pages/vendor/VendorOrders";
import VendorProfile from "../pages/vendor/VendorProfile";
import { ROUTES, USER_ROLES } from "./routePaths";

const vendorRoutes = [
    {
        path: ROUTES.vendor.root,
        element: <ProtectedRoute allowedRoles={[USER_ROLES.vendor]} />,
        children: [
            {
                element: <VendorLayout />,
                children: [
                    { index: true, element: <Navigate to={ROUTES.vendor.dashboard} replace /> },
                    {
                        path: "dashboard",
                        element: (
                            <VendorGate requireApproval>
                                <VendorDashboard />
                            </VendorGate>
                        ),
                    },
                    { path: "products", element: <VendorProducts /> },
                    { path: "products/new", element: <VendorProductForm /> },
                    { path: "products/:productId/edit", element: <VendorProductForm /> },
                    { path: "orders", element: <VendorOrders /> },
                    { path: "profile", element: <VendorProfile /> },
                ],
            },
        ],
    },
];

export default vendorRoutes;
