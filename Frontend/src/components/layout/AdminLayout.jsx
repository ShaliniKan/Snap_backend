import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routePaths";

const navItems = [
    { label: "Dashboard", to: ROUTES.admin.dashboard },
    { label: "Orders", to: ROUTES.admin.orders },
    { label: "Vendors", to: ROUTES.admin.vendors },
    { label: "Coupons", to: ROUTES.admin.coupons },
    { label: "Returns", to: ROUTES.admin.returns },
];

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Admin Panel</p>
                        <h1 className="text-xl font-semibold text-slate-900">ApnaMart Control Centre</h1>
                    </div>
                    <div className="flex gap-3">
                        <NavLink className="text-sm font-semibold text-slate-600 hover:text-red-500" to={ROUTES.public.home}>Storefront</NavLink>
                        <button className="rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white" onClick={() => { logout(); navigate(ROUTES.public.home); }} type="button">Logout</button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <aside className="hidden w-56 shrink-0 md:block">
                    <nav className="space-y-1 rounded-sm border border-slate-200 bg-white p-3 shadow-sm">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `block rounded-sm px-3 py-2 text-sm font-semibold ${isActive ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="min-w-0 flex-1"><Outlet /></main>
            </div>
        </div>
    );
};

export default AdminLayout;
