import { createBrowserRouter, RouterProvider } from "react-router-dom";
import customerRoutes from "./customerRoutes";
import publicRoutes from "./publicRoutes";
import vendorRoutes from "./vendorRoutes";
import AppLayout from "../components/layout/AppLayout";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [...publicRoutes, ...customerRoutes, ...vendorRoutes],
        errorElement: <NotFound />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
