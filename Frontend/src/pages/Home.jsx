import { useState } from "react";
import Login from "./auth/login";
import TopHeader from "../components/layout/TopHeader";
import Navbar from "../components/layout/Navbar";
const Home = () => {
    const [showLogin,setShowLogin] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
        {/* Top Header*/}
        <TopHeader/>
        {/* Navbar */}
        <Navbar onLoginClick={()=> setShowLogin(true)}/>
         { showLogin && <Login onClose ={() => setShowLogin(false)} />}      
                
        {/* Banner */}
            <div className="h-80 flex items-center justify-center">
                
                    <img src="/banner1.jpg" className="w-full h-full object-cover"/>
                
            </div>

        {/* Products */}
            <div className="grid grid-cols-5 gap-4 p-8">
                <p>Product</p>
            </div>
        </div>
    );
};

export default Home;