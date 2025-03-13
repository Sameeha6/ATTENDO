import React from "react";
import { MdClose, MdAccessTime } from "react-icons/md";

const AlertPage = () => {
  return (
    <div className="bg-gray-50 font-sans min-h-screen p-6 pt-1">
      {/* Header Section */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mt-2">ALERTS</h1>
        <p className="text-sm text-gray-500">
          Important alerts regarding your attendance
        </p>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {/* Alert Item */}
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 bg-white border-l-4 rounded-lg shadow-sm flex items-start justify-between ${alert.borderColor}`}
          >
            <button className="mr-3 text-gray-400 hover:text-gray-600">
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
        ))}
      </div>
    </div>
  );
};

const alerts = [
  {
    sender: "ALERT",
    time: "10:45 AM, 24 Feb 2025",
    message:
      "Your attendance has fallen below the required 75%. Immediate action is needed to avoid academic penalties.",
    borderColor: "border-red-500",
  },
  {
    sender: "WARNING",
    time: "10:30 AM, 24 Feb 2025",
    message:
      "Your attendance is close to falling below the required 75%. Ensure regular attendance to stay compliant.",
    borderColor: "border-yellow-500",
  },
];

export default AlertPage;
