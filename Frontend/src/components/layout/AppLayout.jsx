import React from "react";
import { Outlet } from "react-router-dom";
import AuthModal from "../auth/AuthModal";
import CartOverlay from "../cart/CartOverlay";

const AppLayout = () => {
    return (
        <>
            <Outlet />
            <CartOverlay />
            <AuthModal />
        </>
    );
};

export default AppLayout;
