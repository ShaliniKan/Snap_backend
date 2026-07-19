import { Outlet } from "react-router-dom";
import HomeFooter from "./HomeFooter";
import Navbar from "./Navbar";
import TopHeader from "./TopHeader";

const HomeLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <TopHeader />
            <Navbar />
            <Outlet />
            <HomeFooter />
        </div>
    );
};

export default HomeLayout;
