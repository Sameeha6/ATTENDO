import React, { useEffect, useState } from "react";
import { MdClose, MdAccessTime } from "react-icons/md";
import axios from "axios";

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const studentId = localStorage.getItem("student_id");
  
        if (!studentId) {
          throw new Error("Student ID not found in localStorage");
        }
  
        const response = await axios.get(
          `http://127.0.0.1:8000/api/student/attendance-notifications/?student_id=${studentId}`
        );
  
        if (response.data.status === "success") {
          const uniqueAlerts = [];
  
          const seenDates = new Set();
  
          response.data.notifications.forEach(notification => {
            const datePart = notification.timestamp.split(", ")[1]; // '02 May 2025'
  
            // Add only one notification per date
            if (!seenDates.has(datePart)) {
              uniqueAlerts.push({
                id: notification.id,
                sender: notification.type.toUpperCase(),
                time: notification.timestamp,
                message: notification.message,
                borderColor: getBorderColor(notification.type),
                isRead: notification.is_read
              });
              seenDates.add(datePart);
            }
          });
  
          setAlerts(uniqueAlerts);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAlerts();
  }, []);
  

  const getBorderColor = (type) => {
    switch (type) {
      case "alert":
        return "border-red-500";
      case "warning":
        return "border-yellow-500";
      case "absent_3_days":
        return "border-orange-500";
      default:
        return "border-gray-500";
    }
  };

  const handleDismiss = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/student/delete-notification/${id}/`);
      setAlerts(alerts.filter(alert => alert.id !== id));
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-gray-50 font-sans min-h-screen pt-14 pr-6 pl-6">
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mt-6">ALERTS</h1>
          <p className="text-sm text-gray-500">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 font-sans min-h-screen pt-14 pr-6 pl-6">
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mt-6">ALERTS</h1>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans min-h-screen pt-14 pr-6 pl-6">
      {/* Header Section */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mt-6">ALERTS</h1>
        <p className="text-sm text-gray-500">Important alerts regarding your attendance</p>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500">
            No alerts to display
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 bg-white border-l-4 rounded-lg shadow-sm flex items-start justify-between ${alert.borderColor} ${
                alert.isRead ? "opacity-75" : ""
              }`}
            >
              <button 
                className="mr-3 text-gray-400 hover:text-gray-600"
                onClick={() => handleDismiss(alert.id)}
              >
                <MdClose size={18} />
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">{alert.sender}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <MdAccessTime size={16} className="mr-1" />
                    {alert.time}
                  </div>
                </div>
                <div className="text-gray-600 mt-1">{alert.message}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertPage;