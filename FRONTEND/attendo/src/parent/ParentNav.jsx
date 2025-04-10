import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHistory,
  FaChartBar,
  FaExclamationTriangle,
  FaBell,
  FaFileAlt,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";

function ParentNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="bg-blue-950 text-white p-4 px-6 flex justify-between items-center shadow-md w-full fixed top-0 z-50">
      {/* Logo & Title */}
      <div className="flex items-center space-x-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
          alt="LOGO"
          className="w-10 h-10"
        />
        <div className="text-2xl font-sans font-bold">AttenDo</div>
      </div>

      {/* Navbar Links */}
      <div className="hidden lg:flex space-x-6 items-center">
        <Link
          to="/parent/Dash"
          className="hover:text-gray-400 flex items-center"
        >
          <MdAdminPanelSettings className="mr-2" /> Dashboard
        </Link>
        {/* <Link
          to="/parent/reports"
          className="hover:text-gray-400 flex items-center"
        >
          <FaFileAlt className="mr-2" /> Reports
        </Link> */}
        <Link
          to="/parent/notifications"
          className="hover:text-gray-400 flex items-center"
        >
          <FaBell className="mr-2" />
          Notifications
        </Link>
        <Link
          to="/parent/alerts"
          className="hover:text-gray-400 flex items-center"
        >
          <FaExclamationTriangle className="mr-2" /> Alerts
        </Link>
        {/* Logout Button */}
        <button className="bg-white px-4 py-2 text-black rounded-md hover:bg-gray-200 hover:text-sky-600 font-semibold">
          Log Out
        </button>
      </div>

      {/* Hamburger Menu */}
      <button
        className="lg:hidden bg-white p-2 rounded-md text-black hover:bg-gray-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Mobile Menu */}
      {sidebarOpen && (
        <div className="absolute top-16 h-screen w-64 left-0  bg-blue-950 text-white flex flex-col py-10 px-4 space-y-4 shadow-md lg:hidden">
          <Link
            to="/parent/Dash"
            className="flex items-center py-3 px-4 hover:text-black rounded  hover:bg-gray-400"
          >
            <MdAdminPanelSettings className="mr-2" /> Dashboard
          </Link>
          {/* <Link
            to="/parent/reports"
            className=" flex items-center py-3 px-4 hover:text-black rounded  hover:bg-gray-400"
          >
            <FaFileAlt className="mr-2" /> Reports
          </Link> */}
          <Link
            to="/parent/notifications"
            className="flex items-center py-3 px-4 hover:text-black rounded  hover:bg-gray-400 "
          >
            <FaBell className="mr-2" />
            Notifications
          </Link>
          <Link
            to="/parent/alerts"
            className="hover:text-black rounded  hover:bg-gray-400  flex items-center py-3 px-4"
          >
            <FaExclamationTriangle className="mr-2" /> Alerts
          </Link>
          <button className="lg:hidden bg-white text-black w-full py-2 mt-4 rounded-md hover:bg-gray-200">
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default ParentNav;
