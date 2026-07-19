import { Navigate } from "react-router-dom";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import SavedAddresses from "../pages/SavedAddresses";
import SavedCards from "../pages/SavedCards";
import AddressForm from "../pages/AddressForm";
import EGiftVoucher from "../pages/EGiftVoucher";
import ChangePassword from "../pages/ChangePassword";
import CustomerLayout from "../components/layout/CustomerLayout";
import ProtectedRoute from "./ProtectedRoute";
import LegacyProfileRedirect from "./LegacyProfileRedirect";
import { ROUTES, USER_ROLES } from "./routePaths";

const customerRoutes = [
    {
        path: ROUTES.customer.root,
        element: <ProtectedRoute allowedRoles={[USER_ROLES.customer]} />,
        children: [
            {
                element: <CustomerLayout />,
                children: [
                    { index: true, element: <Navigate to="orders" replace /> },
                    { path: "cart", element: <Cart /> },
                    { path: "addresses", element: <SavedAddresses /> },
                    { path: "addresses/new", element: <AddressForm /> },
                    { path: "addresses/:addressId/edit", element: <AddressForm /> },
                    { path: "saved-cards", element: <SavedCards /> },
                    { path: "change-password", element: <ChangePassword /> },
                    { path: "orders", element: <Orders /> },                    { path: "orders/:orderId", element: <OrderDetail /> },
                    { path: "gift-voucher", element: <EGiftVoucher /> },
                    { path: "profile", element: <LegacyProfileRedirect /> },
                ],
            },
        ],
    },
];

export default customerRoutes;
