import { Navigate } from "react-router-dom";
import VendorLayout from "../components/layout/VendorLayout";
import ProtectedRoute from "./ProtectedRoute";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorProducts from "../pages/vendor/VendorProducts";
import VendorProductForm from "../pages/vendor/VendorProductForm";
import VendorOrders from "../pages/vendor/VendorOrders";
import VendorProfile from "../pages/vendor/VendorProfile";
import VendorPlatformOverview from "../pages/vendor/VendorPlatformOverview";
import VendorAllOrders from "../pages/vendor/VendorAllOrders";
import VendorCoupons from "../pages/vendor/VendorCoupons";
import VendorReturns from "../pages/vendor/VendorReturns";
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
                    { path: "dashboard", element: <VendorDashboard /> },
                    { path: "products", element: <VendorProducts /> },
                    { path: "products/new", element: <VendorProductForm /> },
                    { path: "products/:productId/edit", element: <VendorProductForm /> },
                    { path: "orders", element: <VendorOrders /> },
                    { path: "profile", element: <VendorProfile /> },
                    { path: "platform", element: <VendorPlatformOverview /> },
                    { path: "all-orders", element: <VendorAllOrders /> },
                    { path: "coupons", element: <VendorCoupons /> },
                    { path: "returns", element: <VendorReturns /> },
                ],
            },
        ],
    },
];

export default vendorRoutes;
