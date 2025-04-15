import React, { useState, useEffect } from "react";
import { MdClose, MdAccessTime } from "react-icons/md";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    axios
      .get("http://127.0.0.1:8000/api/request-hour-change/")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the notifications:", error);
      });
  };

  // ✅ Handle deleting a notification
  const handleDeleteNotification = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/request-delete/${id}/`) // Backend delete URL with pk
      .then(() => {
        // Remove it from local state
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen p-2 mt-12">
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mt-2">NOTIFICATIONS</h1>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 bg-white border-l-4 rounded-lg shadow-sm flex items-start justify-between ${
              notification.status === "Approved"
                ? "border-l-green-500"
                : notification.status === "Rejected"
                ? "border-l-red-500"
                : "border-l-yellow-500"
            }`}
          >
            <button
              className="mr-3 text-gray-400 hover:text-gray-600"
              onClick={() => handleDeleteNotification(notification.id)} // 👈 Trigger delete
            >
              <MdClose size={18} />
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">
                  REQUEST {notification.status.toUpperCase()}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <MdAccessTime size={16} className="mr-1" />
                  {new Date(notification.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                  ,{" "}
                  {new Date(notification.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="text-gray-600 mt-1">
                Your request to take{" "}
                {notification.timetable_entry.subject} at{" "}
                {notification.timetable_entry.day}{" "}
                {notification.timetable_entry.time} is{" "}
                {notification.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
