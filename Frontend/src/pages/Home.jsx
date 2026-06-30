import { useState } from "react";
import Login from "./auth/login";
const Home = () => {
  return (
    <>
            <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <div className="h-16 bg-red-600"></div>

            {/* Banner */}
            <div className="h-80 bg-gray-300 flex items-center justify-center">
                Banner
            </div>

            {/* Products */}
            <div className="grid grid-cols-5 gap-4 p-8">
                <p>Product</p>
            </div>
            </div>
        <Login/>
    </>
  );
};

export default Home;