import React, { useState } from "react";
import NavbarAndSidebar from "../admin/AdminSidebar";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../admin/Dashboard";
import Footer from "../components/Footer";
import ManageBranch from "../admin/ManageBranch";
import ManageClass from "../admin/ManageClass";
import ManageHOD from "../admin/ManageHOD";
import ManageTutor from "../admin/ManageTutor";
import ManageFaculties from "../admin/ManageFaculty";
import ManageParents from "../admin/ManageParent";
import ManageStudents from "../admin/ManageStudents";

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
            <Route path="/admin/admin" element={<AdminDashboard />} />
            <Route path="/admin/admin/manage-branch" element={<ManageBranch />} />
            <Route path="/admin/admin/manage-semester" element={<ManageClass />} />
            <Route path="/admin/admin/manage-hod" element={<ManageHOD />} />
            <Route path="/admin/admin/manage-tutor" element={<ManageTutor />} />
            <Route path="/admin/admin/manage-faculties" element={<ManageFaculties />} />
            <Route path="/admin/admin/manage-parents" element={<ManageParents />} />
            <Route path="/admin/admin/manage-students" element={<ManageStudents />} />
          </Routes>
        </div>
      </div>

      {/* Footer: Fixed at full width */}
      {/* <Footer className="w-full bg-blue-900 text-white text-center" /> */}
    </div>
  );
}

export default AdminRoutes;