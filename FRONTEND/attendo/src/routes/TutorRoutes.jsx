import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../components/Footer";
import Tutorbar from "../Tutor/TutorSidebar";
import TutorDashboard from "../Tutor/TutorDashboard";
import ManageFaculties from "../Tutor/ManageFaculty";
import ManageParents from "../Tutor/ManageParent";
import ManageStudents from "../Tutor/ManageStudent";
import Timetable from "../Tutor/ManageTimetable";

function TutorRoutes() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      
      {/* Navbar & Sidebar */}
      <Tutorbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content & Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar: Ensure it takes space correctly */}
        <div className={`transition-all ${sidebarOpen ? "w-0" : "w-64 hidden lg:block"}`} />

        {/* Content */}
        <div className="flex-grow overflow-auto p-4 bg-gray-100">
          <Routes>
            <Route path="/tutorDash" element={<TutorDashboard/>} />
            <Route path="tutor/manage-faculties" element={<ManageFaculties />} />
            <Route path="tutor/manage-parents" element={<ManageParents />} />
            <Route path="tutor/manage-students" element={<ManageStudents />} />
            <Route path="tutor/manage-timetable" element={<Timetable />} />
          </Routes>
        </div>
      </div>

      {/* Footer: Fixed at full width */}
      <Footer className="w-full bg-blue-900 text-white text-center" />
    </div>
  );
}

export default TutorRoutes;