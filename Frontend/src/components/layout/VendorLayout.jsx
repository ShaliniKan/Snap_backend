import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routePaths";

const navItems = [
    { label: "Dashboard", to: ROUTES.vendor.dashboard },
    { label: "Products", to: ROUTES.vendor.products },
    { label: "Orders", to: ROUTES.vendor.orders },
    { label: "Profile", to: ROUTES.vendor.profile },
];

const VendorLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isApproved = user?.approvalStatus === "approved";

    const handleLogout = () => {
        logout();
        navigate(ROUTES.public.home);
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Vendor Panel</p>
                        <h1 className="text-xl font-semibold text-slate-900">ApnaMart Seller Centre</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <NavLink className="text-sm font-semibold text-slate-600 hover:text-red-500" to={ROUTES.public.home}>
                            Storefront
                        </NavLink>
                        <button
                            className="rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                            onClick={handleLogout}
                            type="button"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {!isApproved && (
                <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:px-6 lg:px-8">
                    Your seller account is <strong>{user?.approvalStatus || "pending"}</strong>. Complete your profile and wait for admin approval to manage products.
                </div>
            )}

            <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <aside className="hidden w-56 shrink-0 md:block">
                    <nav className="space-y-1 rounded-sm border border-slate-200 bg-white p-3 shadow-sm">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `block rounded-sm px-3 py-2 text-sm font-semibold transition ${
                                        isActive ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="min-w-0 flex-1">
                    <Outlet />
                </main>
            </div>

            <Footer variant="vendor" />
        </div>
    );
};

export default VendorLayout;
