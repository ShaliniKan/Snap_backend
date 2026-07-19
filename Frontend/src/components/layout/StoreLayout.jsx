import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import TopHeader from "./TopHeader";

const StoreLayout = () => {
    return (
        <div className="min-h-screen bg-page">
            <TopHeader variant="store" />
            <Navbar variant="store" showCategoryBar={false} />
            <Outlet />
        </div>
    );
};

export default StoreLayout;
