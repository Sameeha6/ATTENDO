import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdClose, MdAccessTime } from "react-icons/md";
import moment from "moment";

const AlertPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const parentId = localStorage.getItem("parent_id");
    const studentId = localStorage.getItem("student_id");

    if (parentId && studentId) {
      fetchNotifications(parentId, studentId);
    }
  }, []);

  const fetchNotifications = (parentId, studentId) => {
    axios
      .get(`http://127.0.0.1:8000/api/parent-alerts/${parentId}/?student_id=${studentId}`)
      .then((response) => {
        const filteredNotifications = response.data.filter(
          (notification) => notification.type === "alert" || notification.type === "warning"
        );
  
        // New: Keep only one alert and one warning per day
        const uniqueNotifications = [];
        const seenAlerts = new Set();
        const seenWarnings = new Set();
  
        filteredNotifications.forEach((notification) => {
          const dateKey = moment(notification.timestamp).format("YYYY-MM-DD");
  
          if (notification.type === "alert" && !seenAlerts.has(dateKey)) {
            uniqueNotifications.push(notification);
            seenAlerts.add(dateKey);
          } else if (notification.type === "warning" && !seenWarnings.has(dateKey)) {
            uniqueNotifications.push(notification);
            seenWarnings.add(dateKey);
          }
        });
  
        setNotifications(uniqueNotifications);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };
  
  const handleDeleteNotification = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (confirmDelete) {
      axios
        .delete(`http://127.0.0.1:8000/api/alert-delete/${id}/`)
        .then(() => {
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
          );
        })
        .catch((error) => {
          console.error("Error deleting notification:", error);
        });
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 pt-2 bg-gray-50 overflow-x-hidden">

      <div className="pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">ALERTS</h1>
        <p className="text-xs sm:text-sm text-gray-500">Updates regarding your ward's attendance</p>
      </div>

      <div className="space-y-4 ">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 bg-white border-l-4 border-red-500 rounded-lg shadow-sm flex items-start justify-between"
          >
            <button
              className="mr-2 sm:mr-3 text-gray-400 hover:text-gray-600 shrink-0"
              onClick={() => handleDeleteNotification(notification.id)}
            >
              <MdClose size={18} />
            </button>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">

                <span className="font-bold text-gray-800 text-sm sm:text-base">
                  {notification.type === "alert" ? "ALERT: Attendance Below 75%" : "WARNING: Attendance Close to 75%"}
                </span>

                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                  <MdAccessTime size={16} className="mr-1" />
                  {notification.timestamp && moment(notification.timestamp).format("h:mm A, D MMM YYYY")}
                  {notification.type === "alert" && notification.hour !== null && (
                    <span className="ml-2">| Hour {notification.hour}</span>
                  )}
                </div>
              </div>

              <div className="text-gray-600 mt-1 text-xs sm:text-sm">
                {notification.message || "No message found"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPage;