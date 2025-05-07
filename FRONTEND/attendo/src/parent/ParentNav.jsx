import React, { useState,useEffect } from "react";
import { FaBars, FaTimes, FaExclamationTriangle, FaBell } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ParentNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchCounts = async (parentId, studentId) => {
    if (!parentId || !studentId) return;
    
    try {
      const notificationsRes = await axios.get(
        `http://127.0.0.1:8000/api/notifications/parent/${parentId}/?student_id=${studentId}`
      );
      const filteredNotifications = notificationsRes.data.filter(
        n => n.type === "absent" || n.type === "absent_3_days"
      );
      setNotificationCount(filteredNotifications.length);


    //   const alertsRes = await axios.get(
    //     `http://127.0.0.1:8000/api/parent-alerts/${parentId}/?student_id=${studentId}`
    //   );
    //   const filteredAlerts = alertsRes.data.filter(
    //     n => n.type === "alert" || n.type === "warning"
    //   );
    //   setAlertCount(filteredAlerts.length);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    const parentId = localStorage.getItem("parent_id");
    const studentId = localStorage.getItem("student_id");
    if (parentId && studentId) {
      fetchCounts(parentId, studentId);
    }

    const intervalId = setInterval(() => {
      if (parentId && studentId) {
        fetchCounts(parentId, studentId);
      }
    }, 100000);

  }, []);


  const handleNotification = (path) => {
    const selectedStudentId = localStorage.getItem("student_id");
    if (!selectedStudentId) {
      alert("Please select a ward to view notifications or alerts.");
    } else {
      navigate(path);
    }
  };

  const handleAlerts = (path) => {
    const selectedStudentId = localStorage.getItem("student_id");
    if (!selectedStudentId) {
      alert("Please select a ward to view notifications or alerts.");
    } else {
      navigate(path);
    }
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
        <Link to="/parent/Dash" className="hover:text-gray-400 flex items-center">
          <MdAdminPanelSettings className="mr-2" /> Dashboard
        </Link>
        <button
          onClick={() => handleNotification("/parent/notifications")}
          className="hover:text-gray-400 flex items-center relative"
        >
          <FaBell className="mr-2" /> Notifications
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full h-4 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <button
          onClick={() => handleAlerts("/parent/alerts")}
          className="hover:text-gray-400 flex items-center relative"
        >
          <FaExclamationTriangle className="mr-2" /> Alerts
          {/* {alertCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full h-4 w-5 flex items-center justify-center">
              {alertCount}
            </span>
          )} */}
        </button>
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
        {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Mobile Menu */}
      {sidebarOpen && (
        <div className="absolute top-16 h-screen w-64 left-0 bg-blue-950 text-white flex flex-col py-10 px-4 space-y-4 shadow-md lg:hidden">
          <Link
            to="/parent/Dash"
            className="flex items-center py-3 px-4 hover:text-black rounded hover:bg-gray-400"
          >
            <MdAdminPanelSettings className="mr-2" /> Dashboard
          </Link>
          <button
            onClick={() => handleNotification("/parent/notifications")}
            className="flex items-center py-3 px-4 hover:text-black rounded hover:bg-gray-400"
          >
            <FaBell className="mr-2" /> Notifications
            {notificationCount > 0 && (
              <span className="ml-2 bg-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleAlerts("/parent/alerts")}
            className="hover:text-black rounded hover:bg-gray-400 flex items-center py-3 px-4"
          >
            <FaExclamationTriangle className="mr-2" /> Alerts
            {/* {alertCount > 0 && (
              <span className="ml-2 bg-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alertCount}
              </span>
            )} */}
          </button>
          <button className="lg:hidden bg-white text-black w-full py-2 mt-4 rounded-md hover:bg-gray-200"
            onClick={handleLogout}>
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default ParentNav;