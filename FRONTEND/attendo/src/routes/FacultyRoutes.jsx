import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../components/Footer";
import Facultybar from "../Faculty/FacSidebar";
import TakeAttendance from "../Faculty/TakeAttendance";
import WelcomePg from "../Faculty/Welcompg";
import FacultyDashboard from "../Faculty/FacDashboard";
import FacHistory from "../Faculty/History";
import Notifications from "../Faculty/Notification";

function FacultyRoutes() {


  return (
    <div className="min-h-screen flex flex-col">
      <Facultybar/>
      <div className="flex-grow p-4 mt-4">
        <Routes>
          <Route path="/Dash" element={<WelcomePg />} />
          <Route path="/Dashboard" element={<FacultyDashboard />} />
          <Route path="/take-attendance" element={<TakeAttendance />} />
          <Route path="/history" element={<FacHistory />} />
          <Route path="/notification" element={<Notifications/>} />
        </Routes>
      </div>
      {/* <Footer className="w-full bg-blue-900 text-white text-center" /> */}
    </div>
  );
}

export default FacultyRoutes;