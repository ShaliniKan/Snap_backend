import { useState } from "react";
import CategoryBar from "./CategoryBar";
import MobileMenu from "./navbar/MobileMenu";
import MobileMenuButton from "./navbar/MobileMenuButton";
import NavbarActions from "./navbar/NavbarActions";
import NavbarLogo from "./navbar/NavbarLogo";
import NavbarSearch from "./navbar/NavbarSearch";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, openLogin } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
            <div className="px-4 py-3 sm:px-6 lg:px-12">
                <div className="flex items-center gap-4">
                    <NavbarLogo />

                    <div className="hidden flex-1 md:flex">
                        <NavbarSearch />
                    </div>

                    <div className="hidden lg:block">
                        <NavbarActions />
                    </div>

                    <div className="ml-auto lg:hidden">
                        <MobileMenuButton
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen((current) => !current)}
                        />
                    </div>
                </div>

                <div className="mt-3 md:hidden">
                    <NavbarSearch />
                </div>
            </div>

            <div className="border-t border-slate-100">
                <CategoryBar />
            </div>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                isLoggedIn={isAuthenticated}
                onLoginClick={openLogin}
            />
        </header>
    );
};

export default Navbar;
