import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../components/Footer";
import HodDashboard from "../HOD/HodDashboard";
import Hodbar from "../HOD/HodSidebar";

function HodRoutes() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      
      {/* Navbar & Sidebar */}
      <Hodbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content & Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar: Ensure it takes space correctly */}
        <div className={`transition-all ${sidebarOpen ? "w-0" : "w-64 hidden lg:block"}`} />

        {/* Content */}
        <div className="flex-grow overflow-auto p-6 bg-gray-100">
          <Routes>
            <Route path="/hodDash" element={<HodDashboard />} />
          </Routes>
        </div>
      </div>

      {/* Footer: Fixed at full width */}
      <Footer className="w-full bg-blue-900 text-white text-center" />
    </div>
  );
}

export default HodRoutes;