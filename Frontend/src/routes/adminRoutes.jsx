import { Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminVendorApproval from "../pages/admin/AdminVendorApproval";
import AdminCoupons from "../pages/admin/AdminCoupons";
import AdminReturns from "../pages/admin/AdminReturns";
import { ROUTES, USER_ROLES } from "./routePaths";

const adminRoutes = [
    {
        path: ROUTES.admin.root,
        element: <ProtectedRoute allowedRoles={[USER_ROLES.admin]} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to={ROUTES.admin.dashboard} replace /> },
                    { path: "dashboard", element: <AdminDashboard /> },
                    { path: "orders", element: <AdminOrders /> },
                    { path: "vendors", element: <AdminVendorApproval /> },
                    { path: "coupons", element: <AdminCoupons /> },
                    { path: "returns", element: <AdminReturns /> },
                ],
            },
        ],
    },
];

export default adminRoutes;
