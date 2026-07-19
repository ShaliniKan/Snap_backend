import { useState } from "react";
import { useLocation } from "react-router-dom";
import CategoryBar from "./CategoryBar";
import MobileMenu from "./navbar/MobileMenu";
import MobileMenuButton from "./navbar/MobileMenuButton";
import StoreCategoryDrawer from "./navbar/StoreCategoryDrawer";
import NavbarActions from "./navbar/NavbarActions";
import NavbarLogo from "./navbar/NavbarLogo";
import NavbarSearch from "./navbar/NavbarSearch";
import { useAuth } from "../../context/AuthContext";
import { STORE_BRAND_RED } from "../../utils/brandColors";

const Navbar = ({ variant: variantProp, showCategoryBar: showCategoryBarProp }) => {
    const location = useLocation();
    const isStoreRoute =
        location.pathname.startsWith("/categories") || location.pathname.startsWith("/products");
    const variant = variantProp || (isStoreRoute ? "store" : "home");
    const showCategoryBar = showCategoryBarProp ?? variant === "home";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, openLogin } = useAuth();

    const headerClass =
        variant === "store"
            ? "sticky top-0 z-[70] w-full shadow-md"
            : "sticky top-0 z-40 w-full bg-white shadow-sm";

    const headerStyle = variant === "store" ? { backgroundColor: STORE_BRAND_RED } : undefined;

    return (
        <header className={headerClass} data-store-navbar={variant === "store" ? "true" : undefined} style={headerStyle}>
            <div
                className={
                    variant === "store"
                        ? "px-4 py-3 sm:px-6 lg:px-12"
                        : "border-b border-slate-100 px-3 py-3 sm:px-4 lg:px-6"
                }
            >
                <div className="mx-auto flex max-w-page items-center gap-1 lg:gap-1">
                    <div className="flex items-center gap-1">                        <NavbarLogo variant={variant} />
                        {variant === "store" && (
                            <MobileMenuButton
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen((current) => !current)}
                                variant={variant}
                            />
                        )}
                    </div>

                    <div className="hidden flex-1 justify-center md:flex">
                        <NavbarSearch variant={variant} />
                    </div>

                    <div className={variant === "store" ? "ml-auto flex" : "hidden lg:flex"}>
                        <NavbarActions variant={variant} />
                    </div>

                    {variant !== "store" && (
                        <div className="ml-auto lg:hidden">
                            <MobileMenuButton
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen((current) => !current)}
                                variant={variant}
                            />
                        </div>
                    )}
                </div>

                <div className="mx-auto mt-3 max-w-page md:hidden">
                    <NavbarSearch variant={variant} />
                </div>            </div>

            {showCategoryBar && (
                <div className="border-b border-slate-100">
                    <CategoryBar />
                </div>
            )}

            {variant === "store" ? (
                <StoreCategoryDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            ) : (
                <MobileMenu
                    isOpen={isMobileMenuOpen}
                    isLoggedIn={isAuthenticated}
                    onLoginClick={openLogin}
                />
            )}
        </header>
    );
};

export default Navbar;
