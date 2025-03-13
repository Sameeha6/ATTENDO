import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../components/Footer";
import ParentNav from "../parent/ParentNav";
import AlertPage from "../parent/Alert";
import NotificationPage from "../parent/Notification";
import ParentDashboard from "../parent/ParentDashboard";
import Report from "../parent/ViewReport";
function ParentRoutes() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <ParentNav />

      {/* Main Content */}
      <div className="flex-grow overflow-hidden p-6 bg-gray-100 pt-20">
        {/* Added pt-20 to prevent content from being hidden under fixed navbar */}
        <Routes>
          <Route path="/Dash" element={<ParentDashboard />} />
          <Route path="/alerts" element={<AlertPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/reports/:ward" element={<Report />} />
        </Routes>
      </div>

      {/* Footer */}
      {/* <Footer className="w-full bg-blue-900 text-white text-center" /> */}
    </div>
  );
}

export default ParentRoutes;
