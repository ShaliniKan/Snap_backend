import { Outlet } from "react-router-dom";
import { SiteFooterBottom, TrustBadgesBar } from "./HomeFooter";
import Navbar from "./Navbar";
import TopHeader from "./TopHeader";

const CustomerLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-page">            <TopHeader variant="store" />
            <Navbar variant="store" showCategoryBar={false} />

            <main className="mx-auto w-full max-w-page flex-1 px-4 py-5 sm:px-6 lg:px-8">
                <Outlet />
            </main>

            <TrustBadgesBar productStyle />
            <SiteFooterBottom productStyle showSubscribe showSeo={false} />
        </div>
    );
};

export default CustomerLayout;
