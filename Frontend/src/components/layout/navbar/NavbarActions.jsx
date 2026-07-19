import { useCartContext } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { USER_ROLES } from "../../../routes/routePaths";
import UserAccountMenu from "./UserAccountMenu";

const UserIcon = ({ className = "h-6 w-6 text-slate-700" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
    </svg>
);

const CartIcon = ({ className = "h-6 w-6 text-slate-700" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
        <path d="M6 6L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
    </svg>
);

const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-white">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8M14 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const NavbarActions = ({ variant = "home" }) => {
    const { openCart, totalItems } = useCartContext();
    const { isAuthenticated, user, openLogin } = useAuth();

    const showCart = user?.role !== USER_ROLES.vendor;

    if (variant === "store") {
        return (
            <div className="flex items-center gap-6 text-white">
                {showCart && (
                    <button
                        type="button"
                        onClick={openCart}
                        className="relative flex items-center gap-2 transition hover:opacity-90"
                    >
                        <span className="text-sm font-medium">Cart</span>
                        <div className="relative">
                            <CartIcon className="h-6 w-6 text-white" />
                            {totalItems > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#e40145]">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                    </button>
                )}

                {isAuthenticated ? (
                    <UserAccountMenu variant="store" />
                ) : (
                    <button
                        type="button"
                        onClick={openLogin}
                        className="flex items-center gap-2 transition hover:opacity-90"
                    >
                        <span className="text-sm font-medium">Login</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/15">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-5 lg:gap-6">
            {isAuthenticated ? (
                <UserAccountMenu variant="home" />
            ) : (
                <button
                    type="button"
                    onClick={openLogin}
                    className="flex flex-col items-center gap-1 px-1 transition hover:opacity-80"
                >
                    <UserIcon />
                    <span className="text-xs font-bold text-slate-800">Login</span>
                </button>
            )}

            {showCart && (
                <button
                    type="button"
                    onClick={openCart}
                    className="relative flex flex-col items-center gap-1 px-1 transition hover:opacity-80"
                >
                    <div className="relative">
                        <CartIcon />
                        {totalItems > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-white">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">My Cart</span>
                </button>
            )}

            <a
                href="/"
                className="hidden items-center gap-2 rounded-md bg-brand-accent px-3 py-2 text-white transition hover:bg-brand-dark sm:flex"
            >
                <DownloadIcon />
                <span className="text-left text-[11px] font-bold leading-tight">
                    Download
                    <br />
                    App
                </span>
            </a>
        </div>
    );
};

export default NavbarActions;
