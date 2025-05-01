import React, { useState } from "react";
import {FaBars,FaTimes,FaHistory,FaChartBar,FaExclamationTriangle,} from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";

function StudentNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <nav className="bg-blue-950 text-white p-4 px-6 flex justify-between items-center shadow-md w-full fixed top-0 z-50">
      <div className="flex items-center space-x-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
          alt="LOGO"
          className="w-10 h-10"
        />
        <div className="text-2xl font-sans font-bold">AttenDo</div>
      </div>

      <div className="hidden lg:flex space-x-6 items-center">
        <Link to="/student/student/studentDash" className="hover:text-gray-400 flex items-center">
          <FaChartBar className="mr-2" /> Dashboard
        </Link>
        <Link to="/student/student/student/alerts" className="hover:text-gray-400 flex items-center">
          <FaExclamationTriangle className="mr-2" /> Alerts
        </Link>
        <button className="hidden lg:block border-2 border-white px-4 py-2 hover:border-orange-200 rounded-md hover:text-orange-200 font-semibold"
          onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <button
        className="lg:hidden bg-white p-2 rounded-md text-black hover:bg-gray-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars className="text-xl" />
      </button>

      {sidebarOpen && (
        <div className="absolute top-16 h-screen w-64 left-0  bg-blue-950 text-white flex flex-col py-10 px-4 space-y-4 shadow-md lg:hidden">
          <Link to="/student/student/studentDash" className="hover:text-black rounded flex items-center py-3 px-4 hover:bg-gray-400">
            <FaChartBar className="mr-2" /> Dashboard
          </Link>
          <Link to="/student/student/student/alerts" className="hover:text-black rounded flex items-center py-3 px-4 hover:bg-gray-400">
            <FaExclamationTriangle className="mr-2" /> Alerts
          </Link>
          <button className="bg-white px-4 py-2 text-black rounded-md hover:bg-gray-200 hover:text-sky-600"
            onClick={handleLogout}>
            Log Out
        </button>
        </div>
      )}
    </nav>
  );
}

export default StudentNav;