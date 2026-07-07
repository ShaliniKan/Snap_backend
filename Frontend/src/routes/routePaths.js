export const ROUTES = {
    public: {
        home: "/",
        products: "/products",
        productDetails: "/products/:productId",
        category: "/categories/:categoryId",
        subcategory: "/categories/:categoryId/subcategories/:subcategoryId",
        sell: "/sell",
    },
    customer: {
        root: "/customer",
        cart: "/customer/cart",
        checkout: "/customer/checkout",
        orders: "/customer/orders",
        orderDetails: "/customer/orders/:orderId",
        profile: "/customer/profile",
    },
    vendor: {
        root: "/vendor",
        dashboard: "/vendor/dashboard",
        products: "/vendor/products",
        productNew: "/vendor/products/new",
        productEdit: "/vendor/products/:productId/edit",
        orders: "/vendor/orders",
        profile: "/vendor/profile",
    },
    admin: {
        root: "/admin",
        dashboard: "/admin/dashboard",
        orders: "/admin/orders",
        vendors: "/admin/vendors",
        coupons: "/admin/coupons",
        returns: "/admin/returns",
    },
};

export const USER_ROLES = {
    customer: "customer",
    user: "user",
    vendor: "vendor",
    admin: "admin",
};
