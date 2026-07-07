import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import CustomerLayout from "../components/layout/CustomerLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES, USER_ROLES } from "./routePaths";

const customerRoutes = [
    {
        path: ROUTES.customer.root,
        element: <ProtectedRoute allowedRoles={[USER_ROLES.customer]} />,
        children: [
            {
                element: <CustomerLayout />,
                children: [
                    { path: "cart", element: <Cart /> },
                    { path: "profile", element: <Profile /> },
                    { path: "orders", element: <Orders /> },
                    { path: "orders/:orderId", element: <OrderDetail /> },
                ],
            },
        ],
    },
];

export default customerRoutes;
