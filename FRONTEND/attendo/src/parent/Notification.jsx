import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdClose, MdAccessTime } from "react-icons/md";
import moment from "moment";

const NotificationPage = () => {
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
      .get(`http://127.0.0.1:8000/api/notifications/parent/${parentId}/?student_id=${studentId}`)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  const handleDeleteNotification = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (confirmDelete) {
      axios
        .delete(`http://127.0.0.1:8000/api/notification-delete/${id}/`)
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
      {/* Header */}
      <div className="pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">NOTIFICATIONS</h1>
        <p className="text-xs sm:text-sm text-gray-500">Updates regarding your ward's attendance</p>
      </div>

      {/* Notification List */}
      <div className="space-y-4 overflow-y-auto max-h-[80vh]">
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
                {/* Updated Heading based on type */}
                <span className="font-bold text-gray-800 text-sm sm:text-base">
                  {notification.type === "absent_3_days" ? "ABSENT FOR 3 CONSECUTIVE DAYS" : "ABSENT"}
                </span>

                {/* Timestamp + Hour (if applicable) */}
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                  <MdAccessTime size={16} className="mr-1" />
                  {notification.timestamp && moment(notification.timestamp).format("h:mm A, D MMM YYYY")}
                  {notification.type === "absent" && notification.hour !== null && (
                    <span className="ml-2">| Hour {notification.hour}</span>
                  )}
                </div>
              </div>

              {/* Message */}
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

export default NotificationPage;