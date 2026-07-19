import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES, USER_ROLES } from "../../../routes/routePaths";

const UserIcon = ({ className = "h-6 w-6" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
    </svg>
);

const OrdersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 shrink-0">
        <path d="M4 7.5 12 4l8 3.5v8L12 19l-8-3.5v-8Z" strokeLinejoin="round" />
        <path d="M12 4v15M4 7.5l8 3.5 8-3.5" strokeLinejoin="round" />
    </svg>
);

const GiftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 shrink-0">
        <rect x="4" y="10" width="16" height="10" rx="1" />
        <path d="M12 10V20M4 10h16M12 10c-2 0-3-1.2-3-2.5S10 5 12 5s3 .8 3 2.5S14 10 12 10Z" strokeLinejoin="round" />
        <path d="M12 5V10" />
    </svg>
);

const UserAccountMenu = ({ variant = "home" }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const displayName = user?.firstName || "User";
    const isVendor = user?.role === USER_ROLES.vendor;
    const ordersPath = isVendor ? ROUTES.vendor.orders : ROUTES.customer.orders;

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate(ROUTES.public.home);
    };

    const menuItems = [
        {
            label: "Orders",
            to: ordersPath,
            icon: <OrdersIcon />,
            show: true,
        },
        {
            label: "E-Gift Voucher",
            to: ROUTES.customer.giftVoucher,
            icon: <GiftIcon />,
            show: !isVendor,
        },
    ];

    const triggerClass =
        variant === "store"
            ? "flex items-center gap-2 transition hover:opacity-90"
            : "flex flex-col items-center gap-1 px-1 transition hover:opacity-80";

    const nameClass =
        variant === "store"
            ? "max-w-[80px] truncate text-sm font-medium text-white"
            : "max-w-[72px] truncate text-xs font-bold text-slate-800";

    const avatarClass =
        variant === "store"
            ? "flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/15"
            : "";

    const iconClass = variant === "store" ? "h-5 w-5 text-white" : "h-6 w-6 text-slate-700";

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className={triggerClass}
                onClick={() => setIsOpen((current) => !current)}
            >
                {variant === "store" ? (
                    <>
                        <span className={nameClass}>{displayName}</span>
                        <div className={avatarClass}>
                            <UserIcon className={iconClass} />
                        </div>
                    </>
                ) : (
                    <>
                        <UserIcon className={iconClass} />
                        <span className={nameClass}>{displayName}</span>
                    </>
                )}
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[190px] overflow-hidden rounded-[4px] bg-[#333333] shadow-lg"
                    role="menu"
                >
                    <div className="py-1">
                        {menuItems
                            .filter((item) => item.show)
                            .map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    role="menuitem"
                                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-normal text-white transition hover:bg-[#3a3a3a]"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                    </div>

                    <div className="border-t border-[#4a4a4a] bg-[#444444] px-4 py-3">
                        <button
                            type="button"
                            role="menuitem"
                            className="w-full text-center text-[13px] font-bold tracking-wide text-white transition hover:text-white/90"
                            onClick={handleLogout}
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAccountMenu;
