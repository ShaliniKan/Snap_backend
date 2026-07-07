import { createBrowserRouter, RouterProvider } from "react-router-dom";
import customerRoutes from "./customerRoutes";
import publicRoutes from "./publicRoutes";
import vendorRoutes from "./vendorRoutes";
import adminRoutes from "./adminRoutes";
import AppLayout from "../components/layout/AppLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [...publicRoutes, ...customerRoutes, ...vendorRoutes, ...adminRoutes],
    },
]);

const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
