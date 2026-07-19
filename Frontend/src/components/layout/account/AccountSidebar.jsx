import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../routes/routePaths";
import { STORE_BRAND_RED } from "../../../utils/brandColors";

const OrdersSectionIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
        <path d="M6 2h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm8 1.5V6h2.5L14 3.5ZM7 8h10v1H7V8Zm0 3h10v1H7v-1Zm0 3h7v1H7v-1Z" />
    </svg>
);

const ProfileSectionIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.1 0-7.5 2.1-7.5 4.7V20h15v-1.3C19.5 16.1 16.1 14 12 14Z" />
    </svg>
);

const PaymentsSectionIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
        <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 3v2h16V9H4Zm2 8h4v-2H6v2Z" />
    </svg>
);

const sidebarLinkClass = (isActive) =>
    `block py-2 pl-8 text-[13px] transition ${
        isActive ? "font-normal text-[#e40046]" : "text-[#333333] hover:text-[#e40046]"
    }`;

const AccountSidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Customer";
    const email = user?.email || "";
    const isOrdersSection = location.pathname.includes("/customer/orders");
    const isAddressesSection = location.pathname.includes("/customer/addresses");
    const isSavedCardsSection = location.pathname.includes("/customer/saved-cards");
    const isChangePasswordSection = location.pathname.includes("/customer/change-password");
    const isGiftVoucherSection = location.pathname.includes("/customer/gift-voucher");

    const handleSignOutAllDevices = () => {
        logout();
        window.location.href = ROUTES.public.home;
    };

    return (
        <aside className="w-[280px] shrink-0 border-r border-[#e0e0e0] bg-white">
            <div className="border-b border-[#e0e0e0] px-5 py-4">
                <h2 className="text-[15px] font-bold uppercase tracking-wide" style={{ color: STORE_BRAND_RED }}>
                    My Account
                </h2>
            </div>

            <div className="px-5 py-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d9d9d9]">
                        <ProfileSectionIcon />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[14px] font-normal text-[#333333]">{displayName}</p>
                        <p className="truncate text-[12px] text-[#666666]">{email}</p>
                    </div>
                </div>

                <div className="mt-4 rounded-[2px] border border-[#c9e6f5] bg-[#e8f4fc] px-3 py-3 text-[11px] leading-relaxed text-[#333333]">
                    You might be logged in on other devices. To sign out from all devices{" "}
                    <button
                        type="button"
                        className="font-normal text-[#2f82c6] hover:underline"
                        onClick={handleSignOutAllDevices}
                    >
                        CLICK HERE
                    </button>
                </div>
            </div>

            <nav className="border-t border-[#e0e0e0]">
                <div className="border-b border-[#e0e0e0] px-5 py-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#666666]">
                        <OrdersSectionIcon />
                        <span>Orders</span>
                    </div>
                    <Link to={ROUTES.customer.orders} className={sidebarLinkClass(isOrdersSection)}>
                        Orders
                    </Link>
                </div>

                <div className="border-b border-[#e0e0e0] px-5 py-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#666666]">
                        <ProfileSectionIcon />
                        <span>Profile</span>
                    </div>
                    <Link
                        to={ROUTES.customer.addresses}
                        className={sidebarLinkClass(isAddressesSection)}
                    >
                        Saved Addresses
                    </Link>
                    <Link
                        to={ROUTES.customer.savedCards}
                        className={sidebarLinkClass(isSavedCardsSection)}
                    >
                        Saved Cards
                    </Link>
                    <Link
                        to={ROUTES.customer.changePassword}
                        className={sidebarLinkClass(isChangePasswordSection)}
                    >
                        Change Password
                    </Link>
                </div>

                <div className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#666666]">
                        <PaymentsSectionIcon />
                        <span>Payments</span>
                    </div>
                    <Link
                        to={ROUTES.customer.giftVoucher}
                        className={sidebarLinkClass(isGiftVoucherSection)}
                    >
                        E-Gift Voucher Balance
                    </Link>
                </div>
            </nav>
        </aside>
    );
};

export default AccountSidebar;
