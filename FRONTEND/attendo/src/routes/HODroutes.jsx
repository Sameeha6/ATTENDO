import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Footer from "../components/Footer";

function AdminRoutes() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      
      {/* Navbar & Sidebar */}
      <NavbarAndSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content & Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar: Ensure it takes space correctly */}
        <div className={`transition-all ${sidebarOpen ? "w-0" : "w-64 hidden lg:block"}`} />

        {/* Content */}
        <div className="flex-grow overflow-auto p-6 bg-gray-100">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* <Route path="/admin/manage-branch" element={<ManageBranch />} />
            <Route path="/admin/manage-semester" element={<ManageClass />} />
            <Route path="/admin/manage-hod" element={<ManageHOD />} />
            <Route path="/admin/manage-tutor" element={<ManageTutor />} />
            <Route path="/admin/manage-faculties" element={<ManageFaculties />} />
            <Route path="/admin/manage-parents" element={<ManageParents />} />
            <Route path="/admin/manage-students" element={<ManageStudents />} /> */}
          </Routes>
        </div>
      </div>

      {/* Footer: Fixed at full width */}
      <Footer className="w-full bg-blue-900 text-white text-center" />
    </div>
  );
}

export default AdminRoutes;