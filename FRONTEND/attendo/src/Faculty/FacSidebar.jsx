import React, { useState,useEffect } from "react";
import {FaBars,FaTimes,FaHistory,FaChartBar,FaExclamationTriangle, FaBell,} from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

function Facultybar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };

    useEffect(() => {
      fetchNotificationCount();
    }, []);
  
    const fetchNotificationCount = () => {
      const facultyId = localStorage.getItem("faculty_id");
      Promise.all([
        axios.get("http://127.0.0.1:8000/api/request-hour-change/"),
        axios.get(`http://127.0.0.1:8000/api/facultyhourreq/${facultyId}/`)
      ])
      .then(([hourChangeRes, editRes]) => {
        const count = hourChangeRes.data.length + editRes.data.notifications.length;
        setNotificationCount(count);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
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
        <Link to="/faculty/Dash" className="hover:text-gray-400 flex items-center">
          <FaChartBar className="mr-2" /> Dashboard
        </Link>
        <Link to="/faculty/notification" className="hover:text-gray-400 flex items-center relative">
        <FaBell className="mr-2" /> Notifications
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-400 text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Link>
        <Link to="/faculty/history" className="hover:text-gray-400 flex items-center">
          <FaHistory className="mr-2" /> History
        </Link>
        <Link to="/faculty/reports" className="hover:text-gray-400 flex items-center">
          <FaChartBar className="mr-2" /> Reports
        </Link>
        <button className="hidden lg:block border-2 border-white px-4 py-2 hover:border-orange-200 rounded-md hover:text-orange-200 font-semibold"
          onClick={handleLogout}>
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
          <Link to="/faculty/Dash" className="hover:text-black rounded flex items-center py-3 px-4 hover:bg-gray-400">
            <FaChartBar className="mr-2" /> Dashboard
          </Link>
          <Link to="/faculty/notification" className="hover:text-black rounded flex items-center py-2 px-4 hover:bg-gray-400">
            <FaBell className="mr-2" /> Notifications
            {notificationCount > 0 && (
              <span className="ml-auto bg-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Link>
          <Link to="/faculty/history" className="hover:text-black rounded flex items-center py-2 px-4 hover:bg-gray-400">
            <FaHistory className="mr-2" /> History
          </Link>
          <Link to="/faculty/reports" className="hover:text-black rounded flex items-center py-2 px-4 hover:bg-gray-400">
            <FaChartBar className="mr-2" /> Reports
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

export default Facultybar;