import React, { useState, useEffect } from "react";
import { MdClose, MdAccessTime } from "react-icons/md";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    const facultyId = localStorage.getItem("faculty_id");
    Promise.all([
      axios.get("http://127.0.0.1:8000/api/request-hour-change/"),
      axios.get(`http://127.0.0.1:8000/api/facultyhourreq/${facultyId}/`)
    ])
      .then(([hourChangeRes, editRes]) => {
        const hourChangeNotifications = hourChangeRes.data;
        const attendanceEditNotifications = editRes.data.notifications.map((n) => ({
          id: n.id,
          created_at: new Date().toISOString(),
          timetable_entry: {
            subject: `Attendance edit for ${n.student}`,
            day: n.date,
            time: n.hour,
          },
          status: n.status,
          type: "attendance-edit",
        }));
        const mergedNotifications = [...hourChangeNotifications, ...attendanceEditNotifications];
        setNotifications(mergedNotifications);
      })
      .catch((error) => {
        console.error("There was an error fetching the notifications:", error);
      });
  };

  const handleDeleteNotification = (id, type) => {
    const url =
      type === "attendance-edit"
        ? `http://127.0.0.1:8000/api/facultyhourreq-delete/${id}/`
        : `http://127.0.0.1:8000/api/request-delete/${id}/`;

    axios
      .delete(url)
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen p-4 sm:p-6 pt-2 overflow-x-hidden mt-12">
      {/* Header */}
      <div className="pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">NOTIFICATIONS</h1>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-gray-500 text-center mt-10 text-sm sm:text-base">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 sm:p-4 bg-white border-l-4 rounded-lg shadow-sm flex items-start justify-between ${
                notification.status === "Approved"
                  ? "border-l-green-500"
                  : notification.status === "Rejected"
                  ? "border-l-red-500"
                  : "border-l-yellow-500"
              }`}
            >
              <button
                className="mr-2 sm:mr-3 text-gray-400 hover:text-gray-600 shrink-0"
                onClick={() => handleDeleteNotification(notification.id, notification.type)}
              >
                <MdClose size={18} />
              </button>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-bold text-gray-800 text-sm sm:text-base">
                    REQUEST {notification.status.toUpperCase()}
                  </span>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
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

                <div className="text-gray-600 mt-1 text-xs sm:text-sm">
                  {notification.type === "attendance-edit" ? (
                    <>
                      Your request to edit attendance of {notification.timetable_entry.subject} on{" "}
                      {notification.timetable_entry.day} during {notification.timetable_entry.time} is{" "}
                      {notification.status.toUpperCase()}
                    </>
                  ) : (
                    <>
                      Your request to take {notification.timetable_entry.subject} at{" "}
                      {notification.timetable_entry.day} {notification.timetable_entry.time} is{" "}
                      {notification.status.toUpperCase()}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
