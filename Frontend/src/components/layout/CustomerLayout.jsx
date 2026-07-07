import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import TopHeader from "./TopHeader";

const CustomerLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <TopHeader />
            <Navbar />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default CustomerLayout;
