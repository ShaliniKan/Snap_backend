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
        orders: "/customer/orders",
        orderDetails: "/customer/orders/:orderId",
        savedCards: "/customer/saved-cards",
        changePassword: "/customer/change-password",
        addresses: "/customer/addresses",
        addressNew: "/customer/addresses/new",
        addressEdit: "/customer/addresses/:addressId/edit",
        giftVoucher: "/customer/gift-voucher",
    },
    vendor: {
        root: "/vendor",
        dashboard: "/vendor/dashboard",
        products: "/vendor/products",
        productNew: "/vendor/products/new",
        productEdit: "/vendor/products/:productId/edit",
        orders: "/vendor/orders",
        profile: "/vendor/profile",
        platform: "/vendor/platform",
        allOrders: "/vendor/all-orders",
        coupons: "/vendor/coupons",
        returns: "/vendor/returns",
    },
};

export const USER_ROLES = {
    customer: "customer",
    vendor: "vendor",
};
