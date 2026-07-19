import { Link } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";
import { ROUTES } from "../../../routes/routePaths";

const AccountPageLayout = ({ pageTitle, breadcrumbCurrent, titleExtra, hideTitle = false, children }) => {
    return (
        <div>
            <nav className="mb-4 text-[12px] text-[#999999]">
                <Link to={ROUTES.public.home} className="hover:text-[#666666]">
                    Home
                </Link>
                <span className="mx-1">/</span>
                <Link to={ROUTES.customer.orders} className="hover:text-[#666666]">
                    My Account
                </Link>
                <span className="mx-1">/</span>
                <span className="text-[#666666]">{breadcrumbCurrent}</span>
            </nav>

            <div className="flex border border-[#e0e0e0] bg-white shadow-sm">
                <AccountSidebar />
                <section className="min-h-[520px] flex-1 bg-white p-6">
                    {!hideTitle && (
                        <div className="flex flex-wrap items-center gap-x-3 border-b border-[#e0e0e0] pb-3">
                            <h1 className="text-[16px] font-normal uppercase tracking-[0.04em] text-[#666666]">
                                {pageTitle}
                            </h1>
                            {titleExtra}
                        </div>
                    )}
                    <div className={hideTitle ? "" : "mt-6"}>{children}</div>
                </section>
            </div>
        </div>
    );
};

export default AccountPageLayout;
